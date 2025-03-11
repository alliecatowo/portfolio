import { createDirectus, rest, readItem, readItems, authentication, staticToken } from '@directus/sdk';
import { useRuntimeConfig } from '#app';
import { isVercelUrl } from '~/utils/cors';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const directusUrl = config.public.directusUrl;
  
  // Create Directus client
  const directus = createDirectus(directusUrl)
    .with(rest({
      onRequest: (params) => {
        // Check if we're running on a Vercel deployment
        const origin = window.location.origin;
        if (isVercelUrl(origin)) {
          // Add CORS headers for Vercel domains
          params.headers = {
            ...params.headers,
            'Origin': origin,
            'X-Requested-With': 'XMLHttpRequest'
          };
        }
        return params;
      }
    }))
    .with(authentication())
    .with(staticToken('2eEMQA40l35OBtWNH6nDS166k0o800sb'));
  
  // Log the initialization for debugging
  console.log(`Directus client initialized with URL: ${directusUrl}`);
  
  return {
    provide: { 
      directus, 
      readItem, 
      readItems 
    },
  };
}); 