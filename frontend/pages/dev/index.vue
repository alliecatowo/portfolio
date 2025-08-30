<template>
  <div class="min-h-screen bg-gradient-animated">
    <div class="container-custom py-12">
      <!-- Hero Section -->
      <section class="py-16 md:py-24">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h1 class="text-4xl md:text-5xl font-bold mb-6 text-primary">
              Full-Stack Developer
            </h1>
            <p class="text-lg md:text-xl mb-8 text-default">
              Specializing in modern web technologies, creative solutions, and clean, efficient code that brings ideas to life.
            </p>
            <div class="flex flex-wrap gap-3">
              <UButton to="/dev/projects" color="primary" variant="solid">
                <UIcon name="i-lucide-folder" class="w-4 h-4 mr-2" />
                View Projects
              </UButton>
              <UButton to="/dev/contact" color="primary" variant="outline">
                <UIcon name="i-lucide-mail" class="w-4 h-4 mr-2" />
                Contact Me
              </UButton>
            </div>
          </div>
          <div class="md:w-1/2 rounded-xl overflow-hidden card-hover glass">
            <div class="aspect-video bg-gradient-dev relative">
              <img src="https://picsum.photos/800/450?random=1" alt="Developer Hero Image" class="object-cover w-full h-full mix-blend-overlay opacity-60" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div class="text-white">
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-lucide-code" class="w-5 h-5" />
                    <span class="text-sm font-medium">Full-Stack Developer</span>
                  </div>
                  <div class="text-xs opacity-80">Building modern web experiences</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Projects Section -->
      <section class="py-12 md:py-16">
        <div class="mb-12 text-center">
          <h2 class="text-3xl font-bold text-primary mb-2">Featured Projects</h2>
          <p class="text-muted max-w-2xl mx-auto">Check out some of my recent work and innovative solutions</p>
        </div>

        <div v-if="featuredProjects && featuredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="(project, index) in featuredProjects" 
            :key="project.slug || project.path || project.title" 
            class="glass rounded-xl overflow-hidden card-hover"
          >
            <div class="aspect-video bg-gradient-card relative">
              <img 
                :src="project.image || `https://picsum.photos/400/300?random=${index + 2}`" 
                :alt="project.title" 
                class="object-cover w-full h-full mix-blend-overlay opacity-70"
              />
              <div class="absolute top-4 right-4 glass-strong p-2 rounded-full">
                <UIcon name="i-lucide-external-link" class="w-4 h-4 text-primary" />
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-primary">
                {{ project.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                {{ project.description }}
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <UBadge 
                  v-for="(tech, techIndex) in project.technologies" 
                  :key="techIndex"
                  variant="soft"
                  color="primary"
                  size="sm"
                >
                  {{ tech }}
                </UBadge>
              </div>
              <UButton :to="`/dev/projects/${project.slug || project.path?.split('/').pop()}`" color="primary" variant="solid" size="sm" block>
                View Project
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-2" />
              </UButton>
            </div>
          </div>
        </div>

        <div v-else class="py-8 flex justify-center">
          <p class="text-gray-500 dark:text-gray-400">Featured projects will appear here when added.</p>
        </div>

        <div class="mt-8 text-center">
          <UButton to="/dev/projects" color="primary" variant="outline">
            <UIcon name="i-lucide-folder" class="w-4 h-4 mr-2" />
            View All Projects
          </UButton>
        </div>
      </section>

      <!-- Skills Section -->
      <section class="py-12 md:py-16 glass rounded-xl">
        <div class="container mx-auto px-4">
          <div class="mb-12 text-center">
            <h2 class="text-3xl font-bold text-primary mb-2">My Skills</h2>
            <p class="text-muted max-w-2xl mx-auto">Technologies and tools I work with to build exceptional digital experiences</p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="flex flex-col items-center glass-strong p-6 rounded-xl card-hover">
              <div class="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <UIcon name="i-lucide-monitor" class="w-8 h-8 text-primary dark:text-white" />
              </div>
              <h3 class="text-lg font-semibold mb-2 text-primary">Frontend</h3>
              <p class="text-center text-muted text-sm">Vue, Nuxt, React, TypeScript, Tailwind CSS</p>
            </div>
            
            <div class="flex flex-col items-center glass-strong p-6 rounded-xl card-hover">
              <div class="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <UIcon name="i-lucide-server" class="w-8 h-8 text-primary dark:text-white" />
              </div>
              <h3 class="text-lg font-semibold mb-2 text-primary">Backend</h3>
              <p class="text-center text-muted text-sm">Node.js, Express, Strapi, PostgreSQL, MongoDB</p>
            </div>
            
            <div class="flex flex-col items-center glass-strong p-6 rounded-xl card-hover">
              <div class="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <UIcon name="i-lucide-smartphone" class="w-8 h-8 text-primary dark:text-white" />
              </div>
              <h3 class="text-lg font-semibold mb-2 text-primary">Mobile</h3>
              <p class="text-center text-muted text-sm">React Native, Progressive Web Apps</p>
            </div>
            
            <div class="flex flex-col items-center glass-strong p-6 rounded-xl card-hover">
              <div class="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <UIcon name="i-lucide-git-branch" class="w-8 h-8 text-primary dark:text-white" />
              </div>
              <h3 class="text-lg font-semibold mb-2 text-primary">DevOps</h3>
              <p class="text-center text-muted text-sm">Git, GitHub Actions, Docker, Vercel, AWS</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Blog Posts -->
      <section class="py-12 md:py-16">
        <div class="mb-12 text-center">
          <h2 class="text-3xl font-bold text-primary mb-2">Recent Articles</h2>
          <p class="text-muted max-w-2xl mx-auto">Thoughts and insights about development, technology, and innovation</p>
        </div>

        <div v-if="recentPosts && recentPosts.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="(post, index) in recentPosts" 
            :key="post.slug || post.path" 
            class="glass rounded-xl overflow-hidden card-hover"
          >
            <div class="aspect-video bg-gradient-card relative">
              <img 
                :src="post.featured_image || `https://picsum.photos/400/300?random=${index + 10}`" 
                :alt="post.title" 
                class="object-cover w-full h-full mix-blend-overlay opacity-70"
              />
              <div class="absolute top-4 right-4 glass-strong p-2 rounded-full">
                <UIcon name="i-lucide-book-open" class="w-4 h-4 text-primary" />
              </div>
            </div>
            <div class="p-6">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {{ new Date(post.date).toLocaleDateString() }}
              </div>
              <h3 class="text-xl font-bold mb-2 text-primary">
                {{ post.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                {{ post.description }}
              </p>
              <UButton :to="`/dev/blog/${post.slug || post.path?.split('/').pop()}`" color="primary" variant="solid" size="sm" block>
                Read More
              </UButton>
            </div>
          </div>
        </div>
        
        <div v-else class="py-8 flex justify-center">
          <p class="text-gray-500 dark:text-gray-400">Blog posts will appear here when published.</p>
        </div>

        <div class="mt-8 text-center">
          <UButton to="/dev/blog" color="primary" variant="outline">
            <UIcon name="i-lucide-pen-tool" class="w-4 h-4 mr-2" />
            View All Articles
          </UButton>
        </div>
      </section>

      <!-- Contact CTA -->
      <section class="py-12 md:py-16 glass-strong rounded-xl text-center card-hover">
        <h2 class="text-3xl font-bold text-primary mb-4">Let's Work Together</h2>
        <p class="text-default max-w-2xl mx-auto mb-8">
          Have a project idea or need a developer for your team? I'm always open to discussing new opportunities and challenges.
        </p>
        <UButton to="/dev/contact" color="primary" variant="solid" size="lg">
          <UIcon name="i-lucide-mail" class="w-4 h-4 mr-2" />
          Get in Touch
        </UButton>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useContent } from '~/composables/useContent';

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

// Use content composable
const { fetchProjects, fetchBlogPosts } = useContent();

// Fetch featured projects and recent blog posts
const { data: featuredProjects } = await useAsyncData(
  'dev-featured-projects',
  () => fetchProjects(3)
);

const { data: recentPosts } = await useAsyncData(
  'dev-recent-posts',
  () => fetchBlogPosts('dev', 3)
);
</script> 
