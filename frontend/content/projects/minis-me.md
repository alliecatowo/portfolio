---
title: "minis.me — Predictive Code Reviews"
date: "2025-08-30"
description: "A swarm-style assistant that drafts the review your teammates will leave, so you can fix issues before opening the PR."
featured: true
status: "published"
technologies: ["Nuxt 3", "TypeScript", "Claude", "Embeddings", "Vector Search", "Docker"]
slug: "minis-me"
image: "/placeholder-project.jpg"
---

minis.me experiments with the idea of “shadow teammates” that understand your codebase, conventions, and tone. It predicts common review feedback—tests, naming, structure, missing edge cases—before the PR goes up.

Highlights

- Team-aware prompts tuned to project norms
- Inline suggestions mapped to files and diffs
- Review styles that reflect senior teammates’ feedback patterns
- Private-by-default; runs on your infra

Outcome: faster merges, calmer reviews, and more human attention for design and architecture.

Roadmap

- Repo‑local memory with opt‑in anonymized learning
- Tight IDE hints for “fix it now” loops
- Support for non‑English codebases and docs
