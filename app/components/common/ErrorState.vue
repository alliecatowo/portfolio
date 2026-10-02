<script setup lang="ts">
/**
 * The body of the 404 / error page. Shared by app/error.vue (runtime errors) and by the hidden
 * /not-found-shell/ page, which is prerendered and copied to 404.html so the static 404 response has
 * real content before (or without) JavaScript. See the prerender:done hook in nuxt.config.ts.
 */
defineProps<{ statusCode?: number | string, notFound: boolean }>()
const emit = defineEmits<{ navigate: [path: string] }>()
</script>

<template>
  <div class="mx-auto max-w-2xl px-6 py-24 text-center">
    <p class="text-sm font-semibold text-primary">
      {{ statusCode }}
    </p>
    <h1 class="mt-3 text-4xl font-bold text-highlighted md:text-5xl">
      {{ notFound ? 'Page not found' : 'Something went wrong' }}
    </h1>
    <p class="mt-4 text-lg text-muted">
      {{ notFound ? 'That page does not exist, or it moved.' : 'An error got in the way of this page.' }}
    </p>
    <div class="mt-8 flex justify-center gap-3">
      <UButton to="/" size="lg" @click.prevent="emit('navigate', '/')">
        Back to the home page
      </UButton>
      <UButton to="/projects/" size="lg" variant="outline" @click.prevent="emit('navigate', '/projects/')">
        Browse projects
      </UButton>
    </div>
  </div>
</template>
