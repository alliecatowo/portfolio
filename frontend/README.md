# Portfolio Frontend

Nuxt 4 application powering the multi-site portfolio system.

## 🏗️ Multi-Site Architecture

Dynamic route-based portfolio serving three experiences:

- **`/dev/*`** - Developer portfolio (technical projects, engineering blog)
- **`/tattoo/*`** - Tattoo portfolio (art gallery, creative content)
- **`/`** - Dual mode (combined showcase)

**Implementation:**

- Route middleware detects context and applies theming
- Content filtering based on active site mode
- Three distinct CSS themes (`theme-dev`, `theme-tattoo`, `theme-dual`)

## 🚀 Quick Start

```bash
# From project root
pnpm dev
# → http://localhost:3000

# Or from frontend directory
cd frontend && pnpm dev
```

**Environment Setup:**

```bash
# Optional: Create .env in frontend/
echo "DEV_SITE_URL=http://localhost:3000" > frontend/.env
echo "TATTOO_SITE_URL=http://localhost:3000" >> frontend/.env
```

### Content Management

Content is managed through [@nuxt/content](https://content.nuxt.com/) with files stored in `frontend/content/`:

```
content/
├── blog/
│   ├── dev/        # Development blog posts
│   └── tattoo/     # Tattoo-related posts
├── projects/       # Development projects
├── gallery/        # Tattoo gallery items
└── testimonials/   # Client testimonials
```

Each content file uses frontmatter for metadata:

```markdown
---
title: 'Article Title'
description: 'Brief description'
date: 2024-01-01
tags: ['tag1', 'tag2']
featured: true
---

Content goes here...
```

## ✨ Key Features

### Rendering Strategies

- **Static Site Generation (SSG)**: Pre-rendered pages for optimal performance
- **Incremental Static Regeneration (ISR)**: Dynamic content with 1-hour cache
- **Client-side Navigation**: Smooth transitions with Vue Router

### SEO Optimization

- Dynamic meta tags per page
- Open Graph images via `nuxt-og-image`
- Automatic sitemap generation
- Robots.txt configuration
- Structured data for rich snippets

### Accessibility

- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader optimizations
- Color contrast compliance
- Focus management

### Performance

- Image optimization with `@nuxt/image`
- Lazy loading for off-screen content
- Code splitting and tree shaking
- Optimized font loading
- Critical CSS inlining

## 📁 Project Structure

```
frontend/
├── components/         # Vue components
│   ├── common/        # Shared UI components
│   ├── dev/          # Developer-specific components
│   └── tattoo/       # Tattoo-specific components
├── composables/       # Reusable composition functions
├── content/          # Markdown content files
├── layouts/          # Page layouts
│   ├── default.vue   # Main layout
│   └── admin.vue     # Admin area layout
├── middleware/       # Route middleware
│   └── site-config.global.ts  # Site detection
├── pages/           # File-based routing
│   ├── index.vue    # Home page
│   ├── dev/         # Developer routes
│   └── tattoo/      # Tattoo routes
├── plugins/         # Nuxt plugins
├── public/          # Static assets
├── server/          # Server-side code
│   └── api/        # API endpoints
├── stores/         # Pinia stores
├── utils/          # Utility functions
│   └── site-config.ts  # Site configuration
└── nuxt.config.ts  # Nuxt configuration
```

## 🛠️ Configuration

### Nuxt Configuration

Key configuration in `nuxt.config.ts`:

- Content module setup with SQLite
- UI framework configuration
- Image optimization settings
- Route rules for ISR
- SEO defaults

### TypeScript

Strict TypeScript configuration with:

- Type checking on build
- Vue component type inference
- Auto-imported types
- Path aliases

### Styling

Using @nuxt/ui with TailwindCSS:

- Component-based styling
- Dark/light mode support
- Responsive design utilities
- Custom theme configuration

## 🧪 Development Tools

### Code Quality

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format code
pnpm lint:fix
```

### Debugging

- Vue DevTools integration
- Nuxt DevTools for debugging
- Network request inspection
- Performance profiling

## 📦 Build & Deployment

### Build Commands

```bash
# Build for production (SSR)
pnpm build

# Generate static site (SSG)
pnpm generate

# Preview production build
pnpm preview
```

### Output

- Build output in `.output/` directory
- Static files in `.output/public/`
- Server bundle in `.output/server/`

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**: Change port in `nuxt.config.ts` or use `PORT=3001 pnpm dev`
2. **Content not updating**: Clear `.nuxt/` directory and restart dev server
3. **Type errors**: Run `pnpm typecheck` and fix reported issues
4. **Build failures**: Check Node version (22.x required) and clear node_modules

### Useful Commands

```bash
# Clear cache and rebuild
rm -rf .nuxt .output node_modules/.cache
pnpm install
pnpm dev

# Check for outdated dependencies
pnpm outdated

# Update dependencies
pnpm update
```

## 📚 Resources

- [Nuxt 4 Documentation](https://nuxt.com/)
- [Vue 3 Documentation](https://vuejs.org/)
- [@nuxt/content Documentation](https://content.nuxt.com/)
- [@nuxt/ui Documentation](https://ui.nuxt.com/)
