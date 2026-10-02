<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"/>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"/>
    </div>

    <div class="relative z-10 container max-w-6xl mx-auto px-6 py-20">
      <header class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 text-gradient-animated">Say Hi</h1>
        <p class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
          Working on a browser agent, a dev tool or a language?
          Need one more person for a hackathon? Tell me about it.
        </p>
      </header>

      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <!-- Contact Info -->
        <div class="space-y-8">
          <UCard variant="outline" class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
            <h2 class="text-2xl font-bold mb-6 text-primary">Let's Connect</h2>
            <p class="text-default mb-8">
              Happy to talk WebMCP, agent systems, languages and runtimes, split keyboards,
              or whatever strange thing you're working on. Email works best.
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

              <!-- X -->
              <a
href="https://x.com/AllieCatOwO" target="_blank" rel="noopener noreferrer"
                 class="flex items-center gap-4 group hover:translate-x-1 transition-transform">
                <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <UIcon name="i-simple-icons-x" class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p class="text-sm text-muted">X</p>
                  <p class="text-default font-medium">@AllieCatOwO</p>
                </div>
              </a>

            </div>
          </UCard>

          <!-- What I'm open to -->
          <UCard variant="outline" class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
            <div class="flex items-start gap-4">
              <div class="relative mt-1.5 shrink-0" aria-hidden="true">
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"/>
              </div>
              <div>
                <p class="font-semibold text-default">Open to collaborations</p>
                <p class="text-sm text-muted">
                  Hackathon teams, side projects, community things,
                  and the occasional "what if we started something" conversation.
                </p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Contact Form -->
        <UCard class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
          <template #header>
            <h2 class="text-2xl font-bold">Send a Message</h2>
          </template>

          <!-- Declarative WebMCP: an agent can fill this in. No `toolautosubmit`, so sending stays a human click.
               The Subject combobox has `name=""` so Reka skips its nameless hidden bridge input, which would
               otherwise show up to agents as an undescribed parameter. Subject is optional; agents put it in the message. -->
          <UForm
            toolname="send_message"
            tooldescription="Fill in the contact form to send Allison Coleman a message. The form is only filled in, not sent: the person using the page reviews it and presses Send Message."
            :state="form"
            :schema="schema"
            :action="FORM_NOJS_ACTION"
            method="post"
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
                toolparamdescription="The sender's full name"
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
                toolparamdescription="The sender's email address, so Allison can reply"
              />
            </UFormField>

            <UFormField label="Subject" name="subject" :ui="formFieldUi">
              <USelectMenu
                v-model="form.subject"
                :items="subjectOptions"
                :search-input="false"
                size="lg"
                placeholder="Select inquiry type"
                value-key="value"
                label-key="label"
                name=""
                :ui="selectUi"
                class="w-full"
              >
                <template #leading>
                  <UIcon name="i-lucide-tag" class="w-5 h-5 text-muted" />
                </template>
              </USelectMenu>
            </UFormField>

            <!-- Honeypot: hidden from people and assistive tech, bots fill it in -->
            <div class="hidden" aria-hidden="true">
              <label for="contact-honey">Leave this empty</label>
              <input id="contact-honey" v-model="honeypot" type="text" name="_honey" tabindex="-1" autocomplete="off" toolparamdescription="Spam trap. Always leave empty.">
            </div>

            <UFormField label="Message" name="message" required :ui="formFieldUi">
              <UTextarea
                v-model="form.message"
                :rows="6"
                placeholder="What are you building?"
                size="lg"
                :ui="textareaUi"
                class="w-full"
                :resize="true"
                toolparamdescription="The message itself: what the sender is building or wants to talk about"
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
                color="neutral"
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
              color="success"
              variant="soft"
              title="Message sent successfully!"
              description="I'll get back to you soon."
              icon="i-lucide-check-circle"
            />

            <UAlert
              v-if="formSubmitError"
              color="error"
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
            <h3 class="font-semibold mb-2 text-primary">What should I message you about?</h3>
            <p class="text-muted">Side projects, hackathon invites, WebMCP and agent questions, start-something ideas, and pictures of your keyboard.</p>
          </UCard>
          <UCard variant="outline" class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
            <h3 class="font-semibold mb-2 text-primary">Want to team up for a hackathon?</h3>
            <p class="text-muted">Yes, especially if it involves agents in the browser or tools for developers. Send the link and your idea.</p>
          </UCard>
          <UCard variant="outline" class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
            <h3 class="font-semibold mb-2 text-primary">Are you available for freelance work or a new role?</h3>
            <p class="text-muted">Not right now. I'm happily at Hinge Health. Collaborations and side projects are a different story.</p>
          </UCard>
          <UCard variant="outline" class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
            <h3 class="font-semibold mb-2 text-primary">What do you build with?</h3>
            <p class="text-muted">TypeScript, Vue and Nuxt, Rust, Python and Go, mostly around agents, developer tools and languages. The About page has more.</p>
          </UCard>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

// Zod probes `new Function` to JIT-compile object parsers; under the site's CSP (no 'unsafe-eval')
// that probe is reported as a violation even though zod catches it. A form this small gains nothing
// from the JIT anyway.
z.config({ jitless: true })

const schema = z.object({
  name: z
    .string({ message: 'Please enter your name' })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string({ message: 'Please enter your email address' }).email('Please enter a valid email address'),
  subject: z.enum(['hackathon', 'collaboration', 'startup', 'question', 'other'], {
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
  subject: 'collaboration',
  message: ''
})

// Honeypot for bots. FormSubmit drops any submission where `_honey` is filled.
const honeypot = ref('')

// USelectMenu renders a visually hidden native <input name="subject"> (Reka's form bridge) with no
// label. The visible combobox is already labelled by "Subject", so hide the bridge from the
// accessibility tree. This form submits from JS state, not from that input.
onMounted(() => {
  document.querySelectorAll('input[data-hidden]').forEach(el => el.setAttribute('aria-hidden', 'true'))
})

// Subject options for USelectMenu
const subjectOptions = [
  { label: 'Collaboration / side project', value: 'collaboration', icon: 'i-lucide-users' },
  { label: 'Hackathon team-up', value: 'hackathon', icon: 'i-lucide-trophy' },
  { label: 'Starting something', value: 'startup', icon: 'i-lucide-rocket' },
  { label: 'WebMCP / agents question', value: 'question', icon: 'i-lucide-message-circle' },
  { label: 'Just saying hi', value: 'other', icon: 'i-lucide-hand' }
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
  base:
    'rounded-xl border border-white/15 dark:border-white/10 bg-white/5 dark:bg-white/5 text-default placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all',
  item: 'text-default'
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
  form.subject = 'collaboration'
  form.message = ''
  honeypot.value = ''
  if (options.clearStatus) {
    formSubmitSuccess.value = false
    formSubmitError.value = false
  }
}

// Handle form submission
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/me@allisons.dev'
// Without JavaScript the form posts here (the same inbox, the non-AJAX endpoint). With JavaScript,
// UForm cancels the native submit and onSubmit sends it through FORM_ENDPOINT instead.
const FORM_NOJS_ACTION = 'https://formsubmit.co/me@allisons.dev'

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
      _captcha: 'true',
      _honey: honeypot.value
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

useSiteSeo({
  title: 'Contact Allison Coleman: WebMCP, agents & hackathons',
  description: 'Contact Allison Coleman about WebMCP, browser agents, developer tools or a hackathon idea. Email works best; GitHub, LinkedIn and X are linked here too.',
  jsonLd: {
    '@type': 'ContactPage',
    'name': 'Contact Allison Coleman',
    'url': absoluteSiteUrl('/contact/'),
    'mainEntity': {
      ...personRef(),
      'email': 'me@allisons.dev',
      'sameAs': personSchema().sameAs
    }
  }
})
</script>
