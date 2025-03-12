// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt'
    // '@nuxt/image' - removed to fix deployment issues
  ],
  // image configuration removed
  runtimeConfig: {
    public: {
      // Directus API configuration
      directusUrl: process.env.NUXT_PUBLIC_DIRECTUS_URL || 'https://directus.allisons.dev',
      directusToken: process.env.NUXT_PUBLIC_DIRECTUS_TOKEN || '2eEMQA40l35OBtWNH6nDS166k0o800sb',
      
      // Site URLs for multi-site navigation
      devSiteUrl: process.env.DEV_SITE_URL || 'https://allisons.dev',
      tattooSiteUrl: process.env.TATTOO_SITE_URL || 'https://tattoo.allisons.dev',
      
      // Development settings
      enableDevtools: process.env.NUXT_PUBLIC_ENABLE_DEVTOOLS === 'true'
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
  // Digital Ocean specific configurations
  nitro: {
    preset: 'digital-ocean',
    // Enable error handler for better debugging
    errorHandler: '~/server/error-handler.ts',
  },
  // Development flags
  debug: process.env.NODE_ENV !== 'production',
  sourcemap: process.env.NODE_ENV !== 'production'
})