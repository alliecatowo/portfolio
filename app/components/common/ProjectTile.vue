<template>
  <!--
    One project in the /projects mosaic. The whole tile is clickable through a
    stretched title link; the repo/demo icons sit above it (z-10) so they stay
    separate targets without nesting links.

    `feature` tiles follow the grid (the nearest @container): at two and three
    columns (>= 33rem) they span two, image-left / text-right, one row tall;
    from four columns (>= 67rem), when `bento` is set, they become 2x2 tiles
    whose image grows to fill the height. pages/projects/index.vue counts cells with the same
    breakpoints.
  -->
  <article
    class="group/tile relative flex flex-col overflow-hidden rounded-xl border border-default/60 bg-elevated/40 backdrop-blur-sm transition-[border-color] duration-200 hover:border-primary/60 has-[.tile-link:focus-visible]:ring-2 has-[.tile-link:focus-visible]:ring-primary motion-safe:transition-[transform,border-color] motion-safe:hover:-translate-y-0.5"
    :class="[
      feature && 'tile-feature @min-[33rem]:col-span-2 @min-[33rem]:flex-row border-primary/40 shadow-[0_10px_36px_rgba(236,72,153,0.12)]',
      feature && bento && '@min-[67rem]:row-span-2 @min-[67rem]:flex-col'
    ]"
  >
    <div
      class="relative aspect-video shrink-0 overflow-hidden bg-default"
      :class="[
        feature && '@min-[33rem]:aspect-auto @min-[33rem]:w-1/2 @min-[33rem]:min-h-48',
        feature && bento && '@min-[67rem]:w-full @min-[67rem]:flex-1 @min-[67rem]:min-h-56'
      ]"
    >
      <NuxtImg
        v-if="project.image"
        :src="project.image"
        :alt="project.imageAlt || project.title"
        :width="720"
        :height="405"
        fit="cover"
        format="webp"
        :loading="eager ? 'eager' : 'lazy'"
        :fetchpriority="eager ? 'high' : 'auto'"
        class="absolute inset-0 h-full w-full object-cover object-top motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/tile:scale-[1.03]"
      />
      <div v-else class="absolute inset-0">
        <CardImageFallback :title="project.title" icon="i-lucide-folder-code" />
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-2 p-4" :class="[feature && '@min-[33rem]:p-5', feature && bento && '@min-[67rem]:flex-none']">
      <p v-if="groupLabel" class="truncate text-[0.6875rem] font-medium uppercase tracking-wider text-primary/90">
        {{ groupLabel }}
      </p>

      <h3 class="font-semibold leading-snug text-highlighted" :class="feature ? 'text-lg' : 'text-base'">
        <NuxtLink :to="`/projects/${project.slug}/`" class="tile-link outline-none after:absolute after:inset-0 after:content-['']">
          {{ project.title }}
        </NuxtLink>
      </h3>

      <AwardBadge v-if="project.award" :award="project.award" class="self-start" />

      <p class="text-sm text-muted text-pretty" :class="feature ? 'line-clamp-3' : 'line-clamp-2'">
        {{ project.description }}
      </p>

      <div class="mt-auto flex items-end justify-between gap-2 pt-2">
        <ul v-if="techs.length" class="flex min-w-0 flex-wrap gap-1" aria-label="Technologies">
          <li v-for="tech in techs" :key="tech">
            <UBadge variant="soft" size="sm" class="px-1.5 py-0 text-[0.6875rem]">{{ tech }}</UBadge>
          </li>
          <li v-if="moreTechs > 0">
            <UBadge variant="soft" color="neutral" size="sm" class="px-1.5 py-0 text-[0.6875rem]">+{{ moreTechs }}</UBadge>
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
  bento?: boolean
  groupLabel?: string
  eager?: boolean
}>(), {
  feature: false,
  bento: false,
  groupLabel: undefined,
  eager: false
})

const techLimit = computed(() => (props.feature ? 4 : 3))
const techs = computed(() => (props.project.technologies ?? []).slice(0, techLimit.value))
const moreTechs = computed(() => Math.max(0, (props.project.technologies?.length ?? 0) - techLimit.value))
</script>
