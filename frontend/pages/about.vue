<template>
  <div class="container-custom py-12">
    <h1 class="text-center mb-12">About Me</h1>
    
    <div class="grid md:grid-cols-3 gap-12">
      <!-- Sidebar / Image -->
      <div class="md:col-span-1">
        <div class="sticky top-24">
          <div class="rounded-lg overflow-hidden shadow-lg mb-6">
            <div 
              v-if="siteConfig.type === 'dev'" 
              class="w-full aspect-square bg-accent/50 dark:bg-accent-dark/50 flex items-center justify-center text-white"
            >
              Developer Portrait Placeholder
            </div>
            <div 
              v-else 
              class="w-full aspect-square bg-primary/50 dark:bg-primary-dark/50 flex items-center justify-center text-white"
            >
              Tattoo Artist Portrait Placeholder
            </div>
          </div>
          
          <div class="flex flex-wrap gap-4 mt-6 justify-center">
            <a 
              v-for="(link, platform) in siteConfig.socialLinks" 
              :key="platform" 
              :href="link" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-dark-primary"
            >
              <span class="capitalize">{{ platform }}</span>
            </a>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="md:col-span-2">
        <!-- Developer Bio -->
        <div v-if="siteConfig.type === 'dev'">
          <h2 class="text-2xl font-bold mb-6">Professional Journey</h2>
          <div class="prose dark:prose-invert max-w-none">
            <p class="mb-4">Hello! I'm Allison, a full-stack developer passionate about creating efficient, accessible, and beautiful web applications. My journey in tech began several years ago and has evolved into a career focused on building solutions that make a difference.</p>
            
            <p class="mb-4">I specialize in modern JavaScript frameworks like Vue.js and React, along with server-side technologies. I'm particularly interested in user experience, performance optimization, and building systems that scale.</p>
            
            <p class="mb-4">When I'm not coding, I express my creativity through tattoo art – my other passion which allows me to blend technical precision with artistic expression.</p>
            
            <h3 class="text-xl font-bold mt-8 mb-4">Education</h3>
            <ul class="list-disc pl-6 mb-6">
              <li>Bachelor of Science in Computer Science</li>
              <li>Various technical certifications and specialized courses</li>
            </ul>
            
            <h3 class="text-xl font-bold mt-8 mb-4">Professional Experience</h3>
            <div class="mb-6">
              <h4 class="text-lg font-bold">Senior Developer at Tech Company</h4>
              <p class="italic">2020 - Present</p>
              <p>Led development of several key products, managed team of junior developers, and implemented best practices.</p>
            </div>
            <div class="mb-6">
              <h4 class="text-lg font-bold">Developer at Another Company</h4>
              <p class="italic">2017 - 2020</p>
              <p>Worked on front-end applications, collaborated with UX team, and contributed to open source projects.</p>
            </div>
            
            <h3 class="text-xl font-bold mt-8 mb-4">My Approach</h3>
            <p>I believe in writing clean, maintainable code and building applications that are accessible to all users. I'm constantly learning and adapting to new technologies while maintaining a focus on fundamentals and best practices.</p>
          </div>
        </div>
        
        <!-- Tattoo Artist Bio -->
        <div v-else>
          <h2 class="text-2xl font-bold mb-6">Artistic Journey</h2>
          <div class="prose dark:prose-invert max-w-none">
            <p class="mb-4">Hello! I'm Allison, a tattoo artist with a passion for creating unique, meaningful art that my clients carry with them for life. My approach to tattooing balances technical precision with creative expression.</p>
            
            <p class="mb-4">I specialize in several styles including fine line work, illustrative designs, and watercolor techniques. Each piece I create is custom designed to reflect the individual story and aesthetic preferences of my clients.</p>
            
            <p class="mb-4">When I'm not tattooing, I work as a software developer – my other passion which gives me a unique perspective on combining technical precision with creative problem-solving.</p>
            
            <h3 class="text-xl font-bold mt-8 mb-4">Education & Training</h3>
            <ul class="list-disc pl-6 mb-6">
              <li>Professional apprenticeship under [Mentor Name]</li>
              <li>Fine arts background with focus on illustration</li>
              <li>Ongoing workshops and conventions to refine techniques</li>
            </ul>
            
            <h3 class="text-xl font-bold mt-8 mb-4">Studio Experience</h3>
            <div class="mb-6">
              <h4 class="text-lg font-bold">Resident Artist at Studio Name</h4>
              <p class="italic">2019 - Present</p>
              <p>Creating custom designs and building a clientele focused on illustrative and fine line work.</p>
            </div>
            <div class="mb-6">
              <h4 class="text-lg font-bold">Apprentice at Another Studio</h4>
              <p class="italic">2017 - 2019</p>
              <p>Learned fundamentals of tattooing, studio hygiene, and customer relations.</p>
            </div>
            
            <h3 class="text-xl font-bold mt-8 mb-4">My Approach</h3>
            <p>I believe tattoos should be meaningful, beautiful, and technically sound. I take time to understand each client's vision and work collaboratively to create a design that will look great both immediately and for years to come. Safety, comfort, and client satisfaction are my top priorities.</p>
          </div>
        </div>
        
        <!-- Contact CTA -->
        <div class="mt-12 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="text-xl font-bold mb-4">Let's Connect</h3>
          <p class="mb-6">
            {{ siteConfig.type === 'dev'
              ? 'Interested in working together on a project? I\'m always open to new opportunities and collaborations.'
              : 'Interested in getting a tattoo? I\'d love to discuss your ideas and create something unique for you.'
            }}
          </p>
          <NuxtLink to="/contact" class="btn btn-primary">Contact Me</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Get site configuration
const siteConfig = useSiteConfig();

// Meta tags
useHead({
  title: `About - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`,
  meta: [
    { name: 'description', content: siteConfig.value?.type === 'dev' 
      ? 'Learn about Allison\'s journey as a developer, skills, and professional experience'
      : 'Learn about Allison\'s journey as a tattoo artist, styles, and studio experience'
    }
  ]
});
</script> 