<template>
  <section class="mt-20">
    <div class="text-center max-w-3xl mx-auto mb-12">
      <h2 class="text-4xl md:text-5xl font-bold mb-4 text-gradient-animated">
        {{ title }}
      </h2>
      <p v-if="description" class="text-lg md:text-xl text-default">
        {{ description }}
      </p>
    </div>

    <UPageGrid v-if="posts?.length">
      <UBlogPost
        v-for="post in posts"
        :key="post.slug"
        :title="post.title"
        :description="post.description"
        :date="post.date"
        :image="post.featured_image || fallbackImage(post.slug)"
        :to="`/blog/${post.slug}`"
        variant="outline"
        orientation="vertical"
        class="glass-accent hover:scale-105 transition-transform"
      />
    </UPageGrid>

    <div v-else class="py-12 text-center">
      <UIcon name="i-lucide-book-open" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" aria-hidden="true" />
      <p class="text-muted text-lg">Blog posts coming soon...</p>
    </div>

    <div v-if="ctaLabel && ctaTo" class="mt-12 text-center">
      <ContentButton :to="ctaTo" variant="magnet" size="lg" trailing-icon="i-lucide-arrow-right">
        {{ ctaLabel }}
      </ContentButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useContent } from '~/composables/useContent'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  ctaLabel?: string
  ctaTo?: string
  limit?: number
}>(), {
  title: 'Latest Insights',
  description: 'Notes on development, tools, and experiments from my desk.',
  ctaLabel: 'View All Articles',
  ctaTo: '/blog',
  limit: 3
})

const { fetchBlogPosts } = useContent()

const { data: posts } = await useAsyncData('content-home-recent-posts', () => fetchBlogPosts(props.limit))

const fallbackImage = (slug?: string) => `https://picsum.photos/400/300?random=${slug?.length ?? Math.random() * 1000}`
</script>
