<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary-700/10 to-primary-700/20 dark:from-primary-400/20 dark:to-primary-400/30">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold mb-6 relative inline-block">
            Book a Consultation
            <span class="absolute -bottom-2 left-0 w-32 h-2 bg-primary-700 dark:bg-primary-400 opacity-70"></span>
          </h1>
          <p class="text-lg mb-12 italic">
            Ready to bring your tattoo idea to life? Schedule a consultation to discuss your vision,
            placement, size, and any questions you might have about the process.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            <div class="relative">
              <UCard class="p-8 relative z-10">
                <h2 class="text-2xl font-bold mb-6 text-primary">Studio Information</h2>
                
                <div class="space-y-6">
                  <div class="flex items-start">
                    <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 class="font-semibold mb-1">Location</h3>
                      <p>Painted Canvas Studio</p>
                      <p>123 Art Avenue</p>
                      <p>Portland, OR 97201</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <UIcon name="i-heroicons-clock" class="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 class="font-semibold mb-1">Studio Hours</h3>
                      <p>Tuesday - Saturday</p>
                      <p>11:00 AM - 7:00 PM</p>
                      <p class="text-sm italic mt-1">By appointment only</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <UIcon name="i-heroicons-envelope" class="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 class="font-semibold mb-1">Email</h3>
                      <a href="mailto:ink@allisons.gay" class="text-primary hover:underline">ink@allisons.gay</a>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <UIcon name="i-heroicons-phone" class="w-6 h-6 text-primary-700 dark:text-primary-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 class="font-semibold mb-1">Phone</h3>
                      <p>(503) 555-8989</p>
                      <p class="text-sm italic mt-1">Text preferred for initial contact</p>
                    </div>
                  </div>
                  
                  <div class="flex justify-center space-x-6 pt-4">
                    <a href="https://instagram.com/allison.tattoo" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-primary dark:text-gray-400">
                      <span class="sr-only">Instagram</span>
                      <svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </UCard>
              <!-- Decorative elements for tattoo style -->
              <div class="absolute top-5 right-5 w-20 h-20 rounded-full bg-primary-700/20 dark:bg-primary-400/20 z-0"></div>
              <div class="absolute -bottom-5 -left-5 w-16 h-16 rounded-full bg-primary-700/20 dark:bg-primary-400/20 z-0"></div>
            </div>
            
            <div class="relative">
              <UCard class="p-8 relative z-10">
                <h2 class="text-2xl font-bold mb-6 text-primary-700 dark:text-primary-400">Booking Process</h2>
                
                <div class="space-y-8">
                  <div class="flex">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-700 dark:bg-primary-400 flex items-center justify-center text-white font-bold mr-4">
                      1
                    </div>
                    <div>
                      <h3 class="font-semibold text-lg mb-1">Initial Inquiry</h3>
                      <p class="text-gray-600 dark:text-gray-300">Fill out the consultation form below with details about your tattoo idea.</p>
                    </div>
                  </div>
                  
                  <div class="flex">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-700 dark:bg-primary-400 flex items-center justify-center text-white font-bold mr-4">
                      2
                    </div>
                    <div>
                      <h3 class="font-semibold text-lg mb-1">Consultation</h3>
                      <p class="text-gray-600 dark:text-gray-300">We'll schedule a consultation to discuss your design, placement, and answer any questions.</p>
                    </div>
                  </div>
                  
                  <div class="flex">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-700 dark:bg-primary-400 flex items-center justify-center text-white font-bold mr-4">
                      3
                    </div>
                    <div>
                      <h3 class="font-semibold text-lg mb-1">Design Process</h3>
                      <p class="text-gray-600 dark:text-gray-300">I'll create a custom design based on our consultation and send it for your review and feedback.</p>
                    </div>
                  </div>
                  
                  <div class="flex">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-700 dark:bg-primary-400 flex items-center justify-center text-white font-bold mr-4">
                      4
                    </div>
                    <div>
                      <h3 class="font-semibold text-lg mb-1">Booking & Deposit</h3>
                      <p class="text-gray-600 dark:text-gray-300">Once the design is finalized, we'll book your appointment and collect a deposit to secure your spot.</p>
                    </div>
                  </div>
                </div>
              </UCard>
              <!-- Decorative elements for tattoo style -->
              <div class="absolute -top-5 -left-5 w-16 h-16 rounded-full bg-primary-700/20 dark:bg-primary-400/20 z-0"></div>
              <div class="absolute bottom-10 right-0 w-20 h-20 rounded-full bg-primary-700/20 dark:bg-primary-400/20 z-0"></div>
            </div>
          </div>
          
          <UCard class="p-8 relative overflow-hidden">
            <!-- Decorative element -->
            <div class="absolute top-0 right-0 h-32 w-32 bg-primary-700/10 dark:bg-primary-400/10 rounded-bl-full"></div>
            
            <h2 class="text-2xl font-bold mb-6 text-primary-700 dark:text-primary-400 relative z-10">Consultation Request</h2>
            
            <UForm
              :schema="schema"
              :state="state"
              class="space-y-6 relative z-10"
              @submit="onSubmit"
            >
              <div class="grid md:grid-cols-2 gap-4">
                <UFormField label="Full Name" name="name" required>
                  <UInput 
                    v-model="state.name" 
                    placeholder="Your full name"
                    size="lg"
                  />
                </UFormField>
                
                <UFormField label="Email Address" name="email" required>
                  <UInput 
                    v-model="state.email" 
                    type="email"
                    placeholder="your@email.com"
                    size="lg"
                  />
                </UFormField>
              </div>
              
              <div class="grid md:grid-cols-2 gap-6">
                <UFormField label="Phone Number" name="phone">
                  <UInput 
                    v-model="phoneModel" 
                    type="tel"
                    placeholder="(555) 123-4567"
                    size="lg"
                  />
                </UFormField>
                
                <UFormField label="Tattoo Style" name="style" required>
                  <USelect 
                    v-model="state.style"
                    placeholder="Select a style"
                    :items="tattooStyles"
                    size="lg"
                  />
                </UFormField>
              </div>
              
              <UFormField label="Tattoo Placement" name="placement" required>
                <UInput 
                  v-model="state.placement" 
                  placeholder="Arm, leg, back, etc."
                  size="lg"
                />
              </UFormField>
              
              <UFormField label="Approximate Size" name="size" required>
                <USelect 
                  v-model="state.size"
                  placeholder="Select size range"
                  :items="sizeOptions"
                  size="lg"
                />
              </UFormField>
              
              <UFormField 
                label="Tattoo Idea Description" 
                name="idea" 
                required
                description="Please describe your tattoo idea in as much detail as possible. Include any references, meanings, or specific elements you'd like included."
              >
                <UTextarea 
                  v-model="state.idea" 
                  :rows="7"
                  placeholder="Describe your tattoo idea..."
                  size="lg"
                />
              </UFormField>
              
              <UFormField 
                label="Previous Tattoo Experience" 
                name="previous"
                description="Is this your first tattoo? Any concerns about pain, etc.?"
              >
                <UTextarea 
                  v-model="previousModel" 
                  :rows="2"
                  placeholder="Share any previous experience or concerns..."
                  size="lg"
                />
              </UFormField>
              
              <UFormField name="consent">
                <UCheckbox 
                  v-model="state.consent" 
                  label="I am 18 years of age or older and consent to being contacted about my tattoo inquiry. I understand that filling out this form does not guarantee an appointment."
                  size="md"
                />
              </UFormField>
              
              <div class="flex items-center gap-4">
                <UButton 
                  type="submit" 
                  size="lg"
                  color="primary"
                  variant="solid"
                  :loading="submitting"
                  :disabled="submitting"
                  class="rounded-full shadow-lg transform transition-transform hover:scale-105"
                >
                  {{ submitting ? 'Submitting...' : 'Submit Consultation Request' }}
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

// Ensure site config is set to tattoo
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'tattoo') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'tattoo'
  };
}

// Form options
const tattooStyles = [
  { label: 'Fine Line', value: 'Fine Line' },
  { label: 'Watercolor', value: 'Watercolor' },
  { label: 'Black & Gray', value: 'Black & Gray' },
  { label: 'Custom Mix', value: 'Custom Mix' },
  { label: 'Not Sure (We\'ll discuss)', value: 'Not Sure' }
];

const sizeOptions = [
  { label: 'Small (1-2 inches)', value: 'Small (1-2 inches)' },
  { label: 'Medium (3-5 inches)', value: 'Medium (3-5 inches)' },
  { label: 'Large (6-10 inches)', value: 'Large (6-10 inches)' },
  { label: 'Extra Large (10+ inches)', value: 'Extra Large (10+ inches)' },
  { label: 'Full Sleeve/Leg/Back', value: 'Full Sleeve/Leg/Back' }
];

// Define the schema for form validation
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  style: z.string().min(1, 'Please select a tattoo style'),
  placement: z.string().min(2, 'Please specify tattoo placement'),
  size: z.string().min(1, 'Please select a size range'),
  idea: z.string().min(10, 'Please provide at least 10 characters describing your idea'),
  previous: z.string().optional(),
  consent: z.boolean().refine(value => value === true, {
    message: 'You must confirm that you are 18 or older and consent to being contacted'
  })
});

type Schema = z.output<typeof schema>;

// Form state
const state = reactive<Schema>({
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

// v-model wrappers to avoid undefined unions from optional schema fields
const phoneModel = computed<string>({
  get: () => state.phone ?? '',
  set: (v: string) => { state.phone = v ?? '' }
})
const previousModel = computed<string>({
  get: () => state.previous ?? '',
  set: (v: string) => { state.previous = v ?? '' }
})

const submitting = ref(false);
const toast = useToast();

// Form submission handler
async function onSubmit(_: FormSubmitEvent<Schema>) {
  submitting.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message
    toast.add({
      title: 'Consultation Request Submitted!',
      description: "Thank you for your consultation request! I'll reach out within 48 hours to schedule your consultation.",
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
  state.name = '';
  state.email = '';
  state.phone = '';
  state.style = '';
  state.placement = '';
  state.size = '';
  state.idea = '';
  state.previous = '';
  state.consent = false;
}

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
