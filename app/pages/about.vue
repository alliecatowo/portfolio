<template>
  <main class="min-h-screen bg-gradient-animated bg-dots relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;" />
      <div class="absolute top-1/3 right-1/4 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl float-animation" />
    </div>

    <div class="relative z-10">
      <ContentRenderer :value="page" />
    </div>
  </main>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('about-page', () => queryCollection('pages').where('slug', '=', 'about').first())

useHead(() => ({
  title: page.value?.title || 'About',
  meta: [
    { name: 'description', content: page.value?.description || '' }
  ]
}))
</script>