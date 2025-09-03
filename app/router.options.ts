import type { RouterConfig } from '@nuxt/schema'

// Preserve scroll on query-only changes (e.g., pagination), restore on back/forward
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    // If only query changed on same path, don't scroll
    if (to.path === from.path) return false
    return { left: 0, top: 0 }
  }
}

