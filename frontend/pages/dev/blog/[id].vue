<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary/5 to-primary-50 dark:from-primary-400/10 dark:to-primary-400/20">
      <div class="container-custom">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-400"></div>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg max-w-2xl mx-auto">
          <p>{{ error }}</p>
          <NuxtLink to="/dev/blog" class="mt-4 text-primary dark:text-primary-400 font-medium inline-block">
            Back to Blog
          </NuxtLink>
        </div>
        
        <!-- Blog post content -->
        <div v-else-if="post" class="max-w-3xl mx-auto">
          <div class="mb-8">
            <NuxtLink to="/dev/blog" class="inline-flex items-center text-primary dark:text-primary-400 hover:underline mb-4">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Blog
            </NuxtLink>
            
            <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ post.title }}</h1>
            
            <div class="flex items-center mb-6">
              <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center text-gray-500 text-xs">
                A
              </div>
              
              <div>
                <div class="font-medium">{{ post.author || 'Anonymous' }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                </div>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-2 mb-8">
              <span 
                v-for="tag in post.tags" 
                :key="tag" 
                class="px-3 py-1 text-sm rounded-full bg-primary-50 dark:bg-primary-400/20 text-primary dark:text-primary-400"
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
            <div v-else>
              <p>{{ post?.description }}</p>
              <!-- Placeholder content for demo -->
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, 
                nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.
              </p>
            </div>
          </div>
          
          <!-- Author bio -->
          <div v-if="post.author" class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-12">
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
                <button 
                  type="submit" 
                  class="px-6 py-2 bg-primary dark:bg-primary-400 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-400-700 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Not found state -->
        <div v-else class="text-center py-16">
          <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold mb-2">Post Not Found</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <NuxtLink to="/dev/blog" class="inline-block px-6 py-3 bg-primary dark:bg-primary-400 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-400-700 transition-colors">
            View All Articles
          </NuxtLink>
        </div>
      </div>
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