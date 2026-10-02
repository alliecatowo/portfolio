import { existsSync, readdirSync, statSync } from 'node:fs'
import { defineNuxtConfig } from 'nuxt/config'

// Per-page OG images live at public/images/og/<slug>.png. Project pages pick theirs up
// by slug when no `ogImage` is set in frontmatter (see useSiteSeo/projectOgImage).
const ogDir = new URL('./public/images/og', import.meta.url)
const ogImages = existsSync(ogDir)
  ? readdirSync(ogDir).filter(f => f.endsWith('.png')).map(f => f.slice(0, -4)).filter(s => s !== 'default')
  : []

// The site itself is a static `nuxt generate` build on Firebase Hosting. Nuxt Studio's auth and
// meta routes need a server, so `pnpm build:studio` (NITRO_PRESET=firebase) builds the same app
// as a 2nd-gen Cloud Function named `studio` into .output-studio/; firebase.json rewrites only
// /_studio, /__nuxt_studio/** and /sw.js to it. That build skips prerendering.
const isStudioFunction = process.env.NITRO_PRESET === 'firebase'

export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  ssr: true,
  experimental: {
    payloadExtraction: 'client',
    renderJsonPayloads: true,
    viewTransition: true
  },
  modules: [
    '@nuxt/ui',
    // robots + sitemap must load before @nuxt/content for the Content v3 integration
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@nuxt/image',
    'nuxt-studio'
  ],
  ui: {
    // Only generate the theme CSS/JS for the Nuxt UI components the app actually uses
    experimental: { componentDetection: true }
  },
  // Site config shared by robots/sitemap. Firebase redirects /about -> /about/,
  // so every generated URL uses the trailing-slash form.
  site: {
    url: 'https://allisons.dev',
    name: 'Allison Coleman',
    trailingSlash: true
  },
  runtimeConfig: {
    // Packs Studio's cookies into `__session` (server/middleware/studio-firebase-cookies.ts)
    studioFirebaseCookies: isStudioFunction,
    public: {
      ogImages
    }
  },
  robots: {
    disallow: ['/_studio']
  },
  sitemap: {
    // Blog and project URLs (with lastmod from each item's date) come from this route rather than a
    // `sitemap` column on the collections, so nothing build-time is stored in the content documents
    // that Nuxt Studio writes back to the Markdown files. See the route for the details.
    sources: ['/__sitemap__/site-content-urls.json'],
    // Auto-discovered <image:loc> entries came out double-escaped (&amp;amp;) for /_ipx URLs
    discoverImages: false
  },
  hooks: {
    // Nuxt marks every dynamic-import chunk `prefetch: true`, so each public page's <head> listed
    // ~10 prefetch links: the Nuxt Studio editor (Monaco + shiki, ~850 KB gz) and the SQLite WASM
    // worker among them, and the rest competing with the page for bandwidth on a slow connection
    // (Lighthouse LCP +0.4 s with the route chunks left in). Studio loads its own chunks itself (a
    // plain dynamic import) once the `studio-session-check` cookie is set or ⌘. is pressed. This only
    // removes the <link rel="prefetch"> tags from the HTML: NuxtLink still prefetches a visible link's
    // route chunk and payload at runtime, which is what makes client navigations fast.
    'build:manifest'(manifest) {
      for (const item of Object.values(manifest)) item.prefetch = false
    }
  },
  content: {
    experimental: {
      sqliteConnector: 'native'
    },
    build: {
      markdown: {
        // Turns :shortcodes: into emoji. The site uses none, and it eats the colons in times like
        // 6:32: or 11:56: (Studio's own editor parser still has it on, so avoid `:xx:` in prose).
        remarkPlugins: { 'remark-emoji': false },
        // Nuxt UI's default light theme (material-theme-lighter) puts orange/green tokens at
        // ~2.2:1 on the code block background. github-light passes AA; dark keeps palenight.
        highlight: {
          theme: { light: 'github-light', default: 'github-light', dark: 'material-theme-palenight' }
        }
      }
    }
    // Legacy cloud preview removed — now using self-hosted nuxt-studio module
  },
  // Nuxt Studio self-hosted configuration. Docs: https://nuxt.studio/setup
  // Auth env (read by the `studio` function, see STUDIO.md): STUDIO_GITHUB_CLIENT_ID,
  // STUDIO_GITHUB_CLIENT_SECRET, STUDIO_GITHUB_MODERATORS. The client ID and secret must
  // also be set at build time: the session-cookie secret is derived from them.
  studio: {
    repository: {
      provider: 'github',
      owner: 'alliecatowo',
      repo: 'portfolio',
      branch: 'main',
      // Public repo: ask GitHub for `public_repo` instead of full `repo` scope
      private: false
    }
  },
  // Icons that aren't in a page's HTML (the colour-mode button swaps sun/moon after hydration, and a
  // client navigation renders whatever the next page uses) are otherwise fetched from
  // api.iconify.design at runtime. `scan` bundles every icon the app names, so none of that happens.
  icon: {
    clientBundle: {
      scan: true,
      icons: ['lucide:sun', 'lucide:moon', 'lucide:monitor']
    }
  },
  mdc: {
    highlight: {
      theme: { light: 'github-light', default: 'github-light', dark: 'material-theme-palenight' }
    }
  },
  css: ['~/assets/css/main.css'],
  imports: {
    autoImport: true
  },
  app: {
    head: {
      // Default title; pages override it. Also gives the static 404.html/200.html shells a <title>.
      title: 'Allison Coleman',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#FF69B4' },
        { name: 'description', content: 'Allison Coleman, software engineer: agent systems, developer tools, and languages & runtimes.' },
        { property: 'og:site_name', content: 'Allison Coleman' },
        { name: 'twitter:site', content: '@AllieCatOwO' },
        { name: 'twitter:creator', content: '@AllieCatOwO' }
      ],
      link: [
        // Heart icon: Fluent Emoji Flat "pink-heart" (Microsoft, MIT). See public/ICONS.md.
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', sizes: '48x48', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
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
    inlineStyles: () => true,
    devLogs: process.env.NODE_ENV === 'development'
  },
  // Hybrid rendering: pre-render every public page. Studio's server routes (/_studio,
  // /__nuxt_studio/**, /sw.js) are never pre-rendered; on Firebase they're served by the
  // `studio` Cloud Function (see isStudioFunction above).
  routeRules: {
    '/_studio/**': { ssr: true, prerender: false },
    '/__nuxt_studio/**': { prerender: false },
    '/**': { prerender: !isStudioFunction }
  },
  nitro: {
    // No preset = node-server. CI Firebase deploys run `nuxt generate` for the site and
    // `pnpm build:studio` (firebase preset) for the Studio function.
    ...(isStudioFunction && {
      output: { dir: '.output-studio' },
      firebase: {
        gen: 2,
        nodeVersion: '22',
        serverFunctionName: 'studio',
        httpsOptions: { region: 'us-central1', memory: '512MiB', maxInstances: 2 }
      }
    }),
    hooks: {
      // The default layout's CSS chunk comes out empty (its styles live in the entry CSS, which is
      // inlined). A render-blocking <link> to a 0-byte file still costs a full round trip, so drop
      // it from the prerendered HTML when the emitted file really is empty.
      'prerender:generate'(route) {
        if (typeof route.contents !== 'string' || !route.fileName?.endsWith('.html')) return
        // Vite 8 (rolldown) splits the app into ~55 small chunks, and Nuxt emits a modulepreload link for
        // each one in every page's <head>. On a throttled mobile connection those ~250 KB of preloads fight
        // the HTML, hero image and entry script (Lighthouse FCP +0.8 s, LCP +0.6 s). The pages are
        // pre-rendered, so the content paints without JS; the entry module discovers its imports itself.
        route.contents = route.contents.replace(/<link rel="modulepreload"[^>]*>/g, '')
        route.contents = route.contents.replace(/<link rel="stylesheet" href="(\/_nuxt\/[^"]+\.css)"[^>]*>/g, (tag, href: string) => {
          try {
            return statSync(`.output/public${href}`).size === 0 ? '' : tag
          } catch {
            return tag
          }
        })
      }
    },
    prerender: {
      crawlLinks: !isStudioFunction,
      failOnError: false,
      ignore: ['/_studio', '/_studio/**', '/__nuxt_studio/**', '/sw.js'],
      // Not linked from any page, so the crawler won't find it
      routes: isStudioFunction ? [] : ['/llms.txt']
    }
  },
  ...({ image: {
    // Default JPEG/WebP quality for every NuxtImg variant that doesn't set its own.
    quality: 80,
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
  }
})
