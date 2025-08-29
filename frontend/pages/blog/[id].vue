<template>
  <div class="container-custom py-12">
    <div class="max-w-3xl mx-auto">
      <!-- Back link -->
      <NuxtLink to="/blog" class="inline-flex items-center mb-8 text-primary dark:text-dark-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Blog
      </NuxtLink>
      
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-dark-primary"></div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg">
        <p>{{ error }}</p>
        <button @click="loadBlogPost" class="mt-4 text-primary dark:text-dark-primary font-medium">
          Try Again
        </button>
      </div>
      
      <!-- Not found state -->
      <div v-else-if="!post" class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 class="text-xl font-semibold mb-2">Blog post not found</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-4">The article you're looking for doesn't exist or has been removed.</p>
        <NuxtLink to="/blog" class="text-primary dark:text-dark-primary font-medium">
          Return to Blog
        </NuxtLink>
      </div>
      
      <!-- Blog post content -->
      <article v-else>
        <div class="mb-8">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {{ formatDate(post.date_published) }}
          </div>
          <h1 class="mb-6">{{ post.title }}</h1>
          
          <!-- Post image -->
          <div v-if="post.cover_image" class="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-8">
            <img 
              :src="getImageUrl(post.cover_image)" 
              :alt="post.title"
              class="w-full h-full object-cover rounded-lg"
            >
          </div>
          <div v-else class="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-8">
            <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
              No Image Available
            </div>
          </div>
          
          <!-- Post content -->
          <div class="prose dark:prose-invert max-w-none" v-html="post.content"></div>
        </div>
      </article>
      
      <!-- Author info -->
      <div v-if="post" class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mr-4"></div>
          <div>
            <h3 class="font-bold">Allison</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ siteConfig.type === 'dev' ? 'Full-Stack Developer' : 'Tattoo Artist' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPostBySlug } from '~/utils/api/content';
import { useSiteConfig } from '~/utils/site-config';

// Get site configuration
const siteConfig = useSiteConfig();

// Get post slug from route
const route = useRoute();
const slug = route.params.id;

// State
const post = ref(null);
const loading = ref(true);
const error = ref(null);

// Methods
const loadBlogPost = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await getPostBySlug(slug.toString());
    
    if (response) {
      post.value = response;
    } else {
      post.value = null;
    }
  } catch (err) {
    console.error('Error fetching blog post:', err);
    error.value = 'Failed to load blog post. Please try again.';
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

const getImageUrl = (path) => path || '';

// Load data
onMounted(() => {
  loadBlogPost();
});

// Meta tags
useHead(() => ({
  title: post.value 
    ? `${post.value.title} - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`
    : `Blog - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`,
  meta: [
    { 
      name: 'description', 
      content: post.value?.excerpt || 'Detailed article with insights and information.' 
    }
  ]
}));
</script> 