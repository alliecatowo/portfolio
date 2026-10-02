<script setup lang="ts">
// Never linked. It is prerendered only so the build can copy its HTML to 404.html: Nuxt renders
// /404.html itself as an empty client-side shell (no SSR), which leaves visitors without JavaScript,
// and crawlers, looking at a blank page. See the prerender:done hook in nuxt.config.ts.
useHead({
  title: 'Page not found – Allison Coleman',
  meta: [{ name: 'robots', content: 'noindex' }]
})
</script>

<template>
  <CommonErrorState :status-code="404" not-found @navigate="(path: string) => navigateTo(path)" />
</template>
