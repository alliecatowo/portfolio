---
technologies:
  - Python
  - FastAPI
  - Jellyfin
  - Radarr
  - Sonarr
  - OpenAI
  - Ollama
  - Docker
  - TypeScript
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
slug: assistarr
group: earlier-work
title: Assistarr
description: 'An AI assistant for a self-hosted media stack: ask in plain English and it drives Jellyfin, Radarr and Sonarr through their APIs, from a chat UI, CLI or Telegram.'
date: 2025-10-01
status: published
featured: false
github: https://github.com/alliecatowo/assistarr
image: /images/projects/assistarr/card.webp
imageAlt: 'Assistarr home hero: "Your media, all in one place." with Start a chat, Discover and Monitor buttons, and four stat cards for services online, library size, active downloads and AI signals.'
seo:
  title: 'Assistarr: AI assistant for Jellyfin and *arr'
---

## Overview

Assistarr is an AI assistant layer on top of your self-hosted media stack. Instead of navigating interfaces to add movies, check download queues, or manage libraries, you just ask:

> "Queue up everything Christopher Nolan directed after 2010" or "What's downloading right now? Cancel anything over 24 hours old."

It talks to Jellyfin, Radarr, and Sonarr over their existing APIs and lets you drive the whole thing through natural language — via a chat UI, CLI, or Telegram bot.

![The Assistarr home hero component: a greeting, the headline "Your media, all in one place.", Start a chat, Discover and Monitor buttons, and four stat cards showing services online, library footprint, active downloads and AI signals.](/images/projects/assistarr/hero-1600.webp)

_The home hero, rendered from the repo's Ladle component stories with their built-in mock data, so the numbers (4/5 services, 128 items, 8 downloads) are sample values, not a real library._

![The Assistarr downloads widget, titled "Pipelines & queue", listing three sample items with progress bars and the services they come from: Radarr, Sonarr and qBittorrent.](/images/projects/assistarr/downloads.webp)

_The downloads widget from the same stories, with sample queue items._

---

## Problem

Self-hosted media setups are powerful but clunky to operate. Adding a movie means jumping between Radarr UI, checking Sonarr for shows, then flipping to Jellyfin to verify. Power users manage this fine — but the interfaces are not intuitive for family members, and even for experts it's context-switching overhead for simple tasks.

Adding AI narrows that gap dramatically.

---

## Solution

Assistarr wraps a **FastAPI backend** with tool-calling LLM integration (OpenAI / local Ollama) and exposes a natural language interface:

- **Tool-calling agent** — maps user intent to Radarr/Sonarr/Jellyfin API calls
- **Multi-backend LLM support** — OpenAI, Anthropic, or local Ollama for privacy-first deployments
- **Media library awareness** — queries Jellyfin for what's available before suggesting requests
- **Telegram bot interface** — control your media server from your phone without touching any web UIs
- **Smart queue management** — understands in-flight downloads, priorities, and queue state
- **Docker-first** — one `docker-compose up` and it wires into your existing stack

---

## Challenges

The main challenge was designing the tool schema so the LLM reliably picks the right action without hallucinating API arguments. Radarr and Sonarr have overlapping concepts (quality profiles, tags, monitored status) that the agent needs to reason about correctly. Getting streaming output and async tool calls to feel responsive was also a non-trivial UX problem.

---

## Impact

- Reduces "how do I add X" friction to near-zero for non-technical household members
- Enables complex batch operations via plain English ("add all top-rated horror films from 2024")
- Fully local-LLM-capable — no cloud required if you run Ollama

---

## Reflection

Assistarr scratches my own itch: I built it because I run the exact stack it targets and got tired of tab-switching. It also became a useful testbed for tool-calling agent design — specifically how to keep agents grounded when the action space has real consequences (like mass-downloading media or clearing queues). Good agent UX is hard; Assistarr is still teaching me.

---

## Tech Stack

**Python**, **FastAPI**, **Jellyfin API**, **Radarr/Sonarr APIs**, **OpenAI / Ollama**, **Docker**, **Telegram Bot API**
