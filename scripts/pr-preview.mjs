// Push the current branch, open the PR and print the Firebase preview URL as soon as CI posts it.
//
//   pnpm pr:preview --title "fix: ..." --body-file body.md   # first run: creates the PR
//   pnpm pr:preview                                          # later runs: re-push and print the URL
//   pnpm pr:preview --no-wait                                # skip waiting for the preview
//
// UI and perf fixes: run this as soon as the code compiles and the basic checks pass, report the URL,
// and measure afterwards. The guards below back the rules in CLAUDE.md: the branch must be rebased on
// origin/main, no commit may carry a Co-Authored-By trailer, the title must be conventional and the PR
// body must be a real description with no "Generated with" footer.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const args = process.argv.slice(2)
const opt = name => { const i = args.indexOf(`--${name}`); return i > -1 ? args[i + 1] : undefined }
const run = (cmd, a, o = {}) => execFileSync(cmd, a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...o }).trim()
const die = msg => { console.error(`pr:preview: ${msg}`); process.exit(1) }

const branch = run('git', ['branch', '--show-current'])
if (!branch || branch === 'main') die('on main (or detached). Work on a feature branch in a worktree: pnpm worktree <branch>')

run('git', ['fetch', 'origin', '--quiet'])
try { run('git', ['merge-base', '--is-ancestor', 'origin/main', 'HEAD']) } catch { die('branch is behind origin/main. Rebase first: git rebase origin/main') }

const messages = run('git', ['log', '--format=%B%x00', 'origin/main..HEAD'])
if (!messages) die('no commits ahead of origin/main.')
if (/^co-authored-by:/im.test(messages)) die('a commit has a Co-Authored-By trailer. Reword it (commit style is in CLAUDE.md).')
try { run('pnpm', ['exec', 'commitlint', '--from', 'origin/main', '--to', 'HEAD']) } catch (e) { die(`commitlint failed:\n${e.stdout || e.message}`) }

let pr = null
try { pr = JSON.parse(run('gh', ['pr', 'view', '--json', 'number,url,title'])) } catch { /* no PR yet */ }

if (!pr) {
  const title = opt('title') || die('first run needs --title "type: summary" and --body-file <file>')
  const bodyFile = opt('body-file') || die('first run needs --body-file <file> with a real description (what, why, how verified)')
  const body = readFileSync(bodyFile, 'utf8')
  if (!/^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)(\([\w-]+\))?!?: \S/.test(title)) die('title must be a conventional-commit subject, e.g. "fix: stop the nav flicker".')
  if (/^\W*generated with \[?claude code/im.test(body) || /^co-authored-by:/im.test(body)) die('PR body has an attribution footer or trailer. Remove it.')
  if (body.trim().split(/\s+/).length < 25) die('PR body is too thin: say what changed, why, and how it was verified.')
  run('git', ['push', '--force-with-lease', '-u', 'origin', 'HEAD'])
  run('gh', ['pr', 'create', '--base', 'main', '--title', title, '--body-file', bodyFile])
} else {
  run('git', ['push', '--force-with-lease', '-u', 'origin', 'HEAD'])
}
pr = JSON.parse(run('gh', ['pr', 'view', '--json', 'number,url']))
console.log(`PR #${pr.number}: ${pr.url}`)
if (args.includes('--no-wait')) process.exit(0)

// action-hosting-deploy comments "Visit the preview URL for this PR ... https://<project>--pr<n>-<branch>-<hash>.web.app"
const sha = run('git', ['rev-parse', '--short', 'HEAD'])
const deadline = Date.now() + 8 * 60_000
process.stdout.write('Waiting for the preview channel (needs typecheck, lint, validate-content, then a build) ')
while (Date.now() < deadline) {
  const comments = JSON.parse(run('gh', ['pr', 'view', String(pr.number), '--json', 'comments', '-q', '.comments'])) || []
  const hit = comments.map(c => c.body).reverse().find(b => /\.web\.app/.test(b) && b.includes(sha))
  if (hit) { console.log(`\nPreview: ${hit.match(/https:\/\/[^\s)\]]+\.web\.app[^\s)\]]*/)[0]}`); process.exit(0) }
  process.stdout.write('.')
  await new Promise(r => setTimeout(r, 15_000))
}
console.log(`\nNo preview comment for ${sha} yet. Check: gh pr checks ${pr.number}`)
process.exit(1)
