---
title: Spinerr
date: 2025-11-04
demo: https://spinerr-app.web.app
description: "An ambient music dashboard built around a generative vinyl record: p5.js grooves seeded per track that pulse with the bass. A one-night prototype that needs some TLC."
featured: false
github: https://github.com/alliecatowo/spinerr
group: creative-coding
image: /images/projects/spinerr/card.webp
imageAlt: "Spinerr playing a local test track: a green generative vinyl record with the tone arm down, a large clock, the track title and progress bar, and two sample calendar events."
seo:
  description: "An ambient music dashboard built around a generative vinyl record: p5.js grooves seeded per track that pulse with the bass. A one-night prototype."
  title: Spinerr
slug: spinerr
status: published
tags:
  - music
  - generative-art
  - p5js
  - audio-visualization
  - nextjs
  - prototype
technologies:
  - Next.js
  - React
  - TypeScript
  - p5.js
  - Web Audio API
  - Framer Motion
  - Tailwind CSS
  - Firebase
---

**A record player for a second monitor.**

Spinerr is an ambient dashboard: a spinning vinyl record and player controls on one side, a calendar on the other, meant to sit on a spare screen while music plays. Allison built it in a single night in November 2025 (40 commits). It's a prototype and it reads like one, so this page says what's in the code rather than what it was going to be.

## The record

The record is the interesting part. It's a p5.js sketch that draws concentric groove rings, each nudged in and out by Perlin noise. The noise and random seed come from a hash of the track ID, so every track gets its own consistent pattern and colour. The groove paths are computed once and cached, and then live audio moves them: a Web Audio analyser splits the signal into frequency bands, and a smoothed bass level makes the record swell and glow on kick drums. The tone arm swings in and out with spring animation when playback starts and stops.

::demo-video
---
height: 750
width: 1200
alt: "An 8 second screen recording of the deployed Spinerr app playing a
  synthetic test track: the green generative vinyl record spins with the tone
  arm down and its grooves pulse on each bass kick, beside a clock, the track
  title and a progress bar."
mp4: /images/projects/spinerr/demo.mp4
poster: /images/projects/spinerr/demo-poster.webp
webm: /images/projects/spinerr/demo.webm
---
::

*Recorded on the live site with a generated test track (a 2 Hz sine kick plus a tone, cover art embedded) picked through "Play Local Files". The grooves swell on every kick. The calendar entries are sample data.*

![Spinerr on a desktop screen: a sidebar with navigation, a green generative vinyl record with the tone arm resting on it, a large clock reading 10:24 PM, the now-playing title "test-beat" with a progress bar and player controls, and two sample calendar events.](/images/projects/spinerr/player-1440.webp)

*The deployed app playing a short test file from disk. The calendar entries are sample data.*

![The same record on a 375 pixel wide phone screen, filling the width with blue grooves and the tone arm down, with the sidebar collapsed.](/images/projects/spinerr/player-375.webp)

*On a phone-width screen the sidebar collapses and the record takes the whole width. Each track gets its own groove pattern and colour, which is why this one is blue and the one above is green.*

## Try it

The p5.js vinyl version is now on `main` and deployed as a static site at [spinerr-app.web.app](https://spinerr-app.web.app). Use "Play Local Files" in the sidebar and pick audio files from your own machine. That path works, and it's what the record reacts to.

## What's around it

The repo has the start of several music sources: SoundCloud search and streaming through Next.js API routes, a Spotify client using PKCE OAuth with the user's own Spotify app credentials, and local files. The static build has no server, so SoundCloud and Spotify streaming don't work on the deployed site; only local files do. The README describes the library and calendar as running on mock data, ready for real integrations. There's also Firebase auth and Firestore wiring.

## Status

Still a prototype, but it runs now. The repo was cleaned up (node\_modules untracked, a commercial MP3 and a debug log removed, the build fixed) and the vinyl player was revived with local playback and a static Firebase deploy. The [source is on GitHub](https://github.com/alliecatowo/spinerr), with no license yet.
