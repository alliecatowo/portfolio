#!/bin/bash
# Build script for Vercel deployments

set -e  # Exit on error

# Debug information
echo "===== Starting Vercel build process ====="
echo "Working directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Environment variables:"
echo "NUXT_PUBLIC_API_URL: $NUXT_PUBLIC_API_URL"
echo "Checking connectivity to API..."
curl -s -o /dev/null -w "%{http_code}" "$NUXT_PUBLIC_API_URL" || echo "API connectivity check failed"

# Clean up node_modules and package-lock.json
echo "Cleaning dependencies..."
rm -rf node_modules package-lock.json

# Install dependencies
echo "Installing dependencies..."
npm install 

# Install native modules needed for Linux
echo "Installing native modules..."
npm install @rollup/rollup-linux-x64-gnu @esbuild/linux-x64

# Run debug script
echo "Running prerender debug script..."
node debug-prerender.js

# Ensure environment variables are set
export NUXT_PUBLIC_API_URL=${NUXT_PUBLIC_API_URL:-"https://allisons-portfolio-directus-9vxdi.ondigitalocean.app"}
export NUXT_PUBLIC_DIRECTUS_TOKEN=${NUXT_PUBLIC_DIRECTUS_TOKEN:-"2eEMQA40l35OBtWNH6nDS166k0o800sb"}

# Build the application
echo "Building application with environment variables:"
echo "NUXT_PUBLIC_API_URL=$NUXT_PUBLIC_API_URL"
echo "NUXT_PUBLIC_DIRECTUS_TOKEN=$NUXT_PUBLIC_DIRECTUS_TOKEN"

# Run generate with increased memory and timeout
NODE_OPTIONS="--max-old-space-size=4096" NITRO_PRESET=vercel-static npm run generate

# Create the public directory
echo "Creating public directory..."
mkdir -p ../public

# Try different paths to find and copy the build output
echo "Copying build output..."
if [ -d ".output/public" ]; then
  cp -r .output/public/* ../public/
  echo "Copied from .output/public"
elif [ -d "dist" ]; then
  cp -r dist/* ../public/
  echo "Copied from dist"
else
  echo "Searching for public directory..."
  find . -type d -name 'public' -not -path '*/\.*' -exec cp -r {}/* ../public/ \;
fi

echo "Build completed!"
echo "Files in public directory: $(find ../public -type f | wc -l)" 