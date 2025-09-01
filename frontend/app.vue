<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
// Set meta tags
useHead({
  title: "Allison's Portfolio",
  meta: [
    { name: 'description', content: "Allison's portfolio website for development and creative work" },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#FF69B4' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
});
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
