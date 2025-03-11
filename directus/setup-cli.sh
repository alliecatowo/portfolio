#!/bin/bash

# Directus CLI Setup Script
# This script uses only official Directus CLI commands to set up your portfolio

echo "=== Directus Portfolio CLI Setup ==="
echo ""

# Check if environment variables are set
if [ -z "$ADMIN_EMAIL" ] || [ -z "$ADMIN_PASSWORD" ]; then
  echo "Please set your admin credentials first:"
  echo "export ADMIN_EMAIL=\"your-admin-email@example.com\""
  echo "export ADMIN_PASSWORD=\"your-secure-password\""
  echo ""
  echo "Then run this script again."
  exit 1
fi

# Step 1: Bootstrap Directus
echo "Step 1: Bootstrapping Directus..."
npx directus bootstrap
echo "Bootstrap complete!"
echo ""

# Step 2: Apply Schema
echo "Step 2: Applying schema from portfolio-schema.yaml..."
echo "First, let's do a dry run to see what changes will be made:"
npx directus schema apply --dry-run ./portfolio-schema.yaml

echo ""
read -p "Continue with applying the schema? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Setup aborted by user."
  exit 0
fi

echo "Applying schema..."
npx directus schema apply --yes ./portfolio-schema.yaml
echo "Schema applied!"
echo ""

# Step 3: Verify Collections
echo "Step 3: Verifying collections..."
echo "Listing all collections:"
npx directus collections list
echo ""

# Step 4: Check Roles
echo "Step 4: Verifying roles..."
echo "Listing all roles:"
npx directus roles list
echo ""

# Step 5: Create snapshot for backup
echo "Step 5: Creating a schema snapshot for backup..."
SNAPSHOT_FILE="schema-backup-$(date +%Y%m%d).yaml"
npx directus schema snapshot ./$SNAPSHOT_FILE
echo "Snapshot created as $SNAPSHOT_FILE"
echo ""

echo "=== Setup Complete! ==="
echo ""
echo "Next steps:"
echo "1. Log in to your Directus admin interface with your admin credentials"
echo "2. Add content to your collections (blog_posts, projects, gallery)"
echo "3. Check that public access is working by visiting your API endpoint"
echo ""
echo "To add sample content, use the Directus Admin UI to create entries manually."
echo "To check public access, visit: https://your-directus-url/items/blog_posts" 