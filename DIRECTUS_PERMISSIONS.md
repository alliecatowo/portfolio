# Directus Permissions Guide

This guide will help you set up the correct permissions in Directus to allow your frontend to access your collections.

## Understanding Directus Permissions

In Directus, access to collections is controlled through roles and permissions. By default, there are two roles:
- **Administrator**: Has full access to everything
- **Public**: Represents unauthenticated users (what your frontend uses when accessing via API token)

Even if you have an admin token, if the collections don't have the right permissions set up, the frontend won't be able to access them.

## Setting Up Collection Permissions

1. **Log in to your Directus admin panel** at https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/admin

2. **Navigate to Settings > Roles & Permissions**

3. **Select the 'Public' role** (or create a specific API role if you prefer)

4. **Set up permissions for each collection**:
   
   For each of your collections (`blog_posts`, `projects`, `gallery`), you need to:
   
   - Find the collection in the list
   - Click the checkboxes to enable the appropriate permissions:
     - ✅ **Read**: Enable this to allow the frontend to read items
     - ❌ **Create**: Keep disabled unless you want to allow public creation
     - ❌ **Update**: Keep disabled for security
     - ❌ **Delete**: Keep disabled for security
   
   - Click on the "..." menu next to each permission to configure field-level permissions:
     - Make sure all fields you want to expose to the frontend have read access
     - Pay special attention to fields like `cover_image`, `content`, `title`, etc.

5. **Configure permissions for `directus_files`**:
   - This collection needs read access so your frontend can access images
   - Find `directus_files` in the list and enable Read permissions

6. **Save your changes**

## Testing Your Permissions

After setting up permissions, you can test them using these API endpoints:

- Test blog posts: `https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/items/blog_posts`
- Test projects: `https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/items/projects`
- Test gallery: `https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/items/gallery`

You should be able to access these endpoints directly in your browser or using a tool like curl, and receive a JSON response with your data.

## Troubleshooting

If you're still having issues:

1. **Check Network Requests**: In your browser's developer tools, look at the network requests from your frontend to Directus. Check for 403 Forbidden errors.

2. **Verify Collection Names**: Make sure the collection names in Directus match exactly what your frontend is requesting.

3. **Check Field Names**: Ensure the field names your frontend is requesting match the field names in Directus.

4. **API Token Permissions**: If you're using a custom API token (not the admin token), make sure it's associated with a role that has the necessary permissions.

5. **CORS Settings**: Verify CORS is properly configured in your Directus instance to allow requests from your frontend domain.

## Working with the Admin API

If you prefer not to expose certain collections or fields to the public, but still need them in your frontend, you can:

1. Create a custom role with specific permissions
2. Generate an API token for that role
3. Use that token in your frontend requests

Remember: Be careful about what you expose publicly versus what should require authentication. 