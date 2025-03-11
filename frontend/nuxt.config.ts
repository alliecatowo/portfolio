// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/image'
  ],
  runtimeConfig: {
    public: {
      strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337',
      devSiteUrl: process.env.DEV_SITE_URL || 'http://localhost:3000',
      tattooSiteUrl: process.env.TATTOO_SITE_URL || 'http://localhost:3000'
    }
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    hid: 'color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'color-mode'
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    viewer: false,
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
    '/blog/**': { swr: 3600 }, // Revalidate every hour
    // Use SSR for dynamic pages that need fresh data
    '/projects/**': { swr: 3600 },
    '/gallery/**': { swr: 3600 },
  },
  compatibilityDate: '2025-03-10',
  // Disable TTY interactions that cause errors
  typescript: {
    tsConfig: {
      compilerOptions: {
        noErrorTruncation: false
      }
    }
  }
})