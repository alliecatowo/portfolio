<template>
  <main class="min-h-screen bg-gradient-animated bg-dots flex items-center justify-center relative overflow-hidden">
    <!-- Decorative background - hidden from screen readers -->
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse pulse-glow"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse float-animation" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl float-animation" style="animation-delay: 4s;"></div>
      <div class="absolute bottom-1/3 right-1/3 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl sparkle-element" style="animation-delay: 1s;"></div>
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
        <article class="group relative glass-accent rounded-xl overflow-hidden card-hover hover-lift mb-12" aria-labelledby="main-dev-title" aria-describedby="main-dev-description">
          <figure class="aspect-[16/9] md:aspect-[21/9] bg-gradient-dev relative">
            <NuxtImg
src="https://picsum.photos/1200/600?random=100" 
                 alt="Abstract representation of code and development work"
                 loading="lazy"
                 preset="hero"
                 sizes="100vw lg:1200px"
                 class="object-cover w-full h-full mix-blend-overlay opacity-60" />
            <figcaption class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
              <div class="w-full">
                <h3 id="main-dev-title" class="text-3xl md:text-4xl font-bold text-white mb-4">
                  Crafting Digital Experiences
                </h3>
                <p class="text-white/90 text-lg md:text-xl max-w-2xl">
                  Passionate about building scalable applications, elegant user interfaces, and solving complex technical challenges.
                </p>
              </div>
            </figcaption>
            <!-- Decorative icons -->
            <div class="absolute top-6 right-6 flex gap-3" aria-hidden="true">
              <div class="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center float-animation shadow-lg">
                <UIcon name="i-lucide-code" class="w-6 h-6 text-primary" />
              </div>
              <div class="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center float-animation shadow-lg" style="animation-delay: 0.5s;">
                <UIcon name="i-lucide-monitor" class="w-6 h-6 text-primary" />
              </div>
            </div>
          </figure>
          
          <section class="p-8 bg-gradient-card">
            <p id="main-dev-description" class="text-default text-lg mb-8">
              Specializing in modern web technologies with expertise in Vue.js, Node.js, and full-stack development. 
              I love creating intuitive interfaces and robust backend systems that scale.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 class="font-semibold text-default mb-3">Frontend Excellence</h4>
                <ul class="flex flex-wrap gap-2">
                  <li><span class="inline-block px-3 py-2 text-sm bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">Vue.js</span></li>
                  <li><span class="inline-block px-3 py-2 text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">Nuxt</span></li>
                  <li><span class="inline-block px-3 py-2 text-sm bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full">TypeScript</span></li>
                  <li><span class="inline-block px-3 py-2 text-sm bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full">Tailwind</span></li>
                </ul>
              </div>
              <div>
                <h4 class="font-semibold text-default mb-3">Backend & Tools</h4>
                <ul class="flex flex-wrap gap-2">
                  <li><span class="inline-block px-3 py-2 text-sm bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full">Node.js</span></li>
                  <li><span class="inline-block px-3 py-2 text-sm bg-red-500/10 text-red-600 dark:text-red-400 rounded-full">Firebase</span></li>
                  <li><span class="inline-block px-3 py-2 text-sm bg-gray-500/10 text-gray-600 dark:text-gray-400 rounded-full">Docker</span></li>
                  <li><span class="inline-block px-3 py-2 text-sm bg-primary/10 text-primary rounded-full">Git/CI</span></li>
                </ul>
              </div>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4">
              <a
                href="#projects" 
                class="flex-1 px-6 py-4 text-center font-semibold text-white bg-primary rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all btn-depth magnetic-hover"
                aria-label="View featured projects">
                View My Work
                <span aria-hidden="true" class="inline-block ml-2">↓</span>
              </a>
              <NuxtLink
to="/about" 
                        class="flex-1 px-6 py-4 text-center font-semibold text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all"
                        aria-label="Learn more about me">
                About Me
              </NuxtLink>
            </div>
          </section>
        </article>
        
        <!-- Quick Links Grid -->
        <nav class="grid grid-cols-1 md:grid-cols-3 gap-6" role="navigation" aria-label="Quick navigation">
          <a
            href="#projects" 
                    class="group p-6 glass-accent rounded-lg card-hover hover-lift transition-all"
                    aria-label="View projects">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <UIcon name="i-lucide-folder-code" class="w-5 h-5 text-primary" />
              </div>
              <h3 class="font-semibold text-default">Projects</h3>
            </div>
            <p class="text-muted text-sm">Explore my latest work and technical projects</p>
          </a>
          
          <a
            href="#blog" 
                    class="group p-6 glass-accent rounded-lg card-hover hover-lift transition-all"
                    aria-label="Read blog">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <UIcon name="i-lucide-book-open" class="w-5 h-5 text-primary" />
              </div>
              <h3 class="font-semibold text-default">Blog</h3>
            </div>
            <p class="text-muted text-sm">Technical insights and development thoughts</p>
          </a>
          
          <NuxtLink
to="/contact" 
                    class="group p-6 glass-accent rounded-lg card-hover hover-lift transition-all"
                    aria-label="Get in touch">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <UIcon name="i-lucide-message-circle" class="w-5 h-5 text-primary" />
              </div>
              <h3 class="font-semibold text-default">Contact</h3>
            </div>
            <p class="text-muted text-sm">Let's discuss your next project</p>
          </NuxtLink>
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

        <div v-if="featuredProjects && featuredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article 
            v-for="(project, index) in featuredProjects" 
            :key="project.slug || project.path || project.title" 
            class="group glass-accent rounded-xl overflow-hidden card-hover hover-lift"
          >
            <figure class="aspect-video bg-gradient-dev relative">
              <NuxtImg 
                preset="card"
                :src="project.image || `https://picsum.photos/400/300?random=${index + 20}`" 
                :alt="project.title" 
                class="object-cover w-full h-full mix-blend-overlay opacity-70"
                loading="lazy"
                sizes="sm:100vw md:50vw lg:33vw"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                <UIcon name="i-lucide-external-link" class="w-5 h-5 text-primary" />
              </div>
            </figure>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 text-default group-hover:text-primary transition-colors">
                {{ project.title }}
              </h3>
              <p class="text-muted mb-4 line-clamp-2">
                {{ project.description }}
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="(tech, techIndex) in project.technologies?.slice(0, 3)" 
                  :key="techIndex"
                  class="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {{ tech }}
                </span>
              </div>
              <NuxtLink 
                :to="`/projects/${project.slug || project.path?.split('/').pop()}`" 
                class="inline-flex items-center font-semibold text-primary hover:text-primary-600 transition-colors"
              >
                View Project
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>
            </div>
          </article>
        </div>

        <div v-else class="py-12 text-center">
          <UIcon name="i-lucide-folder" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" aria-hidden="true" />
          <p class="text-muted text-lg">Featured projects coming soon...</p>
        </div>

        <div class="mt-12 text-center">
          <NuxtLink 
            to="/projects" 
            class="px-8 py-4 text-white bg-primary rounded-lg hover:bg-primary-600 font-semibold transition-all btn-depth magnetic-hover"
          >
            View All Projects
            <span aria-hidden="true" class="inline-block ml-2">→</span>
          </NuxtLink>
        </div>
      </section>

      <!-- Skills Section -->
      <section class="max-w-6xl mx-auto mt-24 glass-accent rounded-xl p-8 md:p-12" aria-labelledby="skills-title">
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
      </section>

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
          <article 
            v-for="(post, index) in recentPosts" 
            :key="post.slug || post.path" 
            class="group glass-accent rounded-xl overflow-hidden card-hover hover-lift"
          >
            <figure class="aspect-video bg-gradient-card relative">
              <NuxtImg 
                preset="blogCard"
                :src="post.featured_image || `https://picsum.photos/400/300?random=${index + 30}`" 
                :alt="post.title" 
                class="object-cover w-full h-full mix-blend-overlay opacity-70"
                loading="lazy"
                sizes="sm:100vw md:50vw lg:33vw"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                <UIcon name="i-lucide-book-open" class="w-5 h-5 text-primary" />
              </div>
            </figure>
            <div class="p-6">
              <div class="text-sm text-muted mb-2 flex items-center gap-2">
                <UIcon name="i-lucide-calendar" class="w-3 h-3" />
                {{ new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
              </div>
              <h3 class="text-xl font-bold mb-3 text-default group-hover:text-primary transition-colors">
                {{ post.title }}
              </h3>
              <p class="text-muted mb-4 line-clamp-2">
                {{ post.description }}
              </p>
              <NuxtLink 
                :to="`/blog/${post.slug || post.path?.split('/').pop()}`" 
                class="inline-flex items-center font-semibold text-primary hover:text-primary-600 transition-colors"
              >
                Read More
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>
            </div>
          </article>
        </div>

        <div v-else class="py-12 text-center">
          <UIcon name="i-lucide-book-open" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" aria-hidden="true" />
          <p class="text-muted text-lg">Blog posts coming soon...</p>
        </div>

        <div class="mt-12 text-center">
          <NuxtLink 
            to="/blog" 
            class="px-8 py-4 text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 font-semibold transition-all"
          >
            View All Articles
            <span aria-hidden="true" class="inline-block ml-2">→</span>
          </NuxtLink>
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
            <NuxtLink
              to="/contact" 
              class="px-8 py-4 text-white bg-primary rounded-lg hover:bg-primary-600 font-semibold transition-all btn-depth magnetic-hover"
            >
              <UIcon name="i-lucide-mail" class="w-5 h-5 mr-2" />
              Get In Touch
            </NuxtLink>
            <NuxtLink
              to="/about" 
              class="px-8 py-4 text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 font-semibold transition-all"
            >
              Learn More About Me
            </NuxtLink>
          </div>
        </div>
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
// Set site metadata
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

// Import content utilities
import { useContent } from '~/composables/useContent';

// Use developer-focused site config for the unified portfolio
const config = useSiteConfig();
config.value = {
  ...config.value,
  title: "Allison's Developer Portfolio",
  description: "Full-stack developer specializing in modern web technologies and creative problem solving",
  type: 'dual',
};

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