# Portfolio Project

This repository contains the code for a multi-site portfolio with a headless CMS.

## Architecture

The portfolio consists of two main components:

1. **Frontend** - Built with Nuxt.js, provides the user-facing sites
2. **Directus** - Headless CMS that stores and manages content

## Prerequisites

- Node.js 16 or later
- npm or yarn
- A DigitalOcean account (for Directus hosting)
- A Vercel account (for frontend hosting)

## Local Development Setup

### Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at http://localhost:3000.

### Directus

For local development with the Directus API, you need to have the proper environment variables set up in the `.env` file:

```
# Navigate to the directus directory
cd directus

# Copy the example environment file
cp .env.example .env

# Edit the .env file with your database credentials and admin user details
```

## Directus Setup

Directus is hosted on DigitalOcean and can be accessed at https://allisons-portfolio-directus-9vxdi.ondigitalocean.app.

### Database Schema

The database schema is defined in `directus/portfolio-schema.yaml`. This file can be used to apply changes to the Directus instance:

```bash
cd directus
npx directus schema apply ./portfolio-schema.yaml
```

### Collections

The portfolio uses the following main collections:

- **blog_posts** - Blog articles
- **projects** - Portfolio projects
- **gallery** - Image gallery items

### Permissions

Permissions are defined in the schema file. There are two main roles:

1. **Administrator** - Full access to all collections
2. **Public** - Read-only access to specific collections for the frontend

For manual permission setup, refer to the `MANUAL_PERMISSIONS_FIX.md` file.

## Deployment

### Frontend (Vercel)

The frontend is deployed to Vercel. See `VERCEL_DEPLOYMENT.md` for detailed instructions on setting up the environment variables and deploying the frontend.

### Directus (DigitalOcean)

Directus is deployed to DigitalOcean App Platform. The instance is already configured and running at https://allisons-portfolio-directus-9vxdi.ondigitalocean.app.

## Environment Variables

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```
NUXT_PUBLIC_API_URL=https://allisons-portfolio-directus-9vxdi.ondigitalocean.app
NUXT_PUBLIC_DIRECTUS_TOKEN=YOUR_DIRECTUS_ACCESS_TOKEN
DEV_SITE_URL=http://localhost:3000
TATTOO_SITE_URL=http://localhost:3000
```

### Directus Environment Variables

The Directus instance on DigitalOcean already has the necessary environment variables configured. For local development, see the section above.

## Files and Directories

- `/frontend` - Nuxt.js frontend application
- `/directus` - Directus configuration and schema files
- `VERCEL_DEPLOYMENT.md` - Guide for deploying to Vercel
- `MANUAL_PERMISSIONS_FIX.md` - Guide for manually fixing permissions in Directus
- `CLI_COMMANDS.md` - Reference for useful CLI commands

## Troubleshooting

If you encounter issues, refer to the `TROUBLESHOOTING.md` file for common problems and solutions.

## Useful Commands

```bash
# Start frontend development server
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build

# Apply Directus schema
cd directus && npx directus schema apply ./portfolio-schema.yaml

# Export Directus schema
cd directus && npx directus schema snapshot ./portfolio-schema.yaml

# Check if Directus API is accessible
curl -s -L "https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/items/blog_posts?access_token=YOUR_TOKEN" | head -20
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
