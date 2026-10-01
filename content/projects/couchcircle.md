---
title: CouchCircle
description: "A cozy real-time watch party: synced YouTube, direct video, and P2P screen share in a shared living room with a queue and one remote."
slug: couchcircle
date: 2026-06-10
status: published
featured: false
group: social-systems
technologies:
  - TypeScript
  - Next.js
  - React
  - PartyKit
  - WebSockets
  - WebRTC
  - hls.js
  - Tailwind CSS
tags:
  - social
  - realtime
  - watch-party
  - sync
  - webrtc
  - pwa
github: https://github.com/alliecatowo/couchcircle
demo: https://couchcircle.vercel.app
image: /images/projects/couchcircle/card.webp
imageAlt: "A CouchCircle room: a synced video on the stage and two avatars on a couch in an illustrated living room."
seo:
  title: "CouchCircle: a cozy real-time watch party"
  description: "A cozy real-time watch party: synced YouTube, direct video, and P2P screen share in a shared living room with a queue and one remote."
---

**watch together, actually together.**

Most watch parties feel like a video with a chat box bolted on. CouchCircle puts the crew on a couch in an illustrated living room, hands exactly one person the remote, and keeps everyone on the same frame. Someone rolls up a couch, shares a couch code like `CANDLE-696`, and up to 12 people watch YouTube, a direct MP4, WebM or HLS link, or a peer-to-peer screen share together. There's a votable queue, chat with floating reactions, ready checks, and six illustrated avatars (cat, frog, chinchilla, goblin, sprout, blanket).

*The video in these screenshots is Big Buck Bunny, © Blender Foundation, CC BY 3.0.*

## Keeping a room in sync

A PartyKit room server owns the playback state. Every play, pause or seek is stamped on the server's clock, and each client works out the position from that timestamp. Play commands are scheduled 450 ms ahead, so every client starts at the same server instant. The person with the remote sends a heartbeat every 2.5 seconds that quietly re-anchors everyone.

Each client then corrects drift in steps instead of thrashing: under 150 ms it does nothing, up to 750 ms it nudges the playback rate by 5%, and beyond that it hard-seeks. A sync indicator shows which state you're in.

![Two browser windows of the same CouchCircle room, both showing the video at the same moment with a green synced indicator.](/images/projects/couchcircle/sync-two-windows.webp)

## Sources and the remote

YouTube, direct and HLS video, and live screen share all sit behind one media adapter interface, so a seekable embed and an unseekable live stream go through the same sync engine. Screen share is a WebRTC mesh with STUN only and no TURN relay, so it won't get through every network and the mesh size is limited.

The remote can be host-only, request-to-drive, or chaos, and an emergency pause is always available to everyone. The remote rules, ready checks and synchronised countdowns are all server-side protocol messages, not client UI state.

## Try it

It's live at [couchcircle.vercel.app](https://couchcircle.vercel.app), with a pre-seeded [demo room](https://couchcircle.vercel.app/demo). It's a PWA, and CI boots a real PartyKit server and load-tests a room with 12 clients (plus a 13th that should be turned away). The repo was created and all six commits landed on 10 June 2026, alongside a product bible and a threat model. The [source is on GitHub](https://github.com/alliecatowo/couchcircle); there's no license file yet.

![CouchCircle's landing page: three cartoon avatars above a couch, with cards to create a room or join one with a couch code.](/images/projects/couchcircle/landing.webp)
