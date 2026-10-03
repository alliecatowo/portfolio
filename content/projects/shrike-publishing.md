---
title: Shrike Publishing
date: 2025-08-30
demo: https://shrike-publishing.vercel.app
description: "A Nuxt 4 site for Shrike Publishing, a small tabletop RPG studio: Markdown pages anyone on the team can edit, moved off a paid WordPress plan onto Vercel hosting."
featured: false
github: https://github.com/alliecatowo/shrike-publishing
group: earlier-work
image: /images/shrike-publishing/screenshot-2025-10-21-at-00-02-30-blood-neon-shrike-publishing.png
imageAlt: "The Blood Neon game page on the Shrike Publishing site: cover art beside the title, with the game description, price and gallery links below"
seo:
  title: "Shrike Publishing: Nuxt site for an RPG studio"
  description: "A Nuxt 4 site for Shrike Publishing, a small tabletop RPG studio: Markdown pages anyone on the team can edit, moved off a paid WordPress plan onto Vercel hosting."
slug: shrike-publishing
status: draft
tags:
  - nuxt
  - vue
  - cms
  - markdown
  - publishing
  - tabletop
  - rpg
  - vercel
technologies:
  - Nuxt.js
  - Vue.js
  - TypeScript
  - Tailwind CSS
  - Nuxt Content
  - Vercel
---

*A lightweight, modern web platform for a small tabletop game studio.*

## Overview

Shrike Publishing needed a professional, low-maintenance home for their tabletop RPG catalog. Something that looked great, loaded fast, and didn’t bury them in hosting or CMS fees.

So I designed and built a clean site using **Nuxt 4**, **Vue 3**, and **TailwindCSS**, integrated with Nuxt Content for an editor-friendly publishing flow. The result: a website that anyone on their team can update using Markdown, hosted on Vercel.

## Problem

The original website was built on a paid WordPress plan that limited embeds, plugins, and admin control. It was overkill for a small creative studio; they needed something leaner and easier to maintain.

The main goals were:

- Remove dependency on closed hosting or recurring subscriptions.
- Allow non-technical contributors to update pages easily.
- Preserve fast performance and good SEO for product visibility.

## Solution

Shrike Publishing was rebuilt from the ground up with **Nuxt Content Studio** as the headless CMS.

- **Markdown-driven content** for games, news, and product updates.
- **TailwindCSS** for rapid design iteration and consistent theming.
- **TypeScript** for type safety and scalable component patterns.
- **Vercel hosting** with server-side rendering, prerendered static pages, and Studio edits that commit to the repo and redeploy.

Content lives in Markdown files in the repo (queried through Nuxt Content's built-in SQLite), with a small server route for the newsletter signup, so there is no separate CMS or database service to run.

## Impact

- Enabled non-technical staff to manage and publish updates directly via Markdown.
- Simplified long-term maintenance — no CMS plugins or updates to babysit.

## Reflection

Shrike was a reminder that simple tech, done well, can be transformative. It doesn’t take a complicated stack to deliver real value — just clean design, predictable tooling, and empathy for the people who’ll maintain it later.

## Tech Stack

**Nuxt 4**, **Vue 3**, **TypeScript**, **TailwindCSS**, **pnpm**, **Nuxt Content Studio**, **Vercel**
