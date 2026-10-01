<script setup lang="ts">
/**
 * Overrides Nuxt UI's ProseImg (the component Markdown images render with) to reserve each
 * image's box and lazy-load it: `aspect-ratio: auto W / H` from the file's real size (so prose
 * images don't shift the layout; `auto` lets the real ratio win once it has loaded), plus
 * `loading="lazy"` and `decoding="async"`.
 *
 * This lives here, not in a Nuxt Content hook, so the content files stay free of build-time
 * attributes: Nuxt Studio writes the stored document back to the file on save.
 * The sizes come from modules/content-image-sizes.ts.
 */
import NuxtUiProseImg from '@nuxt/ui/components/prose/Img.vue'
import imageSizes from '#build/content-image-sizes.mjs'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  src: string
  alt: string
  width?: string | number
  height?: string | number
}>()

const attrs = useAttrs()

// Only the site's own files have a known size; the attributes Markdown or Studio set win
const hints = computed(() => {
  if (!props.src.startsWith('/') || props.src.startsWith('//')) return {}
  const size = (imageSizes as Record<string, number[] | undefined>)[props.src]
  return {
    ...(size && !attrs.style ? { style: `aspect-ratio: auto ${size[0]} / ${size[1]}` } : {}),
    loading: 'lazy',
    decoding: 'async'
  }
})
</script>

<template>
  <NuxtUiProseImg v-bind="{ ...hints, ...attrs }" :src="src" :alt="alt" :width="width" :height="height" />
</template>
