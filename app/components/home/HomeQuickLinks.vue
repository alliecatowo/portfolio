<template>
  <div v-if="links.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <UPageCard
      v-for="link in links"
      :key="link.title"
      :title="link.title"
      :description="link.description"
      :icon="link.icon"
      :to="link.to"
      variant="soft"
      class="glass-accent hover:scale-105 transition-transform"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  links: Array<{ title: string, description?: string, icon?: string, to?: string }>
}>()
</script>
