<template>
  <UPage>
    <UMain class="min-h-screen bg-gradient-animated bg-dots flex items-center justify-center relative overflow-hidden">
    <!-- Decorative background - hidden from screen readers -->
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse pulse-glow"/>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse float-animation" style="animation-delay: 2s;"/>
      <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl float-animation" style="animation-delay: 4s;"/>
      <div class="absolute bottom-1/3 right-1/3 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl sparkle-element" style="animation-delay: 1s;"/>
    </div>
    
    <section class="container max-w-5xl px-6 py-20 relative z-20" aria-labelledby="page-title">
      <header class="text-center mb-16 relative z-30">
        <h1 id="page-title" class="text-5xl md:text-6xl font-bold mb-6 text-gradient-animated relative z-40" style="isolation: isolate;">
          Allison's Developer Portfolio
        </h1>
        <p class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
          Full-stack developer specializing in modern web technologies, creative problem solving, and building exceptional user experiences.
        </p>
        <aside class="mt-8 text-sm text-muted" role="note" aria-label="Keyboard shortcut">
          <span class="inline-flex items-center gap-2">
            Press
            <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500" aria-label="Command or Control key">⌘</kbd>
            <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500" aria-label="K key">K</kbd>
            to open quick search
          </span>
        </aside>
      </header>

      <!-- Enhanced Developer Showcase -->
      <section class="max-w-4xl mx-auto" aria-labelledby="showcase-title">
        <h2 id="showcase-title" class="sr-only">Developer Showcase</h2>
        
        <!-- Main Developer Card -->
        <UCard class="glass-accent mb-12">
          <template #header>
            <div class="aspect-[16/9] md:aspect-[21/9] bg-gradient-dev relative overflow-hidden rounded-lg">
              <NuxtImg
                src="https://picsum.photos/1200/600?random=100"
                alt="Abstract representation of code and development work"
                loading="lazy"
                preset="hero"
                sizes="100vw lg:1200px"
                class="object-cover w-full h-full mix-blend-overlay opacity-60" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <div class="w-full">
                  <h3 id="main-dev-title" class="text-3xl md:text-4xl font-bold text-white mb-4">
                    Crafting Digital Experiences
                  </h3>
                  <p class="text-white/90 text-lg md:text-xl max-w-2xl">
                    Passionate about building scalable applications, elegant user interfaces, and solving complex technical challenges.
                  </p>
                </div>
              </div>
              <div class="absolute top-6 right-6 flex gap-3" aria-hidden="true">
                <div class="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center float-animation shadow-lg">
                  <UIcon name="i-lucide-code" class="w-6 h-6 text-primary" />
                </div>
                <div class="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center float-animation shadow-lg" style="animation-delay: 0.5s;">
                  <UIcon name="i-lucide-monitor" class="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </template>

          <p id="main-dev-description" class="text-default text-lg mb-8">
            Specializing in modern web technologies with expertise in Vue.js, Node.js, and full-stack development.
            I love creating intuitive interfaces and robust backend systems that scale.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 class="font-semibold text-default mb-3">Frontend Excellence</h4>
              <ul class="flex flex-wrap gap-2">
                <li><UBadge color="green" variant="soft">Vue.js</UBadge></li>
                <li><UBadge color="blue" variant="soft">Nuxt</UBadge></li>
                <li><UBadge color="yellow" variant="soft">TypeScript</UBadge></li>
                <li><UBadge color="cyan" variant="soft">Tailwind</UBadge></li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold text-default mb-3">Backend & Tools</h4>
              <ul class="flex flex-wrap gap-2">
                <li><UBadge color="purple" variant="soft">Node.js</UBadge></li>
                <li><UBadge color="red" variant="soft">Firebase</UBadge></li>
                <li><UBadge color="gray" variant="soft">Docker</UBadge></li>
                <li><UBadge color="primary" variant="soft">Git/CI</UBadge></li>
              </ul>
            </div>
          </div>
            
          <template #footer>
            <div class="flex flex-col sm:flex-row gap-4">
              <UButton
                to="#projects"
                color="primary"
                size="lg"
                block
                class="flex-1"
                trailing-icon="i-lucide-arrow-down"
              >
                View My Work
              </UButton>
              <UButton
                to="/about"
                color="primary"
                variant="outline"
                size="lg"
                block
                class="flex-1"
              >
                About Me
              </UButton>
            </div>
          </template>
        </UCard>
        
        <!-- Quick Links Grid -->
        <nav class="grid grid-cols-1 md:grid-cols-3 gap-6" role="navigation" aria-label="Quick navigation">
          <UCard class="glass-accent hover:scale-105 transition-transform" to="#projects">
            <div class="flex items-center gap-4 mb-3">
              <UIcon name="i-lucide-folder-code" class="w-5 h-5 text-primary" />
              <h3 class="font-semibold text-default">Projects</h3>
            </div>
            <p class="text-muted text-sm">Explore my latest work and technical projects</p>
          </UCard>

          <UCard class="glass-accent hover:scale-105 transition-transform" to="#blog">
            <div class="flex items-center gap-4 mb-3">
              <UIcon name="i-lucide-book-open" class="w-5 h-5 text-primary" />
              <h3 class="font-semibold text-default">Blog</h3>
            </div>
            <p class="text-muted text-sm">Technical insights and development thoughts</p>
          </UCard>

          <UCard class="glass-accent hover:scale-105 transition-transform" to="/contact">
            <div class="flex items-center gap-4 mb-3">
              <UIcon name="i-lucide-message-circle" class="w-5 h-5 text-primary" />
              <h3 class="font-semibold text-default">Contact</h3>
            </div>
            <p class="text-muted text-sm">Let's discuss your next project</p>
          </UCard>
        </nav>
      </section>

      <!-- Featured Projects Section -->
      <section id="projects" class="max-w-6xl mx-auto mt-24" aria-labelledby="projects-title">
        <div class="mb-16 text-center">
          <h2 id="projects-title" class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated">
            Featured Projects
          </h2>
          <p class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
            Innovative solutions and technical showcases
          </p>
        </div>

        <UCarousel
          v-if="featuredProjects && featuredProjects.length > 0"
          :items="featuredProjects"
          :ui="{
            item: 'basis-full md:basis-1/2 lg:basis-1/3',
            container: 'gap-8',
            wrapper: 'mx-auto'
          }"
          arrows
          :prev="{ icon: 'i-lucide-chevron-left', size: 'sm', variant: 'outline' }"
          :next="{ icon: 'i-lucide-chevron-right', size: 'sm', variant: 'outline' }"
        >
          <template #default="{ item: project, index }">
            <UCard
              class="glass-accent hover:scale-105 transition-transform group"
              :to="`/projects/${project.slug || project.path?.split('/').pop()}`"
            >
              <template #header>
                <div class="aspect-video bg-gradient-dev relative overflow-hidden rounded-lg">
                  <NuxtImg
                    preset="card"
                    :src="project.image || `https://picsum.photos/400/300?random=${index + 20}`"
                    :alt="project.title"
                    class="object-cover w-full h-full mix-blend-overlay opacity-70 group-hover:opacity-90 transition-opacity"
                    loading="lazy"
                    sizes="sm:100vw md:50vw lg:33vw"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                  <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <UIcon name="i-lucide-external-link" class="w-5 h-5 text-white" />
                  </div>
                </div>
              </template>

              <h3 class="text-xl font-bold mb-3 text-default">
                {{ project.title }}
              </h3>
              <p class="text-muted mb-4 line-clamp-2">
                {{ project.description }}
              </p>

              <template #footer>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    v-for="(tech, techIndex) in project.technologies?.slice(0, 3)"
                    :key="techIndex"
                    color="primary"
                    variant="soft"
                    size="sm"
                  >
                    {{ tech }}
                  </UBadge>
                </div>
              </template>
            </UCard>
          </template>
        </UCarousel>

        <div v-else class="py-12 text-center">
          <UIcon name="i-lucide-folder" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" aria-hidden="true" />
          <p class="text-muted text-lg">Featured projects coming soon...</p>
        </div>

        <div class="mt-12 text-center">
          <UButton
            to="/projects"
            color="primary"
            size="lg"
            trailing-icon="i-lucide-arrow-right"
          >
            View All Projects
          </UButton>
        </div>
      </section>

      <!-- Skills Section -->
      <UCard class="max-w-6xl mx-auto mt-24 glass-accent" aria-labelledby="skills-title">
        <div class="mb-16 text-center">
          <h2 id="skills-title" class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated">
            Technical Skills
          </h2>
          <p class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
            Technologies and tools I use to build exceptional experiences
          </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center group">
            <div class="w-20 h-20 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <UIcon name="i-lucide-monitor" class="w-10 h-10 text-primary" />
            </div>
            <h3 class="font-semibold text-default mb-2">Frontend</h3>
            <p class="text-sm text-muted">Vue, Nuxt, React, TypeScript, Tailwind</p>
          </div>
          
          <div class="text-center group">
            <div class="w-20 h-20 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <UIcon name="i-lucide-server" class="w-10 h-10 text-primary" />
            </div>
            <h3 class="font-semibold text-default mb-2">Backend</h3>
            <p class="text-sm text-muted">Node.js, Express, PostgreSQL, MongoDB</p>
          </div>
          
          <div class="text-center group">
            <div class="w-20 h-20 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <UIcon name="i-lucide-cloud" class="w-10 h-10 text-primary" />
            </div>
            <h3 class="font-semibold text-default mb-2">Cloud & DevOps</h3>
            <p class="text-sm text-muted">Firebase, Docker, CI/CD, Git</p>
          </div>
          
          <div class="text-center group">
            <div class="w-20 h-20 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <UIcon name="i-lucide-smartphone" class="w-10 h-10 text-primary" />
            </div>
            <h3 class="font-semibold text-default mb-2">Mobile & PWA</h3>
            <p class="text-sm text-muted">React Native, Progressive Web Apps</p>
          </div>
        </div>
      </UCard>

      <!-- Recent Blog Posts -->
      <section id="blog" class="max-w-6xl mx-auto mt-24" aria-labelledby="blog-title">
        <div class="mb-16 text-center">
          <h2 id="blog-title" class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated">
            Latest Insights
          </h2>
          <p class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
            Thoughts on development, technology, and innovation
          </p>
        </div>

        <div v-if="recentPosts && recentPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <UBlogPost
            v-for="(post, index) in recentPosts"
            :key="post.slug || post.path"
            :title="post.title"
            :description="post.description"
            :date="post.date"
            :image="post.featured_image || `https://picsum.photos/400/300?random=${index + 30}`"
            :to="`/blog/${post.slug || post.path?.split('/').pop()}`"
            variant="outline"
            orientation="vertical"
            class="glass-accent hover:scale-105 transition-transform"
          />
        </div>

        <div v-else class="py-12 text-center">
          <UIcon name="i-lucide-book-open" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" aria-hidden="true" />
          <p class="text-muted text-lg">Blog posts coming soon...</p>
        </div>

        <div class="mt-12 text-center">
          <UButton
            to="/blog"
            color="primary"
            variant="outline"
            size="lg"
            trailing-icon="i-lucide-arrow-right"
          >
            View All Articles
          </UButton>
        </div>
      </section>

      <!-- Contact CTA -->
      <aside class="max-w-4xl mx-auto mt-24 mb-16">
        <div class="glass-accent rounded-xl p-8 md:p-12 text-center hover-lift">
          <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated">
            Let's Build Something Amazing
          </h2>
          <p class="text-xl md:text-2xl text-default max-w-2xl mx-auto mb-8">
            Ready to bring your ideas to life? Let's discuss your next project.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              to="/contact"
              color="primary"
              size="lg"
              leading-icon="i-lucide-mail"
              class="btn-depth magnetic-hover"
            >
              Get In Touch
            </UButton>
            <UButton
              to="/about"
              color="primary"
              variant="outline"
              size="lg"
            >
              Learn More About Me
            </UButton>
          </div>
        </div>
      </aside>
    </section>
    </UMain>
  </UPage>
</template>

<script setup lang="ts">
// Set site metadata
// Import content utilities
import { useContent } from '~/composables/useContent';

useHead({
  title: "Allison's Developer Portfolio - Full-Stack Web Development",
  meta: [
    { 
      name: 'description', 
      content: 'Full-stack developer specializing in modern web technologies, Vue.js, Node.js, and creating exceptional user experiences.' 
    },
    {
      name: 'keywords',
      content: 'developer, portfolio, web development, Vue.js, Node.js, TypeScript, full-stack, software engineer'
    },
    {
      property: 'og:title',
      content: "Allison's Developer Portfolio - Full-Stack Web Development"
    },
    {
      property: 'og:description',
      content: 'Full-stack developer specializing in modern web technologies, Vue.js, Node.js, and creating exceptional user experiences.'
    }
  ]
});


// Use content composable to fetch featured content
const { fetchProjects, fetchBlogPosts } = useContent();

// Fetch featured projects and recent blog posts
const { data: featuredProjects } = await useAsyncData(
  'home-featured-projects',
  () => fetchProjects(3, true)
);

const { data: recentPosts } = await useAsyncData(
  'home-recent-posts',
  () => fetchBlogPosts(3)
);


</script>