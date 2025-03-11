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

## Documentation

Detailed documentation is available in the [docs](./docs) directory:

- Project setup and migration
- Deployment guides
- Permissions and security
- Troubleshooting

# Directus Collections Setup

This repository contains a Python script for automating the setup of Directus collections for Allison's portfolio website.

## Requirements

- Python 3.6+
- `requests` library

## Installation

The script requires the `requests` library. It's recommended to use a virtual environment:

```bash
# Create a virtual environment
python3 -m venv directus-venv

# Activate the virtual environment
source directus-venv/bin/activate  # On Windows: directus-venv\Scripts\activate

# Install required dependencies
pip install requests
```

## Usage

You can run the script in two ways:

### Using an Admin Token

1. Log into the Directus admin panel at https://directus.allisons.dev/admin
2. Go to your user settings (click on your profile icon)
3. Navigate to the "Token" tab
4. Create a new token with admin access
5. Run the script with the token:

```bash
# Make sure your virtual environment is activated
source directus-venv/bin/activate  # On Windows: directus-venv\Scripts\activate

# Run the script
python setup_directus.py YOUR_ADMIN_TOKEN
```

### Using Email and Password

Alternatively, you can use your Directus admin email and password:

```bash
# Make sure your virtual environment is activated
source directus-venv/bin/activate  # On Windows: directus-venv\Scripts\activate

# Run the script
python setup_directus.py your_email@example.com your_password
```

## What the Script Does

The script:

1. Creates the following collections in Directus:
   - `gallery` - For tattoo works and other visual content
   - `blog_posts` - For blog articles for both dev and tattoo portfolios
   - `projects` - For development projects and portfolio items
   - `categories` - For categorizing blog posts and projects
   - `styles` - For tattoo styles

2. Sets up appropriate fields for each collection with proper configuration

3. Sets public read permissions for all collections

4. Adds some sample test data to demonstrate the structure

## After Running the Script

After running the script, you'll need to:

1. Log into the Directus admin panel
2. Upload images for the projects, blog posts, and gallery items 
3. Customize the sample data as needed

## Troubleshooting

If you encounter issues:

- Check if the collections already exist (the script will skip existing collections)
- Verify your admin token has not expired
- Ensure the Directus API is accessible
- Check the logs for specific error messages

## Notes

This script is intended for initial setup only. If you need to make structural changes later, it's recommended to do so through the Directus admin interface.
