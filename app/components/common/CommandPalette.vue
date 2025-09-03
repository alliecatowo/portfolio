<template>
  <UModal 
    v-model:open="isOpen"
    :ui="{
      content: 'w-full sm:max-w-3xl p-0 sm:my-16',
      overlay: 'backdrop-blur-sm'
    }"
    :transition="false"
  >
    <template #content>
      <UCommandPalette 
        v-model:search-term="searchTerm"
        :model-value="selectedCommand"
        :groups="dynamicGroups"
        :placeholder="placeholderText"
        icon="i-lucide-search"
        :loading="isLoading"
        :fuse-options="{
          fuseOptions: {
            ignoreLocation: true,
            threshold: 0.1,
            includeMatches: true,
            keys: [
              { name: 'label', weight: 0.7 },
              { name: 'suffix', weight: 0.3 },
              { name: 'description', weight: 0.2 }
            ]
          },
          resultLimit: 12,
          matchAllWhenSearchEmpty: true
        }"
        @update:model-value="handleSelection"
        @keydown.esc="closeModal"
        @keydown.meta.k.prevent="closeModal"
      >
        <template #footer>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-t border-gray-200/60 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-900/50">
            <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
              <div class="flex items-center gap-1">
                <UKbd size="sm">↑↓</UKbd>
                <span class="hidden sm:inline">navigate</span>
                <span class="sm:hidden">nav</span>
              </div>
              <div class="flex items-center gap-1">
                <UKbd size="sm">↵</UKbd>
                <span>select</span>
              </div>
              <div class="flex items-center gap-1">
                <UKbd size="sm">esc</UKbd>
                <span>close</span>
              </div>
              <div class="hidden sm:flex items-center gap-1 text-primary/70">
                <span>Try</span>
                <UKbd size="sm">>blog</UKbd>
                <UKbd size="sm">?</UKbd>
              </div>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>{{ dynamicGroups.reduce((acc, g) => acc + (g.items?.length || 0), 0) }} results</span>
              <span class="hidden sm:inline">•</span>
              <span class="hidden sm:inline">Powered by <span class="text-primary">Fuse.js</span></span>
            </div>
          </div>
        </template>
      </UCommandPalette>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { SearchCommandPaletteItem } from '../../composables/useSearch'
import { useSearch } from '../../composables/useSearch'

// Modal open state
const isOpen = ref(false)

// Search term state
const searchTerm = ref('')

// Selected command state
const selectedCommand = ref<SearchCommandPaletteItem | undefined>(undefined)

// Close modal function
const closeModal = () => {
  isOpen.value = false
  searchTerm.value = ''
  // Reset selected command
  setTimeout(() => {
    selectedCommand.value = undefined
  }, 100)
}

const { 
  createCommandGroups, 
  parseSearchTerm, 
  addSearchToHistory, 
  isLoading 
} = useSearch()

// Dynamic groups that update based on search term
const dynamicGroups = computed(() => createCommandGroups(closeModal, searchTerm.value))

// Dynamic placeholder based on search prefix
const placeholderText = computed(() => {
  const parsed = parseSearchTerm(searchTerm.value)
  
  if (parsed.prefix === 'blog') return 'Search blog posts...'
  if (parsed.prefix === 'projects') return 'Search projects...'
  if (parsed.prefix === 'actions') return 'Search quick actions...'
  if (parsed.prefix === 'pages') return 'Search pages...'
  if (parsed.prefix === 'help') return 'Available shortcuts and commands'
  
  return 'Search pages, posts, projects... (try >blog, >projects, or ?)'
})

// Handle selection from command palette  
const handleSelection = (item: SearchCommandPaletteItem | unknown) => {
  // Add search to history if there was a search term
  if (searchTerm.value.trim()) {
    addSearchToHistory(searchTerm.value)
  }
  
  if (item && typeof item === 'object' && 'onSelect' in item && typeof item.onSelect === 'function') {
    item.onSelect()
  }
  selectedCommand.value = item as SearchCommandPaletteItem
}

// Watch for search term changes and provide smart suggestions
watch(searchTerm, () => {
  // Update dynamic groups when search term changes
  // This is handled by the computed property dynamically
}, { immediate: true })

// Expose openSearch method
const openSearch = () => {
  isOpen.value = true
}

defineExpose({
  openSearch
})

// Enhanced keyboard shortcuts
defineShortcuts({
  // Primary command palette shortcuts
  meta_k: {
    usingInput: true,
    handler: () => {
      isOpen.value = !isOpen.value
      if (isOpen.value) {
        searchTerm.value = ''
      }
    }
  },
  'ctrl_k': {
    usingInput: true,
    handler: () => {
      isOpen.value = !isOpen.value
      if (isOpen.value) {
        searchTerm.value = ''
      }
    }
  },
  'meta_/': {
    usingInput: true,
    handler: () => {
      isOpen.value = !isOpen.value
      if (isOpen.value) {
        searchTerm.value = '?'
      }
    }
  },
  // Quick search prefixes
  'meta_b': {
    usingInput: true,
    handler: () => {
      isOpen.value = true
      searchTerm.value = '>blog '
    }
  },
  'meta_p': {
    usingInput: true,  
    handler: () => {
      isOpen.value = true
      searchTerm.value = '>projects '
    }
  },
  'meta_shift_p': {
    usingInput: true,
    handler: () => {
      isOpen.value = true
      searchTerm.value = '>pages '
    }
  },
  // ESC handling
  escape: {
    usingInput: true,
    handler: () => {
      if (isOpen.value) {
        // If there's a search term, clear it first, then close on second ESC
        if (searchTerm.value.trim()) {
          searchTerm.value = ''
        } else {
          isOpen.value = false
        }
      }
    }
  }
})

// Handle command palette specific keyboard navigation
const handleKeyNavigation = (event: KeyboardEvent) => {
  if (!isOpen.value) return

  // Handle prefix shortcuts when typing
  if (event.key === '>' && searchTerm.value === '') {
    // Show hint about available prefixes
    console.log('Available prefixes: >blog, >projects, >actions, >pages')
  }
  
  // Handle help shortcut
  if (event.key === '?' && searchTerm.value === '') {
    searchTerm.value = '?'
    event.preventDefault()
  }
}

// Listen for keyboard events when modal is open
watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('keydown', handleKeyNavigation)
  } else {
    document.removeEventListener('keydown', handleKeyNavigation)
  }
})
</script>
