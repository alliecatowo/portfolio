#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Portfolio Deployment Guide ===${NC}"
echo -e "${BLUE}This script will guide you through deploying your portfolio to Vercel.${NC}"
echo ""

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI is not installed. Please install it with:${NC}"
    echo "npm install -g vercel"
    exit 1
fi

# Verify Node.js version
echo -e "${BLUE}Checking Node.js version...${NC}"
NODE_VERSION=$(node -v)
echo -e "Using Node.js ${GREEN}$NODE_VERSION${NC}"

# Verify the project builds correctly
echo -e "${BLUE}Would you like to verify that the project builds correctly before deployment? (y/n)${NC}"
read -r verify_build

if [[ "$verify_build" == "y" || "$verify_build" == "Y" ]]; then
    echo -e "${GREEN}Running build test...${NC}"
    chmod +x ./build-test.sh
    ./build-test.sh
    
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}Build test failed. Please fix any issues before deploying.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Build test successful!${NC}"
fi

echo ""
echo -e "${GREEN}=== Step 1: Deploy Strapi Backend ===${NC}"
echo -e "${BLUE}You'll need to configure the following environment variables in Vercel:${NC}"
echo -e "  - ${YELLOW}NODE_ENV${NC}: production"
echo -e "  - ${YELLOW}DATABASE_URL${NC}: Your production database URL (PostgreSQL recommended)"
echo -e "  - ${YELLOW}ADMIN_JWT_SECRET${NC}: A secure random string"
echo -e "  - ${YELLOW}JWT_SECRET${NC}: A secure random string"
echo -e "  - ${YELLOW}APP_KEYS${NC}: Four comma-separated secure random strings"
echo -e "  - ${YELLOW}API_TOKEN_SALT${NC}: A secure random string"
echo -e "  - ${YELLOW}TRANSFER_TOKEN_SALT${NC}: A secure random string"
echo ""
echo -e "${BLUE}Would you like to deploy the backend now? (y/n)${NC}"
read -r deploy_backend

if [[ "$deploy_backend" == "y" || "$deploy_backend" == "Y" ]]; then
    echo -e "${GREEN}Deploying Strapi backend to Vercel...${NC}"
    cd backend
    vercel
    
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}Backend deployment failed. Please check the error messages.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Backend deployment initiated!${NC}"
    echo -e "${BLUE}Note the deployed URL. You'll need it for the frontend configuration.${NC}"
    cd ..
else
    echo -e "${YELLOW}Skipping backend deployment. You can deploy it manually later with:${NC}"
    echo -e "cd backend && vercel"
fi

echo ""
echo -e "${GREEN}=== Step 2: Deploy Nuxt Frontend ===${NC}"
echo -e "${BLUE}You'll need to configure the following environment variable in Vercel:${NC}"
echo -e "  - ${YELLOW}NUXT_PUBLIC_API_URL${NC}: The URL of your deployed Strapi backend"
echo ""
echo -e "${BLUE}Would you like to deploy the frontend now? (y/n)${NC}"
read -r deploy_frontend

if [[ "$deploy_frontend" == "y" || "$deploy_frontend" == "Y" ]]; then
    echo -e "${GREEN}Enter your backend URL (e.g., https://your-backend.vercel.app):${NC}"
    read -r backend_url
    
    # Update the vercel.json file with the backend URL
    sed -i '' "s|https://YOUR_STRAPI_BACKEND_URL.vercel.app|$backend_url|g" frontend/vercel.json
    
    echo -e "${GREEN}Deploying Nuxt frontend to Vercel...${NC}"
    cd frontend
    vercel
    
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}Frontend deployment failed. Please check the error messages.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Frontend deployment initiated!${NC}"
    cd ..
else
    echo -e "${YELLOW}Skipping frontend deployment. You can deploy it manually later with:${NC}"
    echo -e "cd frontend && vercel"
fi

echo ""
echo -e "${GREEN}=== Deployment Guide Complete ===${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Verify your deployments in the Vercel dashboard"
echo -e "2. Set up environment variables for both projects in the Vercel dashboard"
echo -e "3. If needed, run the seed script to populate your Strapi database:"
echo -e "   ${YELLOW}cd backend && ./scripts/run-seed.sh YOUR_STRAPI_API_TOKEN${NC}"
echo -e "4. For production deployments, consider setting up a custom domain"
echo ""
echo -e "${GREEN}Thank you for using the Portfolio Deployment Guide!${NC}" 