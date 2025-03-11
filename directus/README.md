# Directus Portfolio Setup

This repository contains configuration files and instructions for setting up a portfolio website using Directus CMS (v11.5.1) as the backend. The setup process uses **only official Directus CLI tools** without any custom scripts.

## What's Included

- `portfolio-schema.yaml`: Complete schema definition for:
  - Blog posts collection
  - Projects collection 
  - Gallery collection
  - Role and permission configuration
- `CLI_COMMANDS.md`: Detailed instructions for each CLI command
- `setup-cli.sh`: Shell script to automate the setup process
- `package.json`: NPM scripts for common Directus CLI operations

## Prerequisites

- Node.js v18.17.0 or later
- Directus v11.5.1
- Access to your deployed Directus instance

## Quick Start

1. **Set environment variables for admin user**:
   ```bash
   export ADMIN_EMAIL="your-admin-email@example.com"
   export ADMIN_PASSWORD="your-secure-password"
   ```

2. **Run the setup script**:
   ```bash
   ./setup-cli.sh
   ```

   This script will:
   - Bootstrap Directus
   - Apply the schema
   - Verify collections
   - Check roles
   - Create a backup snapshot

3. **Alternatively, use the NPM scripts**:
   ```bash
   # Bootstrap Directus
   npm run bootstrap
   
   # Apply schema (with a dry run first)
   npm run dry-run
   npm run apply-schema
   
   # List collections, users, and roles
   npm run list-collections
   npm run list-users
   npm run list-roles
   
   # Create a snapshot
   npm run snapshot
   ```

## Manual Setup

If you prefer to run commands individually, follow the instructions in `CLI_COMMANDS.md` for a step-by-step guide.

## Collection Structure

### Blog Posts
- Title (required)
- Content (Markdown, required)
- Status (published, draft, archived)
- Creation/update timestamps

### Projects
- Title (required)
- Description (Markdown, required)
- URL (optional)
- Image (optional)

### Gallery
- Title (required)
- Description (optional)
- Image (required)

## Roles and Permissions

- **Administrator**: Full access to all collections
- **Public**: Read-only access to all collections (for API access)

## Troubleshooting

See the `CLI_COMMANDS.md` file for troubleshooting steps using the CLI.

## Further Reading

- [Directus Documentation](https://docs.directus.io/)
- [CLI Documentation](https://docs.directus.io/self-hosted/cli.html)
- [Schema Management](https://docs.directus.io/app/data-model/) 