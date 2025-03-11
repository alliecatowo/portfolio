<template>
  <div class="container-custom py-12">
    <h1 class="text-center mb-12">Open Source Contributions</h1>
    
    <div class="max-w-4xl mx-auto">
      <!-- Introduction -->
      <div class="mb-12 prose dark:prose-invert max-w-none">
        <p>
          I'm passionate about open source software and regularly contribute to various projects. 
          Here you'll find projects I've created, maintained, or significantly contributed to. 
          Feel free to check them out, use them in your projects, or contribute back.
        </p>
      </div>
      
      <!-- GitHub activity -->
      <div class="mb-16">
        <h2 class="text-2xl font-bold mb-6">GitHub Activity</h2>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            <!-- This would be replaced with actual GitHub activity chart -->
            <div class="text-gray-400 dark:text-gray-500">
              GitHub Contribution Graph (API Integration)
            </div>
          </div>
        </div>
      </div>
      
      <!-- Featured repositories -->
      <div class="mb-16">
        <h2 class="text-2xl font-bold mb-6">Featured Repositories</h2>
        
        <div class="grid gap-6">
          <!-- Repository cards -->
          <div v-for="repo in repositories" :key="repo.name" class="card p-6">
            <div class="flex flex-col md:flex-row md:items-start">
              <div class="flex-grow">
                <div class="flex items-center mb-2">
                  <h3 class="text-xl font-bold mr-3">{{ repo.name }}</h3>
                  <span class="px-2 py-1 text-xs rounded-full bg-primary/10 dark:bg-dark-primary/20 text-primary dark:text-dark-primary">
                    {{ repo.language }}
                  </span>
                </div>
                <p class="text-gray-600 dark:text-gray-300 mb-4">
                  {{ repo.description }}
                </p>
                <div class="flex gap-6 mb-4">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span>{{ repo.stars }} stars</span>
                  </div>
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    <span>{{ repo.forks }} forks</span>
                  </div>
                </div>
                <div class="flex gap-4">
                  <a :href="repo.url" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                    View Repository
                  </a>
                  <a v-if="repo.demo" :href="repo.demo" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Contributions to other projects -->
      <div class="mb-16">
        <h2 class="text-2xl font-bold mb-6">Contributions to Other Projects</h2>
        <div class="grid gap-4">
          <div v-for="(contribution, index) in contributions" :key="index" class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div class="flex flex-col md:flex-row md:items-start">
              <div class="flex-grow">
                <h3 class="text-xl font-bold mb-2">{{ contribution.project }}</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">
                  {{ contribution.description }}
                </p>
                <div class="flex gap-4">
                  <a :href="contribution.url" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-primary dark:text-dark-primary">
                    View Contributions
                    <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Connect section -->
      <div class="bg-primary/10 dark:bg-dark-primary/10 rounded-lg p-8 text-center">
        <h2 class="text-2xl font-bold mb-4">Let's Collaborate</h2>
        <p class="mb-6 max-w-2xl mx-auto">
          Interested in collaborating on an open source project? Have an idea you'd like to discuss?
          I'm always open to new collaborations and contributions.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a :href="siteConfig.socialLinks.github" target="_blank" rel="noopener noreferrer" class="btn btn-outline inline-flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            Find me on GitHub
          </a>
          <NuxtLink to="/contact" class="btn btn-primary">
            Contact Me
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Get site configuration
const siteConfig = useSiteConfig();

// Sample repositories data (in a real app, this would come from the GitHub API)
const repositories = [
  {
    name: 'vue-component-library',
    description: 'A collection of reusable Vue components with extensive documentation and TypeScript support.',
    language: 'Vue',
    stars: 523,
    forks: 128,
    url: 'https://github.com/username/vue-component-library',
    demo: 'https://vue-component-library.example.com'
  },
  {
    name: 'react-data-visualizer',
    description: 'Lightweight React library for creating interactive data visualizations with minimal configuration.',
    language: 'React',
    stars: 342,
    forks: 87,
    url: 'https://github.com/username/react-data-visualizer',
    demo: 'https://react-data-visualizer.example.com'
  },
  {
    name: 'node-api-starter',
    description: 'Production-ready Node.js API starter with TypeScript, Express, authentication, and database setup.',
    language: 'TypeScript',
    stars: 286,
    forks: 93,
    url: 'https://github.com/username/node-api-starter',
    demo: null
  }
];

// Sample contributions data
const contributions = [
  {
    project: 'Vue.js',
    description: 'Contributed bug fixes and documentation improvements to the Vue.js core library.',
    url: 'https://github.com/vuejs/vue/pulls?q=author%3Ausername'
  },
  {
    project: 'TailwindCSS',
    description: 'Added new utilities and fixed edge cases in responsive design components.',
    url: 'https://github.com/tailwindlabs/tailwindcss/pulls?q=author%3Ausername'
  },
  {
    project: 'TypeScript',
    description: 'Improved type definitions and contributed to documentation for complex type scenarios.',
    url: 'https://github.com/microsoft/TypeScript/pulls?q=author%3Ausername'
  }
];

// Meta tags
useHead({
  title: `Open Source - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`,
  meta: [
    { name: 'description', content: 'Explore my open source projects, contributions, and GitHub activity.' }
  ]
});
</script> 