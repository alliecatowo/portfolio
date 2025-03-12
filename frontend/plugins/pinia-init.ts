/**
 * Plugin to initialize Pinia store for server-side rendering
 * This fixes the "Cannot read properties of undefined (reading '_s')" error
 */
import { defineNuxtPlugin } from '#app';
import { useAuthStore } from '~/composables/useAuth';

export default defineNuxtPlugin(({ $pinia }) => {
  // Initialize the auth store with default values for SSR
  const authStore = useAuthStore($pinia);
  
  // Set default values for server-side rendering
  if (process.server) {
    authStore.setAuth(false, false, null);
  }
}); 