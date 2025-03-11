<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary-dark/10 to-primary-dark/20 dark:from-dark-primary/20 dark:to-dark-primary/30">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-center relative">
          <span class="inline-block relative z-10">Tattoo Gallery</span>
          <span class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-primary-dark dark:bg-dark-primary opacity-70 z-0"></span>
        </h1>
        
        <p class="text-lg mb-12 text-center max-w-2xl mx-auto">
          Browse my tattoo portfolio featuring fine line work, watercolor, and custom designs.
          Each piece tells a unique story and represents my commitment to artistic excellence.
        </p>

        <!-- Filter tabs -->
        <div class="flex flex-wrap justify-center mb-12">
          <button 
            v-for="style in tattooStyles" 
            :key="style.id" 
            class="px-4 py-2 m-1 rounded-full transition-colors"
            :class="activeStyle === style.id 
              ? 'bg-primary-dark text-white dark:bg-dark-primary dark:text-white' 
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'"
            @click="activeStyle = style.id"
          >
            {{ style.name }}
          </button>
        </div>
        
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark dark:border-dark-primary"></div>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg max-w-2xl mx-auto">
          <p>{{ error }}</p>
          <button @click="fetchTattoos" class="mt-4 text-primary-dark dark:text-dark-primary font-medium">
            Try Again
          </button>
        </div>
        
        <!-- Gallery grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="tattoo in filteredTattoos" 
            :key="tattoo.id" 
            class="tattoo-card overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
            @click="openTattooModal(tattoo)"
          >
            <div class="relative aspect-square bg-gray-200 dark:bg-gray-700">
              <img 
                v-if="tattoo.images && tattoo.images.length > 0" 
                :src="tattoo.images[0].url" 
                :alt="tattoo.title"
                class="w-full h-full object-cover"
              >
              <div 
                v-else 
                class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500"
              >
                Tattoo {{ tattoo.id }}
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-bold mb-1">{{ tattoo.title }}</h3>
              <div class="flex gap-2 mb-2">
                <span 
                  class="px-2 py-1 text-xs rounded-full bg-primary-dark/10 dark:bg-dark-primary/20 text-primary-dark dark:text-dark-primary"
                >
                  {{ tattoo.style }}
                </span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 line-clamp-2">
                {{ tattoo.description }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Empty state -->
        <div v-if="!loading && !error && filteredTattoos.length === 0" class="text-center py-16">
          <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold mb-2">No tattoos found</h3>
          <p class="text-gray-500 dark:text-gray-400">Try changing your filter or check back later.</p>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-12">
          <div class="flex space-x-2">
            <button 
              @click="currentPage > 1 && (currentPage--)" 
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              v-for="page in totalPages" 
              :key="page" 
              @click="currentPage = page"
              :class="[
                'px-4 py-2 rounded-full shadow',
                currentPage === page ? 
                  'bg-primary-dark dark:bg-dark-primary text-white' : 
                  'bg-white dark:bg-gray-800'
              ]"
            >
              {{ page }}
            </button>
            <button 
              @click="currentPage < totalPages && (currentPage++)" 
              :disabled="currentPage === totalPages"
              class="px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        
        <!-- Tattoo modal -->
        <div 
          v-if="selectedTattoo" 
          class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          @click="selectedTattoo = null"
        >
          <div 
            class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <h2 class="text-2xl font-bold">{{ selectedTattoo.title }}</h2>
                <button 
                  @click="selectedTattoo = null"
                  class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Tattoo image -->
              <div class="relative aspect-square sm:aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-6">
                <img 
                  v-if="selectedTattoo.images && selectedTattoo.images.length > 0" 
                  :src="selectedTattoo.images[0].url" 
                  :alt="selectedTattoo.title"
                  class="w-full h-full object-contain rounded-lg"
                >
                <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  Tattoo {{ selectedTattoo.id }} (Full Size)
                </div>
              </div>
              
              <!-- Tattoo details -->
              <div class="mb-4">
                <div class="flex flex-wrap gap-2 mb-4">
                  <span class="px-3 py-1 text-sm rounded-full bg-primary-dark/10 dark:bg-dark-primary/20 text-primary-dark dark:text-dark-primary">
                    {{ selectedTattoo.style }}
                  </span>
                  <span class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    {{ selectedTattoo.year }}
                  </span>
                </div>
                <p class="text-gray-700 dark:text-gray-300 mb-6">
                  {{ selectedTattoo.description }}
                </p>
                
                <!-- Additional information -->
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 class="text-lg font-bold mb-2">Details</h3>
                    <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                      <li><span class="font-medium">Style:</span> {{ selectedTattoo.style }}</li>
                      <li><span class="font-medium">Placement:</span> {{ selectedTattoo.placement }}</li>
                      <li><span class="font-medium">Size:</span> {{ selectedTattoo.size }}</li>
                      <li><span class="font-medium">Session Time:</span> {{ selectedTattoo.sessionTime }}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 class="text-lg font-bold mb-2">The Story</h3>
                    <p class="text-gray-600 dark:text-gray-300">
                      {{ selectedTattoo.story }}
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- More images if available -->
              <div v-if="selectedTattoo.images && selectedTattoo.images.length > 1" class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-bold mb-4">More Images</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div 
                    v-for="(image, index) in selectedTattoo.images.slice(1)" 
                    :key="index" 
                    class="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                  >
                    <img 
                      :src="image.url" 
                      :alt="`${selectedTattoo.title} - View ${index + 2}`"
                      class="w-full h-full object-cover rounded-lg"
                    >
                  </div>
                </div>
              </div>
              
              <!-- Contact CTA -->
              <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                <h3 class="text-lg font-bold mb-2">Interested in a similar tattoo?</h3>
                <p class="mb-4 text-gray-600 dark:text-gray-300">
                  Let's discuss your ideas and create something unique for you.
                </p>
                <NuxtLink to="/tattoo/contact" class="inline-block px-6 py-3 bg-primary-dark dark:bg-dark-primary text-white rounded-full shadow-lg transform transition-transform hover:scale-105">
                  Book a Consultation
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';
import { getTattooWorks } from '~/utils/api/content';

// Ensure site config is set to tattoo
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'tattoo') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'tattoo',
    baseRoute: '/tattoo'
  };
}

// State
const tattoos = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedTattoo = ref(null);
const activeStyle = ref('all');
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 9;

// Tattoo styles
const tattooStyles = [
  { id: 'all', name: 'All Styles' },
  { id: 'blackwork', name: 'Blackwork' },
  { id: 'neotraditional', name: 'Neo-Traditional' },
  { id: 'illustrative', name: 'Illustrative' },
  { id: 'fineline', name: 'Fine Line' },
  { id: 'watercolor', name: 'Watercolor' },
];

// Computed
const filteredTattoos = computed(() => {
  if (activeStyle.value === 'all') return tattoos.value;
  return tattoos.value.filter(tattoo => 
    tattoo.style.toLowerCase() === activeStyle.value.toLowerCase()
  );
});

// Methods
const openTattooModal = (tattoo) => {
  selectedTattoo.value = tattoo;
  // Prevent scrolling when modal is open
  document.body.style.overflow = 'hidden';
};

// Close modal and restore scrolling
watch(selectedTattoo, (newValue) => {
  if (!newValue) {
    document.body.style.overflow = '';
  }
});

const fetchTattoos = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // In a real implementation, this would fetch from Strapi
    const response = await getTattooWorks(currentPage.value, pageSize);
    
    if (response) {
      tattoos.value = response.data || [];
      totalPages.value = Math.ceil((response.meta?.pagination?.total || 0) / pageSize);
      
      // For demo purposes, if there's no data from Strapi, use placeholder data
      if (tattoos.value.length === 0) {
        tattoos.value = [
          {
            id: 1,
            title: 'Floral Sleeve',
            description: 'Full sleeve featuring botanical elements with delicate line work and subtle shading.',
            style: 'blackwork',
            placement: 'Full arm sleeve',
            size: 'Large (full sleeve)',
            sessionTime: '12 hours (multiple sessions)',
            year: 2023,
            story: 'This client wanted to celebrate their love for nature with a botanical sleeve. We incorporated meaningful plants and flowers that represented different aspects of their life journey.'
          },
          {
            id: 2,
            title: 'Wolf and Moon',
            description: 'Neo-traditional wolf howling at the moon with vibrant colors and bold lines.',
            style: 'neotraditional',
            placement: 'Upper back',
            size: 'Medium (8×10 inches)',
            sessionTime: '6 hours (single session)',
            year: 2023,
            story: 'Inspired by the client\'s connection to wolves and their spiritual journey, this piece symbolizes inner strength and the cycles of life.'
          },
          {
            id: 3,
            title: 'Abstract Watercolor Birds',
            description: 'Flock of birds in watercolor style with splashes of vibrant colors.',
            style: 'watercolor',
            placement: 'Ribcage',
            size: 'Medium (6×8 inches)',
            sessionTime: '4 hours (single session)',
            year: 2022,
            story: 'The client wanted a representation of freedom and transformation. The birds breaking away from their flock symbolize their personal journey toward independence.'
          },
          {
            id: 4,
            title: 'Geometric Mountain Range',
            description: 'Precise geometric interpretation of a mountain landscape with dotwork shading.',
            style: 'blackwork',
            placement: 'Forearm',
            size: 'Medium (7×5 inches)',
            sessionTime: '5 hours (single session)',
            year: 2022,
            story: 'This design represents the client\'s love for hiking and the specific mountain range where they had a life-changing experience.'
          },
          {
            id: 5,
            title: 'Botanical Fine Line',
            description: 'Delicate fine line work featuring herbs and botanical elements.',
            style: 'fineline',
            placement: 'Inner forearm',
            size: 'Small (4×6 inches)',
            sessionTime: '3 hours (single session)',
            year: 2023,
            story: 'For a client who is a herbalist, these plants represent healing and the ancient knowledge they work to preserve.'
          },
          {
            id: 6,
            title: 'Illustrative Fox',
            description: 'Storytelling piece with a fox as the main character in a whimsical forest scene.',
            style: 'illustrative',
            placement: 'Thigh',
            size: 'Large (10×12 inches)',
            sessionTime: '8 hours (single session)',
            year: 2022,
            story: 'Based on a childhood story that was meaningful to the client, this piece captures the essence of wonder and curiosity.'
          }
        ];
        
        totalPages.value = 1; // For demo purposes
      }
    }
  } catch (err) {
    console.error('Error fetching tattoo works:', err);
    error.value = 'Failed to load tattoo works. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(currentPage, () => {
  fetchTattoos();
  // Scroll to top when changing pages
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

watch(activeStyle, () => {
  currentPage.value = 1;
});

// Lifecycle
onMounted(() => {
  fetchTattoos();
});

// Meta tags
useHead({
  title: `Tattoo Gallery - ${siteConfig.value?.title || 'Tattoo Portfolio'}`,
  meta: [
    { name: 'description', content: 'Browse my portfolio of fine line, watercolor, and custom tattoo designs. Each piece showcases my artistic style and technical expertise.' }
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tattoo-card {
  transition: transform 0.2s ease-in-out;
}

.tattoo-card:hover {
  transform: translateY(-5px);
}
</style> 