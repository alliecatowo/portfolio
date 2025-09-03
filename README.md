# Allison's Portfolio

A modern developer portfolio built with Nuxt 4, showcasing software engineering projects and technical expertise.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 22.x or later
- **pnpm** 9.x or later
- **Git**
- (Optional) **mise** for automatic tool version management

### Installation

```bash
# Clone the repository
git clone https://github.com/alliecatowo/portfolio.git
cd portfolio

# Install dependencies using pnpm
pnpm install

# Start the development server
pnpm dev
```

The application will be available at http://localhost:3000

### Development Commands

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

# Linting
pnpm lint
pnpm lint:fix
```

## 🏗️ Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) with Vue 3
- **Content Management**: [@nuxt/content](https://content.nuxt.com/) with native SQLite backend
- **Styling**: [@nuxt/ui](https://ui.nuxt.com/) (TailwindCSS-based component library)
- **Authentication**: Minimal [Pinia](https://pinia.vuejs.org/) for admin auth
- **Deployment**: [Firebase Hosting](https://firebase.google.com/products/hosting)
- **CI/CD**: GitHub Actions with automated preview, staging, and production deployments
- **Package Manager**: pnpm with workspaces
- **Environment Management**: mise for consistent tool versions
- **Code Quality**: TypeScript, ESLint, Prettier, Husky, lint-staged

## 📁 Project Structure

```
portfolio/
├── app/                    # Nuxt 4 application
│   ├── components/        # Vue components
│   ├── content/          # Markdown content files
│   ├── layouts/          # Page layouts
│   ├── pages/           # File-based routing
│   ├── public/          # Static assets
│   └── utils/           # Utilities and helpers
├── .github/             # CI/CD workflows
└── firebase.json       # Firebase hosting config
```

## ✨ Features

- **Static Site Generation** with ISR (Incremental Static Regeneration)
- **Content Management** using file-based Markdown with @nuxt/content
- **Responsive Design** with modern UI components
- **SEO Optimized** with automatic sitemap and meta tags
- **Performance Focused** with image optimization and caching
- **Type Safe** with full TypeScript integration

## 🔗 Live Sites

- **Production**: https://allisons.dev (live channel - releases only)
- **Staging**: https://allie-portfolio-project--staging-o21oschp.web.app (reflects main branch)
- **Preview**: Automatic temporary deployments for pull requests

## ⚡ CI/CD Pipeline

Optimized GitHub Actions workflow with caching and parallel execution:

```
PRs → Temporary preview channels (7-day expiry)
main → Permanent staging channel (always up-to-date)
releases → Production live channel (stable releases)
```

**Features:**

- **Smart Caching** - node_modules and pnpm store caching
- **Parallel Jobs** - typecheck, lint, and deploy run in parallel
- **Manual Claude Review** - On-demand code reviews via workflow dispatch
- **Environment Separation** - Dedicated staging and production channels

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits
4. Push to your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

All PRs are automatically validated with typecheck, linting, and preview deployments.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

Built with love using amazing open-source technologies and tools from the Vue, Nuxt, and broader web development community.
