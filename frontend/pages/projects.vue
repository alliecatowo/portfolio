<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8">Projects</h1>
    
    <div v-if="isLoading">
      <p class="text-lg">Loading projects...</p>
    </div>
    
    <div v-else-if="error">
      <p class="text-lg text-red-600">{{ error }}</p>
    </div>
    
    <div v-else-if="projects.length === 0">
      <p class="text-lg">No projects found. Check back soon!</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="project in projects" :key="project.id" class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl">
        <NuxtImg 
          v-if="project.thumbnail" 
          :src="project.thumbnail.url" 
          :alt="project.title"
          class="w-full h-52 object-cover"
          format="webp"
          loading="lazy"
        />
        <div v-else class="w-full h-52 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span class="text-gray-400 dark:text-gray-500">No image</span>
        </div>
        
        <div class="p-6">
          <h2 class="text-xl font-bold mb-2">{{ project.title }}</h2>
          <p class="text-gray-700 dark:text-gray-300 mb-4">{{ project.description }}</p>
          
          <div class="flex flex-wrap gap-2 mb-4">
            <span 
              v-for="category in project.categories" 
              :key="category.id"
              class="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {{ category.name }}
            </span>
          </div>
          
          <div class="flex justify-between mt-4">
            <NuxtLink 
              v-if="project.demoUrl" 
              :to="project.demoUrl" 
              target="_blank" 
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Live Demo
            </NuxtLink>
            
            <NuxtLink 
              v-if="project.repositoryUrl" 
              :to="project.repositoryUrl" 
              target="_blank" 
              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              GitHub
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Fetch all projects directly with queryCollection
const { data: projects, pending: isLoading, error } = await useAsyncData(
  'all-projects',
  () => queryCollection('projects').where('status', '<>', 'draft').order('featured', 'DESC').order('date', 'DESC').all()
);

// Define meta tags for the page
useHead({
  title: 'Projects | Developer Portfolio',
  meta: [
    { name: 'description', content: 'Browse through my development projects and see what I\'ve been working on.' }
  ]
});
</script> 