import { ref, reactive, onMounted } from 'vue';

// Simple reactive state without Pinia
const authState = reactive({
  isAuthenticated: false,
  isAdmin: false,
  user: null as { username: string; role: string } | null,
});

/**
 * Simple auth composable that doesn't rely on Pinia
 * This avoids SSR issues with Pinia store initialization
 */
export const useAuth = () => {
  // Initialize auth on client-side only
  if (process.client) {
    onMounted(() => {
      try {
        const authData = localStorage.getItem('auth');
        if (authData) {
          const { isAuthenticated, isAdmin, user } = JSON.parse(authData);
          authState.isAuthenticated = isAuthenticated;
          authState.isAdmin = isAdmin;
          authState.user = user;
        }
      } catch (error) {
        console.error('Error initializing auth from localStorage:', error);
      }
    });
  }

  const login = (username: string, password: string) => {
    // For demo purposes, hardcoded admin credentials
    // In a production app, this would call an authentication API
    if (username === 'admin' && password === 'admin123') {
      authState.isAuthenticated = true;
      authState.isAdmin = true;
      authState.user = { username: 'admin', role: 'admin' };
      
      // Save auth state to localStorage (persist through page refresh)
      if (process.client && typeof localStorage !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify(authState));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    authState.isAuthenticated = false;
    authState.isAdmin = false;
    authState.user = null;
    
    // Remove auth state from localStorage
    if (process.client && typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth');
    }
  };

  // Return a simpler API that matches what components expect
  return {
    authenticated: authState.isAuthenticated,
    hasAdminAccess: authState.isAdmin,
    currentUser: authState.user,
    login,
    logout
  };
};

// Keep this for backward compatibility
// but it doesn't actually use Pinia anymore
export const useAuthStore = () => {
  return useAuth();
}; 