<script setup lang="ts">
/**
 * Overrides Nuxt UI's ProseImg (the component Markdown images render with).
 *
 * Nuxt UI's version statically imports motion-v and Reka's Dialog for click-to-zoom, which cost
 * ~43 KB gzip and a ~290 ms long task on every page with a Markdown image. This one renders the
 * same markup and classes with a plain NuxtImg; the zoom overlay only exists once opened.
 *
 * It also reserves each image's box and lazy-loads it: `aspect-ratio: auto W / H` from the file's
 * real size (so prose images don't shift the layout; `auto` lets the real ratio win once it has
 * loaded), plus `loading="lazy"` and `decoding="async"`. That lives here, not in a Nuxt Content hook,
 * so the content files stay free of build-time attributes: Nuxt Studio writes the stored document
 * back to the file on save. The sizes come from modules/content-image-sizes.ts.
 */
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
const hints = computed<{ style?: string, sizes?: string, loading?: string, decoding?: string }>(() => {
  if (!props.src.startsWith('/') || props.src.startsWith('//')) return {}
  const size = (imageSizes as Record<string, number[] | undefined>)[props.src]
  return {
    ...(size && !attrs.style ? { style: `aspect-ratio: auto ${size[0]} / ${size[1]}` } : {}),
    // The prose column is at most 75ch (~686px) and a little narrower than the viewport on phones
    sizes: 'sm:92vw md:686px',
    loading: 'lazy',
    decoding: 'async'
  }
})

const open = ref(false)
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
const dialog = ref<HTMLElement | null>(null)
const close = () => { open.value = false }
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}
watch(open, async (isOpen) => {
  if (isOpen) {
    // Move focus into the dialog, and give it back to the image when it closes
    await nextTick()
    dialog.value?.focus()
    window.addEventListener('scroll', close, { passive: true })
    window.addEventListener('keydown', onKeydown)
  } else {
    window.removeEventListener('scroll', close)
    window.removeEventListener('keydown', onKeydown)
    trigger.value?.focus()
  }
})
onBeforeUnmount(() => {
  if (!import.meta.client) return
  window.removeEventListener('scroll', close)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <!-- A real <button> around the image: Enter and Space open it without any key handling here -->
  <button
    ref="trigger"
    type="button"
    :class="[width ? 'inline-block' : 'block w-full', 'cursor-zoom-in rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary']"
    :aria-label="`${alt} (open larger view)`"
    aria-haspopup="dialog"
    :aria-expanded="open"
    :data-state="open ? 'open' : 'closed'"
    @click="open = true"
  >
    <NuxtImg
      v-bind="{ ...hints, ...attrs }"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :class="['rounded-md will-change-transform', width ? '' : 'w-full']"
    />
  </button>
  <Teleport v-if="open" to="body">
    <div class="fixed inset-0 z-[100] bg-default/75 backdrop-blur-sm" aria-hidden="true" />
    <div
      ref="dialog"
      tabindex="-1"
      class="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center focus:outline-none"
      role="dialog"
      aria-modal="true"
      :aria-label="alt"
      @click="close"
    >
      <!-- Same sizes as the inline image, so it reuses the variants the build already generated -->
      <NuxtImg
        v-bind="{ sizes: hints.sizes, ...attrs }"
        :src="src"
        :alt="alt"
        class="h-auto max-h-[95vh] w-full max-w-[95vw] rounded-md object-contain"
      />
    </div>
  </Teleport>
</template>
