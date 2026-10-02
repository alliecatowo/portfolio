// SEO gate for the static build.
//
//   pnpm generate && pnpm check:seo
//
// Walks every prerendered index.html in .output/public (404 and Studio excluded) and checks canonical,
// title/description length, OpenGraph/Twitter tags, JSON-LD, the h1 count and robots meta. It also
// checks sitemap.xml against the built routes and the content (published routes listed, drafts not)
// and that robots.txt points at the sitemap. Image variants are check:images' job and frontmatter
// is validate:content's, so neither is repeated here. Exits 1 and lists every problem otherwise.
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
    .replace(/&#39;|&#x27;/g, '\'').replace(/&amp;/g, '&')

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

  const ld = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  if (ld.length === 0) fail(route, 'no JSON-LD')
  for (const [, body] of ld) {
    try {
      JSON.parse(body)
    }
    catch (e) {
      fail(route, `JSON-LD does not parse: ${e.message}`)
    }
  }

  const h1s = (html.match(/<h1[\s>]/g) ?? []).length
  if (h1s !== 1) fail(route, `expected exactly one <h1>, found ${h1s}`)

  const robots = meta('name', 'robots')
  if (robots && /noindex/i.test(robots)) fail(route, `robots meta says noindex: "${robots}"`)
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
