<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary-dark/10 to-primary-dark/20 dark:from-dark-primary/20 dark:to-dark-primary/30">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-center relative">
          <span class="inline-block relative z-10">Client Testimonials</span>
          <span class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-primary-dark dark:bg-dark-primary opacity-70 z-0"></span>
        </h1>
        
        <div class="max-w-4xl mx-auto">
          <!-- Introduction -->
          <div class="mb-12 prose dark:prose-invert max-w-none text-center">
            <p class="text-lg">
              Don't just take my word for it – here's what clients have to say about their experiences 
              and the tattoos we've created together. Each tattoo tells a story, and I'm grateful to be 
              part of these personal journeys.
            </p>
          </div>
          
          <!-- Featured testimonial -->
          <div class="mb-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl relative overflow-hidden">
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 h-32 w-32 bg-primary-dark/10 dark:bg-dark-primary/10 rounded-bl-full"></div>
            <div class="absolute bottom-0 left-0 h-24 w-24 bg-primary-dark/10 dark:bg-dark-primary/10 rounded-tr-full"></div>
            
            <div class="flex flex-col items-center text-center mb-6 relative z-10">
              <div class="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
                <!-- Client image would go here -->
                <div class="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Photo
                </div>
              </div>
              <div>
                <h3 class="text-2xl font-bold">Sarah M.</h3>
                <p class="text-gray-600 dark:text-gray-400">First Tattoo Experience</p>
              </div>
            </div>
            
            <div class="relative z-10">
              <div class="flex justify-center mb-4">
                <div class="flex">
                  <svg v-for="i in 5" :key="i" class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
              
              <blockquote class="text-xl italic text-center mb-6">
                "I was nervous about getting my first tattoo, but Allison made the experience incredible. 
                She listened to my ideas, created a design that perfectly captured what I wanted, and was 
                patient and gentle throughout the process. The result exceeded my expectations!"
              </blockquote>
              
              <div class="flex justify-center">
                <div class="w-48 h-48 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <!-- Tattoo image would go here -->
                  <div class="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Tattoo Image
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Testimonial grid -->
          <div class="grid md:grid-cols-2 gap-8">
            <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div class="flex items-center mb-4">
                <div class="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full mr-4 overflow-hidden">
                  <!-- Client image would go here -->
                  <div class="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Photo
                  </div>
                </div>
                <div>
                  <h3 class="font-bold">Client {{ i }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ ['Custom Sleeve', 'Watercolor Design', 'Fine Line Work', 'Memorial Piece'][i-1] }}</p>
                  <div class="flex mt-1">
                    <svg v-for="star in 5" :key="star" class="w-4 h-4" :class="star <= (6-i) ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <blockquote class="italic text-gray-700 dark:text-gray-300 mb-4">
                "{{ ['Allison created exactly what I wanted for my sleeve. The attention to detail is amazing and the whole process was smooth and professional.', 'The watercolor tattoo I got is still vibrant after a year. Allison\'s technique is exceptional and her artistic vision really elevated my original concept.', 'I wanted something minimal and meaningful. Allison\'s fine line work is precise and delicate - exactly what I was looking for.', 'When I wanted a memorial piece, Allison was compassionate and thoughtful. She created something beautiful that honors my loved one perfectly.'][i-1] }}"
              </blockquote>
              
              <div class="flex justify-center">
                <div class="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <!-- Tattoo image would go here -->
                  <div class="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Tattoo Image {{ i }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- CTA -->
          <div class="mt-16 text-center">
            <h2 class="text-2xl font-bold mb-4">Ready to Create Your Own Story?</h2>
            <p class="mb-6 max-w-2xl mx-auto">
              I'd love to work with you on your next tattoo. Whether you have a specific design in mind 
              or need help bringing your ideas to life, let's start the conversation.
            </p>
            <NuxtLink to="/tattoo/contact" class="inline-block px-6 py-3 bg-primary-dark dark:bg-dark-primary text-white rounded-full shadow-lg transform transition-transform hover:scale-105">
              Book a Consultation
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';
import { getTestimonials } from '~/utils/api/content';

// Ensure site config is set to tattoo
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'tattoo') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'tattoo',
    baseRoute: '/tattoo'
  };
}

// State
const testimonials = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch testimonials
const fetchTestimonials = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // In a real implementation, this would fetch from Strapi
    const response = await getTestimonials(10);
    
    if (response) {
      testimonials.value = response.data || [];
    }
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    error.value = 'Failed to load testimonials. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchTestimonials();
});

// Meta tags
useHead({
  title: `Client Testimonials - ${siteConfig.value?.title || 'Tattoo Portfolio'}`,
  meta: [
    { name: 'description', content: 'Read what clients have to say about their tattoo experiences. Featuring reviews and photos of custom tattoo work.' }
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
</style> 