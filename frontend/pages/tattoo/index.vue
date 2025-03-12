<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="container-custom py-12">
      <!-- Hero Section -->
      <section class="py-16 md:py-24">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h1 class="text-4xl md:text-5xl font-bold mb-6 text-primary-dark dark:text-dark-primary">
              Allison's Tattoo Art
            </h1>
            <p class="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300">
              Specializing in custom designs that blend fine art with self-expression, creating a unique tattoo experience for every client.
            </p>
            <div class="flex flex-wrap gap-4">
              <NuxtLink to="/tattoo/gallery" class="btn btn-primary">
                View Gallery
              </NuxtLink>
              <NuxtLink to="/contact" class="btn btn-outline">
                Book a Session
              </NuxtLink>
            </div>
          </div>
          <div class="md:w-1/2 rounded-xl overflow-hidden shadow-lg">
            <div class="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <img src="/placeholder-tattoo.jpg" alt="Tattoo Artist Hero Image" class="object-cover w-full h-full" />
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Works Section -->
      <section class="py-12 md:py-16">
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-primary-dark dark:text-dark-primary">Featured Works</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">A sample of my recent tattoo designs</p>
        </div>

        <div v-if="featuredWorks.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="work in featuredWorks" 
            :key="work.id" 
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
          >
            <div class="aspect-square bg-gray-100 dark:bg-gray-700">
              <img 
                :src="work.attributes.image?.data?.attributes?.url || '/placeholder-tattoo-work.jpg'" 
                :alt="work.attributes.title" 
                class="object-cover w-full h-full"
              />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-primary-dark dark:text-dark-primary">
                {{ work.attributes.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                {{ work.attributes.description }}
              </p>
              <div class="flex items-center mb-4">
                <span class="text-sm text-gray-500 dark:text-gray-400">Style: </span>
                <span class="ml-2 px-2 py-1 bg-primary-dark/10 dark:bg-dark-primary/20 text-primary-dark dark:text-dark-primary text-xs rounded-full">
                  {{ work.attributes.style?.data?.attributes?.name || 'Custom' }}
                </span>
              </div>
              <button @click="openTattooDetails(work)" class="btn btn-primary btn-sm w-full">
                View Details
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="py-8 flex justify-center">
          <p class="text-gray-500 dark:text-gray-400">Featured works will appear here when added.</p>
        </div>

        <div class="mt-8 text-center">
          <NuxtLink to="/tattoo/gallery" class="btn btn-outline">
            View Full Gallery
          </NuxtLink>
        </div>
      </section>

      <!-- Tattoo Styles Section -->
      <section class="py-12 md:py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div class="container mx-auto px-4">
          <div class="mb-12 text-center">
            <h2 class="text-3xl font-bold text-primary-dark dark:text-dark-primary">Tattoo Styles</h2>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Artistic approaches I specialize in</p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary-dark/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary-dark dark:text-dark-primary">🖌️</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">Fine Line</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">Delicate, precise lines for intricate, detailed designs</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary-dark/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary-dark dark:text-dark-primary">🎨</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">Watercolor</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">Vibrant, fluid colors that mimic watercolor paintings</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary-dark/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary-dark dark:text-dark-primary">🌿</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">Botanical</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">Nature-inspired designs with detailed flora elements</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary-dark/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary-dark dark:text-dark-primary">✨</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">Minimalist</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">Simple, clean designs with powerful meaning</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary-dark/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary-dark dark:text-dark-primary">🖤</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">Blackwork</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">Bold black ink with strong contrasts and patterns</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary-dark/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary-dark dark:text-dark-primary">🧠</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">Custom</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">Unique designs tailored to your personal vision</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Client Testimonials -->
      <section v-if="testimonials.length > 0" class="py-16 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-purple-900/30">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-primary-dark dark:text-dark-primary">Client Testimonials</h2>
          <p class="mt-2 mb-8 text-gray-600 dark:text-gray-400">Hear what people are saying about their experiences.</p>
          
          <div class="grid md:grid-cols-3 gap-8">
            <div 
              v-for="(testimonial, index) in testimonials.slice(0, 3)" 
              :key="testimonial.id"
              class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div class="flex mb-4">
                <div class="text-amber-400 flex">
                  <svg v-for="i in 5" :key="i" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
              
              <blockquote class="text-gray-700 dark:text-gray-300 italic text-base mb-4">
                "{{ testimonial.text }}"
              </blockquote>
              
              <div class="font-semibold text-primary-dark dark:text-dark-primary">
                - {{ testimonial.client_name }}
              </div>
            </div>
          </div>
          
          <div class="mt-8 text-center">
            <NuxtLink to="/tattoo/testimonials" class="inline-block px-6 py-3 bg-primary-dark dark:bg-dark-primary text-white rounded-lg hover:bg-opacity-90 transition-colors">
              View All Testimonials
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Blog Posts Preview -->
      <section class="py-12 md:py-16">
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-primary-dark dark:text-dark-primary">Tattoo Articles</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Insights and stories from my tattoo journey</p>
        </div>

        <div v-if="recentPosts.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="post in recentPosts" 
            :key="post.id" 
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
          >
            <div class="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700">
              <img 
                :src="post.attributes.coverImage?.data?.attributes?.url || '/placeholder-blog.jpg'" 
                :alt="post.attributes.title" 
                class="object-cover w-full h-full"
              />
            </div>
            <div class="p-6">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {{ new Date(post.attributes.publishedAt).toLocaleDateString() }}
              </div>
              <h3 class="text-xl font-bold mb-2 text-primary-dark dark:text-dark-primary">
                {{ post.attributes.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                {{ post.attributes.summary }}
              </p>
              <NuxtLink :to="`/tattoo/blog/${post.attributes.slug}`" class="btn btn-primary btn-sm w-full">
                Read More
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <div v-else class="py-8 flex justify-center">
          <p class="text-gray-500 dark:text-gray-400">Blog posts will appear here when published.</p>
        </div>

        <div class="mt-8 text-center">
          <NuxtLink to="/tattoo/blog" class="btn btn-outline">
            View All Articles
          </NuxtLink>
        </div>
      </section>

      <!-- Booking CTA -->
      <section class="py-12 md:py-16 bg-primary-dark/10 dark:bg-dark-primary/10 rounded-xl text-center">
        <h2 class="text-3xl font-bold text-primary-dark dark:text-dark-primary mb-4">Ready for Your New Tattoo?</h2>
        <p class="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Let's create something beautiful together. Contact me to discuss your ideas and schedule a consultation.
        </p>
        <NuxtLink to="/contact" class="btn btn-primary">
          Book a Consultation
        </NuxtLink>
      </section>
    </div>

    <!-- Tattoo Work Modal -->
    <div 
      v-if="selectedWork" 
      class="fixed inset-0 bg-black/70 dark:bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
      @click="selectedWork = null"
    >
      <div 
        class="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="relative">
          <img 
            :src="selectedWork.attributes.image?.data?.attributes?.url || '/placeholder-tattoo-full.jpg'" 
            :alt="selectedWork.attributes.title" 
            class="w-full aspect-square object-cover"
          />
          <button 
            @click="selectedWork = null" 
            class="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center"
          >
            &times;
          </button>
        </div>
        <div class="p-6">
          <h3 class="text-2xl font-bold mb-2 text-primary-dark dark:text-dark-primary">
            {{ selectedWork.attributes.title }}
          </h3>
          <div class="flex items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{{ new Date(selectedWork.attributes.date).toLocaleDateString() }}</span>
            <span class="mx-2">•</span>
            <span>Style: {{ selectedWork.attributes.style?.data?.attributes?.name || 'Custom' }}</span>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            {{ selectedWork.attributes.description }}
          </p>
          
          <div v-if="selectedWork.attributes.clientTestimonial" class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h4 class="font-medium mb-2">Client Testimonial</h4>
            <p class="text-gray-600 dark:text-gray-300 italic">
              "{{ selectedWork.attributes.clientTestimonial }}"
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';
import { fetchTattooLandingContent } from '~/utils/api/content';
import { usePortfolioContent } from '~/composables/usePortfolioContent';
import type { TattooWork, Article } from '~/utils/api/content';

// Set site config to tattoo
const siteConfig = useSiteConfig();
siteConfig.value = {
  ...siteConfig.value,
  type: 'tattoo',
  baseRoute: '/tattoo'
};

// Portfolio content API
const portfolioApi = usePortfolioContent();

// Page meta
useHead({
  title: "Allison's Tattoo Art",
  meta: [
    { name: 'description', content: 'Custom tattoo designs specializing in fine line, watercolor, and botanical styles.' }
  ]
});

// Fetch content from Directus
const featuredWorks = ref<TattooWork[]>([]);
const recentPosts = ref<Article[]>([]);
const testimonials = ref<any[]>([]);
const selectedWork = ref<TattooWork | null>(null);

// Computed property for works with testimonials
const featuredWorksWithTestimonials = computed(() => {
  return testimonials.value.slice(0, 3);
});

// Method to open tattoo details modal
function openTattooDetails(work: TattooWork) {
  selectedWork.value = work;
}

onMounted(async () => {
  try {
    // Fetch main content
    const content = await fetchTattooLandingContent();
    featuredWorks.value = content.featuredWorks.data || [];
    recentPosts.value = content.recentPosts.data || [];
    
    // Fetch testimonials
    const testimonialResult = await portfolioApi.getTestimonials(3);
    testimonials.value = testimonialResult.data || [];
  } catch (error) {
    console.error('Error fetching landing page content:', error);
  }
});
</script> 