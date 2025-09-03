<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-12">
      <!-- Header -->
      <section class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Explore my work across both development projects and tattoo art.
        </p>
      </section>

      <!-- Dual Portfolio Navigation -->
      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <!-- Dev Gallery -->
        <NuxtLink to="/dev/gallery" class="group block">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 dark:bg-primary-400/20 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-primary dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>
              </div>
              <h2 class="text-2xl font-bold mb-2">Development Projects</h2>
              <p class="text-gray-600 dark:text-gray-300">
                Web applications, tools, and technical projects I've built.
              </p>
            </div>
          </div>
        </NuxtLink>

        <!-- Tattoo Gallery -->
        <NuxtLink to="/tattoo/gallery" class="group block">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-4 bg-primary-700/10 dark:bg-primary-400/20 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-primary-700 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z"/>
                </svg>
              </div>
              <h2 class="text-2xl font-bold mb-2">Tattoo Art</h2>
              <p class="text-gray-600 dark:text-gray-300">
                Custom tattoo designs and artwork I've created for clients.
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta tags
useHead({
  title: 'Gallery - Dual Portfolio',
  meta: [
    { name: 'description', content: 'Explore my work across both development projects and tattoo art in this dual portfolio gallery.' }
  ]
});
</script>