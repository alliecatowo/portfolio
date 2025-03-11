import { createDirectus, rest, readItem, readItems, readSingleton } from '@directus/sdk';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  
  // Get the Directus URL from the runtime config
  // This ensures we're using the proper environment variables
  const directusUrl = config.public.directusUrl;
  
  // Create a simple Directus client
  const directus = createDirectus(directusUrl)
    .with(rest());
  
  console.log(`Directus client initialized with URL: ${directusUrl}`);
  console.log(`Runtime config public keys: ${Object.keys(config.public).join(', ')}`);
  console.log(`DIRECTUS_URL env value: ${directusUrl}`);
  
  return {
    provide: { 
      directus, 
      readItem, 
      readItems,
      readSingleton
    },
  };
}); 