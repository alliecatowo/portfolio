# Directus Portfolio Setup Guide

This guide will help you set up your Directus portfolio project with the correct schema and initial data. We'll use the official Directus CLI tools instead of custom scripts.

## Prerequisites

- Directus 11.5.1 installed
- Access to your Directus instance (local or deployed)
- Admin credentials for your Directus instance

## Step 1: Bootstrap Your Directus Instance (if not already done)

If you're setting up a new Directus instance, use the bootstrap command:

```bash
npx directus bootstrap
```

This will install the database and set up initial tables. Make sure your `.env` file has the correct configuration.

## Step 2: Apply the Schema

We've created a schema file (`portfolio-schema.yaml`) that defines all the collections, fields, roles, and permissions needed for your portfolio site. To apply this schema:

```bash
# From the /directus directory
npx directus schema apply ./portfolio-schema.yaml
```

If you want to see what changes will be made without applying them, use:

```bash
npx directus schema apply --dry-run ./portfolio-schema.yaml
```

When you're ready to apply, you can run the command with the `--yes` flag to skip confirmation prompts:

```bash
npx directus schema apply --yes ./portfolio-schema.yaml
```

This will:
- Create the `blog_posts`, `projects`, and `gallery` collections
- Configure all fields with the correct types and options
- Set up permissions for both admin and public roles

## Step 3: Seed Initial Content

After applying the schema, you'll need to add some initial content. You can do this manually through the Directus admin interface or use the REST API to upload content programmatically.

### Example: Adding a Blog Post via CLI

You can use `curl` or a similar tool to add content:

```bash
# Replace YOUR_ADMIN_TOKEN with your actual admin token
curl -X POST https://your-directus-url/items/blog_posts \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post.",
    "status": "published"
  }'
```

### Example: Adding a Project

```bash
curl -X POST https://your-directus-url/items/projects \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Portfolio Website",
    "description": "A personal portfolio website built with Nuxt and Directus.",
    "url": "https://your-portfolio-url.com"
  }'
```

## Step 4: Verify Setup

After applying the schema and adding some initial content, verify that everything is working:

1. Log in to your Directus admin interface
2. Check that the collections appear in the content module
3. Verify you can create, read, update, and delete items as an admin
4. Check that public permissions work by making an unauthenticated request:

```bash
curl https://your-directus-url/items/blog_posts
```

This should return the published blog posts if the permissions are set correctly.

## Troubleshooting

### Permissions Issues

If collections aren't showing up or you're getting permission errors:

1. Make sure the schema was applied correctly
2. Check the roles in Settings > Roles & Permissions
3. Verify that permissions are set for both the Administrator and Public roles

### Schema Apply Errors

If you encounter errors applying the schema:

1. Try running with the `--dry-run` flag to see what changes would be made
2. Make sure there are no syntax errors in the schema file
3. Check that your Directus version matches the one specified in the schema (11.5.1)

## Creating a New Schema Snapshot

If you make changes to your collections in the Directus admin interface and want to update the schema file:

```bash
npx directus schema snapshot ./new-snapshot.yaml
```

This will create a new schema file with your current configuration.

## Next Steps

After setting up the basic structure, you may want to:

1. Customize the collection fields further
2. Add more complex relationships between collections
3. Create additional roles with different permission levels
4. Set up webhooks or flows for automated actions
5. Configure email templates

Refer to the [Directus documentation](https://docs.directus.io/) for more details on these advanced features. 