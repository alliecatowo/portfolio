---
title: 'Why Nuxt Content Is Perfect for My Portfolio'
date: '2025-08-30'
description: 'Git-first publishing, zero external CMS, and a workflow that keeps writing and shipping right next to the code.'
category: 'dev'
tags: ['nuxt', 'nuxt-content', 'portfolio', 'cms', 'dx']
author: 'Allie'
published: true
featured: true
featured_image: 'https://placehold.co/640x360?text=Blog'
slug: 'nuxt-content-perfect-for-portfolio'
---

# Why Nuxt Content Is Perfect for My Portfolio

I migrated away from a headless CMS because I wanted fewer moving parts, more reliability, and a writing workflow as fast as my dev workflow. Nuxt Content nails it.

## What I get

- Git‑based content: My posts, projects, and updates live in the repo. Branch, PR, review, merge, publish. No fragile dashboards, no vendor downtime.
- Local-first speed: No network calls to fetch my own words. Content ships pre‑processed and SEO‑friendly.
- One stack to rule it: Same tooling, same deployments, fewer “where did that setting live?” moments.

## Why it fits a portfolio site

- Writing in Markdown keeps the focus on the story, not the syntax. I can tweak frontmatter for metadata and keep code samples to a minimum.
- It scales with me: new sections are just folders and conventions, not migrations and dashboards.
- I can model “Projects” and “Posts” exactly how I use them—with fields that make sense for my work.

Nuxt Content makes my site feel like a studio notebook: organized, fast, and always ready for the next idea.

## The writing flow I actually use

1. Branch: Write in Markdown, tweak frontmatter.
2. Preview: Local dev shows the real page and meta.
3. Polish: Titles, tags, images, done.
4. Merge: Ship with the code.

No context switches, no brittle webforms, no “did I save?” anxiety.

## Search, tags, and taxonomy that match my brain

I like light structure: folders for big buckets (dev/tattoo), tags for nuance, and a search that prefers recent, featured work. Nuxt Content’s query layer gives me that without a separate database.

## Images without drama

I keep images in `public/`, add alt text in frontmatter when it matters, and let the UI layer handle responsiveness. When I need more, Nuxt Image is one import away.

## How I structure content for longevity

I’m designing this portfolio to grow with me, not trap me. That means:

- Predictable, boring folder names: `blog/dev`, `blog/tattoo`, `projects/`.
- Frontmatter fields that reflect how I talk about my work (not what a CMS thinks posts should look like).
- Minimal custom logic—let convention do the heavy lifting.

If I ever change my mind, a few refactors and the site follows. It’s a notebook, not a database.

## Publishing and review without ceremony

I treat content like code. I can draft a long form essay, open a PR to myself, read it with fresh eyes, and merge when it feels right. If friends or collaborators want to weigh in, they can leave comments inline. No new tools to learn, no account provisioning, no “permission systems” to configure.

## URL stability and SEO without angst

Because content lives alongside routing, URL structures are transparent. Slugs exist in frontmatter, but they’re also implied by folders. Nuxt’s meta utilities make it easy to set canonical tags, titles, and descriptions from the same source of truth. I don’t need an SEO plugin to do sensible things; I just write clear metadata.

## When I still reach for external services

I’ll happily use a hosted image CDN if I’m shipping lots of large art assets, or a headless CMS if a team with non‑technical contributors needs to move quickly. The point isn’t to avoid tools—it’s to pick the simplest thing that preserves momentum and reduces failure modes. For a personal site, Nuxt Content is the sweet spot.

## A few gotchas (and how I handle them)

- Image sizes matter: I export sensible resolutions up front and rely on lazy loading.
- Internal links drift: I run simple link checks as part of CI to catch rot early.
- Tag bloat: I prune and consolidate tags quarterly so discovery stays useful.

## FAQ

Q: What about drafts?
A: I use a `published: false` flag and preview them locally. When ready, flip the switch.

Q: What about backups?
A: Git. Everything is versioned. If I need off‑site backups, my Git provider already does that.

Q: What about search?
A: The content query layer is enough for scope and tags. If I ever need full‑text search across thousands of posts, I can add an index later without changing how I write.

In short: Nuxt Content keeps the creative loop short and the surface area small. That’s perfect for a portfolio where the point is the work, not the plumbing.

## A migration story, day by day

Day 1 — Inventory and intent

- Exported content from the old stack into Markdown files with frontmatter that matched how I talk about projects: title, description, date, tags, featured, and a simple slug.
- Sketched a folder map on paper. If a human can find it, a computer can index it. That’s the test.

Day 2 — Skeleton and routes

- Laid out `/dev`, `/tattoo`, and shared blog routes. Nuxt’s file‑based routing made the site feel tangible quickly.
- Dropped in a few list views that query content by category. I care about stories; the UI should reflect that.

Day 3 — Content shape and taxonomy

- Wrote down a tiny style guide for frontmatter: keep descriptions under 160 chars, tags should be nouns, titles should read like a headline.
- Added a content schema (zod) so the build tells me when I drift.

Day 4 — Details that compound

- Reading time via a remark plugin. Search that prefers recent content. Featured flags for home.
- Wrote a handful of posts to test narrative flow. If writing feels slow, the system’s wrong.

Day 5 — Performance and polish

- Trimmed images, lazy‑loaded lists, and let ISR handle the rest. The trick is to be boring and predictable; the site gets fast as a side effect.

## Governance without paperwork

I like simple content governance:

- Intentional drafts: `published: false` and a local preview route.
- Postmortems when I unpublish: Why? Did it drift? Do I need a successor?
- Quarterly content prune: delete or consolidate tags, fix dead links, refresh screenshots.

It’s enough structure to keep quality high without turning a portfolio into a job.

## Performance and caching (that you feel, not measure)

I use three layers of “don’t think about it” performance:

- Static generation/ISR for content routes so posts stay quick even under load.
- Browser‑level caching for images and assets with sane headers.
- Minimal JavaScript on content pages; let the story load before any flourish does.

The experience should feel instant even on a weak connection. That’s the bar.

## Internationalization and accessibility

I keep i18n simple until it isn’t: tags and titles stay English for now, content can grow translations by folder later. Accessibility isn’t negotiable—headings are semantic, links are descriptive, and components ship with keyboard and screen reader support.

## Why this matters to me

I want a portfolio that feels like a studio: approachable, evolving, and honest about the craft. Nuxt Content keeps me close to the words and the work. Everything else is supportive detail.
