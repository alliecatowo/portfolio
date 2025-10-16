---
title: Why I Reach for Vue Over React
date: 2025-08-30
description: A DX-first take on why Vue’s clarity, SFCs, and composables help me
  ship faster and feel happier than React’s ever-shifting conventions.
category: dev
tags:
  - vue
  - react
  - dx
  - composition-api
  - opinion
author: Allie
published: true
featured: true
featured_image: https://placehold.co/640x360?text=Blog
slug: why-vue-over-react
---

# Why I Reach for Vue Over React

I’ve written a lot of React. It pays the bills, has a huge ecosystem, and there’s almost always a job posting asking for it. But when it’s my call—when I care about how the code reads, how quickly I can build something beautiful, and how calm I feel inside the codebase—I reach for Vue.

## What makes Vue feel better

- Single‑File Components: Templates, logic, and styles living together as a unit fits the way my brain organizes UI. I can jump between parts of a component without losing the thread.
- Composition API: Composables let me model thoughts, not just implementation details. It’s easy to extract logic without turning everything into prop pyramids.
- Clear Conventions: Vue’s defaults are opinionated enough to keep teams aligned, but not stifling. It feels designed rather than assembled.

## Tradeoffs I accept

- React’s ecosystem is bigger and has more hiring demand. That matters. I still choose Vue because the day‑to‑day developer experience is smoother, my components stay smaller, and I make fewer “framework decisions” per file.
- Some React patterns are genuinely great—hooks changed how we think about state. Vue just took that evolution, removed the footguns, and made it ergonomic.

## The outcome

Vue helps me ship faster with fewer regressions and a clearer mental model. The code reads like the UI feels. That alignment is what I’m always optimizing for.

## What I miss from React (and why it’s okay)

- Massive ecosystem momentum. I still tap into it when needed.
- React Server Components are interesting, but the ergonomic cost is real. Nuxt’s hybrid story (SSR/SSG/ISR) feels calmer and more predictable for most work I do.

## Team scale and maintenance

Vue codebases tend to converge around readable patterns. New teammates get up to speed faster because there’s usually “one reasonable way” to do a thing. Over a year, that matters more than the hype cycle.

## Bottom line

When the goal is a beautiful, maintainable product that doesn’t sap my energy, Vue is home.

## Templates vs JSX (and why I care)

JSX is powerful, but I don’t need a programming language to describe markup most days. Vue’s templates keep structure readable while still letting me drop into `<script setup>` when I need logic. I spend less time untangling UI from glue code and more time shaping the experience.

## Composables vs Hooks (the sharp edges I avoid)

Hooks are great until they aren’t—rules of hooks, dependency arrays, and the “why did this render three times?” rabbit hole. Composables feel calmer. They’re functions, they’re explicit, and the reactivity system does the boring parts without surprises.

## Testing and long-term calm

Snapshot tests on templates + unit tests on composables keep me honest. The mental model stays small, and when I come back in three months, everything still reads clean.

## State management that scales with intention

Pinia (and even the Vue reactivity primitives alone) gives me an incremental path. I can start with a local `ref`, lift it into a composable when two components need it, then promote it to a Pinia store when the surface area justifies the extra ceremony. I don’t have to pre‑decide my architecture on day one. The framework lets me right‑size the solution, and that keeps teams moving without ritualistic rewrites.

What I appreciate most: the state reads like data, not magic. When I open a composable, I see a small cluster of signals and derived values—no implicit renders, no invisible subscriptions. That transparency is part of the “calm codebase” feeling that keeps me productive.

## SSR, routing, and the Nuxt effect

Vue on its own is lovely; pairing it with Nuxt turns it into a batteries‑included environment that stays out of the way. File‑based routing, server/data fetching conventions, meta management, and the content module give me the right defaults. I can still drop down to custom endpoints and head tags when I need to, but I rarely do. The combination produces a UX I like building and a codebase I like living in.

When I compare this to React’s shifting ground—RSC debates, data fetching patterns that change every season—it’s clear why I reach for Vue+Nuxt for projects that should stay stable for years. I want dependencies to make my life easier, not add new decisions to every page.

## Migration and team onboarding

Onboarding people to Vue tends to be quick: the template syntax is readable, the component boundaries are obvious, and the Composition API feels like a gentle on‑ramp to functional patterns. In migration projects, we often start by wrapping legacy logic into composables and replacing leaf components first. The payoff is immediate: smaller components, clearer responsibilities, fewer “why is this re‑rendering?” conversations.

## Pitfalls I still watch for

- Over‑using global stores when a composable would do.
- Packing too much into a single component because SFCs are convenient.
- Ignoring accessibility just because the component library looks good (design still needs intent).

None of these are unique to Vue, but naming them helps me keep quality high.

## A tiny case study: making content feel alive

This site is a good example of Vue’s ergonomics in the real world. I can express ideas quickly—new sections are folders, metadata is frontmatter, and the UI is a handful of well‑factored components. When I wanted reading time on posts, it was a single remark plugin + a few labels. When I wanted to switch focus from code‑heavy tutorials to narrative writing, I didn’t need to rip anything out—I just changed the content and the page components did the rest.

That’s the kind of developer experience that keeps me coming back to Vue.

## From idea to deploy in 48 hours (a real sprint)

I like stress‑testing frameworks by giving myself a ruthless constraint: two days to take a rough idea to something I can share. The brief: a narrative‑first personal site that feels like me, not a theme. Day 1 was structure and bones; day 2 was polish and details.

What made it work:

- File‑based routing: I sculpted the site by moving files and folders, not wiring configs.
- Nuxt Content: Writing in Markdown kept me in flow. I could sketch, cut, and move sections like sticky notes.
- Composables: I extracted small pieces of logic (site config, reading time, filters) and reused them without pulling in a global store too early.
- Nuxt UI: It gave me accessible components that looked good out of the box without feeling generic.

The result wasn’t perfect—but it was alive. Vue didn’t ask me to argue with it. It let me think with my hands.

## Complex forms, calm state

Every stack can build forms. Not every stack stays pleasant when the form has real rules: conditional sections, server‑side validation, optimistic UI, and partial saves. My approach in Vue is composable‑first:

- Use local `ref`s for field state and validation messages.
- Lift cross‑field relationships into a composable (`useFormModel`) where I can test them in isolation.
- Keep server interaction in a tiny service layer—no component imports `fetch`.
- When multiple pages need the same form state (wizard flows), promote to a Pinia store that mirrors the composable’s API.

What I avoid: throwing global state at everything. Vue makes small state feel ergonomic, so I stay small until the data asks me to grow.

## Team rituals that stick

Vue’s clarity bleeds into team habits:

- Pull requests stay smaller because it’s easy to extract a composable early.
- Code reviews focus on UX and architecture instead of reactivity footguns.
- Onboarding time drops—new teammates can read the template first, then dip into logic as needed.

We keep a few lightweight rules:

- One responsibility per component—or name the exceptions.
- If a component grows past 150–200 lines of non‑template code, a composable probably wants to be born.
- Snapshots for templates, targeted tests for logic; no golden‑file churn.

## What a day in the editor feels like

There’s a physical sensation to a good dev loop. With Vue+Nuxt, I experience fewer jarring context switches. I edit a template and instantly see the change; I move logic into a composable and the type system follows; I add content and the route appears. The loop is short, and short loops make better software.

## Migration diary (React → Vue)

When I migrate an app, I don’t rewrite—I reduce surface area first.

1. Identify three pain points in the current UI (usually state tangles and rendering quirks).
2. Rebuild just those screens in Vue, one by one, behind a feature flag.
3. Translate shared logic into composables, leaving escape hatches for edge cases.
4. Mirror the routing structure so URLs don’t change; preserve muscle memory.

By week two, the team usually reports “this is easier to reason about”—and that’s the signal I’m always chasing.

## Closing thought

Frameworks should feel like instruments. Vue sings back when I play it. That matters more to me than trends or job postings. It keeps me shipping and keeps the work joyful.
