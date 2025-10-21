<template>
  <section class="w-full py-20 relative">
    <div class="container max-w-6xl mx-auto px-6">
      <h2 v-if="title" class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-16 text-center text-gradient-animated leading-tight">
        {{ title }}
      </h2>

      <div class="relative">
        <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-purple-500 to-pink-500 opacity-20" />
        <div class="space-y-12">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>
