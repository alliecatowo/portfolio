<template>
  <div>
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps } from '@nuxt/ui'
import AwardBadge from '~/components/common/AwardBadge.vue'
import CardImageFallback from '~/components/common/CardImageFallback.vue'
import { formatContentDate } from '~/utils/formatContentDate'

// Everything under the hero card. The home page mounts this with `hydrate-on-visible`: it is
// server-rendered like the rest, but its component tree (cards, buttons, links) only hydrates when
// it scrolls near the viewport, which keeps the first hydration task short.
/* eslint-disable @typescript-eslint/no-explicit-any */
const props = defineProps<{
  page: Record<string, any> | null
  featuredProjects: any[] | null | undefined
  recentPosts: any[] | null | undefined
}>()
/* eslint-enable @typescript-eslint/no-explicit-any */

// Project and post cards: a 16:9 box (no layout shift), lazy, and
// width-based srcset for the 1/2/3-column grids inside the max-w-6xl column.
const CARD_IMAGE = {
  width: 640,
  height: 360,
  sizes: 'xs:70vw sm:48vw lg:302px',
  loading: 'lazy',
  decoding: 'async'
} as const

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

const projectsSection = computed(() => props.page?.projects ?? null)
const skillsSection = computed(() => props.page?.skills ?? null)
const skillsItems = computed(() => skillsSection.value?.items ?? [])
const blogSection = computed(() => props.page?.blog ?? null)
const ctaSection = computed(() => props.page?.cta ?? null)
</script>
