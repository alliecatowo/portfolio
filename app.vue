<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

const siteConfig = useSiteConfig();

// Set meta tags based on site configuration
useHead(() => ({
  title: siteConfig.value?.title || 'Allison\'s Portfolio',
  meta: [
    { name: 'description', content: siteConfig.value?.description || 'Allison\'s dual portfolio website for development and tattoo art' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#FF69B4' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
}));
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
