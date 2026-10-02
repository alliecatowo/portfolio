# Allison's Portfolio

<div align="center">

[![Production Deploy](https://github.com/alliecatowo/portfolio/actions/workflows/production-deploy.yml/badge.svg)](https://github.com/alliecatowo/portfolio/actions/workflows/production-deploy.yml)
[![CI](https://github.com/alliecatowo/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/alliecatowo/portfolio/actions/workflows/ci.yml)
[![Built with Nuxt](https://img.shields.io/badge/Built%20with-Nuxt%204-00DC82.svg?logo=nuxt.js)](https://nuxt.com/)
[![Managed with mise](https://img.shields.io/badge/Managed%20with-mise-FF6B6B.svg)](https://mise.jdx.dev/)

**🚀 [Production](https://allisons.dev) • 🧪 [Staging](https://allie-portfolio-project--staging-o21oschp.web.app)**

_A modern developer portfolio built with Nuxt 4, showcasing software engineering projects and technical expertise._

</div>

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

- **Framework**: [Nuxt 4](https://nuxt.com/) with Vue 3 and TypeScript
- **Content Management**: [@nuxt/content](https://content.nuxt.com/) with native SQLite backend
- **Styling**: [@nuxt/ui](https://ui.nuxt.com/) (TailwindCSS-based component library)
- **Deployment**: [Firebase Hosting](https://firebase.google.com/products/hosting) with channel-based environments
- **CI/CD**: GitHub Actions with automated preview, staging, and production deployments
- **Tool Management**: [mise](https://mise.jdx.dev/) for automatic Node.js and pnpm version management
- **Package Manager**: [pnpm](https://pnpm.io/) with workspaces and optimized caching
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks, lint-staged

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

- **Production**: https://allisons.dev (live channel - main branch)
- **Staging**: https://allie-portfolio-project--staging-o21oschp.web.app (reflects main branch)
- **Preview**: Automatic temporary deployments for pull requests

## ⚡ CI/CD Pipeline

Optimized GitHub Actions workflow with intelligent caching and parallel execution:

```
📝 Pull Requests    → 🔍 Preview channels (7-day auto-expiry)
🔄 Main branch      → 🧪 Staging environment + 🚀 Production deployment
🕹️ Manual dispatch  → 🔁 Optional redeploy of any ref
```

**Pipeline Features:**

- **🚀 Smart Caching** - pnpm store and node_modules with cache restoration
- **⚡ Parallel Execution** - typecheck, lint, and build jobs run concurrently
- **🔒 Environment Protection** - Staging and production use protected environments
- **🎯 Channel Isolation** - Firebase hosting channels provide URL isolation
- **📊 Status Monitoring** - Real-time deployment status via GitHub badges

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits
4. Push to your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

All PRs are automatically validated with typecheck, linting, and preview deployments.

## 📄 License

This repository is dual-licensed:

- **Source code** is licensed under the [MIT License](./LICENSE).
- **Content** (`content/` blog posts, project write-ups and page copy, plus personal images and media in `public/` such as photos, the avatar, project captures and OG images) is licensed under [CC BY-NC-ND 4.0](./LICENSE-CONTENT). Please don't republish or adapt the writing.

## 🙏 Acknowledgments

Built with love using amazing open-source technologies and tools from the Vue, Nuxt, and broader web development community.
