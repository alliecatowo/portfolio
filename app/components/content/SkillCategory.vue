<template>
  <div class="group relative">
    <div
      class="absolute inset-0 bg-gradient-to-r rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"
      :class="gradientClass"
    />
    <div class="relative glass-strong rounded-xl p-6 h-full hover-lift">
      <div
        class="w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
        :class="iconBgClass"
      >
        <UIcon :name="icon || 'i-lucide-monitor'" class="w-8 h-8" :class="textClass" />
      </div>
      <h3 class="text-xl font-bold mb-4" :class="textClass">
        {{ title }}
      </h3>
      <ul class="space-y-2 text-default">
        <slot />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  icon?: string
  color?: 'primary' | 'purple' | 'pink' | 'yellow'
}>(), {
  color: 'primary'
})

const styles = {
  primary: {
    text: 'text-primary',
    iconBg: 'bg-primary/10',
    gradient: 'from-primary to-purple-600'
  },
  purple: {
    text: 'text-purple-500',
    iconBg: 'bg-purple-500/10',
    gradient: 'from-purple-600 to-pink-500'
  },
  pink: {
    text: 'text-pink-500',
    iconBg: 'bg-pink-500/10',
    gradient: 'from-pink-500 to-yellow-500'
  },
  yellow: {
    text: 'text-yellow-500',
    iconBg: 'bg-yellow-500/10',
    gradient: 'from-yellow-500 to-primary'
  }
} as const

const style = computed(() => styles[props.color] ?? styles.primary)

const textClass = computed(() => style.value.text)
const iconBgClass = computed(() => style.value.iconBg)
const gradientClass = computed(() => style.value.gradient)
</script>
