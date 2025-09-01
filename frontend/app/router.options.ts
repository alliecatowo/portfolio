import type { RouterConfig } from '@nuxt/schema'
import type { RouteLocationNormalized } from 'vue-router'

// Preserve scroll on query-only changes (e.g., pagination), restore on back/forward
export default <RouterConfig>{
  scrollBehavior(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    savedPosition: { left: number; top: number } | null
  ) {
    if (savedPosition) return savedPosition
    // If only query changed on same path, don't scroll
    if (to.path === from.path) return false
    return { left: 0, top: 0 }
  }
}

