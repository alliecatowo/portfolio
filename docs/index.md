# Portfolio Documentation

Comprehensive documentation for the multi-site portfolio project built with Nuxt 4, Firebase, and modern CI/CD practices.

## 📚 Documentation Index

### Getting Started

- [Development Guide](./development.md) - Complete setup, workflow, and development practices
- [Quick Start](#quick-start) - Get up and running in minutes

### Architecture & Design

- [Multi-Site System](#multi-site-architecture) - How the dual portfolio system works
- [Tech Stack](#tech-stack) - Technologies and tools used
- [Project Structure](#project-structure) - File organization and conventions

### Deployment & DevOps

- [CI/CD Pipeline](#cicd-pipeline) - World-class parallel CI/CD with GitHub Actions
- [Firebase Hosting](#firebase-deployment) - Hosting configuration and deployment
- [Branch Strategy](#branch-workflow) - Git workflow and deployment triggers

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/alliecatowo/portfolio.git
cd portfolio
pnpm install

# Start development
pnpm dev
# → http://localhost:3000
```

## 🏗️ Multi-Site Architecture

The portfolio serves three distinct experiences:

- **Developer Portfolio** (`/dev/*`) - Technical projects and engineering blog
- **Tattoo Portfolio** (`/tattoo/*`) - Art gallery and creative content
- **Dual Mode** (root `/`) - Combined showcase of both skill sets

Routes automatically detect context and apply appropriate theming and content filtering.

## 🛠️ Tech Stack

- **Framework**: Nuxt 4 (Vue 3, TypeScript)
- **Content**: @nuxt/content with native SQLite backend
- **UI**: @nuxt/ui (TailwindCSS-based components)
- **Deployment**: Firebase Hosting with GitHub Actions CI/CD
- **Package Management**: pnpm workspaces with mise version management

## 📁 Project Structure

```
portfolio/
├── frontend/           # Nuxt 4 application
│   ├── components/    # Vue components (common, dev, tattoo)
│   ├── content/      # Markdown content files
│   ├── pages/        # File-based routing
│   └── utils/        # Site configuration and utilities
├── .github/          # Parallel CI/CD workflows
├── docs/            # This documentation
└── firebase.json    # Hosting configuration
```

## ⚡ CI/CD Pipeline

Parallel CI/CD with atomic job isolation:

```
setup (deps + cache)
    ↓
PARALLEL: typecheck, lint, build, test, commitlint
    ↓
PARALLEL: firebase-preview (PR), firebase-production (releases)
```

**Features:**

- Faster execution through parallel jobs
- Colored terminal output in CI logs
- Independent job failures with clear error reporting
- Shared build artifacts across deployment jobs

## 🚢 Firebase Deployment

**Channels:**

- **Preview**: Automatic PR deployments (7-day expiry)
- **Staging**: Auto-deploy from `main` branch (30-day expiry)
- **Production**: Release/tag based deployments

**Static Site Generation** with ISR caching for dynamic content.

## 🔄 Branch Workflow

```
feature/name → PR → main → production
     ↓           ↓      ↓        ↓
  preview    CI checks  staging  release
```

All branches require passing CI checks (parallel typecheck, lint, build, test).

## 🧑‍💻 Development

**Essential Commands:**

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm typecheck  # TypeScript validation
pnpm lint       # ESLint with --color support
```

**Multi-Site Testing:**

- http://localhost:3000 (dual mode)
- http://localhost:3000/dev (developer portfolio)
- http://localhost:3000/tattoo (tattoo portfolio)

See [development.md](./development.md) for comprehensive development guide.
