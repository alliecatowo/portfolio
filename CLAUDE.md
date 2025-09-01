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

The project uses Firebase App Hosting for deployment:

```bash
# Deployments are handled automatically via GitHub Actions
# Production: https://portfolio--portfolio-c1306.us-central1.hosted.app
# Staging: https://portfolio-staging--portfolio-c1306.us-central1.hosted.app
```

## Architecture Overview

This is a **multi-site portfolio** built with Nuxt.js that serves both a developer portfolio and tattoo artist portfolio from the same codebase.

### Core Architecture

- **Frontend**: Nuxt 4 application with SSR/ISR rendering
- **Content**: File-based content using @nuxt/content (SQLite backend)
- **Deployment**: Firebase App Hosting with CI/CD via GitHub Actions
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

- **Nuxt 4** with node-server preset for Firebase App Hosting
- **@nuxt/ui** for component library and styling
- **@nuxt/content** with native SQLite for content management
- **@nuxt/image** for optimized image handling
- **Pinia** for state management
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

- **Firebase App Hosting** with node-server preset
- **Route rules**: ISR caching for dynamic content (1 hour TTL)
- **Content config**: SQLite with experimental native SQLite feature
- **Output directory**: `.output/` for Firebase App Hosting

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

- **main**: Production branch (protected, requires PR + CI)
- **staging**: Staging branch (auto-deploys from main)
- **feature branches**: Development work (branch from main)

### Workflow Process

1. Create feature branch from `main`
2. Make changes and push to feature branch
3. Open PR against `main` (triggers CI checks)
4. PR must pass CI (typecheck, lint, build, test) and get approval
5. Merge to `main` triggers staging deployment
6. Create release/tag triggers production deployment

### CI/CD Pipeline

- **CI Checks**: TypeScript check, lint, build validation, tests
- **Staging Deploy**: Auto-deploy to Firebase App Hosting on main push
- **Production Deploy**: Manual release/tag triggers production deployment
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
