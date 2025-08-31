<template>
  <main class="min-h-screen bg-gradient-animated bg-dots relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/3 right-1/4 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl float-animation"></div>
    </div>

    <div class="relative z-10">
      <!-- Hero Section with Photo -->
      <section class="py-20 md:py-32">
        <div class="container max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Left: Photo and Quick Info -->
            <div class="relative">
              <div class="relative z-10">
                <!-- Profile Image Container -->
                <div class="relative mx-auto w-80 h-80 md:w-96 md:h-96">
                  <!-- Decorative rings -->
                  <div class="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-pink-500 to-purple-600 animate-spin-slow opacity-20"></div>
                  <div class="absolute inset-4 rounded-full bg-gradient-to-l from-primary via-purple-600 to-pink-500 animate-spin-reverse opacity-20"></div>
                  
                  <!-- Main image -->
                  <div class="relative w-full h-full rounded-full overflow-hidden glass-accent p-2">
                    <NuxtImg 
                      src="https://picsum.photos/500/500?random=profile" 
                      alt="Allison - Full-Stack Developer"
                      class="w-full h-full rounded-full object-cover"
                      loading="eager"
                      preset="avatar"
                    />
                  </div>
                  
                  <!-- Status badge -->
                  <div class="absolute bottom-4 right-4 glass-strong px-4 py-2 rounded-full flex items-center gap-2">
                    <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span class="text-sm font-medium">Available for projects</span>
                  </div>
                </div>
                
                <!-- Quick stats -->
                <div class="grid grid-cols-3 gap-4 mt-8">
                  <div class="text-center glass-accent rounded-lg p-4 hover-lift">
                    <div class="text-2xl font-bold text-primary">5+</div>
                    <div class="text-sm text-muted">Years Experience</div>
                  </div>
                  <div class="text-center glass-accent rounded-lg p-4 hover-lift">
                    <div class="text-2xl font-bold text-primary">50+</div>
                    <div class="text-sm text-muted">Projects Completed</div>
                  </div>
                  <div class="text-center glass-accent rounded-lg p-4 hover-lift">
                    <div class="text-2xl font-bold text-primary">∞</div>
                    <div class="text-sm text-muted">Coffee Consumed</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Introduction -->
            <div>
              <h1 class="text-5xl md:text-6xl font-bold mb-6 text-gradient-animated">
                Hi, I'm Allison
              </h1>
              <p class="text-2xl md:text-3xl text-default mb-6">
                Full-Stack Developer & Creative Technologist
              </p>
              <div class="prose prose-lg text-default max-w-none">
                <p class="mb-6">
                  I craft exceptional digital experiences that blend beautiful design with powerful functionality. 
                  With expertise spanning modern web technologies, I transform complex problems into elegant, 
                  user-friendly solutions.
                </p>
                <p class="mb-8">
                  Whether it's building scalable applications, optimizing performance, or creating intuitive interfaces, 
                  I bring passion, precision, and creativity to every project.
                </p>
              </div>
              
              <!-- CTA Buttons -->
              <div class="flex flex-wrap gap-4">
                <NuxtLink 
                  to="/projects" 
                  class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 font-semibold transition-all btn-depth magnetic-hover"
                >
                  <UIcon name="i-lucide-folder" class="w-5 h-5 mr-2" />
                  View My Work
                </NuxtLink>
                <NuxtLink 
                  to="/contact" 
                  class="px-6 py-3 text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 font-semibold transition-all"
                >
                  <UIcon name="i-lucide-mail" class="w-5 h-5 mr-2" />
                  Get In Touch
                </NuxtLink>
                <a 
                  href="/resume.pdf" 
                  class="px-6 py-3 text-muted hover:text-default font-semibold transition-colors flex items-center"
                  download
                >
                  <UIcon name="i-lucide-download" class="w-5 h-5 mr-2" />
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Journey Timeline -->
      <section class="py-20 relative">
        <div class="container max-w-6xl mx-auto px-6">
          <h2 class="text-4xl md:text-5xl font-bold mb-16 text-center text-gradient-animated">
            My Journey
          </h2>
          
          <div class="relative">
            <!-- Timeline line -->
            <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-purple-500 to-pink-500 opacity-20"></div>
            
            <!-- Timeline items -->
            <div class="space-y-12">
              <div class="flex items-center justify-center">
                <div class="relative glass-accent rounded-xl p-8 max-w-2xl hover-lift">
                  <div class="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-primary rounded-full border-4 border-white dark:border-gray-900"></div>
                  <h3 class="text-xl font-bold mb-2 text-primary">The Beginning</h3>
                  <p class="text-default">
                    Started my coding journey as a teenager, customizing MySpace profiles and building simple websites. 
                    What began as curiosity quickly became a passion for creating digital experiences.
                  </p>
                </div>
              </div>
              
              <div class="flex items-center justify-center">
                <div class="relative glass-accent rounded-xl p-8 max-w-2xl hover-lift">
                  <div class="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-purple-500 rounded-full border-4 border-white dark:border-gray-900"></div>
                  <h3 class="text-xl font-bold mb-2 text-purple-500">Computer Science Degree</h3>
                  <p class="text-default">
                    Formalized my knowledge with a CS degree, diving deep into algorithms, data structures, 
                    and software engineering principles that form the foundation of my work today.
                  </p>
                </div>
              </div>
              
              <div class="flex items-center justify-center">
                <div class="relative glass-accent rounded-xl p-8 max-w-2xl hover-lift">
                  <div class="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-pink-500 rounded-full border-4 border-white dark:border-gray-900"></div>
                  <h3 class="text-xl font-bold mb-2 text-pink-500">Professional Growth</h3>
                  <p class="text-default">
                    Worked with startups and established companies across e-commerce, education, healthcare, 
                    and finance sectors. Each project expanded my skills and perspective.
                  </p>
                </div>
              </div>
              
              <div class="flex items-center justify-center">
                <div class="relative glass-accent rounded-xl p-8 max-w-2xl hover-lift animate-pulse-subtle">
                  <div class="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-primary to-pink-500 rounded-full border-4 border-white dark:border-gray-900 animate-pulse"></div>
                  <h3 class="text-xl font-bold mb-2 text-gradient">Today & Beyond</h3>
                  <p class="text-default">
                    Continuing to push boundaries, learn new technologies, and create meaningful solutions. 
                    Always excited about the next challenge and opportunity to make an impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Skills Showcase -->
      <section class="py-20 glass-accent">
        <div class="container max-w-7xl mx-auto px-6">
          <h2 class="text-4xl md:text-5xl font-bold mb-16 text-center text-gradient-animated">
            Technical Arsenal
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Frontend -->
            <div class="group relative">
              <div class="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div class="relative glass-strong rounded-xl p-6 h-full hover-lift">
                <div class="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UIcon name="i-lucide-monitor" class="w-8 h-8 text-primary" />
                </div>
                <h3 class="text-xl font-bold mb-4 text-primary">Frontend Magic</h3>
                <ul class="space-y-2 text-default">
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    Vue.js / Nuxt 3
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    React / Next.js
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    TypeScript
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    Tailwind CSS
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    Three.js / WebGL
                  </li>
                </ul>
              </div>
            </div>

            <!-- Backend -->
            <div class="group relative">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div class="relative glass-strong rounded-xl p-6 h-full hover-lift">
                <div class="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UIcon name="i-lucide-server" class="w-8 h-8 text-purple-500" />
                </div>
                <h3 class="text-xl font-bold mb-4 text-purple-500">Backend Power</h3>
                <ul class="space-y-2 text-default">
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    Node.js / Express
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    GraphQL / REST
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    PostgreSQL
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    MongoDB
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    Redis
                  </li>
                </ul>
              </div>
            </div>

            <!-- DevOps -->
            <div class="group relative">
              <div class="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div class="relative glass-strong rounded-xl p-6 h-full hover-lift">
                <div class="w-16 h-16 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UIcon name="i-lucide-cloud" class="w-8 h-8 text-pink-500" />
                </div>
                <h3 class="text-xl font-bold mb-4 text-pink-500">Cloud & DevOps</h3>
                <ul class="space-y-2 text-default">
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    Docker / K8s
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    AWS / GCP
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    CI/CD Pipelines
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    Firebase
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    Vercel / Netlify
                  </li>
                </ul>
              </div>
            </div>

            <!-- Tools -->
            <div class="group relative">
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-500 to-primary rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div class="relative glass-strong rounded-xl p-6 h-full hover-lift">
                <div class="w-16 h-16 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UIcon name="i-lucide-wrench" class="w-8 h-8 text-yellow-500" />
                </div>
                <h3 class="text-xl font-bold mb-4 text-yellow-500">Tools & More</h3>
                <ul class="space-y-2 text-default">
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    Git / GitHub
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    Jest / Vitest
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    Cypress / Playwright
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    Figma
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500" />
                    AI Tools
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Personal Interests -->
      <section class="py-20">
        <div class="container max-w-6xl mx-auto px-6">
          <h2 class="text-4xl md:text-5xl font-bold mb-16 text-center text-gradient-animated">
            Beyond the Code
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="glass-accent rounded-xl overflow-hidden hover-lift group">
              <div class="aspect-video bg-gradient-to-br from-primary/20 to-purple-600/20 relative">
                <NuxtImg 
                  src="https://picsum.photos/400/300?random=hobby1" 
                  alt="Photography"
                  class="w-full h-full object-cover mix-blend-overlay"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <UIcon name="i-lucide-camera" class="absolute bottom-4 right-4 w-8 h-8 text-white/80" />
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2 text-primary">Photography</h3>
                <p class="text-muted">
                  Capturing moments and perspectives through the lens. Love exploring urban landscapes and nature.
                </p>
              </div>
            </div>

            <div class="glass-accent rounded-xl overflow-hidden hover-lift group">
              <div class="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-500/20 relative">
                <NuxtImg 
                  src="https://picsum.photos/400/300?random=hobby2" 
                  alt="Hiking"
                  class="w-full h-full object-cover mix-blend-overlay"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <UIcon name="i-lucide-mountain" class="absolute bottom-4 right-4 w-8 h-8 text-white/80" />
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2 text-purple-500">Hiking & Nature</h3>
                <p class="text-muted">
                  Finding balance and inspiration in nature. Weekend hikes help clear my mind and spark creativity.
                </p>
              </div>
            </div>

            <div class="glass-accent rounded-xl overflow-hidden hover-lift group">
              <div class="aspect-video bg-gradient-to-br from-pink-500/20 to-yellow-500/20 relative">
                <NuxtImg 
                  src="https://picsum.photos/400/300?random=hobby3" 
                  alt="Cat companions"
                  class="w-full h-full object-cover mix-blend-overlay"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <UIcon name="i-lucide-heart" class="absolute bottom-4 right-4 w-8 h-8 text-white/80" />
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2 text-pink-500">Cat Parent</h3>
                <p class="text-muted">
                  Proud parent to Pixel and Vector - my debugging companions who ensure no keyboard goes unsat upon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Connect CTA -->
      <section class="py-20">
        <div class="container max-w-4xl mx-auto px-6">
          <div class="glass-accent rounded-2xl p-8 md:p-12 text-center hover-lift">
            <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated">
              Let's Create Something Amazing
            </h2>
            <p class="text-xl text-default mb-8 max-w-2xl mx-auto">
              I'm always excited about new challenges and collaborations. 
              Whether you have a project in mind or just want to connect, I'd love to hear from you.
            </p>
            
            <div class="flex flex-wrap gap-4 justify-center mb-8">
              <NuxtLink 
                to="/contact" 
                class="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-600 font-semibold transition-all btn-depth magnetic-hover"
              >
                <UIcon name="i-lucide-mail" class="w-5 h-5 mr-2" />
                Get In Touch
              </NuxtLink>
              <NuxtLink 
                to="/projects" 
                class="px-8 py-4 text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 font-semibold transition-all"
              >
                <UIcon name="i-lucide-folder" class="w-5 h-5 mr-2" />
                View Projects
              </NuxtLink>
            </div>
            
            <!-- Social Links -->
            <div class="flex justify-center gap-6">
              <a 
                href="https://github.com/alliecatowo" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="w-12 h-12 glass-strong rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors group"
                aria-label="GitHub"
              >
                <UIcon name="i-lucide-github" class="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
              </a>
              <a 
                href="https://linkedin.com/in/allison" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="w-12 h-12 glass-strong rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors group"
                aria-label="LinkedIn"
              >
                <UIcon name="i-lucide-linkedin" class="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
              </a>
              <a 
                href="https://twitter.com/allison" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="w-12 h-12 glass-strong rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors group"
                aria-label="Twitter"
              >
                <UIcon name="i-lucide-twitter" class="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
              </a>
              <a 
                href="mailto:dev@allisons.dev" 
                class="w-12 h-12 glass-strong rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors group"
                aria-label="Email"
              >
                <UIcon name="i-lucide-mail" class="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Set site config
const siteConfig = useSiteConfig();
siteConfig.value = {
  ...siteConfig.value,
  type: 'dual'
};

// Meta tags
useHead({
  title: `About Me - ${siteConfig.value?.title || 'Allison\'s Developer Portfolio'}`,
  meta: [
    { 
      name: 'description', 
      content: 'Learn about Allison - a passionate full-stack developer with expertise in modern web technologies, creating exceptional digital experiences.' 
    },
    {
      name: 'keywords',
      content: 'full-stack developer, web developer, Vue.js, React, Node.js, TypeScript, portfolio, about'
    }
  ]
});
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-spin-reverse {
  animation: spin-reverse 25s linear infinite;
}

@keyframes pulse-subtle {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 3s ease-in-out infinite;
}

.float-animation {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>