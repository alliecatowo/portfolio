<template>
  <UCard
    class="glass-accent hover:scale-105 transition-transform"
    :to="linkTarget"
    :href="hrefTarget"
  >
    <div class="flex items-center gap-4 mb-3">
      <UIcon v-if="icon" :name="icon" class="w-6 h-6 text-primary" />
      <h3 class="font-semibold text-default">{{ title }}</h3>
    </div>
    <p class="text-muted text-sm leading-relaxed">
      <slot>{{ description }}</slot>
    </p>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  description?: string
  to?: string
  href?: string
  icon?: string
}>()

const linkTarget = computed(() => (props.href ? undefined : props.to))
const hrefTarget = computed(() => props.href ?? (props.to?.startsWith('http') ? props.to : undefined))
</script>
