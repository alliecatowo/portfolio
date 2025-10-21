<template>
  <UCard class="text-center glass-accent hover:scale-105 transition-transform">
    <div class="text-2xl font-bold text-primary">{{ value }}</div>
    <div class="text-sm text-muted">{{ label }}</div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>
