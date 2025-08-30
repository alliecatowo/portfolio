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
  content: {
    highlight: {
      theme: 'github-dark'
    },
    markdown: {
      anchorLinks: true
    },
    experimental: {
      nativeSqlite: true
    }
  },
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
  
  // SEO Configuration
  site: {
    url: process.env.SITE_URL || 'https://portfolio--portfolio-c1306.us-central1.hosted.app',
    name: 'Allison\'s Portfolio',
    description: 'Full-stack developer and tattoo artist showcasing projects and artwork',
    defaultLocale: 'en'
  },
  
  sitemap: {
    credits: false,
    exclude: [
      '/admin/**',
      '/api/**'
    ]
  },
  
  robots: {
    credits: false,
    rules: {
      UserAgent: '*',
      Allow: '/',
      Sitemap: 'https://portfolio--portfolio-c1306.us-central1.hosted.app/sitemap.xml'
    }
  },
  
  ogImage: {
    fonts: [
      'Inter:400',
      'Inter:700'
    ]
  },
  // Disable TTY interactions that cause errors
  typescript: {
    tsConfig: {
      compilerOptions: {
        noErrorTruncation: false
      }
    }
  },
  // Firebase App Hosting - uses Node.js runtime
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true
    },
    minify: true
  },
  // Image optimization
  image: {
    quality: 80,
    format: ['webp', 'avif'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    },
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 50,
          height: 50
        }
      },
      card: {
        modifiers: {
          format: 'webp',
          width: 300,
          height: 200
        }
      },
      hero: {
        modifiers: {
          format: 'webp',
          width: 1200,
          height: 600
        }
      }
    }
  },
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
