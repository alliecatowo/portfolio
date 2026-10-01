<script setup lang="ts">
/**
 * A short looping screen recording: muted, autoplaying and inline, with WebM and MP4 sources and a
 * poster frame. Use it as a block component, `::demo-video{webm="..." mp4="..." poster="..."
 * width="1200" height="800" alt="..."}` followed by `::`. Put an italic caption paragraph under
 * it, or set `caption` to render a figure with a figcaption.
 */
defineProps<{
  /** Path of the WebM source under public/, e.g. /images/projects/shoal/demo.webm */
  webm: string
  /** Path of the MP4 fallback source under public/ */
  mp4: string
  /** Path of the poster image shown before the video plays */
  poster?: string
  /** What the recording shows (becomes the video's aria-label) */
  alt?: string
  /** Intrinsic width in pixels; with height it reserves the aspect ratio so the page doesn't shift */
  width?: string | number
  /** Intrinsic height in pixels */
  height?: string | number
  /** Optional visible caption; wraps the video in a figure */
  caption?: string
}>()
</script>

<template>
  <figure v-if="caption">
    <video
      class="w-full h-auto rounded-lg"
      :width="width"
      :height="height"
      autoplay
      muted
      loop
      playsinline
      :poster="poster"
      :aria-label="alt"
    >
      <source :src="webm" type="video/webm">
      <source :src="mp4" type="video/mp4">
    </video>
    <figcaption class="mt-2 text-sm italic text-muted">
      {{ caption }}
    </figcaption>
  </figure>
  <video
    v-else
    class="w-full h-auto rounded-lg"
    :width="width"
    :height="height"
    autoplay
    muted
    loop
    playsinline
    :poster="poster"
    :aria-label="alt"
  >
    <source :src="webm" type="video/webm">
    <source :src="mp4" type="video/mp4">
  </video>
</template>
