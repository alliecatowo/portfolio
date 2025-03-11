<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8">Tattoo Gallery</h1>
    
    <div v-if="loading" class="flex justify-center my-12">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg my-8">
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
    </div>
    
    <div v-else-if="!tattooWorks || tattooWorks.length === 0" class="text-center my-12">
      <p class="text-xl text-gray-600 dark:text-gray-400">No tattoo works available at the moment.</p>
      <p class="mt-4">Check back soon for updates to our gallery.</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="work in tattooWorks" 
        :key="work.id" 
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
      >
        <div class="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700">
          <img 
            v-if="work.image" 
            :src="getAssetUrl(work.image)" 
            :alt="work.title" 
            class="w-full h-full object-cover"
          >
          <div v-else class="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900"></div>
        </div>
        <div class="p-4">
          <h3 class="text-xl font-semibold mb-2">{{ work.title }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-3">{{ work.description }}</p>
          
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ work.date ? new Date(work.date).toLocaleDateString() : 'Date not available' }}
            </span>
            <span v-if="work.style" class="inline-block bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
              {{ work.style.name }}
            </span>
          </div>
          
          <blockquote v-if="work.client_testimonial" class="italic text-sm text-gray-500 dark:text-gray-400 border-l-2 border-purple-300 dark:border-purple-700 pl-3 mt-4">
            "{{ work.client_testimonial }}"
          </blockquote>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getTattooWorks, getAssetUrl } from '~/utils/api/content';
import LoadingSpinner from '~/components/common/LoadingSpinner.vue';

const tattooWorks = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await getTattooWorks();
    tattooWorks.value = response.data || [];
  } catch (err) {
    console.error('Error fetching tattoo works:', err);
    error.value = 'Failed to load tattoo works. Please try again later.';
  } finally {
    loading.value = false;
  }
});
</script> 