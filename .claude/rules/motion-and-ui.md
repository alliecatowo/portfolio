---
paths:
  - 'app/assets/css/**'
  - 'app/components/**'
  - 'app/layouts/**'
  - 'app/app.vue'
---

# Motion and UI rules

- Decorative animation is compositor-only (`transform`/`opacity`, never `background-position` or `box-shadow`; Lighthouse flags those as non-composited).
- `.text-gradient-animated` clips text with `-webkit-mask-clip: text` and slides a `::before` gradient layer; `.bg-gradient-animated` slides an oversized `::before` wash under a `::after` dots layer.
- Both stop under `prefers-reduced-motion` and the in-page reduced-motion toggle (`app/assets/css/accessibility.css`).
- UI is `@nuxt/ui` v4 + Tailwind CSS v4; load the `nuxt-ui` skill before building with its components.
- Navigation, scroll and layout-shift changes are checked with `pnpm measure:nav` (see CLAUDE.md "Agent workflow"), and every UI change is checked at 375/768/1440 in a real browser (`verify-site`).
