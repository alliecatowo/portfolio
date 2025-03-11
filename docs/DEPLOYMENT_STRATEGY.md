# Portfolio Deployment Strategy

This document outlines the deployment strategy for the portfolio project, which uses Vercel's GitHub integration for continuous deployment.

## Overview

The deployment strategy follows a branch-based workflow:

- **Development Branch**: Used for development and testing. Deployments from this branch are considered preview deployments.
- **Production Branch**: Used for production deployments. Only stable, tested code should be merged to this branch.

## Deployment Workflow

1. **Development Process**:
   - Developers work on feature branches (e.g., `feat/feature-name`)
   - When ready for testing, changes are merged to the `development` branch
   - Vercel automatically deploys changes from the `development` branch to a preview environment

2. **Production Deployment**:
   - When changes in the `development` branch are tested and ready for production
   - Create a pull request from `development` to `production`
   - After review, merge the pull request
   - Vercel automatically deploys changes from the `production` branch to the production environment

## Vercel Configuration

The project uses Vercel's GitHub integration with the following configuration:

- **Production Branch**: `production`
- **Preview Branches**: `development` and all feature branches
- **Environment Variables**: Configured separately for preview and production environments

## Environment Variables

The following environment variables are required for deployment:

- `NUXT_PUBLIC_API_URL`: URL of the Directus API
- `NUXT_PUBLIC_DIRECTUS_TOKEN`: Access token for the Directus API
- `DEV_SITE_URL`: URL for the development site
- `TATTOO_SITE_URL`: URL for the tattoo site

## Deployment Setup

To set up the deployment workflow:

1. Run the `setup-vercel-deployment.sh` script:
   ```bash
   ./setup-vercel-deployment.sh
   ```

2. Follow the prompts to:
   - Install and log in to Vercel CLI
   - Link your project to Vercel
   - Set up environment variables
   - Connect to GitHub
   - Create required branches if they don't exist

3. Configure branch deployments in the Vercel dashboard as instructed by the script

## Security Considerations

- API tokens and sensitive environment variables are stored in Vercel's environment variable system, not in the codebase
- The `clean-git-history.sh` script can be used to remove any accidentally committed sensitive information from the git history

## Monitoring Deployments

- Monitor deployments in the Vercel dashboard
- Each deployment includes build logs, preview URLs, and deployment status
- Vercel provides deployment notifications via email and integrations with Slack, Discord, etc.

## Rollback Procedure

If a deployment causes issues:

1. In the Vercel dashboard, go to the "Deployments" tab
2. Find the last stable deployment
3. Click the three dots menu and select "Promote to Production"

Alternatively, revert the merge in GitHub and push the changes, which will trigger a new deployment with the reverted code.

## Troubleshooting

Common deployment issues and solutions:

1. **Build Failures**:
   - Check the build logs in the Vercel dashboard
   - Ensure all dependencies are correctly specified in package.json
   - Verify that the build command in vercel.json is correct

2. **Environment Variable Issues**:
   - Confirm that all required environment variables are set in the Vercel dashboard
   - Check that environment variables are being correctly accessed in the code

3. **Routing Issues**:
   - Verify the routes configuration in vercel.json
   - Check for any hardcoded URLs in the codebase 