import type { RouterConfig } from '@nuxt/schema'

// Preserve scroll on query-only changes (e.g., pagination), restore on back/forward
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.path === from.path) {
      // In-page anchor (e.g. a blog post's table of contents). scrollIntoView
      // honours the headings' scroll-margin, which clears the sticky header.
      if (to.hash && to.hash !== from.hash) {
        const el = document.getElementById(decodeURIComponent(to.hash.slice(1)))
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      // Query-only change: don't scroll
      return false
    }
    if (to.hash) return { el: to.hash, top: 96 }
    return { left: 0, top: 0 }
  }
}
