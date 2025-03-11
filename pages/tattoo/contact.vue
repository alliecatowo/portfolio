<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary-dark/10 to-primary-dark/20 dark:from-dark-primary/20 dark:to-dark-primary/30">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold mb-6 relative inline-block">
            Book a Consultation
            <span class="absolute -bottom-2 left-0 w-32 h-2 bg-primary-dark dark:bg-dark-primary opacity-70"></span>
          </h1>
          <p class="text-lg mb-12 italic">
            Ready to bring your tattoo idea to life? Schedule a consultation to discuss your vision,
            placement, size, and any questions you might have about the process.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            <div class="relative">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 relative z-10">
                <h2 class="text-2xl font-bold mb-6 text-primary-dark dark:text-dark-primary">Studio Information</h2>
                
                <div class="space-y-6">
                  <div class="flex items-start">
                    <svg class="w-6 h-6 text-primary-dark dark:text-dark-primary mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <div>
                      <h3 class="font-semibold mb-1">Location</h3>
                      <p>Painted Canvas Studio</p>
                      <p>123 Art Avenue</p>
                      <p>Portland, OR 97201</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <svg class="w-6 h-6 text-primary-dark dark:text-dark-primary mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <h3 class="font-semibold mb-1">Studio Hours</h3>
                      <p>Tuesday - Saturday</p>
                      <p>11:00 AM - 7:00 PM</p>
                      <p class="text-sm italic mt-1">By appointment only</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <svg class="w-6 h-6 text-primary-dark dark:text-dark-primary mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                      <h3 class="font-semibold mb-1">Email</h3>
                      <a href="mailto:ink@allisons.gay" class="text-primary-dark dark:text-dark-primary hover:underline">ink@allisons.gay</a>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <svg class="w-6 h-6 text-primary-dark dark:text-dark-primary mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <div>
                      <h3 class="font-semibold mb-1">Phone</h3>
                      <p>(503) 555-8989</p>
                      <p class="text-sm italic mt-1">Text preferred for initial contact</p>
                    </div>
                  </div>
                  
                  <div class="flex justify-center space-x-6 pt-4">
                    <a href="https://instagram.com/allison.tattoo" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-primary-dark dark:text-gray-400 dark:hover:text-dark-primary">
                      <span class="sr-only">Instagram</span>
                      <svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <!-- Decorative elements for tattoo style -->
              <div class="absolute top-5 right-5 w-20 h-20 rounded-full bg-primary-dark/20 dark:bg-dark-primary/20 z-0"></div>
              <div class="absolute -bottom-5 -left-5 w-16 h-16 rounded-full bg-primary-dark/20 dark:bg-dark-primary/20 z-0"></div>
            </div>
            
            <div class="relative">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 relative z-10">
                <h2 class="text-2xl font-bold mb-6 text-primary-dark dark:text-dark-primary">Booking Process</h2>
                
                <div class="space-y-8">
                  <div class="flex">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-dark dark:bg-dark-primary flex items-center justify-center text-white font-bold mr-4">
                      1
                    </div>
                    <div>
                      <h3 class="font-semibold text-lg mb-1">Initial Inquiry</h3>
                      <p class="text-gray-600 dark:text-gray-300">Fill out the consultation form below with details about your tattoo idea.</p>
                    </div>
                  </div>
                  
                  <div class="flex">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-dark dark:bg-dark-primary flex items-center justify-center text-white font-bold mr-4">
                      2
                    </div>
                    <div>
                      <h3 class="font-semibold text-lg mb-1">Consultation</h3>
                      <p class="text-gray-600 dark:text-gray-300">We'll schedule a consultation to discuss your design, placement, and answer any questions.</p>
                    </div>
                  </div>
                  
                  <div class="flex">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-dark dark:bg-dark-primary flex items-center justify-center text-white font-bold mr-4">
                      3
                    </div>
                    <div>
                      <h3 class="font-semibold text-lg mb-1">Design Process</h3>
                      <p class="text-gray-600 dark:text-gray-300">I'll create a custom design based on our consultation and send it for your review and feedback.</p>
                    </div>
                  </div>
                  
                  <div class="flex">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-dark dark:bg-dark-primary flex items-center justify-center text-white font-bold mr-4">
                      4
                    </div>
                    <div>
                      <h3 class="font-semibold text-lg mb-1">Booking & Deposit</h3>
                      <p class="text-gray-600 dark:text-gray-300">Once the design is finalized, we'll book your appointment and collect a deposit to secure your spot.</p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Decorative elements for tattoo style -->
              <div class="absolute -top-5 -left-5 w-16 h-16 rounded-full bg-primary-dark/20 dark:bg-dark-primary/20 z-0"></div>
              <div class="absolute bottom-10 right-0 w-20 h-20 rounded-full bg-primary-dark/20 dark:bg-dark-primary/20 z-0"></div>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 relative overflow-hidden">
            <!-- Decorative element -->
            <div class="absolute top-0 right-0 h-32 w-32 bg-primary-dark/10 dark:bg-dark-primary/10 rounded-bl-full"></div>
            
            <h2 class="text-2xl font-bold mb-6 text-primary-dark dark:text-dark-primary relative z-10">Consultation Request</h2>
            
            <form @submit.prevent="submitForm" class="space-y-6 relative z-10">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label for="name" class="block text-sm font-medium mb-2">Full Name *</label>
                  <input 
                    id="name" 
                    v-model="form.name" 
                    type="text" 
                    class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-dark dark:focus:ring-dark-primary focus:border-primary-dark dark:focus:border-dark-primary"
                    required
                  >
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium mb-2">Email Address *</label>
                  <input 
                    id="email" 
                    v-model="form.email" 
                    type="email" 
                    class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-dark dark:focus:ring-dark-primary focus:border-primary-dark dark:focus:border-dark-primary"
                    required
                  >
                </div>
              </div>
              
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label for="phone" class="block text-sm font-medium mb-2">Phone Number</label>
                  <input 
                    id="phone" 
                    v-model="form.phone" 
                    type="tel" 
                    class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-dark dark:focus:ring-dark-primary focus:border-primary-dark dark:focus:border-dark-primary"
                  >
                </div>
                
                <div>
                  <label for="style" class="block text-sm font-medium mb-2">Tattoo Style *</label>
                  <select 
                    id="style" 
                    v-model="form.style" 
                    class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-dark dark:focus:ring-dark-primary focus:border-primary-dark dark:focus:border-dark-primary"
                    required
                  >
                    <option value="">Select a style</option>
                    <option value="Fine Line">Fine Line</option>
                    <option value="Watercolor">Watercolor</option>
                    <option value="Black & Gray">Black & Gray</option>
                    <option value="Custom Mix">Custom Mix</option>
                    <option value="Not Sure">Not Sure (We'll discuss)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label for="placement" class="block text-sm font-medium mb-2">Tattoo Placement *</label>
                <input 
                  id="placement" 
                  v-model="form.placement" 
                  type="text" 
                  class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-dark dark:focus:ring-dark-primary focus:border-primary-dark dark:focus:border-dark-primary"
                  placeholder="Arm, leg, back, etc."
                  required
                >
              </div>
              
              <div>
                <label for="size" class="block text-sm font-medium mb-2">Approximate Size *</label>
                <select 
                  id="size" 
                  v-model="form.size" 
                  class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-dark dark:focus:ring-dark-primary focus:border-primary-dark dark:focus:border-dark-primary"
                  required
                >
                  <option value="">Select size range</option>
                  <option value="Small (1-2 inches)">Small (1-2 inches)</option>
                  <option value="Medium (3-5 inches)">Medium (3-5 inches)</option>
                  <option value="Large (6-10 inches)">Large (6-10 inches)</option>
                  <option value="Extra Large (10+ inches)">Extra Large (10+ inches)</option>
                  <option value="Full Sleeve/Leg/Back">Full Sleeve/Leg/Back</option>
                </select>
              </div>
              
              <div>
                <label for="idea" class="block text-sm font-medium mb-2">Tattoo Idea Description *</label>
                <textarea 
                  id="idea" 
                  v-model="form.idea" 
                  rows="5" 
                  class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-dark dark:focus:ring-dark-primary focus:border-primary-dark dark:focus:border-dark-primary"
                  placeholder="Please describe your tattoo idea in as much detail as possible. Include any references, meanings, or specific elements you'd like included."
                  required
                ></textarea>
              </div>
              
              <div>
                <label for="previous" class="block text-sm font-medium mb-2">Previous Tattoo Experience</label>
                <textarea 
                  id="previous" 
                  v-model="form.previous" 
                  rows="2" 
                  class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-dark dark:focus:ring-dark-primary focus:border-primary-dark dark:focus:border-dark-primary"
                  placeholder="Is this your first tattoo? Any concerns about pain, etc.?"
                ></textarea>
              </div>
              
              <div class="flex items-start">
                <input 
                  id="consent" 
                  v-model="form.consent" 
                  type="checkbox" 
                  class="h-4 w-4 mt-1 text-primary-dark dark:text-dark-primary focus:ring-primary-dark dark:focus:ring-dark-primary rounded"
                  required
                >
                <label for="consent" class="ml-2 block text-sm">
                  I am 18 years of age or older and consent to being contacted about my tattoo inquiry. I understand that filling out this form does not guarantee an appointment.
                </label>
              </div>
              
              <div v-if="formStatus" :class="[formStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'p-4 rounded-md']">
                {{ formStatus.message }}
              </div>
              
              <div>
                <button 
                  type="submit" 
                  class="px-8 py-3 bg-primary-dark dark:bg-dark-primary text-white rounded-full shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark dark:focus:ring-dark-primary disabled:opacity-50"
                  :disabled="submitting"
                >
                  <span v-if="submitting">Submitting...</span>
                  <span v-else>Submit Consultation Request</span>
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

// Ensure site config is set to tattoo
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'tattoo') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'tattoo',
    baseRoute: '/tattoo'
  };
}

// Form data
const form = reactive({
  name: '',
  email: '',
  phone: '',
  style: '',
  placement: '',
  size: '',
  idea: '',
  previous: '',
  consent: false
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
    message: "Thank you for your consultation request! I'll reach out within 48 hours to schedule your consultation."
  };
  
  // Reset form
  form.name = '';
  form.email = '';
  form.phone = '';
  form.style = '';
  form.placement = '';
  form.size = '';
  form.idea = '';
  form.previous = '';
  form.consent = false;
  
  submitting.value = false;
  
  // Clear status after 7 seconds
  setTimeout(() => {
    formStatus.value = null;
  }, 7000);
};

// Meta tags
useHead({
  title: `Book a Consultation - ${siteConfig.value?.title || 'Tattoo Portfolio'}`,
  meta: [
    { name: 'description', content: 'Book a tattoo consultation to discuss your custom design ideas. Specializing in fine line, watercolor, and personalized tattoo artwork.' }
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