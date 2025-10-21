<template>
  <section class="w-full py-20 glass-accent">
    <div class="container max-w-7xl mx-auto px-6">
      <h2 v-if="title" class="text-4xl md:text-5xl font-bold mb-16 text-center text-gradient-animated">
        {{ title }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>
