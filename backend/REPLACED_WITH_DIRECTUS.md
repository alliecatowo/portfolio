# Strapi Backend Replaced with Directus

The Strapi backend has been replaced with Directus CMS, which is now located in the `/directus` directory.

## Reasons for the Migration

1. **Improved Persistence**: Directus works better with DigitalOcean's persistent database solutions
2. **More Robust Admin Interface**: Directus provides a more comprehensive admin panel
3. **Better File Storage Options**: More flexible storage options for media files

## Access the New Backend

The new Directus backend is now hosted on DigitalOcean at: `https://allisons-portfolio-directus.ondigitalocean.app`

## Frontend Integration

The frontend continues to be hosted on Vercel but now connects to the Directus API for content. 