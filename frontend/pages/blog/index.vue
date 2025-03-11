<template>
  <div class="container-custom py-12">
    <h1 class="text-center mb-12">Blog</h1>
    
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-dark-primary"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg max-w-2xl mx-auto">
      <p>{{ error }}</p>
      <button @click="fetchBlogPosts" class="mt-4 text-primary dark:text-dark-primary font-medium">
        Try Again
      </button>
    </div>
    
    <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="post in posts" :key="post.id" class="card overflow-hidden">
        <div class="relative aspect-video bg-gray-200 dark:bg-gray-700 mb-4">
          <img 
            v-if="post.cover_image" 
            :src="getImageUrl(post.cover_image)" 
            :alt="post.title"
            class="w-full h-full object-cover"
          >
          <div 
            v-else 
            class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500"
          >
            Blog Image
          </div>
        </div>
        <div class="p-2">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {{ formatDate(post.date_published) }}
          </div>
          <h2 class="text-xl font-bold mb-2">
            {{ post.title }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {{ post.excerpt || truncateText(post.content) }}
          </p>
          <NuxtLink :to="`/blog/${post.slug}`" class="text-primary dark:text-dark-primary font-medium">
            Read More →
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <div v-if="!loading && !error && posts.length === 0" class="text-center py-16">
      <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 class="text-xl font-semibold mb-2">No blog posts found</h3>
      <p class="text-gray-500 dark:text-gray-400">Check back later for new content.</p>
    </div>
    
    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-12">
      <div class="flex space-x-2">
        <button 
          @click="currentPage > 1 && (currentPage--)" 
          :disabled="currentPage === 1"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <button 
          v-for="page in totalPages" 
          :key="page" 
          @click="currentPage = page"
          :class="[
            'px-4 py-2 rounded-md',
            currentPage === page ? 
              'bg-primary text-white' : 
              'border border-gray-300 dark:border-gray-700'
          ]"
        >
          {{ page }}
        </button>
        <button 
          @click="currentPage < totalPages && (currentPage++)" 
          :disabled="currentPage === totalPages"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDirectus } from '~/composables/useDirectus';
import { useSiteConfig } from '~/utils/site-config';

// Get site configuration
const siteConfig = useSiteConfig();

// Use Directus composable
const { fetchBlogPosts, getImageUrl } = useDirectus();

// State
const posts = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(9);

// Methods
const loadBlogPosts = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetchBlogPosts({
      page: currentPage.value,
      limit: pageSize.value,
      sort: ['-date_published'],
      fields: ['id', 'title', 'slug', 'excerpt', 'content', 'date_published', 'cover_image']
    });
    
    if (response) {
      posts.value = response;
      // Calculate total pages based on response metadata if available
      // This might need adjustment based on your API response structure
      if (response.meta?.total_count) {
        totalPages.value = Math.ceil(response.meta.total_count / pageSize.value);
      }
    } else {
      posts.value = [];
    }
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    error.value = 'Failed to load blog posts. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const truncateText = (text) => {
  if (!text) return '';
  // Remove HTML tags and truncate
  const plainText = text.replace(/<[^>]*>/g, '');
  return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText;
};

// Watch for page changes
watch(currentPage, () => {
  loadBlogPosts();
});

// Initial load
onMounted(() => {
  loadBlogPosts();
});

// Meta tags
useHead({
  title: `Blog - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`,
  meta: [
    { name: 'description', content: siteConfig.value?.type === 'dev' 
      ? 'Articles about development, coding, and tech insights from Allison'
      : 'Stories and insights about tattoo art, designs, and client experiences'
    }
  ]
});
</script> 