<template>
  <section class="py-20">
    <div class="container max-w-4xl mx-auto px-6">
      <UCard class="glass-accent text-center hover:scale-105 transition-transform">
        <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated">
          {{ title }}
        </h2>
        <p v-if="description" class="text-xl text-default mb-8 max-w-2xl mx-auto">
          {{ description }}
        </p>

        <div v-if="$slots.buttons" class="flex flex-wrap gap-4 justify-center mb-8">
          <slot name="buttons" />
        </div>

        <div v-if="$slots.socials" class="flex justify-center gap-6">
          <slot name="socials" />
        </div>
      </UCard>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>
