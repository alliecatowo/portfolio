// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    classSuffix: ''
  },
  runtimeConfig: {
    public: {
      directusUrl: process.env.DIRECTUS_URL || 'http://localhost:8055',
      apiUrl: process.env.API_URL || 'http://localhost:8055',
    }
  },
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true
  },
  build: {
    transpile: [
      '@directus/sdk'
    ]
  }
})