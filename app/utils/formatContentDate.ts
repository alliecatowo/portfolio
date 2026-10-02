/**
 * Format a content date (e.g. `2025-08-30` from frontmatter) for display.
 *
 * Date-only strings parse as UTC midnight. Formatting them in the viewer's
 * local time zone shows the previous day west of UTC and makes the
 * prerendered HTML (built in UTC on CI) disagree with the client render,
 * which causes a hydration mismatch. Always format in UTC.
 */
// Building an Intl.DateTimeFormat is slow (milliseconds each, several times that on a throttled phone),
// and a post page formats a handful of dates, so build one per option set.
const formatters = new Map<string, Intl.DateTimeFormat>()

export function formatContentDate(
  value: string | Date | undefined | null,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  const key = JSON.stringify(options)
  let formatter = formatters.get(key)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' })
    formatters.set(key, formatter)
  }
  return formatter.format(date)
}
