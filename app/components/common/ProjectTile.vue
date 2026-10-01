<template>
  <!--
    One project in the /projects mosaic. The whole tile is clickable through a
    stretched title link; the repo/demo icons sit above it (z-10) so they stay
    separate targets without nesting links.

    `sizes` (from utils/packMosaic) says how big the tile is at each column
    count of the grid, which is the nearest @container: 2 columns from 33rem,
    3 from 50rem, 4 from 67rem. "wide" is 2x1, image left and text right;
    "bento" is 2x2 with the image growing to fill the height.
  -->
  <article
    class="group/tile relative flex flex-col overflow-hidden rounded-xl border border-default/60 bg-elevated/40 backdrop-blur-sm transition-[border-color] duration-200 hover:border-primary/60 has-[.tile-link:focus-visible]:ring-2 has-[.tile-link:focus-visible]:ring-primary motion-safe:transition-[transform,border-color] motion-safe:hover:-translate-y-0.5"
    :class="[
      feature && 'border-primary/40 shadow-[0_10px_36px_rgba(236,72,153,0.12)]',
      layout.root
    ]"
  >
    <div
      class="relative aspect-video shrink-0 overflow-hidden bg-default"
      :class="layout.media"
    >
      <NuxtImg
        v-if="project.image"
        :src="project.image"
        :alt="project.imageAlt || project.title"
        :width="720"
        :height="405"
        :sizes="imageSizes"
        fit="cover"
        format="webp"
        :loading="eager ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        class="absolute inset-0 h-full w-full object-cover object-top motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/tile:scale-[1.03]"
      />
      <div v-else class="absolute inset-0">
        <CardImageFallback :title="project.title" icon="i-lucide-folder-code" />
      </div>
    </div>

    <!-- Below 33rem (one column) the body matches BlogCard: roomier padding and gaps, larger type -->
    <div class="flex flex-1 flex-col gap-2 p-4 @max-[33rem]:gap-3 @max-[33rem]:p-5" :class="layout.body">
      <p v-if="groupLabel" class="truncate text-[0.6875rem] font-medium uppercase tracking-wider text-primary/90">
        {{ groupLabel }}
      </p>

      <h3 class="font-semibold leading-snug text-highlighted @max-[33rem]:text-xl" :class="feature ? 'text-lg' : 'text-base'">
        <NuxtLink :to="`/projects/${project.slug}/`" class="tile-link outline-none after:absolute after:inset-0 after:content-['']">
          {{ project.title }}
        </NuxtLink>
      </h3>

      <AwardBadge v-if="project.award" :award="project.award" class="self-start" />

      <p class="text-sm text-muted text-pretty @max-[33rem]:text-base @max-[33rem]:line-clamp-3" :class="feature ? 'line-clamp-3' : 'line-clamp-2'">
        {{ project.description }}
      </p>

      <div class="mt-auto flex items-end justify-between gap-2 pt-2">
        <ul v-if="techs.length" class="flex min-w-0 flex-wrap gap-1" aria-label="Technologies">
          <!-- One column shows 3 at most (a feature tile's 4th is hidden and counted in "+N") -->
          <li v-for="(tech, i) in techs" :key="tech" :class="i >= 3 && '@max-[33rem]:hidden'">
            <UBadge variant="soft" size="sm" class="px-1.5 py-0 text-[0.6875rem] @max-[33rem]:px-2 @max-[33rem]:py-0.5 @max-[33rem]:text-xs">{{ tech }}</UBadge>
          </li>
          <li v-if="moreTechs > 0" class="@max-[33rem]:hidden">
            <UBadge variant="soft" color="neutral" size="sm" class="px-1.5 py-0 text-[0.6875rem]">+{{ moreTechs }}</UBadge>
          </li>
          <li v-if="moreTechs + extraTechs > 0" class="hidden @max-[33rem]:block">
            <UBadge variant="soft" color="neutral" size="sm" class="px-2 py-0.5 text-xs">+{{ moreTechs + extraTechs }}</UBadge>
          </li>
        </ul>
        <span v-else />

        <div class="relative z-10 flex shrink-0 items-center">
          <a
            v-if="project.demo"
            :href="project.demo"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-md p-1.5 text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
            :aria-label="`Live demo of ${project.title}`"
            title="Live demo"
          >
            <UIcon name="i-lucide-external-link" class="block h-4 w-4" />
          </a>
          <a
            v-if="project.github"
            :href="project.github"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-md p-1.5 text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
            :aria-label="`Source code of ${project.title}`"
            title="Source code"
          >
            <UIcon name="i-lucide-github" class="block h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import AwardBadge from '~/components/common/AwardBadge.vue'
import CardImageFallback from '~/components/common/CardImageFallback.vue'
import type { MosaicColumns, TileSize } from '~/utils/packMosaic'

interface TileProject {
  title: string
  slug?: string
  description?: string
  image?: string
  imageAlt?: string
  award?: string
  github?: string
  demo?: string
  technologies?: string[]
}

const props = withDefaults(defineProps<{
  project: TileProject
  feature?: boolean
  sizes?: Record<MosaicColumns, TileSize>
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

// Rendered image width at each column count, for a width-based srcset. A "wide"
// tile puts its image in the left half, so the image is one column wide; only the
// four-column bento shows it two columns wide. Viewport breakpoints approximate the
// grid's container breakpoints (2 cols from ~sm, 3 from ~lg, 4 from ~xl, where the
// 80rem container caps a column at ~300px).
const imageSizes = computed(() => {
  const span = (cols: MosaicColumns) => (props.sizes[cols] === 'bento' && cols === 4 ? 2 : 1)
  const vw = (cols: MosaicColumns) => `${Math.round((100 * span(cols)) / cols)}vw`
  return `xs:100vw sm:${vw(2)} lg:${vw(3)} xl:${300 * span(4)}px`
})

// Container-range classes per column count. Spelled out in full so Tailwind
// can see every one of them.
const WIDE = {
  2: {
    root: '@min-[33rem]:@max-[50rem]:col-span-2 @min-[33rem]:@max-[50rem]:flex-row',
    media: '@min-[33rem]:@max-[50rem]:aspect-auto @min-[33rem]:@max-[50rem]:w-1/2 @min-[33rem]:@max-[50rem]:min-h-48',
    body: '@min-[33rem]:@max-[50rem]:p-5'
  },
  3: {
    root: '@min-[50rem]:@max-[67rem]:col-span-2 @min-[50rem]:@max-[67rem]:flex-row',
    media: '@min-[50rem]:@max-[67rem]:aspect-auto @min-[50rem]:@max-[67rem]:w-1/2 @min-[50rem]:@max-[67rem]:min-h-48',
    body: '@min-[50rem]:@max-[67rem]:p-5'
  },
  4: {
    root: '@min-[67rem]:col-span-2 @min-[67rem]:flex-row',
    media: '@min-[67rem]:aspect-auto @min-[67rem]:w-1/2 @min-[67rem]:min-h-48',
    body: '@min-[67rem]:p-5'
  }
} as const
const BENTO_4 = {
  root: '@min-[67rem]:col-span-2 @min-[67rem]:row-span-2',
  media: '@min-[67rem]:aspect-auto @min-[67rem]:flex-1 @min-[67rem]:min-h-56',
  body: '@min-[67rem]:p-5 @min-[67rem]:flex-none'
} as const

const layout = computed(() => {
  const parts = { root: [] as string[], media: [] as string[], body: [] as string[] }
  for (const cols of [2, 3, 4] as const) {
    const size = props.sizes[cols]
    const cls = size === 'bento' && cols === 4 ? BENTO_4 : size !== 'single' ? WIDE[cols] : null
    if (!cls) continue
    parts.root.push(cls.root)
    parts.media.push(cls.media)
    parts.body.push(cls.body)
  }
  return { root: parts.root.join(' '), media: parts.media.join(' '), body: parts.body.join(' ') }
})

const techLimit = computed(() => (props.feature ? 4 : 3))
const techs = computed(() => (props.project.technologies ?? []).slice(0, techLimit.value))
const extraTechs = computed(() => Math.max(0, techs.value.length - 3))
const moreTechs = computed(() => Math.max(0, (props.project.technologies?.length ?? 0) - techLimit.value))
</script>
