import { existsSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'
import { imageDimensions } from './scripts/image-dimensions'

const publicDir = fileURLToPath(new URL('./public', import.meta.url))

// Walks a parsed Markdown body (minimark arrays or the full AST) and gives every local
// <img> an `aspect-ratio: auto W / H` style plus lazy loading, so prose images don't
// shift the layout. `auto` lets the real image ratio win once it has loaded.
function addImageHints(node: unknown): void {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    if (node[0] === 'img' && node[1] && typeof node[1] === 'object') hintImage(node[1] as Record<string, unknown>)
    node.forEach(addImageHints)
    return
  }
  const n = node as { tag?: string, props?: Record<string, unknown>, children?: unknown, value?: unknown }
  if (n.tag === 'img' && n.props) hintImage(n.props)
  addImageHints(n.children)
  addImageHints(n.value)
}
function hintImage(props: Record<string, unknown>) {
  const src = props.src
  if (typeof src !== 'string' || !src.startsWith('/') || src.startsWith('//')) return
  const size = imageDimensions(`${publicDir}${decodeURI(src.split(/[?#]/)[0]!)}`)
  if (size && !props.style) props.style = `aspect-ratio: auto ${size.width} / ${size.height}`
  props.loading ??= 'lazy'
  props.decoding ??= 'async'
}

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
    payloadExtraction: false,
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
    // Auto-discovered <image:loc> entries came out double-escaped (&amp;amp;) for /_ipx URLs
    discoverImages: false
  },
  hooks: {
    // Nuxt marks every dynamic-import chunk `prefetch: true`, so each public page's <head> listed
    // ~10 prefetch links: the Nuxt Studio editor (Monaco + shiki, ~850 KB gz) and the SQLite WASM
    // worker among them. None of that is needed to read the site. Studio loads those chunks itself
    // (a plain dynamic import) once the `studio-session-check` cookie is set or ⌘. is pressed, so
    // dropping the hints costs nothing there. The build also leaves no page prefetch links, which
    // is fine: route chunks are small.
    'build:manifest'(manifest) {
      for (const item of Object.values(manifest)) item.prefetch = false
    },
    'content:file:afterParse'(ctx) {
      const { collection, content } = ctx
      // Keep drafts out of the sitemap: unpublished blog posts and draft projects.
      // Runs before @nuxtjs/sitemap's own afterParse hook, which drops falsy `sitemap` values.
      const isDraftPost = collection.name === 'blog' && content.published !== true
      const isDraftProject = collection.name === 'projects' && (content.status ?? 'draft') === 'draft'
      if (isDraftPost || isDraftProject) {
        content.sitemap = false
      } else if (collection.name === 'blog' || collection.name === 'projects') {
        // lastmod from the content date (YAML dates may arrive as Date objects)
        const date = new Date(content.date as string)
        if (!Number.isNaN(date.getTime())) {
          const existing = typeof content.sitemap === 'object' && content.sitemap ? content.sitemap : {}
          content.sitemap = { ...existing, lastmod: date.toISOString().slice(0, 10) }
        }
      }
      // Markdown images: reserve their box (aspect-ratio from the file's real size) and lazy-load them.
      if (content.body) addImageHints(content.body)
    }
  },
  content: {
    experimental: {
      sqliteConnector: 'native'
    },
    build: {
      markdown: {
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
  // The colour-mode button swaps sun/moon after hydration. Icons that aren't in the HTML
  // are otherwise fetched from api.iconify.design at runtime (a third-party request on every page).
  icon: {
    clientBundle: {
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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
