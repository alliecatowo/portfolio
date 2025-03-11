# Directus CMS Setup Guide

We've successfully deployed the Directus CMS to Digital Ocean App Platform and connected it to the frontend. Here are the final steps to complete the setup:

## 1. Set Up Collections and Configure Permissions

Since we're experiencing permission issues when trying to seed data programmatically, we need to manually configure the permissions in the Directus admin panel:

1. **Login to Directus Admin:**
   - URL: https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/admin/login
   - Email: admin@example.com
   - Password: Admin123!

2. **Check Collections:**
   - Navigate to Settings > Data Model
   - Verify that the following collections exist:
     - blog_posts
     - projects
     - gallery
   - If they don't exist, you'll need to create them with the fields as defined in our setup script.

3. **Configure Permissions:**
   - Navigate to Settings > Roles & Permissions
   - Select the "Public" role
   - Enable read permissions for all collections (blog_posts, projects, gallery)
   - This will allow the frontend to access the data without authentication

## 2. Add Sample Content

You can add sample content through the Directus admin interface:

1. **Blog Posts:**
   - Navigate to Content > Blog Posts
   - Click "+ Create Item"
   - Add at least two posts with titles, slugs, content (markdown), and published dates

2. **Projects:**
   - Navigate to Content > Projects
   - Click "+ Create Item"
   - Add at least two projects with titles, slugs, descriptions, and content

3. **Gallery Items:**
   - Navigate to Content > Gallery
   - Click "+ Create Item"
   - Add a few gallery items with titles and descriptions

## 3. Verify Frontend Connection

The frontend is deployed at:
- https://portfolio-ismolrarb-alliecatowos-projects.vercel.app

To verify the connection to Directus:
1. Visit the frontend URL
2. Check if blog posts and projects are displayed
3. If not, open the browser console to check for API errors

## 4. Update Custom Domain

If you have a custom domain:
1. Configure your domain settings in Vercel to point to the deployed frontend
2. Update the CORS settings in Directus:
   - Navigate to Settings > Project Settings > Security
   - Add your custom domain to the "Allowed Origins" field

## Troubleshooting

If you encounter issues with the connection between the frontend and Directus:

1. **Check CORS Settings:**
   - Verify that the CORS settings in Directus allow requests from your frontend domain
   - The current configuration allows requests from https://allisons.dev

2. **Check API URL:**
   - Verify that the frontend is using the correct Directus API URL
   - The URL should be: https://allisons-portfolio-directus-9vxdi.ondigitalocean.app

3. **Check Network Requests:**
   - Use the browser developer tools to inspect network requests
   - Look for failed requests to the Directus API

4. **Check Permissions:**
   - Make sure the public role has at least read access to all collections

## Next Steps

Once everything is working:

1. **Customize the Schema:**
   - Add additional fields to collections as needed
   - Create relationships between collections

2. **Add More Content:**
   - Populate the CMS with real content
   - Upload images and other media

3. **Enhance the Frontend:**
   - Improve styling and user experience
   - Add more interactive features
   - Optimize for performance 