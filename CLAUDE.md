# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. `AGENTS.md` is a symlink to it. Detailed, path-specific conventions live in `.claude/rules/` and load when you read matching files. Agents working in a worktree don't get them automatically, so before editing files a rule covers, Read the matching `.claude/rules/*.md`.

## Development Commands

**IMPORTANT: Always use pnpm 10, never npm or yarn** (pinned in `mise.toml` and `packageManager`; pnpm 11 ignores the `pnpm` field in package.json and breaks `--frozen-lockfile`).

```bash
pnpm dev                 # dev server (http://localhost:3000, floating Studio button bottom-left)
pnpm dev:clean           # wipe the SQLite DB first (fixes corruption)
pnpm build               # production build
pnpm generate            # static site into .output/public
pnpm preview             # preview a production build
pnpm typecheck
pnpm lint                # pnpm lint:fix to auto-fix
pnpm validate:content    # scripts/validate-content.ts (also CI and every deploy)
pnpm test:webmcp         # end-to-end WebMCP check: needs a prior `pnpm generate` and Chrome 149+ (CHROME_PATH to override)
pnpm check:images        # every pre-rendered /_ipx/ image URL exists in the build (after generate)
pnpm check:seo           # SEO gate on the static build (after generate; also in CI)
pnpm lighthouse          # Lighthouse CI (lighthouserc.json; also in CI)

# Content formatting: serializes content/ exactly as Nuxt Studio does, so Studio edits never add noise
pnpm content:format        # rewrite content/**/*.{md,yml}
pnpm content:format:check  # exit 1 on any diff or non-round-tripping file (CI + lint-staged); Prettier ignores content/
pnpm content:roundtrip     # after `pnpm generate`: Studio's save of every built DB row must equal the file

# Database (Nuxt Content SQLite)
pnpm db:clean      # remove corrupted SQLite database
pnpm db:rebuild    # clean + regenerate

# Lockfile
pnpm lockfile:check            # lockfile vs package.json
pnpm lockfile:update           # sync and stage
pnpm install --frozen-lockfile # CI-strict install
```

### Serving and measuring a build

```bash
pnpm serve:static     # serves .output/public like Firebase Hosting (trailing-slash 301s, redirects, headers, 404.html, gzip/br) on :5000
pnpm emulate          # generate + the real Firebase hosting emulator at http://127.0.0.1:5000
pnpm measure:nav      # Pixel 7 + Fast 3G + 4x CPU navigation timing (DOM swap vs scroll reset gap, CLS, footer movement)
pnpm measure:nav --url https://allisons.dev   # same against a preview channel or production
```

`measure:nav` uses playwright-core with the system Chrome (`CHROME_PATH` overrides `/usr/bin/google-chrome`) and serves `.output/public` itself unless given `--url`. Run `pnpm generate` first.

### Deployment

Handled by GitHub Actions: production (`https://allisons.dev`) deploys from `main` to Firebase hosting via `pnpm generate`, plus the `studio` 2nd-gen Cloud Function (`pnpm build:studio`, see `STUDIO.md`); staging is a manual `workflow_dispatch`; PRs get a temporary preview channel.

## Architecture Overview

Single-site **developer portfolio** built with Nuxt 4 and deployed to Firebase static hosting.

- **Framework**: Nuxt 4 (SSR with static preset for Firebase) on Node.js 22.x (native SQLite)
- **Content**: `@nuxt/content` v3, file-based Markdown + SQLite
- **UI**: `@nuxt/ui` v4 + Tailwind CSS v4; **Images**: `@nuxt/image`
- **Deploy**: Firebase static hosting via GitHub Actions

```
portfolio/
├── app/                  # pages/, components/, composables/, layouts/, utils/, assets/css/
├── content/              # blog/, projects/ (.md), pages/ and globals/ (.yml)
├── server/               # sitemap source, llms.txt, WebMCP catalog routes
├── modules/              # Nuxt modules (content image sizes)
├── scripts/              # validation, formatting, serve/measure tooling
├── docs/                 # developer docs
├── public/               # static assets (images/og/<slug>.png by convention)
├── .claude/              # rules/, agents/, skills/, settings.json (committed)
├── content.config.ts     # collection schemas
├── nuxt.config.ts
└── firebase.json
```

### Constraints that must not regress

Full detail is in the path-scoped rules; this is the checklist.

- **Content** (`.claude/rules/content.md`): schemas and required fields are enforced only by `pnpm validate:content`. Published items need description (120-165 chars), date, image + imageAlt (projects) or author (posts). `public/images/og/<slug>.png` is referenced by convention: don't delete it as unreferenced.
- **Studio-safe content**: Studio writes the stored DB document back to the file, so never mutate documents in build hooks or add build-time-filled columns; no raw HTML with children in Markdown (use MDC components); avoid `:xx:` in prose. `content:format:check` and `content:roundtrip` catch these.
- **Drafts never ship**: production builds drop drafts from the collections because every row is published in `/__nuxt_content/<collection>/sql_dump.txt`. Edit drafts locally; never set `CONTENT_INCLUDE_DRAFTS=true` for the static build.
- **Hosting, CSP, 404s** (`.claude/rules/hosting-and-build.md`): headers go on documents only; the header CSP has no `script-src` because a per-page `<meta>` CSP carries script hashes (new third-party hosts go in the header or `SCRIPT_SRC_HOSTS`); Firebase serves a generated `404.html`; `experimental.appManifest` must stay on; hosting `ignore` must allow `.well-known`; internal links use the trailing-slash form.
- **SEO and WebMCP** (`.claude/rules/seo-and-webmcp.md`): every page calls `useSiteSeo()` (no ad-hoc `useHead` title/meta); sitemap URLs come from a server source, not collection columns; keep WebMCP tools, `/llms.txt` and `pnpm test:webmcp` in sync.
- **Motion** (`.claude/rules/motion-and-ui.md`): decorative animation is compositor-only (`transform`/`opacity`), and stops under `prefers-reduced-motion` and the in-page toggle.
- **Nuxt Studio**: `https://allisons.dev/_studio` (or Cmd + `.`), GitHub login, only emails in `STUDIO_GITHUB_MODERATORS`; it commits to `main` with your token, which redeploys. In dev, Studio edits write straight to local files. How it works on Firebase: `STUDIO.md`.

## Agent workflow

Rules here are backed by tooling where possible; the tool is named next to the rule.

- **Worktrees**: one per PR branch, always in `.claude/worktrees/<branch-with-dashes>` (gitignored), never in `/tmp` or the scratchpad (no installs or builds there either). `pnpm worktree <branch>` creates one from `origin/main` with dependencies installed (and reuses an existing one); `pnpm worktree --remove <branch>` when merged or abandoned. Never work on `main`. Subagents that write code use `isolation: worktree` (the `site-pr` agent does).
- **pnpm only**: never npm or yarn (denied in `.claude/settings.json`).
- **Commits**: conventional subject, blank line, short description body (what and why). **No `Co-Authored-By` trailer** (commitlint rejects it, locally via the `commit-msg` hook and in CI).
- **PRs**: conventional title, a real description (what, why, how verified, old to new location for moves), **no "Generated with Claude Code" footer**. `pnpm pr:preview --title "..." --body-file body.md` rebases-check, lints the commits, pushes, opens the PR and prints the preview URL.
- **Perf and UI fixes**: preview first, measure after. As soon as the code compiles and the basic checks pass (about 15 minutes), run `pnpm pr:preview` and report the URL; then measure (`pnpm measure:nav`, one Lighthouse run, not three; CI Lighthouse covers the rest). One variant per PR: for alternatives, open separate quick previews instead of comparing locally.
- **Merging**: UI PRs wait for Allison's OK on the preview. Before any merge: `git fetch && git rebase origin/main` (`pr:preview` refuses a branch that is behind), re-run typecheck, lint and generate, push with `--force-with-lease`, `gh pr checks --watch` until green, then `gh pr merge --squash`. Don't merge with red CI.
- **After merge**: watch "Deploy to Production" (`gh run list --branch main`, `gh run watch <id>`), then verify production per the `verify-site` skill, with a cache-busting `?v=<sha>` since HTML is cached for an hour. Remove the worktree.
- **Processes**: start servers so you know the PID (`cmd & echo $!`) and kill by PID only (`kill <pid>`). Never `pkill`, `killall` or `fuser -k` (denied in `.claude/settings.json`); other agents' servers are running too. `pnpm serve:static` and `pnpm measure:nav` clean up after themselves.
- **Research artifacts are never committed**: `.claude/project-dossiers/`, `.claude/build-logs/`, `.claude/site-launch-plan.md`, `.claude/settings.local.json` (gitignored). Committed under `.claude/`: `rules/`, `agents/`, `skills/`, `settings.json`.
- **Blocked by the permission classifier**: stop and report what was blocked and why it mattered. Don't try another route around it.
- **Parallel agents**: other agents work other PRs at the same time. Keep your diff scoped to your PR; resolve rebase conflicts keeping both sides' intent. Claude in Chrome is shared: open your own tab and close it when done; never trigger alert/confirm dialogs.
- **Delegation**: orchestrate with subagents to keep the main context for decisions. Subagents default to Sonnet (set `model` explicitly); Opus only for genuinely hard investigation or architecture calls. Agents in `.claude/agents/`: `site-pr` (implement and open one PR) and `project-explorer` (deep-dive one project before writing its page; one per project).
- **Verify**: every site change goes through the `verify-site` skill, including the real-browser checks (Claude in Chrome); that step is not optional.
- Lint-staged's Prettier hook reformats `pnpm-lock.yaml`; if you change deps, regenerate with pnpm and make sure the committed lockfile passes `--frozen-lockfile`.

## Troubleshooting

- **`no such table: _content_blog` or similar in `pnpm dev`**: SQLite corruption during HMR. `pnpm dev:clean` (`.data/` is gitignored and regenerated).
- **Port conflict**: Nuxt auto-selects the next free port.
- **TypeScript errors after updates**: `pnpm typecheck`. **Lint failures**: `pnpm lint:fix`.
- **`validate:content` fails**: fix the reported `file:field` (see `.claude/rules/content.md`).
- **Lockfile out of sync / Firebase deploy fails with "lockfile is out of sync"**: `pnpm lockfile:update`, then commit `package.json` and `pnpm-lock.yaml`; or from scratch `rm pnpm-lock.yaml && pnpm install`.
