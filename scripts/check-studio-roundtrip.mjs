/**
 * Check that what Nuxt Studio would save from the production content database is byte-identical
 * to the file in content/.
 *
 * In production Studio doesn't parse the files: it loads every document from the built
 * /__nuxt_content/<collection>/sql_dump.txt, and on save writes the stored document back out
 * with generateContentFromDocument. Anything added to a document at build time (hooks in
 * nuxt.config.ts, Nuxt Content's own transforms, zod defaults) therefore leaks into the file.
 * format-content.mjs checks the file -> text path; this checks the database -> text path.
 *
 * Usage: node scripts/check-studio-roundtrip.mjs [--dump <dir>] [--show] [content/path ...]
 *   --dump  directory holding <collection>/sql_dump.txt (default .output/public/__nuxt_content,
 *           the output of `pnpm generate`). Drafts are only in the dump when it was built with
 *           CONTENT_INCLUDE_DRAFTS=true.
 *   --show  print a line diff for every file that differs
 *
 * Exits 1 when any document in the dump does not round-trip.
 */
import { readFileSync, existsSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { gunzipSync } from 'node:zlib'
import { join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root, infoByName, collections, generateContentFromDocument, sanitizeDocumentTree } from './studio-runtime.mjs'

const args = process.argv.slice(2)
const show = args.includes('--show')
const dumpIdx = args.indexOf('--dump')
const dumpDir = resolve(root, dumpIdx >= 0 ? args[dumpIdx + 1] : '.output/public/__nuxt_content')
const wanted = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--dump').map(f => relative(root, resolve(f)))

// Column types Nuxt Content uses to turn a stored row back into a document (refineContentFields)
const manifest = (await import(pathToFileURL(join(root, '.nuxt/content/manifest.ts')).href)).default

function refine(collection, row) {
  const fields = manifest[collection].fields
  const item = {}
  for (const [key, value] of Object.entries(row)) {
    if (value === null || value === 'NULL') continue
    if (fields[key] === 'json' && value && value !== 'undefined') item[key] = JSON.parse(value)
    else if (fields[key] === 'boolean') item[key] = Boolean(value)
    else item[key] = value
  }
  return item
}

// Lines only in the file (-) or only in what Studio would write (+); order is ignored, which is
// plenty to see what leaked
function lineDiff(onDisk, written) {
  const count = (text) => {
    const m = new Map()
    for (const l of text.split('\n')) m.set(l, (m.get(l) ?? 0) + 1)
    return m
  }
  const a = count(onDisk)
  const b = count(written)
  const out = []
  for (const [l, n] of a) if (n > (b.get(l) ?? 0)) out.push(`  - ${l.slice(0, 200)}`)
  for (const [l, n] of b) if (n > (a.get(l) ?? 0)) out.push(`  + ${l.slice(0, 200)}`)
  return out.slice(0, 30).join('\n')
}

let checked = 0
const failures = []
for (const collection of collections) {
  const dump = join(dumpDir, collection, 'sql_dump.txt')
  if (!existsSync(dump)) continue
  const db = new DatabaseSync(':memory:')
  for (const statement of JSON.parse(gunzipSync(Buffer.from(readFileSync(dump, 'utf8'), 'base64')).toString())) db.exec(statement)
  const rows = db.prepare(`SELECT * FROM _content_${collection} ORDER BY id`).all()
  for (const row of rows) {
    // ids look like <collection>/<path inside the collection's source folder>
    const rel = `content/${row.id.slice(collection.length + 1)}`
    if (wanted.length && !wanted.includes(rel)) continue
    const fsPath = rel.replace(/^content\//, '')
    const document = sanitizeDocumentTree({ ...refine(collection, row), fsPath }, infoByName[collection])
    const written = await generateContentFromDocument(document)
    const onDisk = readFileSync(join(root, rel), 'utf8')
    checked++
    if (written !== onDisk) failures.push({ rel, written, onDisk })
  }
}

for (const f of failures) {
  console.log(`differs  ${f.rel}`)
  if (show) console.log(lineDiff(f.onDisk, f.written))
}
console.log(`${checked - failures.length} of ${checked} documents in the content database save back byte-identical to their files`)
if (!checked) {
  console.log(`no documents found under ${dumpDir}; run \`pnpm generate\` first`)
  process.exit(1)
}
if (failures.length) process.exit(1)
