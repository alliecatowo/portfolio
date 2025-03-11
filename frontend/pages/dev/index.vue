<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="container-custom py-12">
      <!-- Hero Section -->
      <section class="py-16 md:py-24">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h1 class="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-dark-primary">
              Allison's Developer Portfolio
            </h1>
            <p class="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300">
              Full-stack developer specializing in modern web technologies, creative solutions, and clean, efficient code.
            </p>
            <div class="flex flex-wrap gap-4">
              <NuxtLink to="/projects" class="btn btn-primary">
                View Projects
              </NuxtLink>
              <NuxtLink to="/contact" class="btn btn-outline">
                Contact Me
              </NuxtLink>
            </div>
          </div>
          <div class="md:w-1/2 rounded-xl overflow-hidden shadow-lg">
            <div class="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <img src="/placeholder-dev.jpg" alt="Developer Hero Image" class="object-cover w-full h-full" />
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Projects Section -->
      <section class="py-12 md:py-16">
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-primary dark:text-dark-primary">Featured Projects</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Check out some of my recent work</p>
        </div>

        <div v-if="featuredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="project in featuredProjects" 
            :key="project.id" 
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
          >
            <div class="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700">
              <img 
                :src="project.attributes.featuredImage?.data?.attributes?.url || '/placeholder-project.jpg'" 
                :alt="project.attributes.title" 
                class="object-cover w-full h-full"
              />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-primary dark:text-dark-primary">
                {{ project.attributes.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                {{ project.attributes.description }}
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="(tech, index) in project.attributes.technologies" 
                  :key="index"
                  class="px-2 py-1 bg-primary/10 dark:bg-dark-primary/20 text-primary dark:text-dark-primary text-xs rounded-full"
                >
                  {{ tech }}
                </span>
              </div>
              <NuxtLink :to="`/projects/${project.attributes.slug}`" class="btn btn-primary btn-sm w-full">
                View Project
              </NuxtLink>
            </div>
          </div>
        </div>

        <div v-else class="py-8 flex justify-center">
          <p class="text-gray-500 dark:text-gray-400">Featured projects will appear here when added.</p>
        </div>

        <div class="mt-8 text-center">
          <NuxtLink to="/projects" class="btn btn-outline">
            View All Projects
          </NuxtLink>
        </div>
      </section>

      <!-- Skills Section -->
      <section class="py-12 md:py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div class="container mx-auto px-4">
          <div class="mb-12 text-center">
            <h2 class="text-3xl font-bold text-primary dark:text-dark-primary">My Skills</h2>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Technologies and tools I work with</p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary dark:text-dark-primary">🚀</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">Frontend</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">Vue, Nuxt, React, TypeScript, Tailwind CSS</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary dark:text-dark-primary">⚙️</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">Backend</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">Node.js, Express, Strapi, PostgreSQL, MongoDB</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary dark:text-dark-primary">📱</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">Mobile</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">React Native, Progressive Web Apps</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary dark:text-dark-primary">🔄</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">DevOps</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">Git, GitHub Actions, Docker, Vercel, AWS</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Blog Posts -->
      <section class="py-12 md:py-16">
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-primary dark:text-dark-primary">Recent Articles</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Thoughts and insights about development</p>
        </div>

        <div v-if="recentPosts.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="post in recentPosts" 
            :key="post.id" 
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
          >
            <div class="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700">
              <img 
                :src="post.attributes.coverImage?.data?.attributes?.url || '/placeholder-blog.jpg'" 
                :alt="post.attributes.title" 
                class="object-cover w-full h-full"
              />
            </div>
            <div class="p-6">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {{ new Date(post.attributes.publishedAt).toLocaleDateString() }}
              </div>
              <h3 class="text-xl font-bold mb-2 text-primary dark:text-dark-primary">
                {{ post.attributes.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                {{ post.attributes.summary }}
              </p>
              <NuxtLink :to="`/blog/${post.attributes.slug}`" class="btn btn-primary btn-sm w-full">
                Read More
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <div v-else class="py-8 flex justify-center">
          <p class="text-gray-500 dark:text-gray-400">Blog posts will appear here when published.</p>
        </div>

        <div class="mt-8 text-center">
          <NuxtLink to="/blog" class="btn btn-outline">
            View All Articles
          </NuxtLink>
        </div>
      </section>

      <!-- Contact CTA -->
      <section class="py-12 md:py-16 bg-primary/10 dark:bg-dark-primary/10 rounded-xl text-center">
        <h2 class="text-3xl font-bold text-primary dark:text-dark-primary mb-4">Let's Work Together</h2>
        <p class="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Have a project idea or need a developer for your team? I'm always open to discussing new opportunities and challenges.
        </p>
        <NuxtLink to="/contact" class="btn btn-primary">
          Get in Touch
        </NuxtLink>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchDevLandingContent } from '~/utils/api/content';
import type { Project, Article } from '~/utils/api/content';

// Site Configuration
const config = useSiteConfig();
config.value = {
  ...config.value,
  title: "Allison's Developer Portfolio",
  description: "Full-stack developer specializing in modern web technologies, creative solutions, and clean, efficient code.",
  type: 'dev'
};

// Page meta
useHead({
  title: "Allison's Developer Portfolio",
  meta: [
    { name: 'description', content: 'Full-stack developer specializing in modern web technologies, creative solutions, and clean, efficient code.' }
  ]
});

// Fetch content from Directus
const featuredProjects = ref<Project[]>([]);
const recentPosts = ref<Article[]>([]);

onMounted(async () => {
  try {
    const content = await fetchDevLandingContent();
    featuredProjects.value = content.featuredProjects.data || [];
    recentPosts.value = content.recentPosts.data || [];
  } catch (error) {
    console.error('Error fetching landing page content:', error);
  }
});
</script> 