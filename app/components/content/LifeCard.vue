<template>
  <UCard class="glass-accent hover:scale-105 transition-transform overflow-hidden">
    <template #header>
      <div class="aspect-video bg-gradient-to-br from-primary/20 to-purple-600/20 relative overflow-hidden rounded-lg">
        <NuxtImg
          v-if="image"
          :src="image"
          :alt="title"
          class="w-full h-full object-cover mix-blend-overlay"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <UIcon v-if="icon" :name="icon" class="absolute bottom-4 right-4 w-8 h-8 text-white/80" />
      </div>
    </template>

    <h3 class="text-xl font-bold mb-2" :class="textClass">
      {{ title }}
    </h3>
    <p class="text-muted">
      <slot mdc-unwrap="p" />
    </p>
  </UCard>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  icon?: string
  image?: string
  color?: 'primary' | 'purple' | 'pink'
}>(), {
  color: 'primary'
})

const colors = {
  primary: 'text-primary',
  purple: 'text-purple-500',
  pink: 'text-pink-500'
} as const

const textClass = computed(() => colors[props.color] ?? colors.primary)
</script>
