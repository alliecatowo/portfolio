<template>
  <a
    :href="href"
    :target="computedTarget"
    :rel="computedRel"
    class="w-12 h-12 glass-strong rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors group"
    :aria-label="label"
  >
    <UIcon :name="icon" class="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
  </a>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  href: string
  icon: string
  external?: boolean
}>()

const computedTarget = computed(() => (props.external ?? props.href.startsWith('http') ? '_blank' : undefined))
const computedRel = computed(() => (computedTarget.value ? 'noopener noreferrer' : undefined))
</script>
