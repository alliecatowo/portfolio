#!/bin/bash

# Install required packages if not already installed
pip install requests

# Prompt for credentials if not already set as environment variables
if [ -z "$DIRECTUS_ADMIN_TOKEN" ] && [ -z "$DIRECTUS_ADMIN_EMAIL" ]; then
  echo "Please enter your Directus admin credentials:"
  read -p "Email: " DIRECTUS_ADMIN_EMAIL
  read -sp "Password: " DIRECTUS_ADMIN_PASSWORD
  echo ""
  
  # Export for use in the Python script
  export DIRECTUS_ADMIN_EMAIL
  export DIRECTUS_ADMIN_PASSWORD
fi

echo "Running Directus collection setup script..."
# Run the Python script
python3 setup-directus-collections.py 