#!/bin/bash

# Local development script using Digital Ocean's doctl CLI
# This script creates a local development environment that matches the recommended approach

echo "Setting up local development environment with Digital Ocean..."

# Make sure Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker Desktop and try again."
  exit 1
fi

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
  echo "doctl CLI is not installed. Please install it from https://docs.digitalocean.com/reference/doctl/how-to/install/"
  exit 1
fi

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ENV_FILE="$SCRIPT_DIR/.env"

# Create a temporary app spec for local development
echo "Creating temporary app spec for local development..."
mkdir -p "$SCRIPT_DIR/../.do/frontend"
cat > "$SCRIPT_DIR/../.do/frontend/app.local.yaml" << EOL
name: allisons-portfolio-local-dev
region: sfo
services:
  - name: frontend
    environment_slug: node-js
    source_dir: frontend
    envs:
$(grep -v '^#' "$ENV_FILE" 2>/dev/null | sed 's/\(.*\)=\(.*\)/      - key: \1\n        scope: RUN_TIME\n        value: "\2"/')
      - key: SERVER_PRESET
        scope: RUN_TIME
        value: digital-ocean
      - key: NITRO_PRESET
        scope: BUILD_TIME
        value: digital-ocean
      - key: NODE_ENV
        scope: RUN_TIME
        value: development
    http_port: 3000
EOL

echo "Starting local development environment using doctl..."
echo "This will provide an environment that closely matches Digital Ocean App Platform."
echo "NOTE: The first build might take some time..."

# Run the app locally using doctl
cd "$SCRIPT_DIR/.." && doctl apps dev .do/frontend/app.local.yaml

echo "Local development environment stopped." 