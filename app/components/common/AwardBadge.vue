<template>
  <UBadge color="warning" variant="subtle" :size="size" class="gap-1.5">
    <span aria-hidden="true">🏆</span>
    <span>{{ award }}</span>
  </UBadge>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  award: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'sm'
})
</script>
