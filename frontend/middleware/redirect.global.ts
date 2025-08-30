/**
 * Global middleware to handle redirects
 */
import type { SiteConfig } from '~/utils/site-config';

export default defineNuxtRouteMiddleware((to) => {
  // Root route without trailing slash should go to the landing page
  if (to.path === '/') {
    return;
  }

  // Add redirects for the moved sections if a user tries to access old routes
  if (to.path.match(/^\/projects\/?/) && !to.path.match(/^\/dev\/projects\/?/)) {
    return navigateTo(`/dev${to.path}`);
  }

  if (to.path.match(/^\/open-source\/?/) && !to.path.match(/^\/dev\/open-source\/?/)) {
    return navigateTo(`/dev${to.path}`);
  }

  if (to.path.match(/^\/gallery\/?/) && !to.path.match(/^\/tattoo\/gallery\/?/)) {
    return navigateTo(`/tattoo${to.path}`);
  }

  if (to.path.match(/^\/testimonials\/?/) && !to.path.match(/^\/tattoo\/testimonials\/?/)) {
    return navigateTo(`/tattoo${to.path}`);
  }

  // Handle '/blog' route - check the site config to determine where to redirect
  if (to.path.match(/^\/blog\/?/) && !to.path.match(/^\/(dev|tattoo)\/blog\/?/)) {
    const siteConfig = useState<SiteConfig | null>('siteConfig', () => null);
    if (siteConfig.value?.type === 'tattoo') {
      return navigateTo(`/tattoo${to.path}`);
    } else {
      return navigateTo(`/dev${to.path}`);
    }
  }

  // Handle '/about' and '/contact' in the same way
  if ((to.path === '/about' || to.path === '/contact') && !to.path.match(/^\/(dev|tattoo)/)) {
    const siteConfig = useState<SiteConfig | null>('siteConfig', () => null);
    if (siteConfig.value?.type === 'tattoo') {
      return navigateTo(`/tattoo${to.path}`);
    } else {
      return navigateTo(`/dev${to.path}`);
    }
  }
}); 
