<template>
  <UPage>
    <UMain class="min-h-screen bg-gradient-animated bg-dots relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse pulse-glow" />
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse float-animation" style="animation-delay: 2s;" />
        <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl float-animation" style="animation-delay: 4s;" />
        <div class="absolute bottom-1/3 right-1/3 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl sparkle-element" style="animation-delay: 1s;" />
      </div>

      <div class="relative z-20 py-20 md:py-32">
        <ContentRenderer v-if="page" :value="page" :data="{ featuredProjects: featuredProjects || [], recentPosts: recentPosts || [] }" />
      </div>
    </UMain>
  </UPage>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('home-page', () => queryCollection('pages').where('slug', '=', 'home').first())

const { data: featuredProjects } = await useAsyncData('featured-projects', () => queryCollection('projects').where('featured', '=', true).order('date', 'DESC').limit(6).all())

const { data: recentPosts } = await useAsyncData('recent-posts', () => queryCollection('blog').where('published', '=', true).order('date', 'DESC').limit(3).all())

useHead(() => ({
  title: page.value?.title || 'Home',
  meta: [
    { name: 'description', content: page.value?.description || '' }
  ]
}))
</script>