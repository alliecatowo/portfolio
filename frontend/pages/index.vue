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
          Allison's Portfolio
        </h1>
        <p class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
          Software developer by day, tattoo artist by passion. Choose which side of my work you'd like to explore.
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

      <nav class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12" role="navigation" aria-label="Portfolio categories">
        <!-- Developer Portfolio Card -->
        <article class="group relative glass-accent rounded-xl overflow-hidden card-hover hover-lift" aria-labelledby="dev-title" aria-describedby="dev-description">
          <h2 id="dev-title" class="sr-only">Developer Portfolio</h2>
          
          <figure class="aspect-video bg-gradient-dev relative">
            <img src="https://picsum.photos/800/450?random=100" 
                 alt="Abstract representation of code and development work" 
                 class="object-cover w-full h-full mix-blend-overlay opacity-60"
                 loading="lazy" />
            <figcaption class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <span class="text-2xl md:text-3xl font-bold text-white" aria-hidden="true">Developer Portfolio</span>
            </figcaption>
            <!-- Decorative icon -->
            <div class="absolute top-4 right-4 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center float-animation shadow-lg" aria-hidden="true">
              <UIcon name="i-lucide-code" class="w-6 h-6 text-pink-500 dark:text-pink-400" />
            </div>
          </figure>
          
          <section class="p-6 bg-gradient-card">
            <p id="dev-description" class="text-default mb-6">
              Full-stack developer specializing in modern web and mobile applications. 
              View my projects, skills, and development approach.
            </p>
            
            <ul class="flex flex-wrap gap-2 mb-6" role="list" aria-label="Development skills">
              <li><span class="inline-block px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">JavaScript</span></li>
              <li><span class="inline-block px-3 py-1 text-sm bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">Vue.js</span></li>
              <li><span class="inline-block px-3 py-1 text-sm bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full">Node.js</span></li>
              <li><span class="inline-block px-3 py-1 text-sm bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full">TypeScript</span></li>
            </ul>
            
            <NuxtLink to="/dev" 
                      class="block w-full px-6 py-3 text-center font-semibold text-white bg-primary rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all btn-depth magnetic-hover"
                      aria-label="Explore developer portfolio">
              Explore Developer Work
              <span aria-hidden="true" class="inline-block ml-2">→</span>
            </NuxtLink>
          </section>
        </article>

        <!-- Tattoo Portfolio Card -->
        <article class="group relative glass-accent rounded-xl overflow-hidden card-hover hover-lift" aria-labelledby="tattoo-title" aria-describedby="tattoo-description">
          <h2 id="tattoo-title" class="sr-only">Tattoo Portfolio</h2>
          
          <figure class="aspect-video bg-gradient-tattoo relative">
            <img src="https://picsum.photos/800/450?random=200" 
                 alt="Abstract representation of tattoo art and designs" 
                 class="object-cover w-full h-full mix-blend-overlay opacity-60"
                 loading="lazy" />
            <figcaption class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <span class="text-2xl md:text-3xl font-bold text-white" aria-hidden="true">Tattoo Portfolio</span>
            </figcaption>
            <!-- Decorative icon -->
            <div class="absolute top-4 right-4 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center float-animation shadow-lg" style="animation-delay: 1s;" aria-hidden="true">
              <UIcon name="i-lucide-brush" class="w-6 h-6 text-pink-500 dark:text-pink-400" />
            </div>
          </figure>
          
          <section class="p-6 bg-gradient-card">
            <p id="tattoo-description" class="text-default mb-6">
              Custom tattoo designs focusing on fine line, watercolor, and botanical styles.
              View my art gallery, styles, and booking information.
            </p>
            
            <ul class="flex flex-wrap gap-2 mb-6" role="list" aria-label="Tattoo styles">
              <li><span class="inline-block px-3 py-1 text-sm bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full">Fine Line</span></li>
              <li><span class="inline-block px-3 py-1 text-sm bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full">Watercolor</span></li>
              <li><span class="inline-block px-3 py-1 text-sm bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full">Botanical</span></li>
              <li><span class="inline-block px-3 py-1 text-sm bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">Custom</span></li>
            </ul>
            
            <NuxtLink to="/tattoo" 
                      class="block w-full px-6 py-3 text-center font-semibold text-white bg-primary rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all btn-depth magnetic-hover"
                      aria-label="Explore tattoo portfolio">
              Explore Tattoo Work
              <span aria-hidden="true" class="inline-block ml-2">→</span>
            </NuxtLink>
          </section>
        </article>
      </nav>

      <aside class="mt-20 text-center" role="complementary">
        <p class="text-muted">
          Want to know more about me? 
          <NuxtLink to="/about" 
                    class="text-primary font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded transition-all">
            View my about page
          </NuxtLink>
        </p>
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
// Set site metadata
useHead({
  title: "Allison's Portfolio - Developer & Tattoo Artist",
  meta: [
    { 
      name: 'description', 
      content: 'Explore the dual-natured portfolio of Allison - software developer and tattoo artist showcasing professional and creative work.' 
    },
    {
      name: 'keywords',
      content: 'developer, tattoo artist, portfolio, web development, tattoo designs, software engineer'
    },
    {
      property: 'og:title',
      content: "Allison's Portfolio - Developer & Tattoo Artist"
    },
    {
      property: 'og:description',
      content: 'Explore the dual-natured portfolio of Allison - software developer and tattoo artist showcasing professional and creative work.'
    }
  ]
});

// Use a neutral site config for the landing page
const config = useSiteConfig();
config.value = {
  ...config.value,
  title: "Allison's Portfolio",
  description: "Software developer and tattoo artist portfolio",
  type: 'dual',
};
</script>