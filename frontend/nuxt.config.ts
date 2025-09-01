import { defineNuxtConfig } from 'nuxt/config'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  ssr: true,
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    viewTransition: true
  },
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/image'
  ],
  // Color mode handled by @nuxt/ui defaults (system)
  // Use native SQLite (Node.js 22.5.0+) for performance
  ...({ content: { 
    experimental: { 
      // Use Node.js native SQLite module
      nativeSqlite: true,
      sqliteConnector: 'native'
    } 
  } }),
  css: ['~/assets/css/main.css'],
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
  routeRules: {
    // Use ISR for all pages to avoid Nuxt UI SSR bug with Nuxt 4
    '/**': { isr: true }, // ISR for everything
    // Blog posts can cache longer
    '/blog/**': { isr: 3600 }, // Revalidate every hour
    '/dev/blog/**': { isr: 3600 },
    '/tattoo/blog/**': { isr: 3600 },
    // Projects and gallery
    '/projects/**': { isr: 3600 },
    '/gallery/**': { isr: 3600 },
  },
  compatibilityDate: '2025-03-10',
  
  // Site configuration handled via modules/runtime, keep config minimal for type safety
  
  // Sitemap/robots/og-image are configured via modules; remove here to keep config type-safe
  // Disable TTY interactions that cause errors
  typescript: {
    tsConfig: {
      compilerOptions: {
        noErrorTruncation: false
      },
      exclude: [
        '../node_modules/@nuxt/image/**',
        '../../node_modules/@nuxt/image/**'
      ]
    }
  },
  
  // Better error handling and logging
  features: {
    devLogs: process.env.NODE_ENV === 'development'
  },
  // Firebase Hosting (static) - simplified configuration
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      failOnError: false,
      // Include all main routes for proper static generation
      routes: [
        '/',
        '/projects',
        '/about', 
        '/contact',
        '/gallery',
        '/open-source',
        '/blog'
      ]
    }
  },
  // Nuxt Image presets (used across pages) 
  // Use standard ipx provider for better compatibility with static generation
  ...({ image: {
    provider: 'ipx',
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
  // Vite optimizations
  vite: {
    build: {
      cssCodeSplit: true,
      // Disable sourcemaps in production to avoid Tailwind CSS v4 plugin warnings
      sourcemap: process.env.NODE_ENV === 'development'
    },
    optimizeDeps: {
      // Only prebundle essential runtime libs, let Nuxt 4 handle vue/vue-router
      exclude: ['@nuxt/ui', '@nuxt/kit', 'lightningcss', '@tailwindcss/oxide']
    },
    ssr: {
      external: ['lightningcss', '@tailwindcss/oxide']
    }
  },
  // Enable component islands for better performance
  components: {
  }
})
