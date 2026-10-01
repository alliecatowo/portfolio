/**
 * Format content/ the way Nuxt Studio does, so opening a file in Studio produces no diff.
 *
 * Neither Nuxt Content nor Studio ships a format CLI, so this script drives the same
 * functions Studio calls when it turns a document back into text:
 *
 *   Markdown  parse     generateDocumentFromContent -> @nuxtjs/mdc parseMarkdown + remark-mdc
 *                       (autoUnwrap) + emoji plugin, `rel` stripped from links, body compressed
 *             schema    applyCollectionSchema: keys outside the collection schema move to `meta`
 *             stringify generateContentFromDocument -> cleanDataKeys + stringifyMarkdown
 *                       (frontmatter via remark-mdc stringifyFrontMatter, lineWidth 0)
 *   YAML      parse     generateDocumentFromContent (generateDocumentFromYAMLContent)
 *             stringify generateContentFromDocument -> stringifyFrontMatter(cleanDataKeys(doc))
 *
 * Studio's own modules are imported straight from node_modules/nuxt-studio/dist. The only thing
 * stubbed is useHostMeta (a Nuxt composable that supplies the markdown config and highlight
 * theme), which has no effect on the serialized text.
 *
 * A Markdown file whose body would not re-parse to the identical tree (raw HTML such as <video>
 * with <source> children becomes a lossy :video[] component) keeps its body verbatim and only has
 * its frontmatter normalized. Any file whose frontmatter data would change meaning is skipped.
 *
 * Usage: node scripts/format-content.mjs [--check] [file ...]
 *   (no --check)  rewrite files in place
 *   --check       write nothing, list files that differ, exit 1 if any
 */
import { readFileSync, writeFileSync, realpathSync, globSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { isDeepStrictEqual } from 'node:util'

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const shimUrl = new URL('./nuxt-content-shim.mjs', import.meta.url).href
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '@nuxt/content' && context.parentURL !== shimUrl) {
      return { url: shimUrl, shortCircuit: true }
    }
    return nextResolve(specifier, context)
  }
})

// Studio's markdown parser reads the host markdown config through a Nuxt composable; outside Nuxt
// answer with the defaults (no contentHeading override, no highlight theme)
const NO_HOST_META = 'data:text/javascript,export const useHostMeta=()=>({markdownConfig:{value:{}},highlightTheme:{value:undefined}})'
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.endsWith('composables/useMeta.js')) return { url: NO_HOST_META, shortCircuit: true }
    return nextResolve(specifier, context)
  }
})

const args = process.argv.slice(2)
const check = args.includes('--check')
const fileArgs = args.filter(a => !a.startsWith('--'))

// Resolve Studio's runtime from the installed package (pnpm links it from the virtual store)
const studioDir = realpathSync(join(root, 'node_modules/nuxt-studio'))
const studioUrl = rel => pathToFileURL(join(studioDir, rel)).href
const { generateContentFromDocument, generateDocumentFromContent } = await import(studioUrl('dist/module/runtime/utils/document/generate.js'))
const { applyCollectionSchema, cleanDataKeys } = await import(studioUrl('dist/module/runtime/utils/document/schema.js'))

const config = (await import(pathToFileURL(join(root, 'content.config.ts')).href)).default

// Same shape Studio builds from the live collections (see getOrderedSchemaKeys): the page
// fields Nuxt Content adds to every collection plus the keys of the zod schema.
const PAGE_KEYS = ['id', 'title', 'description', 'seo', 'body', 'navigation', 'path', 'extension', 'stem', 'meta']
const DATA_KEYS = ['id', 'extension', 'stem', 'meta']
function collectionInfo(name) {
  const c = config.collections[name]
  const shape = c.schema.shape ?? c.schema._def?.shape?.() ?? {}
  const keys = [...(c.type === 'page' ? PAGE_KEYS : DATA_KEYS), ...Object.keys(shape)]
  return {
    name,
    type: c.type,
    schema: { definitions: { [name]: { properties: Object.fromEntries(keys.map(k => [k, {}])) } } }
  }
}
const collections = Object.keys(config.collections)
const infoByName = Object.fromEntries(collections.map(n => [n, collectionInfo(n)]))

function sourceFiles() {
  const files = []
  for (const name of collections) {
    const src = config.collections[name].source
    const include = typeof src === 'string' ? src : src.include
    for (const f of globSync(include, { cwd: join(root, 'content') })) {
      files.push({ collection: name, file: join(root, 'content', f), rel: `content/${f}` })
    }
  }
  return files
}

async function parseDocument(id, content, type) {
  const document = await generateDocumentFromContent(id, content, { collectionType: type, compress: true })
  return { tree: document.body, document }
}

// A fenced block re-parsed from its own output gains an empty `meta: ""` prop; it renders the same
function comparableTree(tree) {
  return JSON.parse(JSON.stringify(tree, (key, value) => (key === 'meta' && value === '' ? undefined : value)))
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

const RESERVED = ['id', 'fsPath', 'stem', 'extension', '__hash__', 'path', 'body', 'meta', 'rawbody']

// The document as Studio holds it after loading it from the content database: schema defaults
// filled in (featured: false, category: dev, ...), keys in column order (id, title, then
// alphabetical; see getOrderedSchemaKeys in Studio's runtime/utils/collection.js), and keys
// outside the schema moved to `meta` (applyCollectionSchema).
function studioDocument(info, id, document) {
  const draft = structuredClone(document)
  const parsed = config.collections[info.name].schema.safeParse(Object.fromEntries(Object.entries(draft).filter(([k]) => !RESERVED.includes(k))))
  if (parsed.success) {
    for (const [k, v] of Object.entries(parsed.data)) if (draft[k] === undefined && v !== undefined) draft[k] = v
  }
  const applied = applyCollectionSchema(id, info, draft)
  const ordered = { id: applied.id }
  if (applied.title !== undefined) ordered.title = applied.title
  for (const k of Object.keys(applied).sort()) if (!(k in ordered)) ordered[k] = applied[k]
  return ordered
}

// What Studio would write for the frontmatter-bearing document, as an object (for equality checks)
function cleanedData(info, document) {
  return JSON.parse(JSON.stringify(cleanDataKeys(studioDocument(info, document.id, document))))
}
function sortKeys(v) {
  if (Array.isArray(v)) return v.map(sortKeys)
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map(k => [k, sortKeys(v[k])]))
  return v
}

async function formatMarkdown({ collection, rel }, src) {
  const info = infoByName[collection]
  const id = `${collection}/${rel.replace(/^content\//, '')}`
  const before = await parseDocument(id, src, info.type)
  const normalized = studioDocument(info, id, before.document)
  const full = await generateContentFromDocument(normalized)
  const out = full.endsWith('\n') ? full : full + '\n'

  const after = await parseDocument(id, out, info.type)
  const sameData = isDeepStrictEqual(sortKeys(cleanedData(info, before.document)), sortKeys(cleanedData(info, after.document)))
  if (!sameData) return { status: 'skipped', reason: 'frontmatter data would change meaning', out: src }
  if (isDeepStrictEqual(comparableTree(before.tree), comparableTree(after.tree))) return { status: 'full', out }

  // Body would not survive the round trip (e.g. raw <video><source> HTML): keep the body verbatim
  // and apply Studio's frontmatter formatting only.
  const fm = out.match(FRONTMATTER)
  const orig = src.match(FRONTMATTER)
  if (!fm || !orig) return { status: 'skipped', reason: 'no frontmatter block', out: src }
  return { status: 'frontmatter-only', out: fm[0].replace(/\n*$/, '\n') + src.slice(orig[0].length) }
}

async function formatYaml({ collection, rel }, src) {
  const info = infoByName[collection]
  const id = `${collection}/${rel.replace(/^content\//, '')}`
  const document = await generateDocumentFromContent(id, src)
  const normalized = studioDocument(info, id, document)
  const full = await generateContentFromDocument(normalized)
  const out = full.endsWith('\n') ? full : full + '\n'
  const again = await generateDocumentFromContent(id, out)
  const strip = d => sortKeys(cleanedData(info, d))
  if (!isDeepStrictEqual(strip(document), strip(again))) return { status: 'skipped', reason: 'data would change meaning', out: src }
  return { status: 'full', out }
}

const wanted = fileArgs.length ? new Set(fileArgs.map(f => relative(root, resolve(f)))) : null
const results = []
for (const entry of sourceFiles().sort((a, b) => a.rel.localeCompare(b.rel))) {
  if (wanted && !wanted.has(entry.rel)) continue
  const src = readFileSync(entry.file, 'utf8')
  const r = entry.file.endsWith('.md') ? await formatMarkdown(entry, src) : await formatYaml(entry, src)
  results.push({ ...entry, ...r, changed: r.out !== src })
}

const changed = results.filter(r => r.changed)
for (const r of results) {
  if (r.status === 'skipped') console.log(`skipped  ${r.rel}: ${r.reason}`)
  else if (r.status === 'frontmatter-only') console.log(`${r.changed ? 'fm-only ' : 'fm-ok   '} ${r.rel} (body kept verbatim)`)
}
if (check) {
  for (const r of changed) console.log(`would reformat ${r.rel}`)
  console.log(`${changed.length} of ${results.length} content files differ from Studio's formatting`)
  if (changed.length) {
    console.log('Run `pnpm content:format` to fix.')
    process.exit(1)
  }
} else {
  for (const r of changed) writeFileSync(r.file, r.out)
  console.log(`reformatted ${changed.length} of ${results.length} content files`)
}
