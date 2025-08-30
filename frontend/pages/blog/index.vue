<template>
  <main class="container mx-auto px-4 py-12">
    <header class="text-center mb-12">
      <h1 class="text-4xl font-bold">Blog</h1>
      <p class="sr-only">{{ siteConfig?.type === 'dev' ? 'Development articles and tutorials' : 'Tattoo art stories and insights' }}</p>
    </header>
    
    <!-- Loading state -->
    <div v-if="pending" class="flex justify-center py-20" role="status" aria-label="Loading blog posts">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 text-primary" aria-hidden="true" />
      <span class="sr-only">Loading blog posts...</span>
    </div>
    
    <!-- Error state -->
    <section v-else-if="error" class="max-w-2xl mx-auto" role="alert" aria-labelledby="error-title">
      <h2 id="error-title" class="sr-only">Error loading content</h2>
      <UAlert color="error" :title="error.message || 'Error loading blog posts'" />
    </section>
    
    <!-- Blog posts grid -->
    <section v-else-if="posts && posts.length > 0" aria-labelledby="posts-heading">
      <h2 id="posts-heading" class="sr-only">Blog posts</h2>
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3" role="feed" aria-busy="false">
        <article 
          v-for="post in posts" 
          :key="post.path"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          :aria-labelledby="`post-title-${post.path}`"
          :aria-describedby="`post-desc-${post.path}`"
          role="article"
        >
          <!-- Featured image -->
          <figure class="relative aspect-video bg-gray-100 dark:bg-gray-800">
            <img 
              v-if="post.featured_image" 
              :src="post.featured_image" 
              :alt="`Featured image for article: ${post.title}`"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div 
              v-else 
              class="absolute inset-0 flex items-center justify-center text-gray-400"
              role="img"
              :aria-label="`Placeholder image for ${post.title}`"
            >
              <UIcon name="i-heroicons-photo" class="h-12 w-12" aria-hidden="true" />
            </div>
          </figure>
          
          <div class="p-6 space-y-3">
            <!-- Metadata -->
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <UIcon name="i-heroicons-calendar" class="h-4 w-4" aria-hidden="true" />
              <time :datetime="post.date" class="font-medium">{{ formatDate(post.date) }}</time>
              <span aria-hidden="true" class="mx-1">•</span>
              <span class="inline-flex items-center gap-1">
                <UIcon name="i-lucide-clock" class="h-3.5 w-3.5" aria-hidden="true" />
                <span class="sr-only">Reading time:</span>
                {{ getReadTime(post) }}
              </span>
            </div>
            
            <!-- Title -->
            <h3 :id="`post-title-${post.path}`" class="text-xl font-bold">
              <NuxtLink 
                :to="`/blog/${post.slug || post.path?.split('/').pop()}`"
                class="hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                {{ post.title }}
              </NuxtLink>
            </h3>
            
            <!-- Description -->
            <p :id="`post-desc-${post.path}`" class="text-gray-600 dark:text-gray-300 line-clamp-3">
              {{ post.description }}
            </p>
            
            <!-- Tags -->
            <nav v-if="post.tags && post.tags.length > 0" aria-label="Article tags">
              <ul class="flex flex-wrap gap-2" role="list">
                <li v-for="tag in post.tags" :key="tag">
                  <span 
                    class="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                    role="tag"
                  >
                    {{ tag }}
                  </span>
                </li>
              </ul>
            </nav>
          </div>
          
          <!-- Read more link -->
          <footer class="px-6 pb-6">
            <NuxtLink 
              :to="`/blog/${post.slug || post.path?.split('/').pop()}`"
              class="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 -ml-2"
              :aria-label="`Read full article: ${post.title}`"
            >
              Read More
              <UIcon name="i-heroicons-arrow-right" class="h-4 w-4" aria-hidden="true" />
            </NuxtLink>
          </footer>
        </article>
      </div>
    </section>
    
    <!-- Empty state -->
    <section v-else class="text-center py-16" role="status" aria-labelledby="no-posts-heading">
      <UIcon name="i-heroicons-document-text" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" aria-hidden="true" />
      <h2 id="no-posts-heading" class="text-xl font-semibold mb-2">No blog posts found</h2>
      <p class="text-gray-500 dark:text-gray-400">Check back later for new content.</p>
    </section>
  </main>
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

const { estimateReadTime, formatReadTime } = useReadTime();
const getReadTime = (post: any) => {
  if (!post) return '';
  const readTime = estimateReadTime(post);
  return formatReadTime(readTime.minutes);
};

// Meta tags
useHead({
  title: `Blog - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`,
  meta: [
    { name: 'description', content: siteConfig.value?.type === 'dev' 
      ? 'Articles about development, coding, and tech insights from Allison'
      : 'Stories and insights about tattoo art, designs, and client experiences'
    },
    { property: 'og:title', content: `Blog - ${siteConfig.value?.title || 'Allison\'s Portfolio'}` },
    { property: 'og:type', content: 'website' }
  ]
});
</script>