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
            <UButton to="/dev/blog" variant="ghost" color="primary" icon="i-heroicons-arrow-left" class="mb-4">Back to Blog</UButton>
            
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
              <UBadge v-for="tag in post.tags" :key="tag" color="primary" variant="soft">{{ tag }}</UBadge>
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
                  Developer and writer passionate about web technologies and creating user-friendly experiences.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Related posts -->
          <div class="mt-16">
            <h2 class="text-2xl font-bold mb-6">Related Articles</h2>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="i in 3" 
                :key="i" 
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <NuxtLink :to="`/dev/blog/related-post-${i}`">
                  <div class="relative aspect-video bg-gray-200 dark:bg-gray-700">
                    <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                      Related Post Image
                    </div>
                  </div>
                  <div class="p-4">
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {{ new Date(Date.now() - i * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                    </div>
                    <h3 class="text-lg font-bold mb-2">Related Development Article {{ i }}</h3>
                    <p class="text-gray-600 dark:text-gray-300 line-clamp-2">
                      This is a sample excerpt for a related development blog post.
                    </p>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
          
          <!-- Newsletter signup -->
          <div class="mt-16 p-8 bg-primary/5 dark:bg-primary-400/10 rounded-lg text-center">
            <h2 class="text-2xl font-bold mb-4">Stay Updated</h2>
            <p class="mb-6 max-w-2xl mx-auto">
              Subscribe to my newsletter to receive updates on new articles, tutorials, and resources.
            </p>
            <form @submit.prevent="subscribeToNewsletter" class="max-w-md mx-auto">
              <div class="flex flex-col sm:flex-row gap-4">
                <input 
                  v-model="newsletterEmail" 
                  type="email" 
                  placeholder="Your email address" 
                  class="flex-grow px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary dark:focus:ring-primary-400 focus:border-primary dark:focus:border-primary-400"
                  required
                >
                <UButton type="submit" color="primary">Subscribe</UButton>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Not found state -->
        <div v-else class="text-center py-16">
          <UIcon name="i-heroicons-document-magnifying-glass" class="w-14 h-14 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <h3 class="text-xl font-semibold mb-2">Post Not Found</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <UButton to="/dev/blog" color="primary">View All Articles</UButton>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Ensure site config is set to dev
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'dev') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'dev'
  };
}

// Route params
const route = useRoute();
const postId = route.params.id as string;

// State
const newsletterEmail = ref('');

// Fetch blog post using queryCollection directly
const { data: post, pending: loading, error } = await useAsyncData(
  `dev-blog-${postId}`,
  () => queryCollection('blog')
    .where('category', '=', 'dev')
    .where('slug', '=', postId)
    .first()
);


// Newsletter subscription
const subscribeToNewsletter = () => {
  // In a real app, this would send the email to a backend service
  alert(`Thank you for subscribing with ${newsletterEmail.value}!`);
  newsletterEmail.value = '';
};

const { estimateReadTime, formatReadTime } = useReadTime();
const readTimeLabel = computed(() => {
  if (!post.value) return '';
  const readTime = estimateReadTime(post.value);
  return formatReadTime(readTime.minutes);
});

// Meta tags
useHead(() => ({
  title: post.value ? `${post.value.title} - ${siteConfig.value?.title || 'Developer Portfolio'}` : 'Blog Post',
  meta: [
    { 
      name: 'description', 
      content: post.value?.description || 'Read this development article on web development, programming, and technology.'
    }
  ]
}));
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
