<template>
  <footer class="py-12 mt-16 border-t border-gray-200/60 dark:border-gray-800/60 bg-gray-50 dark:bg-gray-950" aria-label="Site footer">
    <UContainer>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section aria-labelledby="footer-about">
          <h2 id="footer-about" class="font-bold text-xl mb-4 text-primary dark:text-primary-400">
            {{ footer.brand.title }}
          </h2>
          <p v-if="footer.brand.tagline" class="text-gray-600 dark:text-gray-300 mb-4">
            {{ footer.brand.tagline }}
          </p>
          <nav
            v-if="socials.length"
            class="flex flex-wrap gap-4 mt-4"
            aria-label="Social media links"
          >
            <UTooltip
              v-for="social in socials"
              :key="social.label"
              :text="social.tooltip || social.label"
              :delay-duration="300"
            >
              <a
                :href="social.href"
                :target="socialTarget(social.href, social.external)"
                :rel="socialRel(social.href, social.external)"
                class="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
              >
                <span class="sr-only">{{ social.label }}</span>
                <UIcon :name="social.icon" class="h-6 w-6" />
              </a>
            </UTooltip>
          </nav>
        </section>

        <nav v-if="navigationItems.length" aria-labelledby="footer-links">
          <h2 id="footer-links" class="font-bold text-xl mb-4 text-primary dark:text-primary-400">Quick Links</h2>
          <ul class="space-y-2">
            <li v-for="item in navigationItems" :key="item.to">
              <NuxtLink :to="item.to" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <section aria-labelledby="footer-contact">
          <h2 id="footer-contact" class="font-bold text-xl mb-4 text-primary dark:text-primary-400">Contact</h2>
          <p v-if="footer.contact?.description" class="text-gray-600 dark:text-gray-300 mb-2">
            {{ footer.contact.description }}
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
        <p>
          &copy; {{ currentYear }} {{ footer.brand.title }}. {{ footer.bottom?.text || fallbackFooter.bottom?.text }}
        </p>
        <p v-if="footer.bottom?.subtext || fallbackFooter.bottom?.subtext" class="mt-2 text-sm">
          {{ footer.bottom?.subtext || fallbackFooter.bottom?.subtext }}
        </p>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useContent } from '~/composables/useContent'

type FooterSocial = {
  label: string
  href: string
  icon: string
  tooltip?: string
  external?: boolean
}

type FooterNavItem = {
  label: string
  to: string
}

type FooterContact = {
  description?: string
  email?: string
}

type FooterBottom = {
  text?: string
  subtext?: string
}

type FooterContent = {
  brand: {
    title: string
    tagline?: string
  }
  description?: string
  socials?: FooterSocial[]
  navigation?: FooterNavItem[]
  contact?: FooterContact
  bottom?: FooterBottom
}

const fallbackFooter: FooterContent = {
  brand: {
    title: "Allison's Portfolio",
    tagline: 'Full-stack developer and creative problem solver'
  },
  description: 'Full-stack developer and creative problem solver',
  socials: [
    {
      label: 'GitHub',
      href: 'https://github.com/alliecatowo',
      icon: 'i-lucide-github',
      tooltip: 'View my GitHub profile',
      external: true
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/allie-cat',
      icon: 'i-lucide-linkedin',
      tooltip: 'Connect on LinkedIn',
      external: true
    },
    {
      label: 'Email',
      href: 'mailto:me@allisons.dev',
      icon: 'i-lucide-mail',
      tooltip: 'Send me an email'
    }
  ],
  navigation: [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Projects', to: '/projects' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' }
  ],
  contact: {
    description: 'Feel free to reach out for collaborations or just a friendly hello.',
    email: 'me@allisons.dev'
  },
  bottom: {
    text: 'All rights reserved.',
    subtext: 'Built with ❤️ using Nuxt, Nuxt UI, and Tailwind CSS.'
  }
}

const { fetchGlobal } = useContent()

const { data: footerContent } = await useAsyncData<FooterContent | null>(
  'footer-content',
  async () => (await fetchGlobal('footer')) as FooterContent | null
)

const footer = computed<FooterContent>(() => {
  const data = footerContent.value
  return {
    brand: {
      title: data?.brand?.title ?? fallbackFooter.brand.title,
      tagline: data?.brand?.tagline ?? fallbackFooter.brand.tagline
    },
    description: data?.description ?? fallbackFooter.description,
    socials: data?.socials ?? fallbackFooter.socials,
    navigation: data?.navigation ?? fallbackFooter.navigation,
    contact: {
      description: data?.contact?.description ?? fallbackFooter.contact?.description,
      email: data?.contact?.email ?? fallbackFooter.contact?.email
    },
    bottom: {
      text: data?.bottom?.text ?? fallbackFooter.bottom?.text,
      subtext: data?.bottom?.subtext ?? fallbackFooter.bottom?.subtext
    }
  }
})

const socials = computed(() => footer.value.socials ?? [])
const navigationItems = computed(() => footer.value.navigation ?? [])
const currentYear = new Date().getFullYear()

const socialTarget = (href: string, external?: boolean) => {
  if (external ?? href.startsWith('http')) {
    return '_blank'
  }
  return undefined
}

const socialRel = (href: string, external?: boolean) =>
  socialTarget(href, external) ? 'noopener noreferrer' : undefined
</script>
