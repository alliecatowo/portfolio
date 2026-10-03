---
title: Daggler
date: 2026-06-03
description: "A semantic IDE for GitHub Actions: typed IR, live job graph, five validation layers, and rules that catch prompt injection into AI agents."
featured: false
github: https://github.com/alliecatowo/daggler
group: agent-systems-devtools
image: /images/projects/daggler/card.webp
imageAlt: Daggler grading an AI triage-agent workflow F for security, flagging untrusted issue text passed into the agent's prompt and agent output being executed.
seo:
  title: "Daggler: a semantic IDE for GitHub Actions"
  description: "A semantic IDE for GitHub Actions: typed IR, live job graph, five validation layers, and rules that catch prompt injection into AI agents."
slug: daggler
status: published
tags:
  - developer-tools
  - ci-cd
  - github-actions
  - security
  - agents
  - static-analysis
technologies:
  - TypeScript
  - Next.js
  - React
  - Monaco Editor
  - GitHub Actions
  - nektos/act
  - Drizzle ORM
---

**The semantic workbench for GitHub Actions.**

GitHub Actions workflows are code that runs with your secrets, and most of us edit them as untyped YAML and find out what's wrong by pushing. Daggler parses them into a typed model and gives them an IDE: a live job graph, Monaco YAML with diagnostics on the exact span, an inspector, one-click fixes and a security grade.

![Daggler editor: a GitHub Actions job graph, the workflow YAML with inline diagnostics, and an inspector offering to pin an unpinned action to a commit SHA.](/images/projects/daggler/editor.webp)

## The pipeline

Workflow YAML becomes a typed intermediate representation (jobs, steps, triggers, permissions, matrix, concurrency, outputs) with a byte-level source map, then a job dependency graph with cycle and unreachable-job detection. Five validation layers run over it, from the parser and schema through expression contexts and graph semantics to known action inputs, plus a 13-rule policy engine. Edits made in the graph, the inspector or the AI assistant become structured patches on the original text, so your comments and formatting survive. The whole pipeline is plain TypeScript shared by the browser, the CLI and the worker, so there's no validation server.

## Workflows that run agents

Three of the rules are about agentic workflows:

- **AGENT001** flags attacker-controlled issue or PR text flowing into an AI agent's prompt on a privileged trigger.
- **AGENT002** flags agents with more permissions than they need.
- **AGENT003** flags a workflow that executes the agent's output.

![Daggler grading an AI triage-agent workflow F for security, flagging untrusted issue text passed into the agent's prompt and agent output being executed.](/images/projects/daggler/security.webp)

*A sample "Triage Agent" workflow that interpolates the issue body into the prompt and gives the agent shell and write tools: graded F, 20 out of 100.*

The ordinary supply-chain rules are there too, like flagging actions that aren't pinned to a commit SHA, with a quick fix that pins them to real SHAs from its action catalog.

## A confidence ladder that never fakes results

Static analysis runs on every keystroke. The next rung runs the workflow locally with [act](https://github.com/nektos/act) in Docker and streams it into the editor's Run panel. The top rung dispatches to GitHub itself. Every result is labelled as simulated or proved, and a rung that isn't connected says so instead of returning something plausible.

![Daggler running a workflow locally with act and streaming the plan into the Run panel, labelled as a simulated approximation.](/images/projects/daggler/live-run.webp)

There's also a `daggler` CLI: `lint`, `map`, `search`, and `logs`, which maps a failed run's logs back to the workflow lines that caused them.

## Status

One overnight sprint on 3 and 4 June 2026: 16 commits, MIT, CI green. It's designed to be self-hosted, but there's no hosted instance. The CLI is on npm as [`daggler-cli`](https://www.npmjs.com/package/daggler-cli) (0.1.0, installs a `daggler` command; try `npx daggler-cli --help`), and the web editor runs from a clone. The AI assistant (explain, harden, generate) needs your own Anthropic API key, and the GitHub App and webhook layer landed in the last commit, so treat it as early. The [architecture doc](https://github.com/alliecatowo/daggler/blob/main/ARCHITECTURE.md) is the best place to start.
