---
title: Shoal
description: "Agent-first structured shell in Rust: typed values and dot-chains instead of pipes, hash-locked tool resolution, OS sandboxing, and an MCP agent surface."
slug: shoal
date: 2026-07-09
status: published
featured: false
group: languages-runtimes
groupOrder: 1
technologies:
  - Rust
  - SQLite
  - BLAKE3
  - Landlock
  - Seatbelt
  - MCP
  - JSON-RPC
  - Zola
tags:
  - rust
  - shell
  - programming-language
  - ai-agents
  - mcp
  - sandboxing
  - developer-tools
  - open-source
github: https://github.com/alliecatowo/shoal
image: /images/projects/shoal/card.webp
imageAlt: 'Shoal landing page: "Structure all the way down", beside a terminal showing typed values, unit arithmetic and a structured git status table.'
seo:
  title: "Shoal: an agent-first structured shell in Rust"
  description: "Agent-first structured shell in Rust: typed values and dot-chains instead of pipes, hash-locked tool resolution, OS sandboxing, and an MCP agent surface."
---

**Structure all the way down.**

Shoal is a shell where command output stays typed, so neither a human nor an AI agent has to scrape terminal text to find out what happened. Commands and expressions produce values (tables, sizes, durations, paths, outcomes) instead of bytes. It's a 22-crate Rust workspace, built in an intense sprint in July 2026.

<video class="w-full h-auto rounded-lg" width="978" height="560" autoplay muted loop playsinline poster="/images/projects/shoal/demo-poster.webp" aria-label="A real shoal terminal session using typed tables, dot-chain transforms, unit arithmetic, and functions as commands.">
  <source src="/images/projects/shoal/demo.webm" type="video/webm">
  <source src="/images/projects/shoal/demo.mp4" type="video/mp4">
</video>

_A real session: a typed `ls` table, a sort and map, `1.5gb + 500mb` coming out as `2gb`, a typed function called like a command, and what happens when you reach for a pipe._

## Past the pipe

Unix composes programs by agreeing on bytes. Shoal keeps the composition and gives data its shape back, with method chains instead of pipes:

```shoal
let large = (ls .)
  .where(.type == "file")
  .where(.size > 10mb)
  .sort_by(.size)
  .reverse()
large.map({ name: .name, megabytes: .size / 1mb })
```

There is no `|` operator at all. Type one and the shell teaches you its model instead of silently accepting bash:

```text
<repl>:1:4: parse error: shoal has no pipe operator
  ls | grep foo
     ^
  hint: data composes with `.`; raw byte plumbing is `.feed(cmd)`; verbatim POSIX lives in `sh { … }`
```

`$VAR`, heredocs and numbered redirects get the same treatment, each pointing at the Shoal equivalent, and real POSIX is still there behind an explicit `sh { … }`. Bare words are typed as they're parsed (`./src` is a path, `*.rs` a glob, `1mb` a size), typed functions double as commands with flags, and a command used as a value captures an `outcome` with its status, structured stdout, stderr, duration and pid.

## Reproducible tools and explicit capabilities

**Reef** resolves tools through project and user scopes instead of ambient `PATH`. A lockfile records each executable's blake3 content hash, drift is detected, and `which` shows the whole resolution chain. `PATH` becomes an output: for legacy programs that search it themselves, Shoal builds a content-addressed view of symlinks.

**Leash** is a per-principal capability policy in TOML covering network, process spawning, environment, secrets and filesystem globs. The effects of a command are planned before anything runs, approval and apply are separate steps, and filesystem grants are enforced by the OS through Landlock on Linux or Seatbelt on macOS. The caveats are the project's own: on `main` only the filesystem is OS-enforced (network rules are checked by policy only), and one kernel isn't a multi-tenant boundary.

## Built for agents

A long-lived kernel serves named sessions over JSON-RPC, and an MCP facade gives agents 13 tools: execute, plan, approve and apply, query the journal, and drive interactive programs on a real PTY, getting back a rendered screen grid instead of raw ANSI. Large results come back as a bounded preview plus a fetchable `shoal://` reference. A Claude Code plugin wires it all up in one step. Every execution is recorded in a SQLite journal with a blake3 content-addressed store, and `undo` replays a typed inverse only when one was recorded, refusing stale state rather than guessing.

## How it's engineered

- A conformance corpus of 1,310 cases in 77 suites is the executable language spec.
- Fuzz targets cover the lexer, the parser and the wire protocol framing.
- 49 declarative adapters turn the output of existing CLIs like git, docker, kubectl and jq into typed tables.
- The [docs site](https://alliecatowo.github.io/shoal/) is both a user manual and an architecture atlas with dozens of diagrams.

![Shoal Architecture Atlas: the system map page describing the shell, kernel daemon and MCP facade.](/images/projects/shoal/architecture-atlas.webp)

## Status

Shoal is a pre-release preview, in the project's own words "a substantial, working preview", not a login shell you'd switch to tomorrow. It's Unix-only, has no releases (you build it from source), and has been quiet since July 2026. It also audited itself: the [status page](https://alliecatowo.github.io/shoal/docs/status-limits/) lists two open P0 findings on `main`, unauthenticated plan approval and plan-reference collisions. Fixes exist on an unmerged hardening branch but haven't shipped. Dual-licensed MIT or Apache-2.0.

Shoal sits next to [Lumen](/projects/lumen/) and [puml](/projects/puml/) as part of a small run of Rust language and runtime projects: typed structure over text, parsers and compilers, and output agents can actually consume.
