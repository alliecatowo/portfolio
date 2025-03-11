#!/bin/bash

# Manual deployment script for portfolio project
# This script handles the build and deployment process

set -e  # Exit on error

echo "=== Portfolio Deployment Script ==="
echo "Starting deployment process..."

# Move to frontend directory
cd "$(dirname "$0")/frontend"

# Clean up node_modules and package-lock
echo "Cleaning up node modules and lockfile..."
rm -rf node_modules package-lock.json

# Prepare NPM configuration
echo "Configuring NPM to skip optional dependencies..."
echo "optional=false" > .npmrc
echo "omit=optional" >> .npmrc
echo "# Prevent platform-specific modules for rollup" >> .npmrc
echo "@rollup:registry=https://registry.npmjs.org/" >> .npmrc
echo "node-options=--max-old-space-size=4096" >> .npmrc

# Install dependencies without optional packages
echo "Installing dependencies..."
npm install --no-optional

# Run the rollup patch script
echo "Patching rollup to avoid native dependencies..."
node ./patch-rollup.js

# Build the application with nuxt generate
echo "Building application..."
npm run generate

echo "Build completed successfully!"

# If Vercel CLI is installed, offer to deploy
if command -v vercel &> /dev/null; then
    echo ""
    echo "Vercel CLI is installed. Do you want to deploy now? (y/n)"
    read -r deploy_choice
    
    if [[ $deploy_choice == "y" || $deploy_choice == "Y" ]]; then
        echo "Deploying to Vercel..."
        cd ..  # Move back to root directory
        vercel --prod
        echo "Deployment completed!"
    else
        echo "Skipping deployment. You can deploy manually using 'vercel --prod'"
    fi
else
    echo ""
    echo "Vercel CLI not found. To deploy:"
    echo "1. Install Vercel CLI: npm i -g vercel"
    echo "2. Run 'vercel --prod' from the project root"
fi

echo "=== Deployment process finished ===" 