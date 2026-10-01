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
 * Studio's own modules are loaded by scripts/studio-runtime.mjs.
 *
 * A file that does not survive the round trip (the body would re-parse to a different tree, or the
 * frontmatter data would change meaning) is never rewritten. It is reported as "unstable" and
 * fails --check: fix the content so Studio can save it, don't exempt it. (Raw HTML such as
 * <video><source> is the classic case; use an MDC component, see app/components/content.)
 *
 * Usage: node scripts/format-content.mjs [--check] [file ...]
 *   (no --check)  rewrite files in place
 *   --check       write nothing, list files that differ, exit 1 if any
 */
import { readFileSync, writeFileSync, globSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import {
  root, config, collections, infoByName,
  generateContentFromDocument, generateDocumentFromContent, applyCollectionSchema, cleanDataKeys
} from './studio-runtime.mjs'

const args = process.argv.slice(2)
const check = args.includes('--check')
const fileArgs = args.filter(a => !a.startsWith('--'))

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
  if (!sameData) return { status: 'unstable', reason: 'frontmatter data would change meaning', out: src }
  if (isDeepStrictEqual(comparableTree(before.tree), comparableTree(after.tree))) return { status: 'full', out }

  return { status: 'unstable', reason: 'the body would not re-parse to the same tree', out: src }
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
  if (!isDeepStrictEqual(strip(document), strip(again))) return { status: 'unstable', reason: 'data would change meaning', out: src }
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
const unstable = results.filter(r => r.status === 'unstable')
for (const r of unstable) console.log(`unstable ${r.rel}: ${r.reason}`)
if (check) {
  for (const r of changed) console.log(`would reformat ${r.rel}`)
  console.log(`${changed.length} of ${results.length} content files differ from Studio's formatting, ${unstable.length} do not round-trip`)
  if (changed.length || unstable.length) {
    if (changed.length) console.log('Run `pnpm content:format` to fix.')
    process.exit(1)
  }
} else {
  for (const r of changed) writeFileSync(r.file, r.out)
  console.log(`reformatted ${changed.length} of ${results.length} content files, ${unstable.length} do not round-trip`)
  if (unstable.length) process.exit(1)
}
