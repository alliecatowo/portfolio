# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Local Development

```bash
# Start development server
pnpm dev

# Start with a clean database (fixes SQLite corruption)
pnpm dev:clean
```

### Build Commands

**IMPORTANT: Always use pnpm, not npm**

```bash
# Build for production
pnpm build

# Generate static site
pnpm generate

# Preview production build
pnpm preview

# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# Database Management (Nuxt Content SQLite)
pnpm db:clean      # Remove corrupted SQLite database
pnpm db:rebuild    # Clean + regenerate database

# Lockfile Management
pnpm lockfile:check   # Check lockfile vs package.json
pnpm lockfile:update  # Sync lockfile and stage for commit
pnpm install --frozen-lockfile  # CI-strict install
```

### Firebase Emulation

```bash
# Build static site and serve via Firebase emulator
pnpm emulate
# Serves at http://127.0.0.1:5000 — mirrors production Firebase hosting exactly
```

### Deployment

Handled automatically via GitHub Actions:

- **Production (static)**: `https://allisons.dev` — deployed from `main` branch to Firebase hosting via `pnpm generate`
- **Staging**: Firebase preview channel — deployed from `main`
- **PRs**: Temporary preview channels auto-deployed on open
- **SSR (Studio prod)**: Not yet set up. A `Dockerfile` exists for a future Hetzner Docker deploy, but there is no SSR deploy workflow in `.github/workflows/` yet

## Architecture Overview

Single-site **developer portfolio** built with Nuxt 4 and deployed to Firebase static hosting.

### Core Stack

- **Framework**: Nuxt 4 (SSR with static preset for Firebase)
- **Content**: `@nuxt/content` v3 — file-based Markdown with native SQLite
- **UI**: `@nuxt/ui` v4 + Tailwind CSS v4
- **Images**: `@nuxt/image`
- **State**: Pinia (minimal usage)
- **Deploy**: Firebase static hosting via GitHub Actions
- **Node.js**: 22.x (required for native SQLite)

### Directory Structure

```
portfolio/
├── app/                        # Nuxt application root
│   ├── pages/                  # File-based routes
│   │   ├── index.vue           # Home
│   │   ├── about.vue           # About
│   │   ├── contact.vue         # Contact
│   │   └── blog/               # Blog listing + posts
│   ├── components/             # Vue components
│   ├── composables/            # useContent, useReadTime, etc.
│   ├── layouts/                # Default layout
│   └── utils/                  # Color utils, etc.
├── content/                    # Markdown + data content
│   ├── blog/                   # Blog post .md files
│   ├── projects/               # Project .md files
│   ├── pages/                  # Home/about page data (.yml)
│   └── globals/                # Footer, nav data (.yml)
├── docs/                       # Developer docs
├── public/                     # Static assets
├── content.config.ts           # Content collection schemas
├── nuxt.config.ts              # Nuxt configuration
└── package.json
```

### Content Management

Content lives in `content/` as Markdown files with YAML frontmatter.

**Project frontmatter schema** (`content/projects/*.md`):

```yaml
title: string
description: string
date: YYYY-MM-DD
slug: string
status: published | draft
featured: true | false
technologies: [list]
tags: [list]
github: URL (optional)
demo: URL (optional)
liveDemo: URL (optional)
image: /path/to/image (optional)
```

**Blog frontmatter schema** (`content/blog/*.md`):

```yaml
title: string
date: YYYY-MM-DD
description: string
category: dev
tags: [list]
author: string
published: true | false
featured: true | false
slug: string
```

### Key Configurations

- **SQLite**: Uses Node.js native SQLite (`experimental.sqliteConnector: 'native'`)
- **Nuxt Studio**: Self-hosted module (`nuxt-studio` 1.4.0), accessible at `/_studio` (dev) or via SSR host (prod)
- **Hybrid rendering**: Content pages pre-rendered; `/_studio/**` stays SSR via `routeRules`
- **ISR disabled**: All content pages are pre-rendered at build time
- **SEO/crawl**: `@nuxtjs/robots` + `@nuxtjs/sitemap` generate `/robots.txt` and `/sitemap.xml` from `site` in `nuxt.config.ts` (trailing-slash URLs). Blog/projects are wrapped in `asSitemapCollection()`; drafts (`published: false`, `status: draft`) are excluded by a `content:file:afterParse` hook
- **404s**: Firebase serves the generated `404.html` (no SPA catch-all rewrite), so unknown and draft URLs return a real 404

## Nuxt Studio Usage

### Development (no config needed)

```bash
pnpm dev
# Visit http://localhost:3000 — floating Studio button bottom-left
```

Studio edits in dev mode write directly to local files. Use your normal git workflow to commit.

### Production Studio Access (SSR only)

Studio's `/_studio` auth route requires a running Node.js server — it cannot be served from Firebase static hosting.

To enable production Studio:

1. Set up a GitHub OAuth App (callback: `https://allisons.dev/_studio/api/auth/github`)
2. Add env vars to Hetzner: `STUDIO_GITHUB_CLIENT_ID`, `STUDIO_GITHUB_CLIENT_SECRET`
3. Build and deploy the SSR container from the `Dockerfile` (no SSR deploy workflow exists yet; one still needs to be written)
4. Visit `https://allisons.dev/_studio`

See `docs/nuxt-content-migration.md` for full setup guide.

## Troubleshooting

### Nuxt Content SQLite Issues

**Problem**: `no such table: _content_blog` or similar errors during `pnpm dev`

**Solution**:

```bash
pnpm dev:clean   # wipes .data/content/contents.sqlite and restarts
```

**Root cause**: SQLite database corruption during HMR. The `.data/` directory is gitignored and regenerated automatically.

### Common Issues

- **Port conflict**: Nuxt auto-selects next available port if 3000 is taken
- **TypeScript errors after updates**: `pnpm typecheck`
- **Lint failures**: `pnpm lint:fix` for auto-fixable issues
- **Lockfile out of sync**: `pnpm lockfile:update` then commit both `package.json` and `pnpm-lock.yaml`

### pnpm Lockfile Issues

**Problem**: Firebase deploy fails with "lockfile is out of sync"

```bash
pnpm lockfile:update   # fix and stage
# or from scratch:
rm pnpm-lock.yaml && pnpm install
```

## Git Workflow & CI/CD

### Branch Structure

- **main**: Integration branch (protected, requires PR + CI)
- **feature branches**: Branch from main, open PR to merge back

### Workflow

1. Create a worktree for the branch (see below); never work directly on `main`
2. Make changes and commit (conventional subject + description body)
3. Verify with the `verify-site` skill (`.claude/skills/verify-site/SKILL.md`): pnpm checks, build-output checks, and browser checks at 375/768/1440
4. Push + open PR against `main`
5. CI runs: setup/install, typecheck, lint, commitlint, Firebase preview channel
6. On merge: auto-deploys to production (https://allisons.dev) and staging, then verify production

### Commit Message Style

Conventional-commit subject line, a blank line, then a short description body explaining what changed and why. Do not add AI co-author trailers (no `Co-Authored-By: Claude ...`).

```bash
git commit -m "fix: correct image path in assistarr card" \
  -m "The card pointed at /images/assistar.png, which 404s on the static build. Point it at the real file."
```

PRs: conventional title (checked by the Semantic PR Title workflow) and a real description (what, why, how verified). No "Generated with Claude Code" footer.

### Agent Workflow

Implementation happens in git worktrees under `.claude/worktrees/<branch-with-dashes>` (gitignored), one per PR branch:

```bash
git fetch origin
git worktree add .claude/worktrees/feat-your-feature -b feat/your-feature origin/main
cd .claude/worktrees/feat-your-feature && pnpm install --frozen-lockfile
# make changes, run the verify-site skill
git commit -m "feat: description" -m "Why and what changed."
git push -u origin feat/your-feature
gh pr create --title "feat: description" --body "What, why, how verified"
gh pr checks --watch
# after merge
git worktree remove .claude/worktrees/feat-your-feature
```

- Always use pnpm, never npm. pnpm is pinned to 10 (`mise.toml`, `packageManager`); pnpm 11 ignores the `pnpm` field in package.json and breaks `--frozen-lockfile`.
- `.claude/skills/` is committed; research artifacts (`.claude/project-dossiers/`, `.claude/build-logs/`, `.claude/site-launch-plan.md`) and `.claude/settings.local.json` stay local and are never committed.
