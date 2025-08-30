<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <!-- Skip Navigation Links -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md">
      Skip to main content
    </a>
    <a href="#site-navigation" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md">
      Skip to navigation
    </a>
    
    <AppHeader @openSearch="commandPaletteRef?.openSearch()" />
    <main id="main-content" class="flex-grow" role="main" aria-label="Main content">
      <slot />
    </main>
    <AppFooter />
    
    <!-- Command Palette -->
    <CommandPalette ref="commandPaletteRef" />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/common/AppHeader.vue'
import AppFooter from '~/components/common/AppFooter.vue'
import CommandPalette from '~/components/common/CommandPalette.vue'

// Command palette ref
const commandPaletteRef = ref()
</script> 
