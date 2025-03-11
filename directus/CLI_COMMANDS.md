# Directus Portfolio Setup Using CLI Commands

This guide provides step-by-step instructions for setting up your Directus portfolio using **only official CLI commands**. No custom scripts needed!

## Prerequisites

- Directus 11.5.1 installed
- Access to your Directus instance (local or deployed)

## Step 1: Bootstrap Your Directus Instance

If you're setting up a new Directus instance, bootstrap it with:

```bash
# Set up initial admin user credentials in environment variables
export ADMIN_EMAIL="your-admin-email@example.com"
export ADMIN_PASSWORD="your-secure-password"

# Bootstrap Directus
npx directus bootstrap
```

This initializes the database and creates the admin user with the specified credentials.

## Step 2: Apply the Schema

We've already created a schema file (`portfolio-schema.yaml`) that defines our collections, fields, roles, and permissions:

```bash
# Preview changes without applying (dry run)
npx directus schema apply --dry-run ./portfolio-schema.yaml

# Apply schema when ready
npx directus schema apply --yes ./portfolio-schema.yaml
```

## Step 3: Create Roles (if not created by schema)

If the roles weren't created properly by the schema, you can create them manually:

```bash
# Create the Public role (for API access)
npx directus roles create --role "Public" --app false

# If you need an additional admin role
npx directus roles create --role "Editor" --admin false --app true
```

## Step 4: Creating Additional Users (if needed)

To create additional users:

```bash
# First, get the role UUID
npx directus roles list

# Then create a user with the appropriate role
npx directus users create --email "editor@example.com" --password "secure-password" --role ROLE_UUID_HERE
```

## Step 5: Reset Admin Password (if needed)

If you need to reset the admin password:

```bash
npx directus users passwd --email "admin@example.com" --password "new-secure-password"
```

## Step 6: Check Collections

Verify that your collections were created properly:

```bash
# List collections
npx directus collections list

# Count items in a collection (should be 0 for new collections)
npx directus count blog_posts
npx directus count projects
npx directus count gallery
```

## Step 7: Manually Add Sample Content

After setting up the collections, you'll need to add content manually through the Directus Admin UI:

1. Log in to your Directus admin interface
2. Navigate to each collection (blog_posts, projects, gallery)
3. Use the "Create New Item" button to add entries
4. For gallery items, you'll need to upload images first

## Step 8: Taking a Snapshot (for Backup/Version Control)

After making changes to your schema through the admin interface, you can create a new snapshot:

```bash
# Create a snapshot of the current schema
npx directus schema snapshot ./updated-schema.yaml
```

## Troubleshooting

### If Collections Aren't Visible

1. Check the roles and permissions:
   ```bash
   npx directus roles list
   ```

2. Verify that the schema was applied successfully by checking for errors in the output

3. Try bootstrapping again with:
   ```bash
   npx directus bootstrap
   ```

### If Admin Can't Access Collections

Reset the permissions by re-applying the schema:

```bash
npx directus schema apply --yes ./portfolio-schema.yaml
```

## Useful CLI Commands Reference

Here are some additional useful CLI commands:

```bash
# Get help on available commands
npx directus --help

# Get help on a specific command
npx directus schema --help

# Check Directus version
npx directus --version

# List all users
npx directus users list

# List all roles
npx directus roles list

# List all collections
npx directus collections list
```

Remember, Directus CLI is the official way to manage your Directus instance programmatically without custom scripts. 