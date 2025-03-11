# Directus Setup Instructions

This document provides instructions for setting up your Directus instance, including creating collections, configuring permissions, and seeding initial data.

## Prerequisites

1. A running Directus instance (deployed on Digital Ocean or locally via Docker)
2. Admin credentials for your Directus instance
3. Node.js installed on your local machine

## Setup Options

There are three ways to set up your Directus instance:

### Option 1: One-Step Setup (Recommended)

This option runs all setup scripts in sequence to create collections, set permissions, and seed data.

```bash
# Clone the repository locally
git clone https://github.com/yourusername/portfolio.git
cd portfolio/directus

# Install dependencies (if not already installed)
npm install

# Run the setup script with your admin credentials
DIRECTUS_ADMIN_EMAIL="your-admin-email" DIRECTUS_ADMIN_PASSWORD="your-admin-password" node setup-directus.js
```

### Option 2: Step-by-Step Setup

If you prefer to run each step individually:

```bash
# Set environment variables
export DIRECTUS_ADMIN_EMAIL="your-admin-email"
export DIRECTUS_ADMIN_PASSWORD="your-admin-password"

# 1. Create collections
node create-collections.js

# 2. Fix admin permissions
node fix-admin-permissions.js

# 3. Fix public permissions
node fix-public-permissions.js

# 4. Seed collections with data
node seed-collections.js
```

### Option 3: Manual Setup Through Admin UI

If you prefer to set up everything manually through the Directus admin UI, follow the instructions in the [MANUAL_PERMISSIONS_FIX.md](../MANUAL_PERMISSIONS_FIX.md) file.

## Script Descriptions

- **create-collections.js**: Creates the necessary collections (`blog_posts`, `projects`, `gallery`) with their respective fields.
- **fix-admin-permissions.js**: Grants full permissions to the admin role for all collections.
- **fix-public-permissions.js**: Grants read-only permissions to the public role for specific collections.
- **seed-collections.js**: Populates the collections with sample data.
- **setup-directus.js**: All-in-one script that runs all of the above scripts in sequence.

## Verifying the Setup

After running the setup, verify that everything is working correctly:

1. Log in to your Directus admin panel at `https://your-directus-url/admin`.
2. Check that the collections (`blog_posts`, `projects`, `gallery`) have been created.
3. Verify that sample content has been added to each collection.
4. Confirm that the public API endpoints are accessible:
   - `https://your-directus-url/items/blog_posts`
   - `https://your-directus-url/items/projects`
   - `https://your-directus-url/items/gallery`

## Troubleshooting

If you encounter any issues during setup:

1. **Authentication Errors**:
   - Ensure your admin email and password are correct.
   - Check that your Directus instance is running and accessible.

2. **Permission Errors**:
   - If you can't access certain collections even as an admin, run the `fix-admin-permissions.js` script.
   - If public access isn't working, run the `fix-public-permissions.js` script.

3. **API Connection Issues**:
   - Verify your Directus URL is correct in all scripts.
   - Check that CORS settings allow requests from your frontend.

4. **Collection Creation Errors**:
   - If a collection already exists, the script will skip creating it.
   - To recreate a collection, delete it first from the Directus admin panel.

## Next Steps

After setting up your Directus instance:

1. Update the `.env` file in your frontend project with the correct Directus URL.
2. Deploy your frontend to connect to Directus.
3. Replace sample content with your actual content.
4. Customize the collection schemas if needed.

## Updating Your Directus Instance

If you need to update your Directus instance to a newer version, update the Docker image tag in your Dockerfile and app.yaml files, then redeploy.

For the latest version, check the [Directus GitHub repository](https://github.com/directus/directus/releases). 