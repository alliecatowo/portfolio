// NuxtLink no longer prefetches every visible link while the first page loads (that competed with the
// LCP image and entry scripts). Once the page has been idle for a few seconds, warm the main nav routes
// instead, so a click is still instant; hover/focus prefetch (nuxtLink defaults) covers everything else.
const ROUTES = ['/about/', '/projects/', '/blog/', '/contact/']
const DELAY_MS = 6000

export default defineNuxtPlugin((nuxtApp) => {
  // Respect data-saver and very slow connections
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean, effectiveType?: string } }).connection
  if (connection?.saveData || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') return

  nuxtApp.hooks.hookOnce('app:suspense:resolve', () => {
    setTimeout(() => {
      const run = () => {
        for (const path of ROUTES) {
          preloadRouteComponents(path).catch(() => {})
          preloadPayload(path).catch(() => {})
        }
      }
      if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 4000 })
      else run()
    }, DELAY_MS)
  })
})
