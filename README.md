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

## 🚢 Deployment

The project uses a sophisticated CI/CD pipeline:

### Branch Strategy

- `feature/*` → Pull Request → Preview deployment (7-day expiry)
- `main` → Auto-deploy to staging channel (30-day expiry)
- `production` → Deploy on release/tag

### Automated Workflows

- **CI Checks**: TypeScript, linting, build validation on every PR
- **Preview Deployments**: Automatic Firebase preview for PRs
- **Staging Deployment**: Auto-deploy main branch changes
- **Production Release**: Tag-based production deployments

## 📚 Documentation

Detailed documentation is available in the [`docs/`](./docs) directory:

- [Development Guide](./docs/development.md) - Setup and development workflow
- [Architecture Overview](./docs/architecture.md) - System design and structure
- [Deployment Guide](./docs/deployment.md) - CI/CD and deployment processes
- [Contributing Guide](./docs/contributing.md) - How to contribute to the project
- [Troubleshooting](./docs/troubleshooting.md) - Common issues and solutions

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./docs/contributing.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

Built with love using amazing open-source technologies and tools from the Vue, Nuxt, and broader web development community.
