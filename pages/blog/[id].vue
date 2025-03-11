<template>
  <div class="container-custom py-12">
    <div class="max-w-3xl mx-auto">
      <!-- Back link -->
      <NuxtLink to="/blog" class="inline-flex items-center mb-8 text-primary dark:text-dark-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Blog
      </NuxtLink>
      
      <!-- Blog post content -->
      <article>
        <div class="mb-8">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {{ new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
          </div>
          <h1 class="mb-6">
            {{ siteConfig.type === 'dev' ? 'Development Article' : 'Tattoo Art Story' }} #{{ id }}
          </h1>
          
          <!-- Post image -->
          <div class="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-8">
            <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
              Blog Post Image
            </div>
          </div>
          
          <!-- Post content -->
          <div class="prose dark:prose-invert max-w-none">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, velit vel bibendum bibendum, 
              nisl nisl bibendum nisl, vel bibendum nisl nisl vel nisl. Sed euismod, velit vel bibendum bibendum,
              nisl nisl bibendum nisl, vel bibendum nisl nisl vel nisl.
            </p>
            
            <p>
              Integer faucibus magna vitae augue ultricies, vitae efficitur lorem finibus. Suspendisse potenti. 
              Mauris sit amet ex vel magna dignissim facilisis. Quisque tempus libero vel lectus maximus, 
              vel egestas arcu faucibus. Vivamus laoreet dui in nisi hendrerit, at iaculis massa finibus.
            </p>
            
            <h2>Section Title</h2>
            
            <p>
              Praesent consectetur lectus vel turpis blandit, vel eleifend nisl faucibus. Nullam sed magna vel 
              nisi dictum venenatis. Morbi convallis justo in ipsum eleifend, vel mattis risus dictum. Vivamus 
              a consequat justo. Suspendisse potenti. Nulla facilisi.
            </p>
            
            <ul>
              <li>List item one with some details</li>
              <li>List item two with additional information</li>
              <li>List item three with extra content for context</li>
            </ul>
            
            <p>
              Fusce ultricies diam vel lorem tempor, a gravida orci vulputate. Donec vel neque vel ipsum 
              consectetur dapibus. Sed faucibus, lorem vel sagittis ultrices, nunc mauris scelerisque mauris, 
              vel euismod purus purus vel neque.
            </p>
            
            <h2>Another Section</h2>
            
            <p>
              Morbi auctor sit amet magna vel dapibus. Integer euismod tellus vel velit varius, vel fermentum 
              magna rutrum. Phasellus vel magna vel risus vehicula varius. Aenean vel magna vel nisl varius 
              tincidunt.
            </p>
          </div>
        </div>
      </article>
      
      <!-- Author info -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mr-4"></div>
          <div>
            <h3 class="font-bold">Allison</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ siteConfig.type === 'dev' ? 'Full-Stack Developer' : 'Tattoo Artist' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Get site configuration
const siteConfig = useSiteConfig();

// Get post ID from route
const route = useRoute();
const id = route.params.id;

// Meta tags
useHead({
  title: `${siteConfig.type === 'dev' ? 'Development Article' : 'Tattoo Art Story'} #${id} - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`,
  meta: [
    { name: 'description', content: 'Detailed article with insights and information.' }
  ]
});
</script> 