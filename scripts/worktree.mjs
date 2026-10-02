// Create (or reuse) a ready-to-work git worktree for a branch.
//
//   pnpm worktree feat/my-change          # -> .claude/worktrees/feat-my-change, on origin/main, deps installed
//   pnpm worktree --remove feat/my-change # after the PR is merged or abandoned
//
// Worktrees always live in <repo>/.claude/worktrees/<branch-with-dashes> (gitignored), never in /tmp or
// the scratchpad. Reuses an existing worktree for the branch, installs with the frozen lockfile and
// refuses a pnpm that isn't v10 (pnpm 11 ignores the `pnpm` field in package.json).
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', stdio: opts.inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'], ...opts })
const git = (...args) => run('git', args).trim()
const die = msg => { console.error(msg); process.exit(1) }

const remove = process.argv.includes('--remove')
const branch = process.argv.slice(2).find(a => !a.startsWith('--'))
if (!branch) die('usage: pnpm worktree [--remove] <branch>   e.g. pnpm worktree feat/my-change')
if (branch === 'main') die('Never work on main: pick a feature branch name.')

// The main checkout's root, even when invoked from inside another worktree.
const root = dirname(resolve(git('rev-parse', '--path-format=absolute', '--git-common-dir')))
const dir = join(root, '.claude', 'worktrees', branch.replace(/[/\\]/g, '-'))

if (remove) {
  run('git', ['-C', root, 'worktree', 'remove', dir], { inherit: true })
  console.log(`Removed ${dir}. Delete the branch with: git branch -D ${branch}`)
  process.exit(0)
}

const pnpmMajor = Number(run('pnpm', ['--version']).trim().split('.')[0])
if (pnpmMajor !== 10) die(`pnpm ${pnpmMajor} found; this repo needs pnpm 10 (mise install).`)

if (!existsSync(dir)) {
  console.log('Fetching origin...')
  run('git', ['-C', root, 'fetch', 'origin', '--quiet'])
  const exists = ref => { try { git('-C', root, 'rev-parse', '--verify', '--quiet', ref); return true } catch { return false } }
  const args = exists(`refs/heads/${branch}`) ? ['worktree', 'add', dir, branch]
    : exists(`refs/remotes/origin/${branch}`) ? ['worktree', 'add', dir, '-b', branch, `origin/${branch}`]
      : ['worktree', 'add', dir, '-b', branch, 'origin/main']
  run('git', ['-C', root, ...args], { inherit: true })
} else {
  console.log(`Reusing ${dir}`)
}

if (!existsSync(join(dir, 'node_modules'))) run('pnpm', ['install', '--frozen-lockfile'], { cwd: dir, inherit: true })
console.log(`\nReady: ${dir}\n  cd ${dir}`)
