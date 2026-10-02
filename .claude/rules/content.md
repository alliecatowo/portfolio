---
paths:
  - 'content/**'
  - 'content.config.ts'
  - 'app/components/content/**'
  - 'modules/**'
  - 'scripts/validate-content.ts'
  - 'scripts/format-content.mjs'
  - 'public/images/**'
---

# Content rules

Content lives in `content/` as Markdown with YAML frontmatter. `pnpm validate:content` is the only gate (Nuxt Content v3 turns the zod schemas into SQLite columns but never rejects bad frontmatter), and `pnpm content:format:check` must pass.

## Frontmatter

**Projects** (`content/projects/*.md`):

```yaml
title: string
description: string
date: YYYY-MM-DD
slug: string
status: published | draft
featured: true | false
technologies: [list]
tags: [list]
github: URL (optional)
demo: URL (optional)
devpost: URL (optional)
order: number (optional; ascending, unordered projects sort after by date)
award: string (optional; shown as a badge)
group: string (optional)
image: /path/to/image (optional)
imageAlt: string (optional; alt text for image)
ogImage: /images/og/<slug>.png (optional; 1200x630 share image)
video: {youtube: <id>, title, uploadDate} (optional; a YouTube demo. Drives the VideoObject JSON-LD and the sitemap video entry. Embed it in the body with `::youtube-video{id title}`, a wrapper around @nuxt/scripts ScriptYouTubePlayer that loads nothing from YouTube until click)
seo: { title, description } (optional; search title/description override, aim for ~50-60 / 140-160 chars)
```

**Blog posts** (`content/blog/*.md`):

```yaml
title: string
date: YYYY-MM-DD
description: string
category: dev
tags: [list]
author: Allison Coleman
published: true | false
featured: true | false
slug: string
featured_image: /path/to/image (optional)
ogImage: /path/to/image (optional; falls back to featured_image, then the default OG)
```

**Required for published items** (enforced by `validate:content`, not the zod schemas, so drafts stay flexible): projects need `description`, `date`, `image` + `imageAlt`; blog posts need `description`, `date`, `author`; the shipped description (`seo.description`, else `description`) must be 120-165 characters. Projects with no real capture yet are listed in `IMAGE_EXEMPT` in `scripts/validate-content.ts`; remove a slug there once it has an image.

`validate:content` imports the schemas from `content.config.ts` (via `scripts/nuxt-content-shim.mjs`), `safeParse`s every file, and checks that local image paths exist under `public/`, URL fields have `http(s)://`, body links aren't bare domains, slugs are unique, and no `picsum.photos`/`placehold.co` appears in `content/` or `app/`. Fix the reported `file:field`; don't loosen the validator. Studio can leave empty stubs (e.g. `card: {buttons: []}`) that fail required fields; delete them.

## OG images

`public/images/og/<slug>.png` (1200x630) is picked up by convention for a project whose `slug` matches, even without `ogImage` in frontmatter (`nuxt.config.ts` lists the directory at build time). Files there are referenced by convention, not by content, so don't delete them as "unreferenced". Pages without their own image use `/images/og/default.png` (the avatar card).

## Studio-safe content

Studio writes the stored DB document back to the file, so:

- Never mutate documents in build hooks (`content:file:afterParse`) or add `sitemap`-style columns filled at build time: it gets committed into the Markdown. Do such work at render time (`app/components/content/ProseImg.vue` adds image aspect-ratio/lazy loading from `modules/content-image-sizes.ts`).
- No raw HTML with children in Markdown (a `<video><source>` is turned into a lossy `:video[]`): use an MDC component (`::demo-video{...}` / `app/components/content/DemoVideo.vue`).
- Avoid `:xx:` in prose (a time like `6:32:` followed by text): Studio's editor parser hard-codes remark-emoji and eats the colons (Content's own emoji plugin is off).

`content:format:check` and `content:roundtrip` (after `pnpm generate`) catch these.

## Drafts never ship

Production builds drop draft posts and projects from their collections in `content.config.ts`, because every collection row (body included) is published in `/__nuxt_content/<collection>/sql_dump.txt`. Studio edits from those public dumps, so it can't see drafts; edit drafts locally. Never set `CONTENT_INCLUDE_DRAFTS=true` for the static build.

## Writing project pages

- Only verified facts from the project's repo, README, releases and live demo (local clones are in `/home/allie/develop/<repo>`, and per-project dossiers may exist under `.claude/project-dossiers/`, which is local and never committed). No invented metrics, and no "AI thought leader" tone. Voice: grounded, specific, a little funny.
- Real media only: actual captures of the project, with alt text that describes them.
- Explore the project properly before writing: use the `project-explorer` agent, one per project.
