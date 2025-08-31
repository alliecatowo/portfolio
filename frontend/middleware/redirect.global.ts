/**
 * Global middleware to handle redirects
 */

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

  // Removed gallery and testimonials redirects as tattoo portfolio was removed

  // Handle '/blog' route - redirect to dev blog
  if (to.path.match(/^\/blog\/?/) && !to.path.match(/^\/dev\/blog\/?/)) {
    return navigateTo(`/dev${to.path}`);
  }

  // Handle '/about' and '/contact' - redirect to dev versions
  if ((to.path === '/about' || to.path === '/contact') && !to.path.match(/^\/dev/)) {
    return navigateTo(`/dev${to.path}`);
  }
}); 
