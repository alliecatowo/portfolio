import { createDirectus, rest, readItem, readItems, authentication, staticToken } from '@directus/sdk';
import { useRuntimeConfig } from '#app';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const directusUrl = config.public.directusUrl;
  
  // Create Directus client
  const directus = createDirectus(directusUrl)
    .with(rest())
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