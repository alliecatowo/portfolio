<template>
  <section class="w-full py-20 md:py-32 grid lg:grid-cols-[1fr,480px] gap-12 lg:gap-16 items-center">
    <div class="order-2 lg:order-1 space-y-6">
      <p v-if="status" class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong text-sm text-default">
        <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        {{ status }}
      </p>
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-animated leading-tight">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-lg sm:text-xl md:text-2xl text-primary font-semibold">
        {{ subtitle }}
      </p>
      <div v-if="$slots.default" class="prose prose-lg dark:prose-invert max-w-none">
        <slot />
      </div>
      <div v-if="$slots.buttons" class="flex flex-wrap gap-4">
        <slot name="buttons" />
      </div>
    </div>

    <div class="order-1 lg:order-2">
      <div class="relative mx-auto w-72 h-72 md:w-80 md:h-80">
        <div class="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-pink-500 to-purple-600 animate-spin-slow opacity-20" />
        <div class="absolute inset-4 rounded-full bg-gradient-to-l from-primary via-purple-600 to-pink-500 animate-spin-reverse opacity-20" />
        <div class="relative w-full h-full rounded-full overflow-hidden glass-accent p-2">
          <NuxtImg
            v-if="image"
            :src="image"
            :alt="title"
            preset="avatar"
            class="w-full h-full rounded-full object-cover"
          />
          <div v-else class="w-full h-full rounded-full flex items-center justify-center text-4xl font-bold text-primary bg-primary/10">
            {{ initials }}
          </div>
        </div>
        <div v-if="$slots.stats" class="grid grid-cols-3 gap-3 mt-8">
          <slot name="stats" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  subtitle?: string
  status?: string
  image?: string
}>()

const initials = computed(() => props.title?.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase())
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-spin-reverse {
  animation: spin-reverse 25s linear infinite;
}
</style>
