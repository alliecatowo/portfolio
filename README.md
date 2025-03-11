# Dual Portfolio - Developer & Tattoo Artist

A full-stack portfolio application that showcases both developer and tattoo artist work in a unified platform. This project consists of a Nuxt 3 frontend and a Strapi CMS backend.

## Features

- **Dual Mode**: Toggle between developer and tattoo artist portfolios
- **Developer Portfolio**: Showcase projects, blog posts, and open source contributions
- **Tattoo Portfolio**: Display tattoo works, gallery, and testimonials
- **Content Management**: Full CMS capabilities with Strapi
- **Responsive Design**: Mobile-first approach with dark mode support

## Tech Stack

### Frontend
- **Nuxt 3**: Vue-based framework for server-side rendering and static site generation
- **Vue 3**: Progressive JavaScript framework
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript

### Backend
- **Strapi**: Headless CMS for content management
- **Node.js**: JavaScript runtime
- **PostgreSQL**: Relational database (configurable)

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL (optional, SQLite works for development)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies for both frontend and backend
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables
```bash
# In the backend directory
cp .env.example .env
# Edit .env with your database credentials and other settings

# In the frontend directory
cp .env.example .env
# Edit .env with your API URL and other settings
```

4. Start the development servers
```bash
# Use the convenient startup script from the root directory
./start-portfolio.sh
```

Or start each service individually:

```bash
# Start Strapi backend
cd backend
npm run develop

# Start Nuxt frontend
cd frontend
npm run dev
```

5. Access the applications:
   - Frontend: http://localhost:3000
   - Strapi Admin: http://localhost:1337/admin

## Seeding Data

To populate the database with sample data:

```bash
cd backend
npm run seed
```

## Deployment

### Vercel Deployment

1. Install Vercel CLI
```bash
npm install -g vercel
```

2. Deploy the frontend
```bash
cd frontend
vercel
```

3. Deploy the backend
```bash
cd backend
vercel
```

4. Connect your frontend to the deployed backend by updating the environment variables in the Vercel dashboard or using the following command:
```bash
vercel env add NUXT_PUBLIC_API_URL https://your-strapi-backend-url.com
```

## Project Structure

```
portfolio/
├── backend/              # Strapi CMS
│   ├── api/              # Content types and routes
│   ├── config/           # Configuration files
│   ├── scripts/          # Utility scripts
│   └── public/           # Public assets
├── frontend/             # Nuxt 3 application
│   ├── assets/           # Static assets
│   ├── components/       # Vue components
│   ├── layouts/          # Page layouts
│   ├── pages/            # Application pages
│   ├── public/           # Public directory
│   ├── utils/            # Utility functions
│   │   └── api/          # API integration
│   └── middleware/       # Route middleware
└── start-portfolio.sh    # Convenience script to start both services
```

## Content Type Structure

### Developer Portfolio
- **Projects**: Development projects with details and technologies
- **Articles**: Blog posts for development topics
- **Categories**: For organizing projects and articles

### Tattoo Portfolio
- **Tattoo Works**: Showcase of tattoo designs
- **Styles**: Different tattoo styles
- **Testimonials**: Client testimonials

## License

MIT

## Acknowledgements

- [Nuxt.js](https://nuxt.com)
- [Strapi](https://strapi.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Vue.js](https://vuejs.org)

## CMS Setup

This portfolio uses [Directus](https://directus.io/) as a headless CMS to manage content. The CMS is deployed on DigitalOcean App Platform.

### Setup Documentation

- [Directus Setup Instructions](./directus/SETUP_INSTRUCTIONS.md) - Comprehensive guide for setting up Directus
- [Manual Permissions Fix](./MANUAL_PERMISSIONS_FIX.md) - Guide for manually fixing permissions in Directus
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Solutions for common issues with Directus and frontend integration

### Scripts

The following scripts are available to automate the Directus setup:

- `directus/create-collections.js` - Creates necessary collections in Directus
- `directus/fix-admin-permissions.js` - Fixes admin permissions
- `directus/fix-public-permissions.js` - Sets up public permissions
- `directus/seed-collections.js` - Seeds collections with sample data
- `directus/setup-directus.js` - All-in-one setup script

### Updating Directus

To update Directus to a newer version:

1. Update the base image in `directus/Dockerfile`
2. Update the image tag in `directus/.do/app.yaml`
3. Redeploy to DigitalOcean
