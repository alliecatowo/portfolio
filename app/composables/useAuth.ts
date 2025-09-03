import { defineStore } from 'pinia';
import { onMounted } from 'vue';

/**
 * Authentication store for managing admin access
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    isAdmin: false,
    user: null as { username: string; role: string } | null,
  }),

  getters: {
    // Check if user is authenticated
    authenticated: (state) => state.isAuthenticated,
    
    // Check if user has admin privileges
    hasAdminAccess: (state) => state.isAdmin,
    
    // Get current user
    currentUser: (state) => state.user,
  },

  actions: {
    // Set authentication state
    setAuth(isAuthenticated: boolean, isAdmin: boolean, user: { username: string; role: string } | null) {
      this.isAuthenticated = isAuthenticated;
      this.isAdmin = isAdmin;
      this.user = user;
      
      // Save auth state to localStorage (persist through page refresh)
      if (import.meta.client) {
        if (isAuthenticated && user) {
          localStorage.setItem('auth', JSON.stringify({ isAuthenticated, isAdmin, user }));
        } else {
          localStorage.removeItem('auth');
        }
      }
    },
    
    // Login action
    login(username: string, password: string) {
      // For demo purposes, hardcoded admin credentials
      // In a production app, this would call an authentication API
      if (username === 'admin' && password === 'admin123') {
        this.setAuth(true, true, { username: 'admin', role: 'admin' });
        return true;
      }
      return false;
    },
    
    // Logout action
    logout() {
      this.setAuth(false, false, null);
    },
    
    // Initialize auth state from localStorage
    initAuth() {
      if (import.meta.client) {
        const authData = localStorage.getItem('auth');
        if (authData) {
          const { isAuthenticated, isAdmin, user } = JSON.parse(authData);
          this.setAuth(isAuthenticated, isAdmin, user);
        }
      }
    }
  }
});

// Composable to use the auth store
export const useAuth = () => {
  const authStore = useAuthStore();
  
  // Initialize auth on client-side
  if (import.meta.client) {
    onMounted(() => {
      authStore.initAuth();
    });
  }
  
  return authStore;
}; 