---
title: Anvil
description: "A native SwiftUI workspace for agent-driven development on macOS: tickets, agent sessions, review and shipping in one app. Ambitious, mid-rebuild, and in need of some TLC."
slug: anvil
date: 2026-03-27
status: published
featured: false
group: agent-systems-devtools
technologies:
  - Swift
  - SwiftUI
  - Swift Packages
  - XcodeGen
  - JSON-RPC
  - XCTest
tags:
  - macos
  - native-app
  - ai-agents
  - developer-tools
  - swiftui
  - prototype
github: https://github.com/alliecatowo/anvil
seo:
  description: "A native SwiftUI workspace for agent-driven development on macOS: tickets, agent sessions, review and shipping in one app. Ambitious and mid-rebuild."
  title: Anvil
---

**What does a development environment look like if agents do most of the typing?**

Anvil is Allison's attempt at an answer: a macOS app where the main surfaces aren't an editor and a file tree but the stages of the work. **Intent** holds the tickets, **Agent** runs and tracks coding-agent sessions, **Review** covers local diffs and GitHub pull requests, and **Ship** is meant for deployments. An editor and a terminal are there too, as supporting packages rather than the centre of the app.

## How it's built

It's a SwiftUI app split into about ten local Swift packages: domain, application and infrastructure layers, Git and GitHub integrations, a terminal, an editor, a plugin SDK, and its own agent protocol package: JSON-RPC over stdin/stdout, modelled on LSP, with Anthropic, OpenAI, Ollama and Claude CLI providers behind it, plus token counting and budget enforcement. XcodeGen generates the Xcode project, and UI tests can launch the app into seeded scenarios for repeatable screenshots.

The design docs are the most opinionated part. The provider model says shared UI describes capabilities, never vendor names. The roadmap's rules are "no fake affordances" (no clickable row that does nothing) and one source of truth each for commands, state, navigation and providers, so the menu, command palette and shortcuts all run through the same action registry.

## Status, honestly

Needs some TLC. Allison built it over four days in March 2026 (167 commits), and it stopped partway through a rebuild. The canonical roadmap is a 100-task plan to move the app onto native macOS structures (split views, tables, inspectors), and the project's own generated audit, which warns it may be stale, lists open bugs where text fields lose keystrokes to a shortcut router and sidebar rows don't respond to clicks. The same audit rates agent conversations, the Intent board, Git and the agent providers as working, Review as partial, and Ship as a stub. The anti-stub "truth matrix" that is meant to list every visible control still has no rows. There are no screenshots, releases or CI yet, and it needs Xcode to build.

The [source is on GitHub](https://github.com/alliecatowo/anvil), with no license yet.
