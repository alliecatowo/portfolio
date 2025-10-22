<template>
  <main class="min-h-screen bg-gradient-animated bg-dots relative overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"/>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"/>
    </div>

    <div class="relative z-10 container max-w-6xl mx-auto px-6 py-20">
      <header class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 text-gradient-animated">{{ data?.title || 'Get In Touch' }}</h1>
        <p class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
          {{ data?.description || "I'm always interested in new opportunities and collaborations. Let's discuss how we can work together." }}
        </p>
      </header>

      <!-- Render the Markdown content -->
      <ContentRenderer :value="data" />
    </div>
  </main>
</template>

<script setup lang="ts">
// Fetch the contact content
const { data } = await useAsyncData('contact-page', () => {
  return queryCollection('contact').path('/contact').first()
})

// Meta tags
useHead({
  title: data.value?.title ? `${data.value.title} | Allison's Developer Portfolio` : "Contact | Allison's Developer Portfolio",
  meta: [
    {
      name: 'description',
      content: data.value?.description || 'Get in touch with Allison for web development projects, collaborations, or consultations.'
    }
  ]
})
</script>
