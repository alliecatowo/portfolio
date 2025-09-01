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
  // Use better-sqlite3 for development stability (native SQLite causes live reload issues)
  ...({ content: { 
    experimental: { 
      // Use better-sqlite3 in development for stability with HMR/live reload
      sqliteConnector: process.env.NODE_ENV === 'production' ? 'native' : 'better-sqlite3',
      // Enable native SQLite only in production (Node 22.5.0+)
      nativeSqlite: process.env.NODE_ENV === 'production'
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
  // Static hosting for maximum performance
  nitro: {
    preset: 'static',
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      // Temporarily ignore tattoo landing while we stabilize SSR there
      ignore: ['/tattoo']
    },
    minify: true
  },
  // Nuxt Image presets (used across pages)
  // Wrapped in spread+any to avoid Nuxt 4 type noise during typecheck
  ...({
    image: {
      quality: 80,
      format: ['webp','avif'],
      densities: [1,2],
      presets: {
        avatar: { modifiers: { format: 'webp', width: 50, height: 50, fit: 'cover' } },
        thumbnail: { modifiers: { format: 'webp', width: 150, height: 150, fit: 'cover' } },
        card: { modifiers: { format: 'webp', width: 400, height: 250, fit: 'cover' } },
        blogCard: { modifiers: { format: 'webp', width: 400, height: 225, fit: 'cover', quality: 85 } },
        gallery: { modifiers: { format: 'webp', width: 600, height: 600, fit: 'cover', quality: 90 } },
        hero: { modifiers: { format: 'webp', width: 1920, height: 1080, fit: 'cover', quality: 85 } },
        projectImage: { modifiers: { format: 'webp', width: 800, height: 450, fit: 'contain', quality: 90 } }
      }
    }
  }),
  // Vite optimizations
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Do not chunk '@nuxt/ui' — it's a Nuxt module, not a runtime lib
            'vue-core': ['vue', 'vue-router']
          }
        }
      }
    },
    optimizeDeps: {
      // Only prebundle runtime libs, never Nuxt modules
      include: ['vue', 'vue-router'],
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
