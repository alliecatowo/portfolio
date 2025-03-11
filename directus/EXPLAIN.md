# Directus Digital Ocean Deployment

This Directus deployment follows the official tutorial at [Deploy Directus to Digital Ocean](https://directus.io/docs/tutorials/self-hosting/deploy-directus-to-digital-ocean).

## Deployment Structure

1. **Dockerfile**: Uses the official Directus image with necessary configurations
2. **App Platform Config**: `.do/app.yaml` contains all Digital Ocean App Platform settings
3. **Database**: Uses a managed PostgreSQL database provided by Digital Ocean
4. **File Storage**: Uses local file storage adapter with persistence

## Deployment Steps

1. Authenticate with Digital Ocean:
   ```bash
   doctl auth init
   ```

2. Create and deploy the app:
   ```bash
   cd directus
   doctl apps create --spec .do/app.yaml
   ```

3. Once deployed, the Directus instance will be available at:
   `https://allisons-portfolio-directus.ondigitalocean.app`

4. Login with the admin credentials:
   - Email: admin@example.com
   - Password: Admin123!

## Frontend Integration

The frontend (deployed on Vercel) already has utilities to interact with the Directus API at:

- `/frontend/utils/directus.ts`: Core API utilities
- `/frontend/composables/useDirectus.ts`: Composable functions for Vue components
- `/frontend/components/BlogPost.vue`: Example component using Directus data

## Local Development

```bash
cd directus
docker-compose up -d
```

This will start Directus locally at http://localhost:8055 