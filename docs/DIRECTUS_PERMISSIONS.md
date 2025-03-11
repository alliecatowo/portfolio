# Directus Permissions Guide

This guide will help you set up the correct permissions in Directus to allow your frontend to access your collections.

## Understanding Directus Permissions

In Directus, access to collections is controlled through roles and permissions. By default, there are two roles:
- **Administrator**: Has full access to everything
- **Public**: Represents unauthenticated users (what your frontend uses when accessing via API token)

Even if you have an admin token, if the collections don't have the right permissions set up, the frontend won't be able to access them.

## Setting Up Collection Permissions Manually

### Step 1: Access the Directus Admin Panel

1. Navigate to your Directus instance at https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/admin
2. Log in with your administrator credentials

### Step 2: Navigate to Roles & Permissions

1. Click on the gear icon (⚙️) in the sidebar to access Settings
2. Select "Roles & Permissions" from the settings menu

### Step 3: Configure the Public Role

1. In the Roles & Permissions section, find and click on the "Public" role
2. You'll see a list of all collections in your Directus instance
3. For each collection that needs to be accessible to your frontend, you need to configure permissions

### Step 4: Set Up Permissions for Content Collections

For each of these essential collections:
- `blog_posts`
- `projects`
- `gallery`

Follow these detailed steps:

1. **Enable Read Access**:
   - Find the collection in the list
   - Click the checkbox in the "Read" column to enable read access
   - A permissions sidebar will open on the right

2. **Configure Read Permissions**:
   - In the permissions sidebar, you'll see several tabs:
   - **Fields**: Ensure all required fields are selected (or use "Select All")
   - **Permissions**: You can leave this as the default (no conditions)
   - **Validation**: You can leave this as the default (no validation)
   - **Presets**: Not needed for read access

3. **Save Permissions**:
   - Click the "Save" button at the bottom of the sidebar

### Step 5: Set Up Permissions for System Collections

For the Directus system collections, you need to set up permissions:

1. **Enable Read Access for `directus_files`**:
   - Find `directus_files` in the list (it might be under System Collections)
   - Click the checkbox in the "Read" column
   - In the sidebar that opens, ensure at least these fields are selected:
     - `id`
     - `filename_disk`
     - `filename_download`
     - `type`
     - `filesize`
     - `width`
     - `height`
   - Click "Save"

2. **Additional System Collections** (if needed):
   - If your content references other system collections, make sure to set up read access for those as well

### Step 6: Verify Permissions

After setting up all permissions, it's a good idea to verify they are working correctly:

1. **Test API Access Directly**:
   - Open a new browser tab and navigate to:
   - `https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/items/blog_posts`
   - You should see a JSON response with your blog posts data
   - Test other collections similarly

2. **Check Permissions in the UI**:
   - In the Roles & Permissions section, the "Public" role should now show read access for your collections

## Testing Your API with an Access Token

If you want to test your API with an access token:

### Option 1: Using Browser

1. Open your browser to:
   ```
   https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/items/blog_posts
   ```

2. If you get a JSON response with data, permissions are working correctly

### Option 2: Using curl

Run this command in your terminal:
```bash
curl -H "Authorization: Bearer 2eEMQA40l35OBtWNH6nDS166k0o800sb" https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/items/blog_posts
```

## Common Permission Issues and Solutions

### 403 Forbidden Errors

If you're seeing 403 Forbidden errors:

1. **Check Collection Permissions**:
   - Ensure the "Public" role has read access to the collection
   - Make sure all fields you're trying to access have read permissions

2. **Check API Token**:
   - If using a custom token, ensure it's associated with a role that has the necessary permissions
   - The admin token should work if the public role has proper permissions

3. **Check Collection Names**:
   - Collection names are case-sensitive
   - Make sure API requests use the exact collection names as in Directus

### Empty Responses

If you're getting empty arrays in responses:

1. **Check Content Exists**:
   - Make sure you've created content in the collections you're accessing
   - Verify content is not in draft state (if using publication status)

2. **Check Field Permissions**:
   - Ensure all fields you're trying to access have read permissions

## Advanced Permissions (If Needed)

For more sophisticated permission rules:

1. **Field-Level Permissions**:
   - You can allow access to specific fields while restricting others
   - In the "Fields" tab of the permissions sidebar, select only the fields you want to expose

2. **Conditional Permissions**:
   - Use the "Permissions" tab to set conditions for when items can be accessed
   - Example: Only show published blog posts by setting a condition where `status = "published"`

3. **API Hooks**:
   - For complex permission logic, you might need to use custom API hooks
   - This requires developing custom extensions for Directus

## Next Steps After Setting Permissions

Once permissions are correctly set up:

1. **Test the Frontend**:
   - Visit your deployed frontend at https://portfolio-pe6h5b9lm-alliecatowos-projects.vercel.app
   - Verify that data from Directus is properly displayed

2. **Add Content in Directus**:
   - Create blog posts, projects, and gallery items in Directus
   - Make sure to fill in all required fields

3. **Fine-tune Permissions**:
   - As your application grows, you may need to adjust permissions for new collections or fields 