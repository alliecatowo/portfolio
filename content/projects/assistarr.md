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
title: Assistarr
description: AI-powered media server assistant for Jellyfin, Radarr, and Sonarr — natural language control for your self-hosted stack.
date: 2025-10-01
status: published
featured: true
github: https://github.com/alliecatowo/assistarr
---

### Overview

Assistarr is an AI assistant layer on top of your self-hosted media stack. Instead of navigating interfaces to add movies, check download queues, or manage libraries, you just ask:

> "Queue up everything Christopher Nolan directed after 2010" or "What's downloading right now? Cancel anything over 24 hours old."

It talks to Jellyfin, Radarr, and Sonarr over their existing APIs and lets you drive the whole thing through natural language — via a chat UI, CLI, or Telegram bot.

---

### Problem

Self-hosted media setups are powerful but clunky to operate. Adding a movie means jumping between Radarr UI, checking Sonarr for shows, then flipping to Jellyfin to verify. Power users manage this fine — but the interfaces are not intuitive for family members, and even for experts it's context-switching overhead for simple tasks.

Adding AI narrows that gap dramatically.

---

### Solution

Assistarr wraps a **FastAPI backend** with tool-calling LLM integration (OpenAI / local Ollama) and exposes a natural language interface:

- **Tool-calling agent** — maps user intent to Radarr/Sonarr/Jellyfin API calls
- **Multi-backend LLM support** — OpenAI, Anthropic, or local Ollama for privacy-first deployments
- **Media library awareness** — queries Jellyfin for what's available before suggesting requests
- **Telegram bot interface** — control your media server from your phone without touching any web UIs
- **Smart queue management** — understands in-flight downloads, priorities, and queue state
- **Docker-first** — one `docker-compose up` and it wires into your existing stack

---

### Challenges

The main challenge was designing the tool schema so the LLM reliably picks the right action without hallucinating API arguments. Radarr and Sonarr have overlapping concepts (quality profiles, tags, monitored status) that the agent needs to reason about correctly. Getting streaming output and async tool calls to feel responsive was also a non-trivial UX problem.

---

### Impact

- Reduces "how do I add X" friction to near-zero for non-technical household members
- Enables complex batch operations via plain English ("add all top-rated horror films from 2024")
- Fully local-LLM-capable — no cloud required if you run Ollama

---

### Reflection

Assistarr scratches my own itch: I built it because I run the exact stack it targets and got tired of tab-switching. It also became a useful testbed for tool-calling agent design — specifically how to keep agents grounded when the action space has real consequences (like mass-downloading media or clearing queues). Good agent UX is hard; Assistarr is still teaching me.

---

### Tech Stack

**Python**, **FastAPI**, **Jellyfin API**, **Radarr/Sonarr APIs**, **OpenAI / Ollama**, **Docker**, **Telegram Bot API**
