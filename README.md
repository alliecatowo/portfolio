# Allison's Dual Portfolio Website

A dual-purpose portfolio website showcasing both developer and tattoo artist portfolios under different domains (allisons.dev and allisons.gay) with shared codebase but different visual styles.

## Tech Stack

- **Frontend**: Nuxt.js 3 with Vue 3 Composition API
- **CMS**: Strapi for content management
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Vercel for the frontend, separate hosting for Strapi
- **Version Control**: Git with GitHub
- **Testing**: Vitest and Cypress

## Features

### For Both Portfolios
- Responsive design with mobile-first approach
- Dark/light mode toggle
- Blog functionality
- Portfolio/projects section
- SEO optimization
- Fast loading and performance
- Contact form

### Developer Portfolio (allisons.dev)
- Open source tools directory
- GitHub integration showing activity
- LinkedIn integration
- Skills and technologies showcase
- Projects with descriptions and links
- Resume/CV section

### Tattoo Portfolio (allisons.gay)
- Gallery of tattoo works categorized by style
- Client testimonials
- Artist bio and journey
- Design style overview

## Project Structure

```
portfolio/
├── .nuxt/               # Nuxt build files
├── assets/              # CSS, images, fonts, etc.
├── components/          # Vue components
│   ├── common/          # Shared components
│   ├── dev/             # Developer portfolio specific components
│   └── tattoo/          # Tattoo portfolio specific components
├── composables/         # Vue composables (shared logic)
├── layouts/             # Page layouts
├── pages/               # Vue pages
├── plugins/             # Vue plugins
├── public/              # Static files
├── server/              # Server-side code
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── nuxt.config.ts       # Nuxt configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Run development server
```bash
npm run dev
```

## Content Management (Strapi)

The Strapi CMS is used to manage content for both portfolios. It needs to be set up separately.

### Strapi Setup

1. Install and configure Strapi (documentation to be added)
2. Set up content types for both portfolios
3. Configure API endpoints
4. Connect frontend to Strapi backend

## Deployment

### Frontend (Vercel)

1. Push your changes to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel
4. Set up custom domains (allisons.dev and allisons.gay)

### Backend (Strapi)

1. Set up a server for Strapi (Digital Ocean, AWS, etc.)
2. Deploy Strapi instance
3. Configure SSL certificates
4. Set up database backups

## Development Guidelines

- Use atomic Git commits with meaningful messages
- Follow Vue.js best practices and style guide
- Implement proper error handling
- Optimize images and assets for performance
- Ensure WCAG 2.1 AA accessibility compliance
- Use TypeScript for type safety

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For more information, contact [dev@allisons.dev](mailto:dev@allisons.dev) or [ink@allisons.gay](mailto:ink@allisons.gay).
