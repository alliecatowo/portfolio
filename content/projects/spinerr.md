---
title: Spinerr
slug: spinerr
description: 'An ambient music dashboard built around a generative vinyl record: p5.js grooves seeded per track that pulse with the bass. A one-night prototype that needs some TLC.'
date: 2025-11-04
status: published
featured: false
group: creative-coding
technologies:
  - Next.js
  - React
  - TypeScript
  - p5.js
  - Web Audio API
  - Framer Motion
  - Tailwind CSS
  - Firebase
tags:
  - music
  - generative-art
  - p5js
  - audio-visualization
  - nextjs
  - prototype
github: https://github.com/alliecatowo/spinerr
---

**A record player for a second monitor.**

Spinerr is an ambient dashboard: a spinning vinyl record and player controls on one side, a calendar on the other, meant to sit on a spare screen while music plays. Allison built it in a single night in November 2025 (40 commits). It's a prototype and it reads like one, so this page says what's in the code rather than what it was going to be.

## The record

The record is the interesting part. It's a p5.js sketch that draws concentric groove rings, each nudged in and out by Perlin noise. The noise and random seed come from a hash of the track ID, so every track gets its own consistent pattern and colour. The groove paths are computed once and cached, and then live audio moves them: a Web Audio analyser splits the signal into frequency bands, and a smoothed bass level makes the record swell and glow on kick drums. The tone arm swings in and out with spring animation when playback starts and stops.

## What's around it

The repo has the start of several music sources: SoundCloud search and streaming through Next.js API routes, a Spotify client using PKCE OAuth with the user's own Spotify app credentials, and local files. The README describes the library and calendar as running on mock data, ready for real integrations, and none of the sources have been checked end to end here. There's also Firebase auth and Firestore wiring.

## Status

Needs some TLC. There's no live deployment, the last CI runs failed, and the repo itself needs a cleanup before anyone else clones it. The [source is on GitHub](https://github.com/alliecatowo/spinerr), with no license yet.
