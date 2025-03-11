<template>
  <div class="container-custom py-12">
    <h1 class="text-center mb-12">Client Testimonials</h1>
    
    <div class="max-w-4xl mx-auto">
      <!-- Introduction -->
      <div class="mb-12 prose dark:prose-invert max-w-none text-center">
        <p>
          Don't just take my word for it – here's what clients have to say about their experiences 
          and the tattoos we've created together. Each tattoo tells a story, and I'm grateful to be 
          part of these personal journeys.
        </p>
      </div>
      
      <!-- Featured testimonial -->
      <div class="mb-16 bg-primary/5 dark:bg-dark-primary/10 p-8 rounded-lg">
        <div class="flex flex-col items-center text-center mb-6">
          <div class="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full mb-4"></div>
          <div>
            <h3 class="text-xl font-bold">Sarah M.</h3>
            <p class="text-gray-600 dark:text-gray-400">First-time tattoo client</p>
          </div>
        </div>
        <blockquote class="text-xl italic mb-6 text-center">
          "I was so nervous about getting my first tattoo, but Allison made the entire experience comfortable and special. 
          She took the time to understand exactly what I wanted and created a design that exceeded my expectations. 
          Not only is the finished piece beautiful, but the process itself was therapeutic and meaningful."
        </blockquote>
        <div class="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
            Sarah's Tattoo
          </div>
        </div>
      </div>
      
      <!-- Testimonial grid -->
      <div class="grid gap-8 md:grid-cols-2">
        <div v-for="(testimonial, index) in testimonials" :key="index" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full mr-4"></div>
            <div>
              <h3 class="font-bold">{{ testimonial.name }}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">{{ testimonial.project }}</p>
            </div>
          </div>
          <div class="mb-4">
            <!-- Star rating -->
            <div class="flex mb-2">
              <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <blockquote class="text-gray-700 dark:text-gray-300 italic mb-4">
              "{{ testimonial.quote }}"
            </blockquote>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded">
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Before
              </div>
            </div>
            <div class="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded">
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                After
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Leave a review section -->
      <div class="mt-16 p-8 bg-primary/5 dark:bg-dark-primary/10 rounded-lg text-center">
        <h2 class="text-2xl font-bold mb-4">Share Your Experience</h2>
        <p class="mb-6 max-w-2xl mx-auto">
          Had a tattoo done by me? I'd love to hear about your experience and feature your story here.
        </p>
        <div class="flex justify-center">
          <NuxtLink to="/contact" class="btn btn-primary">
            Submit Your Story
          </NuxtLink>
        </div>
      </div>
      
      <!-- FAQ Section -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        
        <div class="space-y-4">
          <div v-for="(faq, index) in faqs" :key="index" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button 
              class="w-full flex justify-between items-center p-4 text-left font-medium focus:outline-none"
              :class="faq.open ? 'bg-primary/10 dark:bg-dark-primary/10' : 'bg-white dark:bg-gray-800'"
              @click="toggleFaq(index)"
            >
              <span>{{ faq.question }}</span>
              <svg 
                class="w-5 h-5 transition-transform" 
                :class="faq.open ? 'transform rotate-180' : ''"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div 
              v-show="faq.open" 
              class="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
            >
              <p class="text-gray-600 dark:text-gray-300">{{ faq.answer }}</p>
            </div>
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

// Sample testimonials data (in a real app, this would come from the CMS)
const testimonials = [
  {
    name: "Michael K.",
    project: "Geometric sleeve",
    rating: 5,
    quote: "Allison took my vague ideas and transformed them into a cohesive design that flows perfectly with my arm. The attention to detail is incredible, and three years later it still looks amazing."
  },
  {
    name: "Jamie T.",
    project: "Watercolor bird",
    rating: 5,
    quote: "I was worried that a watercolor tattoo wouldn't age well, but Allison explained the techniques she uses to ensure longevity. Two years later, the colors are still vibrant, and I couldn't be happier."
  },
  {
    name: "Alex R.",
    project: "Fine line portrait",
    rating: 5,
    quote: "The portrait Allison created of my grandfather is so lifelike and captures his essence perfectly. It was an emotional experience, and Allison was respectful and professional throughout."
  },
  {
    name: "Taylor B.",
    project: "Blackwork botanical",
    rating: 5,
    quote: "I've had several sessions with Allison for my botanical sleeve, and each time has been a great experience. Her technical skill is matched by her artistic vision and ability to adapt designs to body contours."
  }
];

// FAQs
const faqs = reactive([
  {
    question: "How far in advance should I book an appointment?",
    answer: "I typically book 2-3 months in advance, but this can vary seasonally. For larger or more complex pieces, I recommend reaching out as early as possible to secure your spot and allow time for design development.",
    open: true
  },
  {
    question: "What's your approach to custom designs?",
    answer: "I work collaboratively with each client to create a design that's meaningful and visually appealing. After our initial consultation, I'll create a draft design for your review. We can make adjustments until you're completely satisfied before the tattoo session.",
    open: false
  },
  {
    question: "Do you offer touch-ups?",
    answer: "Yes, I offer free touch-ups within the first 3 months after your tattoo has fully healed. After that period, minor touch-ups are priced based on the work required.",
    open: false
  },
  {
    question: "What should I do to prepare for my tattoo session?",
    answer: "Get a good night's sleep, eat a meal before your appointment, stay hydrated, and avoid alcohol for 24 hours before your session. Wear comfortable clothing that provides easy access to the area being tattooed.",
    open: false
  },
  {
    question: "How do I care for my new tattoo?",
    answer: "I'll provide detailed aftercare instructions at your appointment, but generally: keep the bandage on for the recommended time, wash gently with unscented soap, apply a thin layer of recommended ointment, avoid submerging in water, and protect from direct sunlight until fully healed.",
    open: false
  }
]);

// Toggle FAQ accordion
const toggleFaq = (index: number) => {
  faqs[index].open = !faqs[index].open;
};

// Meta tags
useHead({
  title: `Testimonials - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`,
  meta: [
    { name: 'description', content: 'Read what clients have to say about their tattoo experiences and the custom designs we\'ve created together.' }
  ]
});
</script> 