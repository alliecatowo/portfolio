<template>
  <UPage>
    <UMain class="min-h-screen bg-gradient-animated bg-dots flex items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse pulse-glow" />
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse float-animation" style="animation-delay: 2s;" />
        <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl float-animation" style="animation-delay: 4s;" />
        <div class="absolute bottom-1/3 right-1/3 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl sparkle-element" style="animation-delay: 1s;" />
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
          <aside v-if="heroNote?.keys?.length" class="mt-8 text-sm text-muted" role="note" aria-label="Keyboard shortcut">
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
          </aside>
        </header>

        <section class="max-w-4xl mx-auto" aria-labelledby="showcase-title">
          <h2 id="showcase-title" class="sr-only">Developer Showcase</h2>

          <UCard v-if="heroCard" class="glass-accent mb-12">
            <template #header>
              <div class="aspect-[16/9] md:aspect-[21/9] bg-gradient-dev relative overflow-hidden rounded-lg">
                <NuxtImg
                  v-if="heroCard.image"
                  :src="heroCard.image"
                  :alt="heroCard.title"
                  loading="lazy"
                  preset="hero"
                  sizes="100vw lg:1200px"
                  class="object-cover w-full h-full mix-blend-overlay opacity-60"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                  <div class="w-full">
                    <h3 v-if="heroCard.title" id="main-dev-title" class="text-3xl md:text-4xl font-bold text-white mb-4">
                      {{ heroCard.title }}
                    </h3>
                    <p v-if="heroCard.description" class="text-white/90 text-lg md:text-xl max-w-2xl">
                      {{ heroCard.description }}
                    </p>
                  </div>
                </div>
                <div class="absolute top-6 right-6 flex gap-3" aria-hidden="true">
                  <div class="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center float-animation shadow-lg">
                    <UIcon name="i-lucide-code" class="w-6 h-6 text-primary" />
                  </div>
                  <div class="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center float-animation shadow-lg" style="animation-delay: 0.5s;">
                    <UIcon name="i-lucide-monitor" class="w-6 h-6 text-primary" />
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
                  :download="button.download"
                  :color="button.color || 'primary'"
                  :variant="button.variant || 'solid'"
                  :size="button.size || 'md'"
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

          <nav v-if="quickLinks.length" class="grid grid-cols-1 md:grid-cols-3 gap-6" role="navigation" aria-label="Quick navigation">
            <UCard
              v-for="link in quickLinks"
              :key="link.title"
              class="glass-accent hover:scale-105 transition-transform"
              :to="link.to?.startsWith('http') ? undefined : link.to"
              :href="link.to?.startsWith('http') ? link.to : undefined"
            >
              <div class="flex items-center gap-4 mb-3">
                <UIcon v-if="link.icon" :name="link.icon" class="w-5 h-5 text-primary" />
                <h3 class="font-semibold text-default">{{ link.title }}</h3>
              </div>
              <p class="text-muted text-sm">{{ link.description }}</p>
            </UCard>
          </nav>
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

          <UCarousel
            v-if="featuredProjects && featuredProjects.length > 0"
            :items="featuredProjects"
            :ui="{
              item: 'basis-full md:basis-1/2 lg:basis-1/3',
              container: 'gap-8',
              wrapper: 'mx-auto'
            }"
            arrows
            :prev="{ icon: 'i-lucide-chevron-left', size: 'sm', variant: 'outline' }"
            :next="{ icon: 'i-lucide-chevron-right', size: 'sm', variant: 'outline' }"
          >
            <template #default="{ item: project, index }">
              <UCard
                class="glass-accent hover:scale-105 transition-transform group"
                :to="`/projects/${project.slug || project.path?.split('/').pop()}`"
              >
                <template #header>
                  <div class="aspect-video bg-gradient-dev relative overflow-hidden rounded-lg">
                    <NuxtImg
                      preset="card"
                      :src="project.image || `https://picsum.photos/400/300?random=${index + 20}`"
                      :alt="project.title"
                      class="object-cover w-full h-full mix-blend-overlay opacity-70 group-hover:opacity-90 transition-opacity"
                      loading="lazy"
                      sizes="sm:100vw md:50vw lg:33vw"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <UIcon name="i-lucide-external-link" class="w-5 h-5 text-white" />
                    </div>
                  </div>
                </template>

                <h3 class="text-xl font-bold mb-3 text-default">
                  {{ project.title }}
                </h3>
                <p class="text-muted mb-4 line-clamp-2">
                  {{ project.description }}
                </p>

                <template #footer>
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
              </UCard>
            </template>
          </UCarousel>

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
              v-for="(post, index) in recentPosts"
              :key="post.slug || post.path"
              :title="post.title"
              :description="post.description"
              :date="post.date"
              :image="post.featured_image || `https://picsum.photos/400/300?random=${index + 30}`"
              :to="`/blog/${post.slug || post.path?.split('/').pop()}`"
              variant="outline"
              orientation="vertical"
              class="glass-accent hover:scale-105 transition-transform"
            />
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

        <aside v-if="ctaSection" class="max-w-4xl mx-auto mt-24 mb-16">
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
                :download="button.download"
                :color="button.color || 'primary'"
                :variant="button.variant || 'solid'"
                :size="button.size || 'md'"
                :leading-icon="button.icon && button.iconPosition !== 'trailing' ? button.icon : undefined"
                :trailing-icon="button.icon && button.iconPosition === 'trailing' ? button.icon : undefined"
              >
                {{ button.label }}
              </UButton>
            </div>
          </div>
        </aside>
      </section>
    </UMain>
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
const heroNote = computed(() => hero.value?.note ?? null)
const heroCard = computed(() => hero.value?.card ?? null)
const quickLinks = computed(() => page.value?.quickLinks?.links ?? [])
const projectsSection = computed(() => page.value?.projects ?? null)
const skillsSection = computed(() => page.value?.skills ?? null)
const skillsItems = computed(() => skillsSection.value?.items ?? [])
const blogSection = computed(() => page.value?.blog ?? null)
const ctaSection = computed(() => page.value?.cta ?? null)

const { data: featuredProjects } = await useAsyncData(
  'home-featured-projects',
  () => fetchProjects(3, true)
)

const { data: recentPosts } = await useAsyncData(
  'home-recent-posts',
  () => fetchBlogPosts(3)
)

useHead(() => {
  if (!seo.value) {
    return {}
  }

  const meta = [
    { name: 'description', content: seo.value.description },
    { property: 'og:title', content: seo.value.title },
    { property: 'og:description', content: seo.value.description }
  ]

  if (seo.value.keywords?.length) {
    meta.splice(1, 0, { name: 'keywords', content: seo.value.keywords.join(', ') })
  }

  return { title: seo.value.title, meta }
})
</script>
