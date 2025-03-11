#!/bin/bash

echo "Restarting Nuxt frontend..."

# Navigate to the frontend directory
cd frontend || exit

# Clean up build artifacts
echo "Cleaning up build artifacts..."
rm -rf .nuxt .output

# Clean node_modules and reinstall dependencies
echo "Reinstalling dependencies..."
rm -rf node_modules
npm install

# Start the development server
echo "Starting Nuxt development server..."
echo "Nuxt will be available at http://localhost:3000"
npm run dev 