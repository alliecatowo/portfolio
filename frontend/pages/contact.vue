<template>
  <div class="container-custom py-12">
    <h1 class="text-center mb-12">Contact Me</h1>

    <div class="grid md:grid-cols-2 gap-12">
      <!-- Contact Info -->
      <div>
        <h2 class="text-2xl font-bold mb-6">Get In Touch</h2>
        <div class="prose dark:prose-invert max-w-none mb-8">
          <p v-if="siteConfig.type === 'dev'">
            I'm interested in freelance opportunities, collaborations, and discussions about web development, UX design, 
            and technology. If you have a project in mind or just want to connect, feel free to reach out!
          </p>
          <p v-else>
            I'm currently accepting new tattoo clients. If you're interested in getting tattooed by me, 
            have questions about my process, or want to discuss a design idea, please get in touch!
          </p>
        </div>

        <div class="space-y-6">
          <div class="flex items-start">
            <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 dark:bg-dark-primary/10 text-primary dark:text-dark-primary mr-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium">Email</h3>
              <p class="mt-1">
                <a v-if="siteConfig.socialLinks.email" :href="`mailto:${siteConfig.socialLinks.email}`" class="text-primary dark:text-dark-primary">
                  {{ siteConfig.socialLinks.email }}
                </a>
              </p>
            </div>
          </div>

          <div v-if="siteConfig.type === 'dev'" class="flex items-start">
            <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 dark:bg-dark-primary/10 text-primary dark:text-dark-primary mr-4">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium">GitHub</h3>
              <p class="mt-1">
                <a v-if="siteConfig.socialLinks.github" :href="siteConfig.socialLinks.github" target="_blank" rel="noopener noreferrer" class="text-primary dark:text-dark-primary">
                  {{ siteConfig.socialLinks.github.replace('https://github.com/', '@') }}
                </a>
              </p>
            </div>
          </div>

          <div v-if="siteConfig.type === 'dev'" class="flex items-start">
            <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 dark:bg-dark-primary/10 text-primary dark:text-dark-primary mr-4">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium">LinkedIn</h3>
              <p class="mt-1">
                <a v-if="siteConfig.socialLinks.linkedin" :href="siteConfig.socialLinks.linkedin" target="_blank" rel="noopener noreferrer" class="text-primary dark:text-dark-primary">
                  {{ siteConfig.socialLinks.linkedin.replace('https://linkedin.com/in/', '@') }}
                </a>
              </p>
            </div>
          </div>

          <div v-if="siteConfig.type === 'tattoo'" class="flex items-start">
            <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 dark:bg-dark-primary/10 text-primary dark:text-dark-primary mr-4">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium">Instagram</h3>
              <p class="mt-1">
                <a v-if="siteConfig.socialLinks.instagram" :href="siteConfig.socialLinks.instagram" target="_blank" rel="noopener noreferrer" class="text-primary dark:text-dark-primary">
                  {{ siteConfig.socialLinks.instagram.replace('https://instagram.com/', '@') }}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div>
        <div class="card">
          <h2 class="text-2xl font-bold mb-6">Send a Message</h2>
          <form @submit.prevent="submitForm" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium mb-1">Name</label>
              <input 
                id="name" 
                v-model="form.name" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary bg-white dark:bg-gray-800"
                required
              >
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium mb-1">Email</label>
              <input 
                id="email" 
                v-model="form.email" 
                type="email" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary bg-white dark:bg-gray-800"
                required
              >
            </div>
            
            <div v-if="siteConfig.type === 'dev'">
              <label for="subject" class="block text-sm font-medium mb-1">Subject</label>
              <select 
                id="subject" 
                v-model="form.subject" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary bg-white dark:bg-gray-800"
              >
                <option value="project">Project Inquiry</option>
                <option value="collaboration">Collaboration</option>
                <option value="question">General Question</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div v-else>
              <label for="subject" class="block text-sm font-medium mb-1">Subject</label>
              <select 
                id="subject" 
                v-model="form.subject" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary bg-white dark:bg-gray-800"
              >
                <option value="appointment">Tattoo Appointment</option>
                <option value="design">Custom Design</option>
                <option value="question">Questions About Process</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label for="message" class="block text-sm font-medium mb-1">Message</label>
              <textarea 
                id="message" 
                v-model="form.message" 
                rows="6" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary bg-white dark:bg-gray-800"
                required
              ></textarea>
            </div>
            
            <div>
              <UButton 
                type="submit" 
                color="primary"
                class="w-full"
                :loading="formSubmitting"
                :disabled="formSubmitting"
              >
                {{ formSubmitting ? 'Sending...' : 'Send Message' }}
              </UButton>
            </div>
            
            <div v-if="formSubmitSuccess" class="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
              Your message has been sent successfully! I'll get back to you soon.
            </div>
            
            <div v-if="formSubmitError" class="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
              There was an error sending your message. Please try again.
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';

// Get site configuration
const siteConfig = useSiteConfig();

// Form data
const form = reactive({
  name: '',
  email: '',
  subject: siteConfig.value.type === 'dev' ? 'project' : 'appointment',
  message: ''
});

// Form states
const formSubmitting = ref(false);
const formSubmitSuccess = ref(false);
const formSubmitError = ref(false);

// Submit form
const submitForm = async () => {
  formSubmitting.value = true;
  formSubmitSuccess.value = false;
  formSubmitError.value = false;
  
  try {
    // This would normally be an API call to your backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful submission
    formSubmitSuccess.value = true;
    
    // Reset form
    form.name = '';
    form.email = '';
    form.subject = siteConfig.value.type === 'dev' ? 'project' : 'appointment';
    form.message = '';
  } catch (error) {
    console.error('Error submitting form:', error);
    formSubmitError.value = true;
  } finally {
    formSubmitting.value = false;
  }
};

// Meta tags
useHead({
  title: `Contact - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`,
  meta: [
    { name: 'description', content: siteConfig.value?.type === 'dev' 
      ? 'Contact Allison for web development projects, collaborations, or general inquiries'
      : 'Contact Allison for tattoo appointments, custom designs, or questions about the process'
    }
  ]
});
</script> 