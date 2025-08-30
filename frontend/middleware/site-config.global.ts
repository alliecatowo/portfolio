import { getSiteConfig } from "~/utils/site-config";

export default defineNuxtRouteMiddleware((to) => {
  // Get current path from the 'to' parameter directly
  const path = to.path;
  
  // Determine site type based on route path
  let siteType: 'dev' | 'tattoo' | 'dual' = 'dual'; // Default to dual mode

  if (path.startsWith('/tattoo')) {
    siteType = 'tattoo';
  } else if (path.startsWith('/dev')) {
    siteType = 'dev';
  }
  
  // Set site config directly in the middleware without useRoute
  const siteConfig = useState('siteConfig', () => getSiteConfig('dual'));
  siteConfig.value = getSiteConfig(siteType);
}); 