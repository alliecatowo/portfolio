# Troubleshooting Guide

This document provides solutions for common issues you might encounter with the Portfolio project.

## Frontend Issues

### Build Errors

#### Failed Build on Digital Ocean

If your build fails on Digital Ocean, check the following:

- Check build logs in Digital Ocean App Platform for specific error messages
- Verify that all environment variables are correctly set in your app settings
- Ensure that the build command is set to `npm run build`
- Verify that your node version is compatible (at least Node.js 16)

#### Local Build Fails

If your local build fails:

- Update Node.js to latest LTS version
- Delete `node_modules` and reinstall dependencies:
  ```bash
  rm -rf node_modules
  npm install
  ```
- Check for errors in your custom components or configuration

### Content Not Loading

If content is not loading from Directus:

- Check that environment variables are set correctly:
  ```
  NUXT_PUBLIC_API_URL=https://directus.allisons.dev
  NUXT_PUBLIC_DIRECTUS_TOKEN=your_token
  ```
- Check the browser console for API errors
- Verify that the Directus API is accessible
- Check that CORS is configured correctly in Directus

### Deployment Issues

If you experience issues after deployment:

- Check Digital Ocean logs for errors
- Ensure all required environment variables are set
- Verify that your domains are correctly configured
- Check for issues with the Digital Ocean App Platform configuration

## Directus Issues

### Authentication Problems

If you can't log in to Directus:

- Try resetting your password
- Verify that the Directus instance is running
- Check the database connection

### API Access Issues

If you can't access the Directus API:

- Check that the token is valid
- Verify that the collection permissions are set correctly
- Check that the API URL is correct

### Migration Issues

If you encounter issues with database migrations:

- Check the Directus logs
- Verify that your database has sufficient privileges
- Ensure the schema files are valid

## Performance Issues

### Slow Page Loading

If pages are loading slowly:

- Check the Network tab in browser devtools to identify slow requests
- Optimize image sizes
- Implement proper caching strategies
- Consider using a CDN for static assets

### High Memory Usage

If you notice high memory usage:

- Check for memory leaks in your custom code
- Monitor resource usage in Digital Ocean dashboard
- Consider upgrading your Digital Ocean resources if necessary

## Network Issues

### CORS Errors

If you see CORS errors in the console:

- Verify that the Digital Ocean app has appropriate CORS settings
- Check that the frontend is requesting from the correct API URL
- Update the CORS utility in `frontend/utils/cors.ts` if needed

### SSL Issues

If you experience SSL-related errors:

- Ensure that your domains are correctly configured in Digital Ocean
- Wait for SSL certificates to be provisioned (can take a few minutes)
- Avoid mixed content by ensuring all resources use HTTPS

## Contact Support

If you're unable to resolve your issue using this guide, you can:

1. Check the Digital Ocean status page: https://status.digitalocean.com/
2. Contact Digital Ocean support through your account dashboard
3. Check for similar issues in the Directus or Nuxt.js GitHub repositories

## Command Reference

```bash
# Check Directus API access
curl -s -L "https://directus.allisons.dev/items/blog_posts?access_token=YOUR_TOKEN" | head

# Check Digital Ocean app logs
doctl apps logs YOUR_APP_ID

# Test build locally
cd frontend && npm run build

# Troubleshoot Nuxt cache issues
rm -rf frontend/.nuxt frontend/.output

# Check for DNS propagation
dig allisons.dev
```

## Checking Directus API Connection

First, verify that your Directus API is accessible:

```bash
curl -v https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/server/info
```

You should get a 200 response with JSON information about the Directus server.

## Common Issues and Solutions

### 1. Collections Not Available or Empty

**Symptoms:**
- No data appears in the frontend
- API endpoints return empty arrays

**Solutions:**
- Check that collections exist in Directus admin panel
- Run the setup scripts to create and seed collections:
  ```bash
  cd directus
  DIRECTUS_ADMIN_EMAIL="your-email" DIRECTUS_ADMIN_PASSWORD="your-password" node setup-directus.js
  ```
- Manually create collections by following the instructions in `SETUP_INSTRUCTIONS.md`

### 2. Permission Issues

**Symptoms:**
- "Forbidden" errors in API requests
- Data visible in admin but not accessible via API

**Solutions:**
- Check permissions for the public role by running:
  ```bash
  cd directus
  DIRECTUS_ADMIN_EMAIL="your-email" DIRECTUS_ADMIN_PASSWORD="your-password" node fix-public-permissions.js
  ```
- Manually set permissions by following the instructions in `MANUAL_PERMISSIONS_FIX.md`
- Verify that each collection has read permissions for the public role

### 3. Frontend Not Connecting to Directus

**Symptoms:**
- Network errors in browser console
- Empty data in frontend components

**Solutions:**
- Check that environment variables are set correctly in Vercel:
  ```
  NUXT_PUBLIC_API_URL=https://allisons-portfolio-directus-9vxdi.ondigitalocean.app
  ```
- Make sure CORS is properly configured in Directus
  - The `CORS_ORIGIN` environment variable should include your frontend URL
- Redeploy frontend to Vercel:
  ```bash
  cd frontend
  vercel --prod
  ```

### 4. Directus Admin Access Issues

**Symptoms:**
- Cannot log in to admin panel
- Admin cannot access collections

**Solutions:**
- Reset admin permissions:
  ```bash
  cd directus
  DIRECTUS_ADMIN_EMAIL="your-email" DIRECTUS_ADMIN_PASSWORD="your-password" node fix-admin-permissions.js
  ```
- Check the Directus logs on Digital Ocean App Platform console

### 5. Image/Asset URL Issues

**Symptoms:**
- Images not displaying on frontend
- Broken image links

**Solutions:**
- Make sure the `directus_files` collection has public read access
- Check that the image URL format is correct in frontend code:
  ```js
  // Should be using getImageUrl from useDirectus
  const { getImageUrl } = useDirectus();
  const imageUrl = getImageUrl(fileId);
  ```
- Verify that the `PUBLIC_URL` is set correctly in Directus environment variables

## Debugging Tools

### Browser Network Tab

1. Open your browser's developer tools (F12 or Ctrl+Shift+I)
2. Go to the Network tab
3. Refresh the page
4. Look for requests to your Directus API
   - Check status codes (200 = success, 403 = permission issue, 404 = not found)
   - Examine response data

### Directus API Explorer

1. Log in to Directus admin panel
2. Go to Settings > API Explorer
3. Test API endpoints directly
4. Compare responses with what you expect

### Curl Commands for API Testing

Test blog posts API:
```bash
curl -v https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/items/blog_posts
```

Test projects API:
```bash
curl -v https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/items/projects
```

Test gallery API:
```bash
curl -v https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/items/gallery
```

## Verifying a Working Setup

When everything is working correctly:

1. You should be able to access:
   - Admin panel: `https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/admin/`
   - Public API: `https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/items/projects`

2. The frontend should display data from all collections:
   - Projects
   - Blog posts
   - Gallery items

3. Images should load correctly in all areas of the site

If all of these are working, your setup is complete! 