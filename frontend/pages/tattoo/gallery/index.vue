<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header Section -->
    <section class="py-12 md:py-16 bg-white dark:bg-gray-800">
      <div class="container-custom text-center">
        <h1 class="text-4xl font-bold mb-4 text-gradient-animated">Tattoo Gallery</h1>
        <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore a collection of unique tattoo designs and stories. Each piece tells a personal journey and represents the collaborative artistry between artist and client.
        </p>
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="py-12 md:py-16">
      <div class="container-custom">
        <!-- Style Filters -->
        <div class="mb-8 flex flex-wrap justify-center gap-4">
          <button
            v-for="style in tattooStyles"
            :key="style.id"
            @click="activeStyle = style.id"
            :class="[
              'px-4 py-2 rounded-full transition-all',
              activeStyle === style.id
                ? 'bg-primary text-white dark:bg-primary-400'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            {{ style.name }}
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-400"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg text-center max-w-md mx-auto">
          <p>{{ error }}</p>
        </div>

        <!-- Gallery Grid -->
        <div v-else-if="filteredTattoos && filteredTattoos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="tattoo in paginatedTattoos" 
            :key="tattoo.id" 
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            @click="openTattooModal(tattoo)"
          >
            <!-- Tattoo Image -->
            <div class="aspect-square bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <NuxtImg 
                provider="none"
                :src="tattoo.image || 'https://placehold.co/600x600?text=Tattoo'" 
                :alt="tattoo.title"
                loading="lazy"
                preset="gallery"
                sizes="100vw sm:50vw md:33vw lg:400px"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <!-- Tattoo Info -->
            <div class="p-6">
              <div class="mb-2">
                <span class="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-400/20 text-primary dark:text-primary-400 text-xs rounded-full uppercase tracking-wide">
                  {{ tattoo.style }}
                </span>
              </div>
              <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">{{ tattoo.title }}</h3>
              <p class="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{{ tattoo.description }}</p>
              
              <!-- Tattoo Details -->
              <div class="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <p v-if="tattoo.placement"><strong>Placement:</strong> {{ tattoo.placement }}</p>
                <p v-if="tattoo.sessionTime"><strong>Session Time:</strong> {{ tattoo.sessionTime }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="filteredTattoos && filteredTattoos.length > pageSize" class="mt-12 flex justify-center">
          <UPagination 
            v-model:page="page"
            :items-per-page="pageSize" 
            :total="total" 
            show-edges
            :sibling-count="1"
          />
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading && (!filteredTattoos || filteredTattoos.length === 0)" class="text-center py-16">
          <div class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">No tattoos found</h3>
          <p class="text-gray-500 dark:text-gray-400">{{ activeStyle === 'all' ? 'Check back later for new gallery additions.' : `No tattoos found for ${activeStyle} style.` }}</p>
        </div>
      </div>
    </section>

    <!-- Modal for Tattoo Details -->
    <UModal 
      v-model:open="isModalOpen" 
      :ui="{ content: 'w-full sm:max-w-2xl max-h-[90vh]' }"
      :prevent-close="false"
    >
      <template #content>
      <UCard v-if="selectedTattoo" :ui="{ body: 'p-0' }">
        <template #header>
          <!-- Tattoo Image -->
          <div class="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-t-lg">
            <NuxtImg 
              provider="none"
              :src="selectedTattoo.image || 'https://placehold.co/800x600?text=Tattoo'" 
              :alt="selectedTattoo.title"
              loading="lazy"
              preset="hero"
              sizes="100vw lg:800px"
              class="w-full h-full object-cover"
            />
          </div>
        </template>
        
        <div class="p-6">
          <div class="mb-4">
            <UBadge 
              :label="selectedTattoo.style" 
              color="primary" 
              variant="subtle" 
              class="mb-2"
            />
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedTattoo.title }}</h2>
          </div>
          
          <p class="text-gray-600 dark:text-gray-300 mb-6">{{ selectedTattoo.description }}</p>
          
          <!-- Technical Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div v-if="selectedTattoo.placement">
              <h4 class="font-semibold text-gray-900 dark:text-white">Placement</h4>
              <p class="text-gray-600 dark:text-gray-300">{{ selectedTattoo.placement }}</p>
            </div>
            <div v-if="selectedTattoo.size">
              <h4 class="font-semibold text-gray-900 dark:text-white">Size</h4>
              <p class="text-gray-600 dark:text-gray-300">{{ selectedTattoo.size }}</p>
            </div>
            <div v-if="selectedTattoo.sessionTime">
              <h4 class="font-semibold text-gray-900 dark:text-white">Session Time</h4>
              <p class="text-gray-600 dark:text-gray-300">{{ selectedTattoo.sessionTime }}</p>
            </div>
            <div v-if="selectedTattoo.year">
              <h4 class="font-semibold text-gray-900 dark:text-white">Year</h4>
              <p class="text-gray-600 dark:text-gray-300">{{ selectedTattoo.year }}</p>
            </div>
          </div>
          
          <!-- Story -->
          <div v-if="selectedTattoo.story" class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Story</h4>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{{ selectedTattoo.story }}</p>
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-center">
            <UButton 
              to="/tattoo/contact" 
              color="primary" 
              size="lg"
              class="px-8 btn-depth magnetic-hover"
            >
              Get Your Own Tattoo
            </UButton>
          </div>
        </template>
      </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';
import { useContent } from '~/composables/useContent';

// Ensure site config is set to tattoo
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'tattoo') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'tattoo'
  };
}

// Use content composable
const { fetchGalleryItems } = useContent();

// Fetch gallery items
const { data: galleryData, pending: loading, error } = await useAsyncData(
  'tattoo-gallery',
  () => fetchGalleryItems()
);

// Type definitions
interface GalleryItem {
  title?: string;
  description?: string;
  images?: string | string[];
  styles?: string | string[];
  placement?: string;
  size?: string;
  session_time?: string;
  date?: string;
  featured?: boolean;
}

// Map gallery data to tattoos format
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
  image: string
}

const tattoos = computed<TattooItem[]>(() => {
  if (!galleryData.value || !Array.isArray(galleryData.value)) {
    return [];
  }
  
  return galleryData.value.map((item, index) => ({
    id: index + 1,
    title: item.title || 'Untitled',
    description: item.description || '',
    style: (Array.isArray(item.styles) ? item.styles[0] : (item.styles as string)) || 'custom',
    placement: (item as GalleryItem).placement || '',
    size: (item as GalleryItem).size || '',
    sessionTime: (item as GalleryItem).session_time || '',
    year: new Date(item.date).getFullYear() || new Date().getFullYear(),
    story: item.description || '',
    image: (Array.isArray(item.images) ? item.images[0] : (item.images as string)) || 'https://placehold.co/600x600?text=Tattoo'
  }));
});

// State
const selectedTattoo = ref<TattooItem | null>(null);
const activeStyle = ref('all');
const page = ref(1);
const pageSize = 9; // 3 columns x 3 rows

// Computed property for modal state
const isModalOpen = computed({
  get: () => selectedTattoo.value !== null,
  set: (value: boolean) => {
    if (!value) {
      selectedTattoo.value = null;
    }
  }
});

// Watch for style filter changes to reset pagination
watch(activeStyle, () => {
  page.value = 1;
});

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
  let filtered = tattoos.value;
  if (activeStyle.value !== 'all') {
    filtered = tattoos.value.filter(tattoo => 
      tattoo.style.toLowerCase() === activeStyle.value.toLowerCase()
    );
  }
  return filtered;
});

// Pagination computed properties
const total = computed(() => filteredTattoos.value.length);
const paginatedTattoos = computed(() => {
  const start = (page.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredTattoos.value.slice(start, end);
});

// Methods
const openTattooModal = (tattoo: TattooItem) => {
  selectedTattoo.value = tattoo;
};

// Meta tags
useHead({
  title: `Tattoo Gallery - ${siteConfig.value?.title || 'Allison\'s Tattoo Portfolio'}`,
  meta: [
    { name: 'description', content: 'Explore unique tattoo designs and stories. Each piece represents collaborative artistry between artist and client.' }
  ]
});
</script>
