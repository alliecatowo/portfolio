<template>
  <UModal v-model:open="isOpen" :prevent-close="false">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">Keyboard Shortcuts</h3>
            <UButton icon="i-lucide-x" variant="ghost" color="neutral" size="xs" @click="isOpen = false" aria-label="Close" />
          </div>
        </template>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex items-center justify-between border rounded-md p-3">
          <div class="text-sm">Open search</div>
          <div class="flex items-center gap-1"><UKbd value="meta" /><UKbd value="K" /></div>
        </div>
        <div class="flex items-center justify-between border rounded-md p-3">
          <div class="text-sm">Accessibility settings</div>
          <div class="flex items-center gap-1"><UKbd value="meta" /><UKbd value="A" /></div>
        </div>
        <div class="flex items-center justify-between border rounded-md p-3">
          <div class="text-sm">Toggle theme</div>
          <div class="flex items-center gap-1"><UKbd value="meta" /><UKbd value="T" /></div>
        </div>
        <div class="flex items-center justify-between border rounded-md p-3">
          <div class="text-sm">Switch portfolio</div>
          <div class="flex items-center gap-1"><UKbd value="meta" /><UKbd value="S" /></div>
        </div>
        <div class="flex items-center justify-between border rounded-md p-3">
          <div class="text-sm">Close modals</div>
          <div class="flex items-center gap-1"><UKbd value="escape" /></div>
        </div>
        <div class="flex items-center justify-between border rounded-md p-3">
          <div class="text-sm">Show help</div>
          <div class="flex items-center gap-1"><UKbd value="?" /></div>
        </div>
      </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton color="primary" @click="isOpen = false">Close</UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = useState<boolean>('showShortcutsHelp')
</script>
