<template>
  <div class="container-custom py-12">
    <h1 class="text-center mb-12">Blog</h1>
    
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <!-- Blog posts - these would come from CMS -->
      <div v-for="i in 6" :key="i" class="card overflow-hidden">
        <div class="relative aspect-video bg-gray-200 dark:bg-gray-700 mb-4">
          <!-- Placeholder for blog image -->
          <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
            Blog Image {{ i }}
          </div>
        </div>
        <div class="p-2">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {{ new Date(Date.now() - i * 1000000000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
          </div>
          <h2 class="text-xl font-bold mb-2">
            {{ siteConfig.type === 'dev' ? `Development Article ${i}` : `Tattoo Art Story ${i}` }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            {{ siteConfig.type === 'dev' 
              ? 'A technical article exploring development concepts, best practices, and innovative approaches to software challenges.' 
              : 'Exploring tattoo artistry, design processes, client stories, and creative inspirations behind unique tattoo pieces.'
            }}
          </p>
          <NuxtLink :to="`/blog/${i}`" class="text-primary dark:text-dark-primary font-medium">
            Read More →
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <div class="flex justify-center mt-12">
      <div class="flex space-x-2">
        <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md disabled:opacity-50">
          Previous
        </button>
        <button class="px-4 py-2 bg-primary text-white rounded-md">1</button>
        <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md">2</button>
        <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md">3</button>
        <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Get site configuration
const siteConfig = useSiteConfig();

// Meta tags
useHead({
  title: `Blog - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`,
  meta: [
    { name: 'description', content: siteConfig.value?.type === 'dev' 
      ? 'Articles about development, coding, and tech insights from Allison'
      : 'Stories and insights about tattoo art, designs, and client experiences'
    }
  ]
});
</script> 