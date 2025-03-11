#!/bin/bash

# Exit on any error
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment process for Portfolio Website${NC}"

# Build the frontend
echo -e "${YELLOW}Building frontend...${NC}"
cd frontend
npm ci
npm run build
cd ..

echo -e "${GREEN}Frontend build completed successfully!${NC}"

# Check for Docker
if command -v docker &> /dev/null; then
    echo -e "${YELLOW}Building Docker image...${NC}"
    docker build -t portfolio-frontend ./frontend
    echo -e "${GREEN}Docker image built successfully!${NC}"
else
    echo -e "${YELLOW}Docker not found. Skipping Docker build.${NC}"
fi

# If Directus needs to be deployed
echo -e "${YELLOW}Do you want to deploy Directus backend? (y/n)${NC}"
read deploy_directus

if [[ "$deploy_directus" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deploying Directus backend...${NC}"
    cd directus
    # Add your Directus deployment commands here
    cd ..
    echo -e "${GREEN}Directus deployment completed!${NC}"
fi

# Digital Ocean deployment section
echo -e "${YELLOW}Do you want to deploy to Digital Ocean? (y/n)${NC}"
read deploy_do

if [[ "$deploy_do" =~ ^[Yy]$ ]]; then
    if command -v doctl &> /dev/null; then
        echo -e "${YELLOW}Deploying to Digital Ocean...${NC}"
        # Authenticate with Digital Ocean if needed
        doctl auth init
        
        # Deploy the app (assuming App Platform)
        echo -e "${YELLOW}Deploying app to Digital Ocean App Platform...${NC}"
        doctl apps update YOUR_APP_ID --spec .do/app.yaml
        
        echo -e "${GREEN}Digital Ocean deployment initiated!${NC}"
    else
        echo -e "${YELLOW}Digital Ocean CLI (doctl) not found. To deploy:${NC}"
        echo -e "1. Install doctl: https://docs.digitalocean.com/reference/doctl/how-to/install/"
        echo -e "2. Run 'doctl auth init' to authenticate"
        echo -e "3. Deploy using 'doctl apps update YOUR_APP_ID --spec .do/app.yaml'"
    fi
else
    echo -e "${YELLOW}Skipping Digital Ocean deployment.${NC}"
fi

echo -e "${GREEN}Deployment process completed!${NC}"
echo -e "${YELLOW}Note: Manually verify your deployment in the Digital Ocean dashboard.${NC}" 