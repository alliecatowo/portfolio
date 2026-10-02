/**
 * Click handler for a "Back to <list>" link. When the previous history entry is that list, go back
 * instead of pushing a fresh visit, so the list keeps its scroll position and query (?group=).
 * Anywhere else (a deep link, another site, a search result) the link navigates to the list as usual.
 */
export function useBackToList(listPath: string) {
  const router = useRouter()
  const trim = (path: string) => path.replace(/\/$/, '')

  return (event?: Event) => {
    if (!import.meta.client) return
    const click = event as MouseEvent | undefined
    // Leave modified clicks (open in new tab, etc.) to the browser
    if (click && (click.button !== 0 || click.metaKey || click.ctrlKey || click.shiftKey || click.altKey)) return
    const back = (window.history.state as { back?: string | null } | null)?.back
    if (typeof back !== 'string') return
    if (trim(back.split(/[?#]/)[0]!) !== trim(listPath)) return
    event?.preventDefault()
    router.back()
  }
}
