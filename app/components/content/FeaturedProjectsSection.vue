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

    <UPageGrid v-if="projects?.length">
      <UCard
        v-for="project in projects"
        :key="project.path"
        class="glass-accent hover:scale-105 transition-transform group"
        :to="`/projects/${project.slug || project.path?.split('/').pop()}`"
      >
        <template #header>
          <div class="aspect-video bg-gradient-dev relative overflow-hidden rounded-lg">
            <NuxtImg
              preset="card"
              :src="project.image || fallbackImage(project.path)"
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
        <p class="text-muted mb-4 leading-relaxed line-clamp-3">
          {{ project.description }}
        </p>

        <template #footer>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="(tech, index) in project.technologies?.slice(0, 3)"
              :key="index"
              color="primary"
              variant="soft"
              size="sm"
            >
              {{ tech }}
            </UBadge>
          </div>
        </template>
      </UCard>
    </UPageGrid>

    <div v-else class="py-12 text-center">
      <UIcon name="i-lucide-folder" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" aria-hidden="true" />
      <p class="text-muted text-lg">Featured projects coming soon...</p>
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
  title: 'Featured Projects',
  description: 'A closer look at some of my recent work and experiments.',
  ctaLabel: 'View All Projects',
  ctaTo: '/projects',
  limit: 6
})

const { fetchProjects } = useContent()

const { data: projects } = await useAsyncData('content-home-featured-projects', () => fetchProjects(props.limit, true))

const fallbackImage = (path?: string) => `https://picsum.photos/400/300?random=${path?.length ?? Math.random() * 1000}`
</script>
