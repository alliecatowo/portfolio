<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-dark-primary/10 dark:to-dark-primary/20">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">Developer Blog</h1>
          <p class="text-lg mb-12">
            Thoughts, tutorials, and insights about web development, programming, and technology.
          </p>
        </div>
        
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-dark-primary"></div>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg max-w-2xl mx-auto">
          <p>{{ error }}</p>
          <button @click="fetchPosts" class="mt-4 text-primary dark:text-dark-primary font-medium">
            Try Again
          </button>
        </div>
        
        <!-- Blog posts grid -->
        <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="post in posts" 
            :key="post.id" 
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <NuxtLink :to="`/dev/blog/${post.slug}`">
              <div class="relative aspect-video bg-gray-200 dark:bg-gray-700">
                <img 
                  v-if="post.image" 
                  :src="post.image.url" 
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
              <div class="p-4">
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {{ new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                </div>
                <h2 class="text-xl font-bold mb-2">{{ post.title }}</h2>
                <p class="text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                  {{ post.excerpt }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="category in post.categories" 
                    :key="category.id" 
                    class="px-2 py-1 text-xs rounded-full bg-primary/10 dark:bg-dark-primary/20 text-primary dark:text-dark-primary"
                  >
                    {{ category.name }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
        
        <!-- Empty state -->
        <div v-if="!loading && !error && posts.length === 0" class="text-center py-16">
          <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold mb-2">No posts found</h3>
          <p class="text-gray-500 dark:text-gray-400">Check back later for new content.</p>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-12">
          <div class="flex space-x-2">
            <button 
              @click="currentPage > 1 && (currentPage--)" 
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded-md bg-white dark:bg-gray-800 shadow disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              v-for="page in totalPages" 
              :key="page" 
              @click="currentPage = page"
              :class="[
                'px-4 py-2 rounded-md shadow',
                currentPage === page ? 
                  'bg-primary dark:bg-dark-primary text-white' : 
                  'bg-white dark:bg-gray-800'
              ]"
            >
              {{ page }}
            </button>
            <button 
              @click="currentPage < totalPages && (currentPage++)" 
              :disabled="currentPage === totalPages"
              class="px-4 py-2 rounded-md bg-white dark:bg-gray-800 shadow disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';
import { getPosts } from '~/utils/api/content';

// Ensure site config is set to dev
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'dev') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'dev',
    baseRoute: '/dev'
  };
}

// State
const posts = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 9;

// Fetch posts
const fetchPosts = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // In a real implementation, this would fetch from Strapi
    const response = await getPosts(currentPage.value, pageSize, {
      siteType: {
        $in: ['dev', 'both']
      }
    });
    
    if (response) {
      posts.value = response.data || [];
      totalPages.value = Math.ceil((response.meta?.pagination?.total || 0) / pageSize);
      
      // For demo purposes, if there's no data from Strapi, use placeholder data
      if (posts.value.length === 0) {
        posts.value = Array.from({ length: 6 }, (_, i) => ({
          id: i + 1,
          title: `Development Article ${i + 1}`,
          slug: `dev-article-${i + 1}`,
          excerpt: 'This is a sample excerpt for a development blog post. In a real application, this would be fetched from the CMS.',
          publishedAt: new Date(Date.now() - (i * 1000000000)).toISOString(),
          categories: [
            { id: 1, name: 'Web Development' },
            { id: 2, name: 'JavaScript' }
          ]
        }));
        
        totalPages.value = 1; // For demo purposes
      }
    }
  } catch (err) {
    console.error('Error fetching posts:', err);
    error.value = 'Failed to load blog posts. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(currentPage, () => {
  fetchPosts();
  // Scroll to top when changing pages
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Lifecycle
onMounted(() => {
  fetchPosts();
});

// Meta tags
useHead({
  title: `Blog - ${siteConfig.value?.title || 'Developer Portfolio'}`,
  meta: [
    { name: 'description', content: 'Read articles about web development, programming tips, and technology insights from my developer blog.' }
  ]
});
</script>

<style scoped>
.container-custom {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 