<template>
  <div class="p-6 space-y-5">
    <div class="aspect-[16/9] bg-gradient-dev relative overflow-hidden rounded-xl">
      <img
        src="/images/homelab/screenshot-2025-10-16-at-13-06-43-jelly-seerr-allie-cat-cinema.png"
        alt="Abstract representation of code and development work"
        class="object-cover w-full h-full mix-blend-overlay opacity-70"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div class="absolute top-6 right-6 flex gap-3" aria-hidden="true">
        <div class="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
          <span class="i-lucide-code w-6 h-6 text-primary"/>
        </div>
        <div class="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
          <span class="i-lucide-monitor w-6 h-6 text-primary"/>
        </div>
      </div>
    </div>

    <h3 class="text-2xl font-bold text-default">Crafting Digital Experiences</h3>
    <p class="text-default leading-relaxed">
      I ship resilient full-stack platforms, data-rich dashboards, and immersive front-ends powered by Nuxt, Vue, TypeScript, and collaborative tooling.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 class="font-semibold text-default mb-3">Frontend Excellence</h4>
        <div class="flex flex-wrap gap-2">
          <span class="px-2 py-1 text-sm bg-green-100 text-green-800 rounded">Vue.js</span>
          <span class="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">Nuxt</span>
          <span class="px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded">TypeScript</span>
          <span class="px-2 py-1 text-sm bg-cyan-100 text-cyan-800 rounded">Tailwind</span>
        </div>
      </div>
      <div>
        <h4 class="font-semibold text-default mb-3">Backend & Tools</h4>
        <div class="flex flex-wrap gap-2">
          <span class="px-2 py-1 text-sm bg-purple-100 text-purple-800 rounded">Node.js</span>
          <span class="px-2 py-1 text-sm bg-red-100 text-red-800 rounded">Firebase</span>
          <span class="px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded">Docker</span>
          <span class="px-2 py-1 text-sm bg-primary/10 text-primary rounded">Git/CI</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3">
      <ContentButton to="#projects" variant="magnet" trailing-icon="i-lucide-arrow-down">
        Explore Projects
      </ContentButton>

      <ContentButton to="/contact" variant="outline">
        Collaborate
      </ContentButton>
    </div>
  </div>
</template>