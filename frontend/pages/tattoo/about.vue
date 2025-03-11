<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary-dark/10 to-primary-dark/20 dark:from-dark-primary/20 dark:to-dark-primary/30">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold mb-6 relative">
            <span class="inline-block relative z-10">About The Artist</span>
            <span class="absolute -bottom-2 left-0 w-32 h-2 bg-primary-dark dark:bg-dark-primary opacity-70 z-0"></span>
          </h1>
          
          <div class="flex flex-col md:flex-row gap-10 mb-12 items-start">
            <div class="w-full md:w-1/3 aspect-square bg-white dark:bg-gray-800 rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-gray-700">
              <!-- Artist image placeholder -->
              <div class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                Artist Portrait
              </div>
            </div>
            
            <div class="w-full md:w-2/3 prose dark:prose-invert max-w-none">
              <p class="text-lg italic border-l-4 border-primary-dark dark:border-dark-primary pl-4 mb-6">
                "Creating permanent art that tells your story is both an honor and a responsibility I take to heart."
              </p>
              
              <p class="mb-4">
                I'm Allison, a tattoo artist specializing in fine line, watercolor, and custom designs. 
                With over 8 years of experience in the industry, I've dedicated myself to the craft of 
                creating meaningful, personalized art that becomes a part of my clients' personal narratives.
              </p>
            </div>
          </div>
          
          <div class="prose dark:prose-invert max-w-none">
            <h2 class="text-2xl font-bold mt-8 mb-4 flex items-center">
              <span class="w-8 h-8 rounded-full bg-primary-dark dark:bg-dark-primary flex items-center justify-center text-white mr-3">1</span>
              My Artistic Journey
            </h2>
            <p class="mb-4">
              My path to becoming a tattoo artist began with my lifelong love of drawing and painting. After 
              earning a Fine Arts degree with a focus on illustration, I apprenticed under master tattoo artist 
              Elena Rodriguez at Ink Collective in Portland, where I honed my technical skills and developed my 
              artistic voice.
            </p>
            <p class="mb-4">
              Over the years, I've had the privilege of working in studios across the country, participating in 
              tattoo conventions, and collaborating with clients from all walks of life. Each experience has 
              enriched my approach and expanded my artistic vocabulary.
            </p>
            
            <h2 class="text-2xl font-bold mt-8 mb-4 flex items-center">
              <span class="w-8 h-8 rounded-full bg-primary-dark dark:bg-dark-primary flex items-center justify-center text-white mr-3">2</span>
              My Style & Specialties
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h3 class="font-bold text-xl mb-2 text-primary-dark dark:text-dark-primary">Fine Line</h3>
                <p class="text-sm">
                  Delicate, precise linework with meticulous attention to detail. Perfect for minimalist designs, 
                  intricate patterns, and meaningful symbols.
                </p>
              </div>
              
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h3 class="font-bold text-xl mb-2 text-primary-dark dark:text-dark-primary">Watercolor</h3>
                <p class="text-sm">
                  Vibrant, flowing colors that create a painterly effect. Ideal for nature-inspired pieces, 
                  abstract designs, and pieces that blend artistic styles.
                </p>
              </div>
              
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                <h3 class="font-bold text-xl mb-2 text-primary-dark dark:text-dark-primary">Custom Design</h3>
                <p class="text-sm">
                  Personalized artwork created specifically for you. I work closely with clients to transform 
                  ideas, concepts, and memories into meaningful tattoos.
                </p>
              </div>
            </div>
            
            <h2 class="text-2xl font-bold mt-8 mb-4 flex items-center">
              <span class="w-8 h-8 rounded-full bg-primary-dark dark:bg-dark-primary flex items-center justify-center text-white mr-3">3</span>
              My Creative Process
            </h2>
            <p class="mb-4">
              I believe that the best tattoos come from a collaborative process. It begins with listening to your 
              story, understanding your vision, and discussing placement, size, and style. I then create custom 
              designs tailored specifically to you.
            </p>
            <p class="mb-4">
              During the tattooing process, I prioritize your comfort and confidence. My studio is a safe, welcoming 
              space where clients can relax and enjoy the experience of getting tattooed. I use premium equipment and 
              follow strict safety and hygiene protocols.
            </p>
            
            <h2 class="text-2xl font-bold mt-8 mb-4 flex items-center">
              <span class="w-8 h-8 rounded-full bg-primary-dark dark:bg-dark-primary flex items-center justify-center text-white mr-3">4</span>
              The Other Side of Me
            </h2>
            <p class="mb-4">
              When I'm not creating tattoos, I'm exploring my other passion: web development. As a full-stack 
              developer, I enjoy building digital experiences and solving complex problems with code. I find that 
              my technical skills and artistic abilities complement each other in surprising ways.
            </p>
            <p class="mb-4">
              I also love exploring nature, practicing yoga, collecting vintage art books, and spending time with 
              my two cats, Pixel and Vector.
            </p>
            
            <h2 class="text-2xl font-bold mt-8 mb-4 flex items-center">
              <span class="w-8 h-8 rounded-full bg-primary-dark dark:bg-dark-primary flex items-center justify-center text-white mr-3">5</span>
              Let's Create Together
            </h2>
            <p class="mb-4">
              I'm currently accepting new clients for custom tattoo projects. Whether you have a specific design 
              in mind or just a concept you'd like to explore, I'd love to collaborate with you to create a 
              tattoo that tells your unique story.
            </p>
            
            <div class="mt-8 mb-12 text-center">
              <NuxtLink to="/tattoo/contact" class="inline-block px-8 py-3 bg-primary-dark dark:bg-dark-primary text-white rounded-full shadow-lg transform transition-transform hover:scale-105">
                Book a Consultation
              </NuxtLink>
            </div>
            
            <div class="flex flex-wrap justify-center space-x-6 mt-10">
              <a href="https://instagram.com/allison.tattoo" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-primary-dark dark:text-gray-400 dark:hover:text-dark-primary">
                <span class="sr-only">Instagram</span>
                <svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="mailto:ink@allisons.gay" class="text-gray-600 hover:text-primary-dark dark:text-gray-400 dark:hover:text-dark-primary">
                <span class="sr-only">Email</span>
                <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
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
  title: `About The Artist - ${siteConfig.value?.title || 'Tattoo Portfolio'}`,
  meta: [
    { name: 'description', content: 'Learn about my journey as a tattoo artist, my artistic style, and the passion behind my fine line and watercolor tattoo designs.' }
  ]
});
</script>

<style scoped>
.container-custom {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.prose {
  max-width: 65ch;
  color: inherit;
}

.prose a {
  text-decoration: none;
  color: theme('colors.primary-dark');
}

.dark .prose a {
  color: theme('colors.dark-primary');
}

.prose a:hover {
  text-decoration: underline;
}

.prose h1, .prose h2, .prose h3 {
  color: inherit;
}
</style> 