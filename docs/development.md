# Development Guide

This guide covers the development setup, workflow, and best practices for the portfolio project.

## 📋 Prerequisites

### Required Tools

- **Node.js** 22.x or later
- **pnpm** 9.x or later
- **Git** (latest version)

### Recommended Tools

- **mise** - Tool version management (automatically installs correct Node/pnpm versions)
- **VS Code** - Recommended editor with extensions:
  - Vue Language Features (Volar)
  - TypeScript Vue Plugin (Volar)
  - Nuxt
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier

### System Requirements

- **Operating System**: macOS, Linux, or Windows (with WSL2)
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 1GB free space for dependencies

## 🚀 Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/alliecatowo/portfolio.git
cd portfolio
```

### 2. Tool Version Management (Optional but Recommended)

Install mise for automatic tool version management:

```bash
# Install mise (macOS)
curl https://mise.run | sh

# Install mise (Linux)
curl https://mise.run | sh

# The project's mise.toml will automatically install correct versions
mise install
```

### 3. Install Dependencies

```bash
# Install all dependencies using pnpm workspaces
pnpm install

# Or install frontend dependencies only
cd frontend && pnpm install
```

### 4. Environment Configuration

Create environment files:

```bash
# Root level (optional)
cp .env.example .env

# Frontend environment
cd frontend
touch .env
```

Add the following to `frontend/.env`:

```env
# Required for multi-site routing
DEV_SITE_URL=http://localhost:3000
TATTOO_SITE_URL=http://localhost:3000

# Optional: Public site URL
NUXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Enable debug mode
DEBUG=true
```

### 5. Start Development Server

```bash
# From project root (recommended)
pnpm dev

# Or from frontend directory
cd frontend && pnpm dev
```

The application will be available at http://localhost:3000

## 🔄 Development Workflow

### Branch Strategy

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes and Test**

   ```bash
   # Run type checking
   pnpm typecheck

   # Run linting
   pnpm lint

   # Test build
   pnpm build
   ```

3. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

4. **Push and Create PR**
   ```bash
   git push -u origin feature/your-feature-name
   gh pr create --title "feat: Your Feature" --body "Description"
   ```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature
git commit -m "feat: add user authentication"

# Bug fix
git commit -m "fix: resolve login redirect issue"

# Documentation
git commit -m "docs: update installation guide"

# Refactoring
git commit -m "refactor: restructure components directory"

# Chore
git commit -m "chore: update dependencies"
```

## 🛠️ Development Commands

### Essential Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Generate static site
pnpm generate

# Preview production build
pnpm preview

# Type checking
pnpm typecheck

# Linting and formatting
pnpm lint
pnpm lint:fix
```

### Database Commands

```bash
# Clean SQLite database (fixes corruption)
cd frontend && pnpm run db:clean

# Rebuild database from scratch
cd frontend && pnpm run db:rebuild

# Start dev server with clean database
cd frontend && pnpm run dev:clean

# Clear all caches and reinstall
rm -rf .nuxt .output frontend/.nuxt
pnpm install
```

## 📝 Code Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper types for all props and data
- Use Vue 3 Composition API with `<script setup>`
- Leverage auto-imports for utilities and composables

```vue
<script setup lang="ts">
  interface Props {
    title: string
    items?: string[]
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
  })

  const emit = defineEmits<{
    select: [value: string]
  }>()
</script>
```

### Vue Components

- Use PascalCase for component names
- Prefer composition over options API
- Use `defineProps` and `defineEmits` for component interface
- Keep components focused and single-purpose

### Styling

- Use @nuxt/ui components when possible
- Follow TailwindCSS utility-first approach
- Use CSS variables for theming
- Avoid custom CSS unless necessary

```vue
<template>
  <UCard class="max-w-md">
    <template #header>
      <h3 class="text-lg font-semibold">{{ title }}</h3>
    </template>

    <p class="text-gray-600 dark:text-gray-400">
      {{ description }}
    </p>
  </UCard>
</template>
```

### File Organization

```
components/
├── common/          # Shared components
│   ├── BaseButton.vue
│   └── TheHeader.vue
├── dev/            # Developer portfolio specific
│   └── ProjectCard.vue
└── tattoo/         # Tattoo portfolio specific
    └── GalleryGrid.vue

composables/        # Reusable composition functions
├── useAuth.ts
└── useSiteConfig.ts

utils/             # Pure utility functions
├── formatters.ts
└── validators.ts
```

## 🧪 Testing & Quality

### Pre-commit Hooks

The project uses Husky and lint-staged to ensure code quality:

- **TypeScript checking** on relevant files
- **ESLint** with auto-fix for JS/TS/Vue files
- **Prettier** formatting for styles and config files

### Manual Testing

```bash
# Run all quality checks
pnpm typecheck && pnpm lint && pnpm build

# Test multi-site functionality
# Visit http://localhost:3000 (dual mode)
# Visit http://localhost:3000/dev (dev portfolio)
# Visit http://localhost:3000/tattoo (tattoo portfolio)
```

### Content Testing

```bash
# Test content rendering across all sites:
# http://localhost:3000/dev/blog (dev blog posts)
# http://localhost:3000/tattoo/blog (tattoo blog posts)
# http://localhost:3000/blog (dual mode blog posts)

# Add test content to frontend/content/
# Verify frontmatter parsing and metadata display
```

## 🐛 Debugging

### Common Issues

1. **Port 3000 in use**

   ```bash
   PORT=3001 pnpm dev
   ```

2. **Hot reload not working**

   ```bash
   rm -rf .nuxt
   pnpm dev
   ```

3. **TypeScript errors**

   ```bash
   pnpm typecheck
   # Fix reported issues
   ```

4. **Content database corruption**
   ```bash
   cd frontend && pnpm run db:clean
   pnpm dev
   ```

### Debug Tools

- **Vue DevTools**: Browser extension for Vue debugging
- **Nuxt DevTools**: Built-in debugging tools (enabled in dev mode)
- **Network Tab**: Monitor API requests and static assets
- **Console Logging**: Use `console.log` sparingly, prefer Vue DevTools

### Performance Profiling

```bash
# Build with analyze flag
cd frontend
pnpm build --analyze

# Check lighthouse scores
npx lighthouse http://localhost:3000

# Monitor dev server performance
pnpm dev --debug
```

## 📱 Development Tips

### Multi-Site Testing

Test all three site modes during development:

1. **Dual Mode**: http://localhost:3000
2. **Dev Portfolio**: http://localhost:3000/dev
3. **Tattoo Portfolio**: http://localhost:3000/tattoo

### Content Development

- Use proper frontmatter in all markdown files
- Test content with different amounts of text/images
- Verify SEO meta tags are generated correctly
- Check responsive behavior on all screen sizes

### Performance Considerations

- Monitor bundle size during development
- Use dynamic imports for large components
- Optimize images before adding to public directory
- Test with throttled network speeds

### Browser Support

Test in multiple browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔧 IDE Configuration

### VS Code Settings

Recommended `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "vue.inlayHints.missingProps": true,
  "vue.inlayHints.optionsWrapper": true
}
```

### Extensions

Install recommended extensions for the best development experience:

- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- Nuxt
- Tailwind CSS IntelliSense
- ESLint
- Prettier - Code formatter

## 📚 Resources

- [Nuxt 4 Documentation](https://nuxt.com/)
- [Vue 3 Guide](https://vuejs.org/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [@nuxt/ui Components](https://ui.nuxt.com/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
