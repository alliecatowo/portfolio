#!/bin/bash

# Terminal colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Cleaning Sensitive Information from Git History ===${NC}"
echo -e "${YELLOW}WARNING: This will rewrite git history. Make sure you have a backup!${NC}"
echo -e "${YELLOW}This script will remove API tokens, passwords, and other sensitive information.${NC}"
echo -e "${RED}This is a destructive operation and will require force-pushing to remote repositories.${NC}"
echo -e "Do you want to continue? (y/n)"
read -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Operation cancelled.${NC}"
    exit 1
fi

# Create a backup
echo -e "${BLUE}Creating a backup of the repository...${NC}"
BACKUP_DIR="../portfolio_backup_$(date +%Y%m%d_%H%M%S)"
cp -r . "$BACKUP_DIR"
echo -e "${GREEN}Backup created at: $BACKUP_DIR${NC}"

# List of patterns to remove
echo -e "${BLUE}Removing sensitive information from git history...${NC}"

# Use git filter-repo to remove sensitive data
# First check if git-filter-repo is installed
if ! command -v git-filter-repo &> /dev/null; then
    echo -e "${YELLOW}git-filter-repo not found. Installing...${NC}"
    pip3 install git-filter-repo
fi

# Remove API tokens
echo -e "${YELLOW}Removing API tokens...${NC}"
git filter-repo --force --invert-paths --path-regex '(token|api.*key|password|secret|auth).*[=:].*[A-Za-z0-9_-]{20,}' --replace-text <(echo '
# Replace tokens in various formats
regex:(["\047]?(?:api_?(?:key|token)|token|secret|password|auth)["\047]?\s*[:=]\s*["\047]?)([A-Za-z0-9_\-\.]{20,})(["\047]?)=>\1REDACTED\3
regex:(["\047]?(?:api_?(?:key|token)|token|secret|password|auth)["\047]?\s*:\s*["\047]?)([A-Za-z0-9_\-\.]{20,})(["\047]?)=>\1REDACTED\3
')

echo -e "${GREEN}Git history has been cleaned!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Review the changes to make sure sensitive data was properly removed"
echo -e "2. Force push to update remote repositories: ${RED}git push --force-with-lease origin [branch]${NC}"
echo -e "${BLUE}IMPORTANT: Make sure your team members are aware of this change as they will need to reclone or reset their local repositories.${NC}" 