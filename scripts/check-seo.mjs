// SEO gate for the static build.
//
//   pnpm generate && pnpm check:seo
//
// Walks every prerendered index.html in .output/public (404 and Studio excluded) and checks canonical,
// title/description length, OpenGraph/Twitter tags, JSON-LD, the h1 count and robots meta. It also
// checks sitemap.xml against the built routes and the content (published routes listed, drafts not)
// and that robots.txt points at the sitemap. Image variants are check:images' job and frontmatter
// is validate:content's, so neither is repeated here. Beyond the tags it checks that every share
// image is a real 1200x630 PNG whose width/height tags match, that no page ships "undefined" in a
// meta tag or JSON-LD, that titles and descriptions are unique, that project and post pages carry a
// BreadcrumbList, that internal links resolve and use the trailing slash, heading order and image
// alt text, the theme-color pair, the feed, the web manifest and its icons, security.txt, llms.txt
// and the 404 page. Exits 1 and lists every problem otherwise.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ORIGIN = 'https://allisons.dev'
const ROOT = join(process.cwd(), '.output/public')
if (!existsSync(join(ROOT, 'index.html'))) {
  console.error('No .output/public build found. Run `pnpm generate` first.')
  process.exit(2)
}

const problems = []
const fail = (where, msg) => problems.push(`${where}: ${msg}`)

const decode = s =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&amp;/g, '&')

// ---- collect routes -------------------------------------------------------------------------
const pages = [] // { route, file }
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      // Studio assets and Nuxt internals (_nuxt, _ipx, _studio-app, __nuxt_content...) never hold public pages
      if (name.startsWith('_') || name.startsWith('.')) continue
      walk(path)
    }
    else if (name === 'index.html') {
      pages.push({ route: path.slice(ROOT.length, -'index.html'.length), file: path })
    }
  }
}
walk(ROOT)
pages.sort((a, b) => a.route.localeCompare(b.route))

// ---- per-page checks ------------------------------------------------------------------------
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`))
  return m ? decode(m[1]) : undefined
}
const rootFileExists = (url) => {
  const path = join(ROOT, decodeURIComponent(url.slice(ORIGIN.length).split(/[?#]/)[0]))
  return existsSync(path) && statSync(path).isFile()
}

// PNG width/height from the IHDR chunk, or undefined when the file is not a PNG
const pngSize = (path) => {
  const buf = readFileSync(path)
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return undefined
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}
const siteFile = url => join(ROOT, decodeURIComponent(url.slice(ORIGIN.length).split(/[?#]/)[0]))
const seenTitles = new Map()
const seenDescriptions = new Map()
const pushSeen = (map, key, route) => map.set(key, [...(map.get(key) ?? []), route])

for (const { route, file } of pages) {
  const html = readFileSync(file, 'utf8')
  const head = html.slice(0, html.indexOf('</head>'))
  const metas = head.match(/<meta\b[^>]*>/g) ?? []
  const meta = (key, value) => {
    const tag = metas.find(m => attr(m, key) === value)
    return tag ? attr(tag, 'content') : undefined
  }

  const canonicals = head.match(/<link\b[^>]*\brel="canonical"[^>]*>/g) ?? []
  if (canonicals.length !== 1) fail(route, `expected exactly one canonical, found ${canonicals.length}`)
  else {
    const href = attr(canonicals[0], 'href') ?? ''
    if (href !== `${ORIGIN}${route}`) fail(route, `canonical is "${href}", expected "${ORIGIN}${route}"`)
    if (!href.endsWith('/')) fail(route, `canonical "${href}" has no trailing slash`)
  }

  const title = head.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]
  if (title === undefined) fail(route, 'no <title>')
  else {
    const len = decode(title).trim().length
    if (len < 10 || len > 65) fail(route, `title is ${len} characters (want 10-65): "${decode(title)}"`)
  }

  const description = meta('name', 'description')
  if (description === undefined) fail(route, 'no meta description')
  else if (description.length < 50 || description.length > 170) {
    fail(route, `meta description is ${description.length} characters (want 50-170)`)
  }

  if (!meta('property', 'og:title')) fail(route, 'missing og:title')
  if (!meta('property', 'og:description')) fail(route, 'missing og:description')
  const ogImage = meta('property', 'og:image')
  if (!ogImage) fail(route, 'missing og:image')
  else if (!ogImage.startsWith(`${ORIGIN}/`)) fail(route, `og:image is not absolute on ${ORIGIN}: ${ogImage}`)
  else if (!rootFileExists(ogImage)) fail(route, `og:image does not resolve to a built file: ${ogImage}`)
  if (!meta('name', 'twitter:card')) fail(route, 'missing twitter:card')

  // Share image: a 1200x630 PNG, with matching size tags, type and alt text
  if (ogImage && ogImage.startsWith(`${ORIGIN}/`) && rootFileExists(ogImage)) {
    const size = pngSize(siteFile(ogImage))
    if (!size) fail(route, `og:image is not a PNG: ${ogImage}`)
    else if (size.width !== 1200 || size.height !== 630) {
      fail(route, `og:image is ${size.width}x${size.height}, want a 1200x630 card (scripts/make-og-card.mjs): ${ogImage}`)
    }
    if (meta('property', 'og:image:width') !== '1200') fail(route, `og:image:width is "${meta('property', 'og:image:width')}", want 1200`)
    if (meta('property', 'og:image:height') !== '630') fail(route, `og:image:height is "${meta('property', 'og:image:height')}", want 630`)
    if (meta('property', 'og:image:type') !== 'image/png') fail(route, 'og:image:type is not image/png')
  }
  if (!meta('property', 'og:image:alt')) fail(route, 'missing og:image:alt')
  if (!meta('name', 'twitter:image:alt')) fail(route, 'missing twitter:image:alt')
  if (meta('name', 'twitter:image') !== ogImage) fail(route, 'twitter:image differs from og:image')
  if (!meta('property', 'og:type')) fail(route, 'missing og:type')
  if (meta('property', 'og:url') !== `${ORIGIN}${route}`) fail(route, `og:url is "${meta('property', 'og:url')}", expected "${ORIGIN}${route}"`)
  if (meta('property', 'og:site_name') !== 'Allison Coleman') fail(route, 'og:site_name is not "Allison Coleman"')
  if (meta('property', 'og:locale') !== 'en_US') fail(route, 'og:locale is not en_US')
  if (meta('name', 'twitter:site') !== '@AllieCatOwO') fail(route, 'twitter:site is not @AllieCatOwO')
  if (meta('name', 'twitter:creator') !== '@AllieCatOwO') fail(route, 'twitter:creator is not @AllieCatOwO')

  // <html lang>, light and dark theme-color, the feed autodiscovery link, icons and the manifest
  if (!/<html\b[^>]*\slang="en"/.test(html.slice(0, 400))) fail(route, '<html> has no lang="en"')
  const themeColors = metas.filter(m => attr(m, 'name') === 'theme-color').map(m => attr(m, 'media'))
  if (!themeColors.includes('(prefers-color-scheme: light)') || !themeColors.includes('(prefers-color-scheme: dark)')) {
    fail(route, 'needs a theme-color for both prefers-color-scheme: light and dark')
  }
  const links = head.match(/<link\b[^>]*>/g) ?? []
  const hasLink = (rel, test = () => true) => links.some(l => attr(l, 'rel') === rel && test(l))
  if (!hasLink('alternate', l => attr(l, 'type') === 'application/rss+xml' && attr(l, 'href') === `${ORIGIN}/feed.xml`)) {
    fail(route, 'missing <link rel="alternate" type="application/rss+xml" href="/feed.xml">')
  }
  if (!hasLink('manifest', l => attr(l, 'href') === '/site.webmanifest')) fail(route, 'missing <link rel="manifest">')
  if (!hasLink('apple-touch-icon')) fail(route, 'missing apple-touch-icon')
  if (!hasLink('icon', l => attr(l, 'type') === 'image/svg+xml')) fail(route, 'missing svg favicon')
  if (!hasLink('icon', l => attr(l, 'type') === 'image/x-icon')) fail(route, 'missing .ico favicon')
  if (/hreflang=/.test(head)) fail(route, 'has hreflang, but the site has one language')

  // Titles and descriptions are unique across pages
  if (title !== undefined) pushSeen(seenTitles, decode(title).trim(), route)
  if (description !== undefined) pushSeen(seenDescriptions, description, route)

  // A template that renders an undefined value prints the word into a tag or the JSON-LD
  const unrendered = /\b(undefined|null|NaN)\b|\[object /
  for (const m of metas) {
    if (unrendered.test(attr(m, 'content') ?? '')) fail(route, `meta tag contains an unrendered value: ${m.slice(0, 120)}`)
  }
  if (unrendered.test(title ?? '')) fail(route, `title contains an unrendered value: "${title}"`)

  const ld = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  if (ld.length === 0) fail(route, 'no JSON-LD')
  const ldTypes = []
  for (const [, body] of ld) {
    try {
      const data = JSON.parse(body)
      if (data['@context'] !== 'https://schema.org') fail(route, 'JSON-LD @context is not https://schema.org')
      ldTypes.push(...(data['@graph'] ?? [data]).map(n => n['@type']))
      if (/\bundefined\b|"null"|\bNaN\b/.test(body)) fail(route, 'JSON-LD contains an unrendered value (undefined/null/NaN)')
      for (const m of body.matchAll(/"(?:url|item|@id|image|codeRepository)":"([^"]+)"/g)) {
        if (!/^https:\/\/[^\s"]+$/.test(m[1])) fail(route, `JSON-LD URL is not absolute https: ${m[1]}`)
      }
    }
    catch (e) {
      fail(route, `JSON-LD does not parse: ${e.message}`)
    }
  }
  const needType = (type) => { if (!ldTypes.includes(type)) fail(route, `JSON-LD has no ${type} (found: ${ldTypes.join(', ') || 'none'})`) }
  if (route === '/') { needType('Person'); needType('WebSite') }
  else if (route === '/about/') needType('ProfilePage')
  else if (route === '/blog/') needType('Blog')
  else if (route === '/projects/') needType('CollectionPage')
  else if (/^\/projects\/[^/]+\/$/.test(route)) { needType('SoftwareSourceCode'); needType('BreadcrumbList') }
  else if (/^\/blog\/[^/]+\/$/.test(route)) { needType('BlogPosting'); needType('BreadcrumbList') }

  // Headings never skip a level; images carry an alt attribute (alt="" marks a decorative one)
  let previousLevel = 0
  for (const [, level] of html.matchAll(/<h([1-6])[\s>]/g)) {
    if (previousLevel && +level > previousLevel + 1) fail(route, `heading level jumps from h${previousLevel} to h${level}`)
    previousLevel = +level
  }
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt(=|\s|>|\/)/.test(tag)) fail(route, `<img> without alt: ${tag.slice(0, 100)}`)
  }

  // Internal links resolve to a built page or file and use the trailing-slash form
  for (const [, raw] of html.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)) {
    const href = decode(raw)
    if (!href.startsWith('/') || href.startsWith('//')) continue
    const path = href.split(/[?#]/)[0]
    const hasExtension = /\.[a-z0-9]+$/i.test(path)
    if (!hasExtension && !path.endsWith('/')) fail(route, `internal link without the trailing slash: ${href}`)
    const target = join(ROOT, decodeURIComponent(path))
    const exists = hasExtension ? existsSync(target) : existsSync(join(target, 'index.html'))
    if (!exists) fail(route, `internal link has no built page: ${href}`)
  }

  const h1s = (html.match(/<h1[\s>]/g) ?? []).length
  if (h1s !== 1) fail(route, `expected exactly one <h1>, found ${h1s}`)

  const robots = meta('name', 'robots')
  if (robots && /noindex/i.test(robots)) fail(route, `robots meta says noindex: "${robots}"`)
}

for (const [map, what] of [[seenTitles, 'title'], [seenDescriptions, 'meta description']]) {
  for (const [text, routes] of map) if (routes.length > 1) fail(routes.join(', '), `share the same ${what}: "${text.slice(0, 80)}"`)
}

// ---- icons, manifest, feed, security.txt, llms.txt, 404 ---------------------------------------
const read = path => readFileSync(join(ROOT, path), 'utf8')
const need = (path) => {
  if (!existsSync(join(ROOT, path))) {
    fail(path, 'missing from the build')
    return false
  }
  return true
}
for (const icon of ['favicon.ico', 'favicon.svg']) need(icon)
for (const [icon, size] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512], ['icon-maskable-512.png', 512]]) {
  if (!need(icon)) continue
  const dims = pngSize(join(ROOT, icon))
  if (!dims || dims.width !== size || dims.height !== size) fail(icon, `want a ${size}x${size} PNG, got ${dims ? `${dims.width}x${dims.height}` : 'not a PNG'}`)
}

if (need('site.webmanifest')) {
  try {
    const manifest = JSON.parse(read('site.webmanifest'))
    for (const key of ['id', 'name', 'short_name', 'lang', 'start_url', 'display', 'theme_color', 'background_color', 'icons']) {
      if (!manifest[key]) fail('site.webmanifest', `missing ${key}`)
    }
    const icons = manifest.icons ?? []
    for (const icon of icons) {
      if (!existsSync(join(ROOT, icon.src))) fail('site.webmanifest', `icon ${icon.src} is not in the build`)
    }
    const hasIcon = (size, purpose) => icons.some(i => i.sizes === size && (i.purpose ?? 'any').includes(purpose))
    if (!hasIcon('192x192', 'any')) fail('site.webmanifest', 'no 192x192 icon')
    if (!hasIcon('512x512', 'any')) fail('site.webmanifest', 'no 512x512 icon')
    if (!hasIcon('512x512', 'maskable')) fail('site.webmanifest', 'no maskable 512x512 icon')
  }
  catch (e) {
    fail('site.webmanifest', `does not parse: ${e.message}`)
  }
}

// feed.xml: valid RSS 2.0 with one item per published post, absolute trailing-slash links
const publishedPosts = (() => {
  const base = join(process.cwd(), 'content/blog')
  if (!existsSync(base)) return []
  return readdirSync(base).filter(n => n.endsWith('.md')).filter((n) => {
    const fm = readFileSync(join(base, n), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
    return /^published:\s*true\s*$/m.test(fm)
  }).map(n => n.replace(/\.md$/, ''))
})()
if (need('feed.xml')) {
  const feed = read('feed.xml')
  if (!feed.startsWith('<?xml')) fail('feed.xml', 'does not start with an XML declaration (a prerender hook may have rewritten it)')
  if (!/<rss\b[^>]*version="2\.0"/.test(feed)) fail('feed.xml', 'not an RSS 2.0 document')
  if (!feed.includes(`<atom:link href="${ORIGIN}/feed.xml" rel="self"`)) fail('feed.xml', 'no atom:link rel=self')
  const feedLinks = [...feed.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>/g)].map(m => m[1])
  for (const slug of publishedPosts) {
    if (!feedLinks.includes(`${ORIGIN}/blog/${slug}/`)) fail('feed.xml', `published post ${slug} is not in the feed`)
  }
  if (feedLinks.length !== publishedPosts.length) fail('feed.xml', `${feedLinks.length} items, but ${publishedPosts.length} published posts`)
  if (/undefined|<pubDate>Invalid/.test(feed)) fail('feed.xml', 'contains an unrendered value')
}

// security.txt (RFC 9116): needs Contact and an Expires date that is still in the future
if (need('.well-known/security.txt')) {
  const sec = read('.well-known/security.txt')
  if (!/^Contact:\s*\S+/m.test(sec)) fail('security.txt', 'no Contact field')
  const expires = sec.match(/^Expires:\s*(\S+)/m)?.[1]
  if (!expires || Number.isNaN(Date.parse(expires))) fail('security.txt', 'no valid Expires field')
  else if (Date.parse(expires) < Date.now() + 30 * 864e5) fail('security.txt', `Expires ${expires} is within 30 days: renew it`)
}

// llms.txt lists every built project and post (it is generated from the content, so a gap is a bug)
if (need('llms.txt')) {
  const llms = read('llms.txt')
  for (const { route } of pages) {
    if (/^\/(projects|blog)\/[^/]+\/$/.test(route) && !llms.includes(`${ORIGIN}${route}`)) fail('llms.txt', `does not list ${route}`)
  }
  if (!llms.includes(`${ORIGIN}/feed.xml`)) fail('llms.txt', 'does not mention the RSS feed')
}

// 404.html: a real page that search engines must not index
if (need('404.html')) {
  const nf = read('404.html')
  const nfHead = nf.slice(0, nf.indexOf('</head>'))
  if (!/<title[^>]*>[^<]{5,}<\/title>/.test(nfHead)) fail('404.html', 'no <title>')
  if (!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(nfHead)) fail('404.html', 'no noindex robots meta')
  if (!/<meta[^>]*name="description"/.test(nfHead)) fail('404.html', 'no meta description')
  if (!/<html\b[^>]*\slang="en"/.test(nf.slice(0, 400))) fail('404.html', '<html> has no lang="en"')
  if ((nf.match(/<h1[\s>]/g) ?? []).length !== 1) fail('404.html', 'expected exactly one <h1>')
}

// ---- sitemap + robots -----------------------------------------------------------------------
const sitemapPath = join(ROOT, 'sitemap.xml')
if (!existsSync(sitemapPath)) fail('sitemap.xml', 'missing')
else {
  const sitemap = readFileSync(sitemapPath, 'utf8')
  const locs = new Set([...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map(m => decode(m[1])))
  const built = new Set(pages.map(p => `${ORIGIN}${p.route}`))
  for (const url of built) if (!locs.has(url)) fail('sitemap.xml', `missing built route ${url}`)
  for (const url of locs) if (!built.has(url)) fail('sitemap.xml', `lists ${url}, which has no built page`)

  // Drafts: production builds drop them, so they must be neither built nor listed
  const frontmatter = (file) => {
    const m = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)
    return m ? m[1] : ''
  }
  for (const [dir, key, publishedValue] of [['blog', 'published', 'true'], ['projects', 'status', 'published']]) {
    const base = join(process.cwd(), 'content', dir)
    if (!existsSync(base)) continue
    for (const name of readdirSync(base).filter(n => n.endsWith('.md'))) {
      const value = frontmatter(join(base, name)).match(new RegExp(`^${key}:\\s*['"]?([^'"\\s]+)`, 'm'))?.[1]
      const url = `${ORIGIN}/${dir}/${name.replace(/\.md$/, '')}/`
      const published = value === publishedValue
      if (published && !locs.has(url)) fail('sitemap.xml', `published ${dir}/${name} is not listed (${url})`)
      if (!published && (locs.has(url) || built.has(url))) fail('sitemap.xml', `draft ${dir}/${name} is listed or built (${url})`)
    }
  }
}

const robotsPath = join(ROOT, 'robots.txt')
if (!existsSync(robotsPath)) fail('robots.txt', 'missing')
else if (!new RegExp(`^Sitemap:\\s*${ORIGIN}/sitemap\\.xml\\s*$`, 'mi').test(readFileSync(robotsPath, 'utf8'))) {
  fail('robots.txt', `no "Sitemap: ${ORIGIN}/sitemap.xml" line`)
}

if (problems.length) {
  console.error(`SEO check failed (${problems.length} problem${problems.length === 1 ? '' : 's'}):`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log(`SEO check passed: ${pages.length} pages, sitemap.xml and robots.txt OK.`)
