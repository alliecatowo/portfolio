<template>
  <main class="min-h-screen bg-gradient-animated bg-dots relative overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"/>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"/>
    </div>

    <div class="relative z-10 container max-w-6xl mx-auto px-6 py-20">
      <header class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 text-gradient-animated">Get In Touch</h1>
        <p class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
          I'm always interested in new opportunities and collaborations. 
          Let's discuss how we can work together.
        </p>
      </header>

      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <!-- Contact Info -->
        <div class="space-y-8">
          <UCard variant="outline" class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
            <h2 class="text-2xl font-bold mb-6 text-primary">Let's Connect</h2>
            <p class="text-default mb-8">
              Whether you have a project in mind, need technical consultation, or just want to say hello, 
              I'd love to hear from you. I typically respond within 24-48 hours.
            </p>

            <div class="space-y-6">
              <!-- Email -->
              <a href="mailto:me@allisons.dev" class="flex items-center gap-4 group hover:translate-x-1 transition-transform">
                <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <UIcon name="i-lucide-mail" class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p class="text-sm text-muted">Email</p>
                  <p class="text-default font-medium">me@allisons.dev</p>
                </div>
              </a>

              <!-- GitHub -->
              <a
href="https://github.com/alliecatowo" target="_blank" rel="noopener noreferrer" 
                 class="flex items-center gap-4 group hover:translate-x-1 transition-transform">
                <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <UIcon name="i-lucide-github" class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p class="text-sm text-muted">GitHub</p>
                  <p class="text-default font-medium">@alliecatowo</p>
                </div>
              </a>

              <!-- LinkedIn -->
              <a
href="https://linkedin.com/in/allie-cat" target="_blank" rel="noopener noreferrer"
                 class="flex items-center gap-4 group hover:translate-x-1 transition-transform">
                <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <UIcon name="i-lucide-linkedin" class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p class="text-sm text-muted">LinkedIn</p>
                  <p class="text-default font-medium">@allie-cat</p>
                </div>
              </a>

            </div>
          </UCard>

          <!-- Availability Card -->
          <UCard variant="outline" class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
            <div class="flex items-center gap-4">
              <div class="relative">
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"/>
                <div class="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"/>
              </div>
              <div>
                <p class="font-semibold text-default">Currently Available</p>
                <p class="text-sm text-muted">Open to new projects and opportunities</p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Contact Form -->
        <UCard class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
          <template #header>
            <h2 class="text-2xl font-bold">Send a Message</h2>
          </template>

          <UForm
            :state="form"
            :schema="schema"
            class="space-y-8"
            @submit="onSubmit"
            @error="onError"
          >
            <UFormField label="Name" name="name" required :ui="formFieldUi">
              <UInput
                v-model="form.name"
                placeholder="Your full name"
                size="lg"
                :ui="inputUi"
                class="w-full"
                autocomplete="name"
              />
            </UFormField>

            <UFormField label="Email" name="email" required :ui="formFieldUi">
              <UInput
                v-model="form.email"
                type="email"
                placeholder="your.email@example.com"
                size="lg"
                :ui="inputUi"
                class="w-full"
                autocomplete="email"
              />
            </UFormField>

            <UFormField label="Subject" name="subject" :ui="formFieldUi">
              <USelectMenu
                v-model="form.subject"
                :items="subjectOptions"
                searchable
                size="lg"
                placeholder="Select inquiry type"
                value-attribute="value"
                option-attribute="label"
                :ui="selectUi"
                class="w-full"
              >
                <template #leading>
                  <UIcon name="i-lucide-tag" class="w-5 h-5 text-muted" />
                </template>
              </USelectMenu>
            </UFormField>

            <UFormField label="Message" name="message" required :ui="formFieldUi">
              <UTextarea
                v-model="form.message"
                :rows="6"
                placeholder="Tell me about your project or inquiry..."
                size="lg"
                :ui="textareaUi"
                class="w-full"
                :resize="true"
              />
            </UFormField>

            <div class="flex flex-col sm:flex-row gap-4 pt-2">
              <UButton
                type="submit"
                :loading="formSubmitting"
                size="lg"
                color="primary"
                variant="magnet"
                :ui="submitButtonUi"
                class="flex-1"
                :disabled="formSubmitting"
              >
                <template #leading>
                  <UIcon name="i-lucide-send" class="w-5 h-5" />
                </template>
                <template #default>
                  {{ formSubmitting ? 'Sending Message...' : 'Send Message' }}
                </template>
              </UButton>

              <UButton
                type="reset"
                variant="outline"
                size="lg"
                color="gray"
                :ui="resetButtonUi"
                :disabled="formSubmitting"
                class="sm:w-auto"
                @click="resetForm({ clearStatus: true })"
              >
                <template #leading>
                  <UIcon name="i-lucide-rotate-ccw" class="w-5 h-5" />
                </template>
                Reset
              </UButton>
            </div>

            <UAlert
              v-if="formSubmitSuccess"
              color="green"
              variant="soft"
              title="Message sent successfully!"
              description="I'll get back to you soon."
              icon="i-lucide-check-circle"
            />

            <UAlert
              v-if="formSubmitError"
              color="red"
              variant="soft"
              title="Error sending message"
              description="There was an error sending your message. Please try again."
              icon="i-lucide-alert-circle"
            />
          </UForm>
        </UCard>
      </div>

      <!-- FAQ Section -->
      <section class="mt-20">
        <h2 class="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <UCard variant="outline" class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
            <h3 class="font-semibold mb-2 text-primary">What's your typical response time?</h3>
            <p class="text-muted">I usually respond within 24-48 hours during business days.</p>
          </UCard>
          <UCard variant="outline" class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
            <h3 class="font-semibold mb-2 text-primary">Are you available for freelance work?</h3>
            <p class="text-muted">Yes! I'm open to freelance projects and consultations.</p>
          </UCard>
          <UCard variant="outline" class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
            <h3 class="font-semibold mb-2 text-primary">What technologies do you work with?</h3>
            <p class="text-muted">Vue.js, Nuxt, React, Node.js, TypeScript, and more. Check my About page for details.</p>
          </UCard>
          <UCard variant="outline" class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
            <h3 class="font-semibold mb-2 text-primary">Do you work remotely?</h3>
            <p class="text-muted">Yes, I work with clients globally and am comfortable with remote collaboration.</p>
          </UCard>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const schema = z.object({
  name: z
    .string({ message: 'Please enter your name' })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string({ message: 'Please enter your email address' }).email('Please enter a valid email address'),
  subject: z.enum(['project', 'hiring', 'collaboration', 'consultation', 'other'], {
    message: 'Please select a subject'
  }),
  message: z
    .string({ message: 'Please enter a message' })
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
})

type ContactForm = z.infer<typeof schema>

const form = reactive<ContactForm>({
  name: '',
  email: '',
  subject: 'project',
  message: ''
})

// Subject options for USelectMenu
const subjectOptions = [
  { label: 'Project Inquiry', value: 'project', icon: 'i-lucide-briefcase' },
  { label: 'Full-Time Opportunity', value: 'hiring', icon: 'i-lucide-id-card' },
  { label: 'Collaboration', value: 'collaboration', icon: 'i-lucide-users' },
  { label: 'Consultation', value: 'consultation', icon: 'i-lucide-message-circle' },
  { label: 'Other', value: 'other', icon: 'i-lucide-help-circle' }
]

const subjectLabel = computed(() => subjectOptions.find((option) => option.value === form.subject)?.label ?? 'General Inquiry')

const formFieldUi = {
  label: 'text-sm font-semibold text-default flex items-center gap-1',
  error: 'text-xs text-rose-400 mt-2'
} as const

const inputUi = {
  base:
    'rounded-xl border border-white/15 dark:border-white/10 bg-white/5 dark:bg-white/5 text-default placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all'
} as const

const selectUi = {
  trigger:
    'rounded-xl border border-white/15 dark:border-white/10 bg-white/5 dark:bg-white/5 text-default placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all',
  option: 'text-default'
} as const

const textareaUi = {
  base:
    'rounded-xl border border-white/15 dark:border-white/10 bg-white/5 dark:bg-white/5 text-default placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all'
} as const

const submitButtonUi = {
  base: 'rounded-xl font-semibold shadow-lg shadow-primary/30'
} as const

const resetButtonUi = {
  base: 'rounded-xl border border-white/20 text-default hover:border-primary hover:text-primary transition-colors'
} as const

// Form states
const formSubmitting = ref(false)
const formSubmitSuccess = ref(false)
const formSubmitError = ref(false)

// Reset form function
const resetForm = (options: { clearStatus?: boolean } = {}) => {
  form.name = ''
  form.email = ''
  form.subject = 'project'
  form.message = ''
  if (options.clearStatus) {
    formSubmitSuccess.value = false
    formSubmitError.value = false
  }
}

// Handle form submission
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/me@allisons.dev'

const onSubmit = async (_event: FormSubmitEvent<ContactForm>) => {
  formSubmitting.value = true
  formSubmitSuccess.value = false
  formSubmitError.value = false

  try {
    const payload = {
      name: form.name,
      email: form.email,
      subject: subjectLabel.value,
      message: form.message,
      _replyto: form.email,
      _subject: `Portfolio Contact: ${subjectLabel.value}`,
      _template: 'table',
      _captcha: 'false'
    }

    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    })

    let data: { success?: string | boolean; message?: string; result?: string } | null = null
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      data = await response.json()
    } else {
      // Attempt to parse JSON response embedded in text, ignore errors
      try {
        const text = await response.text()
        data = JSON.parse(text)
      } catch {
        data = null
      }
    }

    if (response.ok) {
      formSubmitSuccess.value = true
      resetForm()
      setTimeout(() => {
        formSubmitSuccess.value = false
      }, 5000)
      return
    }

    throw new Error(data?.message || 'Unknown error')
  } catch (error) {
    console.error('Error submitting form:', error)
    formSubmitError.value = true
    setTimeout(() => {
      formSubmitError.value = false
    }, 5000)
  } finally {
    formSubmitting.value = false
  }
}

// Handle form validation errors
const onError = (event: FormErrorEvent) => {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// Meta tags
useHead({
  title: "Contact | Allison's Developer Portfolio",
  meta: [
    {
      name: 'description',
      content: 'Get in touch with Allison for web development projects, collaborations, or consultations.'
    }
  ]
})
</script>
