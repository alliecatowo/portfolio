<template>
  <main class="min-h-screen bg-gradient-animated bg-dots relative overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"/>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"/>
    </div>

    <div class="relative z-10 container max-w-7xl mx-auto px-6 py-20">
      <header class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 text-gradient-animated">My Projects</h1>
        <p class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
          A showcase of my development work, from web applications to open-source contributions
        </p>
      </header>
      
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="n in 6" :key="n" class="glass-accent rounded-xl overflow-hidden animate-pulse">
          <div class="aspect-video bg-gray-300 dark:bg-gray-600"/>
          <div class="p-6">
            <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3"/>
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"/>
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"/>
          </div>
        </div>
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <UIcon name="i-lucide-alert-circle" class="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h2 class="text-2xl font-bold mb-2 text-default">Something went wrong</h2>
        <p class="text-muted">{{ error.message || 'Failed to load projects' }}</p>
      </div>
      
      <div v-else-if="!projects?.length" class="text-center py-12">
        <UIcon name="i-lucide-folder-open" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
        <h2 class="text-2xl font-bold mb-2 text-default">No projects found</h2>
        <p class="text-muted">Check back soon for new projects!</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="project in projects" 
          :key="project.slug || project.path || project.title" 
          class="group glass-accent rounded-xl overflow-hidden hover-lift"
        >
          <div class="aspect-video bg-gradient-dev relative overflow-hidden">
            <NuxtImg 
              v-if="project.image" 
              :src="project.image" 
              :alt="project.title"
              loading="lazy"
              preset="card"
              sizes="sm:100vw md:50vw lg:33vw"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
              <UIcon name="i-lucide-code" class="w-12 h-12 text-primary opacity-50" />
            </div>
            
            <!-- Overlay with project type -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="absolute bottom-4 left-4">
                <span class="px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-sm font-medium rounded-full">
                  Project
                </span>
              </div>
              <div class="absolute bottom-4 right-4">
                <UIcon name="i-lucide-external-link" class="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <h2 class="text-xl font-bold mb-3 text-default group-hover:text-primary transition-colors">
              {{ project.title }}
            </h2>
            <p class="text-muted mb-4 line-clamp-3">
              {{ project.description }}
            </p>
            
            <div v-if="project.technologies?.length" class="flex flex-wrap gap-2 mb-4">
              <ColoredTag
                v-for="tech in project.technologies.slice(0, 4)" 
                :key="tech"
                :tag="tech"
              />
              <span v-if="project.technologies.length > 4" class="px-2 py-1 text-xs text-muted">
                +{{ project.technologies.length - 4 }} more
              </span>
            </div>
            
            <div class="flex items-center justify-between">
              <NuxtLink 
                :to="`/projects/${project.slug || project.path?.split('/').pop()}`" 
                class="inline-flex items-center text-primary hover:text-primary-600 font-medium transition-colors group/link"
              >
                View Details
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
              </NuxtLink>
              
              <div class="flex items-center gap-2">
                <a 
                  v-if="project.demo" 
                  :href="project.demo" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-2 text-muted hover:text-primary transition-colors"
                  title="Live Demo"
                  :aria-label="`View live demo of ${project.title}`"
                >
                  <UIcon name="i-lucide-external-link" class="w-4 h-4" />
                </a>
                
                <a 
                  v-if="project.github" 
                  :href="project.github" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-2 text-muted hover:text-primary transition-colors"
                  title="Source Code"
                  :aria-label="`View source code of ${project.title}`"
                >
                  <UIcon name="i-lucide-github" class="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
      
      <!-- Featured Call-to-Action -->
      <section class="mt-20 text-center">
        <div class="glass-accent rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
          <h2 class="text-3xl font-bold mb-4 text-gradient-animated">Interested in Working Together?</h2>
          <p class="text-xl text-default mb-6">
            These projects showcase my skills and passion for creating exceptional digital experiences. 
            Let's discuss your next project.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <NuxtLink 
              to="/contact" 
              class="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-600 font-semibold transition-all btn-depth magnetic-hover"
            >
              <UIcon name="i-lucide-mail" class="w-5 h-5 mr-2" />
              Get In Touch
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              class="px-8 py-4 text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 font-semibold transition-all"
            >
              <UIcon name="i-lucide-user" class="w-5 h-5 mr-2" />
              About Me
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import ColoredTag from '~/components/common/ColoredTag.vue'

// Fetch all projects
const { data: projects, pending, error } = await useAsyncData(
  'all-projects',
  () => queryCollection('projects')
    .where('status', '<>', 'draft')
    .order('featured', 'DESC')
    .order('date', 'DESC')
    .all()
);

// Meta tags
useHead({
  title: 'Projects | Allison\'s Developer Portfolio',
  meta: [
    { 
      name: 'description', 
      content: 'Browse through my development projects including web applications, open-source contributions, and creative technical solutions.' 
    },
    {
      name: 'keywords',
      content: 'projects, portfolio, web development, Vue.js, React, Node.js, open source'
    }
  ]
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>