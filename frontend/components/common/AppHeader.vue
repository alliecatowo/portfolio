<template>
  <header class="relative py-4 shadow-md dark:shadow-gray-800">
    <div class="container-custom flex justify-between items-center">
      <!-- Logo/Site Title -->
      <div class="flex items-center">
        <NuxtLink :to="siteConfig.type === 'dev' ? '/dev' : '/tattoo'" class="text-2xl font-bold no-underline">
          <span :class="[
            siteConfig.type === 'dev' ? 'text-primary dark:text-dark-primary' : 'text-primary-dark dark:text-dark-primary'
          ]">
            {{ siteConfig.title }}
          </span>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="hidden md:flex space-x-8 items-center">
        <NuxtLink 
          v-for="(item, index) in navigationItems" 
          :key="index" 
          :to="item.path" 
          class="no-underline hover:text-primary-dark dark:hover:text-dark-primary-light font-medium transition-colors"
        >
          {{ item.name }}
        </NuxtLink>
        
        <!-- Portfolio Toggle -->
        <button 
          @click="togglePortfolioType" 
          class="px-3 py-1 rounded-full border-2 border-primary dark:border-dark-primary text-primary dark:text-dark-primary text-sm font-medium hover:bg-primary hover:text-white dark:hover:bg-dark-primary dark:hover:text-white transition-colors"
        >
          Switch to {{ siteConfig.type === 'dev' ? 'Tattoo' : 'Developer' }} Portfolio
        </button>
        
        <!-- Admin Navigation -->
        <AdminNav />
        
        <!-- Theme toggle -->
        <ThemeToggle />
      </nav>

      <!-- Mobile menu button -->
      <button 
        class="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
        @click="isMenuOpen = !isMenuOpen"
        aria-label="Toggle menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div 
      v-if="isMenuOpen" 
      class="md:hidden absolute top-full left-0 right-0 bg-background dark:bg-dark-background shadow-md z-10"
    >
      <div class="container-custom py-4 space-y-4">
        <NuxtLink 
          v-for="(item, index) in navigationItems" 
          :key="index" 
          :to="item.path" 
          class="block py-2 no-underline hover:text-primary-dark dark:hover:text-dark-primary-light font-medium transition-colors"
          @click="isMenuOpen = false"
        >
          {{ item.name }}
        </NuxtLink>
        
        <!-- Portfolio Toggle for mobile -->
        <button 
          @click="togglePortfolioType" 
          class="block w-full text-left py-2 font-medium text-primary dark:text-dark-primary"
        >
          Switch to {{ siteConfig.type === 'dev' ? 'Tattoo' : 'Developer' }} Portfolio
        </button>
        
        <!-- Theme toggle for mobile -->
        <div class="py-2">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';
import ThemeToggle from '~/components/common/ThemeToggle.vue';
import AdminNav from '~/components/common/AdminNav.vue';

// Get site configuration
const siteConfig = useSiteConfig();
const router = useRouter();

// Mobile menu state
const isMenuOpen = ref(false);

// Close menu when route changes
const route = useRoute();
watch(() => route.path, () => {
  isMenuOpen.value = false;
});

// Toggle between developer and tattoo portfolios
const togglePortfolioType = () => {
  const currentType = siteConfig.value.type;
  const newType = currentType === 'dev' ? 'tattoo' : 'dev';
  const baseRoute = newType === 'dev' ? '/dev' : '/tattoo';
  
  // Navigate to the corresponding route in the other portfolio
  router.push(baseRoute);
};

// Generate navigation items based on site type
const navigationItems = computed(() => {
  if (siteConfig.value.type === 'dev') {
    return [
      { name: 'Home', path: '/dev' },
      { name: 'About', path: '/dev/about' },
      { name: 'Blog', path: '/dev/blog' },
      { name: 'Contact', path: '/dev/contact' },
      { name: 'Projects', path: '/dev/projects' },
      { name: 'Open Source', path: '/dev/open-source' },
    ];
  } else if (siteConfig.value.type === 'tattoo') {
    return [
      { name: 'Home', path: '/tattoo' },
      { name: 'About', path: '/tattoo/about' },
      { name: 'Blog', path: '/tattoo/blog' },
      { name: 'Contact', path: '/tattoo/contact' },
      { name: 'Gallery', path: '/tattoo/gallery' },
      { name: 'Testimonials', path: '/tattoo/testimonials' },
    ];
  } else {
    // Dual mode - landing page
    return [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ];
  }
});
</script> 