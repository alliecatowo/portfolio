<template>
  <div class="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center">
    <div class="container-custom py-12">
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">Allison's Portfolio</h1>
        <p class="text-xl max-w-2xl mx-auto">Welcome to my dual portfolio. I'm both a developer and a tattoo artist. Choose which aspect of my work you'd like to explore.</p>
      </div>
      
      <div class="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <!-- Developer Portfolio Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
          <div class="relative aspect-video bg-primary/10 dark:bg-dark-primary/20">
            <div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Developer Portfolio Preview
            </div>
          </div>
          <div class="p-8">
            <h2 class="text-3xl font-bold mb-4 text-primary dark:text-dark-primary">Developer Portfolio</h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              Explore my work as a full-stack developer specializing in modern web technologies, 
              including projects, open-source contributions, and technical articles.
            </p>
            <NuxtLink to="/dev" class="btn btn-primary w-full">
              View Developer Portfolio
            </NuxtLink>
          </div>
        </div>
        
        <!-- Tattoo Artist Portfolio Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
          <div class="relative aspect-video bg-primary-dark/10 dark:bg-dark-primary/30">
            <div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Tattoo Portfolio Preview
            </div>
          </div>
          <div class="p-8">
            <h2 class="text-3xl font-bold mb-4 text-primary-dark dark:text-dark-primary">Tattoo Portfolio</h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              Discover my work as a tattoo artist specializing in fine line, watercolor, and custom designs. 
              Browse my gallery, read client stories, and learn about my tattooing style.
            </p>
            <NuxtLink to="/tattoo" class="btn btn-primary w-full">
              View Tattoo Portfolio
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <div class="text-center mt-16">
        <p class="text-gray-500 dark:text-gray-400">
          Crafted with ❤️ using Nuxt.js, Tailwind CSS, and Strapi CMS
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta tags for the landing page
useHead({
  title: "Allison's Portfolio - Developer & Tattoo Artist",
  meta: [
    { name: 'description', content: 'Allison\'s dual portfolio showcasing work as both a full-stack developer and a tattoo artist.' }
  ]
});

// Make sure we have the correct site configuration for the landing page
const config = useSiteConfig();
// Reset to default state for landing page
onMounted(() => {
  config.value = {
    ...config.value,
    baseRoute: '/'
  };
});
</script> 