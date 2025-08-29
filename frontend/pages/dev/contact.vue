<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary/5 to-primary-50 dark:from-primary-400/10 dark:to-primary-400/20">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
          <p class="text-lg mb-12">
            Have a project in mind or want to discuss a potential collaboration? I'd love to hear from you.
            Fill out the form below or use any of the contact methods listed.
          </p>
          
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div class="flex items-center mb-4">
                <svg class="w-6 h-6 text-primary dark:text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <h2 class="text-xl font-semibold">Email</h2>
              </div>
              <a href="mailto:dev@allisons.dev" class="text-primary dark:text-primary-400 hover:underline">dev@allisons.dev</a>
            </div>
            
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div class="flex items-center mb-4">
                <svg class="w-6 h-6 text-primary dark:text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                </svg>
                <h2 class="text-xl font-semibold">Social</h2>
              </div>
              <div class="flex space-x-3">
                <a href="https://github.com/allison" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                  </svg>
                </a>
                <a href="https://linkedin.com/in/allison" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clip-rule="evenodd" />
                  </svg>
                </a>
                <a href="https://twitter.com/allison" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div class="flex items-center mb-4">
                <svg class="w-6 h-6 text-primary dark:text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h2 class="text-xl font-semibold">Response Time</h2>
              </div>
              <p>I typically respond within 24-48 hours on weekdays.</p>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-semibold mb-6">Send Me a Message</h2>
            
            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label for="name" class="block text-sm font-medium mb-2">Name</label>
                  <input 
                    id="name" 
                    v-model="form.name" 
                    type="text" 
                    class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 focus:ring-primary dark:focus:ring-primary-400 focus:border-primary dark:focus:border-primary-400"
                    required
                  >
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium mb-2">Email</label>
                  <input 
                    id="email" 
                    v-model="form.email" 
                    type="email" 
                    class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 focus:ring-primary dark:focus:ring-primary-400 focus:border-primary dark:focus:border-primary-400"
                    required
                  >
                </div>
              </div>
              
              <div>
                <label for="subject" class="block text-sm font-medium mb-2">Subject</label>
                <input 
                  id="subject" 
                  v-model="form.subject" 
                  type="text" 
                  class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 focus:ring-primary dark:focus:ring-primary-400 focus:border-primary dark:focus:border-primary-400"
                  required
                >
              </div>
              
              <div>
                <label for="message" class="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  id="message" 
                  v-model="form.message" 
                  rows="5" 
                  class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 focus:ring-primary dark:focus:ring-primary-400 focus:border-primary dark:focus:border-primary-400"
                  required
                ></textarea>
              </div>
              
              <div class="flex items-start">
                <input 
                  id="privacy" 
                  v-model="form.privacy" 
                  type="checkbox" 
                  class="h-4 w-4 mt-1 text-primary dark:text-primary-400 focus:ring-primary dark:focus:ring-primary-400 rounded"
                  required
                >
                <label for="privacy" class="ml-2 block text-sm">
                  I agree to the <a href="#" class="text-primary dark:text-primary-400 hover:underline">privacy policy</a> and consent to being contacted regarding my inquiry.
                </label>
              </div>
              
              <div v-if="formStatus" :class="[formStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'p-4 rounded-md']">
                {{ formStatus.message }}
              </div>
              
              <div>
                <button 
                  type="submit" 
                  class="px-6 py-3 bg-primary dark:bg-primary-400 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-400-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-400 disabled:opacity-50"
                  :disabled="submitting"
                >
                  <span v-if="submitting">Sending...</span>
                  <span v-else>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Ensure site config is set to dev
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'dev') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'dev'
  };
}

// Form data
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  privacy: false
});

const submitting = ref(false);
const formStatus = ref(null);

// Form submission handler - in a real app, this would connect to an API
const submitForm = async () => {
  submitting.value = true;
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demo purposes we'll just show a success message
  formStatus.value = {
    success: true,
    message: "Thank you for your message! I'll get back to you as soon as possible."
  };
  
  // Reset form
  form.name = '';
  form.email = '';
  form.subject = '';
  form.message = '';
  form.privacy = false;
  
  submitting.value = false;
  
  // Clear status after 5 seconds
  setTimeout(() => {
    formStatus.value = null;
  }, 5000);
};

// Meta tags
useHead({
  title: `Contact - ${siteConfig.value?.title || 'Developer Portfolio'}`,
  meta: [
    { name: 'description', content: 'Get in touch for project inquiries, collaborations, or just to say hello. I\'m available for freelance work and new opportunities.' }
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