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
              <NuxtLink to="/gallery" class="btn btn-primary">
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
          <NuxtLink to="/gallery" class="btn btn-outline">
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
      <section class="py-12 md:py-16">
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-primary-dark dark:text-dark-primary">Client Testimonials</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">What my clients are saying</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            v-for="(work, index) in featuredWorksWithTestimonials" 
            :key="work.id" 
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          >
            <div class="flex items-start mb-4">
              <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-4">
                <img 
                  :src="work.attributes.image?.data?.attributes?.url || '/placeholder-client.jpg'" 
                  alt="Client" 
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 class="font-semibold text-lg">Client {{ index + 1 }}</h3>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ new Date(work.attributes.date).toLocaleDateString() }}</p>
              </div>
            </div>
            <p class="text-gray-600 dark:text-gray-300 italic">
              "{{ work.attributes.clientTestimonial }}"
            </p>
          </div>
        </div>
        
        <div v-if="featuredWorksWithTestimonials.length === 0" class="py-8 flex justify-center">
          <p class="text-gray-500 dark:text-gray-400">Testimonials will appear here when added.</p>
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
import { fetchTattooLandingContent } from '~/utils/api/content';
import type { TattooWork, Article } from '~/utils/api/content';

// Site Configuration
const config = useSiteConfig();
config.value = {
  ...config.value,
  title: "Allison's Tattoo Art",
  description: "Custom tattoo designs specializing in fine line, watercolor, and botanical styles.",
  type: 'tattoo'
};

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
  return featuredWorks.value.filter(work => work.attributes.clientTestimonial);
});

// Method to open tattoo details modal
function openTattooDetails(work: TattooWork) {
  selectedWork.value = work;
}

onMounted(async () => {
  try {
    const content = await fetchTattooLandingContent();
    featuredWorks.value = content.featuredWorks.data || [];
    recentPosts.value = content.recentPosts.data || [];
  } catch (error) {
    console.error('Error fetching landing page content:', error);
  }
});
</script> 