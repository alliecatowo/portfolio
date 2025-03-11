<template>
  <div>
    <!-- Hero Section -->
    <section class="relative py-20 overflow-hidden">
      <div class="container-custom">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="text-center md:text-left">
            <h1 class="mb-6">
              <template v-if="siteConfig.type === 'dev'">
                <span class="block text-primary dark:text-dark-primary">Hello, I'm Allison</span>
                <span class="block">Full-Stack Developer</span>
              </template>
              <template v-else>
                <span class="block text-primary-dark dark:text-dark-primary">Hello, I'm Allison</span>
                <span class="block">Tattoo Artist</span>
              </template>
            </h1>
            <p class="text-xl mb-8 text-gray-600 dark:text-gray-300">
              {{ siteConfig.description }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <NuxtLink 
                :to="siteConfig.type === 'dev' ? '/projects' : '/gallery'" 
                class="btn btn-primary"
              >
                {{ siteConfig.type === 'dev' ? 'View Projects' : 'View Gallery' }}
              </NuxtLink>
              <NuxtLink to="/contact" class="btn btn-outline">
                Contact Me
              </NuxtLink>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="relative">
              <div 
                v-if="siteConfig.type === 'dev'" 
                class="rounded-lg shadow-xl w-full h-[500px] bg-accent/50 dark:bg-accent-dark/50 flex items-center justify-center text-white"
              >
                Developer Portrait Placeholder
              </div>
              <div 
                v-else 
                class="rounded-lg shadow-xl w-full h-[500px] bg-primary/50 dark:bg-primary-dark/50 flex items-center justify-center text-white"
              >
                Tattoo Artist Portrait Placeholder
              </div>
              <div class="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/30 to-accent/20 dark:from-dark-primary/30 dark:to-accent-dark/20"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Developer-specific sections -->
    <template v-if="siteConfig.type === 'dev'">
      <!-- Featured Projects -->
      <section class="py-16 bg-gray-50 dark:bg-gray-900">
        <div class="container-custom">
          <h2 class="text-center mb-12">Featured Projects</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Project cards would go here once connected to CMS -->
            <div class="card">
              <h3 class="text-xl font-semibold mb-2">Project Title</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">Short description of the project.</p>
              <NuxtLink to="/projects/1" class="text-primary dark:text-dark-primary font-medium">View Details →</NuxtLink>
            </div>
            <div class="card">
              <h3 class="text-xl font-semibold mb-2">Project Title</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">Short description of the project.</p>
              <NuxtLink to="/projects/2" class="text-primary dark:text-dark-primary font-medium">View Details →</NuxtLink>
            </div>
            <div class="card">
              <h3 class="text-xl font-semibold mb-2">Project Title</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">Short description of the project.</p>
              <NuxtLink to="/projects/3" class="text-primary dark:text-dark-primary font-medium">View Details →</NuxtLink>
            </div>
          </div>
          <div class="text-center mt-12">
            <NuxtLink to="/projects" class="btn btn-outline">View All Projects</NuxtLink>
          </div>
        </div>
      </section>

      <!-- Skills Section -->
      <section class="py-16">
        <div class="container-custom">
          <h2 class="text-center mb-12">Skills & Technologies</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div v-for="i in 12" :key="i" class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div class="w-12 h-12 mb-3 flex items-center justify-center">
                <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
              <span class="font-medium">Skill {{ i }}</span>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Tattoo-specific sections -->
    <template v-else>
      <!-- Featured Works -->
      <section class="py-16 bg-gray-50 dark:bg-gray-900">
        <div class="container-custom">
          <h2 class="text-center mb-12">Featured Tattoo Works</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Tattoo images would go here once connected to CMS -->
            <div v-for="i in 6" :key="i" class="overflow-hidden rounded-lg shadow-md">
              <div class="relative aspect-square bg-gray-200 dark:bg-gray-700">
                <!-- Placeholder for tattoo image -->
                <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  Tattoo {{ i }}
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-12">
            <NuxtLink to="/gallery" class="btn btn-outline">View Full Gallery</NuxtLink>
          </div>
        </div>
      </section>

      <!-- Tattoo Styles -->
      <section class="py-16">
        <div class="container-custom">
          <h2 class="text-center mb-12">Tattoo Styles</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="i in 3" :key="i" class="card">
              <h3 class="text-xl font-semibold mb-2">Style {{ i }}</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">Description of the tattoo style and examples of work.</p>
              <NuxtLink to="/gallery" class="text-primary-dark dark:text-dark-primary font-medium">View Examples →</NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Common CTA Section -->
    <section class="py-16 bg-primary/10 dark:bg-dark-primary/10">
      <div class="container-custom text-center">
        <h2 class="mb-6">Let's Work Together</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          {{ siteConfig.type === 'dev' 
            ? 'Have a project in mind? Let\'s discuss how I can help bring your ideas to life with code.' 
            : 'Ready for your next tattoo? Let\'s discuss your design ideas and create something meaningful.' 
          }}
        </p>
        <NuxtLink to="/contact" class="btn btn-primary">Get in Touch</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Get site configuration
const siteConfig = useSiteConfig();
</script> 