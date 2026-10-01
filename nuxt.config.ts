import { existsSync, readdirSync } from 'node:fs'
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
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap' },
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
  // Hybrid rendering: pre-render every public page. Studio's server routes (/_studio,
  // /__nuxt_studio/**, /sw.js) are never pre-rendered; on Firebase they're served by the
  // `studio` Cloud Function (see isStudioFunction above).
  routeRules: {
    '/_studio/**': { ssr: true, prerender: false },
    '/__nuxt_studio/**': { prerender: false },
    '/**': { prerender: !isStudioFunction }
  },
  // Studio function build only. The function is built with drafts (CONTENT_INCLUDE_DRAFTS=true
  // in `build:studio`): one route hands the draft-including content dump to a logged-in Studio
  // user, and a guard 404s every path Hosting doesn't rewrite to the function, so its own
  // public URL can't serve drafts. See STUDIO.md "Drafts".
  serverHandlers: isStudioFunction
    ? [
        { middleware: true, handler: './server/studio/only-studio-routes.ts' },
        { route: '/__nuxt_studio/content/:collection/sql_dump.txt', method: 'get', handler: './server/studio/drafts-dump.ts' }
      ]
    : [],
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
  },
  components: {
  }
})
