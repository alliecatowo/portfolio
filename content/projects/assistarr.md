---
title: Assistarr
date: 2025-10-01
description: "An AI assistant for a self-hosted media stack: ask in plain English and it drives Jellyfin, Radarr and Sonarr through their APIs, from a web chat UI."
featured: false
github: https://github.com/alliecatowo/assistarr
group: earlier-work
image: /images/projects/assistarr/card.webp
imageAlt: 'Assistarr home hero: "Your media, all in one place." with Start a chat, Discover and Monitor buttons, and four stat cards for services online, library size, active downloads and AI signals.'
seo:
  title: "Assistarr: AI assistant for Jellyfin and *arr"
  description: "An AI assistant for a self-hosted media stack: ask in plain English and it drives Jellyfin, Radarr and Sonarr through their APIs, from a web chat UI."
slug: assistarr
status: published
tags:
  - ai
  - media
  - self-hosted
  - homelab
  - jellyfin
  - automation
  - assistant
  - llm
  - open-source
technologies:
  - TypeScript
  - Next.js
  - React
  - Vercel AI SDK
  - PostgreSQL
  - Drizzle ORM
  - Docker
  - Jellyfin
  - Radarr
  - Sonarr
---

## Overview

Assistarr is an AI assistant layer on top of a self-hosted media stack. Instead of navigating several interfaces to add movies, check download queues or browse libraries, you ask in plain English:

> "Queue up everything Christopher Nolan directed after 2010" or "What's downloading right now?"

It talks to Radarr, Sonarr, Jellyfin, Jellyseerr and qBittorrent through their existing APIs, and you drive it from a chat UI in the browser.

![The Assistarr home hero component: a greeting, the headline "Your media, all in one place.", Start a chat, Discover and Monitor buttons, and four stat cards showing services online, library footprint, active downloads and AI signals.](/images/projects/assistarr/hero-1600.webp)

*The home hero, rendered from the repo's Ladle component stories with their built-in mock data, so the numbers (4/5 services, 128 items, 8 downloads) are sample values, not a real library.*

![The Assistarr downloads widget, titled "Pipelines & queue", listing three sample items with progress bars and the services they come from: Radarr, Sonarr and qBittorrent.](/images/projects/assistarr/downloads.webp)

*The downloads widget from the same stories, with sample queue items.*

---

## Problem

Self-hosted media setups are powerful but clunky to operate. Adding a movie means jumping between the Radarr UI, checking Sonarr for shows, then flipping to Jellyfin to verify. Power users manage this fine, but the interfaces are not intuitive for family members, and even for experts it's context-switching overhead for simple tasks.

---

## Solution

Assistarr is a **Next.js** (App Router) application written in **TypeScript**. Chat requests go to a route handler that uses the **Vercel AI SDK** to stream a tool-calling model's responses, and the tools are backed by a plugin layer for each media service.

- **Tool-calling agent**: maps a request to Radarr, Sonarr, Jellyfin, Jellyseerr or qBittorrent API calls through a plugin per service
- **Hosted model providers**: models are reached through OpenRouter or the Vercel AI Gateway (the repo also includes the AI SDK's Anthropic, Google and OpenAI provider packages); no Ollama or local-model path is wired in
- **MCP client**: the repo includes an MCP client manager and tool adapter for extra tools
- **Chat, Discover and Monitor views**: streaming chat, a discovery page and a service-status page, with per-user service settings behind a login (Auth.js)
- **Storage**: PostgreSQL through Drizzle ORM, with optional Redis for resumable streams
- **Docker-first**: a `docker-compose.yml` brings up the app and PostgreSQL, with Redis and a media-network profile optional

---

## Challenges

The main challenge was designing the tool schema so the model reliably picks the right action without inventing API arguments. Radarr and Sonarr have overlapping concepts (quality profiles, tags, monitored status) that the agent needs to reason about correctly, and getting streaming output and tool calls to feel responsive was a UX problem of its own.

---

## Reflection

Assistarr scratches Allison's own itch: she runs the stack it targets and got tired of tab-switching. It also became a testbed for tool-calling agent design, specifically how to keep an agent grounded when its actions have real consequences, like adding media or touching download queues. Source is on GitHub under Apache-2.0.

---

## Tech Stack

**TypeScript**, **Next.js**, **React**, **Vercel AI SDK**, **PostgreSQL / Drizzle ORM**, **Docker**, **Radarr / Sonarr / Jellyfin / Jellyseerr / qBittorrent APIs**
