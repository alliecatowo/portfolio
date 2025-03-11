#!/bin/bash

# Terminal colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Setting up Vercel Deployment with GitHub Integration ===${NC}"
echo -e "${YELLOW}This script will help you set up Vercel with GitHub integration for automatic deployments.${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install Vercel CLI.${NC}"
        exit 1
    fi
    echo -e "${GREEN}Vercel CLI installed successfully.${NC}"
else
    echo -e "${GREEN}Vercel CLI is already installed.${NC}"
fi

# Login to Vercel
echo -e "${BLUE}Logging in to Vercel...${NC}"
vercel login
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to login to Vercel.${NC}"
    exit 1
fi
echo -e "${GREEN}Successfully logged in to Vercel.${NC}"

# Navigate to the frontend directory
cd frontend || { echo -e "${RED}Frontend directory not found.${NC}"; exit 1; }

# Link the project to Vercel
echo -e "${BLUE}Linking project to Vercel...${NC}"
echo -e "${YELLOW}Select your Vercel scope and project when prompted.${NC}"
vercel link
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to link project to Vercel.${NC}"
    exit 1
fi
echo -e "${GREEN}Successfully linked project to Vercel.${NC}"

# Set up environment variables
echo -e "${BLUE}Setting up environment variables in Vercel...${NC}"
echo -e "${YELLOW}You'll be prompted to enter values for each environment variable.${NC}"

vercel env add NUXT_PUBLIC_API_URL
vercel env add NUXT_PUBLIC_DIRECTUS_TOKEN
vercel env add DEV_SITE_URL
vercel env add TATTOO_SITE_URL

# Connect to GitHub
echo -e "${BLUE}Connecting Vercel project to GitHub...${NC}"
vercel git connect
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to connect to GitHub.${NC}"
    echo -e "${YELLOW}You can manually connect your GitHub repository in the Vercel dashboard:${NC}"
    echo -e "1. Go to your project in the Vercel dashboard"
    echo -e "2. Click on 'Git Repository' in the sidebar"
    echo -e "3. Click 'Connect' and select your GitHub repository"
else
    echo -e "${GREEN}Successfully connected to GitHub.${NC}"
fi

# Configure branch deployments
echo -e "${BLUE}Configuring branch deployments...${NC}"
echo -e "${YELLOW}In the Vercel dashboard:${NC}"
echo -e "1. Go to your project settings"
echo -e "2. Click on 'Git'"
echo -e "3. Configure 'Production Branch' to be 'production'"
echo -e "4. Configure 'Preview Branches' to include 'development'"
echo -e "5. Save your changes"

cd ..

# Create required branches if they don't exist
echo -e "${BLUE}Checking for required branches...${NC}"

# Check if development branch exists
if ! git show-ref --verify --quiet refs/heads/development; then
    echo -e "${YELLOW}Development branch doesn't exist. Would you like to create it? (y/n)${NC}"
    read -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout -b development
        git push -u origin development
        git checkout feat/ci-cd
        echo -e "${GREEN}Development branch created and pushed.${NC}"
    fi
fi

# Check if production branch exists
if ! git show-ref --verify --quiet refs/heads/production; then
    echo -e "${YELLOW}Production branch doesn't exist. Would you like to create it? (y/n)${NC}"
    read -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout -b production
        git push -u origin production
        git checkout feat/ci-cd
        echo -e "${GREEN}Production branch created and pushed.${NC}"
    fi
fi

echo -e "${GREEN}==== Setup Complete! ====${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Push your code to the development branch for preview deployments"
echo -e "2. Push your code to the production branch for production deployments"
echo -e "3. Check your deployments in the Vercel dashboard"
echo -e "${GREEN}Your Vercel deployments are now set up with GitHub integration!${NC}" 