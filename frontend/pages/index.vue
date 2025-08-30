<template>
  <div class="min-h-screen bg-gradient-animated bg-dots flex items-center justify-center relative overflow-hidden">
    <!-- Enhanced floating background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse pulse-glow"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse float-animation" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl float-animation" style="animation-delay: 4s;"></div>
      <div class="absolute bottom-1/3 right-1/3 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl sparkle-element" style="animation-delay: 1s;"></div>
    </div>
    
    <div class="container max-w-5xl px-6 py-20 relative z-20">
      <div class="text-center mb-16 relative z-30">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 text-gradient-animated relative z-40" style="isolation: isolate;">
          Allison's Portfolio
        </h1>
        <p class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
          Software developer by day, tattoo artist by passion. Choose which side of my work you'd like to explore.
        </p>
        <div class="mt-8 text-sm text-muted flex items-center justify-center gap-2">
          <UKbd size="sm">⌘</UKbd>
          <UKbd size="sm">K</UKbd>
          <span>to open quick search</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <!-- Developer Portfolio Card -->
        <div class="group relative glass-accent rounded-xl overflow-hidden card-hover hover-lift sparkle-element">
          <NuxtLink to="/dev" class="absolute inset-0 z-10">
            <span class="sr-only">Go to Developer Portfolio</span>
          </NuxtLink>
          <div class="aspect-video bg-gradient-dev relative">
            <img src="https://picsum.photos/800/450?random=100" alt="Developer Portfolio" class="object-cover w-full h-full mix-blend-overlay opacity-60" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 pointer-events-none">
              <h2 class="text-2xl md:text-3xl font-bold text-white">Developer Portfolio</h2>
            </div>
            <!-- Floating code icon -->
            <div class="absolute top-4 right-4 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center float-animation shadow-lg">
              <UIcon name="i-lucide-code" class="w-6 h-6 text-pink-500 dark:text-pink-400" />
            </div>
          </div>
          <div class="p-6 bg-gradient-card">
            <p class="text-default mb-6">
              Full-stack developer specializing in modern web and mobile applications. 
              View my projects, skills, and development approach.
            </p>
            <div class="flex flex-wrap gap-2 mb-6">
              <UBadge variant="soft" color="primary">JavaScript</UBadge>
              <UBadge variant="soft" color="success">Vue.js</UBadge>
              <UBadge variant="soft" color="secondary">Node.js</UBadge>
              <UBadge variant="soft" color="warning">TypeScript</UBadge>
            </div>
            <div class="relative z-20">
              <UButton to="/dev" color="primary" variant="solid" size="lg" class="w-full btn-depth magnetic-hover">
                Explore Developer Work
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </UButton>
            </div>
          </div>
        </div>

        <!-- Tattoo Portfolio Card -->
        <div class="group relative glass-accent rounded-xl overflow-hidden card-hover hover-lift sparkle-element">
          <NuxtLink to="/tattoo" class="absolute inset-0 z-10">
            <span class="sr-only">Go to Tattoo Portfolio</span>
          </NuxtLink>
          <div class="aspect-video bg-gradient-tattoo relative">
            <img src="https://picsum.photos/800/450?random=200" alt="Tattoo Portfolio" class="object-cover w-full h-full mix-blend-overlay opacity-60" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 pointer-events-none">
              <h2 class="text-2xl md:text-3xl font-bold text-white">Tattoo Portfolio</h2>
            </div>
            <!-- Floating brush icon -->
            <div class="absolute top-4 right-4 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center float-animation shadow-lg" style="animation-delay: 1s;">
              <UIcon name="i-lucide-brush" class="w-6 h-6 text-pink-500 dark:text-pink-400" />
            </div>
          </div>
          <div class="p-6 bg-gradient-card">
            <p class="text-default mb-6">
              Custom tattoo designs focusing on fine line, watercolor, and botanical styles.
              View my art gallery, styles, and booking information.
            </p>
            <div class="flex flex-wrap gap-2 mb-6">
              <UBadge variant="soft" color="pink">Fine Line</UBadge>
              <UBadge variant="soft" color="purple">Watercolor</UBadge>
              <UBadge variant="soft" color="amber">Botanical</UBadge>
              <UBadge variant="soft" color="emerald">Custom</UBadge>
            </div>
            <div class="relative z-20">
              <UButton to="/tattoo" color="primary" variant="solid" size="lg" class="w-full btn-depth magnetic-hover">
                Explore Tattoo Work
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-20 text-center">
        <p class="text-muted">
          Want to know more about me? <NuxtLink to="/about" class="text-primary font-medium hover:underline transition-all">View my about page</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set site metadata
useHead({
  title: "Allison's Portfolio - Developer & Tattoo Artist",
  meta: [
    { 
      name: 'description', 
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
