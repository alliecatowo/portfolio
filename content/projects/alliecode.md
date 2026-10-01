---
title: AllieCode
slug: alliecode
description: 'A Go port of an existing TypeScript coding-agent CLI, rebuilt as a provider-agnostic terminal agent. Broad baseline in place; most subsystems are still marked partial.'
date: 2026-04-02
status: published
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
  - port
github: https://github.com/alliecatowo/alliecode
seo:
  title: 'AllieCode: a Go port of a coding-agent CLI'
  description: 'AllieCode is a Go port of a TypeScript coding-agent CLI with provider routing for Anthropic, OpenAI, Gemini and Ollama. Its parity matrix marks most subsystems partial.'
---

**A TypeScript coding-agent CLI, ported to Go.**

AllieCode is a port of an existing TypeScript terminal coding agent to Go. The repository's parity documents (`PARITY_ACCOUNTING.md`, `PARITY_MATRIX.md`, `MEGA_PARITY_TASKLIST.md` and `PARITY_TODO.md`) refer to the original only as "TS" and do not name it, so this page does not either. They describe the work as a TypeScript-to-Go parity port: the goal is for the Go program to behave like the TypeScript one, tracked item by item.

## What was ported

The Go tree mirrors the original's subsystems: the agent loop with checkpoints and hooks, a tool registry, a permissions engine, slash commands, a Bubble Tea terminal UI, session and history stores, MCP support, skills and plugins, and a self-hosted bridge and remote path. The port is large, with roughly 700 Go files and a test suite that includes golden snapshots of command output.

One deliberate difference is the model layer. The docs treat vendor account and hosted-service features as out of scope and replace them with a multi-provider layer. Anthropic, OpenAI, Gemini, Ollama and OpenAI-compatible endpoints are implemented, along with a capability-aware routing policy for choosing a model.

## Why Go

The repository does not give a rationale beyond the port itself. What its tooling shows is a single compiled binary, cross-compiled with GoReleaser and `mise` for Linux, macOS and Windows, with Bubble Tea for the terminal UI.

## Parity status

By its own accounting the port is far from finished. The parity matrix puts the tracked checklist at 61 of 257 items complete (23.7%) and marks every subsystem as partial:

- **Tools:** 39 registered, 15 marked full (Bash, Read, Write, Edit, Grep, Glob and the task tools among them) and 24 partial.
- **Slash commands:** 67 registered, 4 marked full and 63 partial. Most are described as runtime-state handlers rather than complete workflows.
- **Providers:** all five exist, each marked partial, with retry, auth and multimodal gaps listed.
- **Agent loop, permissions, TUI, state and the bridge and remote path:** baselines exist, each marked partial.

The docs also list the largest gaps: the original's very large UI component inventory and utility library are only partly ported.

## Status

Source is on GitHub under Apache-2.0, as a single initial commit from April 2026. Two things are worth knowing. The `cmd/ac` entry point that the build scripts and CI refer to is not in the public repository (the repo's `.gitignore` excludes a path named `ac`), so the program cannot be built from a fresh checkout, and the one CI run on record failed. There is no demo media for the same reason.
