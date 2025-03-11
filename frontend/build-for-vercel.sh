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

# Detect platform
PLATFORM=$(uname -s)
ARCH=$(uname -m)
echo "Running on platform: $PLATFORM, architecture: $ARCH"

# Ensure API URL has protocol
if [ ! -z "$NUXT_PUBLIC_API_URL" ] && [[ ! "$NUXT_PUBLIC_API_URL" =~ ^https?:// ]]; then
  echo "Adding https:// to API URL"
  export NUXT_PUBLIC_API_URL="https://$NUXT_PUBLIC_API_URL"
  echo "Updated NUXT_PUBLIC_API_URL: $NUXT_PUBLIC_API_URL"
fi

echo "Checking connectivity to API..."
curl -s -o /dev/null -w "%{http_code}" "$NUXT_PUBLIC_API_URL" || echo "API connectivity check failed"

# Clean up node_modules and package-lock.json
echo "Cleaning dependencies..."
rm -rf node_modules package-lock.json

# Install dependencies
echo "Installing dependencies..."
npm install 

# Install platform-specific native modules
echo "Installing platform-specific modules..."
if [ "$PLATFORM" = "Linux" ]; then
  echo "Installing native modules for Linux..."
  npm install @rollup/rollup-linux-x64-gnu @esbuild/linux-x64
elif [ "$PLATFORM" = "Darwin" ]; then
  if [ "$ARCH" = "arm64" ]; then
    echo "Installing native modules for macOS arm64..."
    npm install @rollup/rollup-darwin-arm64
  else
    echo "Installing native modules for macOS x64..."
    npm install @rollup/rollup-darwin-x64
  fi
else
  echo "Unsupported platform: $PLATFORM. Skipping platform-specific modules."
fi

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