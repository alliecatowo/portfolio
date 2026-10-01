---
title: Patches
date: 2026-08-17
description: "A chronological social network you use from the terminal: Ink/React TUI, web PWA peer, E2EE DMs, federation lab, and user-side moderation."
featured: true
github: https://github.com/alliecatowo/patches
group: social-systems
image: /images/projects/patches/card.webp
imageAlt: "The Patches terminal client: a chronological home feed of three posts, connected to patches-social.fly.dev, with keyboard hints."
order: 3
seo:
  title: "Patches: a social network for your terminal"
  description: "A chronological social network you use from the terminal: Ink/React TUI, web PWA peer, E2EE DMs, federation lab, and user-side moderation."
slug: patches
status: published
tags:
  - social-media
  - terminal
  - tui
  - e2ee
  - federation
  - open-source
  - full-stack
technologies:
  - TypeScript
  - Ink
  - React
  - NestJS
  - gRPC / Protobuf
  - PostgreSQL
  - ActivityPub
  - Fly.io
---

**Terminal-native social media: chronological, open source, and no ranking algorithm.**

Patches is a social network whose main client is a terminal app. The feed is the posts in the order they were written. There are no votes, no karma, no ads and no engagement ranking. The README promises "there is no `rankHomeFeed()` in this codebase and there never will be", and the code keeps that promise: the only feed ordering in the server is `createdAt DESC`. The principle behind it is short: "The server gives you your social world; the client decides how to arrange it."

<video class="w-full h-auto rounded-lg" width="1260" height="896" autoplay muted loop playsinline poster="/images/projects/patches/hero-poster.webp" aria-label="Patches terminal client: a chronological home feed, opening a thread, and typing a reply, all keyboard-driven.">
  <source src="/images/projects/patches/hero.webm" type="video/webm">
  <source src="/images/projects/patches/hero.mp4" type="video/mp4">
</video>

_Recorded against the live node: the home feed, opening a thread, and replying from the keyboard._

## Two clients, one protocol

The terminal client, `patches`, is built with Ink 7 and React 19. It's keyboard-driven (`j`/`k`, `c` to compose, `/` to search), logs in with a password or an SSH key, and draws inline images through the Kitty graphics protocol in Kitty and Ghostty, falling back to plain text everywhere else. There's also a plain mode that strips the decoration.

The web client is a full peer rather than a mirror: a Vite and React 19 installable PWA with seven themes, passkey sign-in and GitHub device login. Both clients speak one versioned `patches.v1` protobuf API, served by a NestJS modular monolith over gRPC for the terminal and Connect for the browser, with Buf breaking-change checks in CI.

![Patches TUI profile for @allie showing post, follower and following counts above her posts.](/images/projects/patches/tui-profile.webp)

<video class="w-full h-auto rounded-lg" width="1260" height="896" autoplay muted loop playsinline poster="/images/projects/patches/compose-poster.webp" aria-label="Composing a new post in the Patches terminal client with a 5000-character counter.">
  <source src="/images/projects/patches/compose.webm" type="video/webm">
  <source src="/images/projects/patches/compose.mp4" type="video/mp4">
</video>

![Patches web client in light theme: sidebar navigation and a chronological Home feed with one post.](/images/projects/patches/web-home.webp)

## More than a feed

Reposts and quotes, tags, communities, flair, pinned posts, walls and edit history are all in. Every person also gets a **Page**: a portable, declarative JSON document. The constraint behind that design is that a terminal can't render HTML, and visiting someone's page must never run their code, so both clients render the same data their own way (`patches visit @handle` in the terminal).

Moderation is mostly in the reader's hands: personal filters, subscribable filter lists, labelers, appeals and a public, anonymized moderation log, with an admin CLI for the node's own enforcement underneath.

## Messaging, and what's not done

Direct messages use Signal-style end-to-end encryption: per-device identities under a messaging root key, a root-signed device roster hash chain that the node can't quietly rewrite, a Double Ratchet with encrypted headers, and franking so an abuse report still carries verifiable evidence even though the node can't read messages. A send has to target exactly the recipients' active devices or the node rejects it. A Postgres trigger makes a conversation's security mode immutable, so nothing can be downgraded to plaintext. It's implemented and tested, and it is **not independently audited**; the project's own ship-gate table marks that audit as not done.

![Patches web Messages screen in dark theme, marked end-to-end encrypted, explaining the node sees who you message and when but never what you say.](/images/projects/patches/web-messages-dark.webp)

_The web Messages screen, captured from the project's lab harness rather than the live node._

Federation is built as a seam first. By default the server's federation gateway is a no-op. Inside a local two-node lab it becomes ActivityPub: WebFinger, inbox and outbox, HTTP Signatures, SSRF and DNS-rebinding defenses, and durable delivery. DMs never cross it, and a test proves the encryption module can't even resolve the federation gateway. The flagship node doesn't federate yet, and Mastodon interop is on the roadmap, not shipped.

## How it was built

Allison built Patches solo, with a documented AI-agent harness, in about two weeks: 879 commits and roughly 470 pull requests between August 17 and September 1, 2026. It has 40 architecture decision records, scripted VHS recordings and Playwright screenshots so the media can't drift, golden-frame tests for the terminal UI, and EvoMaster contract fuzzing.

## Try it

The live node on Fly.io is **invite-only**, so a visitor without a code only gets as far as the sign-in screen. The [docs site](https://patches-site.pages.dev) is open to everyone, and the MIT-licensed source runs locally with `mise run setup && mise run server && mise run tui`. Six alpha pre-releases of the terminal client are on the [releases page](https://github.com/alliecatowo/patches/releases).

![Patches web sign-in with password, passkey, GitHub, and approve-from-terminal options.](/images/projects/patches/web-login.webp)
