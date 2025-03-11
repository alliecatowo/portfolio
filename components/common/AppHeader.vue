<template>
  <header class="relative py-4 shadow-md dark:shadow-gray-800">
    <div class="container-custom flex justify-between items-center">
      <!-- Logo/Site Title -->
      <div class="flex items-center">
        <NuxtLink to="/" class="text-2xl font-bold no-underline">
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

// Get site configuration
const siteConfig = useSiteConfig();

// Mobile menu state
const isMenuOpen = ref(false);

// Close menu when route changes
const route = useRoute();
watch(() => route.path, () => {
  isMenuOpen.value = false;
});

// Generate navigation items based on site type
const navigationItems = computed(() => {
  const commonItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const devItems = [
    { name: 'Projects', path: '/projects' },
    { name: 'Open Source', path: '/open-source' },
  ];

  const tattooItems = [
    { name: 'Gallery', path: '/gallery' },
    { name: 'Testimonials', path: '/testimonials' },
  ];

  if (siteConfig.value.type === 'dev') {
    return [...commonItems, ...devItems];
  } else {
    return [...commonItems, ...tattooItems];
  }
});
</script> 