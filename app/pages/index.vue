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

          <UCard v-if="heroCard" class="glass-accent mb-12">
            <template #header>
              <div class="aspect-[16/9] md:aspect-[21/9] bg-gradient-dev relative overflow-hidden rounded-lg">
                <!--
                  The LCP image. NuxtImg builds the srcset from `sizes` and image.screens/densities in
                  nuxt.config.ts: the slot is the card, i.e. the viewport minus the page and card padding
                  below 944px, and 846px (the section width minus the padding) above it.
                -->
                <NuxtImg
                  v-if="heroCard.image"
                  :src="heroCard.image"
                  sizes="xs:80vw sm:88vw lg:846px"
                  width="1200"
                  height="675"
                  :alt="heroCard.imageAlt || ''"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  class="object-cover w-full h-full"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end p-4 md:p-8">
                  <div class="w-full">
                    <h3 v-if="heroCard.title" id="main-dev-title" class="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-3 [text-shadow:0_1px_3px_rgb(0_0_0/0.6)]">
                      {{ heroCard.title }}
                    </h3>
                    <p v-if="heroCard.description" class="text-white text-sm md:text-xl max-w-2xl [text-shadow:0_1px_3px_rgb(0_0_0/0.6)]">
                      {{ heroCard.description }}
                    </p>
                  </div>
                </div>
              </div>
            </template>

            <p v-if="heroCard.introduction" id="main-dev-description" class="text-default text-lg mb-8">
              {{ heroCard.introduction }}
            </p>

            <div v-if="heroCard.badges?.length" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div v-for="badge in heroCard.badges" :key="badge.title">
                <h4 class="font-semibold text-default mb-3">{{ badge.title }}</h4>
                <ul class="flex flex-wrap gap-2">
                  <li v-for="item in badge.items" :key="item">
                    <UBadge color="primary" variant="soft">{{ item }}</UBadge>
                  </li>
                </ul>
              </div>
            </div>

            <template #footer>
              <div v-if="heroCard.buttons?.length" class="flex flex-col sm:flex-row gap-4">
                <UButton
                  v-for="button in heroCard.buttons"
                  :key="button.label"
                  :to="button.to"
                  :href="button.href"
                  :target="button.external ? '_blank' : undefined"
                  :rel="button.external ? 'noopener noreferrer' : undefined"
                  :download="resolveDownloadAttr(button)"
                  :color="(button.color || 'primary') as ButtonProps['color']"
                  :variant="(button.variant || 'solid') as ButtonProps['variant']"
                  :size="(button.size || 'md') as ButtonProps['size']"
                  :leading-icon="button.icon && button.iconPosition !== 'trailing' ? button.icon : undefined"
                  :trailing-icon="button.icon && button.iconPosition === 'trailing' ? button.icon : undefined"
                  block
                  class="flex-1"
                >
                  {{ button.label }}
                </UButton>
              </div>
            </template>
          </UCard>

          <div v-if="quickLinks.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UPageCard
              v-for="link in quickLinks"
              :key="link.title"
              :title="link.title"
              :description="link.description"
              :icon="link.icon"
              :to="link.to"
              variant="soft"
              class="glass-accent hover:scale-105 transition-transform"
            />
          </div>
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
import type { ButtonProps } from '@nuxt/ui'
import { useContent } from '~/composables/useContent'

const { fetchProjects, fetchBlogPosts, fetchPage } = useContent()

const { data: homeContent } = await useAsyncData('home-page-content', () => fetchPage('home'))

const resolveDownloadAttr = (button: { download?: boolean | string; href?: string }) => {
  if (typeof button.download === 'string' && button.download.trim().length > 0) {
    return button.download
  }

  if (button.download) {
    const filename = button.href?.split('/').filter(Boolean).pop()
    return filename || undefined
  }

  return undefined
}

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
