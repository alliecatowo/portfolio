<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <AppHeader @openSearch="commandPaletteRef?.openSearch()" />
    <main class="flex-grow">
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
