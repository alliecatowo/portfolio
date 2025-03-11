# Vercel Deployment Guide

This guide explains how to deploy your portfolio to Vercel with the correct configuration to access your Directus instance.

## Prerequisites

- A Vercel account
- Your GitHub repository connected to Vercel
- A running Directus instance (on Digital Ocean)

## Environment Variables

You'll need to set up the following environment variables in your Vercel project settings:

1. **NUXT_PUBLIC_API_URL**: Your Directus instance URL
   - Value: `https://allisons-portfolio-directus-9vxdi.ondigitalocean.app`

2. **NUXT_PUBLIC_DIRECTUS_TOKEN**: The access token for reading data from Directus 
   - Value: `2eEMQA40l35OBtWNH6nDS166k0o800sb`

3. **DEV_SITE_URL**: URL of your deployed developer portfolio site
   - Value: Your deployed dev site URL or leave as default

4. **TATTOO_SITE_URL**: URL of your deployed tattoo portfolio site
   - Value: Your deployed tattoo site URL or leave as default

## Setting Up Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Click on "Settings" tab
4. Navigate to "Environment Variables" section
5. Add each of the variables mentioned above
6. Make sure to select all applicable environments (Production, Preview, Development)
7. Click "Save" after adding each variable

## Deployment Configuration

Your Nuxt project is already configured to deploy on Vercel in the `nuxt.config.ts` file:

```js
nitro: {
  preset: 'vercel'
}
```

## Deploying Your Site

1. Push your changes to GitHub
2. Vercel will automatically deploy your site if you've set up automatic deployments
3. Alternatively, you can manually trigger a deployment from the Vercel dashboard

## Verifying the Deployment

After deployment, check the following:

1. Visit your deployed site
2. Navigate to the blog, projects, and gallery pages to confirm data is loading properly
3. Check the browser console for any errors

## Troubleshooting

If data is not loading:

1. Verify the environment variables in Vercel
2. Check the browser console for error messages
3. Make sure your Directus instance is running
4. Confirm the token has read permissions for all collections
5. Try redeploying after fixing any issues

## Updating Deployment

When you make changes to your Directus schema or permissions:

1. Update the `portfolio-schema.yaml` file
2. Apply the changes to your Directus instance
3. Verify the changes on your local development
4. Push changes to GitHub to trigger a new deployment

## Further Support

If you encounter issues, check the Directus logs on Digital Ocean and the deployment logs on Vercel for more information. 