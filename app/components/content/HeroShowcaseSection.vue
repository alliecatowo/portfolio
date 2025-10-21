<template>
  <section class="max-w-6xl mx-auto mt-16 lg:mt-20">
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
      <!-- Hero Card -->
      <div class="lg:justify-self-start w-full">
        <div class="glass-accent rounded-2xl overflow-hidden shadow-xl">
          <slot name="card" />
        </div>
      </div>

      <!-- Quick Links -->
      <div class="lg:justify-self-end w-full">
        <div class="grid grid-cols-1 gap-6">
          <slot name="quick-links" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>