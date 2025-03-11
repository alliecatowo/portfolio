#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Portfolio Deployment to Vercel ===${NC}"
echo -e "This script will help you deploy your portfolio to Vercel.\n"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Vercel CLI is not installed. Installing now...${NC}"
    npm i -g vercel
fi

# Navigate to frontend directory
cd frontend

# Build the project locally first to check for any errors
echo -e "\n${BLUE}Building the project locally to check for errors...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Please fix the errors before deploying.${NC}"
    exit 1
fi

echo -e "\n${GREEN}Local build successful. Proceeding with Vercel deployment...${NC}"

# Check if user is logged in to Vercel
echo -e "\n${BLUE}Checking Vercel login status...${NC}"
vercel whoami &> /dev/null

if [ $? -ne 0 ]; then
    echo -e "${BLUE}You are not logged in to Vercel. Please log in:${NC}"
    vercel login
fi

# Deployment options
echo -e "\n${BLUE}Select deployment type:${NC}"
echo -e "1) Preview deployment (development)"
echo -e "2) Production deployment"
read -p "Enter your choice (1/2): " DEPLOY_CHOICE

if [ "$DEPLOY_CHOICE" == "1" ]; then
    echo -e "\n${BLUE}Creating a preview deployment...${NC}"
    vercel
elif [ "$DEPLOY_CHOICE" == "2" ]; then
    echo -e "\n${BLUE}Creating a production deployment...${NC}"
    vercel --prod
else
    echo -e "${RED}Invalid choice. Exiting.${NC}"
    exit 1
fi

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}Deployment completed!${NC}"
    echo -e "Remember to set the following environment variables in your Vercel project settings:"
    echo -e "- NUXT_PUBLIC_API_URL = https://allisons-portfolio-directus-9vxdi.ondigitalocean.app"
    echo -e "- NUXT_PUBLIC_DIRECTUS_TOKEN = 2eEMQA40l35OBtWNH6nDS166k0o800sb"
    echo -e "- DEV_SITE_URL = [Your deployed URL]"
    echo -e "- TATTOO_SITE_URL = [Your deployed URL]"
else
    echo -e "\n${RED}Deployment failed. Please check the error messages above.${NC}"
fi

echo -e "\n${GREEN}Deployment process completed!${NC}" 