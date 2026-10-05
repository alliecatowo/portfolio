/**
 * Validate content/ against the zod schemas in content.config.ts.
 *
 * Nuxt Content v3 converts collection schemas to JSON Schema for its SQLite
 * tables but never rejects bad frontmatter at build time, so typos like
 * `status: completed` or `demo: example.com` ship silently. This script
 * imports the collection definitions from content.config.ts (no duplicated
 * schemas), parses every file matched by each collection's source glob,
 * runs safeParse, and adds a few checks the schemas can't express.
 *
 * Run: pnpm validate:content   (Node >= 22.18 strips the TypeScript types)
 * Exits 1 if anything is wrong, printing `file:field: message` per problem.
 */
import { existsSync, globSync, readFileSync, statSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { basename, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parse as parseYaml } from 'yaml'

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const contentDir = join(root, 'content')
const publicDir = join(root, 'public')
const shimUrl = new URL('./nuxt-content-shim.mjs', import.meta.url).href

// Route `@nuxt/content` to the shim for everyone except the shim itself
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '@nuxt/content' && context.parentURL !== shimUrl) {
      return { url: shimUrl, shortCircuit: true }
    }
    return nextResolve(specifier, context)
  }
})

interface SafeParseResult {
  success: boolean
  error?: { issues: { path: (string | number)[], message: string }[] }
}
interface Collection {
  type?: 'page' | 'data'
  source?: string | { include: string, exclude?: string[], cwd?: string }
  schema?: { safeParse: (data: unknown) => SafeParseResult }
}

const config = (await import(pathToFileURL(join(root, 'content.config.ts')).href)).default as {
  collections: Record<string, Collection>
}

const errors: string[] = []
const report = (file: string, field: string, message: string) => {
  errors.push(`${relative(root, file)}${field ? `:${field}` : ''}: ${message}`)
}

const IMAGE_EXT = /\.(?:png|jpe?g|webp|gif|svg|avif|ico)$/i
const URL_KEYS = new Set(['github', 'demo', 'docs', 'devpost', 'href', 'url', 'link', 'website'])
const ALLOWED_LINK = /^(?:https?:\/\/|mailto:|tel:|\/|#|\.{1,2}\/)/
const BARE_DOMAIN = /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}(?:[/?#]|$)/i
const PLACEHOLDER_HOSTS = /picsum\.photos|placehold\.co|via\.placeholder\.com/i

function checkLocalAsset(file: string, field: string, value: string) {
  const path = value.split(/[?#]/)[0]!
  if (!existsSync(join(publicDir, decodeURIComponent(path)))) {
    report(file, field, `${value} does not exist under public/`)
  }
}

// Walk parsed frontmatter/data generically so new fields (ogImage, hero.award, ...) are covered
function walk(file: string, value: unknown, path: string[]) {
  if (Array.isArray(value)) {
    value.forEach((item, i) => walk(file, item, [...path, String(i)]))
    return
  }
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    for (const [key, child] of Object.entries(value)) walk(file, child, [...path, key])
    return
  }
  if (typeof value !== 'string') return

  const field = path.join('.')
  const key = [...path].reverse().find(p => !/^\d+$/.test(p)) ?? ''
  const v = value.trim()

  if (URL_KEYS.has(key) && v && !ALLOWED_LINK.test(v)) {
    report(file, field, `"${v}" is not a full URL (needs http:// or https://)`)
  }
  if (IMAGE_EXT.test(v) && !/\s/.test(v)) {
    if (v.startsWith('/')) checkLocalAsset(file, field, v)
    else if (!/^https?:\/\//.test(v)) report(file, field, `image path "${v}" must start with / (public/) or http(s)://`)
  }
}

// Markdown body: bare-domain links and local images
function checkBody(file: string, body: string) {
  const lines = body.split('\n')
  lines.forEach((line, i) => {
    const where = `body line ${i + 1}`
    for (const m of line.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) {
      const target = m[1]!
      if (!ALLOWED_LINK.test(target) && BARE_DOMAIN.test(target)) {
        report(file, where, `link "${target}" has no scheme; use https://${target}`)
      }
      if (target.startsWith('/') && IMAGE_EXT.test(target.split(/[?#]/)[0]!)) checkLocalAsset(file, where, target)
    }
    for (const m of line.matchAll(/\bsrc=["'](\/[^"']+)["']/g)) {
      if (IMAGE_EXT.test(m[1]!.split(/[?#]/)[0]!)) checkLocalAsset(file, where, m[1]!)
    }
  })
}

function splitFrontmatter(raw: string): { data: unknown, body: string, bodyOffset: number } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/)
  if (!m) return { data: {}, body: raw, bodyOffset: 0 }
  return { data: parseYaml(m[1]!) ?? {}, body: raw.slice(m[0].length), bodyOffset: m[0].split('\n').length - 1 }
}

// Published items must carry what the site renders and shares from. Drafts stay flexible: the Content
// schemas keep these fields optional (a refinement would break their JSON-schema conversion), so the
// requirement lives here, where CI and `pnpm validate:content` enforce it.
const PUBLISHED_RULES: Record<string, { isPublished: (d: Record<string, unknown>) => boolean, required: string[] }> = {
  projects: { isPublished: d => d.status === 'published', required: ['description', 'date', 'image', 'imageAlt'] },
  blog: { isPublished: d => d.published === true, required: ['description', 'date', 'author'] }
}
// Published projects with no real screenshot or capture yet (a CLI or an unbuilt app). Remove a slug
// from this list as soon as it gets an image; never fill the gap with a placeholder.
const IMAGE_EXEMPT = new Set(['alliecode', 'anvil'])
// The description that ships in <meta> and share cards (seo.description wins over description)
const DESCRIPTION_MIN = 120
const DESCRIPTION_MAX = 165

function checkPublished(file: string, collection: string, d: Record<string, unknown>) {
  const rule = PUBLISHED_RULES[collection]
  if (!rule || !rule.isPublished(d)) return
  const slug = typeof d.slug === 'string' ? d.slug : basename(file, extname(file))
  for (const field of rule.required) {
    if (IMAGE_EXEMPT.has(slug) && collection === 'projects' && (field === 'image' || field === 'imageAlt')) continue
    const v = d[field]
    if (v === undefined || v === null || (typeof v === 'string' && !v.trim())) report(file, field, 'required for published items')
  }
  if (!rule.required.includes('imageAlt') && typeof d.image === 'string' && d.image && !(typeof d.imageAlt === 'string' && d.imageAlt.trim())) {
    report(file, 'imageAlt', 'required when image is set')
  }
  const seo = (d.seo ?? {}) as Record<string, unknown>
  const description = String((typeof seo.description === 'string' && seo.description) || d.description || '')
  if (description && (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX)) {
    report(file, typeof seo.description === 'string' && seo.description ? 'seo.description' : 'description', `${description.length} characters; published pages need ${DESCRIPTION_MIN}-${DESCRIPTION_MAX} for search and share cards`)
  }
}

let fileCount = 0
for (const [name, collection] of Object.entries(config.collections)) {
  const sources = !collection.source
    ? []
    : typeof collection.source === 'string'
      ? [{ include: collection.source }]
      : Array.isArray(collection.source) ? collection.source : [collection.source]

  const slugs = new Map<string, string>()
  for (const source of sources) {
    const cwd = source.cwd ? resolve(root, source.cwd) : contentDir
    const files = globSync(source.include, { cwd, exclude: source.exclude ?? [] })
      .map(f => join(cwd, f))
      .filter(f => statSync(f).isFile())
      .sort()

    for (const file of files) {
      fileCount++
      const raw = readFileSync(file, 'utf8')
      const ext = extname(file).toLowerCase()
      let data: unknown
      let body = ''
      let bodyOffset = 0
      try {
        if (ext === '.md') ({ data, body, bodyOffset } = splitFrontmatter(raw))
        else if (ext === '.json') data = JSON.parse(raw)
        else if (ext === '.yml' || ext === '.yaml') data = parseYaml(raw) ?? {}
        else continue
      }
      catch (e) {
        report(file, '', `could not parse: ${(e as Error).message}`)
        continue
      }

      const result = collection.schema?.safeParse(data)
      if (result && !result.success) {
        for (const issue of result.error!.issues) report(file, issue.path.join('.'), issue.message)
      }

      walk(file, data, [])
      if (ext === '.md') checkPublished(file, name, (data ?? {}) as Record<string, unknown>)
      if (body) {
        const before = errors.length
        checkBody(file, body)
        // Point body errors at real file line numbers
        for (let i = before; i < errors.length; i++) {
          errors[i] = errors[i]!.replace(/body line (\d+)/, (_, n) => `line ${Number(n) + bodyOffset}`)
        }
      }

      // The frontmatter `video` feeds the JSON-LD and sitemap; the body embed must show the same video
      const d = (data ?? {}) as Record<string, unknown>
      const embedded = [...body.matchAll(/:youtube-video\{[^}]*?#([\w-]{11})\b|^id:\s*([\w-]{11})\s*$/gm)].map(m => m[1] ?? m[2])
      const frontmatterVideo = (d.video as { youtube?: string } | undefined)?.youtube
      if (frontmatterVideo && embedded.length && !embedded.includes(frontmatterVideo)) {
        report(file, 'video.youtube', `"${frontmatterVideo}" is not the video embedded in the body (${embedded.join(', ')})`)
      }
      if (frontmatterVideo && !embedded.length) report(file, 'video.youtube', 'set in frontmatter but no ::youtube-video embed in the body')
      const slug = typeof d.slug === 'string' && d.slug
        ? d.slug
        : collection.type === 'page' ? basename(file, ext) : undefined
      if (slug) {
        const other = slugs.get(slug)
        if (other) report(file, 'slug', `"${slug}" is already used by ${relative(root, other)} in collection "${name}"`)
        else slugs.set(slug, file)
      }
    }
  }
}

// No random placeholder images anywhere in content or app code
const TEXT_EXT = /\.(?:md|ya?ml|json|vue|ts|js|mjs|css)$/
for (const dir of ['content', 'app']) {
  for (const f of globSync('**/*', { cwd: join(root, dir) })) {
    const file = join(root, dir, f)
    if (!TEXT_EXT.test(f) || !statSync(file).isFile()) continue
    readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      const m = line.match(PLACEHOLDER_HOSTS)
      if (m) report(file, `line ${i + 1}`, `placeholder image host "${m[0]}"; use a real image in public/`)
    })
  }
}

if (errors.length) {
  console.error(`Content validation failed (${errors.length} problem${errors.length === 1 ? '' : 's'}):\n`)
  for (const e of errors) console.error(`  ${e}`)
  process.exit(1)
}
console.log(`Content OK: ${fileCount} files in ${Object.keys(config.collections).length} collections`)
