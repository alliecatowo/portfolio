<template>
  <section class="py-12 bg-white dark:bg-gray-850">
    <div class="container-custom">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Featured Tattoo Works
      </h2>
      
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-dark-primary"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="works.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No featured tattoo works available yet.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="work in works" 
          :key="work.id" 
          class="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
        >
          <div class="h-64 overflow-hidden">
            <img 
              v-if="work.images && work.images.data && work.images.data.length > 0" 
              :src="getStrapiMedia(work.images.data[0].attributes.url)" 
              :alt="work.title" 
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span class="text-gray-400 dark:text-gray-500">No image</span>
            </div>
          </div>
          
          <div class="p-6">
            <h3 class="font-bold text-xl mb-2 text-gray-900 dark:text-white">
              {{ work.title }}
            </h3>
            
            <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {{ work.description }}
            </p>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="style in work.styles?.data" 
                :key="style.id" 
                class="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary rounded-md"
              >
                {{ style.attributes.name }}
              </span>
            </div>
            
            <NuxtLink 
              :to="`/tattoo/gallery/${work.slug}`" 
              class="mt-4 inline-block text-primary dark:text-dark-primary hover:underline"
            >
              View Details
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <div class="mt-10 text-center">
        <NuxtLink 
          to="/tattoo/gallery" 
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark dark:bg-dark-primary dark:hover:bg-dark-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-dark-primary"
        >
          View All Works
          <svg class="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const works = ref<any[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Fetch featured tattoo works from API
const fetchFeaturedWorks = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const { data } = await $fetch('/api/content/tattoo/gallery?featured=true&limit=3');
    works.value = data || [];
  } catch (err) {
    console.error('Error fetching featured tattoo works:', err);
    error.value = 'Failed to load tattoo works. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

// Get media helper function
const getStrapiMedia = (url: string) => {
  // For now, return the URL directly
  // Later this can be enhanced with proper image optimization
  return url;
};

onMounted(() => {
  fetchFeaturedWorks();
});
</script> 