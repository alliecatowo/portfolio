/**
 * Plugin to initialize auth for server-side rendering
 * This is a dummy plugin that doesn't do anything since we've removed Pinia dependency
 */
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
  // No initialization needed with our new approach
  console.log('Auth initialization plugin loaded (no-op)');
}); 