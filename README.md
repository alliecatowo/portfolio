# Allison's Portfolio

A multi-site portfolio showcasing development and tattoo artistry work, built with Nuxt 4 and modern web technologies.

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
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Deployment**: [Firebase Hosting](https://firebase.google.com/products/hosting)
- **CI/CD**: GitHub Actions with automated preview, staging, and production deployments
- **Package Manager**: pnpm with workspaces
- **Environment Management**: mise for consistent tool versions
- **Code Quality**: TypeScript, ESLint, Prettier, Husky, lint-staged

## 📁 Project Structure

```
portfolio/
├── frontend/               # Nuxt 4 application
│   ├── components/        # Vue components (common, dev, tattoo)
│   ├── content/          # Markdown content files
│   ├── layouts/          # Page layouts
│   ├── middleware/       # Route middleware
│   ├── pages/           # File-based routing
│   ├── public/          # Static assets
│   ├── server/          # Server API routes
│   └── utils/           # Utility functions
├── .github/             # GitHub Actions workflows
├── docs/               # Project documentation
└── firebase.json       # Firebase configuration
```

## 🎨 Multi-Site Architecture

This portfolio dynamically serves three different experiences based on the URL path:

1. **Developer Portfolio** (`/dev/*`) - Software engineering projects and technical blog
2. **Tattoo Portfolio** (`/tattoo/*`) - Tattoo artistry gallery and artistic blog
3. **Dual Mode** (root `/`) - Combined portfolio experience

The site automatically detects the context and applies appropriate theming and content filtering.

## 🔗 Live Sites

- **Production**: https://allisons.dev
- **Staging**: Auto-deployed from main branch to staging channel
- **Preview**: Automatic deployments for pull requests

## ⚡ CI/CD Pipeline

Parallel CI/CD with atomic job isolation:

```
setup (deps + cache) → PARALLEL jobs → deployments
```

**Features:**

- Faster execution through parallel jobs
- Colored terminal output in CI logs
- Independent job failures with clear error reporting
- Shared build artifacts for efficient deployments

### Deployment Strategy

- **Preview**: Automatic PR deployments → 7-day expiry
- **Staging**: Auto-deploy from `main` → 30-day expiry
- **Production**: Release/tag triggered → Live site

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs) directory:

- [📖 Documentation Index](./docs/index.md) - Complete documentation overview
- [🚀 Development Guide](./docs/development.md) - Setup, workflow, and best practices

## 🤝 Contributing

Contributions are welcome! Please follow the [Development Guide](./docs/development.md) for setup and workflow practices. Create feature branches and submit pull requests for review.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

Built with love using amazing open-source technologies and tools from the Vue, Nuxt, and broader web development community.
