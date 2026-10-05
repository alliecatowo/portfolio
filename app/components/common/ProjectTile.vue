<template>
  <!--
    One project in the /projects bento grid, on UBlogPost: its stretched link
    makes the whole card clickable and the repo/demo icons sit above it (z-10).
    `sizes` (utils/packMosaic) says how big the tile is at the 2, 3 and 4
    column breakpoints of the page's UPageGrid: "wide" is col-span-2 with the
    image left, "bento" is 2x2 with the image growing to fill the height.
  -->
  <UBlogPost
    :title="project.title"
    :image="image"
    :to="`/projects/${project.slug}/`"
    :class="[
      'bg-elevated/40 ring-default/60 hover:bg-elevated/60 hover:ring-primary/60',
      feature && 'ring-primary/40 shadow-[0_10px_36px_rgba(236,72,153,0.12)]'
    ]"
    :ui="ui"
  >
    <template v-if="!project.image" #header>
      <CardImageFallback :title="project.title" icon="i-lucide-folder-code" />
    </template>

    <!-- Below sm (one column) the body matches BlogCard: roomier padding, larger type -->
    <template #body>
      <p v-if="groupLabel" class="mb-2 truncate text-[0.6875rem] font-medium uppercase tracking-wider text-primary/90">
        {{ groupLabel }}
      </p>

      <h3 class="text-xl font-semibold leading-snug text-pretty text-highlighted sm:text-base" :class="feature && 'sm:text-lg'">
        {{ project.title }}
      </h3>

      <AwardBadge v-if="project.award" :award="project.award" class="mt-2 self-start" />

      <p class="mt-2 max-sm:line-clamp-3 text-base text-pretty text-muted sm:text-sm" :class="feature ? 'sm:line-clamp-3' : 'sm:line-clamp-2'">
        {{ project.description }}
      </p>

      <div class="mt-auto flex items-end justify-between gap-2 pt-3">
        <ul v-if="techs.length" class="flex min-w-0 flex-wrap gap-1.5 sm:gap-1" aria-label="Technologies">
          <!-- One column shows 3 at most (a feature tile's 4th is hidden and counted in "+N") -->
          <li v-for="(tech, i) in techs" :key="tech" :class="i >= 3 && 'max-sm:hidden'">
            <UBadge variant="soft" size="sm" :label="tech" class="max-sm:px-2 max-sm:py-0.5 max-sm:text-xs sm:px-1.5 sm:py-0 sm:text-[0.6875rem]" />
          </li>
          <li v-if="moreTechs > 0" class="max-sm:hidden">
            <UBadge variant="soft" color="neutral" size="sm" :label="`+${moreTechs}`" class="max-sm:px-2 max-sm:py-0.5 max-sm:text-xs sm:px-1.5 sm:py-0 sm:text-[0.6875rem]" />
          </li>
          <li v-if="moreTechs + extraTechs > 0" class="sm:hidden">
            <UBadge variant="soft" color="neutral" size="sm" :label="`+${moreTechs + extraTechs}`" class="px-2 py-0.5 text-xs" />
          </li>
        </ul>
        <span v-else />

        <div class="relative z-10 flex shrink-0 items-center">
          <a
            v-for="link in links"
            :key="link.label"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-md p-1.5 text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
            :aria-label="`${link.label} of ${project.title}`"
            :title="link.label"
          >
            <UIcon :name="link.icon" class="block size-4" />
          </a>
        </div>
      </div>
    </template>
  </UBlogPost>
</template>

<script setup lang="ts">
import AwardBadge from '~/components/common/AwardBadge.vue'
import CardImageFallback from '~/components/common/CardImageFallback.vue'
import type { TileSize } from '~/utils/packMosaic'

interface TileProject {
  title: string
  slug?: string
  description?: string
  image?: string
  imageAlt?: string
  award?: string
  github?: string
  demo?: string
  docs?: string
  technologies?: string[]
}

const props = withDefaults(defineProps<{
  project: TileProject
  feature?: boolean
  /** Tile size at the 2, 3 and 4 column breakpoints (sm, lg, xl). */
  sizes?: Record<2 | 3 | 4, TileSize>
  groupLabel?: string
  eager?: boolean
  /** fetchpriority=high; only the likely LCP tile should get it. */
  priority?: boolean
}>(), {
  feature: false,
  sizes: () => ({ 2: 'single', 3: 'single', 4: 'single' }),
  groupLabel: undefined,
  eager: false,
  priority: false
})

const image = computed(() => props.project.image
  ? {
      src: props.project.image,
      alt: props.project.imageAlt || props.project.title,
      width: 720,
      height: 405,
      // Same hints as before the refactor (a wide tile is hinted as one column below xl), to keep image bytes unchanged
      sizes: `xs:70vw sm:50vw md:46vw lg:30vw xl:${props.sizes[4] === 'bento' ? 600 : 300}px`,
      fit: 'cover' as const,
      format: 'webp' as const,
      loading: props.eager ? 'eager' as const : 'lazy' as const,
      fetchpriority: props.priority ? 'high' as const : 'auto' as const
    }
  : undefined)

// Classes per breakpoint range, spelled out in full so Tailwind can see them.
// wide = col-span-2 and side by side; bento = 2x2 with the image filling the height.
const WIDE = {
  2: { root: 'sm:max-lg:col-span-2 sm:max-lg:flex-row', header: 'sm:max-lg:aspect-auto sm:max-lg:w-1/2 sm:max-lg:min-h-48' },
  3: { root: 'lg:max-xl:col-span-2 lg:max-xl:flex-row', header: 'lg:max-xl:aspect-auto lg:max-xl:w-1/2 lg:max-xl:min-h-48' },
  4: { root: 'xl:col-span-2 xl:flex-row', header: 'xl:aspect-auto xl:w-1/2 xl:min-h-48' }
} as const
const BENTO_4 = { root: 'xl:col-span-2 xl:row-span-2', header: 'xl:aspect-auto xl:flex-1 xl:min-h-56', body: 'xl:flex-none' } as const

const ui = computed(() => {
  const parts = { root: [] as string[], header: [] as string[], body: [] as string[] }
  for (const cols of [2, 3, 4] as const) {
    const cls = props.sizes[cols] === 'bento' && cols === 4 ? BENTO_4 : props.sizes[cols] !== 'single' ? WIDE[cols] : null
    if (!cls) continue
    parts.root.push(cls.root)
    parts.header.push(cls.header)
    if ('body' in cls) parts.body.push(cls.body)
  }
  return {
    root: parts.root.join(' '),
    header: parts.header.join(' '),
    body: ['p-5 sm:p-4', ...parts.body].join(' '),
    // The image fills the header box (also when it stretches); hover zoom of 5% instead of 10%
    image: 'absolute inset-0 group-hover/blog-post:scale-105'
  }
})

const links = computed(() => [
  props.project.demo && { label: 'Live demo', href: props.project.demo, icon: 'i-lucide-external-link' },
  props.project.docs && { label: 'Docs', href: props.project.docs, icon: 'i-lucide-book-open' },
  props.project.github && { label: 'Source code', href: props.project.github, icon: 'i-lucide-github' }
].filter(Boolean) as { label: string, href: string, icon: string }[])

const techLimit = computed(() => (props.feature ? 4 : 3))
const techs = computed(() => (props.project.technologies ?? []).slice(0, techLimit.value))
const extraTechs = computed(() => Math.max(0, techs.value.length - 3))
const moreTechs = computed(() => Math.max(0, (props.project.technologies?.length ?? 0) - techLimit.value))
</script>
