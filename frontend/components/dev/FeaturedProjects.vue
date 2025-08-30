<template>
  <section class="py-12 bg-white dark:bg-gray-850">
    <div class="container-custom">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Featured Projects
      </h2>
      
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-400"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="!projects || projects.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No featured projects available yet.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="project in projects" 
          :key="project.id" 
          class="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
        >
          <div class="h-48 overflow-hidden">
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
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span class="text-gray-400 dark:text-gray-500">No image</span>
            </div>
          </div>
          
          <div class="p-6">
            <h3 class="font-bold text-xl mb-2 text-gray-900 dark:text-white">
              {{ project.title }}
            </h3>
            
            <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {{ project.description }}
            </p>
            
            <div class="flex flex-wrap gap-2 mb-4" v-if="project.technologies && project.technologies.length">
              <span 
                v-for="tech in project.technologies" 
                :key="tech" 
                class="inline-block px-2 py-1 text-xs font-medium bg-primary-50 text-primary dark:bg-primary-400/20 dark:text-primary-400 rounded-md"
              >
                {{ tech }}
              </span>
            </div>
            
            <div class="mt-4 flex justify-between">
              <NuxtLink 
                :to="`/dev/projects/${project.slug}`" 
                class="text-primary dark:text-primary-400 hover:underline"
              >
                View details
              </NuxtLink>
              
              <div class="flex space-x-2">
                <a 
                  v-if="project.github" 
                  :href="project.github" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
                >
                  <span class="sr-only">GitHub</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                  </svg>
                </a>
                <a 
                  v-if="project.demo" 
                  :href="project.demo" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
                >
                  <span class="sr-only">Live Demo</span>
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-10 text-center">
        <NuxtLink 
          to="/dev/projects" 
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-700 dark:bg-primary-400 dark:hover:bg-primary-400-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-400"
        >
          View All Projects
          <svg class="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Fetch featured projects directly with queryCollection
const { data: projects, pending: isLoading, error } = await useAsyncData(
  'featured-dev-projects',
  () => queryCollection('projects').where('featured', '=', true).order('date', 'DESC').limit(3).all()
);

</script> 