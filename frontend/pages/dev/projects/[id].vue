<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary/5 to-primary-50 dark:from-primary-400/10 dark:to-primary-400/5">
      <div class="container-custom">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-400"></div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg text-center max-w-md mx-auto">
          <p>{{ error }}</p>
          <NuxtLink to="/dev/projects" class="mt-4 inline-block text-primary dark:text-primary-400 font-medium">
            Back to Projects
          </NuxtLink>
        </div>

        <!-- Project not found -->
        <div v-else-if="!project" class="text-center py-16">
          <div class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold mb-2">Project not found</h2>
          <p class="text-gray-500 dark:text-gray-400 mb-4">The project you're looking for doesn't exist or has been removed.</p>
          <NuxtLink to="/dev/projects" class="text-primary dark:text-primary-400 font-medium">
            Back to Projects
          </NuxtLink>
        </div>

        <!-- Project Details -->
        <div v-else>
          <!-- Back Link -->
          <NuxtLink to="/dev/projects" class="inline-flex items-center mb-8 text-primary dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Projects
          </NuxtLink>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <!-- Project Image -->
            <div class="space-y-4">
              <div class="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img 
                  :src="project.image || '/placeholder-project.jpg'" 
                  :alt="project.title"
                  class="w-full h-full object-cover"
                >
              </div>
            </div>

            <!-- Project Info -->
            <div class="space-y-6">
              <div>
                <h1 class="text-4xl md:text-5xl font-bold mb-4 text-primary dark:text-primary-400">
                  {{ project.title }}
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ project.description }}
                </p>
              </div>

              <!-- Technologies -->
              <div v-if="project.technologies && project.technologies.length > 0">
                <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Technologies Used</h3>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="tech in project.technologies" 
                    :key="tech"
                    class="px-3 py-1 bg-primary-50 dark:bg-primary-400/20 text-primary dark:text-primary-400 text-sm rounded-full"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <!-- Links -->
              <div class="flex flex-col sm:flex-row gap-4">
                <a 
                  v-if="project.demo"
                  :href="project.demo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 text-white rounded-lg transition-colors"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  Live Demo
                </a>
                <a 
                  v-if="project.github"
                  :href="project.github" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
                  </svg>
                  View Code
                </a>
              </div>
            </div>
          </div>

          <!-- Project Details -->
          <div v-if="project.body" class="mt-16">
            <div class="prose prose-lg dark:prose-invert max-w-none">
              <ContentRenderer :value="project" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Ensure site config is set to dev
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'dev') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'dev',
  };
}

// Route params
const route = useRoute();
const projectId = route.params.id as string;

// Fetch the project directly with queryCollection
const { data: project, pending: loading, error } = await useAsyncData(
  `dev-project-${projectId || 'unknown'}`,
  () => queryCollection('projects').where('_path', 'LIKE', `%${projectId || 'unknown'}%`).first()
);

// Meta tags
useHead(() => ({
  title: project.value 
    ? `${project.value.title} - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`
    : `Project - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`,
  meta: [
    { 
      name: 'description', 
      content: project.value?.description || 'Project details and technical information.' 
    }
  ]
}));
</script>