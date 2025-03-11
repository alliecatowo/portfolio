import { createDirectus, rest, readItem, readItems, authentication, staticToken } from '@directus/sdk';
import { useRuntimeConfig } from '#app';
import { isVercelUrl } from '~/utils/cors';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  
  // Using server proxy to avoid CORS issues
  const proxyUrl = '/api/directus';
  
  // Create Directus client
  const directus = createDirectus(proxyUrl)
    .with(rest({
      onRequest: (params) => {
        // Add token to requests
        params.headers = {
          ...params.headers,
          'Content-Type': 'application/json',
        };
        return params;
      }
    }))
    .with(authentication())
    .with(staticToken(config.public.directusToken));
  
  // Log the initialization for debugging
  console.log(`Directus client initialized with URL: ${proxyUrl}`);
  
  return {
    provide: { 
      directus, 
      readItem, 
      readItems 
    },
  };
}); 