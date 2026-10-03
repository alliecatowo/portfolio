---
paths:
  - 'app/pages/**'
  - 'app/composables/useSiteSeo.ts'
  - 'app/utils/structuredData.ts'
  - 'app/utils/webmcpTools.ts'
  - 'app/plugins/webmcp*'
  - 'server/routes/**'
  - 'public/.well-known/**'
  - 'scripts/test-webmcp.mjs'
---

# SEO, crawl and WebMCP rules

- **Page metadata**: every page calls `useSiteSeo()` (`app/composables/useSiteSeo.ts`) for title (`Page – Allison Coleman`, suffix skipped if the title already names her or would pass 65 chars), description, canonical (absolute, trailing slash), OpenGraph/Twitter tags and JSON-LD. Shared schema.org nodes (the Person) live in `app/utils/structuredData.ts`. Don't add ad-hoc `useHead` title/meta blocks.
- **Crawl**: `@nuxtjs/robots` + `@nuxtjs/sitemap` generate `/robots.txt` and `/sitemap.xml` from `site` in `nuxt.config.ts` (trailing-slash URLs). Blog and project URLs (published only, `lastmod` from the content date) come from the sitemap source `server/routes/__sitemap__/site-content-urls.json.ts`, not from a `sitemap` column on the collections. `/llms.txt` is generated from content by `server/routes/llms.txt.ts`.
- **WebMCP**: `app/plugins/webmcp.client.ts` feature-detects `document.modelContext` and registers read-only tools at idle (`app/utils/webmcpTools.ts`), reading the prerendered `/webmcp/catalog.json` (`server/routes/webmcp/`) rather than Content's SQLite WASM. The contact `<form>` is a declarative tool (`toolname`/`tooldescription`, no `toolautosubmit`). `public/.well-known/ai-catalog.json` follows the ARD spec (Lighthouse's `ard-schema` audit). Keep these, `/llms.txt` and `pnpm test:webmcp` in sync when tools change.
