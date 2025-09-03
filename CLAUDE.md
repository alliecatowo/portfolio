# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Local Development

```bash
# Start development server (from root)
pnpm dev

# Start development server (from frontend directory)
cd frontend && npm run dev
```

### Firebase Emulation

Test your static builds exactly as they will work on Firebase hosting:

```bash
# All-in-one: watch files, rebuild, and serve via emulator (recommended for development)
pnpm emulate
# Watches files, rebuilds on change, serves at http://127.0.0.1:5000

# Build and serve via Firebase emulator (for one-time testing)
pnpm emulators:build
# Builds static site and starts Firebase hosting emulator at http://127.0.0.1:5000

# Serve existing build via Firebase emulator
pnpm emulators:start
# Serves frontend/.output/public at http://127.0.0.1:5000

# Start with Emulator UI (includes debugging tools)
pnpm emulators:ui
# Includes Firebase Emulator UI at http://127.0.0.1:4000
```

**Key Benefits:**

- Tests static hosting behavior exactly like production Firebase
- Validates image optimization (IPX) with proper cache headers
- Verifies rewrites, redirects, and 404/200.html fallbacks
- Much faster than actual Firebase deployment for testing

### Build Commands

**IMPORTANT: Always use pnpm, not npm**

```bash
# Build for production (from root)
pnpm build

# Build from frontend directory using workspace filter
pnpm --filter portfolio-frontend build

# Generate static site
pnpm --filter portfolio-frontend generate

# Preview production build
pnpm --filter portfolio-frontend preview

# Type checking
pnpm --filter portfolio-frontend typecheck
# OR from frontend directory
cd frontend && npm run typecheck

# Linting
pnpm lint
# Lint specific files
pnpm -C frontend lint:files path/to/file.ts path/to/file.vue
# OR from frontend directory
cd frontend && npm run lint
cd frontend && npm run lint:files path/to/file.ts

# Database Management (Nuxt Content)
# Clean corrupted SQLite database
pnpm -C frontend db:clean
# Rebuild database from scratch
pnpm -C frontend db:rebuild
# Start dev server with clean database
pnpm -C frontend dev:clean

# Lockfile Management (pnpm)
# Check if lockfile is in sync with package.json
pnpm lockfile:check
# Update lockfile and stage for commit
pnpm lockfile:update
# Install with strict lockfile validation (CI behavior)
pnpm install --frozen-lockfile
```

### Deployment

The project uses Firebase static hosting:

```bash
# Deployments are handled automatically via GitHub Actions
# Production: https://allisons.dev (live channel - releases only)
# Staging: https://allie-portfolio-project--staging-o21oschp.web.app (main branch)
# Preview: Auto-deployed temporary channels for pull requests
```

## Architecture Overview

This is a **multi-site portfolio** built with Nuxt.js that serves both a developer portfolio and tattoo artist portfolio from the same codebase.

### Core Architecture

- **Frontend**: Nuxt 4 application with static generation and ISR
- **Content**: File-based content using @nuxt/content (native SQLite)
- **Deployment**: Firebase static hosting with CI/CD via GitHub Actions
- **Multi-site Logic**: Route-based site configuration system

### Multi-Site System

The application dynamically switches between three modes based on URL paths:

1. **Dev Site** (`/dev/*` routes): Developer portfolio theme
2. **Tattoo Site** (`/tattoo/*` routes): Tattoo artist portfolio theme
3. **Dual Site** (root routes): Combined portfolio

Site configuration is handled by:

- `utils/site-config.ts` - Defines site configurations and themes
- `middleware/site-config.global.ts` - Sets active site config based on route
- Themes applied via CSS classes (`theme-dev`, `theme-tattoo`, `theme-dual`)

### Key Technologies

- **Nuxt 4** with static preset for Firebase hosting
- **@nuxt/ui** for component library and styling
- **@nuxt/content** with native SQLite for content management
- **@nuxt/image** for optimized image handling
- **Pinia** for admin authentication (minimal usage)
- **TypeScript** throughout

### Directory Structure

- `frontend/` - Main Nuxt application
  - `pages/` - File-based routing with nested dev/tattoo structures
  - `components/` - Vue components organized by domain (common, dev, tattoo)
  - `content/` - Markdown files for blog posts, projects, gallery items
  - `utils/` - Site configuration and API utilities
  - `middleware/` - Site configuration and auth middleware

### Content Management

- **File-based content**: Stored in `frontend/content/` as Markdown files
- **Content types**: blog posts, projects, gallery items, testimonials

### Environment Variables

Required for development:

```bash
DEV_SITE_URL=http://localhost:3000
TATTOO_SITE_URL=http://localhost:3000
```

### Build Configuration

- **Firebase static hosting** with static preset
- **Route rules**: ISR caching for dynamic content (1 hour TTL)
- **Content config**: Native SQLite (Node.js 22.5.0+)
- **Output directory**: `.output/public/` for static hosting

### Development Notes

- Uses pnpm workspaces (configured in `pnpm-workspace.yaml`)
- Node.js 22.x required (specified in engines)
- Uses Node.js native SQLite (Node 22.x) for performance
- Database corruption resolved with cleanup scripts

## Troubleshooting

### Nuxt Content SQLite Issues

**Problem**: `no such table: _content_blog` errors during development

**Root Cause**: SQLite database corruption during Hot Module Replacement (HMR)

**Solutions**:

```bash
# Quick fix - clean and restart
pnpm -C frontend dev:clean

# Manual database cleanup
pnpm -C frontend db:clean
pnpm dev

# Complete rebuild (if corruption persists)
pnpm -C frontend db:rebuild
pnpm dev
```

**Prevention**:

- Uses Node.js native SQLite (requires Node.js 22.5.0+)
- Database automatically cleaned/rebuilt when corruption occurs
- Database files (.data directory) are gitignored and regenerated
- Avoid manual `.data/content/contents.sqlite` file modifications

### Common Development Issues

**Port conflicts**: If port 3000 is in use, Nuxt will auto-select next available port

**TypeScript errors after updates**: Run `pnpm -C frontend typecheck` to verify types

**Linting failures**: Use `pnpm -C frontend lint:fix` for auto-fixable issues

### pnpm Workspace & Lockfile Issues

**Problem**: Firebase deploy fails with "lockfile is out of sync" errors

**Root Cause**: pnpm workspace lockfile (`pnpm-lock.yaml`) is inconsistent with package.json dependencies

**Solutions**:

```bash
# Check lockfile consistency (run before commits)
pnpm lockfile:check

# Fix inconsistent lockfile
pnpm lockfile:update

# Manual lockfile regeneration
rm pnpm-lock.yaml && pnpm install
```

**Prevention**:

- Pre-commit hooks automatically validate lockfile consistency
- Always run `pnpm lockfile:update` after adding/removing dependencies
- CI/CD uses `--frozen-lockfile` to enforce exact dependency matching
- Single lockfile at workspace root manages all packages

**Dependency Management Workflow**:

1. Add dependency: `pnpm -C frontend add package-name`
2. Update lockfile: `pnpm lockfile:update`
3. Commit both package.json and pnpm-lock.yaml changes
4. Verify CI passes with frozen lockfile validation

## Git Workflow & CI/CD

### Branch Structure

- **main**: Integration branch (protected, requires PR + CI)
- **feature branches**: Development work (branch from main)

### Workflow Process

1. Create feature branch from `main`
2. Make changes and push to feature branch
3. Open PR against `main` (triggers CI checks + preview deployment)
4. PR must pass CI (typecheck, lint, build, commitlint) and get approval
5. Merge to `main` for integration and staging deployment

### CI/CD Pipeline

**Parallel Architecture with Direct Rebuilds:**

- **CI Checks**: Parallel execution of typecheck, lint, build, test, commitlint
- **Preview Deploy**: Auto-deploy PRs to Firebase preview channel (rebuilds independently)
- **Production Deploy**: Auto-deploy `production` branch to live channel (rebuilds independently)
- **Shared Cache**: pnmp store cache shared across all jobs for efficiency
- **Error Handling**: GitHub Actions annotations with colored logs
- **Branch Protection**: Main branch requires PR reviews + passing CI

### Commit Message Style

**IMPORTANT**: Use single-line commit messages only:

```bash
# Good
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login redirect issue"
git commit -m "refactor: update API structure"

# Bad (multi-line messages are not preferred)
git commit -m "feat: add user authentication

- Add login form component
- Implement JWT token handling
- Update navigation for auth state"
```

### Development Commands for Agents

When working as Claude Code:

```bash
# Always create feature branches for changes
git checkout -b feature/your-feature-name

# Make commits with single-line messages
git commit -m "feat: your single line description"

# Push and create PR
git push -u origin feature/your-feature-name
gh pr create --title "Your PR Title" --body "Brief description"
```

- use pnpm over npm always. never use npm if possible.
