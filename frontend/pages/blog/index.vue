<template>
  <div class="container mx-auto px-4 py-12">
    <UContainer>
      <h1 class="text-4xl font-bold text-center mb-12">Blog</h1>
      
      <div v-if="pending" class="flex justify-center py-20">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 text-primary" />
      </div>
      
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <UAlert color="red" :title="error.message || 'Error loading blog posts'" />
      </div>
      
      <div v-else-if="posts && posts.length > 0" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <UCard v-for="post in posts" :key="post._path">
          <template #header>
            <div class="relative aspect-video bg-gray-100 dark:bg-gray-800">
              <img 
                v-if="post.image" 
                :src="post.image" 
                :alt="post.title"
                class="w-full h-full object-cover rounded-t-lg"
              >
              <div 
                v-else 
                class="absolute inset-0 flex items-center justify-center text-gray-400"
              >
                <UIcon name="i-heroicons-photo" class="h-12 w-12" />
              </div>
            </div>
          </template>
          
          <div class="space-y-3">
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <UIcon name="i-heroicons-calendar" class="h-4 w-4" />
              <time :datetime="post.date">{{ formatDate(post.date) }}</time>
            </div>
            
            <h2 class="text-xl font-bold">{{ post.title }}</h2>
            
            <p class="text-gray-600 dark:text-gray-300 line-clamp-3">
              {{ post.description }}
            </p>
            
            <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2">
              <UBadge 
                v-for="tag in post.tags" 
                :key="tag"
                color="gray"
                variant="subtle"
                size="xs"
              >
                {{ tag }}
              </UBadge>
            </div>
          </div>
          
          <template #footer>
            <UButton 
              :to="`/blog/${post._path.split('/').pop()}`"
              variant="link"
              color="primary"
              trailing-icon="i-heroicons-arrow-right"
            >
              Read More
            </UButton>
          </template>
        </UCard>
      </div>
      
      <div v-else class="text-center py-16">
        <UIcon name="i-heroicons-document-text" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
        <h3 class="text-xl font-semibold mb-2">No blog posts found</h3>
        <p class="text-gray-500 dark:text-gray-400">Check back later for new content.</p>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { useContent } from '~/composables/useContent';
import { useSiteConfig } from '~/utils/site-config';

// Get site configuration
const siteConfig = useSiteConfig();

// Use content composable
const { fetchBlogPosts } = useContent();

// Determine which blog category to show based on site type
const blogCategory = computed(() => siteConfig.value?.type === 'tattoo' ? 'tattoo' : 'dev');

// Fetch blog posts using Nuxt Content
const { data: posts, pending, error } = await useAsyncData(
  `blog-posts-${blogCategory.value}`,
  () => fetchBlogPosts(blogCategory.value)
);

// Helper function to format dates
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

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