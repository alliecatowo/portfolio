/**
 * Loads Nuxt Studio's own document functions (the ones its editor calls to turn a content
 * document into text and back) into plain Node, for scripts/format-content.mjs and
 * scripts/check-studio-roundtrip.mjs.
 *
 * Studio's modules are imported straight from node_modules/nuxt-studio/dist. Two things are
 * stubbed because they need a running Nuxt:
 *   - `@nuxt/content` (content.config.ts imports it) resolves to scripts/nuxt-content-shim.mjs
 *   - useHostMeta, a composable that supplies the markdown config and highlight theme; it has no
 *     effect on the serialized text, so it answers with the defaults
 */
import { realpathSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')

const shimUrl = new URL('./nuxt-content-shim.mjs', import.meta.url).href
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '@nuxt/content' && context.parentURL !== shimUrl) {
      return { url: shimUrl, shortCircuit: true }
    }
    return nextResolve(specifier, context)
  }
})

const NO_HOST_META = 'data:text/javascript,export const useHostMeta=()=>({markdownConfig:{value:{}},highlightTheme:{value:undefined}})'
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.endsWith('composables/useMeta.js')) return { url: NO_HOST_META, shortCircuit: true }
    return nextResolve(specifier, context)
  }
})

// Resolve Studio's runtime from the installed package (pnpm links it from the virtual store)
const studioDir = realpathSync(join(root, 'node_modules/nuxt-studio'))
const studioUrl = rel => pathToFileURL(join(studioDir, rel)).href
const documentModule = rel => import(studioUrl(`dist/module/runtime/utils/${rel}`))

export const { generateContentFromDocument, generateDocumentFromContent, sanitizeDocumentTree } = await documentModule('document/index.js')
export const { applyCollectionSchema, cleanDataKeys } = await documentModule('document/schema.js')

export const config = (await import(pathToFileURL(join(root, 'content.config.ts')).href)).default

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
export const collections = Object.keys(config.collections)
export const infoByName = Object.fromEntries(collections.map(n => [n, collectionInfo(n)]))
