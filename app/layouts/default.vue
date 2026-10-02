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

    <!-- Page backdrop: lives in the layout so it survives navigations instead of remounting (and
         restarting its drift) with every page. Fixed, so it never changes the page's height. -->
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-animated bg-dots" aria-hidden="true" />

    <AppHeader />
    <!-- Never shorter than the viewport below the header, so the footer cannot rise into view while a
         page is still empty or swapping during a navigation. -->
    <UMain id="main-content" class="flex-grow min-h-[calc(100dvh-var(--ui-header-height))]" aria-label="Main content">
      <slot />
    </UMain>
    <!-- Not lazily hydrated: its links would do full page loads until hydrated -->
    <CommonAppFooter />

    <!-- Enhanced Keyboard Shortcuts Help -->
    <ClientOnly>
      <ShortcutsHelp v-if="helpLoaded" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
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
