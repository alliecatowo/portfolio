import { getSiteConfig } from '~/utils/site-config';

export default defineNuxtPlugin({
  name: 'site-config',
  enforce: 'pre', // Run this plugin before others
  setup() {
    const config = useState('site-config', () => {
      // Set default config for SSR (this will be replaced on client-side)
      return getSiteConfig('localhost');
    });

    // Set the correct config on client-side once we have access to window.location
    if (process.client) {
      nextTick(() => {
        config.value = getSiteConfig(window.location.hostname);
        
        // Add theme class to body
        if (config.value.themeClass) {
          document.body.classList.add(config.value.themeClass);
        }
      });
    }

    return {
      provide: {
        siteConfig: config
      }
    };
  }
}); 