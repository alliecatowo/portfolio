// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
  },
  runtimeConfig: {
    public: {
      strapiUrl: process.env.STRAPI_URL || 'http://localhost:1337',
      devSiteUrl: process.env.DEV_SITE_URL || 'http://localhost:3000',
      tattooSiteUrl: process.env.TATTOO_SITE_URL || 'http://localhost:3000',
    },
    strapiToken: process.env.STRAPI_TOKEN || '',
  },
  routeRules: {
    // Use ISR (Incremental Static Regeneration) for blog posts
    '/blog/**': { swr: 3600 }, // Revalidate every hour
    // Use SSR for dynamic pages that need fresh data
    '/projects/**': { swr: 3600 },
    '/gallery/**': { swr: 3600 },
  },
})
