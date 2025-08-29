<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
    <div class="container max-w-5xl px-6 py-20">
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 text-primary-700 dark:text-primary-400">
          Allison's Portfolio
        </h1>
        <p class="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          Software developer by day, tattoo artist by passion. Choose which side of my work you'd like to explore.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <!-- Developer Portfolio Card -->
        <div class="group relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
          <NuxtLink to="/dev" class="absolute inset-0 z-10">
            <span class="sr-only">Go to Developer Portfolio</span>
          </NuxtLink>
          <div class="aspect-w-16 aspect-h-9 bg-blue-50 dark:bg-blue-900">
            <img src="/placeholder-developer.jpg" alt="Developer Portfolio" class="object-cover w-full h-full" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 pointer-events-none">
              <h2 class="text-2xl md:text-3xl font-bold text-white">Developer Portfolio</h2>
            </div>
          </div>
          <div class="p-6">
            <p class="text-gray-700 dark:text-gray-300 mb-6">
              Full-stack developer specializing in modern web and mobile applications. 
              View my projects, skills, and development approach.
            </p>
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">JavaScript</span>
              <span class="px-3 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">Vue.js</span>
              <span class="px-3 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100">Node.js</span>
              <span class="px-3 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100">TypeScript</span>
            </div>
            <div class="relative z-20">
              <UButton to="/dev" color="primary" class="w-full">
                Explore Developer Work
              </UButton>
            </div>
          </div>
        </div>

        <!-- Tattoo Portfolio Card -->
        <div class="group relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
          <NuxtLink to="/tattoo" class="absolute inset-0 z-10">
            <span class="sr-only">Go to Tattoo Portfolio</span>
          </NuxtLink>
          <div class="aspect-w-16 aspect-h-9 bg-rose-50 dark:bg-rose-900">
            <img src="/placeholder-tattoo.jpg" alt="Tattoo Portfolio" class="object-cover w-full h-full" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 pointer-events-none">
              <h2 class="text-2xl md:text-3xl font-bold text-white">Tattoo Portfolio</h2>
            </div>
          </div>
          <div class="p-6">
            <p class="text-gray-700 dark:text-gray-300 mb-6">
              Custom tattoo designs focusing on fine line, watercolor, and botanical styles.
              View my art gallery, styles, and booking information.
            </p>
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="px-3 py-1 text-xs rounded-full bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-100">Fine Line</span>
              <span class="px-3 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100">Watercolor</span>
              <span class="px-3 py-1 text-xs rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100">Botanical</span>
              <span class="px-3 py-1 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100">Custom</span>
            </div>
            <div class="relative z-20">
              <UButton to="/tattoo" color="primary" class="w-full">
                Explore Tattoo Work
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-20 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          Want to know more about me? <NuxtLink to="/about" class="text-primary-700 dark:text-primary-400 font-medium">View my about page</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set site metadata
useHead({
  title: "Allison's Portfolio - Developer & Tattoo Artist",
  meta: [
    { 
      name: 'description', 
      content: 'Explore the dual-natured portfolio of Allison - software developer and tattoo artist showcasing professional and creative work.' 
    }
  ]
});

// Use a neutral site config for the landing page
const config = useSiteConfig();
config.value = {
  title: "Allison's Portfolio",
  description: "Software developer and tattoo artist portfolio",
  type: 'dual',
  baseRoute: '/'
};
</script> 