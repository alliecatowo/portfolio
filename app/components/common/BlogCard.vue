<template>
  <UBlogPost
    :title="title"
    :description="description"
    :image="image ? { src: image, alt: title, sizes: imageSizes } : undefined"
    :to="to"
    variant="outline"
    :orientation="orientation"
    class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20 h-full"
    :ui="orientation === 'horizontal' ? { header: 'lg:aspect-[16/10]' } : undefined"
  >
    <template v-if="!image" #header>
      <CardImageFallback :title="title" icon="i-lucide-book-open" />
    </template>

    <!--
      Custom body: UBlogPost's own date formatting runs in the viewer's time zone,
      which mismatches the UTC-built HTML. Format with formatContentDate instead.
    -->
    <template #body>
      <div class="min-w-0 flex-1 flex flex-col">
        <div v-if="date || readTime" class="flex items-center gap-2 text-sm text-muted mb-2">
          <time v-if="date" :datetime="date">{{ formatContentDate(date) }}</time>
          <span v-if="date && readTime" aria-hidden="true">·</span>
          <span v-if="readTime">{{ readTime }}</span>
        </div>

        <h3
          v-if="title"
          class="text-pretty font-semibold text-highlighted mb-2"
          :class="orientation === 'horizontal' ? 'text-2xl' : 'text-xl'"
        >
          {{ title }}
        </h3>
        <p v-if="description" class="mt-1 text-base text-pretty text-muted mb-3">{{ description }}</p>

        <!-- Tags -->
        <div v-if="tags?.length" class="flex flex-wrap gap-2 mt-auto pt-2">
          <UBadge
            v-for="t in tags.slice(0, 4)"
            :key="t"
            variant="soft"
            size="sm"
          >
            {{ t }}
          </UBadge>
          <UBadge
            v-if="tags.length > 4"
            variant="soft"
            color="neutral"
            size="sm"
          >
            +{{ tags.length - 4 }} more
          </UBadge>
        </div>
      </div>
    </template>
  </UBlogPost>
</template>

<script setup lang="ts">
import CardImageFallback from './CardImageFallback.vue'

const props = withDefaults(defineProps<{
  title: string
  description?: string
  date?: string
  image?: string
  to: string
  readTime?: string
  tags?: string[]
  orientation?: 'vertical' | 'horizontal'
}>(), {
  description: undefined,
  date: undefined,
  image: undefined,
  readTime: undefined,
  tags: () => [],
  orientation: 'vertical'
})

// Responsive srcset: a horizontal (lead) card's image is about half the container
// on lg; a grid card is one of up to three columns. Every key is a breakpoint
// (an unprefixed value would become a bogus 1px candidate in @nuxt/image).
const imageSizes = computed(() =>
  props.orientation === 'horizontal' ? 'xs:88vw sm:92vw lg:50vw xl:560px' : 'xs:88vw sm:92vw md:45vw lg:30vw xl:389px'
)
</script>
