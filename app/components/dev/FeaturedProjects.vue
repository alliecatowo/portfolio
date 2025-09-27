<template>
  <UPageSection
    :ui="{ wrapper: 'py-12 bg-white dark:bg-gray-850' }"
    aria-labelledby="featured-projects-title"
  >
    <UContainer>
      <UPageHeader
        :title="'Featured Projects'"
        :description="'Innovative solutions and technical showcases'"
        :ui="{ title: 'text-3xl font-bold text-gray-900 dark:text-white mb-8' }"
      />

      <UCard
        v-if="isLoading"
        class="flex justify-center py-16"
        :ui="{ body: 'p-0' }"
      >
        <UProgress
          size="lg"
          color="primary"
          :ui="{ progress: 'animate-pulse' }"
          aria-label="Loading projects..."
        />
      </UCard>

      <UAlert
        v-else-if="error"
        color="red"
        variant="soft"
        :title="'Error Loading Projects'"
        :description="error.message || 'Failed to load featured projects'"
        :ui="{ wrapper: 'mb-8' }"
      />

      <UCard
        v-else-if="!projects || projects.length === 0"
        variant="outline"
        class="text-center py-16"
        :ui="{ body: 'p-0' }"
      >
        <UIcon name="i-lucide-folder" class="h-16 w-16 mx-auto text-muted mb-4" aria-hidden="true" />
        <h3 class="text-lg font-semibold mb-2">No Featured Projects Yet</h3>
        <p class="text-muted">Check back soon for exciting new projects!</p>
      </UCard>
      
      <UPageGrid
        v-else
        :ui="{ wrapper: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' }"
        role="list"
        :aria-label="'Featured projects'"
      >
        <UCard
          v-for="project in projects"
          :key="project.id"
          class="group relative overflow-hidden hover:shadow-xl transition-all duration-300"
          :ui="{ body: 'p-6', footer: 'pt-4' }"
        >
          <template #header>
            <div class="aspect-video relative overflow-hidden rounded-lg">
              <NuxtImg
                v-if="project.image"
                :src="project.image"
                :alt="project.title"
                loading="lazy"
                :width="400"
                :height="200"
                sizes="100vw sm:50vw md:33vw lg:400px"
                format="webp"
                :quality="80"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div
                v-else
                class="w-full h-full bg-muted flex items-center justify-center"
                :aria-label="'No image available for ' + project.title"
              >
                <UIcon name="i-lucide-image" class="h-12 w-12 text-muted" />
              </div>

              <!-- Hover overlay with actions -->
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <UTooltip text="View Project" :delay-duration="300">
                  <UButton
                    :to="`/dev/projects/${project.slug}`"
                    variant="solid"
                    color="white"
                    size="sm"
                    icon="i-lucide-eye"
                    :ui="{ rounded: 'rounded-full' }"
                  />
                </UTooltip>

                <UTooltip v-if="project.github" text="View Source" :delay-duration="300">
                  <UButton
                    :href="project.github"
                    target="_blank"
                    variant="solid"
                    color="white"
                    size="sm"
                    icon="i-lucide-github"
                    :ui="{ rounded: 'rounded-full' }"
                  />
                </UTooltip>

                <UTooltip v-if="project.demo" text="Live Demo" :delay-duration="300">
                  <UButton
                    :href="project.demo"
                    target="_blank"
                    variant="solid"
                    color="white"
                    size="sm"
                    icon="i-lucide-external-link"
                    :ui="{ rounded: 'rounded-full' }"
                  />
                </UTooltip>
              </div>
            </div>
          </template>

          <h3 class="font-bold text-xl mb-2 text-default line-clamp-1">
            {{ project.title }}
          </h3>

          <p class="text-muted mb-4 line-clamp-3">
            {{ project.description }}
          </p>

          <div v-if="project.technologies && project.technologies.length" class="flex flex-wrap gap-2 mb-4">
            <UBadge
              v-for="tech in project.technologies.slice(0, 4)"
              :key="tech"
              variant="soft"
              size="sm"
              class="capitalize"
            >
              {{ tech }}
            </UBadge>
            <UBadge
              v-if="project.technologies.length > 4"
              variant="soft"
              color="gray"
              size="sm"
            >
              +{{ project.technologies.length - 4 }} more
            </UBadge>
          </div>

          <template #footer>
            <div class="flex items-center justify-between">
              <ULink
                :to="`/dev/projects/${project.slug}`"
                class="text-primary hover:text-primary-600 font-medium transition-colors group/link"
                :ui="{ wrapper: 'inline-flex items-center gap-1' }"
              >
                View details
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </ULink>

              <div class="flex items-center gap-2">
                <UTooltip v-if="project.github" text="GitHub Repository">
                  <UButton
                    :href="project.github"
                    target="_blank"
                    variant="ghost"
                    color="gray"
                    size="xs"
                    icon="i-lucide-github"
                    :ui="{ rounded: 'rounded-full' }"
                  />
                </UTooltip>

                <UTooltip v-if="project.demo" text="Live Demo">
                  <UButton
                    :href="project.demo"
                    target="_blank"
                    variant="ghost"
                    color="gray"
                    size="xs"
                    icon="i-lucide-external-link"
                    :ui="{ rounded: 'rounded-full' }"
                  />
                </UTooltip>
              </div>
            </div>
          </template>
        </UCard>
      </UPageGrid>
      
      <div class="mt-12 text-center">
        <UButton
          to="/dev/projects"
          color="primary"
          size="lg"
          variant="outline"
          trailing-icon="i-lucide-arrow-right"
          :ui="{ rounded: 'rounded-lg' }"
        >
          View All Projects
        </UButton>
      </div>
    </UContainer>
  </UPageSection>
</template>

<script setup lang="ts">
// Fetch featured projects directly with queryCollection
const { data: projects, pending: isLoading, error } = await useAsyncData(
  'featured-dev-projects',
  () => queryCollection('projects').where('featured', '=', true).order('date', 'DESC').limit(3).all()
);

</script> 