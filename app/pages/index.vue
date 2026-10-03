<template>
  <UPage>
    <div class="min-h-screen bg-gradient-animated bg-dots flex items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl pulse-glow" />
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse float-animation" style="animation-delay: 2s;" />
        <div class="absolute top-72 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl float-animation" style="animation-delay: 4s;" />
        <div class="absolute top-[44rem] right-1/3 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl sparkle-element" style="animation-delay: 1s;" />
      </div>

      <section class="container max-w-5xl px-6 py-20 relative z-20" aria-labelledby="page-title">
        <header v-if="hero" class="text-center mb-16 relative z-30">
          <h1
            v-if="hero.title"
            id="page-title"
            class="text-5xl md:text-6xl font-bold mb-6 text-gradient-animated relative z-40"
            style="isolation: isolate;"
          >
            {{ hero.title }}
          </h1>
          <p v-if="hero.description" class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
            {{ hero.description }}
          </p>
          <p v-if="heroAward" class="mt-6">
            <NuxtLink
              :to="heroAward.to"
              class="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm md:text-base font-semibold text-highlighted hover:bg-primary/20 transition-colors"
            >
              <span aria-hidden="true">🏆</span>
              <span>{{ heroAward.label }}</span>
            </NuxtLink>
          </p>
          <div v-if="heroNote?.keys?.length" class="mt-8 text-sm text-muted" role="note" aria-label="Keyboard shortcut">
            <span class="inline-flex items-center gap-2">
              <span v-if="heroNote.prefix">{{ heroNote.prefix }}</span>
              <kbd
                v-for="key in heroNote.keys"
                :key="key"
                class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
              >
                {{ key }}
              </kbd>
              <span v-if="heroNote.suffix">{{ heroNote.suffix }}</span>
            </span>
          </div>
        </header>

        <section class="max-w-4xl mx-auto" aria-labelledby="showcase-title">
          <h2 id="showcase-title" class="sr-only">Developer Showcase</h2>

          <!-- Static, link-only blocks: hydrate on first interaction so load-time hydration stays short -->
          <LazyHomeHeroCard v-if="heroCard" hydrate-on-interaction :hero-card="heroCard" />

          <LazyHomeQuickLinks hydrate-on-interaction :links="quickLinks" />
        </section>

        <LazyHomeBelowFold
          hydrate-on-visible
          :page="page"
          :featured-projects="featuredProjects"
          :recent-posts="recentPosts"
        />
      </section>
    </div>
  </UPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useContent } from '~/composables/useContent'

const { fetchProjects, fetchBlogPosts, fetchPage } = useContent()

const { data: homeContent } = await useAsyncData('home-page-content', () => fetchPage('home'))

const page = computed(() => homeContent.value ?? null)
const seo = computed(() => page.value?.seo)
const hero = computed(() => page.value?.hero ?? null)
const heroAward = computed(() => hero.value?.award ?? null)
const heroNote = computed(() => hero.value?.note ?? null)
const heroCard = computed(() => hero.value?.card ?? null)
const quickLinks = computed(() => page.value?.quickLinks?.links ?? [])

const { data: featuredProjects } = await useAsyncData(
  'home-featured-projects',
  () => fetchProjects(6, true)
)

const { data: recentPosts } = await useAsyncData(
  'home-recent-posts',
  () => fetchBlogPosts(3)
)

useSiteSeo(() => ({
  title: seo.value?.title || 'Allison Coleman: agent systems, developer tools & WebMCP',
  description: seo.value?.description
    || 'Allison Coleman: software engineer building agent systems, developer tools, and languages/runtimes.',
  path: '/',
  jsonLd: [personSchema(), websiteSchema()]
}))
</script>
