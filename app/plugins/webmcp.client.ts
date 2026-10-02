// Registers read-only WebMCP tools (https://webmachinelearning.github.io/webmcp/) so an agent in the
// browser can explore this site. Allison won the 2026 OpenAI WebMCP Challenge with JupyterLite WebMCP;
// the site should speak it too.
//
// - Feature-detected: browsers without WebMCP skip everything. No polyfill.
// - Registration is deferred to idle time and costs only a few object literals. Data is fetched when a
//   tool runs, from the pre-rendered /webmcp/catalog.json (never @nuxt/content's SQLite WASM).
// - The contact form is exposed declaratively (toolname/tooldescription in app/pages/contact.vue).
import { createWebmcpTools } from '~/utils/webmcpTools'
import type { WebmcpCatalog } from '~/utils/webmcpTools'

interface ModelContextLike {
  registerTool: (tool: Record<string, unknown>, options?: Record<string, unknown>) => unknown
}

function findModelContext(): ModelContextLike | undefined {
  // `document.modelContext` is the current spec; `navigator.modelContext` is the older alias.
  const candidates = [
    (document as unknown as { modelContext?: ModelContextLike }).modelContext,
    (navigator as unknown as { modelContext?: ModelContextLike }).modelContext
  ]
  return candidates.find(c => c && typeof c.registerTool === 'function')
}

export default defineNuxtPlugin((nuxtApp) => {
  const modelContext = findModelContext()
  if (!modelContext) return

  const router = useRouter()
  let catalog: Promise<WebmcpCatalog> | undefined
  const tools = createWebmcpTools({
    getCatalog: () => {
      catalog ??= $fetch<WebmcpCatalog>('/webmcp/catalog.json').catch((err) => {
        catalog = undefined
        throw err
      })
      return catalog
    },
    navigate: async (path) => {
      const resolved = router.resolve(path)
      if (!resolved.matched.length) return null
      await navigateTo(resolved.fullPath)
      return resolved.fullPath
    }
  })

  let registered = false
  const register = () => {
    if (registered) return
    registered = true
    for (const tool of tools) {
      try {
        modelContext.registerTool(tool as unknown as Record<string, unknown>)
      } catch (err) {
        // A duplicate name (e.g. after HMR) or a browser-side schema complaint must not break the page
        console.warn(`[webmcp] could not register ${tool.name}`, err)
      }
    }
  }

  nuxtApp.hook('app:mounted', () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(register, { timeout: 2000 })
    else setTimeout(register, 1000)
  })
})
