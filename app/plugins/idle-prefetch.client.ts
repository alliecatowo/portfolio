// NuxtLink prefetches links as they scroll into view, but on a phone the main nav links sit inside the
// closed menu and never become visible. Once the page has been idle for a few seconds, warm those
// routes too, so the first tap on a nav link is still instant.
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
