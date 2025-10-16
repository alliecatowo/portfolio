<template>
  <main class="min-h-screen bg-gradient-animated bg-dots relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;" />
      <div class="absolute top-1/3 right-1/4 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl float-animation" />
    </div>

    <div class="relative z-10">
      <div v-if="pending" class="container max-w-7xl mx-auto px-6 py-32">
        <div class="glass-accent rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-center">
          <UIcon name="i-lucide-loader-2" class="w-10 h-10 animate-spin text-primary" aria-hidden="true" />
          <p class="text-lg text-muted">Loading about page...</p>
        </div>
      </div>

      <section v-else-if="error" class="py-20">
        <div class="container max-w-4xl mx-auto px-6">
          <UCard class="glass-accent text-center border border-red-500/20">
            <UIcon name="i-lucide-alert-circle" class="h-16 w-16 mx-auto text-red-500 mb-6" />
            <h2 class="text-2xl font-bold mb-4 text-default">Something went wrong</h2>
            <p class="text-muted mb-6">{{ error?.message || 'Failed to load the about page content.' }}</p>
            <UButton color="primary" @click="refresh">Try Again</UButton>
          </UCard>
        </div>
      </section>

      <template v-else-if="aboutPage">
        <!-- Hero Section with Photo -->
        <section class="py-20 md:py-32">
          <div class="container max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div v-if="hero" class="relative">
                <div class="relative z-10">
                  <div v-if="hero.image" class="relative mx-auto w-80 h-80 md:w-96 md:h-96">
                    <div class="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-pink-500 to-purple-600 animate-spin-slow opacity-20" />
                    <div class="absolute inset-4 rounded-full bg-gradient-to-l from-primary via-purple-600 to-pink-500 animate-spin-reverse opacity-20" />

                    <div class="relative w-full h-full rounded-full overflow-hidden glass-accent p-2">
                      <NuxtImg
                        :src="hero.image"
                        :alt="hero.imageAlt || hero.heading"
                        class="w-full h-full rounded-full object-cover"
                        loading="eager"
                        preset="avatar"
                      />
                    </div>

                    <div v-if="hero.status" class="absolute bottom-4 right-4 glass-strong px-4 py-2 rounded-full flex items-center gap-2">
                      <span
                        class="w-3 h-3 rounded-full animate-pulse"
                        :class="hero.status.indicatorColorClass || 'bg-green-500'"
                      />
                      <span class="text-sm font-medium">{{ hero.status.label }}</span>
                    </div>
                  </div>

                  <div v-if="hero.stats?.length" class="grid grid-cols-3 gap-4 mt-8">
                    <UCard
                      v-for="stat in hero.stats"
                      :key="`${stat.label}-${stat.value}`"
                      class="text-center glass-accent hover:scale-105 transition-transform"
                    >
                      <div class="text-2xl font-bold text-primary">{{ stat.value }}</div>
                      <div class="text-sm text-muted">{{ stat.label }}</div>
                    </UCard>
                  </div>
                </div>
              </div>

              <div>
                <h1 v-if="hero?.heading" class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gradient-animated leading-tight">
                  {{ hero.heading }}
                </h1>
                <p v-if="hero?.subheading" class="text-lg sm:text-xl md:text-2xl lg:text-3xl text-default mb-6 leading-relaxed">
                  {{ hero.subheading }}
                </p>

                <div v-if="introduction.length" class="prose prose-lg text-default max-w-none">
                  <p
                    v-for="(paragraph, index) in introduction"
                    :key="`intro-${index}`"
                    class="mb-6 text-base md:text-lg leading-relaxed"
                  >
                    {{ paragraph }}
                  </p>
                </div>

                <div v-if="hero?.ctas?.length" class="flex flex-wrap gap-4">
                  <UButton
                    v-for="cta in hero.ctas"
                    :key="cta.label"
                    :to="cta.type === 'route' ? cta.to : undefined"
                    :href="cta.type === 'external' ? cta.href : undefined"
                    :target="cta.target"
                    :variant="cta.variant || (cta.type === 'external' ? 'ghost' : 'solid')"
                    :color="cta.color || 'primary'"
                    :size="cta.size || 'md'"
                    :leading-icon="cta.icon"
                    :download="cta.download ?? undefined"
                  >
                    {{ cta.label }}
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Journey Timeline -->
        <section v-if="journey" class="py-20 relative">
          <div class="container max-w-6xl mx-auto px-6">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-16 text-center text-gradient-animated leading-tight px-4">
              {{ journey.title }}
            </h2>

            <div class="relative">
              <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-purple-500 to-pink-500 opacity-20" />

              <div class="space-y-12">
                <div
                  v-for="(item, index) in journey.items"
                  :key="`${item.title}-${index}`"
                  class="flex items-center justify-center"
                >
                  <UCard
                    class="relative glass-accent max-w-2xl hover:scale-105 transition-transform"
                    :class="index === journey.items.length - 1 ? 'animate-pulse-subtle' : ''"
                  >
                    <div
                      class="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full border-4 border-white dark:border-gray-900"
                      :class="item.indicatorClass || 'bg-primary'"
                    />
                    <h3 class="text-xl font-bold mb-3" :class="item.titleClass || 'text-primary'">{{ item.title }}</h3>
                    <p class="text-default leading-relaxed">{{ item.description }}</p>
                  </UCard>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Skills Showcase -->
        <section v-if="skills" class="py-20 glass-accent">
          <div class="container max-w-7xl mx-auto px-6">
            <h2 class="text-4xl md:text-5xl font-bold mb-16 text-center text-gradient-animated">
              {{ skills.title }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div
                v-for="category in skills.categories"
                :key="category.title"
                class="group relative"
              >
                <div
                  class="absolute inset-0 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"
                  :class="category.gradientClass || 'bg-gradient-to-r from-primary to-purple-600'"
                />
                <div class="relative glass-strong rounded-xl p-6 h-full hover-lift">
                  <div
                    class="w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    :class="category.iconBackgroundClass || 'bg-primary/10'"
                  >
                    <UIcon :name="category.icon" class="w-8 h-8" :class="category.iconColorClass || 'text-primary'" />
                  </div>
                  <h3 class="text-xl font-bold mb-4" :class="category.titleClass || 'text-primary'">
                    {{ category.title }}
                  </h3>
                  <ul class="space-y-2 text-default">
                    <li
                      v-for="highlight in category.highlights"
                      :key="highlight"
                      class="flex items-center gap-2"
                    >
                      <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                      {{ highlight }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Personal Interests -->
        <section v-if="interests" class="py-20">
          <div class="container max-w-6xl mx-auto px-6">
            <h2 class="text-4xl md:text-5xl font-bold mb-16 text-center text-gradient-animated">
              {{ interests.title }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <UCard
                v-for="card in interests.cards"
                :key="card.title"
                class="glass-accent hover:scale-105 transition-transform overflow-hidden"
              >
                <template #header>
                  <div
                    class="aspect-video relative overflow-hidden rounded-lg"
                    :class="card.gradientClass || 'bg-gradient-to-br from-primary/20 to-purple-600/20'"
                  >
                    <NuxtImg
                      :src="card.image"
                      :alt="card.imageAlt"
                      class="w-full h-full object-cover mix-blend-overlay"
                      loading="lazy"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <UIcon :name="card.icon" class="absolute bottom-4 right-4 w-8 h-8 text-white/80" />
                  </div>
                </template>

                <h3 class="text-xl font-bold mb-2" :class="card.titleClass || 'text-primary'">{{ card.title }}</h3>
                <p class="text-muted">{{ card.description }}</p>
              </UCard>
            </div>
          </div>
        </section>

        <!-- Connect CTA -->
        <section v-if="closing" class="py-20">
          <div class="container max-w-4xl mx-auto px-6">
            <UCard class="glass-accent text-center hover:scale-105 transition-transform">
              <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated">
                {{ closing.title }}
              </h2>
              <p class="text-xl text-default mb-8 max-w-2xl mx-auto">
                {{ closing.description }}
              </p>

              <div v-if="closing.buttons?.length" class="flex flex-wrap gap-4 justify-center mb-8">
                <UButton
                  v-for="button in closing.buttons"
                  :key="button.label"
                  :to="button.type === 'route' ? button.to : undefined"
                  :href="button.type === 'external' ? button.href : undefined"
                  :variant="button.variant || (button.type === 'external' ? 'ghost' : 'solid')"
                  :color="button.color || 'primary'"
                  :size="button.size || 'md'"
                  :leading-icon="button.icon"
                  :target="button.target"
                >
                  {{ button.label }}
                </UButton>
              </div>

              <div v-if="closing.socialLinks?.length" class="flex justify-center gap-6">
                <a
                  v-for="link in closing.socialLinks"
                  :key="link.href"
                  :href="link.href"
                  class="w-12 h-12 glass-strong rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors group"
                  :aria-label="link.ariaLabel"
                  :target="link.href.startsWith('http') ? '_blank' : undefined"
                  :rel="link.href.startsWith('http') ? 'noopener noreferrer' : undefined"
                >
                  <UIcon :name="link.icon" class="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                </a>
              </div>
            </UCard>
          </div>
        </section>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type CTAButton = {
  label: string
  to?: string
  href?: string
  variant?: string
  color?: string
  size?: string
  icon?: string
  target?: string
  download?: boolean
  type?: 'route' | 'external'
}

type HeroSection = {
  heading: string
  subheading?: string
  image?: string
  imageAlt?: string
  status?: {
    label: string
    indicatorColorClass?: string
  }
  stats?: { label: string; value: string }[]
  ctas?: CTAButton[]
}

type JourneySection = {
  title: string
  items: {
    title: string
    description: string
    indicatorClass?: string
    titleClass?: string
  }[]
}

type SkillsSection = {
  title: string
  categories: {
    title: string
    icon: string
    gradientClass?: string
    iconBackgroundClass?: string
    iconColorClass?: string
    titleClass?: string
    highlights: string[]
  }[]
}

type InterestsSection = {
  title: string
  cards: {
    title: string
    description: string
    image: string
    imageAlt: string
    gradientClass?: string
    icon: string
    titleClass?: string
  }[]
}

type SocialLink = {
  label: string
  href: string
  icon: string
  ariaLabel: string
}

type ClosingSection = {
  title: string
  description: string
  buttons?: CTAButton[]
  socialLinks?: SocialLink[]
}

type SeoSection = {
  title?: string
  description?: string
  keywords?: string | string[]
}

type AboutContent = {
  title: string
  hero?: HeroSection
  introduction?: string[]
  journey?: JourneySection
  skills?: SkillsSection
  interests?: InterestsSection
  closing?: ClosingSection
  seo?: SeoSection
}

const { data: about, pending, error } = await useAsyncData<AboutContent | null>('about-page', () =>
  queryContent<AboutContent>('/about').findOne()
)

const aboutPage = computed(() => about.value)
const hero = computed(() => aboutPage.value?.hero)
const introduction = computed(() => aboutPage.value?.introduction ?? [])
const journey = computed(() => aboutPage.value?.journey)
const skills = computed(() => aboutPage.value?.skills)
const interests = computed(() => aboutPage.value?.interests)
const closing = computed(() => aboutPage.value?.closing)

const refresh = () => refreshNuxtData('about-page')

useSeoMeta(() => {
  const page = aboutPage.value
  const fallbackTitle = "About Me - Allison's Developer Portfolio"
  const fallbackDescription =
    "Learn about Allison - a passionate full-stack developer and tattoo artist blending creativity with technical expertise to craft delightful digital experiences."
  const keywords = page?.seo?.keywords
  const keywordContent = Array.isArray(keywords) ? keywords.join(', ') : keywords

  return {
    title: page?.seo?.title ?? fallbackTitle,
    ogTitle: page?.seo?.title ?? fallbackTitle,
    description: page?.seo?.description ?? fallbackDescription,
    ogDescription: page?.seo?.description ?? fallbackDescription,
    keywords: keywordContent ?? 'full-stack developer, web developer, Vue.js, Nuxt, TypeScript'
  }
})
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-spin-reverse {
  animation: spin-reverse 25s linear infinite;
}

@keyframes pulse-subtle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 3s ease-in-out infinite;
}

.float-animation {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
