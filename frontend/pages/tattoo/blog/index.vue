<template>
  <div>
    <section class="py-12 md:py-20">
      <UContainer>
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-3 text-primary dark:text-primary-400">Tattoo Blog</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-10">
            Stories, insights, and inspiration from my journey as a tattoo artist.
          </p>
        </div>
        
        <!-- Loading state -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard v-for="n in 6" :key="n">
            <div class="aspect-video mb-4">
              <USkeleton class="h-full w-full" />
            </div>
            <USkeleton class="h-6 w-2/3 mb-2" />
            <USkeleton class="h-4 w-full mb-2" />
            <USkeleton class="h-4 w-1/2" />
          </UCard>
        </div>
        
        <!-- Error state -->
        <UAlert v-else-if="error" color="error" variant="subtle" title="Failed to load posts" class="max-w-xl mx-auto" />
        
        <!-- Blog posts grid -->
        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <UCard
            v-for="post in posts"
            :key="post.path || post.slug"
            class="overflow-hidden hover:shadow-lg transition-shadow"
            :ui="{ body: 'p-4 sm:p-5' }"
          >
            <NuxtLink :to="`/tattoo/blog/${post.slug}`" class="no-underline">
              <div class="relative aspect-video bg-gray-200 dark:bg-gray-800 rounded-md overflow-hidden">
                <img 
                  v-if="post.featured_image" 
                  :src="post.featured_image" 
                  :alt="post.title"
                  class="w-full h-full object-cover"
                >
                <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500" v-else>
                  Blog Image
                </div>
              </div>
              <div class="mt-4">
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {{ new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                </div>
                <div v-if="getReadTime(post)" class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <UIcon name="i-lucide-clock" class="w-3 h-3 mr-1 inline" />
                  {{ getReadTime(post) }}
                </div>
                <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
                <p class="text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                  {{ post.description }}
                </p>
                <div class="flex flex-wrap gap-2" v-if="post.tags && post.tags.length">
                  <UBadge v-for="tag in post.tags" :key="tag" color="primary" variant="soft" class="text-xs">{{ tag }}</UBadge>
                </div>
              </div>
            </NuxtLink>
          </UCard>
        </div>
        
        <!-- Empty state -->
        <div v-if="!loading && !error && (!posts || posts.length === 0)" class="text-center py-16">
          <UIcon name="i-heroicons-document-text" class="w-14 h-14 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <h3 class="text-xl font-semibold mb-2">No posts found</h3>
          <p class="text-gray-500 dark:text-gray-400">Check back later for new content.</p>
        </div>
        
      </UContainer>
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

const { estimateReadTime, formatReadTime } = useReadTime();
const getReadTime = (post: any) => {
  if (!post) return '';
  const readTime = estimateReadTime(post);
  return formatReadTime(readTime.minutes);
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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
