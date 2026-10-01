---
title: darwin
slug: darwin
description: 'Work in progress: a self-improving layer for coding-agent harnesses (memory, dream, distill), shipped first as an opencode plugin, and benchmarked against itself on SWE-bench.'
date: 2026-08-29
status: published
featured: false
group: agent-systems-devtools
technologies:
  - TypeScript
  - Bun
  - SQLite
  - BM25
  - opencode
  - SWE-bench
  - Podman
tags:
  - ai-agents
  - coding-agents
  - memory
  - evaluation
  - plugin
  - work-in-progress
github: https://github.com/alliecatowo/claude-code-darwin
---

**Can a coding agent get better at a codebase just by working in it?**

darwin is a work in progress. It takes the self-evolution ideas from Xiaomi's [MiMo-Code](https://github.com/XiaomiMiMo/MiMo-Code) and rebuilds them as a plugin rather than a fork, so they can sit on top of an existing agent harness. The repo is named for Claude Code, which is the second target; the first, and the only one built so far, is an [opencode](https://opencode.ai) plugin.

## Three loops

Allison's design doc starts by going through every MiMo-Code feature and deciding what to keep, cut or replace with something the host already does. What's left is three loops:

- **Remember**: persistent project and global memory, plus a searchable index of past sessions, fed back into context.
- **Reflect**: a "dream" pass that checks memory against what actually happened in past sessions and consolidates it, and a "distill" pass that turns repeated work into skills.
- **Act better**: the skills it has learned, found again quickly when they're relevant.

The skills corpus is adapted from MiMo-Code under its MIT license, with attribution in the repo.

## Measuring it, including when it loses

Most of the work is on the `harness-eval` branch, and it's mostly measurement: the same model and harness with darwin on and off, graded by actually running SWE-bench tests. The results are mixed, and the write-up says so.

- On a chain of the first 30 SWE-bench Lite Django tasks, run in order in one fixed workspace with a single model, both arms solved 22 of 30. The darwin arm used 24% fewer tokens, 43% less time and 27% less money.
- On cold-start single issues it made no difference.
- On a larger overnight matrix across several repos (288 paired runs), darwin cost 138% more overall. It helped on SymPy and Matplotlib and hurt on Django. The cause, written up in the repo: about 300 lines of memory were being injected into every turn whether or not they were relevant, while the search index sat unused. The last commits switch to retrieving only memory that matches the task.

## Status

Work in progress, built over three days at the end of August 2026 (25 commits, most of them on the evaluation branch). The Claude Code version hasn't been built. The [source is on GitHub](https://github.com/alliecatowo/claude-code-darwin), with no license for Allison's code yet.
