---
title: Git Why
slug: git-why
description: 'git blame tells you who changed the code; git why finds the commit that explains it. Local hybrid search over Git history, benchmarked honestly.'
date: 2026-09-09
status: published
featured: false
group: agent-systems-devtools
technologies:
  - TypeScript
  - Node.js
  - Git
  - Zvec
  - Model2Vec
  - MCP
  - VitePress
tags:
  - developer-tools
  - git
  - cli
  - semantic-search
  - agents
  - mcp
  - benchmarks
github: https://github.com/alliecatowo/git-why
demo: https://alliecatowo.github.io/git-why/
image: /images/projects/git-why/card.webp
imageAlt: 'Git Why docs site: "Finds the history that explains the code", with an orange magnifying glass over a line of commits.'
---

**`git blame` tells you who changed the code. `git why` finds the history that explains it.**

You remember what went wrong, not what the fix was called, so `git log --grep` can't find it. `git why "<question in your own words>"` searches a repository's history by meaning as well as by keyword, and returns the actual commit, the author's own words and the relevant diff. It deliberately doesn't generate an explanation.

From the README: you ask about "reconnecting subscribed twice", and it finds the commit titled "Stop duplicate subscriptions after reconnect". The two share almost no words, and that mismatch is the whole idea.

## How it works

Every reachable commit becomes a record of its message, paths and a bounded slice of diff evidence. A full-text index and a small static embedding model (Model2Vec's `potion-code-16M-v2`, 256 dimensions) each retrieve candidates, Reciprocal Rank Fusion merges them, and a lexical-overlap reranker reorders the top. It all runs locally, and the index lives under the Git common directory, so every worktree shares one index. An optional warm daemon cuts a query on curl's 30,000-commit history from 569 ms to 286 ms, and if it's unreachable the query just runs directly.

## Measured, not claimed

The benchmark is built so keyword search can't win by construction: 174 questions derived from six pinned repos (curl, redis, requests, ripgrep, caddy and zod), each thrown out if `git log --grep` or `git log -S` could answer it from the question's own words. On those, git why gets the right commit in its top five 37.4% of the time. The README says it plainly: it's wrong most of the time, and it still beats every Git-native strategy on questions they can't answer.

It also publishes where it loses. On cross-file causal questions, `git log -S` scores 0.950 Hit@10 against git why's 0.350. A decisions log records eight measured ideas for improving ranking: one shipped (+26% MRR on a held-out half), seven were rejected. Every number in the README is generated from raw benchmark data, and CI fails if one is edited by hand.

## For agents, including when not to use it

Git Why ships an MCP server plus Claude Code and OpenCode plugins. The plugin's skill tells an agent when to reach for something else: if it can't name the term, use git why; if it can name the symbol, use `git log -S`. A paired agent benchmark is reported in the README as mixed and not significant, and I'm not going to pretend otherwise.

## Status

Built from 9 to 11 September 2026: 163 commits on `main`, Apache-2.0. It isn't published to npm yet, so for now you run it from source; the [docs site](https://alliecatowo.github.io/git-why/) has [recorded sessions](https://alliecatowo.github.io/git-why/guide/examples) against real repositories if you'd rather just watch. The [benchmark report](https://github.com/alliecatowo/git-why/blob/main/docs/report.md) and [decisions log](https://github.com/alliecatowo/git-why/blob/main/docs/decisions.md) are worth a read.
