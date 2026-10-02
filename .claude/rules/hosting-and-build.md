---
paths:
  - 'nuxt.config.ts'
  - 'firebase.json'
  - '.github/**'
  - 'server/**'
  - 'STUDIO.md'
  - 'scripts/studio-runtime.mjs'
  - 'scripts/prepare-studio-function.mjs'
---

# Hosting, build and security rules

- **Nuxt Studio**: self-hosted module (`nuxt-studio` 1.7.0). In production, `firebase.json` rewrites `/_studio`, `/__nuxt_studio/**` and `/sw.js` to the `studio` Cloud Function (built with `NITRO_PRESET=firebase` into `.output-studio/`); everything else is static. How it works (the `__session` cookie workaround, secrets, OAuth callback, one-time GCP setup, costs): `STUDIO.md`. `experimental.appManifest` must stay on: Studio's activation calls `getAppManifest()`.
- **Pre-rendering**: every public page is pre-rendered (`routeRules '/**'`); Studio routes never are. ISR is disabled.
- **SQLite**: Node's native SQLite (`experimental.sqliteConnector: 'native'`).
- **404s**: Firebase serves the generated `404.html` (no SPA catch-all rewrite), so unknown and draft URLs return a real 404. Nuxt renders `/404.html` itself with SSR off (an empty shell), so the hidden `/not-found-shell/` page is prerendered with the real error content and a `prerender:done` hook in `nuxt.config.ts` copies its HTML over `404.html` and deletes the shell folder.
- **Security headers / CSP**: `firebase.json` sends HSTS, COOP, `X-Frame-Options`, nosniff, Referrer-Policy, Permissions-Policy and a Content-Security-Policy on documents only (`**/` and `**/*.html`; sending them on every asset costs ~1.4 KB per response). The header CSP deliberately has no `script-src`/`default-src`: the inline scripts Nuxt emits change every build, so the `prerender:generate` hook in `nuxt.config.ts` adds a `<meta http-equiv="Content-Security-Policy">` to each page with `script-src` plus the SHA-256 of that page's inline scripts (and `script-src-attr 'unsafe-hashes'` for NuxtImg's `onerror`). The two policies are intersected, so a header `script-src` would block the hashed scripts. New third-party hosts (scripts, frames, images, `connect-src`) must be added to the header or `SCRIPT_SRC_HOSTS`. Nuxt Studio's editor mounts on the public pages once you are signed in (it imports its code editor from `esm.sh` and calls `api.github.com`), so those hosts are allowed site-wide.
- **Hosting `ignore`** in `firebase.json` must keep allowing `.well-known` (the ARD catalog).
- **Deploys**: production deploys on every push to `main` (static site plus the `studio` function); staging is manual `workflow_dispatch`; PRs get a temporary preview channel.
- **Internal links** use the trailing-slash form (`/about/`, `/projects/<slug>/`); Firebase redirects the bare form. `pnpm serve:static` reproduces that, the redirects, headers and 404 without the emulator.
