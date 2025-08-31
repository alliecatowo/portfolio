/**
 * Global middleware to handle redirects
 */

export default defineNuxtRouteMiddleware((to) => {
  // Root route without trailing slash should go to the landing page
  if (to.path === '/') {
    return;
  }

  // Redirect old /dev routes to new unified routes
  if (to.path.startsWith('/dev/')) {
    const newPath = to.path.replace('/dev', '');
    return navigateTo(newPath);
  }
  
  // Redirect /dev to root since we've unified the portfolio
  if (to.path === '/dev') {
    return navigateTo('/');
  }
}); 
