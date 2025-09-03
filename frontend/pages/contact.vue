<template>
  <main class="min-h-screen bg-gradient-animated bg-dots relative overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
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
          <div class="glass-accent rounded-xl p-8">
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

              <!-- Twitter -->
              <a
href="https://twitter.com/allison" target="_blank" rel="noopener noreferrer"
                 class="flex items-center gap-4 group hover:translate-x-1 transition-transform">
                <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <UIcon name="i-lucide-twitter" class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p class="text-sm text-muted">Twitter</p>
                  <p class="text-default font-medium">@allison</p>
                </div>
              </a>
            </div>
          </div>

          <!-- Availability Card -->
          <div class="glass-accent rounded-xl p-6 flex items-center gap-4">
            <div class="relative">
              <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div class="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <div>
              <p class="font-semibold text-default">Currently Available</p>
              <p class="text-sm text-muted">Open to new projects and opportunities</p>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="glass-accent rounded-xl p-8">
          <h2 class="text-2xl font-bold mb-6">Send a Message</h2>
          
          <form class="space-y-6" @submit.prevent="submitForm">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium mb-2">
                Name <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Your full name"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            <!-- Subject -->
            <div>
              <label for="subject" class="block text-sm font-medium mb-2">
                Subject
              </label>
              <select
                id="subject"
                v-model="form.subject"
                class="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="project">Project Inquiry</option>
                <option value="collaboration">Collaboration</option>
                <option value="consultation">Consultation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium mb-2">
                Message <span class="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="6"
                class="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                placeholder="Tell me about your project or inquiry..."
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="formSubmitting"
              class="w-full px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary-600 font-semibold transition-all btn-depth magnetic-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!formSubmitting" class="flex items-center justify-center gap-2">
                <UIcon name="i-lucide-send" class="w-5 h-5" />
                Send Message
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <UIcon name="i-lucide-loader-2" class="w-5 h-5 animate-spin" />
                Sending...
              </span>
            </button>

            <!-- Success/Error Messages -->
            <Transition name="fade">
              <div v-if="formSubmitSuccess" class="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p class="text-green-600 dark:text-green-400 flex items-center gap-2">
                  <UIcon name="i-lucide-check-circle" class="w-5 h-5" />
                  Message sent successfully! I'll get back to you soon.
                </p>
              </div>
            </Transition>

            <Transition name="fade">
              <div v-if="formSubmitError" class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p class="text-red-600 dark:text-red-400 flex items-center gap-2">
                  <UIcon name="i-lucide-alert-circle" class="w-5 h-5" />
                  There was an error sending your message. Please try again.
                </p>
              </div>
            </Transition>
          </form>
        </div>
      </div>

      <!-- FAQ Section -->
      <section class="mt-20">
        <h2 class="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div class="glass-accent rounded-lg p-6">
            <h3 class="font-semibold mb-2 text-primary">What's your typical response time?</h3>
            <p class="text-muted">I usually respond within 24-48 hours during business days.</p>
          </div>
          <div class="glass-accent rounded-lg p-6">
            <h3 class="font-semibold mb-2 text-primary">Are you available for freelance work?</h3>
            <p class="text-muted">Yes! I'm open to freelance projects and consultations.</p>
          </div>
          <div class="glass-accent rounded-lg p-6">
            <h3 class="font-semibold mb-2 text-primary">What technologies do you work with?</h3>
            <p class="text-muted">Vue.js, Nuxt, React, Node.js, TypeScript, and more. Check my About page for details.</p>
          </div>
          <div class="glass-accent rounded-lg p-6">
            <h3 class="font-semibold mb-2 text-primary">Do you work remotely?</h3>
            <p class="text-muted">Yes, I work with clients globally and am comfortable with remote collaboration.</p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">

// Form data
const form = reactive({
  name: '',
  email: '',
  subject: 'project',
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful submission
    formSubmitSuccess.value = true;
    
    // Reset form
    form.name = '';
    form.email = '';
    form.subject = 'project';
    form.message = '';
    
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

// Meta tags
useHead({
  title: 'Contact | Allison\'s Developer Portfolio',
  meta: [
    { 
      name: 'description', 
      content: 'Get in touch with Allison for web development projects, collaborations, or consultations.' 
    }
  ]
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>