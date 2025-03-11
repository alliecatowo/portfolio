import { createDirectus, rest, readItem, readItems, authentication } from '@directus/sdk';
import { useRuntimeConfig } from '#app';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const directusUrl = config.public.directusUrl;
  
  const directus = createDirectus(directusUrl)
    .with(rest())
    .with(authentication());
  
  // Static token authentication
  directus.setToken('2eEMQA40l35OBtWNH6nDS166k0o800sb');
  
  return {
    provide: { 
      directus, 
      readItem, 
      readItems 
    },
  };
}); 