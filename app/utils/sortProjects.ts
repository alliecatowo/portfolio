interface SortableProject {
  order?: number | null
  featured?: boolean | null
  date?: string | null
}

const toTime = (date?: string | null) => {
  const time = date ? Date.parse(date) : Number.NaN
  return Number.isNaN(time) ? 0 : time
}

/**
 * Order projects for display: explicit `order` ascending (unordered projects
 * last), then featured before unfeatured, then newest first.
 *
 * Dates are compared as timestamps, not strings: the content schema turns
 * YAML dates into `Date#toString()` output, which does not sort lexically.
 */
export function sortProjects<T extends SortableProject>(projects: T[]): T[] {
  return [...projects].sort((a, b) => {
    const aOrder = typeof a.order === 'number' ? a.order : Number.POSITIVE_INFINITY
    const bOrder = typeof b.order === 'number' ? b.order : Number.POSITIVE_INFINITY
    if (aOrder !== bOrder) return aOrder - bOrder

    const featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    if (featuredDiff !== 0) return featuredDiff

    return toTime(b.date) - toTime(a.date)
  })
}
