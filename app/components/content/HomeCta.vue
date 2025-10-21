<template>
  <section class="max-w-4xl mx-auto mt-24">
    <div class="glass-accent rounded-2xl p-8 md:p-12 text-center hover-lift">
      <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gradient-animated">
        {{ title }}
      </h2>
      <p v-if="description" class="text-lg md:text-xl text-default max-w-2xl mx-auto mb-6">
        {{ description }}
      </p>
      <div v-if="$slots.default" class="flex flex-col sm:flex-row gap-4 justify-center">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>
