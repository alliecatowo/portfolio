<template>
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
</script>