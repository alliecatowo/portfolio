# Troubleshooting Directus and Frontend Integration

This guide will help you troubleshoot common issues with Directus and the frontend integration.

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