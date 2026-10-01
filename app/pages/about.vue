<template>
  <div class="min-h-screen bg-gradient-animated bg-dots relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;" />
    </div>

    <div class="relative z-10">
      <!-- Hero -->
      <section v-if="hero" class="pt-16 pb-12 md:pt-24 md:pb-16">
        <div class="container max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16 items-center">
            <div>
              <div v-if="heroImage" class="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 xl:w-80 xl:h-80">
                <div class="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-pink-500 to-purple-600 animate-spin-slow opacity-20" />
                <div class="absolute inset-4 rounded-full bg-gradient-to-l from-primary via-purple-600 to-pink-500 animate-spin-reverse opacity-20" />
                <div class="relative w-full h-full rounded-full overflow-hidden glass-accent p-2">
                  <NuxtImg
                    :src="heroImage.src"
                    :alt="heroImage.alt || hero.title"
                    class="w-full h-full rounded-full object-cover"
                    loading="eager"
                    fetchpriority="high"
                    preset="avatar"
                  />
                </div>
              </div>

              <p
                v-if="heroImage?.status"
                class="mt-6 mx-auto w-fit max-w-full glass-strong px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-center"
              >
                <span class="w-2.5 h-2.5 shrink-0 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
                <span>{{ heroImage.status }}</span>
              </p>

              <ul v-if="heroStats.length" class="grid grid-cols-3 gap-3 mt-6 max-w-md mx-auto">
                <li
                  v-for="stat in heroStats"
                  :key="stat.label"
                  class="glass-accent rounded-xl px-2 py-3 text-center"
                >
                  <span class="block text-xl sm:text-2xl font-bold text-primary leading-tight">{{ stat.value }}</span>
                  <span class="block text-xs sm:text-sm text-muted leading-snug mt-1">{{ stat.label }}</span>
                </li>
              </ul>
            </div>

            <div class="space-y-5">
              <h1 v-if="hero.title" class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-animated leading-tight">
                {{ hero.title }}
              </h1>
              <p v-if="hero.subtitle" class="text-lg sm:text-xl lg:text-2xl text-highlighted leading-snug">
                {{ hero.subtitle }}
              </p>
              <p
                v-for="(paragraph, index) in heroParagraphs"
                :key="index"
                class="text-base md:text-lg text-default leading-relaxed max-w-prose"
              >
                {{ paragraph }}
              </p>
              <p v-if="heroAward">
                <NuxtLink
                  :to="heroAward.to"
                  class="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm md:text-base font-semibold text-highlighted hover:bg-primary/20 transition-colors"
                >
                  <span aria-hidden="true">🏆</span>
                  <span>{{ heroAward.label }}</span>
                </NuxtLink>
              </p>

              <div v-if="heroButtons.length" class="flex flex-wrap gap-4 pt-2">
                <UButton
                  v-for="button in heroButtons"
                  :key="button.label"
                  :to="button.to"
                  :href="button.href"
                  :target="button.external ? '_blank' : undefined"
                  :rel="button.external ? 'noopener noreferrer' : undefined"
                  :variant="(button.variant || 'solid') as ButtonProps['variant']"
                  :color="(button.color || 'primary') as ButtonProps['color']"
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
      </section>

      <!-- Journey: vertical on small screens, horizontal from xl. The dot sits
           in the <li> (not the card), at the same offset as the line. -->
      <section v-if="journey && journeyItems.length" class="py-12 md:py-16" aria-labelledby="journey-title">
        <div class="container max-w-7xl mx-auto px-6">
          <h2 id="journey-title" class="text-3xl sm:text-4xl font-bold mb-10 text-center text-gradient-animated leading-tight">
            {{ journey.title }}
          </h2>

          <div class="relative max-w-2xl mx-auto xl:max-w-none">
            <div
              data-timeline-line
              aria-hidden="true"
              class="absolute left-4 top-2 bottom-2 w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary via-purple-500 to-pink-500 opacity-50 xl:left-0 xl:right-0 xl:top-4 xl:bottom-auto xl:h-0.5 xl:w-auto xl:translate-x-0 xl:-translate-y-1/2 xl:bg-gradient-to-r"
            />
            <ol class="relative grid gap-6 xl:gap-5 xl:grid-flow-col xl:auto-cols-fr">
              <li
                v-for="item in journeyItems"
                :key="item.title"
                class="relative pl-12 xl:pl-0 xl:pt-12"
              >
                <span
                  data-timeline-dot
                  aria-hidden="true"
                  class="absolute left-4 top-6 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full ring-4 ring-[var(--ui-bg)] xl:left-1/2 xl:top-4"
                  :class="timelineBulletClass(item.color)"
                />
                <article class="glass-accent rounded-xl p-5 h-full">
                  <p v-if="item.period" class="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                    {{ item.period }}
                  </p>
                  <h3 class="flex items-center gap-2 text-lg font-bold mb-2" :class="timelineTextClass(item.color)">
                    <UIcon v-if="item.icon" :name="item.icon" class="w-5 h-5 shrink-0" aria-hidden="true" />
                    {{ item.title }}
                  </h3>
                  <p class="text-sm md:text-base text-default leading-relaxed">
                    {{ item.description }}
                  </p>
                </article>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <!-- Now -->
      <section v-if="now" class="py-12 md:py-16" aria-labelledby="now-title">
        <div class="container max-w-7xl mx-auto px-6">
          <div class="glass-accent rounded-2xl p-6 md:p-10 grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-12">
            <div class="space-y-4">
              <h2 id="now-title" class="text-3xl sm:text-4xl font-bold text-gradient-animated leading-tight">
                {{ now.title }}
              </h2>
              <p class="text-base md:text-lg text-default leading-relaxed">
                {{ now.description }}
              </p>
              <p v-if="now.award">
                <NuxtLink
                  :to="now.award.to"
                  class="inline-flex items-center gap-2 text-sm md:text-base font-semibold text-primary hover:underline"
                >
                  <span aria-hidden="true">🏆</span>
                  {{ now.award.label }}
                  <UIcon name="i-lucide-arrow-right" class="w-4 h-4" aria-hidden="true" />
                </NuxtLink>
              </p>
            </div>

            <ul v-if="nowProjects.length" class="grid gap-3 sm:grid-cols-2" aria-label="Current projects">
              <li v-for="project in nowProjects" :key="project.to">
                <NuxtLink
                  :to="project.to"
                  class="group block h-full rounded-xl glass-strong p-4 hover:ring-1 hover:ring-primary/50 transition"
                >
                  <span class="flex items-center justify-between gap-2 font-semibold text-highlighted group-hover:text-primary transition-colors">
                    {{ project.title }}
                    <UIcon name="i-lucide-arrow-right" class="w-4 h-4 shrink-0 opacity-60 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </span>
                  <span class="block text-sm text-muted leading-snug mt-1">{{ project.description }}</span>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Skills -->
      <section v-if="skills && skillCategories.length" class="py-12 md:py-16" aria-labelledby="skills-title">
        <div class="container max-w-7xl mx-auto px-6">
          <h2 id="skills-title" class="text-3xl sm:text-4xl font-bold mb-10 text-center text-gradient-animated">
            {{ skills.title }}
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              v-for="category in skillCategories"
              :key="category.title"
              class="glass-strong rounded-xl p-5 h-full"
            >
              <h3 class="flex items-center gap-3 text-lg font-bold mb-4" :class="accentTextClass(category.color)">
                <span class="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center" :class="accentBgClass(category.color)">
                  <UIcon :name="category.icon || 'i-lucide-monitor'" class="w-5 h-5" aria-hidden="true" />
                </span>
                {{ category.title }}
              </h3>
              <ul class="flex flex-wrap gap-2">
                <li
                  v-for="item in category.items"
                  :key="item"
                  class="text-sm text-default rounded-full border border-default px-3 py-1"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Outside of code -->
      <section v-if="life && lifeCards.length" class="py-12 md:py-16" aria-labelledby="life-title">
        <div class="container max-w-7xl mx-auto px-6">
          <div class="text-center mb-10">
            <h2 id="life-title" class="text-3xl sm:text-4xl font-bold text-gradient-animated">
              {{ life.title }}
            </h2>
            <p v-if="life.description" class="mt-3 text-muted">{{ life.description }}</p>
          </div>

          <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <li
              v-for="card in lifeCards"
              :key="card.title"
              :class="card.featured ? 'sm:row-span-2' : ''"
            >
              <component
                :is="card.to ? NuxtLinkComponent : 'article'"
                :to="card.to"
                class="group glass-accent rounded-xl overflow-hidden flex flex-col h-full"
                :class="card.to ? 'hover:ring-1 hover:ring-primary/50 transition' : ''"
              >
                <div
                  v-if="card.image"
                  class="relative overflow-hidden"
                  :class="card.featured ? 'aspect-[4/5] sm:aspect-auto sm:flex-1 sm:min-h-72' : 'aspect-video'"
                >
                  <NuxtImg
                    :src="card.image"
                    :alt="card.alt || ''"
                    class="absolute inset-0 w-full h-full object-cover"
                    :style="card.imagePosition ? { objectPosition: card.imagePosition } : undefined"
                    loading="lazy"
                    sizes="xs:100vw sm:50vw lg:420px"
                  />
                </div>
                <div class="p-5">
                  <h3 class="flex items-center gap-2 text-lg font-bold mb-1.5" :class="accentTextClass(card.color)">
                    <UIcon v-if="card.icon" :name="card.icon" class="w-5 h-5 shrink-0" aria-hidden="true" />
                    {{ card.title }}
                    <UIcon v-if="card.to" name="i-lucide-arrow-right" class="w-4 h-4 ml-auto opacity-60 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </h3>
                  <p class="text-sm md:text-base text-muted leading-relaxed">
                    {{ card.description }}
                  </p>
                </div>
              </component>
            </li>
          </ul>
        </div>
      </section>

      <!-- CTA -->
      <section v-if="cta" class="py-12 md:py-20">
        <div class="container max-w-4xl mx-auto px-6">
          <div class="glass-accent rounded-2xl text-center p-8 md:p-12">
            <h2 v-if="cta.title" class="text-3xl sm:text-4xl font-bold mb-4 text-gradient-animated">
              {{ cta.title }}
            </h2>
            <p v-if="cta.description" class="text-lg md:text-xl text-default mb-8 max-w-2xl mx-auto">
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
                :variant="(button.variant || 'solid') as ButtonProps['variant']"
                :color="(button.color || 'primary') as ButtonProps['color']"
                :size="(button.size || 'md') as ButtonProps['size']"
                :leading-icon="button.icon && button.iconPosition !== 'trailing' ? button.icon : undefined"
                :trailing-icon="button.icon && button.iconPosition === 'trailing' ? button.icon : undefined"
              >
                {{ button.label }}
              </UButton>
            </div>

            <div v-if="ctaSocials.length" class="flex justify-center gap-4">
              <a
                v-for="social in ctaSocials"
                :key="social.label"
                :href="social.href"
                :target="social.href.startsWith('http') ? '_blank' : undefined"
                :rel="social.href.startsWith('http') ? 'noopener noreferrer' : undefined"
                class="w-12 h-12 glass-strong rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors group"
                :aria-label="social.label"
              >
                <UIcon :name="social.icon || 'i-lucide-link'" class="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import type { ButtonProps } from '@nuxt/ui'
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
}

type AwardLink = {
  label: string
  to: string
}

type AboutSeo = {
  title: string
  description: string
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
  award?: AwardLink
  buttons?: ButtonLink[]
}

type JourneyItem = {
  title: string
  period?: string
  color?: string
  icon?: string
  description: string
}

type JourneySection = {
  title?: string
  items?: JourneyItem[]
}

type NowProject = {
  title: string
  to: string
  description: string
}

type NowSection = {
  title: string
  description: string
  award?: AwardLink
  projects?: NowProject[]
}

type SkillCategory = {
  title: string
  color?: string
  icon?: string
  items: string[]
}

type SkillsSection = {
  title?: string
  categories?: SkillCategory[]
}

type LifeCard = {
  title: string
  color?: string
  icon?: string
  image?: string
  alt?: string
  imagePosition?: string
  to?: string
  featured?: boolean
  description: string
}

type LifeSection = {
  title?: string
  description?: string
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
  now?: NowSection
  skills?: SkillsSection
  life?: LifeSection
  cta?: CtaSection
}

const NuxtLinkComponent = resolveComponent('NuxtLink')

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
const heroAward = computed<AwardLink | null>(() => hero.value?.award ?? null)
const heroButtons = computed<ButtonLink[]>(() => hero.value?.buttons ?? [])
const journey = computed<JourneySection | null>(() => page.value?.journey ?? null)
const journeyItems = computed<JourneyItem[]>(() => journey.value?.items ?? [])
const now = computed<NowSection | null>(() => page.value?.now ?? null)
const nowProjects = computed<NowProject[]>(() => now.value?.projects ?? [])
const skills = computed<SkillsSection | null>(() => page.value?.skills ?? null)
const skillCategories = computed<SkillCategory[]>(() => skills.value?.categories ?? [])
const life = computed<LifeSection | null>(() => page.value?.life ?? null)
const lifeCards = computed<LifeCard[]>(() => life.value?.cards ?? [])
const cta = computed<CtaSection | null>(() => page.value?.cta ?? null)
const ctaButtons = computed<ButtonLink[]>(() => cta.value?.buttons ?? [])
const ctaSocials = computed<CtaSocial[]>(() => cta.value?.socials ?? [])

// Accent colors used by the YAML `color` fields. Full class names are listed so
// Tailwind can see them.
type AccentKey = 'primary' | 'purple-500' | 'pink-500' | 'yellow-500'

const accentStyles: Record<AccentKey, { text: string; bg: string; bullet: string }> = {
  'primary': { text: 'text-primary', bg: 'bg-primary/10', bullet: 'bg-primary' },
  'purple-500': { text: 'text-purple-500', bg: 'bg-purple-500/10', bullet: 'bg-purple-500' },
  'pink-500': { text: 'text-pink-500', bg: 'bg-pink-500/10', bullet: 'bg-pink-500' },
  'yellow-500': { text: 'text-yellow-500', bg: 'bg-yellow-500/10', bullet: 'bg-yellow-500' }
}

const getAccent = (color?: string) =>
  accentStyles[(color ?? 'primary') as AccentKey] ?? accentStyles.primary

const accentTextClass = (color?: string) => getAccent(color).text
const accentBgClass = (color?: string) => getAccent(color).bg
const timelineTextClass = accentTextClass
const timelineBulletClass = (color?: string) => getAccent(color).bullet

useSiteSeo(() => ({
  title: seo.value?.title || 'About Allison Coleman',
  description: seo.value?.description
    || 'About Allison Coleman: software engineer building agent systems, developer tools, and languages/runtimes.',
  type: 'profile',
  jsonLd: {
    '@type': 'ProfilePage',
    'url': absoluteSiteUrl('/about/'),
    'mainEntity': personSchema()
  }
}))
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

@media (prefers-reduced-motion: reduce) {
  .animate-spin-slow,
  .animate-spin-reverse {
    animation: none;
  }
}
</style>
