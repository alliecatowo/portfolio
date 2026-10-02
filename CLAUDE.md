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

# Content validation (also runs in CI and before every deploy)
pnpm validate:content  # scripts/validate-content.ts

# WebMCP end-to-end check: needs a prior `pnpm generate` and Chrome 149+ (CHROME_PATH to override)
pnpm test:webmcp       # scripts/test-webmcp.mjs

# Content formatting: serializes content/ exactly as Nuxt Studio does, so Studio edits never add noise
pnpm content:format        # rewrite content/**/*.{md,yml} (scripts/format-content.mjs)
pnpm content:format:check  # exit 1 on any diff or non-round-tripping file (CI + lint-staged); Prettier ignores content/
pnpm content:roundtrip     # after `pnpm generate`: Studio's save of every built DB row must equal the file (scripts/check-studio-roundtrip.mjs)

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
- **Staging**: Firebase preview channel — manual `workflow_dispatch` only (production deploys on every push to `main`)
- **PRs**: Temporary preview channels auto-deployed on open
- **Studio function**: the production workflow also builds (`pnpm build:studio`) and deploys the `studio` 2nd-gen Cloud Function that serves Nuxt Studio's server routes. See `STUDIO.md`

## Architecture Overview

Single-site **developer portfolio** built with Nuxt 4 and deployed to Firebase static hosting.

### Core Stack

- **Framework**: Nuxt 4 (SSR with static preset for Firebase)
- **Content**: `@nuxt/content` v3 — file-based Markdown with native SQLite
- **UI**: `@nuxt/ui` v4 + Tailwind CSS v4
- **Images**: `@nuxt/image`
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
devpost: URL (optional)
order: number (optional; ascending, unordered projects sort after by date)
award: string (optional; shown as a badge)
group: string (optional)
image: /path/to/image (optional)
imageAlt: string (optional; alt text for image)
ogImage: /images/og/<slug>.png (optional; 1200x630 share image)
video: {youtube: <id>, title, uploadDate} (optional; a YouTube demo. Drives the VideoObject JSON-LD and the sitemap video entry. Embed it in the body with `::youtube-video{id title}`, a wrapper around @nuxt/scripts ScriptYouTubePlayer that loads nothing from YouTube until click)
seo: { title, description } (optional; search title/description override, aim for ~50-60 / 140-160 chars)
```

**OG images**: `public/images/og/<slug>.png` (1200x630) is picked up by convention for a project whose `slug` matches, even without `ogImage` in frontmatter (`nuxt.config.ts` lists the directory at build time). Files there are referenced by convention, not by content, so don't delete them as "unreferenced". Pages without their own image use `/images/og/default.png` (the avatar card).

**Blog frontmatter schema** (`content/blog/*.md`):

```yaml
title: string
date: YYYY-MM-DD
description: string
category: dev
tags: [list]
author: Allison Coleman
published: true | false
featured: true | false
slug: string
featured_image: /path/to/image (optional)
ogImage: /path/to/image (optional; falls back to featured_image, then the default OG)
```

**Required for published items** (enforced by `pnpm validate:content`, not the zod schemas, so drafts stay flexible): projects need `description`, `date`, `image` + `imageAlt`; blog posts need `description`, `date`, `author`; the shipped description (`seo.description`, else `description`) must be 120-165 characters. Projects with no real capture yet are listed in `IMAGE_EXEMPT` in `scripts/validate-content.ts`; remove a slug there once it has an image.

### Key Configurations

- **SQLite**: Uses Node.js native SQLite (`experimental.sqliteConnector: 'native'`)
- **Nuxt Studio**: Self-hosted module (`nuxt-studio` 1.7.0). In production, `firebase.json` rewrites `/_studio`, `/__nuxt_studio/**` and `/sw.js` to the `studio` Cloud Function (built with `NITRO_PRESET=firebase` into `.output-studio/`); everything else is static
- **Pre-rendering**: every public page is pre-rendered (`routeRules '/**'`); Studio routes never are
- **ISR disabled**: All content pages are pre-rendered at build time
- **SEO/crawl**: `@nuxtjs/robots` + `@nuxtjs/sitemap` generate `/robots.txt` and `/sitemap.xml` from `site` in `nuxt.config.ts` (trailing-slash URLs). Blog and project URLs (published only, `lastmod` from the content date) come from the sitemap source `server/routes/__sitemap__/site-content-urls.json.ts`, not from a `sitemap` column on the collections. `/llms.txt` is generated from content by `server/routes/llms.txt.ts`
- **Drafts never ship**: production builds drop draft posts and projects from their collections in `content.config.ts`, because every collection row (body included) is published in `/__nuxt_content/<collection>/sql_dump.txt`. Studio edits from those public dumps, so it can't see drafts; edit drafts locally. Never set `CONTENT_INCLUDE_DRAFTS=true` for the static build
- **Internal links** use the trailing-slash form (`/about/`, `/projects/<slug>/`); Firebase redirects the bare form
- **Page metadata**: every page calls `useSiteSeo()` (`app/composables/useSiteSeo.ts`) for title (`Page – Allison Coleman`, suffix skipped if the title already names her or would pass 65 chars), description, canonical (absolute, trailing slash), OpenGraph/Twitter tags and JSON-LD. Shared schema.org nodes (the Person) live in `app/utils/structuredData.ts`. Don't add ad-hoc `useHead` title/meta blocks
- **Studio-safe content**: Studio writes the stored DB document back to the file, so (a) never mutate documents in build hooks (`content:file:afterParse`) or add `sitemap`-style columns filled at build time: it gets committed into the Markdown. Do such work at render time (`app/components/content/ProseImg.vue` adds image aspect-ratio/lazy loading from `modules/content-image-sizes.ts`). (b) No raw HTML with children in Markdown (a `<video><source>` is turned into a lossy `:video[]`): use an MDC component (`::demo-video{...}` / `app/components/content/DemoVideo.vue`). (c) Avoid `:xx:` in prose (a time like `6:32:` followed by text): Studio's editor parser hard-codes remark-emoji and eats the colons (Content's own emoji plugin is off). `content:format:check` and `content:roundtrip` catch these.
- **WebMCP**: `app/plugins/webmcp.client.ts` feature-detects `document.modelContext` and registers read-only tools at idle (`app/utils/webmcpTools.ts`), reading the prerendered `/webmcp/catalog.json` (`server/routes/webmcp/`) rather than Content's SQLite WASM. The contact `<form>` is a declarative tool (`toolname`/`tooldescription`, no `toolautosubmit`). `public/.well-known/ai-catalog.json` follows the ARD spec (Lighthouse's `ard-schema` audit); `firebase.json` hosting `ignore` must keep allowing `.well-known`. Keep these, `/llms.txt` and `pnpm test:webmcp` in sync when tools change
- **404s**: Firebase serves the generated `404.html` (no SPA catch-all rewrite), so unknown and draft URLs return a real 404

## Nuxt Studio Usage

### Development (no config needed)

```bash
pnpm dev
# Visit http://localhost:3000 — floating Studio button bottom-left
```

Studio edits in dev mode write directly to local files. Use your normal git workflow to commit.

### Production Studio

Visit `https://allisons.dev/_studio` (or press Cmd + `.` on any page) and log in with GitHub. Only emails in `STUDIO_GITHUB_MODERATORS` get in. Studio commits to `main` with your GitHub token, which redeploys the site.

How it works on Firebase (the `__session` cookie workaround, secrets, OAuth callback, one-time GCP setup, costs): `STUDIO.md`.

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
- **`validate:content` fails**: Nuxt Content v3 turns the zod schemas into SQLite columns but never rejects bad frontmatter, so the validator is the only gate. It imports the schemas from `content.config.ts` (via `scripts/nuxt-content-shim.mjs`), `safeParse`s every file, and checks that local image paths exist under `public/`, URL fields have `http(s)://`, body links aren't bare domains, slugs are unique, and no `picsum.photos`/`placehold.co` appears in `content/` or `app/`. Fix the reported `file:field`. Studio can leave empty stubs (e.g. `card: {buttons: []}`) that fail required fields; delete them.
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
6. On merge: auto-deploys to production (https://allisons.dev), then verify production

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
