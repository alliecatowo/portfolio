import { createDirectus, rest, readItem, readItems, readSingleton } from '@directus/sdk';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  
  // Get the Directus URL from the environment variables or runtime config
  // For production, we'll use directus.allisons.dev
  const directusUrl = process.env.NODE_ENV === 'production' 
    ? 'https://directus.allisons.dev'
    : config.public.directusUrl;
  
  // Create a simple Directus client
  const directus = createDirectus(directusUrl)
    .with(rest());
  
  console.log(`Directus client initialized with URL: ${directusUrl}`);
  
  return {
    provide: { 
      directus, 
      readItem, 
      readItems,
      readSingleton
    },
  };
}); 