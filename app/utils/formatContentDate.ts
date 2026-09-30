/**
 * Format a content date (e.g. `2025-08-30` from frontmatter) for display.
 *
 * Date-only strings parse as UTC midnight. Formatting them in the viewer's
 * local time zone shows the previous day west of UTC and makes the
 * prerendered HTML (built in UTC on CI) disagree with the client render,
 * which causes a hydration mismatch. Always format in UTC.
 */
export function formatContentDate(
  value: string | Date | undefined | null,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(date)
}
