#!/bin/bash
# Build script for Vercel deployments

set -e  # Exit on error

# Clean up node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install dependencies
echo "Installing dependencies..."
npm install 

# Install native modules needed for Linux
echo "Installing native modules..."
npm install @rollup/rollup-linux-x64-gnu @esbuild/linux-x64

# Build the application
echo "Building application..."
npm run generate

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