<template>
  <UButton
    :to="to"
    :href="href"
    :target="computedTarget"
    :rel="computedRel"
    :variant="variant"
    :color="color"
    :size="size"
    :leading-icon="leadingIcon"
    :trailing-icon="trailingIcon"
    :download="download"
    :block="block"
    class="font-semibold"
  >
    <slot />
  </UButton>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  to?: string
  href?: string
  variant?: string
  color?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  leadingIcon?: string
  trailingIcon?: string
  download?: string | boolean
  external?: boolean
  block?: boolean
}>(), {
  variant: 'solid',
  color: 'primary',
  size: 'lg',
  block: false,
  to: undefined,
  href: undefined,
  leadingIcon: undefined,
  trailingIcon: undefined,
  download: undefined,
  external: undefined
})

const computedTarget = computed(() => {
  if (props.external || props.href?.startsWith('http')) {
    return '_blank'
  }
  return undefined
})

const computedRel = computed(() => (computedTarget.value ? 'noopener noreferrer' : undefined))
</script>
