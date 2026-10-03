import type { MaybeRefOrGetter } from 'vue'

export interface SiteSeoInput {
  /** Page name. Rendered as "Title – Allison Coleman" except on the home page. */
  title: string
  description: string
  /** Site-relative (/images/...) or absolute. Defaults to the avatar card. */
  image?: string
  imageAlt?: string
  type?: 'website' | 'article' | 'profile'
  /** Defaults to the current route path. */
  path?: string
  /** A schema.org node (or @graph members); `@context` is added here. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[] | null
  publishedTime?: string
  modifiedTime?: string
  /** Trail after Home, e.g. [{ name: 'Projects', path: '/projects/' }, { name: 'Glassy' }]; adds a BreadcrumbList. */
  breadcrumbs?: { name: string, path?: string }[]
}

export const DEFAULT_OG_IMAGE = '/images/og/default.png'
/** Cards under /images/og/ are all 1200x630 PNGs (`pnpm check:seo` enforces it). */
const OG_CARD_DIR = '/images/og/'
const OG_CARD_SIZE = { width: 1200, height: 630 }
const DEFAULT_OG_ALT = 'Allison Coleman: agent systems, developer tools, languages & runtimes'
const SITE_NAME = 'Allison Coleman'
const TWITTER = '@AllieCatOwO'

const TITLE_SUFFIX = ` – ${SITE_NAME}`
// Titles longer than this get no " – Allison Coleman" suffix (search results cut off around 60).
const MAX_TITLE = 65

const withSlash = (p: string) => (p.endsWith('/') ? p : `${p}/`)

/** "Page – Allison Coleman", unless the title already names her or the suffix would push it past MAX_TITLE. */
export const siteTitle = (title: string, isHome = false) => {
  const t = title.trim()
  if (isHome || t.includes(SITE_NAME) || t.length + TITLE_SUFFIX.length > MAX_TITLE) return t
  return `${t}${TITLE_SUFFIX}`
}

/**
 * Returns a lookup for /images/og/<slug>.png, resolved against the files present at build time.
 * Call it in setup (it reads runtime config), then use the returned function anywhere.
 */
export const useOgImageForSlug = () => {
  const available = (useRuntimeConfig().public.ogImages ?? []) as string[]
  return (slug?: string) => (slug && available.includes(slug) ? `/images/og/${slug}.png` : undefined)
}

// JSON.stringify leaves "<" alone; escape it so "</script>" in content cannot close the tag.
const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')

export function useSiteSeo(input: MaybeRefOrGetter<SiteSeoInput>) {
  const route = useRoute()
  // SITE_URL, not useSiteConfig(): the latter installs a client-side watcher that re-sorts the whole
  // site config on every hydration, for a value that never changes.
  const absolute = (p: string) => (/^https?:\/\//.test(p) ? p : new URL(p, SITE_URL).href)

  const seo = computed(() => {
    const i = toValue(input)
    const path = withSlash(i.path ?? route.path)
    const isHome = path === '/'
    const imagePath = i.image || DEFAULT_OG_IMAGE
    // The avatar card keeps its own alt even when a page passes it explicitly (a post with no image)
    const isDefaultCard = imagePath === DEFAULT_OG_IMAGE
    return {
      ...i,
      fullTitle: siteTitle(i.title, isHome),
      canonical: absolute(path),
      image: absolute(imagePath),
      // Only the cards we render ourselves have known dimensions; an arbitrary image gets no size tags
      imageIsCard: new URL(absolute(imagePath)).pathname.startsWith(OG_CARD_DIR),
      imageAlt: isDefaultCard ? DEFAULT_OG_ALT : (i.imageAlt || (i.image ? i.title : DEFAULT_OG_ALT))
    }
  })

  useSeoMeta({
    title: () => seo.value.fullTitle,
    description: () => seo.value.description,
    ogTitle: () => seo.value.fullTitle,
    ogDescription: () => seo.value.description,
    ogImage: () => seo.value.image,
    ogImageAlt: () => seo.value.imageAlt,
    ogImageType: () => (seo.value.imageIsCard ? 'image/png' : undefined),
    ogImageWidth: () => (seo.value.imageIsCard ? OG_CARD_SIZE.width : undefined),
    ogImageHeight: () => (seo.value.imageIsCard ? OG_CARD_SIZE.height : undefined),
    ogLocale: 'en_US',
    ogUrl: () => seo.value.canonical,
    ogType: () => seo.value.type ?? 'website',
    ogSiteName: SITE_NAME,
    articlePublishedTime: () => seo.value.publishedTime,
    articleModifiedTime: () => seo.value.modifiedTime,
    twitterCard: 'summary_large_image',
    twitterSite: TWITTER,
    twitterCreator: TWITTER,
    twitterTitle: () => seo.value.fullTitle,
    twitterDescription: () => seo.value.description,
    twitterImage: () => seo.value.image,
    twitterImageAlt: () => seo.value.imageAlt
  })

  useHead(() => {
    const { canonical, jsonLd, breadcrumbs } = seo.value
    const nodes = Array.isArray(jsonLd) ? [...jsonLd] : jsonLd ? [jsonLd] : []
    if (breadcrumbs?.length) {
      const trail = [{ name: 'Home', path: '/' }, ...breadcrumbs]
      nodes.push({
        '@type': 'BreadcrumbList',
        'itemListElement': trail.map((crumb, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': crumb.name,
          // The last crumb is the current page
          'item': crumb.path ? absolute(withSlash(crumb.path)) : canonical
        }))
      })
    }
    const data = nodes.length === 1
      ? { '@context': 'https://schema.org', ...nodes[0] }
      : { '@context': 'https://schema.org', '@graph': nodes }
    return {
      link: [{ rel: 'canonical', href: canonical, key: 'canonical' }],
      script: nodes.length
        ? [{ key: 'site-jsonld', type: 'application/ld+json', innerHTML: serializeJsonLd(data) }]
        : []
    }
  })

  return { absoluteUrl: absolute, seo }
}
