<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container-custom py-12">
      <!-- Header -->
      <section class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-primary dark:text-primary-400">My Projects</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Explore my web development projects, from responsive websites to interactive applications, built with modern technologies.
        </p>
      </section>

      <!-- Category Filters -->
      <section class="mb-8">
        <div class="flex flex-wrap justify-center gap-4">
          <button
            @click="selectedCategory = null"
            :class="[
              'px-4 py-2 rounded-full font-medium transition-all',
              !selectedCategory ? 
                'bg-primary dark:bg-primary-400 text-white' : 
                'bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-400/10'
            ]"
          >
            All Projects
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.name"
            :class="[
              'px-4 py-2 rounded-full font-medium transition-all',
              selectedCategory === category.name ? 
                'bg-primary dark:bg-primary-400 text-white' : 
                'bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-400/10'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-400"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg text-center max-w-md mx-auto">
        <p>{{ error }}</p>
      </div>

      <!-- Projects Grid -->
      <div v-else-if="filteredProjects && filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
        >
          <!-- Project Image -->
          <div class="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <img
              :src="project.image || '/placeholder-project.jpg'"
              :alt="project.title"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            >
          </div>

          <!-- Project Info -->
          <div class="p-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ project.title }}</h3>
              <span v-if="project.featured" class="px-2 py-1 bg-primary-100 dark:bg-primary-400/20 text-primary dark:text-primary-400 text-xs rounded-full">
                Featured
              </span>
            </div>

            <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{{ project.description }}</p>

            <!-- Technologies -->
            <div v-if="project.technologies && project.technologies.length > 0" class="mb-4">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in project.technologies.slice(0, 3)"
                  :key="tech"
                  class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                >
                  {{ tech }}
                </span>
                <span v-if="project.technologies.length > 3" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                  +{{ project.technologies.length - 3 }}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <NuxtLink
                :to="`/dev/projects/${project._path?.split('/').pop()}`"
                class="flex-1 bg-primary hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 text-white text-center py-2 px-4 rounded-lg transition-colors"
              >
                View Details
              </NuxtLink>
              <a
                v-if="project.github"
                :href="project.github"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
                title="View Code"
              >
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">No projects found</h3>
        <p class="text-gray-500 dark:text-gray-400">Check back later for new projects or try a different category.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';
import { useContent } from '~/composables/useContent';

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
const selectedCategory = ref(null);

// Categories from projects
const categories = computed(() => {
  if (!projects.value) return [];
  const uniqueCategories = [...new Set(projects.value.map(p => p.category).filter(Boolean))];
  return uniqueCategories.map((cat, index) => ({ id: index + 1, name: cat }));
});

// Computed
const filteredProjects = computed(() => {
  if (!selectedCategory.value || !projects.value) return projects.value || [];
  return projects.value.filter(project => 
    project.category === selectedCategory.value
  );
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
.container-custom {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>