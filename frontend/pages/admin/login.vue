<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Admin Login
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Log in to access the admin dashboard
        </p>
      </div>
      
      <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
        <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input
              id="username"
              v-model="username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10"
              placeholder="Username"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 dark:bg-primary-400 dark:hover:bg-primary-400-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-400 disabled:opacity-50"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Logging in...' : 'Sign in' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useAuth } from '~/composables/useAuth';

// Form state
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

// Get auth store
const auth = useAuth();
const router = useRouter();

// Handle login submission
const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    // Attempt login
    const success = auth.login(username.value, password.value);
    
    if (success) {
      // Redirect to admin dashboard
      await router.push('/admin');
    } else {
      errorMessage.value = 'Invalid username or password';
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = 'An error occurred during login. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// If already authenticated, redirect to admin dashboard
onMounted(() => {
  if (auth.authenticated) {
    router.push('/admin');
  }
});
</script> 