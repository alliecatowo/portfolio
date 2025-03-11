import { createDirectus, rest, readItem, readItems, authentication, staticToken } from '@directus/sdk';
import { useRuntimeConfig } from '#app';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const directusUrl = config.public.directusUrl;
  
  // Log runtime config for debugging
  console.log(`Runtime config public keys: ${Object.keys(config.public).join(', ')}`);
  console.log(`DIRECTUS_URL env value: ${directusUrl}`);
  
  // Make sure we have a properly formatted URL with https:// prefix
  let formattedUrl = directusUrl;
  if (!formattedUrl.startsWith('http')) {
    formattedUrl = `https://${formattedUrl}`;
  }
  
  // Create Directus client
  const directus = createDirectus(formattedUrl)
    .with(rest())
    .with(authentication())
    .with(staticToken(config.public.directusToken || '2eEMQA40l35OBtWNH6nDS166k0o800sb'));
  
  // Log the initialization for debugging
  console.log(`Directus client initialized with URL: ${formattedUrl}`);
  
  return {
    provide: { 
      directus, 
      readItem, 
      readItems 
    },
  };
}); 