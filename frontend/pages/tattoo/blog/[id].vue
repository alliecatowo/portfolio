<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary-dark/10 to-primary-dark/20 dark:from-dark-primary/20 dark:to-dark-primary/30">
      <div class="container-custom">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark dark:border-dark-primary"></div>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg max-w-2xl mx-auto">
          <p>{{ error }}</p>
          <NuxtLink to="/tattoo/blog" class="mt-4 text-primary-dark dark:text-dark-primary font-medium inline-block">
            Back to Blog
          </NuxtLink>
        </div>
        
        <!-- Blog post content -->
        <div v-else-if="post" class="max-w-3xl mx-auto">
          <div class="mb-8">
            <NuxtLink to="/tattoo/blog" class="inline-flex items-center text-primary-dark dark:text-dark-primary hover:underline mb-4">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Blog
            </NuxtLink>
            
            <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ post.title }}</h1>
            
            <div class="flex items-center mb-6">
              <div v-if="post.author?.avatar" class="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img :src="post.author.avatar.url" :alt="post.author.name" class="w-full h-full object-cover">
              </div>
              <div v-else class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
              
              <div>
                <div class="font-medium">{{ post.author?.name || 'Anonymous' }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                </div>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-2 mb-8">
              <span 
                v-for="category in post.categories" 
                :key="category.id" 
                class="px-3 py-1 text-sm rounded-full bg-primary-dark/10 dark:bg-dark-primary/20 text-primary-dark dark:text-dark-primary"
              >
                {{ category.name }}
              </span>
            </div>
          </div>
          
          <!-- Featured image -->
          <div v-if="post.image" class="mb-8 rounded-lg overflow-hidden">
            <img :src="post.image.url" :alt="post.title" class="w-full h-auto">
          </div>
          
          <!-- Post content -->
          <div class="prose dark:prose-invert max-w-none mb-12">
            <!-- In a real app, this would be rendered HTML from the CMS -->
            <p>{{ post.content || post.excerpt }}</p>
            
            <!-- Placeholder paragraphs for demo -->
            <p v-if="!post.content">
              As a tattoo artist, I've had the privilege of creating permanent art on countless individuals, 
              each with their own unique story and vision. This particular piece was especially meaningful 
              because it represented a significant transformation in the client's life.
            </p>
            <p v-if="!post.content">
              The design process began with several consultations where we discussed the symbolism important 
              to them. We explored various artistic styles before settling on this approach that blended 
              traditional elements with contemporary techniques.
            </p>
            <h2 v-if="!post.content">The Tattoo Process</h2>
            <p v-if="!post.content">
              The session itself took approximately five hours. We started with outlining the main elements, 
              then moved to shading and finally added the color work that brings the piece to life. Throughout 
              the process, we took breaks to ensure comfort and optimal results.
            </p>
            <p v-if="!post.content">
              What made this piece particularly special was how it evolved during our session. While we had 
              a solid design to begin with, allowing for some organic development during the tattooing process 
              resulted in a more dynamic and personalized piece.
            </p>
            <h2 v-if="!post.content">Aftercare and Healing</h2>
            <p v-if="!post.content">
              After completing the tattoo, I provided detailed aftercare instructions. The healing process is 
              just as important as the application, and proper care ensures the longevity and vibrancy of the art.
            </p>
            <p v-if="!post.content">
              Two weeks later, the client returned for a follow-up appointment. The tattoo had healed beautifully, 
              and seeing their reaction to the fully healed piece was incredibly rewarding.
            </p>
          </div>
          
          <!-- Author bio -->
          <div v-if="post.author" class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-12">
            <div class="flex items-start">
              <div v-if="post.author.avatar" class="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                <img :src="post.author.avatar.url" :alt="post.author.name" class="w-full h-full object-cover">
              </div>
              <div v-else class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 mr-4 flex-shrink-0"></div>
              
              <div>
                <h3 class="text-xl font-bold mb-2">About {{ post.author.name }}</h3>
                <p class="text-gray-600 dark:text-gray-300">
                  {{ post.author.bio || 'Tattoo artist specializing in fine line work, watercolor, and custom designs. Passionate about creating meaningful art that tells personal stories.' }}
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
          <div class="mt-16 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center relative overflow-hidden">
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 h-32 w-32 bg-primary-dark/10 dark:bg-dark-primary/10 rounded-bl-full"></div>
            <div class="absolute bottom-0 left-0 h-24 w-24 bg-primary-dark/10 dark:bg-dark-primary/10 rounded-tr-full"></div>
            
            <div class="relative z-10">
              <h2 class="text-2xl font-bold mb-4">Interested in Your Own Custom Tattoo?</h2>
              <p class="mb-6 max-w-2xl mx-auto">
                If you're inspired by this story and would like to discuss your own tattoo idea, I'd love to hear from you.
                Let's create something meaningful together.
              </p>
              <NuxtLink to="/tattoo/contact" class="inline-block px-6 py-3 bg-primary-dark dark:bg-dark-primary text-white rounded-full shadow-lg transform transition-transform hover:scale-105">
                Book a Consultation
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <!-- Not found state -->
        <div v-else class="text-center py-16">
          <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold mb-2">Post Not Found</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <NuxtLink to="/tattoo/blog" class="inline-block px-6 py-3 bg-primary-dark dark:bg-dark-primary text-white rounded-full shadow-lg">
            View All Stories
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';
import { getPostBySlug } from '~/utils/api/content';

// Ensure site config is set to tattoo
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'tattoo') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'tattoo',
    baseRoute: '/tattoo'
  };
}

// Route params
const route = useRoute();
const postId = route.params.id as string;

// State
const post = ref(null);
const loading = ref(true);
const error = ref(null);

// Methods
const fetchPost = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // In a real implementation, this would fetch from Strapi
    const response = await getPostBySlug(postId);
    
    if (response) {
      post.value = response;
      
      // For demo purposes, if there's no data from Strapi, use placeholder data
      if (!post.value) {
        // This is just for demo purposes - in a real app, we'd show a 404
        post.value = {
          id: 1,
          title: 'The Story Behind This Custom Watercolor Tattoo',
          slug: postId,
          excerpt: 'This is a sample excerpt for a tattoo blog post. In a real application, this would be fetched from the CMS.',
          publishedAt: new Date().toISOString(),
          categories: [
            { id: 1, name: 'Tattoo Process' },
            { id: 2, name: 'Client Stories' }
          ],
          author: {
            name: 'Allison Ink',
            bio: 'Tattoo artist specializing in watercolor and fine line work. Creating custom designs that tell personal stories through art.',
            avatar: null
          }
        };
      }
    }
  } catch (err) {
    console.error('Error fetching post:', err);
    error.value = 'Failed to load article. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchPost();
});

// Watch for route changes to fetch new post data
watch(() => route.params.id, (newId) => {
  if (newId && newId !== postId) {
    fetchPost();
  }
});

// Meta tags
useHead(() => ({
  title: post.value ? `${post.value.title} - ${siteConfig.value?.title || 'Tattoo Portfolio'}` : 'Blog Post',
  meta: [
    { 
      name: 'description', 
      content: post.value?.excerpt || 'Read this tattoo story about the creative process, client experience, and the meaning behind the art.'
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