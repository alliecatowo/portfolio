---
title: AFTERLIFE
date: 2026-09-07
demo: https://alliecatowo.github.io/afterlife/
description: "Conway's Life with a time machine: scrub history, fork alternate futures, sculpt time in 3D, and play in deterministic lockstep across tabs."
featured: true
github: https://github.com/alliecatowo/afterlife
group: creative-coding
image: /images/projects/afterlife/card.webp
imageAlt: "AFTERLIFE's Time Sculpture: 165 recorded generations of the opening scene stacked in 3D, with each glider's path showing as an inclined beam."
seo:
  title: "AFTERLIFE: Conway's Life with a time machine"
  description: "Conway's Life with a time machine: scrub history, fork alternate futures, sculpt time in 3D, and play in deterministic lockstep across tabs."
slug: afterlife
status: published
tags:
  - simulation
  - cellular-automata
  - game-of-life
  - generative-art
  - multiplayer
  - browser
technologies:
  - TypeScript
  - React
  - three.js
  - Canvas 2D
  - Web Audio
  - Web MIDI
  - Vite
  - Playwright
---

**Every future leaves a trace.**

Everyone knows Conway's Game of Life. AFTERLIFE runs exactly that rule, standard B3/S23 on a 256×160 torus, but it doesn't care how fast it can go. It asks what happens if you touch one cell. The whole interface is organised around time: the world's full history sits in a ribbon along the bottom, you can scrub it in either direction, and editing the past forks a new future instead of overwriting the old one. Its own guide puts it best: "It's not a simulator. It's an observatory with a time machine."

It runs in the browser with no account and no install. [Open it and touch the world](https://alliecatowo.github.io/afterlife/).

![AFTERLIFE in its dark theme with the Lineage lens: gliders streaming from the top left, multicoloured still lifes and oscillators on the right, and two populations meeting under a First contact annotation at generation 164.](/images/projects/afterlife/lineage-first-contact.webp)

*The opening scene a few seconds in, captured from the live app. The two populations meet at generation 123, and the app marks the spot.*

## Time as a material

The history ribbon is the real record, not a recording. AFTERLIFE keeps a keyframe every 64 generations plus the edits you made, so jumping to any generation restores the nearest keyframe and replays forward bit-exactly. Generation 4,000 really is generation 4,000.

Edit a cell in the past and the future **forks**. The original timeline keeps going on its own branch (up to eight branches, least recently used evicted first, except ones you've named), and a compare view diffs the two cell by cell. Saves now keep the forks and the Field Guide, so reopening a world brings the alternate futures back. The exception is a very long session whose history window has slid: then only the branch you were on is saved, as the root. Branching only copies pointers to the parent's keyframes, so a "what if" is cheap. The "One Cell" experiment makes the point: flip one cell in the opening scene and the world is dead by generation 54, where the untouched timeline grows to a population of 221.

Then there's the **Time Sculpture**. Select a stretch of the world and AFTERLIFE lifts its recorded generations into a 3D stack you can orbit and slice. Time becomes the third axis, so still lifes turn into columns and gliders turn into inclined beams.

![The Time Sculpture orbited to one side: glider paths cross as long diagonal beams through 165 stacked generations.](/images/projects/afterlife/time-sculpture-side.webp)

*Captured from the live app: the same 165 generations as the image at the top of the page, orbited to the side.*

## The rest of the observatory

- **Lineage colour.** In the default lens, a newborn cell takes the circular mean of its three parents' hues, so populations visibly interbreed where they meet. Colour rides along after the alive-or-dead decision, and a test poisons the colour state to prove the live cells stay byte-identical. There are eight lenses in all.
- **Acid Art.** A glyph mode that draws cells as characters from a JetBrains Mono atlas, modulated by noise, plasma, an image, a video or your webcam.
- **Rules and specimens.** Ten Life-like rule presets plus any custom B/S rulestring, RLE import, a Field Guide that recognises specimens as they appear, and three scored experiments.
- **Sound.** A generative WebAudio soundscape driven by how much the world is changing, so it decays to real silence when the world is still, plus Web MIDI out with a panic button.
- **Share links.** "Copy share link" in the Save panel puts the pattern and its rule in the URL hash (`#w=…`), and whoever opens the link lands on the same world. It shares your selection if you have one, otherwise the whole world, and links are capped at 6,000 characters; larger patterns are refused and have to go out as RLE or JSON.
- **Export.** GIF, WebM, PNG and WAV, rendered from an independent offline replay rather than the live screen, so frame pacing is exact. The GIF encoder (median-cut quantiser, LZW and GIF89a writer) is hand-written and checked against Chromium's own decoder.

## Multiplayer with no server

Multiplayer is opt-in and works across browser tabs today. Each edit is stamped 12 generations ahead and applied by every peer in the same `(targetGen, peerId, seq)` order, so nobody is authoritative and every world stays identical. Peers on different rules refuse to connect. If an edit hasn't arrived, the simulation stalls rather than guesses, and every 64 generations peers compare hashes of the world to catch any drift. A WebSocket transport is written, but no relay is deployed, so it's tabs-only for now.

## How it was built

AFTERLIFE went from first commit to v1.3.0 in about three days (7 to 9 September 2026): 68 commits and four releases. It was built by a parallel multi-agent harness, and the repo still has the append-only integration log the agents coordinated through.

The docs only claim what was actually run. The opening encounter was found by simulation search. No puffer ships, because a search of more than 2,600 candidates didn't turn up one that verified cleanly. One rule preset was dropped because its advertised behaviour didn't reproduce. When Tailwind's production build quietly turned every colour lens white, the fix came with a Playwright project that builds for real and checks the canvas pixels. The README reports hundreds of unit tests and over a hundred Playwright specs, at desktop and phone sizes.

The deploy is gated on the tests now: the workflow runs tests, builds, deploys, then a smoke check against the live site, and CI includes a production-build end-to-end project. The page also has link-preview metadata. Multiplayer across machines still needs a relay, and none is deployed.

The Time Sculpture needs real WebGL, and it renders dark on software-only graphics.

[Play it live](https://alliecatowo.github.io/afterlife/), read the [guide and wiki](https://alliecatowo.github.io/afterlife/guide/), or browse the [source on GitHub](https://github.com/alliecatowo/afterlife).
