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
- Better-sqlite3 dependency issues resolved with native SQLite

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
