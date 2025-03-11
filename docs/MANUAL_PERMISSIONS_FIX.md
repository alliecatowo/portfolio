# Manual Directus Permissions Fix

Since you're experiencing issues with collections not being accessible even to the admin user, follow these step-by-step instructions to fix the permissions manually.

## For Administrator Role

### Step 1: Access Directus Settings

1. Log in to your Directus admin panel at https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/admin
2. Click the settings icon (gear ⚙️) in the bottom left corner of the sidebar

### Step 2: Access Roles & Permissions

1. In the settings menu, click on "Roles & Permissions"
2. You should see at least two roles: "Administrator" and "Public"
3. Click on the "Administrator" role

### Step 3: Grant Full Access to All Collections

For each collection in the list (including your content collections and system collections):

1. Enable all permissions (Create, Read, Update, Delete) by clicking the checkboxes
2. If a permissions sidebar opens when you click a checkbox:
   - Select "All Fields" in the Fields tab
   - Click "Save" at the bottom of the sidebar
3. Repeat for each collection until all have full permissions

### Step 4: Check Admin Access

1. Go back to the Content module
2. Verify that you can now see and access all collections
3. Try to create, read, update, and delete items to verify full permissions

## For Public Role (For Frontend Access)

After fixing admin permissions, you need to set up public access for your frontend:

### Step 1: Access Public Role

1. Go back to Settings → Roles & Permissions
2. Click on the "Public" role

### Step 2: Set Read Permissions for Content Collections

For each of these essential collections:
- `blog_posts`
- `projects`
- `gallery`
- `directus_files`

Do the following:

1. Find the collection in the list
2. Click the checkbox in the "Read" column ONLY
3. In the sidebar that opens:
   - Select "All Fields" in the Fields tab (or select only the fields you want to expose publicly)
   - Click "Save" at the bottom

### Step 3: Test Public Access

To test public access to your collections:

1. Open a new browser tab or use an incognito window
2. Navigate to:
   ```
   https://allisons-portfolio-directus-9vxdi.ondigitalocean.app/items/projects
   ```
3. You should receive a JSON response with your projects data
4. Test other collections similarly

## Verify Frontend Access

After setting up permissions:

1. Deploy your frontend again or refresh the existing deployment
2. Check if it can now access the data from your Directus collections
3. Look for any error messages in the browser console

## Common Issues and Solutions

### If Collections Don't Appear in Admin UI

If collections don't appear at all:
1. Go to Settings → Data Model
2. Check if collections exist there
3. If they do, try clicking on one and checking the "Hidden" option - make sure it's not enabled

### If Permissions Don't Seem to Take Effect

1. Try clearing your browser cache
2. Log out and log back in to Directus
3. Restart your Directus instance through Digital Ocean if possible

### If Frontend Still Can't Access Data

1. Check network requests in browser dev tools
2. Verify API token is correctly configured
3. Ensure collection names and field names match exactly what the frontend is requesting 