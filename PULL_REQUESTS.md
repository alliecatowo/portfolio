# Pull Request Instructions

We've created several branches with improvements to the codebase. Here are the instructions for creating pull requests for each branch:

## 1. Refactor: Remove unused scripts and files

**Branch:** `refactor/cleanup`

**Description:**
This PR removes unused scripts and files that were created during the deployment troubleshooting process. These files are no longer needed now that we have a stable deployment configuration.

**Changes:**
- Remove unused build and deployment scripts
- Remove temporary patch files for rollup
- Remove test deployment documentation
- Clean up the repository structure

## 2. Docs: Organize documentation into docs directory

**Branch:** `docs/organize`

**Description:**
This PR organizes all documentation files into a dedicated `docs` directory for better organization and discoverability.

**Changes:**
- Move all markdown documentation files to the `docs` directory
- Create an index.md file in the docs directory to serve as a table of contents
- Update the main README.md to reference the docs directory

## 3. Feature: Add CORS support for Vercel domains

**Branch:** `feature/cors-vercel-domains`

**Description:**
This PR adds CORS support for Vercel domains to ensure that the application works correctly when deployed to Vercel, including preview deployments.

**Changes:**
- Create a CORS utility file with functions to detect Vercel domains
- Update the Directus plugin to add CORS headers for Vercel domains
- Update the Directus utility functions to use CORS headers
- Add a server middleware to handle CORS requests

## Creating Pull Requests

To create these pull requests:

1. Go to your GitHub repository: https://github.com/alliecatowo/portfolio
2. Click on "Pull requests" tab
3. Click the "New pull request" button
4. Select the base branch as `main` and the compare branch as one of the branches above
5. Click "Create pull request"
6. Fill in the title and description using the information above
7. Click "Create pull request" to submit

## Recommended Merge Order

1. First merge `refactor/cleanup` to clean up the codebase
2. Then merge `docs/organize` to organize the documentation
3. Finally merge `feature/cors-vercel-domains` to add CORS support

After each merge, verify that the deployment works correctly before proceeding to the next one. 