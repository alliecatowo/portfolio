<template>
  <Teleport to="body">
    <div 
      v-if="isOpen"
      class="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-20"
      @click.self="isOpen = false"
      @keydown.esc="isOpen = false"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      
      <!-- Modal Content -->
      <div class="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl">
        <UCommandPalette 
          v-model="selectedCommand"
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
          class="border-0 bg-transparent rounded-xl"
          @keydown.esc="isOpen = false"
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
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { CommandPaletteItem } from '#ui/types'
import { useSearch } from '~/composables/useSearch'

// Modal open state
const isOpen = ref(false)

// Selected command state
const selectedCommand = ref<CommandPaletteItem | undefined>(undefined)

// Close modal function
const closeModal = () => {
  isOpen.value = false
}

const { createCommandGroups } = useSearch()
const commandGroups = computed(() => createCommandGroups(closeModal))

// Expose openSearch method
const openSearch = () => {
  isOpen.value = true
}

defineExpose({
  openSearch
})

// Use defineShortcuts for proper keyboard handling
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