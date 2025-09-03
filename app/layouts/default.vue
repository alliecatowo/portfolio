<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <!-- Skip Navigation Links -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md">
      Skip to main content
    </a>
    <a href="#site-navigation" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md">
      Skip to navigation
    </a>
    
    <AppHeader @open-search="commandPaletteRef?.openSearch()" />
    <main id="main-content" class="flex-grow" aria-label="Main content">
      <slot />
    </main>
    <AppFooter />
    
    <!-- Command Palette -->
    <CommandPalette ref="commandPaletteRef" />
    
    <!-- Keyboard Shortcuts Help -->
    <ClientOnly>
      <ShortcutsHelp />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import AppFooter from '~/components/common/AppFooter.vue'
import AppHeader from '~/components/common/AppHeader.vue'
import CommandPalette from '~/components/common/CommandPalette.vue'
import ShortcutsHelp from '~/components/common/ShortcutsHelp.vue'
import { useGlobalShortcuts } from '~/composables/useGlobalShortcuts'

// Command palette ref
const commandPaletteRef = ref()

// Register global keyboard shortcuts
useGlobalShortcuts()
</script> 
