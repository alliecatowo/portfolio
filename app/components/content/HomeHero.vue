<template>
  <section class="max-w-4xl mx-auto text-center">
    <div v-if="note" class="mb-6 text-sm text-muted flex items-center justify-center flex-wrap gap-3">
      <span v-if="note.prefix">{{ note.prefix }}</span>
      <div v-if="note.keys?.length" class="flex gap-2">
        <kbd
          v-for="key in note.keys"
          :key="key"
          class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        >
          {{ key }}
        </kbd>
      </div>
      <span v-if="note.suffix">{{ note.suffix }}</span>
    </div>

    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient-animated">
      {{ title }}
    </h1>
    <h2 v-if="subtitle" class="text-xl md:text-2xl text-primary font-semibold mb-4">
      {{ subtitle }}
    </h2>

    <div class="text-lg md:text-xl text-default leading-relaxed space-y-4">
      <slot />
    </div>

    <div v-if="$slots.buttons" class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <slot name="buttons" />
    </div>
  </section>
</template>

<script setup lang="ts">
interface NoteData {
  prefix?: string
  suffix?: string
  keys?: string[]
}

defineProps<{
  title: string
  subtitle?: string
  note?: NoteData
}>()
</script>
