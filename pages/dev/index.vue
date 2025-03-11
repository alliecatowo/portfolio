<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-dark-primary/10 dark:to-dark-primary/20">
      <div class="container-custom">
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="flex-1 order-2 md:order-1">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">Full-Stack Developer</h1>
            <h2 class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6">Building elegant solutions with modern technologies</h2>
            <p class="text-lg mb-8">
              I'm Allison, a passionate developer with expertise in Vue.js, Nuxt, and full-stack development. I create responsive, 
              accessible, and scalable web applications with a focus on user experience and performance.
            </p>
            <div class="flex flex-wrap gap-4">
              <NuxtLink to="/dev/projects" class="btn btn-primary">
                View My Projects
              </NuxtLink>
              <NuxtLink to="/dev/contact" class="btn btn-outline">
                Get In Touch
              </NuxtLink>
            </div>
          </div>
          <div class="flex-1 order-1 md:order-2">
            <div class="aspect-square max-w-md mx-auto bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden">
              <!-- Placeholder for profile image -->
              <div class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                Developer Profile Image
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects Section -->
    <section class="py-16 bg-white dark:bg-gray-900">
      <div class="container-custom">
        <h2 class="text-3xl font-bold mb-12 text-center">Featured Projects</h2>
        
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <!-- Project cards will be fetched from Strapi -->
          <div v-for="i in 3" :key="i" class="card overflow-hidden">
            <div class="relative aspect-video bg-gray-200 dark:bg-gray-700 mb-4">
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Project Image {{ i }}
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-xl font-bold mb-2">Project Title {{ i }}</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                A brief description of this project and the technologies used to build it.
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="px-2 py-1 text-xs rounded-full bg-primary/10 dark:bg-dark-primary/20 text-primary dark:text-dark-primary">
                  Vue.js
                </span>
                <span class="px-2 py-1 text-xs rounded-full bg-primary/10 dark:bg-dark-primary/20 text-primary dark:text-dark-primary">
                  TypeScript
                </span>
                <span class="px-2 py-1 text-xs rounded-full bg-primary/10 dark:bg-dark-primary/20 text-primary dark:text-dark-primary">
                  Tailwind
                </span>
              </div>
              <NuxtLink :to="`/dev/projects/${i}`" class="text-primary dark:text-dark-primary font-medium">
                View Details →
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <NuxtLink to="/dev/projects" class="btn btn-primary">
            View All Projects
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="py-16 bg-gray-50 dark:bg-gray-800">
      <div class="container-custom">
        <h2 class="text-3xl font-bold mb-12 text-center">Technical Skills</h2>
        
        <div class="grid gap-8 md:grid-cols-3">
          <!-- Frontend -->
          <div class="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
            <h3 class="text-xl font-bold mb-4">Frontend</h3>
            <ul class="space-y-2">
              <li class="flex items-center">
                <span class="w-2 h-2 bg-primary dark:bg-dark-primary rounded-full mr-2"></span>
                Vue.js / Nuxt.js
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-primary dark:bg-dark-primary rounded-full mr-2"></span>
                React / Next.js
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-primary dark:bg-dark-primary rounded-full mr-2"></span>
                TypeScript
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-primary dark:bg-dark-primary rounded-full mr-2"></span>
                Tailwind CSS
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-primary dark:bg-dark-primary rounded-full mr-2"></span>
                Responsive Design
              </li>
            </ul>
          </div>
          
          <!-- Backend -->
          <div class="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
            <h3 class="text-xl font-bold mb-4">Backend</h3>
            <ul class="space-y-2">
              <li class="flex items-center">
                <span class="w-2 h-2 bg-primary dark:bg-dark-primary rounded-full mr-2"></span>
                Node.js / Express
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-primary dark:bg-dark-primary rounded-full mr-2"></span>
                REST API Design
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-primary dark:bg-dark-primary rounded-full mr-2"></span>
                GraphQL
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-primary dark:bg-dark-primary rounded-full mr-2"></span>
                PostgreSQL / MongoDB
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-primary dark:bg-dark-primary rounded-full mr-2"></span>
                Authentication & Authorization
              </li>
            </ul>
          </div>
          
          <!-- DevOps & Tools -->
          <div class="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
            <h3 class="text-xl font-bold mb-4">DevOps & Tools</h3>
            <ul class="space-y-2">
              <li class="flex items-center">
                <span class="w-2 h-2 bg-primary dark:bg-dark-primary rounded-full mr-2"></span>
                Git / GitHub
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-primary dark:bg-dark-primary rounded-full mr-2"></span>
                Docker / Containerization
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-primary dark:bg-dark-primary rounded-full mr-2"></span>
                CI/CD Pipelines
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-primary dark:bg-dark-primary rounded-full mr-2"></span>
                Cloud Services (AWS, Vercel)
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-primary dark:bg-dark-primary rounded-full mr-2"></span>
                Testing (Jest, Cypress)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Blog Posts -->
    <section class="py-16 bg-white dark:bg-gray-900">
      <div class="container-custom">
        <h2 class="text-3xl font-bold mb-12 text-center">Recent Articles</h2>
        
        <div class="grid gap-8 md:grid-cols-3">
          <div v-for="i in 3" :key="i" class="card overflow-hidden">
            <div class="relative aspect-video bg-gray-200 dark:bg-gray-700 mb-4">
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Blog Image {{ i }}
              </div>
            </div>
            <div class="p-4">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {{ new Date(Date.now() - i * 1000000000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
              </div>
              <h3 class="text-xl font-bold mb-2">Development Article {{ i }}</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                A technical article exploring development concepts, best practices, and innovative approaches to software challenges.
              </p>
              <NuxtLink :to="`/dev/blog/${i}`" class="text-primary dark:text-dark-primary font-medium">
                Read More →
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <NuxtLink to="/dev/blog" class="btn btn-primary">
            View All Articles
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-20 bg-primary/10 dark:bg-dark-primary/10">
      <div class="container-custom text-center">
        <h2 class="text-3xl font-bold mb-6">Let's Work Together</h2>
        <p class="text-lg max-w-2xl mx-auto mb-8">
          Looking for a developer to bring your ideas to life? I'm currently available for freelance work and new opportunities.
        </p>
        <NuxtLink to="/dev/contact" class="btn btn-primary">
          Get In Touch
        </NuxtLink>
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
    baseRoute: '/dev'
  };
}

// Meta tags
useHead({
  title: `${siteConfig.value?.title || 'Allison\'s Developer Portfolio'} - Home`,
  meta: [
    { name: 'description', content: 'Full-stack developer specializing in Vue.js, Nuxt, and modern web technologies.' }
  ]
});
</script> 