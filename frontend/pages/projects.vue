<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8">Projects</h1>
    
    <div v-if="isLoading">
      <p class="text-lg">Loading projects...</p>
    </div>
    
    <div v-else-if="error">
      <p class="text-lg text-red-600">{{ error }}</p>
    </div>
    
      <div v-else-if="projects && projects.length === 0">
        <p class="text-lg">No projects found. Check back soon!</p>
      </div>
    
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="project in projects" :key="project.slug || project.path || project.title" class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl">
        <NuxtImg 
          v-if="project.image" 
          :src="project.image" 
          :alt="project.title"
          loading="lazy"
          preset="card"
          sizes="100vw sm:50vw md:33vw lg:400px"
          class="w-full h-52 object-cover"
        />
        <div v-else class="w-full h-52 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span class="text-gray-400 dark:text-gray-500">No image</span>
        </div>
        
        <div class="p-6">
          <h2 class="text-xl font-bold mb-2">{{ project.title }}</h2>
          <p class="text-gray-700 dark:text-gray-300 mb-4">{{ project.description }}</p>
          
          <div class="flex flex-wrap gap-2 mb-4" v-if="project.technologies && project.technologies.length">
            <span 
              v-for="tech in project.technologies" 
              :key="tech"
              class="px-3 py-1 text-sm rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100"
            >
              {{ tech }}
            </span>
          </div>
          
          <div class="flex justify-between mt-4">
            <a 
              v-if="project.demo" 
              :href="project.demo" 
              target="_blank" 
              class="text-primary hover:underline"
            >
              Live Demo
            </a>
            
            <a 
              v-if="project.github" 
              :href="project.github" 
              target="_blank" 
              class="text-primary hover:underline"
            >
              GitHub
            </a>
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
