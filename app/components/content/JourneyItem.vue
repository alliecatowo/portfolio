<template>
  <div class="flex items-center justify-center">
    <UCard class="relative glass-accent max-w-2xl hover:scale-105 transition-transform" :class="cardClass">
      <div
        class="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full border-4 border-white dark:border-gray-900"
        :class="bulletClass"
      />
      <h3 class="text-xl font-bold mb-3" :class="titleClass">
        {{ title }}
      </h3>
      <p class="text-default leading-relaxed">
        <slot mdc-unwrap="p" />
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  color?: 'primary' | 'purple' | 'pink' | 'gradient'
}>(), {
  color: 'primary'
})

const styles = {
  primary: {
    title: 'text-primary',
    bullet: 'bg-primary',
    card: ''
  },
  purple: {
    title: 'text-purple-500',
    bullet: 'bg-purple-500',
    card: ''
  },
  pink: {
    title: 'text-pink-500',
    bullet: 'bg-pink-500',
    card: ''
  },
  gradient: {
    title: 'text-gradient',
    bullet: 'bg-gradient-to-r from-primary to-pink-500 animate-pulse',
    card: 'animate-pulse-subtle'
  }
} as const

const style = computed(() => styles[props.color] ?? styles.primary)

const titleClass = computed(() => style.value.title)
const bulletClass = computed(() => style.value.bullet)
const cardClass = computed(() => style.value.card)
</script>

<style scoped>
@keyframes pulse-subtle {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 3s ease-in-out infinite;
}
</style>
