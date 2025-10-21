<template>
  <section class="mt-16 lg:mt-20">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gradient-animated">
        Crafting Digital Experiences
      </h2>
      <p class="text-lg md:text-xl text-default leading-relaxed mb-8">
        I ship resilient full-stack platforms, data-rich dashboards, and immersive front-ends powered by Nuxt, Vue, TypeScript, and collaborative tooling.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 class="font-semibold text-default mb-4">Frontend Excellence</h3>
          <div class="flex flex-wrap gap-2 justify-center md:justify-start">
            <UBadge color="green" variant="soft">Vue.js</UBadge>
            <UBadge color="blue" variant="soft">Nuxt</UBadge>
            <UBadge color="yellow" variant="soft">TypeScript</UBadge>
            <UBadge color="cyan" variant="soft">Tailwind</UBadge>
          </div>
        </div>
        <div>
          <h3 class="font-semibold text-default mb-4">Backend & Tools</h3>
          <div class="flex flex-wrap gap-2 justify-center md:justify-start">
            <UBadge color="purple" variant="soft">Node.js</UBadge>
            <UBadge color="red" variant="soft">Firebase</UBadge>
            <UBadge color="gray" variant="soft">Docker</UBadge>
            <UBadge color="primary" variant="soft">Git/CI</UBadge>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <ContentButton to="#projects" variant="magnet" trailing-icon="i-lucide-arrow-down">
          Explore Projects
        </ContentButton>
        <ContentButton to="/contact" variant="outline">
          Collaborate
        </ContentButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>