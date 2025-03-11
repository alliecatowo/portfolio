# Deployment Guide

This guide will walk you through deploying the portfolio website to Vercel and configuring the custom domains.

## Prerequisites

- A GitHub repository with your portfolio website code
- Vercel account (free tier is sufficient)
- Custom domains (allisons.dev and allisons.gay)
- Strapi CMS deployed and accessible (see `strapi-setup.md`)

## Deploying to Vercel

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Log in to Vercel**:
   - Go to [Vercel](https://vercel.com) and log in or create an account
   - Connect your GitHub account if you haven't already

3. **Create a new project**:
   - Click on "Add New" > "Project"
   - Import the portfolio repository from GitHub
   - Configure the project:
     - **Framework Preset**: Nuxt.js
     - **Build Command**: npm run build
     - **Output Directory**: .output/public

4. **Configure environment variables**:
   - Add the following environment variables:
     - `STRAPI_URL`: URL of your Strapi deployment
     - `STRAPI_TOKEN`: API token for accessing your Strapi content
     - `DEV_SITE_URL`: https://allisons.dev
     - `TATTOO_SITE_URL`: https://allisons.gay

5. **Deploy the project**:
   - Click "Deploy"
   - Wait for the deployment to complete

## Configuring Custom Domains

### Adding Domains to Vercel

1. **Go to your project settings**:
   - Navigate to your project in Vercel
   - Click on "Settings" > "Domains"

2. **Add allisons.dev domain**:
   - Click "Add"
   - Enter `allisons.dev`
   - Follow the instructions to configure DNS settings

3. **Add allisons.gay domain**:
   - Click "Add"
   - Enter `allisons.gay`
   - Follow the instructions to configure DNS settings

### DNS Configuration

For each domain, you'll need to add DNS records at your domain registrar:

#### Option 1: Using Vercel DNS

1. Transfer your domain's nameservers to Vercel:
   - Set nameservers to Vercel's nameservers (provided in Vercel's domain settings)

#### Option 2: Using External DNS

1. Add an A record:
   - Name: `@`
   - Value: Vercel's IP address (provided in Vercel's domain settings)

2. Add a CNAME record:
   - Name: `www`
   - Value: `cname.vercel-dns.com`

## Testing the Deployment

1. **Test the developer site**:
   - Visit https://allisons.dev
   - Verify that the developer portfolio is displayed correctly

2. **Test the tattoo artist site**:
   - Visit https://allisons.gay
   - Verify that the tattoo portfolio is displayed correctly

3. **Test the content**:
   - Verify that content from Strapi is loading correctly
   - Test the site on different devices and browsers to ensure responsiveness

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
4. **Vercel will automatically deploy the changes**

### Updating Content

1. **Log in to your Strapi admin panel**
2. **Make changes to your content**
3. **The changes will be reflected on the live site based on your revalidation settings**

## Troubleshooting

### Deployment Issues

- **Build fails**: Check the build logs in Vercel for specific errors
- **Environment variables**: Ensure all required environment variables are set correctly
- **Dependencies**: Make sure all dependencies are properly specified in package.json

### Domain Issues

- **DNS propagation**: DNS changes can take up to 48 hours to propagate
- **SSL certificates**: Vercel handles SSL automatically, but ensure your domains are properly configured
- **Redirect issues**: Check your redirect rules in nuxt.config.ts

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

- Use Vercel Analytics to monitor site performance
- Set up alerts for any issues or downtime
- Regularly check Core Web Vitals
- Test the site's performance with tools like Lighthouse

## Backup Strategy

- Keep a backup of your codebase (GitHub provides this)
- Regularly backup your Strapi content
- Document any custom configurations or settings 