<template>
  <div class="container-custom py-12">
    <h1 class="text-center mb-12">Projects</h1>
    
    <!-- Filter tabs -->
    <div class="flex flex-wrap justify-center mb-12">
      <button 
        v-for="filter in projectFilters" 
        :key="filter.id" 
        class="px-4 py-2 m-1 rounded-md transition-colors"
        :class="activeFilter === filter.id 
          ? 'bg-primary text-white' 
          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'"
        @click="activeFilter = filter.id"
      >
        {{ filter.name }}
      </button>
    </div>
    
    <!-- Projects grid -->
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="project in filteredProjects" 
        :key="project.id" 
        class="card overflow-hidden"
      >
        <div class="relative aspect-video bg-gray-200 dark:bg-gray-700 mb-4">
          <!-- Placeholder for project image -->
          <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
            Project Image {{ project.id }}
          </div>
        </div>
        <div class="p-4">
          <h2 class="text-xl font-bold mb-2">{{ project.title }}</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            {{ project.description }}
          </p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span 
              v-for="tech in project.technologies" 
              :key="tech"
              class="px-2 py-1 text-xs rounded-full bg-primary/10 dark:bg-dark-primary/20 text-primary dark:text-dark-primary"
            >
              {{ tech }}
            </span>
          </div>
          <div class="flex justify-between">
            <NuxtLink :to="`/projects/${project.id}`" class="text-primary dark:text-dark-primary font-medium">
              View Details →
            </NuxtLink>
            <div class="flex gap-3">
              <a v-if="project.github" :href="project.github" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-dark-primary">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
              </a>
              <a v-if="project.liveDemo" :href="project.liveDemo" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-dark-primary">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Get site configuration
const siteConfig = useSiteConfig();

// Project filters
const projectFilters = [
  { id: 'all', name: 'All Projects' },
  { id: 'frontend', name: 'Frontend' },
  { id: 'backend', name: 'Backend' },
  { id: 'fullstack', name: 'Full Stack' },
  { id: 'mobile', name: 'Mobile' },
];

// Active filter
const activeFilter = ref('all');

// Sample project data (in a real app, this would come from the CMS)
const projects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform with product management, cart functionality, and payment processing.',
    technologies: ['Vue.js', 'Node.js', 'Express', 'MongoDB'],
    category: 'fullstack',
    github: 'https://github.com/username/ecommerce-platform',
    liveDemo: 'https://ecommerce-platform.example.com'
  },
  {
    id: 2,
    title: 'Weather Dashboard',
    description: 'A responsive weather dashboard providing real-time forecasts and historical weather data visualization.',
    technologies: ['React', 'Chart.js', 'OpenWeather API', 'Tailwind CSS'],
    category: 'frontend',
    github: 'https://github.com/username/weather-dashboard',
    liveDemo: 'https://weather-dashboard.example.com'
  },
  {
    id: 3,
    title: 'Task Management API',
    description: 'RESTful API for task management with authentication, authorization, and comprehensive documentation.',
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'JWT', 'Swagger'],
    category: 'backend',
    github: 'https://github.com/username/task-api',
    liveDemo: null
  },
  {
    id: 4,
    title: 'Fitness Tracker App',
    description: 'Mobile application for tracking workouts, nutrition, and fitness progress with personalized insights.',
    technologies: ['React Native', 'Redux', 'Firebase', 'HealthKit'],
    category: 'mobile',
    github: 'https://github.com/username/fitness-tracker',
    liveDemo: null
  },
  {
    id: 5,
    title: 'Portfolio Website',
    description: 'Modern, responsive portfolio website showcasing projects and professional experience.',
    technologies: ['Vue.js', 'Nuxt.js', 'Tailwind CSS', 'Netlify'],
    category: 'frontend',
    github: 'https://github.com/username/portfolio',
    liveDemo: 'https://portfolio.example.com'
  },
  {
    id: 6,
    title: 'Content Management System',
    description: 'Full-stack CMS with user roles, content moderation, and custom publishing workflows.',
    technologies: ['React', 'Node.js', 'MongoDB', 'GraphQL'],
    category: 'fullstack',
    github: 'https://github.com/username/cms',
    liveDemo: 'https://cms.example.com'
  }
];

// Filtered projects based on active filter
const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') {
    return projects;
  }
  return projects.filter(project => project.category === activeFilter.value);
});

// Meta tags
useHead({
  title: `Projects - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`,
  meta: [
    { name: 'description', content: 'Explore my portfolio of development projects, including web applications, APIs, and mobile apps.' }
  ]
});
</script> 