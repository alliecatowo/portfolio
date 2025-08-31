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
              <NuxtLink
to="/dev" 
                        class="flex-1 px-6 py-4 text-center font-semibold text-white bg-primary rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all btn-depth magnetic-hover"
                        aria-label="Explore developer portfolio">
                View My Work
                <span aria-hidden="true" class="inline-block ml-2">→</span>
              </NuxtLink>
              <NuxtLink
to="/dev/about" 
                        class="flex-1 px-6 py-4 text-center font-semibold text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all"
                        aria-label="Learn more about me">
                About Me
              </NuxtLink>
            </div>
          </section>
        </article>
        
        <!-- Quick Links Grid -->
        <nav class="grid grid-cols-1 md:grid-cols-3 gap-6" role="navigation" aria-label="Quick navigation">
          <NuxtLink
to="/dev/projects" 
                    class="group p-6 glass-accent rounded-lg card-hover hover-lift transition-all"
                    aria-label="View projects">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <UIcon name="i-lucide-folder-code" class="w-5 h-5 text-primary" />
              </div>
              <h3 class="font-semibold text-default">Projects</h3>
            </div>
            <p class="text-muted text-sm">Explore my latest work and technical projects</p>
          </NuxtLink>
          
          <NuxtLink
to="/dev/blog" 
                    class="group p-6 glass-accent rounded-lg card-hover hover-lift transition-all"
                    aria-label="Read blog">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <UIcon name="i-lucide-book-open" class="w-5 h-5 text-primary" />
              </div>
              <h3 class="font-semibold text-default">Blog</h3>
            </div>
            <p class="text-muted text-sm">Technical insights and development thoughts</p>
          </NuxtLink>
          
          <NuxtLink
to="/dev/contact" 
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

      <aside class="mt-16 text-center">
        <div class="glass-accent rounded-lg p-6 max-w-2xl mx-auto">
          <p class="text-muted mb-4">
            Interested in working together? Let's build something amazing.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink
to="/dev/contact" 
                      class="px-6 py-3 text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 font-medium transition-all">
              Get In Touch
            </NuxtLink>
            <NuxtLink
to="/dev/about" 
                      class="px-6 py-3 text-muted hover:text-default font-medium transition-colors">
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

// Use developer-focused site config for the landing page
const config = useSiteConfig();
config.value = {
  ...config.value,
  title: "Allison's Developer Portfolio",
  description: "Full-stack developer specializing in modern web technologies and creative problem solving",
  type: 'dual',
};
</script>