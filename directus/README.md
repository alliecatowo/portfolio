# Directus Backend for Allison's Portfolio

This directory contains the Directus CMS setup for Allison's portfolio website.

## Important Documentation

- [Setup Instructions](./SETUP_INSTRUCTIONS.md) - **Start here for comprehensive setup instructions**
- [Manual Permissions Fix](../MANUAL_PERMISSIONS_FIX.md) - Guide for manually fixing permissions

## Setup Scripts

This project includes several scripts to automate the setup process:

- `setup-directus.js` - All-in-one setup script
- `create-collections.js` - Creates necessary collections
- `fix-admin-permissions.js` - Sets up admin permissions
- `fix-public-permissions.js` - Sets up public permissions
- `seed-collections.js` - Seeds collections with sample data

See the [Setup Instructions](./SETUP_INSTRUCTIONS.md) for details on how to use these scripts.

## Local Development

### Prerequisites
- Docker and Docker Compose

### Starting Directus Locally

```bash
cd directus
docker-compose up -d
```

Directus will be available at http://localhost:8055

Default admin credentials:
- Email: admin@example.com
- Password: Admin123!

## Deployment to DigitalOcean

This project is configured to deploy to DigitalOcean App Platform.

### Manual Deployment

1. Install the Digital Ocean CLI if not already installed:
   ```bash
   brew install doctl
   ```

2. Authenticate with Digital Ocean:
   ```bash
   doctl auth init
   ```

3. Create the app:
   ```bash
   doctl apps create --spec .do/app.yaml
   ```

## Environment Configuration

Key environment variables are defined in:
- `.do/app.yaml` for DigitalOcean deployment
- `docker-compose.yml` for local development

## File Storage

Directus is configured to use the local file storage adapter with persistent storage on DigitalOcean.

## Database

The application uses PostgreSQL for data storage:
- Local: Runs in a Docker container with data persisted to `./data/database`
- Production: Uses DigitalOcean Managed PostgreSQL 