<template>
  <UModal 
    v-model:open="isOpen"
    :ui="{
      width: 'w-full sm:max-w-2xl',
      padding: 'p-0',
      margin: 'sm:my-20'
    }"
  >
    <template #content>
      <UCommandPalette 
        :model-value="selectedCommand"
        @update:model-value="handleSelection"
        :groups="commandGroups"
        placeholder="Search pages, posts, projects..."
        icon="i-lucide-search"
        autofocus
        :fuse-options="{
          fuseOptions: {
            ignoreLocation: true,
            threshold: 0.2,
            keys: ['label', 'suffix', 'chip.label']
          },
          resultLimit: 10,
          matchAllWhenSearchEmpty: true
        }"
        
        @keydown.esc="closeModal"
      >
        <template #footer>
          <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200/60 dark:border-gray-800/60">
            <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-1">
                <UKbd size="sm">↑</UKbd>
                <UKbd size="sm">↓</UKbd>
                <span>navigate</span>
              </div>
              <div class="flex items-center gap-1">
                <UKbd size="sm">↵</UKbd>
                <span>select</span>
              </div>
              <div class="flex items-center gap-1">
                <UKbd size="sm">esc</UKbd>
                <span>close</span>
              </div>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              Powered by <span class="text-primary">Fuse.js</span>
            </div>
          </div>
        </template>
      </UCommandPalette>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { SearchCommandPaletteItem } from '~/composables/useSearch'
import { useSearch } from '~/composables/useSearch'

// Modal open state
const isOpen = ref(false)

// Selected command state
const selectedCommand = ref<SearchCommandPaletteItem | undefined>(undefined)

// Close modal function
const closeModal = () => {
  isOpen.value = false
  // Reset selected command
  setTimeout(() => {
    selectedCommand.value = undefined
  }, 100)
}

const { createCommandGroups } = useSearch()
const commandGroups = computed(() => createCommandGroups(closeModal))

// Auto-register shortcuts from items with `kbds` using Nuxt UI helper
const paletteShortcuts = computed(() => extractShortcuts(commandGroups.value.map(g => g.items || [])))
const filteredPaletteShortcuts = computed(() => {
  const map = { ...paletteShortcuts.value }
  // Avoid duplicating global shortcuts
  delete map.meta_t
  delete map.meta_a
  delete map.meta_s
  return map
})
defineShortcuts(filteredPaletteShortcuts)

// Handle selection from command palette
const handleSelection = (item: SearchCommandPaletteItem) => {
  if (item && typeof item.onSelect === 'function') {
    item.onSelect()
  }
  selectedCommand.value = item
}

// Expose openSearch method
const openSearch = () => {
  isOpen.value = true
}

defineExpose({
  openSearch
})

// Core palette shortcuts
defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      isOpen.value = !isOpen.value
    }
  },
  'meta_/': {
    usingInput: true,
    handler: () => {
      isOpen.value = !isOpen.value
    }
  },
  escape: {
    usingInput: true,
    handler: () => {
      if (isOpen.value) {
        isOpen.value = false
      }
    }
  }
})
</script>
