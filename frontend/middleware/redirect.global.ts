/**
 * Global middleware to handle redirects
 */
export default defineNuxtRouteMiddleware((to, from) => {
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
    const siteConfig = useState('site-config');
    if (siteConfig.value?.type === 'tattoo') {
      return navigateTo(`/tattoo${to.path}`);
    } else {
      return navigateTo(`/dev${to.path}`);
    }
  }

  // Handle '/about' and '/contact' in the same way
  if ((to.path === '/about' || to.path === '/contact') && !to.path.match(/^\/(dev|tattoo)/)) {
    const siteConfig = useState('site-config');
    if (siteConfig.value?.type === 'tattoo') {
      return navigateTo(`/tattoo${to.path}`);
    } else {
      return navigateTo(`/dev${to.path}`);
    }
  }

  // Redirect old routes to new routes
  
  // Main home page redirects
  if (to.path === '/strapi') {
    return navigateTo('/');
  }
  
  // Redirect old /api routes 
  if (to.path.startsWith('/api/')) {
    console.warn('Deprecated API route accessed:', to.path);
    return navigateTo('/');
  }
  
  // Redirect old portfolio path to dev
  if (to.path.match(/^\/portfolio\/?/) && !to.path.match(/^\/dev\/?/)) {
    return navigateTo(to.path.replace(/^\/portfolio/, '/dev'));
  }
  
  // Redirect old gallery path
  if (to.path.match(/^\/gallery\/?/) && !to.path.match(/^\/tattoo\/gallery\/?/)) {
    return navigateTo(to.path.replace(/^\/gallery/, '/tattoo/gallery'));
  }
  
  // Redirect old testimonials path
  if (to.path.match(/^\/testimonials\/?/) && !to.path.match(/^\/tattoo\/testimonials\/?/)) {
    return navigateTo(to.path.replace(/^\/testimonials/, '/tattoo/testimonials'));
  }
  
  // Redirect old blog paths
  if (to.path.match(/^\/blog\/?/)) {
    if (to.query.type === 'dev') {
      return navigateTo(to.path.replace(/^\/blog/, '/dev/blog'));
    } else if (to.query.type === 'tattoo') {
      return navigateTo(to.path.replace(/^\/blog/, '/tattoo/blog'));
    }
  }
}); 