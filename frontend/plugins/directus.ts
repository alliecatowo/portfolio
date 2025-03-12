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
  if (!formattedUrl || typeof formattedUrl !== 'string') {
    console.warn('Invalid Directus URL provided:', directusUrl);
    formattedUrl = 'https://directus.allisons.dev'; // Fallback URL
  } else if (!formattedUrl.startsWith('http')) {
    formattedUrl = `https://${formattedUrl}`;
  }
  
  // Create Directus client - ensure it's initialized only once
  const directus = createDirectus(formattedUrl)
    .with(rest())
    .with(authentication())
    .with(staticToken(config.public.directusToken || '2eEMQA40l35OBtWNH6nDS166k0o800sb'));
  
  // Log the initialization for debugging
  console.log(`Directus client initialized with URL: ${formattedUrl}`);
  
  // Safe access to API
  const getApi = () => {
    try {
      return directus.api || {};
    } catch (err) {
      console.error('Error accessing Directus API:', err);
      return {};
    }
  };
  
  // Provide all Directus SDK functions to avoid 'undefined' errors
  return {
    provide: { 
      directus, 
      readItem, 
      readItems,
      restClient: getApi(),
      directusUrl: formattedUrl,
      directusToken: config.public.directusToken || '2eEMQA40l35OBtWNH6nDS166k0o800sb'
    },
  };
}); 