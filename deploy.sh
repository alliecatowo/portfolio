#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Portfolio Deployment to Vercel ===${NC}"

# Check Node.js version
NODE_VERSION=$(node -v)
echo -e "${BLUE}Using Node.js version:${NC} ${GREEN}$NODE_VERSION${NC}"

if [[ ! $NODE_VERSION =~ ^v22\. ]]; then
    echo -e "${YELLOW}Warning: This application requires Node.js v22.${NC}"
    echo -e "${YELLOW}Please run: nvm use 22${NC}"
    exit 1
fi

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI is not installed. Installing now...${NC}"
    npm install -g vercel
fi

# Deploy backend
echo -e "\n${GREEN}=== Deploying Strapi Backend ===${NC}"
cd backend

# Create .env file for Vercel deployment if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file for backend deployment${NC}"
    cat > .env << EOL
NODE_ENV=production
ADMIN_JWT_SECRET=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)
APP_KEYS=$(openssl rand -hex 16),$(openssl rand -hex 16),$(openssl rand -hex 16),$(openssl rand -hex 16)
API_TOKEN_SALT=$(openssl rand -hex 32)
TRANSFER_TOKEN_SALT=$(openssl rand -hex 32)
EOL
    echo -e "${GREEN}Created .env file with secure random values${NC}"
fi

echo -e "${BLUE}Deploying backend to Vercel...${NC}"
vercel --prod

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Backend deployment failed. Please check the error messages.${NC}"
    exit 1
fi

BACKEND_URL=$(vercel --prod --confirm)
echo -e "${GREEN}Backend deployed to:${NC} $BACKEND_URL"

# Deploy frontend
echo -e "\n${GREEN}=== Deploying Nuxt Frontend ===${NC}"
cd ../frontend

# Update the frontend environment with the backend URL
echo -e "${BLUE}Updating frontend configuration with backend URL...${NC}"
cat > .env << EOL
NUXT_PUBLIC_API_URL=$BACKEND_URL
EOL

echo -e "${BLUE}Deploying frontend to Vercel...${NC}"
vercel --prod --env NUXT_PUBLIC_API_URL=$BACKEND_URL

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Frontend deployment failed. Please check the error messages.${NC}"
    exit 1
fi

FRONTEND_URL=$(vercel --prod --confirm)
echo -e "${GREEN}Frontend deployed to:${NC} $FRONTEND_URL"

# Return to project root
cd ..

echo -e "\n${GREEN}=== Deployment Complete ===${NC}"
echo -e "${BLUE}Backend URL:${NC} $BACKEND_URL"
echo -e "${BLUE}Frontend URL:${NC} $FRONTEND_URL"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Set up your Strapi admin account at $BACKEND_URL/admin"
echo -e "2. Create an API token in Strapi admin panel"
echo -e "3. Run the seed script to populate your database:"
echo -e "   ${GREEN}cd backend && ./scripts/run-seed.sh YOUR_API_TOKEN${NC}"
echo -e "4. Set up a custom domain in Vercel dashboard if needed" 