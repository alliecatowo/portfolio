/**
 * Nuxt's view-transition plugin (experimental.viewTransition) starts a
 * transition on every page change but never handles the promises on the
 * ViewTransition object. Chrome rejects `ready` (and sometimes `finished` /
 * `updateCallbackDone`) whenever a transition can't run:
 *   - "InvalidStateError: Transition was aborted because of invalid state"
 *     when the document is hidden (background tab) during navigation
 *   - "AbortError: Transition was skipped" when a second navigation starts
 *     before the first transition finished
 * The navigation itself still completes; only the animation is dropped. The
 * unhandled rejections just surface as uncaught console errors, so mark them
 * handled here.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const ignore = () => {}
  nuxtApp.hook('page:view-transition:start', (transition) => {
    transition.ready.catch(ignore)
    transition.finished.catch(ignore)
    transition.updateCallbackDone.catch(ignore)
  })
})
