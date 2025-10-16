<template>
  <footer class="py-12 mt-16 border-t border-gray-200/60 dark:border-gray-800/60 bg-gray-50 dark:bg-gray-950" aria-label="Site footer">
    <UContainer>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Site Information -->
        <section aria-labelledby="footer-about">
          <h2 id="footer-about" class="font-bold text-xl mb-4 text-primary dark:text-primary-400">
            {{ footer.title }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">{{ footer.tagline }}</p>
          <nav v-if="footer.socials?.length" class="flex space-x-4 mt-4" aria-label="Social media links">
            <UTooltip
              v-for="social in footer.socials"
              :key="social.url"
              :text="social.tooltip || social.label"
              :delay-duration="300"
            >
              <a
                :href="social.url"
                :target="isExternalLink(social.url) ? '_blank' : undefined"
                :rel="isExternalLink(social.url) ? 'noopener noreferrer' : undefined"
                class="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
              >
                <span class="sr-only">{{ social.srLabel || social.label }}</span>
                <UIcon :name="social.icon" class="h-6 w-6" aria-hidden="true" />
              </a>
            </UTooltip>
          </nav>
        </section>

        <!-- Quick Links -->
        <nav v-if="footer.quickLinks?.length" aria-labelledby="footer-links">
          <h2 id="footer-links" class="font-bold text-xl mb-4 text-primary dark:text-primary-400">Quick Links</h2>
          <ul class="space-y-2">
            <li v-for="link in footer.quickLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Contact -->
        <section v-if="footer.contact" aria-labelledby="footer-contact">
          <h2 id="footer-contact" class="font-bold text-xl mb-4 text-primary dark:text-primary-400">Contact</h2>
          <p v-if="footer.contact?.message" class="text-gray-600 dark:text-gray-300 mb-2">
            {{ footer.contact.message }}
          </p>
          <a
            v-if="footer.contact?.email"
            :href="`mailto:${footer.contact.email}`"
            class="inline-block mt-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400"
          >
            {{ footer.contact.email }}
          </a>
        </section>
      </div>

      <div class="mt-12 pt-8 border-t border-gray-200/60 dark:border-gray-800/60 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; {{ currentYear }} {{ footer.copyrightName }}. All rights reserved.</p>
        <p v-if="footer.builtWith" class="mt-2 text-sm">
          {{ footer.builtWith }}
        </p>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const isExternalLink = (url: string) => /^https?:\/\//.test(url)

interface FooterContent {
  title: string
  tagline: string
  socials: Array<{
    label: string
    url: string
    icon: string
    tooltip?: string
    srLabel?: string
  }>
  quickLinks: Array<{
    label: string
    to: string
  }>
  contact?: {
    message?: string
    email?: string
  }
  builtWith?: string
  copyrightName: string
}

const fallbackFooter: FooterContent = {
  title: "Allison's Portfolio",
  tagline: 'Full-stack developer and creative problem solver',
  socials: [
    {
      label: 'GitHub',
      srLabel: 'GitHub',
      tooltip: 'View my GitHub profile',
      icon: 'i-lucide-github',
      url: 'https://github.com/alliecatowo'
    },
    {
      label: 'LinkedIn',
      srLabel: 'LinkedIn',
      tooltip: 'Connect on LinkedIn',
      icon: 'i-lucide-linkedin',
      url: 'https://linkedin.com/in/allie-cat'
    },
    {
      label: 'Twitter',
      srLabel: 'Twitter',
      tooltip: 'Follow on Twitter',
      icon: 'i-lucide-twitter',
      url: 'https://twitter.com/allison'
    },
    {
      label: 'Email',
      srLabel: 'Email',
      tooltip: 'Send me an email',
      icon: 'i-lucide-mail',
      url: 'mailto:me@allisons.dev'
    }
  ],
  quickLinks: [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Projects', to: '/projects' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' }
  ],
  contact: {
    message: 'Feel free to reach out for collaborations or just a friendly hello',
    email: 'me@allisons.dev'
  },
  builtWith: 'Built with ❤ using Nuxt, Nuxt UI, and Tailwind CSS',
  copyrightName: "Allison's Portfolio"
}

const { data: footerData } = await useAsyncData('footer-settings', () =>
  queryContent<FooterContent>('settings', 'footer').findOne()
)

const footer = computed<FooterContent>(() => footerData.value ?? fallbackFooter)
const currentYear = computed(() => new Date().getFullYear())
</script>
