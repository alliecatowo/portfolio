---
title: GitHub Stories
description: "24-hour Stories for GitHub: rings on avatars via a browser extension, and a gh CLI that draws them (video too) right in your terminal."
slug: gh-stories
date: 2026-09-13
status: published
featured: true
order: 6
group: social-systems
technologies:
  - Go
  - Bubble Tea
  - TypeScript
  - React
  - WXT
  - PostgreSQL
  - ffmpeg
  - Kitty graphics protocol
tags:
  - browser-extension
  - github-cli
  - tui
  - terminal-graphics
  - social
  - go
  - open-source
github: https://github.com/alliecatowo/gh-stories
image: /images/projects/gh-stories/card.webp
imageAlt: 'GitHub Stories landing page: "Stories for GitHub. Yes, those Stories.", with links to the demo, extension and CLI.'
seo:
  title: "GitHub Stories: 24-hour Stories for GitHub"
  description: "24-hour Stories for GitHub: rings on avatars via a browser extension, and a gh CLI that draws them (video too) right in your terminal."
---

**Stories for GitHub. Yes, those Stories.**

GitHub already has avatars, follows and a dashboard. So why not a ring around your reviewer's face that opens the video they took at a concert last night, and the same video playing inside your terminal? GitHub Stories is a deliberately absurd idea built with complete seriousness: 24-hour photo and video Stories for GitHub, in the browser and in the terminal. It's an independent project and isn't affiliated with GitHub.

![The GitHub Stories browser extension playing a concert Story over a pull request (fictional sample page and accounts).](/images/projects/gh-stories/extension-viewer.webp)

![The same kind of Story drawn as real pixels inside the kitty terminal by gh stories, with caption and key hints.](/images/projects/gh-stories/terminal-story.webp)

*Real captures of the extension and the CLI. The pull request page and accounts are fictional fixtures, and the photos are generated artwork.*

## Three pieces, one Story

A **browser extension** (Manifest V3, built with WXT and React 19) draws the familiar gradient ring around avatars on pull requests, issues, profiles and the dashboard. Click one and the Story plays over the page; close it and you're back in the code review. It also has a composer with crop presets, captions, alt text and an audience picker, and a toolbar popup that keeps working if GitHub's page changes under it.

A **`gh` CLI extension** written in Go with Bubble Tea shows the same Stories in a full-screen terminal UI. It draws actual pixels with the Kitty graphics protocol (iTerm2 inline images are implemented but not visually verified), plays video inline in kitty, and falls back to coloured half-block art or an honest "open it in your browser" box elsewhere.

Both talk to one **Go service** backed by PostgreSQL, S3-compatible storage and an ffmpeg media worker. It handles GitHub OAuth with PKCE, importing your GitHub follows, five audience levels, replies, reactions, viewer lists, moderation and per-item 24-hour expiry.

## The engineering behind a joke

**One visibility rule, in one place.** Whether a viewer may see a Story is decided by a single SQL predicate: published, not expired, author not suspended, no block in either direction, and the audience checked against the *current* follow graph. Every read path uses it: the feed, the rings, the media gateway, viewers, replies and reactions. As the code comment puts it, "A new route cannot accidentally skip a rule, because there is no second place to skip it in." Expiry is enforced on read, so a stalled cleanup job can't bring a Story back.

**Video in a terminal.** Getting kitty to animate frames took four fixes the spec doesn't spell out, and the working sequence was recovered by capturing what `kitty +kitten icat` itself emits for an animated GIF. Frames have to arrive as files, which is also why inline video can't work over SSH.

![Two moments of a Story video playing inline in kitty; the progress bar advances between frames.](/images/projects/gh-stories/terminal-video-a.webp)

**Load it into a real browser and look.** CI loads the extension into a real Chromium, and doing that turned up six bugs no unit test had caught. Among them: a missing permission that stopped the service worker from ever starting, a Story ring drawn as a filled disc, and image data silently turning into `{}` when sent through the extension's JSON messaging.

It also treats uploads and captions as hostile. Image dimensions are checked from the header before decoding, so a 65-byte PNG claiming to be 30000×30000 is rejected for free, and terminal escape sequences are stripped from captions and usernames so a Story can't inject control codes into your shell.

![In terminals without graphics support, gh stories shows the image's size and alt text and offers to open it in the browser.](/images/projects/gh-stories/terminal-fallback.webp)

## Status

It went from first commit to v0.1.0 in a single day (September 13, 2026), and v0.5.3 shipped on September 16. MIT licensed. Both clients install today: the CLI with `gh extension install alliecatowo/gh-stories`, and the extension as a side-loaded build from the [releases page](https://github.com/alliecatowo/gh-stories/releases/latest), since it isn't in any extension store.

**There's no public service running**, so real use means [self-hosting](https://alliecatowo.github.io/gh-stories/docs/self-hosting/) the backend: a container, PostgreSQL, an S3-compatible bucket and a GitHub OAuth app. To see it without any setup, open the [demo with sample data](https://alliecatowo.github.io/gh-stories/demo/), which runs entirely in the browser with fictional accounts.

![The GitHub Stories demo viewer playing a sample concert Story from the fictional account otterframes.](/images/projects/gh-stories/demo-viewer.webp)
