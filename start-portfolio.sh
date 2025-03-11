#!/bin/bash

# Color definitions
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Starting Portfolio Application ===${NC}"

# Navigate to project root
cd "$(dirname "$0")"

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is not installed. Please install Node.js to run this application.${NC}"
    exit 1
fi

# Check node version
NODE_VERSION=$(node -v)
echo -e "${GREEN}Using Node.js version: $NODE_VERSION${NC}"

if [[ ! $NODE_VERSION =~ ^v22\. ]]; then
    echo -e "${YELLOW}Warning: This application is designed to work with Node.js v22.${NC}"
    echo -e "${YELLOW}Current version: $NODE_VERSION${NC}"
    
    # Check if nvm is installed
    if command -v nvm &> /dev/null; then
        echo -e "${GREEN}NVM is available. Attempting to switch to Node.js v22...${NC}"
        nvm use 22 || echo -e "${YELLOW}Unable to switch to Node.js v22. Continuing with current version.${NC}"
    else
        echo -e "${YELLOW}NVM is not installed or not in PATH. Using current Node.js version.${NC}"
    fi
fi

# Display instructions
echo -e "${BLUE}This script will start both the frontend (Nuxt) and backend (Strapi) applications.${NC}"
echo -e "${BLUE}The frontend will be available at: ${GREEN}http://localhost:3000${NC}"
echo -e "${BLUE}The Strapi admin panel will be available at: ${GREEN}http://localhost:1337/admin${NC}"
echo ""

# Kill any existing processes
echo -e "${YELLOW}Stopping any existing portfolio processes...${NC}"
pkill -f "nuxt dev" || true
pkill -f "strapi develop" || true
sleep 1

# Function to start the backend
start_backend() {
    echo -e "${GREEN}Starting Strapi backend...${NC}"
    cd backend
    npm run develop &
    BACKEND_PID=$!
    cd ..
    echo -e "${GREEN}Backend started with PID: $BACKEND_PID${NC}"
}

# Function to start the frontend
start_frontend() {
    echo -e "${GREEN}Starting Nuxt frontend...${NC}"
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    echo -e "${GREEN}Frontend started with PID: $FRONTEND_PID${NC}"
}

# Start both applications
start_backend
sleep 5 # Give backend more time to start
start_frontend

# Set up trap to kill both processes on script exit
trap 'echo -e "${YELLOW}Shutting down...${NC}"; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' SIGINT SIGTERM EXIT

echo -e "${GREEN}Both applications are running!${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both applications${NC}"

# Wait for user to press Ctrl+C
wait 