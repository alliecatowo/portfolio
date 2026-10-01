<template>
  <div class="contents">
    <!-- Enhanced Skip Navigation Links -->
    <ULink
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-inverted focus:rounded-md focus:ring-2 focus:ring-primary-300"
      aria-label="Skip to main content"
    >
      Skip to main content
    </ULink>
    <ULink
      href="#site-navigation"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-inverted focus:rounded-md focus:ring-2 focus:ring-primary-300"
      aria-label="Skip to navigation"
    >
      Skip to navigation
    </ULink>

    <AppHeader />
    <UMain id="main-content" class="flex-grow" aria-label="Main content">
      <slot />
    </UMain>
    <AppFooter />

    <!-- Enhanced Keyboard Shortcuts Help -->
    <ClientOnly>
      <ShortcutsHelp v-if="helpLoaded" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import AppFooter from '~/components/common/AppFooter.vue'
import AppHeader from '~/components/common/AppHeader.vue'
import { useGlobalShortcuts } from '~/composables/useGlobalShortcuts'

// The help dialog only matters once someone presses "?", so its chunk loads on first use
const ShortcutsHelp = defineAsyncComponent(() => import('~/components/common/ShortcutsHelp.vue'))
const showShortcutsHelp = useState<boolean>('showShortcutsHelp', () => false)
const helpLoaded = ref(false)
watch(showShortcutsHelp, (open) => {
  if (open) helpLoaded.value = true
})

// Register global keyboard shortcuts
useGlobalShortcuts()

</script> 
