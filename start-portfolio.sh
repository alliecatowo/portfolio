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

# Check if nvm is installed
if ! command -v nvm &> /dev/null; then
    echo -e "${YELLOW}NVM is not installed or not in PATH. Make sure NVM is properly set up.${NC}"
    
    # Try to load nvm from common locations
    if [ -f "$HOME/.nvm/nvm.sh" ]; then
        source "$HOME/.nvm/nvm.sh"
        echo -e "${GREEN}Loaded NVM from $HOME/.nvm/nvm.sh${NC}"
    elif [ -f "/usr/local/opt/nvm/nvm.sh" ]; then
        source "/usr/local/opt/nvm/nvm.sh"
        echo -e "${GREEN}Loaded NVM from /usr/local/opt/nvm/nvm.sh${NC}"
    else
        echo -e "${YELLOW}Unable to load NVM automatically. Using system Node version.${NC}"
    fi
fi

# Display instructions
echo -e "${BLUE}This script will start both the frontend (Nuxt) and backend (Strapi) applications.${NC}"
echo -e "${BLUE}The frontend will be available at: ${GREEN}http://localhost:3000${NC}"
echo -e "${BLUE}The Strapi admin panel will be available at: ${GREEN}http://localhost:1337/admin${NC}"
echo ""

# Function to start the backend
start_backend() {
    echo -e "${GREEN}Starting Strapi backend...${NC}"
    cd backend
    if command -v nvm &> /dev/null; then
        nvm use 22 || echo -e "${YELLOW}Unable to switch to Node 22, using current version${NC}"
    fi
    npm run develop &
    BACKEND_PID=$!
    cd ..
    echo -e "${GREEN}Backend started with PID: $BACKEND_PID${NC}"
}

# Function to start the frontend
start_frontend() {
    echo -e "${GREEN}Starting Nuxt frontend...${NC}"
    cd frontend
    if command -v nvm &> /dev/null; then
        nvm use 23 || echo -e "${YELLOW}Unable to switch to Node 23, using current version${NC}"
    fi
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    echo -e "${GREEN}Frontend started with PID: $FRONTEND_PID${NC}"
}

# Start both applications
start_backend
sleep 2 # Give backend a moment to start
start_frontend

# Set up trap to kill both processes on script exit
trap 'echo -e "${YELLOW}Shutting down...${NC}"; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' SIGINT SIGTERM EXIT

echo -e "${GREEN}Both applications are running!${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both applications${NC}"

# Wait for user to press Ctrl+C
wait 