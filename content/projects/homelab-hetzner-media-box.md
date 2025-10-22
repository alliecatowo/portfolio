---
title: Homelab Media Box on Hetzner (16TB)
date: 2025-08-30
description: A home away from home for my data, media, and privacy.
featured: false
status: published
technologies:
  - Docker
  - Portainer
  - Caddy
  - Plex
  - Jellyfin
  - Radarr
  - Sonarr
  - Lidarr
  - qBittorrent
  - ProtonVPN
tags:
  - homelab
  - docker
  - media
  - self-hosted
  - hetzner
  - plex
  - jellyfin
  - automation
  - torrent
  - vpn
slug: homelab-hetzner-media-box
image: /images/homelab/screenshot-2025-10-16-at-13-07-11-jelly-seerr-allie-cat-cinema.png
liveDemo: https://home.allisons.dev
---

### Overview

I’ve always liked owning my media _and_ my infrastructure. Renting cloud space or relying on streaming never felt right.
So I built my own server: a **bare-metal Hetzner auction box** with 16 TB of storage and 64 GB RAM, running an orchestrated suite of self-hosted apps that power my family’s entire digital library — movies, books, automation, and more.

It’s cost-effective, private, and surprisingly elegant.

---

### Why Hetzner

Running this at home wasn’t realistic. My local ISP gives me gigabit down but only 40 Mbps up — perfect for gaming, terrible for hosting 4K streams.
Hetzner’s auction servers offered the sweet spot:

- **Symmetrical bandwidth** for multiple concurrent streams
- **Dedicated Xeon E3-1275 V6** with Intel Quick Sync for hardware transcoding
- **Refurb pricing** far below cloud costs

That GPU alone can handle a dozen simultaneous 4K transcodes — better than my M2 Mac Mini ever could.

---

![screenshot-2025-10-16-at-13-07-32-uptime-kuma.png](/images/homelab/screenshot-2025-10-16-at-13-07-32-uptime-kuma.png)

---

### Stack Overview

| Layer                  | Tools & Services                         | Purpose                                                       |
| ---------------------- | ---------------------------------------- | ------------------------------------------------------------- |
| **Media Servers**      | Plex • Jellyfin                          | Dual-system for redundancy and flexibility                    |
| **Automation**         | Radarr • Sonarr • Lidarr • LazyLibrarian | Hands-off downloads and metadata management                   |
| **Access & Requests**  | Jellyseerr • Wizarr                      | User requests, onboarding, and family invites                 |
| **Torrenting**         | qBittorrent + ProtonVPN                  | Private, bandwidth-aware downloads                            |
| **Edge & Management**  | Caddy • Portainer • Organizr             | Reverse proxy, container orchestration, and unified dashboard |
| **Storage & Hardware** | 16 TB HDD • Xeon E3-1275 V6 • 64 GB RAM  | Reliable, powerful, and inexpensive                           |

---

### Principles Behind the Stack

- 🧩 **Ownership + Convenience** – Control the stack end-to-end without friction.
- 🔒 **Privacy First** – VPN-tunneled traffic and local user management.
- 👨‍👩‍👧 **Family-Friendly** – Simple, curated, multi-user access with Jellyseerr.
- 🧠 **Documented Setup** – So future-me can rebuild it fast.
- 💸 **Cost-Effective** – One flat Hetzner fee replaces every cloud bill.

---

### Challenges & Choices

- **Why not Proxmox?**
  Hetzner doesn’t offer it as a recovery image, and by the time the base stack was live, it wasn’t worth wiping everything. I plan to migrate on my next hardware refresh — but the current Docker/Portainer setup has been rock-solid.
- **Why not host at home?**
  Upload speed. High-bitrate 4K content crushed my local network. Hetzner’s symmetrical connection solved it overnight.

---

### Impact

- Hosts the entire family’s 4K media with zero buffering.
- Serves multiple simultaneous remote streams effortlessly.
- Centralized management with one-click container deploys.
- Monthly cost lower than a few streaming subscriptions combined.

---

![screenshot-2025-10-16-at-13-03-58-jellyfin-allie-cat-cinema.png](/images/homelab/screenshot-2025-10-16-at-13-03-58-jellyfin-allie-cat-cinema.png)

---

### Reflection

This isn’t just a server — it’s my **personal cloud**.
It’s proof that with a bit of care, you can own your data, automate everything, and still give your family a Netflix-tier experience without surrendering privacy or paying the big guys.

Next stop: Proxmox and GPU passthrough. But for now, it just works — and that’s the best feeling in tech.

---

### Tech Stack

**Docker / Portainer**, **Caddy**, **Plex**, **Jellyfin**, **Jellyseerr**, **Radarr/Sonarr/Lidarr**, **qBittorrent**, **ProtonVPN**, **Hetzner Dedicated**, **Intel Quick Sync**
