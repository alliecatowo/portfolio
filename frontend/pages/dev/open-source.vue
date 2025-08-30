<template>
  <div>
    <section class="py-12 md:py-20">
      <UContainer>
        <!-- Header -->
        <div class="max-w-4xl mx-auto text-center mb-10">
          <h1 class="text-4xl md:text-5xl font-bold mb-3 text-primary">Open Source Contributions</h1>
          <p class="text-lg text-muted">
            Contributing to the community through code, documentation, and collaboration.
          </p>
        </div>

        <!-- Why I Contribute Section -->
        <UCard class="max-w-4xl mx-auto mb-12 glass">
          <template #header>
            <h2 class="text-2xl font-semibold flex items-center gap-2">
              <UIcon name="i-lucide-heart" class="text-primary" />
              Why I Contribute to Open Source
            </h2>
          </template>
          <p class="mb-4 text-default">
            I believe in the power of collaborative development and the open source ethos. 
            Contributing to open source projects allows me to give back to the community, 
            learn from other developers, and help build the tools that power the web.
          </p>
          <p class="text-muted">
            Below you'll find some of the projects I've contributed to and the types of 
            contributions I've made. From bug fixes to feature implementations and documentation 
            improvements, I'm always looking for ways to help improve the tools we all rely on.
          </p>
        </UCard>

        <!-- Active Contributions -->
        <h2 class="text-3xl font-bold mb-6 text-primary text-center">Active Contributions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <!-- Vue.js Contribution -->
          <UCard class="glass card-hover group">
            <template #header>
              <div class="flex justify-between items-start">
                <h3 class="text-xl font-semibold text-primary">Vue.js</h3>
                <UBadge color="primary" variant="soft">Active Contributor</UBadge>
              </div>
            </template>
            <p class="text-muted mb-4">
              Contributed to Vue.js core and documentation, focusing on performance optimizations and fixing edge case bugs.
            </p>
            <div class="mb-4">
              <h4 class="font-medium mb-2 text-default">Contributions:</h4>
              <ul class="list-disc pl-5 text-muted space-y-1">
                <li>Fixed reactivity issues in deep nested objects</li>
                <li>Improved TypeScript definitions</li>
                <li>Added examples to documentation</li>
              </ul>
            </div>
            <template #footer>
              <UButton 
                to="https://github.com/vuejs/vue" 
                target="_blank" 
                variant="outline" 
                color="primary" 
                icon="i-lucide-github"
                external
              >
                View on GitHub
              </UButton>
            </template>
          </UCard>

          <!-- Nuxt.js Contribution -->
          <UCard class="glass card-hover group">
            <template #header>
              <div class="flex justify-between items-start">
                <h3 class="text-xl font-semibold text-primary">Nuxt.js</h3>
                <UBadge color="primary" variant="soft">Contributor</UBadge>
              </div>
            </template>
            <p class="text-muted mb-4">
              Contributed to Nuxt.js modules and helped improve build performance for large applications.
            </p>
            <div class="mb-4">
              <h4 class="font-medium mb-2 text-default">Contributions:</h4>
              <ul class="list-disc pl-5 text-muted space-y-1">
                <li>Created a custom module for enhanced SEO capabilities</li>
                <li>Optimized image loading strategies</li>
                <li>Fixed build issues for deployments on Vercel</li>
              </ul>
            </div>
            <template #footer>
              <UButton 
                to="https://github.com/nuxt/nuxt" 
                target="_blank" 
                variant="outline" 
                color="primary" 
                icon="i-lucide-github"
                external
              >
                View on GitHub
              </UButton>
            </template>
          </UCard>
        </div>

        <!-- Personal Projects -->
        <h2 class="text-3xl font-bold mb-6 text-primary text-center">Personal Open Source Projects</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Vue Component Library -->
          <UCard class="overflow-hidden glass card-hover group" :ui="{ body: 'p-0' }">
            <div class="relative aspect-video bg-gradient-card overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center">
                <UIcon name="i-lucide-code" class="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-colors" />
              </div>
              <div class="absolute top-3 right-3">
                <UBadge color="primary" variant="solid">Library</UBadge>
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-xl font-semibold mb-2 text-primary">Vue Component Library</h3>
              <p class="text-muted mb-4">
                A collection of reusable Vue components built with accessibility and performance in mind.
              </p>
              <div class="flex items-center gap-2 text-sm text-muted mb-4">
                <UIcon name="i-lucide-star" class="text-yellow-500" />
                <span>245 stars</span>
                <UIcon name="i-lucide-git-fork" class="text-primary ml-2" />
                <span>42 forks</span>
              </div>
              <div class="flex gap-2">
                <UButton variant="solid" color="primary" icon="i-lucide-github" size="sm" block>
                  GitHub
                </UButton>
                <UButton variant="outline" color="primary" icon="i-lucide-external-link" size="sm">
                  Demo
                </UButton>
              </div>
            </div>
          </UCard>

          <!-- API Security Toolkit -->
          <UCard class="overflow-hidden glass card-hover group" :ui="{ body: 'p-0' }">
            <div class="relative aspect-video bg-gradient-card overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center">
                <UIcon name="i-lucide-shield" class="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-colors" />
              </div>
              <div class="absolute top-3 right-3">
                <UBadge color="primary" variant="solid">Security</UBadge>
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-xl font-semibold mb-2 text-primary">API Security Toolkit</h3>
              <p class="text-muted mb-4">
                A set of tools and middleware for securing Node.js APIs with rate limiting, JWT validation, and more.
              </p>
              <div class="flex items-center gap-2 text-sm text-muted mb-4">
                <UIcon name="i-lucide-star" class="text-yellow-500" />
                <span>189 stars</span>
                <UIcon name="i-lucide-git-fork" class="text-primary ml-2" />
                <span>28 forks</span>
              </div>
              <div class="flex gap-2">
                <UButton variant="solid" color="primary" icon="i-lucide-github" size="sm" block>
                  GitHub
                </UButton>
                <UButton variant="outline" color="primary" icon="i-lucide-package" size="sm">
                  NPM
                </UButton>
              </div>
            </div>
          </UCard>

          <!-- Headless CMS Starter -->
          <UCard class="overflow-hidden glass card-hover group" :ui="{ body: 'p-0' }">
            <div class="relative aspect-video bg-gradient-card overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center">
                <UIcon name="i-lucide-layout-dashboard" class="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-colors" />
              </div>
              <div class="absolute top-3 right-3">
                <UBadge color="primary" variant="solid">Template</UBadge>
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-xl font-semibold mb-2 text-primary">Headless CMS Starter</h3>
              <p class="text-muted mb-4">
                A customizable starter template for integrating Nuxt with various headless CMS platforms.
              </p>
              <div class="flex items-center gap-2 text-sm text-muted mb-4">
                <UIcon name="i-lucide-star" class="text-yellow-500" />
                <span>312 stars</span>
                <UIcon name="i-lucide-git-fork" class="text-primary ml-2" />
                <span>67 forks</span>
              </div>
              <div class="flex gap-2">
                <UButton variant="solid" color="primary" icon="i-lucide-github" size="sm" block>
                  GitHub
                </UButton>
                <UButton variant="outline" color="primary" icon="i-lucide-external-link" size="sm">
                  Demo
                </UButton>
              </div>
            </div>
          </UCard>
        </div>

        <!-- GitHub Stats -->
        <div class="mt-16 text-center">
          <h2 class="text-2xl font-bold mb-6 text-primary">GitHub Activity</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <UCard class="text-center glass">
              <div class="text-3xl font-bold text-primary">523</div>
              <div class="text-sm text-muted">Contributions</div>
            </UCard>
            <UCard class="text-center glass">
              <div class="text-3xl font-bold text-primary">42</div>
              <div class="text-sm text-muted">Pull Requests</div>
            </UCard>
            <UCard class="text-center glass">
              <div class="text-3xl font-bold text-primary">87</div>
              <div class="text-sm text-muted">Issues</div>
            </UCard>
            <UCard class="text-center glass">
              <div class="text-3xl font-bold text-primary">15</div>
              <div class="text-sm text-muted">Repositories</div>
            </UCard>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup>
// Set page metadata
useHead({
  title: 'Open Source - Allison.dev',
  meta: [
    { name: 'description', content: 'My open source contributions and projects. Contributing to the developer community through code, documentation, and collaboration.' }
  ]
});
</script>