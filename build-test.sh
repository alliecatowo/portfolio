#!/bin/bash
set -e

# Display current Node.js version
echo "Current Node.js version: $(node -v)"
echo "Current npm version: $(npm -v)"

# Clean installation directories
echo "Cleaning previous builds..."
rm -rf frontend/node_modules backend/node_modules
rm -rf frontend/.nuxt frontend/.output
rm -rf backend/.cache backend/build

# Install and build backend
echo "===== Installing Backend Dependencies ====="
cd backend
npm install
echo "===== Building Backend ====="
npm run build

# Install and build frontend
echo "===== Installing Frontend Dependencies ====="
cd ../frontend
npm install
echo "===== Building Frontend ====="
npm run build

echo "===== Build Test Complete ====="
echo "If you've reached this message without errors, your build process works correctly!"
echo "Frontend build output is in frontend/.output"
echo "Backend build output is in backend/build"

# Return to project root
cd .. 