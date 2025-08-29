<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <!-- Header -->
      <section class="mb-10 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-3 text-primary dark:text-primary-400">My Projects</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Explore my web development projects, from responsive websites to interactive applications.
        </p>
      </section>

      <!-- Technology Filters -->
      <section class="mb-8">
        <div class="flex flex-wrap justify-center gap-2">
          <UButton
            size="sm"
            :variant="!selectedCategory ? 'solid' : 'soft'"
            color="primary"
            @click="selectedCategory = null"
            >All Projects</UButton>
          <UButton
            v-for="category in categories"
            :key="category"
            size="sm"
            color="primary"
            :variant="selectedCategory === category ? 'solid' : 'soft'"
            @click="selectedCategory = category"
          >
            {{ category }}
          </UButton>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard v-for="n in 6" :key="n">
          <div class="aspect-video mb-4">
            <USkeleton class="h-full w-full" />
          </div>
          <USkeleton class="h-6 w-2/3 mb-2" />
          <USkeleton class="h-4 w-full mb-2" />
          <USkeleton class="h-4 w-2/3" />
        </UCard>
      </div>

      <!-- Error State -->
      <UAlert v-else-if="error" color="error" variant="subtle" title="Failed to load projects" class="max-w-xl mx-auto" />

      <!-- Projects Grid -->
      <div v-else-if="filteredProjects && filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard
          v-for="project in filteredProjects"
          :key="project.id"
          :ui="{ body: 'p-4 sm:p-5' }"
          class="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <!-- Project Image -->
          <div class="aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden rounded-md">
            <img
              :src="project.image || '/placeholder-project.jpg'"
              :alt="project.title"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            >
          </div>

          <!-- Project Info -->
          <div class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-semibold">{{ project.title }}</h3>
              <UBadge v-if="project.featured" color="primary" variant="soft">Featured</UBadge>
            </div>

            <p class="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">{{ project.description }}</p>

            <!-- Technologies -->
            <div v-if="project.technologies && project.technologies.length > 0" class="mb-4">
              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="tech in project.technologies.slice(0, 3)"
                  :key="tech"
                  color="neutral"
                  variant="soft"
                  class="text-xs"
                >
                  {{ tech }}
                </UBadge>
                <UBadge v-if="project.technologies.length > 3" color="neutral" variant="soft" class="text-xs">
                  +{{ project.technologies.length - 3 }}
                </UBadge>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <UButton
                color="primary"
                class="flex-1"
                :to="`/dev/projects/${project.slug || project.path?.split('/').pop()}`"
              >
                View Details
              </UButton>
              <UButton
                v-if="project.github"
                color="neutral"
                variant="soft"
                :href="project.github"
                target="_blank"
                title="View Code"
              >
                Code
              </UButton>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <UIcon name="i-heroicons-photo" class="w-14 h-14 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
        <h3 class="text-xl font-semibold mb-2">No projects found</h3>
        <p class="text-gray-500 dark:text-gray-400">Check back later or try a different category.</p>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Ensure site config is set to dev
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'dev') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'dev'
  };
}

// Fetch projects directly with queryCollection
const { data: projects, pending: loading, error } = await useAsyncData(
  'dev-projects',
  () => queryCollection('projects').where('status', '<>', 'draft').order('featured', 'DESC').order('date', 'DESC').all()
);

// State
const selectedCategory = ref<string | null>(null);

// Categories from projects
const categories = computed<string[]>(() => {
  if (!projects.value) return [];
  const techs = projects.value.flatMap(p => p.technologies || []);
  return Array.from(new Set(techs)).slice(0, 12);
});

// Computed
const filteredProjects = computed(() => {
  if (!projects.value) return [];
  if (!selectedCategory.value) return projects.value;
  return projects.value.filter(project => (project.technologies || []).includes(selectedCategory.value as string));
});

// Meta tags
useHead({
  title: `Projects - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`,
  meta: [
    { name: 'description', content: 'Explore my web development projects, from responsive websites to interactive applications, built with modern technologies.' }
  ]
});
</script>

<style scoped>
</style>
