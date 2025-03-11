<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
        
        <div v-if="auth.authenticated">
          <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Welcome to the admin area. You can manage your content using the Strapi CMS.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <a 
              href="http://localhost:1337/admin" 
              target="_blank"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark dark:bg-dark-primary dark:hover:bg-dark-primary-light"
            >
              Go to Strapi Admin
            </a>
            
            <button 
              @click="logout" 
              class="inline-flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div v-else>
          <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
            You need to log in to access the admin area.
          </p>
          
          <NuxtLink 
            to="/admin/login" 
            class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark dark:bg-dark-primary dark:hover:bg-dark-primary-light"
          >
            Log In
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const auth = useAuth();
const router = useRouter();

// Handle logout
const logout = () => {
  auth.logout();
  router.push('/');
};
</script> 