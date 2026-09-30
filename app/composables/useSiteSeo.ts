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
}

export const DEFAULT_OG_IMAGE = '/images/og/default.png'
const DEFAULT_OG_ALT = 'Allison Coleman: agent systems, developer tools, languages & runtimes'
const SITE_NAME = 'Allison Coleman'
const TWITTER = '@AllieCatOwO'

const withSlash = (p: string) => (p.endsWith('/') ? p : `${p}/`)

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
  const site = useSiteConfig()
  const siteUrl = withSlash(site.url || 'https://allisons.dev')

  const absolute = (p: string) => (/^https?:\/\//.test(p) ? p : new URL(p, siteUrl).href)

  const seo = computed(() => {
    const i = toValue(input)
    const path = withSlash(i.path ?? route.path)
    const isHome = path === '/'
    return {
      ...i,
      fullTitle: isHome ? i.title.trim() : `${i.title.trim()} – ${SITE_NAME}`,
      canonical: absolute(path),
      image: absolute(i.image || DEFAULT_OG_IMAGE),
      imageAlt: i.imageAlt || (i.image ? i.title : DEFAULT_OG_ALT)
    }
  })

  useSeoMeta({
    title: () => seo.value.fullTitle,
    description: () => seo.value.description,
    ogTitle: () => seo.value.fullTitle,
    ogDescription: () => seo.value.description,
    ogImage: () => seo.value.image,
    ogImageAlt: () => seo.value.imageAlt,
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
    const { canonical, jsonLd } = seo.value
    const nodes = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []
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
