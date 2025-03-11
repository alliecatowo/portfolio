<template>
  <div class="container-custom py-12">
    <div class="max-w-4xl mx-auto">
      <!-- Back link -->
      <NuxtLink to="/projects" class="inline-flex items-center mb-8 text-primary dark:text-dark-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Projects
      </NuxtLink>
      
      <div v-if="project">
        <!-- Project header -->
        <div class="mb-8">
          <h1 class="mb-4">{{ project.title }}</h1>
          <div class="flex flex-wrap gap-3 mb-6">
            <span 
              v-for="tech in project.technologies" 
              :key="tech"
              class="px-3 py-1 text-sm rounded-full bg-primary/10 dark:bg-dark-primary/20 text-primary dark:text-dark-primary"
            >
              {{ tech }}
            </span>
          </div>
          
          <!-- Links -->
          <div class="flex gap-4 mb-8">
            <a v-if="project.github" :href="project.github" target="_blank" rel="noopener noreferrer" class="btn btn-outline inline-flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
              View Code
            </a>
            <a v-if="project.liveDemo" :href="project.liveDemo" target="_blank" rel="noopener noreferrer" class="btn btn-primary inline-flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              Live Demo
            </a>
          </div>
        </div>
        
        <!-- Project image -->
        <div class="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-8">
          <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
            Project Image {{ project.id }}
          </div>
        </div>
        
        <!-- Project content -->
        <div class="prose dark:prose-invert max-w-none">
          <h2>Project Overview</h2>
          <p>{{ project.description }}</p>
          
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, velit vel bibendum bibendum, 
            nisl nisl bibendum nisl, vel bibendum nisl nisl vel nisl. Sed euismod, velit vel bibendum bibendum,
            nisl nisl bibendum nisl, vel bibendum nisl nisl vel nisl.
          </p>
          
          <h2>Project Features</h2>
          <ul>
            <li>Feature one with description</li>
            <li>Feature two with explanation of functionality</li>
            <li>Feature three with implementation details</li>
            <li>Feature four with technical approach</li>
            <li>Feature five with user experience considerations</li>
          </ul>
          
          <h2>Technical Details</h2>
          <p>
            Integer faucibus magna vitae augue ultricies, vitae efficitur lorem finibus. Suspendisse potenti. 
            Mauris sit amet ex vel magna dignissim facilisis. Quisque tempus libero vel lectus maximus, 
            vel egestas arcu faucibus. Vivamus laoreet dui in nisi hendrerit, at iaculis massa finibus.
          </p>
          
          <h3>Architecture</h3>
          <p>
            Praesent consectetur lectus vel turpis blandit, vel eleifend nisl faucibus. Nullam sed magna vel 
            nisi dictum venenatis. Morbi convallis justo in ipsum eleifend, vel mattis risus dictum.
          </p>
          
          <h3>Development Challenges</h3>
          <p>
            Morbi auctor sit amet magna vel dapibus. Integer euismod tellus vel velit varius, vel fermentum 
            magna rutrum. Phasellus vel magna vel risus vehicula varius. Aenean vel magna vel nisl varius 
            tincidunt.
          </p>
        </div>
        
        <!-- More screenshots section -->
        <div class="mt-12">
          <h2 class="text-2xl font-bold mb-6">More Screenshots</h2>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg">
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Screenshot 1
              </div>
            </div>
            <div class="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg">
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Screenshot 2
              </div>
            </div>
            <div class="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg">
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Screenshot 3
              </div>
            </div>
            <div class="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg">
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Screenshot 4
              </div>
            </div>
          </div>
        </div>
        
        <!-- Next/Previous project navigation -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <NuxtLink 
            v-if="prevProject" 
            :to="`/projects/${prevProject.id}`" 
            class="inline-flex items-center text-primary dark:text-dark-primary"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            {{ prevProject.title }}
          </NuxtLink>
          <div v-else></div>
          
          <NuxtLink 
            v-if="nextProject" 
            :to="`/projects/${nextProject.id}`" 
            class="inline-flex items-center text-primary dark:text-dark-primary"
          >
            {{ nextProject.title }}
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </NuxtLink>
          <div v-else></div>
        </div>
      </div>
      
      <div v-else class="text-center py-16">
        <h2 class="text-2xl mb-4">Project not found</h2>
        <p class="mb-8">Sorry, the project you're looking for doesn't exist.</p>
        <NuxtLink to="/projects" class="btn btn-primary">Browse All Projects</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Get site configuration
const siteConfig = useSiteConfig();

// Get project ID from route
const route = useRoute();
const id = Number(route.params.id);

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

// Find the current project
const project = computed(() => projects.find(p => p.id === id));

// Previous and next projects
const projectIndex = computed(() => projects.findIndex(p => p.id === id));
const prevProject = computed(() => projectIndex.value > 0 ? projects[projectIndex.value - 1] : null);
const nextProject = computed(() => projectIndex.value < projects.length - 1 ? projects[projectIndex.value + 1] : null);

// Meta tags
useHead(() => ({
  title: project.value 
    ? `${project.value.title} - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`
    : 'Project Not Found',
  meta: [
    { name: 'description', content: project.value?.description || 'Project details not available.' }
  ]
}));
</script> 