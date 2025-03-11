/**
 * Middleware to protect admin routes and require authentication
 */
import { useAuthStore } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware if not on the client side (during SSR)
  if (process.server) return;
  
  const authStore = useAuthStore();
  
  // Check if the route requires authentication (all /admin routes except login)
  if (to.path.startsWith('/admin') && to.path !== '/admin/login' && !authStore.authenticated) {
    // Redirect to login if not authenticated
    return navigateTo('/admin/login');
  }
}); 