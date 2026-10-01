---
title: AllieCode
slug: alliecode
description: 'A provider-agnostic AI coding CLI in Go: one terminal agent for Anthropic, OpenAI, Gemini, Ollama and any OpenAI-compatible endpoint.'
date: 2026-04-02
# Draft: Allison to decide before publishing. The repo's own parity docs
# (PARITY_ACCOUNTING.md, PARITY_MATRIX.md, MEGA_PARITY_TASKLIST.md) frame it
# differently from this page, it's one squashed commit, and its CI run failed.
status: draft
featured: false
group: agent-systems-devtools
technologies:
  - Go
  - Bubble Tea
  - MCP
  - Ollama
  - GoReleaser
tags:
  - ai-agents
  - coding-agents
  - cli
  - terminal
  - go
github: https://github.com/alliecatowo/alliecode
---

**One coding agent, any model.**

AllieCode is a terminal coding agent written in Go that isn't tied to one model vendor. It talks to Anthropic, OpenAI, Gemini, Ollama and any OpenAI-compatible endpoint, defaults to local models through Ollama, and has a routing policy for sending different kinds of work to different models.

The codebase is large: an agent loop with checkpoints and context compaction, a tool registry, permissions, hooks, MCP support, slash commands, and a Bubble Tea terminal UI, with integration tests and golden snapshots.

## Status

Not verified yet. The repo is a single commit from April 2026, its CI run failed, and the project's own tracking marks every subsystem as partial. Apache-2.0 licensed; the [source is on GitHub](https://github.com/alliecatowo/alliecode).
