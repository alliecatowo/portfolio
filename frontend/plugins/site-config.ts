import { getSiteConfig, useSiteConfig } from '~/utils/site-config';

export default defineNuxtPlugin({
  name: 'site-config',
  enforce: 'pre', // Run before other plugins
  setup() {
    // Initialize site config based on the current route
    const route = useRoute();
    const siteConfig = useSiteConfig();
    
    // Default to 'dev' if not specified
    let siteType: 'dev' | 'tattoo' = 'dev';
    
    // Check the path to determine the site type
    if (route.path.startsWith('/tattoo')) {
      siteType = 'tattoo';
    } else if (route.path.startsWith('/dev')) {
      siteType = 'dev';
    }
    
    // Set the initial site config
    if (!siteConfig.value) {
      siteConfig.value = getSiteConfig(siteType);
    }
  }
}); 