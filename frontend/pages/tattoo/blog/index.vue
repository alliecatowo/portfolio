<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary-700/10 to-primary-700/20 dark:from-primary-400/20 dark:to-primary-400/30">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6 relative">
            <span class="inline-block relative z-10">Tattoo Blog</span>
            <span class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-primary-700 dark:bg-primary-400 opacity-70 z-0"></span>
          </h1>
          <p class="text-lg mb-12">
            Stories, insights, and inspiration from my journey as a tattoo artist.
          </p>
        </div>
        
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-700 dark:border-primary-400"></div>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg max-w-2xl mx-auto">
          <p>{{ error }}</p>
        </div>
        
        <!-- Blog posts grid -->
        <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="post in posts" 
            :key="post.id" 
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <NuxtLink :to="`/tattoo/blog/${post.slug}`">
              <div class="relative aspect-video bg-gray-200 dark:bg-gray-700">
                <img 
                  v-if="post.featured_image" 
                  :src="post.featured_image" 
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
                  {{ new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                </div>
                <h2 class="text-xl font-bold mb-2">{{ post.title }}</h2>
                <p class="text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                  {{ post.description }}
                </p>
                <div class="flex flex-wrap gap-2" v-if="post.tags && post.tags.length">
                  <span 
                    v-for="tag in post.tags" 
                    :key="tag" 
                    class="px-2 py-1 text-xs rounded-full bg-primary-700/10 dark:bg-primary-400/20 text-primary-700 dark:text-primary-400"
                  >
                    {{ tag }}
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
        
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Ensure site config is set to tattoo
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'tattoo') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'tattoo'
  };
}

// Fetch tattoo blog posts directly with queryCollection
const { data: posts, pending: loading, error } = await useAsyncData(
  'tattoo-blog-posts',
  () => queryCollection('blog').where('category', '=', 'tattoo').where('published', '=', true).order('date', 'DESC').all()
);

// Image helper function
const getImageUrl = (image: any) => {
  return image?.url || image || '/placeholder-blog.jpg';
};

// Meta tags
useHead({
  title: `Blog - ${siteConfig.value?.title || 'Tattoo Portfolio'}`,
  meta: [
    { name: 'description', content: 'Read articles about tattoo design, inspiration, and client stories from my tattoo blog.' }
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