// Lazy hydration (`hydrate-on-visible`, `hydrate-on-interaction`) only makes sense while hydrating
// server-rendered HTML: it keeps the first hydration task short. On a client-side navigation there
// is no server HTML, so deferring the component just renders it empty until its trigger fires and
// then pops the content in, which shifts everything below it. Components pick the lazy-hydrated or
// the plain variant with this flag; it is the same value on the server and during hydration, so
// the markup matches.
export function useHydrateLazily(): boolean {
  return import.meta.server || !!useNuxtApp().isHydrating
}
