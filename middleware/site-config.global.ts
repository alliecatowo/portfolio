import { getSiteConfig, useSiteConfig } from "~/utils/site-config";

export default defineNuxtRouteMiddleware((to, from) => {
  // Get current path
  const path = to.path;
  
  // Determine site type based on route path
  let siteType: 'dev' | 'tattoo' = 'dev'; // Default to dev

  if (path.startsWith('/tattoo')) {
    siteType = 'tattoo';
  } else if (path.startsWith('/dev')) {
    siteType = 'dev';
  } else {
    // For non-prefixed routes, we need to check if we're coming from a prefixed route
    if (from.path.startsWith('/tattoo')) {
      siteType = 'tattoo';
    }
  }
  
  // Update site config based on path
  const config = useSiteConfig();
  config.value = {
    ...getSiteConfig(siteType),
    // Store the base route for generating correct links
    baseRoute: siteType === 'dev' ? '/dev' : '/tattoo'
  };
}); 