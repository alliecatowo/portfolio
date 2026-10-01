// Sitemap source (registered in nuxt.config.ts: sitemap.sources) for the published blog posts and
// projects, with a lastmod taken from each item's frontmatter `date`.
//
// This replaces @nuxtjs/sitemap's Nuxt Content integration (a `sitemap` column on each
// collection, filled by an afterParse hook). Nuxt Studio writes the stored document back to the
// file on save, so anything a build-time hook adds to a document ends up committed to the
// Markdown. Reading the same data at request time (pre-rendered into sitemap.xml) keeps the
// content files free of build-time fields.
import { queryCollection } from '@nuxt/content/nitro'

interface SitemapUrl {
  loc: string
  lastmod?: string
}

// YAML dates may arrive as Date objects or strings; the sitemap wants YYYY-MM-DD
function lastmod(date: unknown): string | undefined {
  const parsed = new Date(date as string)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10)
}

export default defineEventHandler(async (event): Promise<SitemapUrl[]> => {
  // Drafts (unpublished posts, draft projects) stay out. Production builds don't contain them at
  // all (see content.config.ts), but dev and CONTENT_INCLUDE_DRAFTS builds do.
  const [posts, projects] = await Promise.all([
    queryCollection(event, 'blog').where('published', '=', true).select('path', 'date').all(),
    queryCollection(event, 'projects').where('status', '=', 'published').select('path', 'date').all()
  ])
  return [...posts, ...projects]
    .filter(item => item.path)
    .map(item => ({ loc: item.path, lastmod: lastmod(item.date) }))
})
