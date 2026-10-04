---
title: Spinnerr
date: 2025-11-04
demo: https://spinnerr-app.web.app
description: An ambient music player for a second screen, built around a generative vinyl record. Plays Audius, SoundCloud, radio and Internet Archive from one search, plus your own files.
featured: false
github: https://github.com/alliecatowo/spinnerr
group: creative-coding
image: /images/projects/spinerr/card.webp
imageAlt: "Spinnerr playing a local test track: a green generative vinyl record with the tone arm down, a large clock, the track title and progress bar, and two sample calendar events."
seo:
  description: "An ambient music player for a second screen: a generative p5.js vinyl record, one search across Audius, SoundCloud, radio and the Internet Archive, and a calendar."
  title: "Spinnerr: a generative vinyl music player"
slug: spinerr
status: published
tags:
  - music
  - generative-art
  - p5js
  - audio-visualization
  - nextjs
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

Spinnerr is an ambient music player: a spinning vinyl record and player controls on one side, a clock and your upcoming events on the other, meant to sit on a spare screen while music plays. It began as a one-night prototype in November 2025 (40 commits), sat for most of a year, and was revived in October 2026. The project was called Spinerr until the rename to Spinnerr that month. This page covers what the live app does now, and where it still falls short.

## The record

The record is still the interesting part. It's a p5.js sketch that draws concentric groove rings, each nudged in and out by Perlin noise. The noise and random seed come from a hash of the track ID, so every track gets its own consistent pattern and colour. The groove paths are computed once and cached, and then live audio moves them: a Web Audio analyser splits the signal into frequency bands, and a smoothed bass level makes the record swell and glow on kick drums. The tone arm swings in and out with spring animation when playback starts and stops, and you can seek by dragging the grooves.

::demo-video
---
height: 750
width: 1200
alt: "An 8 second screen recording of the deployed app playing a synthetic test
  track: the green generative vinyl record spins with the tone arm down and its
  grooves pulse on each bass kick, beside a clock, the track title and a
  progress bar."
mp4: /images/projects/spinerr/demo.mp4
poster: /images/projects/spinerr/demo-poster.webp
webm: /images/projects/spinerr/demo.webm
---
::

*Recorded on the live site in its earlier, local-files-only state, with a generated test track (a 2 Hz sine kick plus a tone, cover art embedded) picked through "Play Local Files". The grooves swell on every kick. The sidebar and sample calendar in the clip are from that older version.*

## What it does now

It opens on a trending Audius station and starts playing. In a normal browser, autoplay is blocked until you interact, so the first thing you see is a "Tap to play" overlay, and the first tap or key press anywhere starts the music.

![Spinnerr on a desktop screen: a sidebar with Browse, Library and Settings, a blue and green generative vinyl record with the tone arm down, a large clock reading 2:05 PM, the now-playing title and artist with a progress bar and player controls.](/images/projects/spinerr/player-1440.webp)

*The live app at 1440 pixels wide, a few seconds into the default Audius station. The track is whatever was trending at the time.*

- **Browse.** A view for finding something to play without searching: moods, Audius trending by genre, internet radio by tag or country (from radio-browser), and Internet Archive collections. Choosing one lands you back on the player with it playing.
- **One search across sources.** A single query goes to Audius, SoundCloud, the Internet Archive and radio-browser, and the results are merged, deduplicated and ranked. If one source fails it's skipped quietly. For a search on "boards of canada" the check run for this rewrite returned 36 merged items.
- **Your own files.** "Play Local Files" still works with no account or key. Tags and artwork are read in the browser.
- **Calendars.** Upcoming events come from an ICS URL, an ICS file, or Google Calendar with read-only access. The sample events from the prototype are gone; with nothing connected the app says "Add your calendar to see what's coming up".
- **Library and tour.** A saved library, a guided tour that starts once on desktop after something is playing, light and dark themes, and theater and fullscreen modes.
- **Phones.** The sidebar collapses and the record takes the whole width. It was checked at 360, 390 and 412 pixels wide with no horizontal scroll.

![The same record on a 375 pixel wide phone screen, filling the width with pink, red and purple grooves over a photographic centre label, the tone arm down, with the sidebar collapsed and a Browse button at the bottom left.](/images/projects/spinerr/player-375.webp)

*On a phone-width screen the sidebar collapses and the record takes the whole width.*

## How it's put together

The front end is still a static Next.js export on Firebase Hosting. The pieces that can't run in a browser are small Firebase Cloud Functions: one that proxies SoundCloud, one that fetches ICS calendars (it rejects the cloud metadata address), and one that turns off billing on the Google Cloud project if a $5 budget is exceeded. The old Next.js API routes that scraped SoundCloud are gone, which is what lets the site stay a static build.

## Known limits

- The SoundCloud function works by getting a client ID the way the SoundCloud web player does, from Google Cloud's network. It works today and could stop without notice.
- Google Calendar needs a Google sign-in. The sign-in button renders and the ICS path was tested end to end, but the Google Calendar connection was not, and the Google sign-in setup for the new hosting address is unfinished.
- Google's public holiday calendar returns HTTP 429 to the function; other ICS hosts work.
- Spotify settings are still in the app, but Spotify can't stream. Jamendo and YouTube aren't connected.
- The tour modal can cover the "Tap to play" button on a first visit.
- Verification used playback position and network activity in headless Chrome, not listening to it. Whether the buffering change fixes a stutter at the start of the first track on a real phone is unconfirmed.

## Status

It works, and it's still a side project. The live site is at [spinnerr-app.web.app](https://spinnerr-app.web.app); the old spinerr-app.web.app address redirects there. The [source is on GitHub](https://github.com/alliecatowo/spinnerr) under the MIT license, and the old repository URL redirects to it. A playlist importer (paste a Spotify, YouTube Music or SoundCloud playlist link and match it across sources) is designed but not built.
