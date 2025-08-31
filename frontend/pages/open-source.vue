<template>
  <div class="min-h-screen bg-gradient-animated bg-dots">
    <div class="container max-w-6xl mx-auto px-6 py-12">
      <header class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-gradient-animated">Open Source Contributions</h1>
        <p class="text-xl text-default">Projects I've contributed to and maintain</p>
      </header>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article 
          v-for="repo in repositories" 
          :key="repo.id"
          class="glass-accent rounded-xl p-6 hover-lift"
        >
          <div class="flex items-start justify-between mb-4">
            <UIcon name="i-lucide-book" class="w-6 h-6 text-primary" />
            <div class="flex items-center gap-2">
              <span v-if="repo.fork" class="text-xs text-muted">Fork</span>
              <span class="text-xs text-muted">{{ repo.language }}</span>
            </div>
          </div>
          
          <h3 class="text-xl font-bold mb-2">
            <a 
              :href="repo.html_url" 
              target="_blank"
              rel="noopener noreferrer"
              class="text-default hover:text-primary transition-colors"
            >
              {{ repo.name }}
            </a>
          </h3>
          
          <p class="text-muted mb-4 line-clamp-3">
            {{ repo.description || 'No description available' }}
          </p>
          
          <div class="flex items-center gap-4 text-sm text-muted">
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-star" class="w-4 h-4" />
              {{ repo.stargazers_count }}
            </span>
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-git-fork" class="w-4 h-4" />
              {{ repo.forks_count }}
            </span>
            <span v-if="repo.open_issues_count > 0" class="flex items-center gap-1">
              <UIcon name="i-lucide-circle-dot" class="w-4 h-4" />
              {{ repo.open_issues_count }}
            </span>
          </div>
        </article>
      </div>
      
      <div v-if="!repositories || repositories.length === 0" class="text-center py-12">
        <UIcon name="i-lucide-github" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
        <p class="text-xl text-muted">Loading open source projects...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// For now, using mock data - you can integrate with GitHub API later
const repositories = ref([
  {
    id: 1,
    name: 'portfolio-website',
    description: 'My personal portfolio website built with Nuxt 3 and TypeScript',
    html_url: 'https://github.com/alliecatowo/portfolio',
    stargazers_count: 12,
    forks_count: 3,
    open_issues_count: 0,
    language: 'TypeScript',
    fork: false
  },
  {
    id: 2,
    name: 'vue-component-library',
    description: 'A collection of reusable Vue 3 components',
    html_url: 'https://github.com/alliecatowo/vue-components',
    stargazers_count: 45,
    forks_count: 8,
    open_issues_count: 2,
    language: 'Vue',
    fork: false
  },
  {
    id: 3,
    name: 'awesome-nuxt',
    description: 'Contributing to the awesome Nuxt.js resources list',
    html_url: 'https://github.com/nuxt/awesome',
    stargazers_count: 1200,
    forks_count: 150,
    open_issues_count: 5,
    language: 'Markdown',
    fork: true
  }
]);

// Meta tags
useHead({
  title: 'Open Source | Allison\'s Developer Portfolio',
  meta: [
    { name: 'description', content: 'Open source projects and contributions' }
  ]
});
</script>