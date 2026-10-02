// /feed.xml: an RSS 2.0 feed of the published blog posts, pre-rendered at build time from the content
// collection (like llms.txt), so a new post shows up without editing anything. Drafts never appear:
// only `published: true` posts are selected. Items carry the post description, not the body, so the
// feed stays small and readers click through to the page. The matching <link rel="alternate"> lives
// in nuxt.config.ts (app.head.link) and /feed.xml is listed under `nitro.prerender.routes`.
import { queryCollection } from '@nuxt/content/nitro'

const SITE = 'https://allisons.dev'
const AUTHOR = 'Allison Coleman'
const EMAIL = 'me@allisons.dev'

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

/** RFC 822 date at noon UTC (posts only carry a day), or undefined when the value does not parse. */
const rfc822 = (value: unknown) => {
  const day = String(value ?? '').slice(0, 10)
  const d = new Date(`${day}T12:00:00Z`)
  return Number.isNaN(d.getTime()) ? undefined : d.toUTCString()
}

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, 'blog')
    .where('published', '=', true)
    .order('date', 'DESC')
    .select('title', 'slug', 'description', 'date', 'tags')
    .all()

  const items = posts.filter(p => p.slug).map((p) => {
    const url = `${SITE}/blog/${p.slug}/`
    const pubDate = rfc822(p.date)
    return [
      '    <item>',
      `      <title>${escapeXml(p.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      ...(pubDate ? [`      <pubDate>${pubDate}</pubDate>`] : []),
      `      <dc:creator>${AUTHOR}</dc:creator>`,
      `      <description>${escapeXml(p.description ?? '')}</description>`,
      ...(p.tags ?? []).map(t => `      <category>${escapeXml(t)}</category>`),
      '    </item>'
    ].join('\n')
  })

  const newest = posts.map(p => rfc822(p.date)).find(Boolean)
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    `    <title>${AUTHOR}: Writing</title>`,
    `    <link>${SITE}/blog/</link>`,
    '    <description>Notes on agent systems, developer tools and languages, plus the hardware on her desk.</description>',
    '    <language>en-us</language>',
    `    <managingEditor>${EMAIL} (${AUTHOR})</managingEditor>`,
    ...(newest ? [`    <lastBuildDate>${newest}</lastBuildDate>`] : []),
    `    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>`,
    ...items,
    '  </channel>',
    '</rss>'
  ].join('\n')

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return `${xml}\n`
})
