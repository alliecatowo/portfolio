<template>
  <main class="min-h-screen bg-gradient-animated bg-dots relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;" />
      <div class="absolute top-1/3 right-1/4 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl float-animation" />
    </div>

    <div class="relative z-10">
      <section v-if="hero" class="py-20 md:py-32">
        <div class="container max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="relative">
              <div class="relative z-10">
                <div v-if="heroImage" class="relative mx-auto w-80 h-80 md:w-96 md:h-96">
                  <div class="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-pink-500 to-purple-600 animate-spin-slow opacity-20" />
                  <div class="absolute inset-4 rounded-full bg-gradient-to-l from-primary via-purple-600 to-pink-500 animate-spin-reverse opacity-20" />

                <div class="relative w-full h-full rounded-full overflow-hidden glass-accent p-2">
                  <NuxtImg
                    :src="heroImage.src"
                    :alt="heroImage.alt || hero.title"
                    class="w-full h-full rounded-full object-cover"
                    loading="eager"
                    preset="avatar"
                  />
                </div>

                <div
                  v-if="heroImage.status"
                  class="absolute bottom-4 right-4 glass-strong px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span class="text-sm font-medium">{{ heroImage.status }}</span>
                </div>
              </div>

                <div v-if="heroStats.length" class="grid grid-cols-3 gap-4 mt-8">
                  <UCard
                    v-for="stat in heroStats"
                    :key="stat.label"
                    class="text-center glass-accent hover:scale-105 transition-transform"
                  >
                    <div class="text-2xl font-bold text-primary">{{ stat.value }}</div>
                    <div class="text-sm text-muted">{{ stat.label }}</div>
                  </UCard>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <h1 v-if="hero.title" class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-animated leading-tight">
                {{ hero.title }}
              </h1>
              <p v-if="hero.subtitle" class="text-lg sm:text-xl md:text-2xl lg:text-3xl text-default leading-relaxed">
                {{ hero.subtitle }}
              </p>
              <div v-if="heroParagraphs.length" class="prose prose-lg text-default max-w-none">
                <p
                  v-for="(paragraph, index) in heroParagraphs"
                  :key="index"
                  class="mb-6 text-base md:text-lg leading-relaxed"
                >
                  {{ paragraph }}
                </p>
              </div>

              <div v-if="heroButtons.length" class="flex flex-wrap gap-4">
                <UButton
                  v-for="button in heroButtons"
                  :key="button.label"
                  :to="button.to"
                :href="button.href"
                :target="button.external ? '_blank' : undefined"
                :rel="button.external ? 'noopener noreferrer' : undefined"
                :download="resolveDownloadAttr(button)"
                :variant="button.variant || 'solid'"
                :color="button.color || 'primary'"
                :size="button.size || 'md'"
                :leading-icon="button.icon && button.iconPosition !== 'trailing' ? button.icon : undefined"
                :trailing-icon="button.icon && button.iconPosition === 'trailing' ? button.icon : undefined"
                >
                  {{ button.label }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="journey && journeyItems.length" class="py-20 relative">
        <div class="container max-w-6xl mx-auto px-6">
          <h2 v-if="journey.title" class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-16 text-center text-gradient-animated leading-tight px-4">
            {{ journey.title }}
          </h2>

          <div class="relative">
            <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-purple-500 to-pink-500 opacity-20" />

            <div class="space-y-12">
              <div v-for="item in journeyItems" :key="item.title" class="flex items-center justify-center">
                <UCard class="relative glass-accent max-w-2xl hover:scale-105 transition-transform" :class="timelineCardClass(item.color)">
                  <div
                    class="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full border-4 border-white dark:border-gray-900"
                    :class="timelineBulletClass(item.color)"
                  />
                  <h3 class="text-xl font-bold mb-3" :class="timelineTextClass(item.color)">
                    {{ item.title }}
                  </h3>
                  <p class="text-default leading-relaxed">
                    {{ item.description }}
                  </p>
                </UCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="skills && skillCategories.length" class="py-20 glass-accent">
        <div class="container max-w-7xl mx-auto px-6">
          <h2 v-if="skills.title" class="text-4xl md:text-5xl font-bold mb-16 text-center text-gradient-animated">
            {{ skills.title }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div
              v-for="category in skillCategories"
              :key="category.title"
              class="group relative"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"
                :class="skillGradientClass(category.color)"
              />
              <div class="relative glass-strong rounded-xl p-6 h-full hover-lift">
                <div
                  class="w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  :class="skillIconBackgroundClass(category.color)"
                >
                  <UIcon :name="category.icon || 'i-lucide-monitor'" class="w-8 h-8" :class="skillTextClass(category.color)" />
                </div>
                <h3 class="text-xl font-bold mb-4" :class="skillTextClass(category.color)">
                  {{ category.title }}
                </h3>
                <ul class="space-y-2 text-default">
                  <li
                    v-for="item in category.items"
                    :key="item"
                    class="flex items-center gap-2"
                  >
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="life && lifeCards.length" class="py-20">
        <div class="container max-w-6xl mx-auto px-6">
          <h2 v-if="life.title" class="text-4xl md:text-5xl font-bold mb-16 text-center text-gradient-animated">
            {{ life.title }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <UCard
              v-for="card in lifeCards"
              :key="card.title"
              class="glass-accent hover:scale-105 transition-transform overflow-hidden"
            >
              <template #header>
                <div class="aspect-video bg-gradient-to-br relative overflow-hidden rounded-lg">
                  <NuxtImg
                    v-if="card.image"
                    :src="card.image"
                    :alt="card.alt"
                    class="w-full h-full object-cover mix-blend-overlay"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <UIcon v-if="card.icon" :name="card.icon" class="absolute bottom-4 right-4 w-8 h-8 text-white/80" />
                </div>
              </template>

              <h3 class="text-xl font-bold mb-2" :class="lifeTextClass(card.color)">
                {{ card.title }}
              </h3>
              <p class="text-muted">
                {{ card.description }}
              </p>
            </UCard>
          </div>
        </div>
      </section>

      <section v-if="cta" class="py-20">
        <div class="container max-w-4xl mx-auto px-6">
          <UCard class="glass-accent text-center hover:scale-105 transition-transform">
            <h2 v-if="cta.title" class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated">
              {{ cta.title }}
            </h2>
            <p v-if="cta.description" class="text-xl text-default mb-8 max-w-2xl mx-auto">
              {{ cta.description }}
            </p>

            <div v-if="ctaButtons.length" class="flex flex-wrap gap-4 justify-center mb-8">
              <UButton
                v-for="button in ctaButtons"
                :key="button.label"
                :to="button.to"
                :href="button.href"
                :target="button.external ? '_blank' : undefined"
                :rel="button.external ? 'noopener noreferrer' : undefined"
                :download="resolveDownloadAttr(button)"
                :variant="button.variant || 'solid'"
                :color="button.color || 'primary'"
                :size="button.size || 'md'"
                :leading-icon="button.icon && button.iconPosition !== 'trailing' ? button.icon : undefined"
                :trailing-icon="button.icon && button.iconPosition === 'trailing' ? button.icon : undefined"
              >
                {{ button.label }}
              </UButton>
            </div>

            <div v-if="ctaSocials.length" class="flex justify-center gap-6">
              <a
                v-for="social in ctaSocials"
                :key="social.label"
                :href="social.href"
                target="_blank"
                rel="noopener noreferrer"
                class="w-12 h-12 glass-strong rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors group"
                :aria-label="social.label"
              >
                <UIcon :name="social.icon" class="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
              </a>
            </div>
          </UCard>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useContent } from '~/composables/useContent'

type ButtonLink = {
  label: string
  to?: string
  href?: string
  variant?: string
  color?: string
  size?: string
  icon?: string
  iconPosition?: 'leading' | 'trailing'
  external?: boolean
  download?: boolean | string
}

type AboutSeo = {
  title: string
  description: string
  keywords?: string[]
}

type HeroImage = {
  src: string
  alt?: string
  status?: string
}

type HeroStat = {
  label: string
  value: string
}

type HeroSection = {
  title?: string
  subtitle?: string
  image?: HeroImage
  stats?: HeroStat[]
  paragraphs?: string[]
  body?: string
  buttons?: ButtonLink[]
}

type JourneyItem = {
  title: string
  color?: string
  description: string
}

type JourneySection = {
  title?: string
  items?: JourneyItem[]
}

type SkillItem = {
  title: string
  description: string
  icon?: string
}

type SkillCategory = {
  title: string
  color?: string
  icon?: string
  items: string[]
}

type SkillsSection = {
  title?: string
  description?: string
  items?: SkillItem[]
  categories?: SkillCategory[]
}

type LifeCard = {
  title: string
  color?: string
  icon?: string
  image?: string
  alt?: string
  description: string
}

type LifeSection = {
  title?: string
  cards?: LifeCard[]
}

type CtaSocial = {
  label: string
  href: string
  icon?: string
}

type CtaSection = {
  title?: string
  description?: string
  buttons?: ButtonLink[]
  socials?: CtaSocial[]
}

type AboutPageContent = {
  seo?: AboutSeo
  hero?: HeroSection
  journey?: JourneySection
  skills?: SkillsSection
  life?: LifeSection
  cta?: CtaSection
}

const { fetchPage } = useContent()

const { data: aboutContent } = await useAsyncData<AboutPageContent | null>(
  'about-page-content',
  async () => (await fetchPage('about')) as AboutPageContent | null
)

const page = computed<AboutPageContent | null>(() => aboutContent.value ?? null)
const seo = computed<AboutSeo | undefined>(() => page.value?.seo)
const hero = computed<HeroSection | null>(() => page.value?.hero ?? null)
const heroImage = computed<HeroImage | null>(() => hero.value?.image ?? null)
const heroStats = computed<HeroStat[]>(() => hero.value?.stats ?? [])
const heroParagraphs = computed<string[]>(() => {
  if (hero.value?.body) {
    return hero.value.body
      .split(/\n{2,}/)
      .map((block: string) => block.trim())
      .filter((block: string) => Boolean(block))
  }
  return hero.value?.paragraphs ?? []
})
const heroButtons = computed<ButtonLink[]>(() => hero.value?.buttons ?? [])
const resolveDownloadAttr = (button: ButtonLink) => {
  if (typeof button.download === 'string' && button.download.trim().length > 0) {
    return button.download
  }

  if (button.download) {
    const filename = button.href?.split('/').filter(Boolean).pop()
    return filename || undefined
  }

  return undefined
}
const journey = computed<JourneySection | null>(() => page.value?.journey ?? null)
const journeyItems = computed<JourneyItem[]>(() => journey.value?.items ?? [])
const skills = computed<SkillsSection | null>(() => page.value?.skills ?? null)
const skillCategories = computed<SkillCategory[]>(() => skills.value?.categories ?? [])
const life = computed<LifeSection | null>(() => page.value?.life ?? null)
const lifeCards = computed<LifeCard[]>(() => life.value?.cards ?? [])
const cta = computed<CtaSection | null>(() => page.value?.cta ?? null)
const ctaButtons = computed<ButtonLink[]>(() => cta.value?.buttons ?? [])
const ctaSocials = computed<CtaSocial[]>(() => cta.value?.socials ?? [])

type TimelineStyleKey = 'default' | 'primary' | 'purple-500' | 'pink-500' | 'gradient'

const timelineStyles: Record<TimelineStyleKey, { text: string; bullet: string; card: string }> = {
  default: { text: 'text-primary', bullet: 'bg-primary', card: '' },
  primary: { text: 'text-primary', bullet: 'bg-primary', card: '' },
  'purple-500': { text: 'text-purple-500', bullet: 'bg-purple-500', card: '' },
  'pink-500': { text: 'text-pink-500', bullet: 'bg-pink-500', card: '' },
  gradient: {
    text: 'text-gradient',
    bullet: 'bg-gradient-to-r from-primary to-pink-500 animate-pulse',
    card: 'animate-pulse-subtle'
  }
} as const

const getTimelineStyle = (color?: string) =>
  timelineStyles[(color as TimelineStyleKey) ?? 'default'] ?? timelineStyles.default

type SkillStyleKey = 'default' | 'primary' | 'purple-500' | 'pink-500' | 'yellow-500'

const skillStyles: Record<SkillStyleKey, { text: string; iconBg: string; gradient: string }> = {
  default: {
    text: 'text-primary',
    iconBg: 'bg-primary/10',
    gradient: 'from-primary to-purple-600'
  },
  primary: {
    text: 'text-primary',
    iconBg: 'bg-primary/10',
    gradient: 'from-primary to-purple-600'
  },
  'purple-500': {
    text: 'text-purple-500',
    iconBg: 'bg-purple-500/10',
    gradient: 'from-purple-600 to-pink-500'
  },
  'pink-500': {
    text: 'text-pink-500',
    iconBg: 'bg-pink-500/10',
    gradient: 'from-pink-500 to-yellow-500'
  },
  'yellow-500': {
    text: 'text-yellow-500',
    iconBg: 'bg-yellow-500/10',
    gradient: 'from-yellow-500 to-primary'
  }
} as const

const getSkillStyle = (color?: string) =>
  skillStyles[(color as SkillStyleKey) ?? 'default'] ?? skillStyles.default

type LifeStyleKey = 'default' | 'primary' | 'purple-500' | 'pink-500' | 'yellow-500'

const lifeStyles: Record<LifeStyleKey, string> = {
  default: 'text-primary',
  primary: 'text-primary',
  'purple-500': 'text-purple-500',
  'pink-500': 'text-pink-500',
  'yellow-500': 'text-yellow-500'
} as const

const timelineTextClass = (color?: string) => getTimelineStyle(color).text

const timelineBulletClass = (color?: string) => getTimelineStyle(color).bullet

const timelineCardClass = (color?: string) => getTimelineStyle(color).card

const skillTextClass = (color?: string) => getSkillStyle(color).text

const skillIconBackgroundClass = (color?: string) => getSkillStyle(color).iconBg

const skillGradientClass = (color?: string) => `bg-gradient-to-r ${getSkillStyle(color).gradient}`

const lifeTextClass = (color?: string) =>
  lifeStyles[(color as LifeStyleKey) ?? 'default'] ?? lifeStyles.default

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
  0%, 100% {
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
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
