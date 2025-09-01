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
  // Firebase Hosting (static)
  nitro: {
    preset: process.env.NODE_ENV === 'development' ? 'node-server' : 'static',
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      ignore: ['/tattoo'],
      failOnError: false
    },
    minify: process.env.NODE_ENV !== 'development',
    // Enable IPX in development
    experimental: {
      wasm: true
    }
  },
  // Nuxt Image presets (used across pages)
  // Wrapped in spread+any to avoid Nuxt 4 type noise during typecheck
  image: {
    // Basic IPX configuration
    provider: 'ipx',
    ipx: {
      // Configure IPX server properly
      maxAge: 60 * 60 * 24 * 7, // 7 days cache
      sharp: {
        // Sharp options for image processing
        quality: 80,
        progressive: true,
        optimizeScans: true,
        mozjpeg: true
      }
    },
    // Presets for different image sizes
    presets: {
      avatar: { 
        modifiers: { 
          format: 'webp', 
          width: 400, 
          height: 400, 
          fit: 'cover',
          quality: 85 
        } 
      },
      thumbnail: { 
        modifiers: { 
          format: 'webp', 
          width: 200, 
          height: 200, 
          fit: 'cover' 
        } 
      },
      card: { 
        modifiers: { 
          format: 'webp', 
          width: 500, 
          height: 300, 
          fit: 'cover' 
        } 
      }
    }
  },
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
