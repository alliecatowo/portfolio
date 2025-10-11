# GitHub Copilot Instructions

This file provides guidance to GitHub Copilot when working with code in this repository.

## Project Overview

This is a **multi-site portfolio** built with Nuxt 4 that serves both a developer portfolio and tattoo artist portfolio from the same codebase.

**Live Sites:**
- Production: https://allisons.dev (live channel - releases only)
- Staging: https://allie-portfolio-project--staging-o21oschp.web.app (main branch)
- Preview: Auto-deployed temporary channels for pull requests

## Tech Stack

- **Framework**: Nuxt 4 (Vue 3, TypeScript)
- **Content**: @nuxt/content with native SQLite backend
- **UI**: @nuxt/ui (TailwindCSS-based component library)
- **Images**: @nuxt/image for optimized image handling
- **State**: Minimal Pinia for admin auth only
- **Deployment**: Firebase static hosting with CI/CD via GitHub Actions
- **Package Manager**: pnpm workspaces (Node.js 22.x required)

## Multi-Site Architecture

The application dynamically switches between three modes based on URL paths:

1. **Dev Site** (`/dev/*` routes): Developer portfolio theme
2. **Tattoo Site** (`/tattoo/*` routes): Tattoo artist portfolio theme
3. **Dual Site** (root routes): Combined portfolio

Site configuration is handled by:
- `utils/site-config.ts` - Defines site configurations and themes
- `middleware/site-config.global.ts` - Sets active site config based on route
- Themes applied via CSS classes (`theme-dev`, `theme-tattoo`, `theme-dual`)

## Key Directories

- `app/` - Main Nuxt application
  - `pages/` - File-based routing with nested dev/tattoo structures
  - `components/` - Vue components organized by domain (common, dev, tattoo)
  - `content/` - Markdown files for blog posts, projects, gallery items
  - `utils/` - Site configuration and API utilities
  - `middleware/` - Site configuration and auth middleware
- `.github/workflows/` - CI/CD workflows
- `docs/` - Additional documentation

## Development Commands

**IMPORTANT: Always use pnpm, not npm**

### Essential Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Generate static site
pnpm generate

# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# Database Management (Nuxt Content)
pnpm db:clean          # Clean corrupted SQLite database
pnpm db:rebuild        # Rebuild database from scratch
pnpm dev:clean         # Start dev server with clean database
```

### Firebase Emulation

Test static builds exactly as they will work on Firebase hosting:

```bash
# All-in-one: watch files, rebuild, and serve via emulator
pnpm emulate
# Serves at http://127.0.0.1:5000

# Build and serve via Firebase emulator
pnpm emulators:build
```

### Lockfile Management

```bash
# Check lockfile consistency (run before commits)
pnpm lockfile:check

# Update lockfile and stage for commit
pnpm lockfile:update
```

## Code Standards

### TypeScript
- Use strict mode for all TypeScript files
- Define proper types for props, emits, and composable returns
- Avoid `any` types unless absolutely necessary

### Vue Components
- Use `<script setup>` syntax for all new components
- Use Composition API over Options API
- Follow single-responsibility principle for components
- Use @nuxt/ui components when possible

### Styling
- Use @nuxt/ui components when possible
- Follow TailwindCSS utility-first approach
- Use CSS variables for theming
- Avoid custom CSS unless necessary

### File Organization

```
components/
├── common/          # Shared components
├── dev/            # Developer portfolio specific
└── tattoo/         # Tattoo portfolio specific

composables/        # Reusable composition functions
utils/             # Pure utility functions
```

## Git Workflow

### Branch Strategy
- **main**: Integration branch (protected, requires PR + CI)
- **feature branches**: Development work (branch from main)

### Workflow Process
1. Create feature branch from `main`
2. Make changes and push to feature branch
3. Open PR against `main` (triggers CI checks + preview deployment)
4. PR must pass CI (typecheck, lint, build, commitlint) and get approval
5. Merge to `main` for integration and staging deployment

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Examples:
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login redirect issue"
git commit -m "docs: update installation guide"
git commit -m "refactor: restructure components directory"
git commit -m "chore: update dependencies"
```

**Use single-line commit messages only** - avoid multi-line messages.

## CI/CD Pipeline

**Parallel Architecture:**
- **CI Checks**: Parallel execution of typecheck, lint, build, test, commitlint
- **Preview Deploy**: Auto-deploy PRs to Firebase preview channel (rebuilds independently)
- **Production Deploy**: Auto-deploy `production` branch to live channel (rebuilds independently)
- **Shared Cache**: pnpm store cache shared across all jobs for efficiency
- **Branch Protection**: Main branch requires PR reviews + passing CI

## Environment Variables

Required for development:

```bash
DEV_SITE_URL=http://localhost:3000
TATTOO_SITE_URL=http://localhost:3000
```

## Common Issues & Solutions

### Nuxt Content SQLite Issues

**Problem**: `no such table: _content_blog` errors during development

**Solutions**:
```bash
# Quick fix - clean and restart
pnpm dev:clean

# Manual database cleanup
pnpm db:clean
pnpm dev

# Complete rebuild (if corruption persists)
pnpm db:rebuild
pnpm dev
```

### pnpm Lockfile Issues

**Problem**: Firebase deploy fails with "lockfile is out of sync" errors

**Solutions**:
```bash
# Check lockfile consistency
pnpm lockfile:check

# Fix inconsistent lockfile
pnpm lockfile:update
```

**Dependency Management Workflow**:
1. Add dependency: `pnpm add package-name`
2. Update lockfile: `pnpm lockfile:update`
3. Commit both package.json and pnpm-lock.yaml changes
4. Verify CI passes with frozen lockfile validation

## Best Practices

- Always use pnpm for package management
- Run type checking and linting before committing
- Test changes locally with `pnpm dev` and `pnpm build`
- Use Firebase emulator (`pnpm emulate`) to test static builds
- Follow the established code organization patterns
- Keep components focused and reusable
- Write meaningful commit messages following conventional commits
- Ensure all CI checks pass before merging

## Additional Resources

- [Nuxt 4 Documentation](https://nuxt.com/)
- [Vue 3 Guide](https://vuejs.org/guide/)
- [@nuxt/ui Components](https://ui.nuxt.com/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
