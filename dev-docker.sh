#!/bin/bash

# Script to run the Docker-based development environment

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Docker-based development environment...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker Desktop first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Navigate to the Docker directory
cd .docker

# Build and start the containers
echo -e "${YELLOW}Building and starting containers...${NC}"
docker-compose up -d

# Check if containers started successfully
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Development environment started successfully!${NC}"
    echo -e "${YELLOW}Frontend:${NC} http://localhost:3000"
    echo -e "${YELLOW}Directus:${NC} http://localhost:8055"
    echo -e "${YELLOW}Directus Admin:${NC} http://localhost:8055/admin"
    echo -e "${YELLOW}Admin Email:${NC} admin@example.com"
    echo -e "${YELLOW}Admin Password:${NC} Admin123!"
    echo -e "\n${GREEN}To stop the environment, run:${NC} docker-compose down"
else
    echo -e "${RED}Failed to start development environment.${NC}"
    exit 1
fi

# Show logs
echo -e "\n${YELLOW}Showing logs (press Ctrl+C to exit):${NC}"
docker-compose logs -f 