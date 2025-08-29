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
```

### Deployment
The project uses Vercel for frontend deployment with a custom build script:
```bash
# Vercel build command (configured in vercel.json)
cd frontend && chmod +x build-for-vercel.sh && ./build-for-vercel.sh
```

## Architecture Overview

This is a **multi-site portfolio** built with Nuxt.js that serves both a developer portfolio and tattoo artist portfolio from the same codebase.

### Core Architecture
- **Frontend**: Nuxt 4 application with SSR/ISR rendering
- **Content**: File-based content using @nuxt/content (SQLite backend)
- **CMS Integration**: Directus headless CMS hosted on DigitalOcean
- **Deployment**: Vercel with custom build configuration
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
- **Nuxt 4** with Nitro preset for Vercel
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
- **Directus CMS**: External API at `https://allisons-portfolio-directus-9vxdi.ondigitalocean.app`
- **Content types**: blog posts, projects, gallery items, testimonials

### Environment Variables
Required for development:
```bash
NUXT_PUBLIC_API_URL=https://allisons-portfolio-directus-9vxdi.ondigitalocean.app
NUXT_PUBLIC_DIRECTUS_TOKEN=<token>
DEV_SITE_URL=http://localhost:3000  
TATTOO_SITE_URL=http://localhost:3000
```

### Build Configuration
- **Vercel preset** with custom build script (`build-for-vercel.sh`)
- **Route rules**: ISR caching for dynamic content (1 hour TTL)
- **Content config**: SQLite with experimental native SQLite feature
- **Output directory**: `public/` for Vercel deployment

### Development Notes
- Uses pnpm workspaces (configured in `pnpm-workspace.yaml`)
- Node.js 22.x required (specified in engines)
- Better-sqlite3 dependency issues resolved with native SQLite
- Build process includes Rollup patches for compatibility