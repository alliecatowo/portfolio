// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/image'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      // Site URLs for multi-site navigation
      devSiteUrl: process.env.DEV_SITE_URL || 'http://localhost:3000',
      tattooSiteUrl: process.env.TATTOO_SITE_URL || 'http://localhost:3000'
    }
  },
  // NuxtUI includes Tailwind and color mode by default
  ui: {
    safelistColors: ['primary', 'secondary', 'accent', 'gray', 'green', 'blue', 'red', 'yellow']
  },
  content: {
    highlight: {
      theme: 'github-dark'
    },
    markdown: {
      anchorLinks: false
    },
    // Use experimental native SQLite to avoid better-sqlite3 dependency
    experimental: {
      nativeSqlite: true
    }
  },
  // Ensure content auto-imports work
  imports: {
    autoImport: true
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  routeRules: {
    // Use ISR (Incremental Static Regeneration) for blog posts
    '/blog/**': { isr: 3600 }, // Revalidate every hour
    // Use SSR for dynamic pages that need fresh data
    '/projects/**': { isr: 3600 },
    '/gallery/**': { isr: 3600 },
  },
  compatibilityDate: '2025-03-10',
  // Disable TTY interactions that cause errors
  typescript: {
    tsConfig: {
      compilerOptions: {
        noErrorTruncation: false
      }
    }
  },
  // Will change this to Firebase later
  nitro: {
    preset: 'vercel'
  }
})