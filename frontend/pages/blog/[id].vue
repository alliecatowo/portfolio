<template>
  <UContainer class="py-12">
    <div class="max-w-3xl mx-auto">
      <!-- Back link -->
      <UButton to="/blog" variant="ghost" color="primary" icon="i-heroicons-arrow-left" class="mb-6">Back to Blog</UButton>
      
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <USkeleton class="h-12 w-12 rounded-full" />
      </div>
      
      <!-- Error state -->
      <UAlert v-else-if="error" color="error" variant="subtle" :title="error.message || 'Error loading post'" />
      
      <!-- Not found state -->
      <div v-else-if="!post" class="text-center py-16">
        <UIcon name="i-heroicons-document-magnifying-glass" class="w-14 h-14 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
        <h2 class="text-xl font-semibold mb-2">Blog post not found</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-4">The article you're looking for doesn't exist or has been removed.</p>
        <UButton to="/blog" color="primary">Return to Blog</UButton>
      </div>
      
      <!-- Blog post content -->
      <article v-else>
        <div class="mb-8">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {{ formatDate(post.date) }}
          </div>
          <h1 class="mb-6">{{ post.title }}</h1>
          
          <!-- Post image -->
          <div v-if="post.featured_image" class="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-8">
            <NuxtImg 
              preset="blogCard"
              :src="getImageUrl(post.featured_image)" 
              :alt="post.title"
              class="w-full h-full object-cover rounded-lg"
              loading="lazy"
              sizes="sm:100vw md:75vw lg:75vw"
            />
          </div>
          <div v-else class="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-8">
            <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
              No Image Available
            </div>
          </div>
          
          <!-- Post content -->
          <ContentRenderer v-if="post.body" :value="post" class="prose dark:prose-invert max-w-none" />
          <div v-else class="prose dark:prose-invert max-w-none"></div>
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
  </UContainer>
</template>

<script setup lang="ts">
import { useContent } from '~/composables/useContent';
import { useSiteConfig } from '~/utils/site-config';

// Get site configuration
const siteConfig = useSiteConfig();

// Get post slug from route
const route = useRoute();
const slug = route.params.id as string;

// Use content composable
const { fetchBlogPost } = useContent();

// Determine category based on current path
const category = computed(() => {
  return route.path.includes('/dev/') ? 'dev' : 'tattoo'
});

// Fetch the blog post
const { data: post, pending: loading, error } = await useAsyncData(
  `blog-post-${category.value}-${slug}`,
  () => fetchBlogPost(category.value, slug)
);

// Helper functions
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const getImageUrl = (path: string) => path || '';

// Meta tags
useHead(() => ({
  title: post.value 
    ? `${post.value.title} - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`
    : `Blog - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`,
  meta: [
    { 
      name: 'description', 
      content: post.value?.description || 'Detailed article with insights and information.' 
    }
  ]
}));
</script> 
