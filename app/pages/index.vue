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
                  The LCP image. NuxtImg's `sizes` can't express "the viewport minus the page and card
                  padding", so it picked a 900w file for a 330 px slot. The srcset is built by hand
                  from the same ipx provider and `sizes` states the real slot widths (see heroSrcset).
                -->
                <img
                  v-if="heroCard.image"
                  :src="heroSrcset.src"
                  :srcset="heroSrcset.srcset"
                  :sizes="HERO_SIZES"
                  width="1200"
                  height="675"
                  :alt="heroCard.imageAlt || ''"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  class="object-cover w-full h-full"
                >
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

        <section
          v-if="projectsSection"
          id="projects"
          class="max-w-6xl mx-auto mt-24"
          aria-labelledby="projects-title"
        >
          <div class="mb-16 text-center">
            <h2
              v-if="projectsSection.title"
              id="projects-title"
              class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated"
            >
              {{ projectsSection.title }}
            </h2>
            <p v-if="projectsSection.description" class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
              {{ projectsSection.description }}
            </p>
          </div>
          <UPageGrid v-if="featuredProjects && featuredProjects.length > 0" class="mt-12">
            <UBlogPost
              v-for="(project, index) in featuredProjects"
              :key="project.path || index"
              :title="project.title"
              :image="project.image ? { ...CARD_IMAGE, src: project.image, alt: project.imageAlt || project.title } : undefined"
              :to="`/projects/${project.slug}/`"
              variant="soft"
              class="glass-accent hover:scale-105 transition-transform min-h-[400px]"
            >
              <template v-if="!project.image" #header>
                <CardImageFallback :title="project.title" icon="i-lucide-folder-code" />
              </template>
              <template #description>
                <AwardBadge v-if="project.award" :award="project.award" class="mb-3" />
                <p class="text-base text-pretty text-muted mb-3">{{ project.description }}</p>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    v-for="(tech, techIndex) in project.technologies?.slice(0, 3)"
                    :key="techIndex"
                    color="primary"
                    variant="soft"
                    size="sm"
                  >
                    {{ tech }}
                  </UBadge>
                </div>
              </template>
            </UBlogPost>
          </UPageGrid>

          <div v-else class="py-12 text-center">
            <UIcon name="i-lucide-folder" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" aria-hidden="true" />
            <p class="text-muted text-lg">Featured projects coming soon...</p>
          </div>

          <div v-if="projectsSection.cta" class="mt-12 text-center">
            <UButton
              :to="projectsSection.cta.to"
              color="primary"
              variant="magnet"
              size="lg"
              trailing-icon="i-lucide-arrow-right"
            >
              {{ projectsSection.cta.label }}
            </UButton>
          </div>
        </section>

        <UCard
          v-if="skillsSection"
          class="max-w-6xl mx-auto mt-24 glass-accent"
          aria-labelledby="skills-title"
        >
          <div class="mb-16 text-center">
            <h2
              v-if="skillsSection.title"
              id="skills-title"
              class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated"
            >
              {{ skillsSection.title }}
            </h2>
            <p v-if="skillsSection.description" class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
              {{ skillsSection.description }}
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div
              v-for="item in skillsItems"
              :key="item.title"
              class="text-center group"
            >
              <div class="w-20 h-20 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <UIcon :name="item.icon || 'i-lucide-monitor'" class="w-10 h-10 text-primary" />
              </div>
              <h3 class="font-semibold text-default mb-2">{{ item.title }}</h3>
              <p class="text-sm text-muted">{{ item.description }}</p>
            </div>
          </div>
        </UCard>

        <section
          v-if="blogSection"
          id="blog"
          class="max-w-6xl mx-auto mt-24"
          aria-labelledby="blog-title"
        >
          <div class="mb-16 text-center">
            <h2
              v-if="blogSection.title"
              id="blog-title"
              class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated"
            >
              {{ blogSection.title }}
            </h2>
            <p v-if="blogSection.description" class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
              {{ blogSection.description }}
            </p>
          </div>

          <div v-if="recentPosts && recentPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <UBlogPost
              v-for="post in recentPosts"
              :key="post.slug || post.path"
              :title="post.title"
              :description="post.description"
              :date="post.date"
              :image="post.featured_image ? { ...CARD_IMAGE, src: post.featured_image, alt: post.title } : undefined"
              :to="`/blog/${post.slug || post.path?.split('/').pop()}/`"
              variant="outline"
              orientation="vertical"
              class="glass-accent hover:scale-105 transition-transform"
            >
              <template #date>{{ formatContentDate(post.date) }}</template>
              <template v-if="!post.featured_image" #header>
                <CardImageFallback :title="post.title" icon="i-lucide-book-open" />
              </template>
            </UBlogPost>
          </div>

          <div v-else class="py-12 text-center">
            <UIcon name="i-lucide-book-open" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" aria-hidden="true" />
            <p class="text-muted text-lg">Blog posts coming soon...</p>
          </div>

          <div v-if="blogSection.cta" class="mt-12 text-center">
            <UButton
              :to="blogSection.cta.to"
              color="primary"
              variant="magnet"
              size="lg"
              trailing-icon="i-lucide-arrow-right"
            >
              {{ blogSection.cta.label }}
            </UButton>
          </div>
        </section>

        <div v-if="ctaSection" class="max-w-4xl mx-auto mt-24 mb-16">
          <div class="glass-accent rounded-xl p-8 md:p-12 text-center hover-lift">
            <h2 v-if="ctaSection.title" class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated">
              {{ ctaSection.title }}
            </h2>
            <p v-if="ctaSection.description" class="text-xl md:text-2xl text-default max-w-2xl mx-auto mb-8">
              {{ ctaSection.description }}
            </p>
            <div v-if="ctaSection.buttons?.length" class="flex flex-col sm:flex-row gap-4 justify-center">
              <UButton
                v-for="button in ctaSection.buttons"
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
              >
                {{ button.label }}
              </UButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  </UPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps } from '@nuxt/ui'
import { useContent } from '~/composables/useContent'
import AwardBadge from '~/components/common/AwardBadge.vue'
import CardImageFallback from '~/components/common/CardImageFallback.vue'
import { formatContentDate } from '~/utils/formatContentDate'

const { fetchProjects, fetchBlogPosts, fetchPage } = useContent()

// Project and post cards below the fold: a 16:9 box (no layout shift), lazy, and
// width-based srcset for the 1/2/3-column grids inside the max-w-6xl column.
const CARD_IMAGE = {
  width: 640,
  height: 360,
  sizes: 'xs:92vw sm:48vw lg:368px',
  loading: 'lazy',
  decoding: 'async'
} as const

// Slot width of the hero image: the viewport minus the section padding (24px a side) and the card
// (1px border + 16px padding below 640px, 24px from 640px), capped at the 896px section width.
const HERO_SIZES = '(max-width: 639px) calc(100vw - 82px), (max-width: 943px) calc(100vw - 98px), 846px'
const HERO_WIDTHS = [480, 640, 846, 1200]

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
const $img = useImage()
const heroSrcset = computed(() => {
  const src = heroCard.value?.image
  if (!src) return { src: undefined, srcset: undefined }
  return {
    src: $img(src, { width: 846, quality: 80 }),
    srcset: HERO_WIDTHS.map(w => `${$img(src, { width: w, quality: 80 })} ${w}w`).join(', ')
  }
})
const quickLinks = computed(() => page.value?.quickLinks?.links ?? [])
const projectsSection = computed(() => page.value?.projects ?? null)
const skillsSection = computed(() => page.value?.skills ?? null)
const skillsItems = computed(() => skillsSection.value?.items ?? [])
const blogSection = computed(() => page.value?.blog ?? null)
const ctaSection = computed(() => page.value?.cta ?? null)

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
