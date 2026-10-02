<script setup lang="ts">
/**
 * A YouTube demo video as a click-to-play facade, built on @nuxt/scripts' ScriptYouTubePlayer: a
 * thumbnail and a play button in a 16:9 box that reserves its space (no layout shift). Nothing from
 * YouTube loads until the first click; the player then uses youtube-nocookie.com. Use it as a block
 * component, `::youtube-video{id="B_7dSo4hH0k" title="..."}` followed by `::`.
 */
const props = defineProps<{
  /** The 11-character YouTube video ID, e.g. B_7dSo4hH0k (the v= value of the watch URL) */
  id: string
  /** The video's title; used for the play button's label */
  title: string
  /** Optional start time in seconds */
  start?: string | number
}>()

const ready = ref(false)
const playerVars = computed(() => {
  const start = Math.floor(Number(props.start))
  return { autoplay: 0, playsinline: 1, rel: 0, ...(start > 0 && { start }) }
})
</script>

<template>
  <ScriptYouTubePlayer
    :video-id="id"
    thumbnail-size="hqdefault"
    trigger="mousedown"
    :player-vars="playerVars"
    :root-attrs="{
      'aria-label': ready ? title : `Play video: ${title}`,
      'class': 'my-6 overflow-hidden rounded-lg shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
    }"
    :placeholder-attrs="{ alt: '' }"
    @ready="ready = true"
  >
    <span
      v-if="!ready"
      class="pointer-events-none absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-inverted shadow-lg"
      aria-hidden="true"
    >
      <UIcon name="i-lucide-play" class="size-7 translate-x-0.5" />
    </span>
  </ScriptYouTubePlayer>
</template>
