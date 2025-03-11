<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary-dark/10 to-primary-dark/20 dark:from-dark-primary/20 dark:to-dark-primary/30">
      <div class="container-custom">
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="flex-1 order-2 md:order-1">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">Tattoo Artist</h1>
            <h2 class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6">Creating unique and meaningful art for your body</h2>
            <p class="text-lg mb-8">
              I'm Allison, a tattoo artist specializing in fine line, watercolor, and custom designs. 
              Each piece I create is a collaborative journey with my clients, resulting in personalized 
              and meaningful art that tells your story.
            </p>
            <div class="flex flex-wrap gap-4">
              <NuxtLink to="/tattoo/gallery" class="btn btn-primary">
                View My Work
              </NuxtLink>
              <NuxtLink to="/tattoo/contact" class="btn btn-outline">
                Book a Consultation
              </NuxtLink>
            </div>
          </div>
          <div class="flex-1 order-1 md:order-2">
            <div class="aspect-square max-w-md mx-auto bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden">
              <!-- Placeholder for profile image -->
              <div class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                Tattoo Artist Profile Image
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Work Section -->
    <section class="py-16 bg-white dark:bg-gray-900">
      <div class="container-custom">
        <h2 class="text-3xl font-bold mb-12 text-center">Featured Work</h2>
        
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <!-- Tattoo work cards will be fetched from Strapi -->
          <div v-for="i in 6" :key="i" class="card overflow-hidden">
            <div class="relative aspect-square bg-gray-200 dark:bg-gray-700">
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Tattoo Image {{ i }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <NuxtLink to="/tattoo/gallery" class="btn btn-primary">
            View Full Gallery
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Tattoo Styles Section -->
    <section class="py-16 bg-gray-50 dark:bg-gray-800">
      <div class="container-custom">
        <h2 class="text-3xl font-bold mb-12 text-center">My Specialties</h2>
        
        <div class="grid gap-8 md:grid-cols-3">
          <!-- Fine Line -->
          <div class="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
            <div class="relative aspect-video bg-gray-200 dark:bg-gray-600 mb-4 rounded-lg overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Fine Line Example
              </div>
            </div>
            <h3 class="text-xl font-bold mb-2">Fine Line</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Delicate, precise linework with attention to the smallest details. Perfect for minimalist designs, 
              portraits, and intricate patterns.
            </p>
          </div>
          
          <!-- Watercolor -->
          <div class="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
            <div class="relative aspect-video bg-gray-200 dark:bg-gray-600 mb-4 rounded-lg overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Watercolor Example
              </div>
            </div>
            <h3 class="text-xl font-bold mb-2">Watercolor</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Vibrant, flowing colors that mimic the organic spread of watercolor paint. Creates a soft, 
              artistic aesthetic for nature-inspired and abstract designs.
            </p>
          </div>
          
          <!-- Black & Gray -->
          <div class="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
            <div class="relative aspect-video bg-gray-200 dark:bg-gray-600 mb-4 rounded-lg overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Black & Gray Example
              </div>
            </div>
            <h3 class="text-xl font-bold mb-2">Black & Gray</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Classic shading techniques creating depth and dimension using only black ink in various dilutions. 
              Timeless style for portraits, realism, and bold statement pieces.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 bg-white dark:bg-gray-900">
      <div class="container-custom">
        <h2 class="text-3xl font-bold mb-12 text-center">Client Testimonials</h2>
        
        <div class="grid gap-8 md:grid-cols-2">
          <div v-for="i in 2" :key="i" class="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full mr-4"></div>
              <div>
                <h3 class="font-bold">Client Name {{ i }}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ i === 1 ? 'Watercolor Sleeve' : 'Fine Line Portrait' }}
                </p>
              </div>
            </div>
            <div class="mb-4">
              <!-- Star rating -->
              <div class="flex mb-2">
                <svg v-for="star in 5" :key="star" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <blockquote class="text-gray-700 dark:text-gray-300 italic mb-4">
                {{ i === 1 
                  ? "Allison created the most beautiful watercolor piece for me. She took the time to understand exactly what I wanted and made the whole process comfortable and special."
                  : "I was nervous about getting a portrait of my grandfather, but Allison's attention to detail and patience made it an amazing experience. The final result is absolutely perfect."
                }}
              </blockquote>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded">
                <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  Tattoo Image
                </div>
              </div>
              <div class="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded">
                <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  Client Photo
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <NuxtLink to="/tattoo/testimonials" class="btn btn-primary">
            Read More Testimonials
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Recent Blog Posts -->
    <section class="py-16 bg-gray-50 dark:bg-gray-800">
      <div class="container-custom">
        <h2 class="text-3xl font-bold mb-12 text-center">Recent Stories</h2>
        
        <div class="grid gap-8 md:grid-cols-3">
          <div v-for="i in 3" :key="i" class="card overflow-hidden">
            <div class="relative aspect-video bg-gray-200 dark:bg-gray-700 mb-4">
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Blog Image {{ i }}
              </div>
            </div>
            <div class="p-4">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {{ new Date(Date.now() - i * 1000000000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
              </div>
              <h3 class="text-xl font-bold mb-2">Tattoo Art Story {{ i }}</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Exploring tattoo artistry, design processes, client stories, and creative inspirations behind unique tattoo pieces.
              </p>
              <NuxtLink :to="`/tattoo/blog/${i}`" class="text-primary dark:text-dark-primary font-medium">
                Read More →
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <NuxtLink to="/tattoo/blog" class="btn btn-primary">
            View All Stories
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Booking CTA -->
    <section class="py-20 bg-primary-dark/10 dark:bg-dark-primary/20">
      <div class="container-custom text-center">
        <h2 class="text-3xl font-bold mb-6">Ready for Your Next Tattoo?</h2>
        <p class="text-lg max-w-2xl mx-auto mb-8">
          Let's create something beautiful together. Book a consultation to discuss your ideas and start your tattoo journey.
        </p>
        <NuxtLink to="/tattoo/contact" class="btn btn-primary">
          Book a Consultation
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Ensure site config is set to tattoo
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'tattoo') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'tattoo',
    baseRoute: '/tattoo'
  };
}

// Meta tags
useHead({
  title: `${siteConfig.value?.title || 'Allison\'s Tattoo Art'} - Home`,
  meta: [
    { name: 'description', content: 'Unique and creative tattoo designs with a personal touch. Specializing in fine line, watercolor, and custom tattoos.' }
  ]
});
</script> 