<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary-dark/10 to-primary-dark/20 dark:from-dark-primary/20 dark:to-dark-primary/30">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-center relative">
          <span class="inline-block relative z-10">Client Testimonials</span>
          <span class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-primary-dark dark:bg-dark-primary opacity-70 z-0"></span>
        </h1>
        
        <div class="max-w-4xl mx-auto">
          <!-- Introduction -->
          <div class="mb-12 prose dark:prose-invert max-w-none text-center">
            <p class="text-lg">
              Don't just take my word for it – here's what clients have to say about their experiences 
              and the tattoos we've created together. Each tattoo tells a story, and I'm grateful to be 
              part of these personal journeys.
            </p>
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark dark:border-dark-primary"></div>
          </div>
          
          <!-- Error state -->
          <div v-else-if="error" class="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-12">
            <p>{{ error }}</p>
            <button 
              @click="fetchTestimonials" 
              class="mt-2 bg-red-800 text-white dark:bg-red-700 px-4 py-2 rounded-md text-sm hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>

          <!-- No testimonials -->
          <div v-else-if="testimonials.length === 0" class="text-center py-16">
            <p class="text-lg text-gray-600 dark:text-gray-400">No testimonials available at the moment. Check back soon!</p>
          </div>
          
          <!-- Testimonials content -->
          <template v-else>
            <!-- Featured testimonial (first one) -->
            <div v-if="testimonials.length > 0" class="mb-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl relative overflow-hidden">
              <!-- Decorative elements -->
              <div class="absolute top-0 right-0 h-32 w-32 bg-primary-dark/10 dark:bg-dark-primary/10 rounded-bl-full"></div>
              <div class="absolute bottom-0 left-0 h-24 w-24 bg-primary-dark/10 dark:bg-dark-primary/10 rounded-tr-full"></div>
              
              <div class="flex flex-col items-center text-center mb-6 relative z-10">
                <div class="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
                  <img 
                    v-if="testimonials[0].image" 
                    :src="getImageUrl(testimonials[0].image)" 
                    :alt="`${testimonials[0].title} photo`"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Photo
                  </div>
                </div>
                <div class="text-center mb-6">
                  <h3 class="text-xl font-semibold mb-1">{{ testimonials[0].title }}</h3>
                  <div class="text-gray-600 dark:text-gray-400">{{ testimonials[0].category }}</div>
                </div>
                
                <div class="text-center mb-8">
                  <div class="flex justify-center text-yellow-400 mb-2">
                    <span v-for="i in 5" :key="i" class="mx-0.5">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </span>
                  </div>
                </div>
                
                <blockquote class="text-lg italic text-center mb-6">
                  "{{ testimonials[0].description }}"
                </blockquote>
                
                <div class="flex justify-center mb-8">
                  <div class="w-40 h-40 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img 
                      v-if="testimonials[0].image" 
                      :src="getImageUrl(testimonials[0].image)" 
                      :alt="`${testimonials[0].title}'s tattoo`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Testimonial grid (remaining testimonials) -->
            <div v-if="testimonials.length > 1" class="grid md:grid-cols-2 gap-8">
              <div 
                v-for="(testimonial, index) in testimonials.slice(1)" 
                :key="testimonial.id" 
                class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
              >
                <div class="flex items-center mb-3">
                  <div class="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full mr-4 overflow-hidden">
                    <img 
                      v-if="testimonial.image" 
                      :src="getImageUrl(testimonial.image)" 
                      :alt="`${testimonial.title} photo`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 class="font-semibold">{{ testimonial.title }}</h3>
                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ testimonial.category }}</div>
                    <div class="flex text-yellow-400 text-sm mt-1">
                      <span v-for="i in 5" :key="i" class="mr-0.5">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
                
                <blockquote class="text-gray-600 dark:text-gray-300 italic text-sm mb-3">
                  "{{ testimonial.description }}"
                </blockquote>
                
                <div class="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img 
                    v-if="testimonial.image" 
                    :src="getImageUrl(testimonial.image)" 
                    :alt="`${testimonial.title}'s tattoo`"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </template>
          
          <!-- CTA -->
          <div class="mt-16 text-center">
            <h2 class="text-2xl font-bold mb-4">Ready to Create Your Own Story?</h2>
            <p class="mb-6 max-w-2xl mx-auto">
              I'd love to work with you on your next tattoo. Whether you have a specific design in mind 
              or need help bringing your ideas to life, let's start the conversation.
            </p>
            <NuxtLink to="/tattoo/contact" class="inline-block px-6 py-3 bg-primary-dark dark:bg-dark-primary text-white rounded-full shadow-lg transform transition-transform hover:scale-105">
              Book a Consultation
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';
import { useDirectus } from '~/composables/useDirectus';
import { fetchAllGalleryItems } from '~/utils/api/directus';

// Ensure site config is set to tattoo
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'tattoo') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'tattoo',
    baseRoute: '/tattoo'
  };
}

// Use Directus composable
const { getImageUrl } = useDirectus();

// State
const testimonials = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch testimonials
const fetchTestimonials = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const result = await fetchAllGalleryItems({
      filter: {
        category: {
          _eq: 'testimonial'
        }
      },
      sort: ['sort']
    });
    
    console.log('Testimonials from Directus:', result);
    
    testimonials.value = result || [];
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    error.value = 'Failed to load testimonials. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchTestimonials();
});

// Meta tags
useHead({
  title: `Testimonials - ${siteConfig.value?.title || 'Tattoo Portfolio'}`,
  meta: [
    { name: 'description', content: 'Read what clients have to say about their tattoo experiences and the quality of my work.' }
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
</style> 