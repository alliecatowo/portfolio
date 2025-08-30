<template>
  <div>
    <section class="py-12 md:py-20">
      <UContainer>
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <USkeleton class="h-12 w-12 rounded-full" />
        </div>
        
        <!-- Error state -->
        <UAlert v-else-if="error" color="error" variant="subtle" title="Failed to load post" class="max-w-xl mx-auto" />
        
        <!-- Blog post content -->
        <div v-else-if="post" class="max-w-3xl mx-auto">
          <div class="mb-8">
            <UButton to="/tattoo/blog" variant="ghost" color="primary" icon="i-heroicons-arrow-left" class="mb-4">Back to Blog</UButton>
            
            <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ post.title }}</h1>
            
            <div class="flex items-center mb-6">
              <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center text-gray-500 text-xs">
                A
              </div>
              
              <div>
                <div class="font-medium">{{ post.author || 'Anonymous' }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  {{ new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                  <span class="inline-flex items-center gap-1">
                    <span class="mx-1">•</span>
                    <UIcon name="i-lucide-clock" class="w-3 h-3" />
                    {{ readTimeLabel }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-2 mb-8">
              <span 
                v-for="tag in post.tags" 
                :key="tag" 
                class="px-3 py-1 text-sm rounded-full bg-primary-700/10 dark:bg-primary-400/20 text-primary-700 dark:text-primary-400"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          
          <!-- Featured image -->
          <div v-if="post.featured_image" class="mb-8 rounded-lg overflow-hidden">
            <img :src="post.featured_image" :alt="post.title" class="w-full h-auto">
          </div>
          
          <!-- Post content -->
          <div class="prose dark:prose-invert max-w-none mb-12">
          <ContentRenderer v-if="post" :value="post" />
          <div v-else></div>
          </div>
          
          <!-- Author bio -->
          <div v-if="post.author" class="bg-white dark:bg-gray-900/60 rounded-lg p-6 shadow-md mb-12 border border-gray-200/60 dark:border-gray-800/60">
            <div class="flex items-start">
              <div class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 mr-4 flex-shrink-0 flex items-center justify-center text-gray-500">
                Author
              </div>
              
              <div>
                <h3 class="text-xl font-bold mb-2">About {{ post.author }}</h3>
                <p class="text-gray-600 dark:text-gray-300">
                  Tattoo artist specializing in fine line work, watercolor, and custom designs. Passionate about creating meaningful art that tells personal stories.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Related posts -->
          <div class="mt-16">
            <h2 class="text-2xl font-bold mb-6">Related Stories</h2>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="i in 3" 
                :key="i" 
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <NuxtLink :to="`/tattoo/blog/related-post-${i}`">
                  <div class="relative aspect-video bg-gray-200 dark:bg-gray-700">
                    <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                      Related Post Image
                    </div>
                  </div>
                  <div class="p-4">
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {{ new Date(Date.now() - i * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                    </div>
                    <h3 class="text-lg font-bold mb-2">Related Tattoo Story {{ i }}</h3>
                    <p class="text-gray-600 dark:text-gray-300 line-clamp-2">
                      This is a sample excerpt for a related tattoo blog post.
                    </p>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
          
          <!-- CTA -->
          <div class="mt-16 p-8 bg-white dark:bg-gray-900/60 rounded-lg shadow-xl text-center relative overflow-hidden border border-gray-200/60 dark:border-gray-800/60">
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 h-32 w-32 bg-primary-700/10 dark:bg-primary-400/10 rounded-bl-full"></div>
            <div class="absolute bottom-0 left-0 h-24 w-24 bg-primary-700/10 dark:bg-primary-400/10 rounded-tr-full"></div>
            
            <div class="relative z-10">
              <h2 class="text-2xl font-bold mb-4">Interested in Your Own Custom Tattoo?</h2>
              <p class="mb-6 max-w-2xl mx-auto">
                If you're inspired by this story and would like to discuss your own tattoo idea, I'd love to hear from you.
                Let's create something meaningful together.
              </p>
              <UButton to="/tattoo/contact" color="primary" size="lg" class="rounded-full">Book a Consultation</UButton>
            </div>
          </div>
        </div>
        
        <!-- Not found state -->
        <div v-else class="text-center py-16">
          <UIcon name="i-heroicons-document-magnifying-glass" class="w-14 h-14 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <h3 class="text-xl font-semibold mb-2">Post Not Found</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <UButton to="/tattoo/blog" color="primary">View All Stories</UButton>
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

// Route params
const route = useRoute();
const postId = route.params.id as string;

// Fetch blog post using queryCollection directly
const { data: post, pending: loading, error } = await useAsyncData(
  `tattoo-blog-${postId}`,
  () => queryCollection('blog')
    .where('category', '=', 'tattoo')
    .where('slug', '=', postId)
    .first()
);

// Meta tags
useHead(() => ({
  title: post.value ? `${post.value.title} - ${siteConfig.value?.title || 'Tattoo Portfolio'}` : 'Blog Post',
  meta: [
    { 
      name: 'description', 
      content: post.value?.description || 'Read this tattoo story about the creative process, client experience, and the meaning behind the art.'
    }
  ]
}));

const { estimateReadTime, formatReadTime } = useReadTime();
const readTimeLabel = computed(() => {
  if (!post.value) return '';
  const readTime = estimateReadTime(post.value);
  return formatReadTime(readTime.minutes);
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
