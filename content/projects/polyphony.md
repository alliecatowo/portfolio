---
title: Polyphony
slug: polyphony
description: "A GitHub-native port of OpenAI's Symphony: an Elixir/OTP orchestrator that turns GitHub Project issues into isolated Codex runs and PRs."
date: 2026-05-15
# Draft until feat/patches-autonomous-runtime is merged and the README describes the GitHub runtime
status: draft
featured: false
group: agent-systems-devtools
technologies:
  - Elixir
  - OTP
  - Phoenix LiveView
  - GitHub GraphQL API
  - GitHub Apps
  - Codex App Server
  - systemd
tags:
  - agents
  - orchestration
  - github
  - developer-tools
  - automation
github: https://github.com/alliecatowo/polyphony
---

**Symphony, but the tracker is GitHub.**

OpenAI's [Symphony](https://github.com/openai/symphony) is a spec and an Elixir reference service that polls a Linear board, gives each issue its own workspace, and runs a Codex agent in each one. Polyphony is my port of it to GitHub: Issues, Project fields and statuses, labels, PRs, checks and merge state become the tracker and the source of truth, and each run's plan, run log, decisions, evidence and handoff are committed under `docs/issues/<id>/` next to the code. The orchestrator design, the spec and the Linear version are upstream's; the GitHub tracker, webhook, gateway and delivery modules are new.

## Running it for real

From 29 August to 1 September 2026 I pointed it at [Patches](/projects/patches/), unattended. The first run fell over: about 33 minutes went into exhausting GitHub's GraphQL quota, because quota errors fed a retry loop that the rate-limit circuit breaker didn't cover. I wrote an audit of that run, tracing the loop to exact line ranges, and then spent three days on bounding and isolation: one shared rate-limit gate for every request, token and turn budgets, per-worker Codex config and sockets kept apart from my own interactive setup, atomic worker slots, durable recovery on restart, and a systemd watchdog.

The result, stated plainly: 28 PRs opened against Patches from Polyphony branches between 30 August and 1 September, and 20 of them merged. That's a small slice of Patches' history, not the thing that built it.

## Status

An engineering preview for trusted environments, Apache-2.0 (upstream's license; credit to OpenAI and Symphony's authors). The runtime work lives on the `feat/patches-autonomous-runtime` branch.
