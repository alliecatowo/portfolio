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

- **Production**: `https://allisons.dev` — deployed from `main` branch
- **Staging**: Firebase preview channel — deployed from `main`
- **PRs**: Temporary preview channels auto-deployed on open

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
│   │   ├── open-source.vue     # Open source projects
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

- **SQLite**: Uses Node.js native SQLite (`experimental.nativeSqlite: true`)
- **Nuxt Studio preview**: Configured in `nuxt.config.ts` under `content.preview`
- **Static preset**: Nitro renders to `.output/public/` for Firebase hosting
- **ISR disabled**: Fully static generation (no edge functions)

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

1. Create branch: `git checkout -b feat/your-feature`
2. Make changes and commit (single-line messages)
3. Push + open PR against `main`
4. CI runs: typecheck, lint, build, commitlint
5. On merge: auto-deploys to staging

### Commit Message Style

Single-line conventional commits only:

```bash
git commit -m "feat: add lumen project page"
git commit -m "fix: correct image path in assistarr card"
git commit -m "docs: update migration notes"
```

Multi-line commit bodies are not preferred.

### Agent Workflow

```bash
git checkout -b feat/your-feature-name
# make changes
git commit -m "feat: description"
git push -u origin feat/your-feature-name
gh pr create --title "Title" --body "Brief description"
```

- Always use pnpm, never npm.
