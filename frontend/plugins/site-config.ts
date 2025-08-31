import { getSiteConfig, useSiteConfig } from '~/utils/site-config';

export default defineNuxtPlugin({
  name: 'site-config',
  enforce: 'pre', // Run before other plugins
  setup() {
    // Initialize site config based on the current route
    const route = useRoute();
    const siteConfig = useSiteConfig();
    
    // Default to 'dev' since tattoo portfolio was removed
    let siteType: 'dev' | 'dual' = 'dev';
    
    // Check the path to determine the site type
    if (route.path.startsWith('/dev')) {
      siteType = 'dev';
    } else {
      siteType = 'dual';
    }
    
    // Set the initial site config
    if (!siteConfig.value) {
      siteConfig.value = getSiteConfig(siteType);
    }
  }
}); 