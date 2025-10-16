<template>
  <main class="min-h-screen bg-gradient-animated bg-dots relative overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"/>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"/>
    </div>

    <div class="relative z-10 container max-w-6xl mx-auto px-6 py-20">
      <header class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 text-gradient-animated">
          {{ contactContent.hero.title }}
        </h1>
        <p class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
          {{ contactContent.hero.description }}
        </p>
      </header>

      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <!-- Contact Info -->
        <div class="space-y-8">
          <UCard variant="outline" class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
            <h2 class="text-2xl font-bold mb-6 text-primary">{{ contactContent.contactCard.title }}</h2>
            <p class="text-default mb-8">
              {{ contactContent.contactCard.description }}
            </p>

            <div class="space-y-6">
              <a
                v-for="method in contactContent.contactCard.methods"
                :key="method.id"
                :href="method.url"
                class="flex items-center gap-4 group hover:translate-x-1 transition-transform"
                :target="method.url.startsWith('http') ? '_blank' : undefined"
                :rel="method.url.startsWith('http') ? 'noopener noreferrer' : undefined"
              >
                <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <UIcon :name="method.icon" class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p class="text-sm text-muted">{{ method.label }}</p>
                  <p class="text-default font-medium">{{ method.value }}</p>
                </div>
              </a>
            </div>
          </UCard>

          <!-- Availability Card -->
          <UCard variant="outline" class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
            <div class="flex items-center gap-4">
              <div class="relative">
                <div
                  class="w-3 h-3 rounded-full animate-pulse"
                  :class="contactContent.availability.indicatorClass ?? 'bg-green-500'"
                />
                <div
                  class="absolute inset-0 w-3 h-3 rounded-full animate-ping"
                  :class="contactContent.availability.indicatorClass ?? 'bg-green-500'"
                />
              </div>
              <div>
                <p class="font-semibold text-default">{{ contactContent.availability.status }}</p>
                <p class="text-sm text-muted">{{ contactContent.availability.description }}</p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Contact Form -->
        <UCard class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
          <template #header>
            <h2 class="text-2xl font-bold">{{ contactContent.form.title }}</h2>
          </template>

          <UForm
            :validate="validate"
            :state="form"
            :schema="schema"
            class="space-y-6"
            @submit="onSubmit"
            @error="onError"
          >
            <UFormField :label="contactContent.form.nameField.label" name="name" required :ui="{ label: 'text-sm font-medium' }">
              <UInput
                v-model="form.name"
                :placeholder="contactContent.form.nameField.placeholder"
                size="lg"
                :ui="{ placeholder: 'text-muted' }"
                autocomplete="name"
              />
            </UFormField>

            <UFormField :label="contactContent.form.emailField.label" name="email" required :ui="{ label: 'text-sm font-medium' }">
              <UInput
                v-model="form.email"
                type="email"
                :placeholder="contactContent.form.emailField.placeholder"
                size="lg"
                :ui="{ placeholder: 'text-muted' }"
                autocomplete="email"
              />
            </UFormField>

            <UFormField :label="contactContent.form.subjectField.label" name="subject" :ui="{ label: 'text-sm font-medium' }">
              <USelectMenu
                v-model="form.subject"
                :options="subjectOptions"
                searchable
                size="lg"
                :placeholder="contactContent.form.subjectField.placeholder"
                value-attribute="value"
                option-attribute="label"
                :ui="{ placeholder: 'text-muted' }"
              >
                <template #leading>
                  <UIcon name="i-lucide-tag" class="w-5 h-5 text-muted" />
                </template>
              </USelectMenu>
            </UFormField>

            <UFormField :label="contactContent.form.messageField.label" name="message" required :ui="{ label: 'text-sm font-medium' }">
              <UTextarea
                v-model="form.message"
                :rows="6"
                :placeholder="contactContent.form.messageField.placeholder"
                size="lg"
                :ui="{ placeholder: 'text-muted' }"
                :resize="true"
              />
            </UFormField>

            <div class="flex gap-4 pt-4">
              <UButton
                type="submit"
                :loading="formSubmitting"
                size="lg"
                color="primary"
                :ui="{ rounded: 'rounded-lg' }"
                class="flex-1"
                :disabled="formSubmitting"
              >
                <template #leading>
                  <UIcon name="i-lucide-send" class="w-5 h-5" />
                </template>
                <template #default>
                  {{ formSubmitting ? contactContent.form.submitButton.loadingLabel : contactContent.form.submitButton.label }}
                </template>
              </UButton>

              <UButton
                type="reset"
                variant="outline"
                size="lg"
                color="gray"
                :ui="{ rounded: 'rounded-lg' }"
                :disabled="formSubmitting"
                @click="resetForm"
              >
                <template #leading>
                  <UIcon name="i-lucide-rotate-ccw" class="w-5 h-5" />
                </template>
                {{ contactContent.form.resetButton.label }}
              </UButton>
            </div>

            <UAlert
              v-if="formSubmitSuccess"
              color="green"
              variant="soft"
              :title="contactContent.form.successAlert.title"
              :description="contactContent.form.successAlert.description"
              :icon="contactContent.form.successAlert.icon"
            />

            <UAlert
              v-if="formSubmitError"
              color="red"
              variant="soft"
              :title="contactContent.form.errorAlert.title"
              :description="contactContent.form.errorAlert.description"
              :icon="contactContent.form.errorAlert.icon"
            />
          </UForm>
        </UCard>
      </div>

      <!-- FAQ Section -->
      <section class="mt-20">
        <h2 class="text-3xl font-bold mb-8 text-center">{{ contactContent.faq.title }}</h2>
        <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <UCard
            v-for="item in contactContent.faq.items"
            :key="item.question"
            variant="outline"
            class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20"
          >
            <h3 class="font-semibold mb-2 text-primary">{{ item.question }}</h3>
            <p class="text-muted">{{ item.answer }}</p>
          </UCard>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod';

interface ContactMethod {
  id: string;
  label: string;
  value: string;
  url: string;
  icon: string;
}

interface FormFieldContent {
  label: string;
  placeholder: string;
}

interface AlertContent {
  title: string;
  description: string;
  icon?: string;
}

interface ContactContent {
  hero: {
    title: string;
    description: string;
  };
  contactCard: {
    title: string;
    description: string;
    methods: ContactMethod[];
  };
  availability: {
    status: string;
    description: string;
    indicatorClass?: string;
  };
  form: {
    title: string;
    nameField: FormFieldContent;
    emailField: FormFieldContent;
    subjectField: FormFieldContent;
    messageField: FormFieldContent;
    subjectOptions: Array<{ label: string; value: string; icon?: string }>;
    defaultSubject?: string;
    submitButton: {
      label: string;
      loadingLabel: string;
    };
    resetButton: {
      label: string;
    };
    successAlert: AlertContent;
    errorAlert: AlertContent;
  };
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  meta: {
    title: string;
    description: string;
  };
}

const fallbackContactContent: ContactContent = {
  hero: {
    title: '',
    description: ''
  },
  contactCard: {
    title: '',
    description: '',
    methods: []
  },
  availability: {
    status: '',
    description: '',
    indicatorClass: 'bg-green-500'
  },
  form: {
    title: '',
    nameField: { label: '', placeholder: '' },
    emailField: { label: '', placeholder: '' },
    subjectField: { label: '', placeholder: '' },
    messageField: { label: '', placeholder: '' },
    subjectOptions: [],
    defaultSubject: '',
    submitButton: { label: '', loadingLabel: '' },
    resetButton: { label: '' },
    successAlert: { title: '', description: '' },
    errorAlert: { title: '', description: '' }
  },
  faq: {
    title: '',
    items: []
  },
  meta: {
    title: '',
    description: ''
  }
};

const { data: contactContentData } = await useAsyncData<ContactContent | null>(
  'contact-content',
  async () => {
    const document = await queryCollection('contact').first();

    if (!document) {
      return null;
    }

    const { body: _body, ...content } = document as ContactContent & { body?: unknown };

    return content;
  }
);

const contactContent = computed(() => contactContentData.value ?? fallbackContactContent);
const subjectOptions = computed(() => contactContent.value.form.subjectOptions ?? []);
const defaultSubject = computed(() => contactContent.value.form.defaultSubject ?? subjectOptions.value[0]?.value ?? '');

// Zod schema for validation
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters')
});

// Form data
const form = reactive({
  name: '',
  email: '',
  subject: defaultSubject.value,
  message: ''
});

watch(defaultSubject, (value) => {
  if (value && form.subject !== value) {
    form.subject = value;
  }
});

watch(subjectOptions, (options) => {
  if (!options.length) {
    form.subject = '';
    return;
  }

  if (!options.find((option) => option.value === form.subject)) {
    form.subject = defaultSubject.value;
  }
});

// Form states
const formSubmitting = ref(false);
const formSubmitSuccess = ref(false);
const formSubmitError = ref(false);

// Form validation using Zod
const validate = (state: typeof form): FormError[] => {
  try {
    schema.parse(state);
    return [];
  } catch (error) {
    const zodError = error as { errors: Array<{ path: string[]; message: string }> };
    return zodError.errors.map((err) => ({
      name: err.path[0] as string,
      message: err.message
    }));
  }
};

// Reset form function
const resetForm = () => {
  form.name = '';
  form.email = '';
  form.subject = defaultSubject.value;
  form.message = '';
  formSubmitSuccess.value = false;
  formSubmitError.value = false;
};

// Handle form submission
const onSubmit = async (_event: FormSubmitEvent<typeof form>) => {
  formSubmitting.value = true;
  formSubmitSuccess.value = false;
  formSubmitError.value = false;

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock successful submission
    formSubmitSuccess.value = true;

    // Reset form
    resetForm();

    // Hide success message after 5 seconds
    setTimeout(() => {
      formSubmitSuccess.value = false;
    }, 5000);
  } catch (error) {
    console.error('Error submitting form:', error);
    formSubmitError.value = true;

    // Hide error message after 5 seconds
    setTimeout(() => {
      formSubmitError.value = false;
    }, 5000);
  } finally {
    formSubmitting.value = false;
  }
};

// Handle form validation errors
const onError = (event: FormErrorEvent) => {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id);
    element?.focus();
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

// Meta tags
useHead(() => ({
  title: contactContent.value.meta.title,
  meta: [
    {
      name: 'description',
      content: contactContent.value.meta.description
    }
  ]
}));
</script>
