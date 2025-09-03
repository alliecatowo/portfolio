<template>
  <div class="min-h-screen bg-gradient-animated">
    <div class="container max-w-4xl mx-auto px-6 py-12">
      <NuxtLink to="/projects" class="inline-flex items-center text-primary hover:text-primary-600 mb-6">
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4 mr-2" />
        Back to Projects
      </NuxtLink>
      
      <article v-if="project" class="glass-accent rounded-xl p-8">
        <header class="mb-8">
          <h1 class="text-4xl font-bold mb-4 text-gradient-animated">{{ project.title }}</h1>
          <p class="text-xl text-default">{{ project.description }}</p>
          
          <div v-if="project.technologies" class="flex flex-wrap gap-2 mt-4">
            <span 
              v-for="tech in project.technologies" 
              :key="tech"
              class="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
            >
              {{ tech }}
            </span>
          </div>
        </header>
        
        <div v-if="project.image" class="mb-8">
          <NuxtImg 
            :src="project.image" 
            :alt="project.title"
            class="w-full rounded-lg shadow-lg"
            loading="eager"
            preset="hero"
          />
        </div>
        
        <ContentRenderer v-if="project.body" :value="project" class="prose prose-lg dark:prose-invert max-w-none mb-8" />
        <div v-else class="prose prose-lg dark:prose-invert max-w-none mb-8">
          {{ project.description }}
        </div>
        
        <footer class="flex flex-wrap gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <a 
            v-if="project.demo" 
            :href="project.demo" 
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 font-semibold transition-all"
          >
            <UIcon name="i-lucide-external-link" class="w-4 h-4 mr-2" />
            Live Demo
          </a>
          
          <a 
            v-if="project.github" 
            :href="project.github" 
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-6 py-3 text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 font-semibold transition-all"
          >
            <UIcon name="i-lucide-github" class="w-4 h-4 mr-2" />
            View on GitHub
          </a>
        </footer>
      </article>
      
      <div v-else class="text-center py-12">
        <p class="text-xl text-muted">Project not found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const projectId = route.params.id as string;

// Fetch the project
const { data: project } = await useAsyncData(
  `project-${projectId}`,
  () => queryCollection('projects').where('slug', '=', projectId).first()
);

// Meta tags
useHead({
  title: project.value?.title ? `${project.value.title} | Projects` : 'Project',
  meta: [
    { name: 'description', content: project.value?.description || 'Project details' }
  ]
});
</script>