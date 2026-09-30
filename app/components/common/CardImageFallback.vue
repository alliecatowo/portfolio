<template>
  <!--
    No-image card header: a local gradient block with the title, so cards
    without artwork never pull a random remote placeholder image.
  -->
  <div
    class="bg-gradient-dev w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center"
    aria-hidden="true"
  >
    <UIcon :name="icon" class="w-10 h-10 text-white/80" />
    <span v-if="title" class="text-lg md:text-xl font-semibold text-white text-balance line-clamp-2">
      {{ title }}
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  icon?: string
}>(), {
  title: undefined,
  icon: 'i-lucide-code'
})
</script>
