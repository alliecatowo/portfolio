/**
 * Canonical trailing-slash form of a site path (Firebase redirects /about -> /about/).
 * Keeps any #hash or ?query, and leaves external URLs, mailto: and file paths alone.
 */
export function withTrailingSlashPath(to: string): string {
  if (!to.startsWith('/') || to.startsWith('//')) return to
  const match = to.match(/^([^?#]*)(.*)$/)
  const path = match?.[1] ?? to
  const rest = match?.[2] ?? ''
  if (path.endsWith('/') || /\.[a-z0-9]+$/i.test(path)) return to
  return `${path}/${rest}`
}
