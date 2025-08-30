<template>
  <div>
    <section class="py-12 md:py-20">
      <UContainer>
        <div class="max-w-4xl mx-auto text-center mb-10">
          <h1 class="text-4xl md:text-5xl font-bold mb-3 text-primary">Developer Blog</h1>
          <p class="text-lg text-muted">
            Thoughts, tutorials, and insights about web development.
          </p>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard v-for="n in 6" :key="n" class="glass card-hover">
            <div class="aspect-video mb-4 rounded-lg overflow-hidden">
              <USkeleton class="h-full w-full skeleton-shimmer" />
            </div>
            <USkeleton class="h-6 w-2/3 mb-2 skeleton-shimmer" />
            <USkeleton class="h-4 w-full mb-2 skeleton-shimmer" />
            <USkeleton class="h-4 w-1/2 mb-3 skeleton-shimmer" />
            <div class="flex gap-2">
              <USkeleton class="h-5 w-12 skeleton-shimmer" />
              <USkeleton class="h-5 w-16 skeleton-shimmer" />
              <USkeleton class="h-5 w-14 skeleton-shimmer" />
            </div>
          </UCard>
        </div>

        <!-- Error state -->
        <UAlert v-else-if="error" color="error" variant="subtle" title="Failed to load posts" class="max-w-xl mx-auto" />

        <!-- Blog posts grid -->
        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <UCard
            v-for="post in posts"
            :key="post.path || post._id || post.slug"
            class="overflow-hidden glass card-hover group"
            :ui="{ body: 'p-0' }"
          >
            <NuxtLink :to="`/dev/blog/${post.slug}`" class="no-underline block h-full">
              <div class="relative aspect-video bg-gradient-card overflow-hidden">
                <img
                  v-if="post.featured_image"
                  :src="post.featured_image"
                  :alt="post.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                >
                <div v-else class="absolute inset-0 bg-gradient-dev flex items-center justify-center">
                  <UIcon name="i-lucide-pen-tool" class="w-12 h-12 text-white/60" />
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <!-- Reading time badge -->
                <div class="absolute top-3 right-3" v-if="getReadTime(post)">
                  <UBadge variant="solid" color="neutral" class="backdrop-blur-sm bg-black/30 text-white border-0">
                    <UIcon name="i-lucide-clock" class="w-3 h-3 mr-1" />
                    {{ getReadTime(post) }}
                  </UBadge>
                </div>
              </div>
              
              <div class="p-5">
                <div class="text-sm text-muted mb-2 flex items-center gap-2">
                  <span class="inline-flex items-center"><UIcon name="i-lucide-calendar" class="w-3 h-3 mr-1" />
                  {{ new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}</span>
                  <span v-if="getReadTime(post)" class="inline-flex items-center gap-1">
                    <span class="mx-1">•</span>
                    <UIcon name="i-lucide-clock" class="w-3 h-3" />
                    {{ getReadTime(post) }}
                  </span>
                </div>
                <h2 class="text-xl font-semibold mb-2 text-default group-hover:text-primary transition-colors">{{ post.title }}</h2>
                <p class="text-muted line-clamp-2 mb-4">
                  {{ post.description }}
                </p>
                <div class="flex flex-wrap gap-2" v-if="post.tags && post.tags.length">
                  <UBadge 
                    v-for="tag in post.tags.slice(0, 3)" 
                    :key="tag" 
                    :color="getTagColor(tag)" 
                    variant="soft" 
                    class="text-xs"
                  >
                    {{ tag }}
                  </UBadge>
                  <UBadge v-if="post.tags.length > 3" color="neutral" variant="soft" class="text-xs">
                    +{{ post.tags.length - 3 }}
                  </UBadge>
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
import { getTagColor } from '~/utils/colors';

// Ensure site config is set to dev
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'dev') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'dev'
  };
}

// Fetch dev blog posts directly with queryCollection
const { data: posts, pending: loading, error } = await useAsyncData(
  'dev-blog-posts',
  () => queryCollection('blog').where('category', '=', 'dev').where('published', '=', true).order('date', 'DESC').all()
);

// Image helper function
const getImageUrl = (image: any) => {
  return image?.url || image || '/placeholder-blog.jpg';
};

const { estimateReadTime, formatReadTime } = useReadTime();
const getReadTime = (post: any) => {
  if (!post) return '';
  const readTime = estimateReadTime(post);
  return formatReadTime(readTime.minutes);
};


// Meta tags
useHead({
  title: `Blog - ${siteConfig.value?.title || 'Developer Portfolio'}`,
  meta: [
    { name: 'description', content: 'Read articles about web development, programming tips, and technology insights from my developer blog.' }
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
