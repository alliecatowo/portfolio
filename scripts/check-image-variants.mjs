// Checks that every image URL in the pre-rendered HTML exists in the static build.
//
//   pnpm generate && pnpm check:images
//
// Images are served from files prerendered under .output/public/_ipx/ (there is no image server in
// production), so a `src` or srcset candidate the build did not generate would 404. This walks every
// .html file, collects each <img>/<source> `src` and `srcset` URL that points at /_ipx/, and checks
// the file is there. Exits 1 and lists the misses otherwise.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(process.cwd(), '.output/public')
if (!existsSync(join(ROOT, 'index.html'))) {
  console.error('No .output/public build found. Run `pnpm generate` first.')
  process.exit(2)
}

const htmlFiles = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path)
    else if (name.endsWith('.html')) htmlFiles.push(path)
  }
}
walk(ROOT)

const decode = s => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
const urls = new Map() // url -> first page it appeared on
const add = (url, page) => {
  const u = decode(url.trim())
  if (u.startsWith('/_ipx/') && !urls.has(u)) urls.set(u, page)
}
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8')
  const page = file.slice(ROOT.length)
  for (const tag of html.match(/<(?:img|source)\b[^>]*>/g) ?? []) {
    const src = tag.match(/\ssrc="([^"]*)"/)
    if (src) add(src[1], page)
    const srcset = tag.match(/\ssrcset="([^"]*)"/)
    // Candidates are "url 123w" or "url 2x"; ipx URLs contain no commas or spaces
    if (srcset) for (const candidate of srcset[1].split(',')) add(candidate.trim().split(/\s+/)[0] ?? '', page)
  }
}

const missing = [...urls].filter(([url]) => !existsSync(join(ROOT, decodeURIComponent(url))))
console.log(`${htmlFiles.length} pages, ${urls.size} distinct /_ipx/ image URLs, ${missing.length} missing`)
for (const [url, page] of missing) console.error(`  missing ${url} (first seen on ${page})`)
process.exit(missing.length ? 1 : 0)
