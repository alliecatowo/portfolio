<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Content Management</h1>
        
        <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Content is managed through markdown files in the <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">content/</code> directory.
          Edit files directly or use your preferred markdown editor.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 mb-8">
          <NuxtLink 
            to="/blog" 
            class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View Blog
          </NuxtLink>
          <NuxtLink 
            to="/projects" 
            class="inline-flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            View Projects
          </NuxtLink>
        </div>
        
        <!-- Content Structure -->
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 class="text-lg font-bold mb-3">Content Structure</h3>
            <ul class="space-y-1 text-sm font-mono text-gray-600 dark:text-gray-300">
              <li>📁 content/</li>
              <li>├── 📁 blog/</li>
              <li>├── 📁 projects/</li>
              <li>├── 📁 gallery/</li>
              <li>└── 📁 testimonials/</li>
            </ul>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 class="text-lg font-bold mb-3">How to Edit</h3>
            <ol class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>1. Edit markdown files in <code class="bg-gray-200 dark:bg-gray-600 px-1 rounded">content/</code></li>
              <li>2. Save changes</li>
              <li>3. Content updates automatically</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta tags
useHead({
  title: 'Admin - Portfolio',
  meta: [
    { name: 'description', content: 'Content management for portfolio.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>