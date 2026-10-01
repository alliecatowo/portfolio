---
title: K9k
description: "A native macOS Kubernetes manager with K9s-style depth: SwiftUI app, bundled Go client-go helper, live watch, exec, port-forward, Helm, and RBAC checks."
slug: k9k
date: 2026-08-07
status: published
featured: false
group: agent-systems-devtools
technologies:
  - Swift
  - SwiftUI
  - Go
  - client-go
  - Kubernetes
  - Helm SDK
  - SwiftTerm
  - Swift Charts
tags:
  - developer-tools
  - macos
  - kubernetes
  - native-app
github: https://github.com/alliecatowo/k9k
image: /images/projects/k9k/card.webp
imageAlt: K9k inspector showing a Pod's raw JSON object with syntax highlighting beside the live resource table.
seo:
  title: "K9k: a native macOS Kubernetes manager"
  description: "A native macOS Kubernetes manager with K9s-style depth: SwiftUI app, bundled Go client-go helper, live watch, exec, port-forward, Helm, and RBAC checks."
---

**What if K9s were a real Mac app?**

[K9s](https://github.com/derailed/k9s) is the best way to operate Kubernetes from a terminal. K9k asks what those same workflows look like as a proper macOS app: a SwiftUI app for macOS 26 with a sidebar of resource kinds, live tables, an inspector, sheets, a command palette and Swift Charts. It's inspired by K9s, not affiliated with it, and K9s is the behavioural reference rather than a code source.

![K9k, a native macOS Kubernetes manager: resource sidebar, a live Pod table from a Kind cluster, and an inspector showing RBAC access, metrics status and pod details.](/images/projects/k9k/workspace.webp)

## Two processes, on purpose

The app is paired with a bundled Go helper, `k9k-core`, built on `client-go` and the Helm SDK. They talk over a versioned NDJSON protocol. The Swift side never reads kubeconfig credentials or endpoints; the helper owns authentication and hands back structured results. Normal operation doesn't shell out to `kubectl` or `helm`.

It covers live list and watch across built-in resources and CRDs, logs, a real SwiftTerm terminal into pods, attach and ephemeral debug containers, file transfer, loopback-only port-forwards with an HTTP benchmark, scale, restart and rollback, cordon and drain, dry-run manifest import, Helm history, upgrade and rollback, a graphical `kubectl auth can-i`, and K9s config, alias and plugin compatibility.

![K9k inspector showing a Pod's raw JSON object with syntax highlighting beside the live resource table.](/images/projects/k9k/raw-json.webp)

## Safe by construction

- Every mutation is checked against RBAC with your real identity, respects read-only mode, and asks for confirmation.
- Read-only mode is replayed into every helper process before every request, so a restarted helper can't come back writable. Before that fix, it could.
- Switching contexts builds every new client before one atomic commit and cancels every old watch, log, exec and port-forward stream. The project's own release audit caught a bug where a failed switch could show the new context while still holding clients for the old cluster; this is the fix.
- Manifest edits are pinned to the object's UID and diffed through a server-side dry run before they apply.
- File transfer streams `tar` over exec and rejects symlinks, hard links, special files and `..` paths in both directions.

## Status

K9k was built over 7 and 8 August 2026: 90 commits, with CI (Go race tests on Linux and the macOS 26 app build) green on the last push. A parity ledger pins K9s to a specific commit and maps every capability against K9s source; all 30 rows are still marked Partial, because "Complete" requires the full workflow plus an automated test. It's pre-release, with no signed build. To try it you need macOS 26, Xcode 26 and mise, and the repo can stand up a disposable Kind cluster with seeded workloads.

The [source is on GitHub](https://github.com/alliecatowo/k9k). There's no license for Allison's code yet; the Xcode project was seeded from Apple's Landmarks sample, which carries Apple's sample-code license.
