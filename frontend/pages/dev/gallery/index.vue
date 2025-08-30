<template>
  <div class="container-custom py-12">
    <h1 class="text-center mb-12">Tattoo Gallery</h1>
    
    <!-- Filter tabs -->
    <div class="flex flex-wrap justify-center mb-12">
      <button 
        v-for="style in tattooStyles" 
        :key="style.id" 
        class="px-4 py-2 m-1 rounded-md transition-colors"
        :class="activeStyle === style.id 
          ? 'bg-primary-700 text-white dark:bg-primary-400 dark:text-white' 
          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'"
        @click="activeStyle = style.id"
      >
        {{ style.name }}
      </button>
    </div>
    
    <!-- Gallery grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="tattoo in filteredTattoos" 
        :key="tattoo.id" 
        class="tattoo-card overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-800 cursor-pointer"
        @click="openTattooModal(tattoo)"
      >
        <div class="relative aspect-square bg-gray-200 dark:bg-gray-700">
          <!-- Placeholder for tattoo image -->
          <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
            Tattoo {{ tattoo.id }}
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-lg font-bold mb-1">{{ tattoo.title }}</h3>
          <div class="flex gap-2 mb-2">
            <span 
              class="px-2 py-1 text-xs rounded-full bg-primary-50 dark:bg-primary-400/20 text-primary-700 dark:text-primary-400"
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
    
    <!-- Pagination -->
    <div class="flex justify-center mt-12">
      <div class="flex space-x-2">
        <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md disabled:opacity-50">
          Previous
        </button>
        <button class="px-4 py-2 bg-primary-700 text-white dark:bg-primary-400 rounded-md">1</button>
        <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md">2</button>
        <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md">3</button>
        <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md">
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
            <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
              Tattoo {{ selectedTattoo.id }} (Full Size)
            </div>
          </div>
          
          <!-- Tattoo details -->
          <div class="mb-4">
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="px-3 py-1 text-sm rounded-full bg-primary-50 dark:bg-primary-400/20 text-primary-700 dark:text-primary-400">
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
          
          <!-- Related tattoos -->
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-bold mb-4">Similar Work</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div 
                v-for="i in 4" 
                :key="i" 
                class="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
              >
                <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  Related {{ i }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Contact CTA -->
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <h3 class="text-lg font-bold mb-2">Interested in a similar tattoo?</h3>
            <p class="mb-4 text-gray-600 dark:text-gray-300">
              Let's discuss your ideas and create something unique for you.
            </p>
            <UButton to="/contact" color="primary">
              Contact Me
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Get site configuration
const siteConfig = useSiteConfig();

// Tattoo styles
const tattooStyles = [
  { id: 'all', name: 'All Styles' },
  { id: 'blackwork', name: 'Blackwork' },
  { id: 'neotraditional', name: 'Neo-Traditional' },
  { id: 'illustrative', name: 'Illustrative' },
  { id: 'fineline', name: 'Fine Line' },
  { id: 'watercolor', name: 'Watercolor' },
];

// Active style filter
const activeStyle = ref('all');

// Modal state
interface TattooItem {
  id: number
  title: string
  description: string
  style: string
  placement: string
  size: string
  sessionTime: string
  year: number
  story: string
}

const selectedTattoo = ref<TattooItem | null>(null);

// Open tattoo modal
const openTattooModal = (tattoo: TattooItem) => {
  selectedTattoo.value = tattoo;
};

// Sample tattoo data (in a real app, this would come from the CMS)
const tattoos = [
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
    sessionTime: '8 hours (multiple sessions)',
    year: 2023,
    story: 'Based on a childhood story that was meaningful to the client, this piece captures the essence of curiosity and adventure.'
  },
  {
    id: 7,
    title: 'Dotwork Mandala',
    description: 'Intricate mandala with thousands of dots creating detailed patterns and textures.',
    style: 'blackwork',
    placement: 'Upper back',
    size: 'Large (10×10 inches)',
    sessionTime: '10 hours (multiple sessions)',
    year: 2022,
    story: 'The client wanted a meditative piece that represented balance and harmony. Each section of the mandala carries personal symbolism.'
  },
  {
    id: 8,
    title: 'Watercolor Abstract',
    description: 'Free-flowing abstract composition with bright watercolor-style splashes and minimal lines.',
    style: 'watercolor',
    placement: 'Shoulder',
    size: 'Medium (7×7 inches)',
    sessionTime: '4 hours (single session)',
    year: 2023,
    story: 'This spontaneous design was created to represent the client\'s creative spirit and embrace of life\'s unpredictability.'
  },
  {
    id: 9,
    title: 'Neo-Traditional Portrait',
    description: 'Bold and colorful neo-traditional portrait with decorative elements.',
    style: 'neotraditional',
    placement: 'Outer thigh',
    size: 'Large (9×11 inches)',
    sessionTime: '7 hours (single session)',
    year: 2022,
    story: 'A commemorative piece honoring the client\'s grandmother, incorporating elements that represented her life and passions.'
  }
];

// Filtered tattoos based on active style
const filteredTattoos = computed(() => {
  if (activeStyle.value === 'all') {
    return tattoos;
  }
  return tattoos.filter(tattoo => tattoo.style === activeStyle.value);
});

// Meta tags
useHead({
  title: `Gallery - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`,
  meta: [
    { name: 'description', content: 'Browse my portfolio of tattoo work, including various styles and designs.' }
  ]
});
</script>

<style scoped>
.tattoo-card {
  transition: all 0.3s ease;
}

.tattoo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style> 
