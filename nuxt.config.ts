import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  ssr: true,
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    viewTransition: true
  },
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    'nuxt-studio'
  ],
  content: {
    experimental: {
      sqliteConnector: 'native'
    }
    // Legacy cloud preview removed — now using self-hosted nuxt-studio module
  },
  // Nuxt Studio self-hosted configuration
  // Docs: https://nuxt.studio/setup
  studio: {
    repository: {
      provider: 'github',
      owner: 'alliecatowo',
      repo: 'portfolio',
      branch: 'main'
    }
  },
  css: ['~/assets/css/main.css'],
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
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#FF69B4' },
        { name: 'description', content: 'Allison\'s dual portfolio for development and tattoo art' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' },
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' }
      ]
    }
  },
  compatibilityDate: '2025-03-10',
  typescript: {
    tsConfig: {
      compilerOptions: {
        noErrorTruncation: false
      }
    }
  },
  features: {
    devLogs: process.env.NODE_ENV === 'development'
  },
  nitro: {
    // Removed preset:'static' to support hybrid rendering required by nuxt-studio.
    // Studio needs an SSR server route for the /_studio auth endpoint.
    // All content pages are still pre-rendered via crawlLinks below.
    // For Firebase static hosting, run `nuxt generate` (fallback) or migrate
    // to a Node.js host (Cloud Run / Railway / Hetzner) with `nuxt build`.
    prerender: {
      crawlLinks: true,
      failOnError: false
    }
  },
  ...({ image: {
    presets: {
      avatar: { 
        modifiers: { 
          width: 400, 
          height: 400, 
          fit: 'cover',
          quality: 85 
        } 
      },
      thumbnail: { 
        modifiers: { 
          width: 200, 
          height: 200, 
          fit: 'cover' 
        } 
      },
      card: { 
        modifiers: { 
          width: 500, 
          height: 300, 
          fit: 'cover' 
        } 
      },
      hero: { 
        modifiers: { 
          width: 800, 
          height: 400, 
          fit: 'cover',
          quality: 85 
        } 
      },
      blogCard: { 
        modifiers: { 
          width: 400, 
          height: 250, 
          fit: 'cover',
          quality: 85 
        } 
      }
    }
  } }),
  vite: {
    build: {
      cssCodeSplit: true,
      sourcemap: process.env.NODE_ENV === 'development'
    },
    optimizeDeps: {
      exclude: ['@nuxt/ui', '@nuxt/kit', '@nuxt/image', 'lightningcss', '@tailwindcss/oxide']
    },
    ssr: {
      external: ['lightningcss', '@tailwindcss/oxide']
    }
  },
  components: {
  }
})
