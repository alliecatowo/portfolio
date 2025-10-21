---
title: My Self‑Hosted Stack on a 16TB Hetzner Box
date: 2025-08-30
description: Plex, Jellyfin, Radarr/Sonarr/Lidarr/LazyLibrarian, qBittorrent,
  Jellyseerr, ProtonVPN, Portainer, and Caddy—running reliably and cheaply.
category: dev
tags:
  - self-hosting
  - hetzner
  - docker
  - media
  - portainer
  - caddy
  - homelab
author: Allie
published: true
featured: false
featured_image: /images/homelab/screenshot-2025-10-16-at-13-03-45-homepage-allie-cat-cinema.png
slug: self-hosting-hetzner-media-box
---

# My Self‑Hosted Stack on a 16TB Hetzner Box

I like owning my media and my infrastructure. A bare‑metal Hetzner machine with 16TB gives me the flexibility and headroom I need—at a price that still feels unreal.

## What’s running

- Plex and Jellyfin for viewing
- Organizrr for an easy ui
- Wizarr for invite mangment and a smooth onboarding flow
- Radarr, Sonarr, Lidarr, LazyLibrarian for automation
- qBittorrent with sensible limits
- ProtonVPN for privacy
- Portainer for management
- Caddy as a simple, smart edge
- Jellyseerr for family requests and discord integration

If you can't tell - I like my movies a lot, and I'm very fussy about the quality! I'm sure some of you are thinking "***Why Not ProxMox***\*?",\* and you'd be right! Hetzner doesn't support proxmox as a default recovery image, and by time I had setup my stack, it was too late to redo. I do plan to move to proxmox at some point, but this works for now, allows friends to hop on and help me admin the stack, and has been working good for my household, family, and friends so far, so I dont want to push my luck! The next hardware upgrade I get (I'm seeing some very attractive boxes with newer hardware on auction...), I'm definitely doing proxmox first!

::prose-accordion{.one _76="two"}
test

test
::

## Why Not Homelab?

Easy: Upload speed! Unfortunately, the ISP's in our area are not full duplex - this means despite a gigabit down speed, we're stuck at 40Mbps up. As a matter of fact, I have an m2 mac mini running as my homelab server with a 14tb external hdd. this was fine for local, as we did direct streaming anyways. But eventually, as family and friends wanted to watch, or we were traveling, the up speed became the bane of our existence. Some of my media is over 120mbps, much too high a bitrate, even with transcoding.

With Hetzner, I don't have to worry about any of that. I have a solid, symmetrical connection, and can handle multiple steams + seeds at the same time, while barley taking a chunk out of my ram. Who knows, maybe i'll toss a mine-craft server on it eventually!

Hetzner has "server auctions", where you can essentially lease a bare metal refurb server, that they were planning on decommissioning otherwise. I'm currently on a Intel Xeon E3-1275V6, which allows up to 12 simultaneous 4k tone map/transcodes with it's small but mighty integrated graphics unit, leveraging Intel QuickSync. It even beats out my m2 chip, with all its specialized video decoding hardware, when it come to x264 transcodes! The 64gb ram must help compared to my poor m2 minis 8gb too.

## Values behind the stack

- Ownership AND convenience
- Privacy first
- family‑friendly
- Documented setup so future‑me thanks past‑me
- Cost effective
