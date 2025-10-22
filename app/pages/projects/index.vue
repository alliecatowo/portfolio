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
        <UBlogPost
          v-for="(project, index) in projects"
          :key="project.slug || project.path || project.title"
          :title="project.title"
          :description="project.description"
          :image="project.image || `https://picsum.photos/400/300?random=${index + 20}`"
          :to="`/projects/${project.slug}`"
          variant="soft"
          class="glass-accent hover:scale-105 transition-transform"
        >
          <template #footer>
            <div v-if="project.technologies?.length" class="flex flex-wrap gap-2 mb-4">
              <UBadge
                v-for="tech in project.technologies.slice(0, 4)"
                :key="tech"
                variant="soft"
                size="sm"
                class="capitalize"
              >
                {{ tech }}
              </UBadge>
              <UBadge
                v-if="project.technologies.length > 4"
                variant="soft"
                color="gray"
                size="sm"
              >
                +{{ project.technologies.length - 4 }} more
              </UBadge>
            </div>

            <div class="flex items-center justify-end">
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
          </template>
        </UBlogPost>
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
            <UButton
              to="/contact"
              color="primary"
              variant="magnet"
              size="lg"
              leading-icon="i-lucide-mail"
            >
              Get In Touch
            </UButton>
            <UButton
              to="/about"
              color="primary"
              variant="outline"
              size="lg"
              leading-icon="i-lucide-user"
            >
              About Me
            </UButton>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
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