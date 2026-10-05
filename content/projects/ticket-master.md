---
title: Ticketmaster
date: 2026-09-15
demo: https://alliecatowo.github.io/ticket-master/demo/
description: "Rust coding-agent runtime: chat in the terminal, hand work to background workers as tickets, review and accept it. State is an append-only event log."
docs: https://alliecatowo.github.io/ticket-master/
featured: true
github: https://github.com/alliecatowo/ticket-master
group: agent-systems-devtools
image: /images/projects/ticket-master/card.webp
imageAlt: The Ticketmaster terminal UI showing a ticket ready for review, with Accept and Reject options and the worker's verified test result.
order: 2
seo:
  title: "Ticketmaster: a Rust coding-agent runtime"
  description: "Rust coding-agent runtime: chat in the terminal, hand work to background workers as tickets, review and accept it. State is an append-only event log."
slug: ticket-master
status: published
tags:
  - ai-agents
  - developer-tools
  - cli
  - tui
  - event-sourcing
  - rust
  - llm
technologies:
  - Rust
  - Tokio
  - axum
  - SQLite
  - tree-sitter
  - React
  - TypeScript
  - Vite
---

**An interactive coding agent with a ticket-powered background crew.**

Most terminal coding agents are a chat window that forgets everything once you close it. Ticketmaster (`tm`) keeps the chat and adds a work queue. You talk to `tm` like any other terminal coding agent. When something should happen in the background, it becomes a **ticket**: a worker leases it, does the work and submits a result with evidence, and then you review it with a keypress. Reject it and your reason is stored on the ticket, so the next attempt sees why the last one failed. The commit that added the review flow puts the rule bluntly: "Human-only; an agent never certifies work."

::demo-video
---
height: 804
width: 1028
alt: Ticketmaster tickets screen showing ticket T-2 ready for review with Accept
  and Reject options and the worker's verified test results; pressing 1 accepts
  it and it moves to Completed.
mp4: /images/projects/ticket-master/tui-accept.mp4
poster: /images/projects/ticket-master/tui-accept-poster.webp
webm: /images/projects/ticket-master/tui-accept.webm
---
::

*The tickets screen. T-2 is ready for review with the worker's passing tests. Pressing `1` accepts it, and it moves to Completed (`tm ticket reopen T-2` undoes that).*

## Chat, then delegate

Every clip on this page is the real `tm` binary (v0.1.0 at the time) driving a live model on a scratch Python project, with no scripted turns. The repo's [showcase notes](https://github.com/alliecatowo/ticket-master/tree/main/docs/showcase) explain how they were recorded, friction log included.

::demo-video
---
height: 804
width: 1028
alt: "Ticketmaster terminal chat: the user asks what happens when calc.py
  divides by zero; the agent reads the file, runs a Python repro that raises
  ZeroDivisionError, and answers with a note about related tickets."
mp4: /images/projects/ticket-master/tui-live.mp4
poster: /images/projects/ticket-master/tui-live-poster.webp
webm: /images/projects/ticket-master/tui-live.webm
---
::

*A chat turn: `tm` reads `calc.py`, reproduces the divide-by-zero crash in a shell, and answers with a note about the related tickets.*

::demo-video
---
height: 804
width: 1028
alt: A new task typed into Ticketmaster's dispatch input becomes ticket T-3,
  which a background worker picks up and verifies with doctest and pytest while
  the user keeps chatting.
mp4: /images/projects/ticket-master/tui-dispatch.mp4
poster: /images/projects/ticket-master/tui-dispatch-poster.webp
webm: /images/projects/ticket-master/tui-dispatch.webm
---
::

*A task typed into the dispatch input becomes T-3. A background worker picks it up and verifies it with doctest and pytest while the chat carries on.*

## The event log is the product

All project state lives in an append-only SQLite event log. Tickets, decisions, milestones and the wiki are views rebuilt by replaying it, and a chat session is just a disposable window onto it. "Append-only" isn't a convention here: SQLite triggers abort any `UPDATE` or `DELETE` on the events table, and each event's hash chains to the previous one with blake3, so tampering is detectable. A state change and its events commit in the same transaction, so they can't disagree after a crash.

Tickets move through a state machine (Ready, Leased, Running, Submitted, Verifying, Closed and friends) written as a pure, total function: no clock, no side effects, no wildcard match arm, and a unit test that walks every state and trigger pair. Workers hold leases with heartbeats and can run in their own git worktrees.

The same state feeds several front ends: the terminal UI; `tm serve`, an axum REST and SSE API with a React "project canvas" web client; a VS Code extension; a macOS Swift client; and MCP and ACP bridges, so other agents (Claude Code included) can hand work to `tm` workers. Underneath sit tree-sitter code intelligence and a provider layer the README counts at 21 backends.

## It benchmarks itself, and publishes the losses

`cargo xtask bench-cross` runs the same fixtures through `tm` and opencode. The fixtures are real issues from projects like ripgrep, click, requests, cobra, ky and Hugo, and a check script confirms each one's test fails before the reference patch and passes after it. The scoreboards live in the repo, and they aren't flattering. In every recorded trial `tm` scored at or below opencode, tying at best. The latest pass had `tm` solving 0 of 3 to opencode's 2 of 3, on about 5.6 times the tokens. The last few days of commits are the tuning loop that came out of those numbers. A benchmark you only publish when you win doesn't tell you much.

## How it was built

About 858 commits in two weeks (September 15 to 29, 2026), which Allison directed through a 2,000-line spec, 36 architecture decision records and an agent task list that assigns a model tier to each task. The result is a 27-crate Rust workspace with roughly 4,000 tests.

## Status and trying it

v0.1.4 (October 4, 2026) is the current release, with prebuilt `tm` binaries for Linux and macOS (x86\_64 and arm64), each with a checksum, on the [release page](https://github.com/alliecatowo/ticket-master/releases/tag/v0.1.4). The Homebrew formula tracks it. Since v0.1.1 the changes are small: under the conservative oversight setting, an agent running `sh -c` now needs approval, and the server's 60-second request timeout no longer applies to the event stream or to approvals. The default autonomous setting is unchanged. It isn't on crates.io, because the workspace's internal crate names aren't free there. There's a [docs site](https://alliecatowo.github.io/ticket-master/) and a [browser demo](https://alliecatowo.github.io/ticket-master/demo/) of the accept and dispatch flow.

```sh
brew install alliecatowo/tap/ticket-master   # installs the tm CLI
tm init
```

To install from source with cargo:

```sh
cargo install --git https://github.com/alliecatowo/ticket-master --locked tm-cli
```

That line is in the README and was checked by CI on Linux and macOS, not run on Allison's own machine. To build a checkout instead:

```sh
git clone https://github.com/alliecatowo/ticket-master.git && cd ticket-master
mise install && mise run build
./target/debug/tm init
```

You'll need one configured model provider, such as `ANTHROPIC_API_KEY`. The [thesis](https://github.com/alliecatowo/ticket-master/blob/main/docs/thesis.md) explains the idea behind it, and the [decision records](https://github.com/alliecatowo/ticket-master/tree/main/docs/decisions) explain the rest. Dual-licensed MIT or Apache-2.0.
