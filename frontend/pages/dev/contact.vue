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
            <UCard class="p-6">
              <div class="flex items-center mb-4">
                <UIcon name="i-heroicons-envelope" class="w-6 h-6 text-primary dark:text-primary-400 mr-3" />
                <h2 class="text-xl font-semibold">Email</h2>
              </div>
              <a href="mailto:dev@allisons.dev" class="text-primary dark:text-primary-400 hover:underline">dev@allisons.dev</a>
            </UCard>
            
            <UCard class="p-6">
              <div class="flex items-center mb-4">
                <UIcon name="i-heroicons-chat-bubble-left-right" class="w-6 h-6 text-primary dark:text-primary-400 mr-3" />
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
            </UCard>
            
            <UCard class="p-6">
              <div class="flex items-center mb-4">
                <UIcon name="i-heroicons-clock" class="w-6 h-6 text-primary dark:text-primary-400 mr-3" />
                <h2 class="text-xl font-semibold">Response Time</h2>
              </div>
              <p>I typically respond within 24-48 hours on weekdays.</p>
            </UCard>
          </div>
          
          <UCard class="p-8">
            <h2 class="text-2xl font-semibold mb-6">Send Me a Message</h2>
            
            <UForm 
              :schema="schema" 
              :state="state" 
              class="space-y-6" 
              @submit="onSubmit"
            >
              <div class="grid md:grid-cols-2 gap-6">
                <UFormField label="Name" name="name" required>
                  <UInput 
                    v-model="state.name" 
                    placeholder="John Doe"
                    size="lg"
                  />
                </UFormField>
                
                <UFormField label="Email" name="email" required>
                  <UInput 
                    v-model="state.email" 
                    type="email"
                    placeholder="john@example.com"
                    size="lg"
                  />
                </UFormField>
              </div>
              
              <UFormField label="Subject" name="subject" required>
                <UInput 
                  v-model="state.subject" 
                  placeholder="Project Inquiry"
                  size="lg"
                />
              </UFormField>
              
              <UFormField 
                label="Message" 
                name="message" 
                required
                description="Please provide details about your project or inquiry."
              >
                <UTextarea 
                  v-model="state.message" 
                  :rows="5"
                  placeholder="Tell me about your project..."
                  size="lg"
                />
              </UFormField>
              
              <UFormField name="privacy">
                <UCheckbox 
                  v-model="state.privacy" 
                  label="I agree to the privacy policy and consent to being contacted regarding my inquiry."
                />
              </UFormField>
              
              <div class="flex items-center gap-4">
                <UButton 
                  type="submit" 
                  size="lg"
                  :loading="submitting"
                  :disabled="submitting"
                >
                  {{ submitting ? 'Sending...' : 'Send Message' }}
                </UButton>
                
                <UButton 
                  type="button"
                  color="neutral"
                  variant="ghost"
                  size="lg"
                  @click="resetForm"
                >
                  Clear Form
                </UButton>
              </div>
            </UForm>
          </UCard>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import { useSiteConfig } from '~/utils/site-config';

// Ensure site config is set to dev
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'dev') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'dev'
  };
}

// Define the schema for form validation
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  privacy: z.boolean().refine(value => value === true, {
    message: 'You must agree to the privacy policy'
  })
});

type Schema = z.output<typeof schema>;

// Form state
const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  subject: undefined,
  message: undefined,
  privacy: false
});

const submitting = ref(false);
const toast = useToast();

// Form submission handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  submitting.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message
    toast.add({
      title: 'Message Sent!',
      description: "Thank you for your message! I'll get back to you as soon as possible.",
      color: 'success',
      icon: 'i-heroicons-check-circle'
    });
    
    // Reset form
    resetForm();
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Something went wrong. Please try again later.',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    });
  } finally {
    submitting.value = false;
  }
}

// Reset form helper
function resetForm() {
  state.name = undefined;
  state.email = undefined;
  state.subject = undefined;
  state.message = undefined;
  state.privacy = false;
}

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