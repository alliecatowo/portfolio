# Digital Ocean Deployment Guide

This guide will walk you through deploying the portfolio website to Digital Ocean App Platform and configuring custom domains.

## Prerequisites

- A GitHub repository with your portfolio website code
- Digital Ocean account
- Custom domains (allisons.dev and tattoo.allisons.dev)
- Directus CMS deployed and accessible (see `directus-setup.md`)

## Deploying to Digital Ocean

### Backend Deployment (Directus)

1. **Log in to Digital Ocean**:
   - Go to [Digital Ocean](https://cloud.digitalocean.com) and log in to your account

2. **Create a new App**:
   - Click on "Apps" in the left sidebar
   - Click "Create App"
   - Choose "GitHub" as your source
   - Select your portfolio repository

3. **Configure the Directus service**:
   - Select the `/directus` directory as the source
   - Set the type to "Service"
   - Configure the build settings:
     - Build Command: `npm install`
     - Run Command: `npm start`

4. **Configure environment variables**:
   - Add all required Directus environment variables (see directus/.env.example for the full list)
   - Ensure you set database credentials, admin email/password, and security keys

5. **Add a database**:
   - Click "Add Resource" > "Database"
   - Choose PostgreSQL
   - Select appropriate plan (at least Basic)

6. **Configure the domain**:
   - Go to "Settings" > "Domains"
   - Add `directus.allisons.dev`
   - Follow instructions to update DNS settings

7. **Deploy the backend**:
   - Click "Deploy to Production"
   - Wait for the deployment to complete

### Frontend Deployment (Nuxt.js)

1. **Create a new App** (or add to existing app):
   - If adding to existing: Click on your app > "Create Component"
   - If new app: Create a new app from GitHub repository

2. **Configure the frontend service**:
   - Select the `/frontend` directory as the source
   - Set the type to "Web Service"
   - Configure the build settings:
     - Build Command: `npm run build`
     - Run Command: `node .output/server/index.mjs`

3. **Configure environment variables**:
   - Add the following environment variables:
     - `NUXT_PUBLIC_API_URL`: URL of your Directus deployment (https://directus.allisons.dev)
     - `NUXT_PUBLIC_DIRECTUS_TOKEN`: API token from your Directus instance
     - `DEV_SITE_URL`: https://allisons.dev
     - `TATTOO_SITE_URL`: https://tattoo.allisons.dev

4. **Configure the domains**:
   - Go to "Settings" > "Domains"
   - Add `allisons.dev` and `tattoo.allisons.dev`
   - Follow instructions to update DNS settings

5. **Deploy the frontend**:
   - Click "Deploy to Production"
   - Wait for the deployment to complete

## DNS Configuration

For each domain, you'll need to add DNS records at your domain registrar:

### Using Digital Ocean DNS

1. Add your domains to Digital Ocean DNS:
   - Go to "Networking" > "Domains"
   - Add your domains if not already added

2. Add required records:
   - An A record pointing to Digital Ocean's App Platform IP
   - CNAME records for subdomains

### Using External DNS

1. Add an A record:
   - Name: `@`
   - Value: Digital Ocean's App Platform IP (provided in App settings)

2. Add CNAME records:
   - Name: `directus` -> Value: Your App's API URL
   - Name: `tattoo` -> Value: Your App's API URL

## Testing the Deployment

1. **Test the backend**:
   - Visit https://directus.allisons.dev/admin
   - Log in with your admin credentials
   - Verify API accessibility with: `curl https://directus.allisons.dev/items/blog_posts`

2. **Test the developer site**:
   - Visit https://allisons.dev
   - Verify that the developer portfolio is displayed correctly

3. **Test the tattoo artist site**:
   - Visit https://tattoo.allisons.dev
   - Verify that the tattoo portfolio is displayed correctly

## Ongoing Maintenance

### Updating the Site

1. **Make changes to your code locally**
2. **Test the changes locally**:
   ```bash
   npm run dev
   ```
3. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
4. **Digital Ocean will automatically deploy the changes** if you've set up auto-deploy from GitHub

### Manual Redeployment

If you need to manually redeploy:

1. Go to your app in Digital Ocean
2. Click "Deploy" > "Deploy to Production"

## Troubleshooting

### Deployment Issues

- **Build fails**: Check the build logs in Digital Ocean for specific errors
- **Environment variables**: Ensure all required environment variables are set correctly
- **Resources**: Ensure your app has sufficient resources (CPU/Memory)

### Domain Issues

- **DNS propagation**: DNS changes can take up to 48 hours to propagate
- **SSL certificates**: Digital Ocean handles SSL automatically, but ensure your domains are properly configured

## Security Best Practices

- **Keep dependencies updated**:
  ```bash
  npm update
  ```
- **Regularly rotate API tokens**
- **Use environment variables for sensitive information**
- **Set up proper Content Security Policy headers**
- **Implement rate limiting for API endpoints**

## Performance Monitoring

- Use Digital Ocean's monitoring tools
- Set up alerts for any issues or downtime
- Regularly check Core Web Vitals
- Test the site's performance with tools like Lighthouse

## Backup Strategy

- Keep a backup of your codebase (GitHub provides this)
- Regularly backup your Directus content
- Digital Ocean provides automated backups for databases (ensure this is enabled)
- Document any custom configurations or settings 