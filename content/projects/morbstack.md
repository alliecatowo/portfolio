---
title: Morbstack
date: 2026-08-02
demo: https://alliecatowo.github.io/morbstack/
description: "A native macOS Docker Desktop replacement: stock upstream dockerd in one Virtualization.framework VM, a Rust PID 1, and a SwiftUI app. Pre-release."
featured: false
github: https://github.com/alliecatowo/morbstack
group: agent-systems-devtools
image: /images/projects/morbstack/card.webp
imageAlt: Morbstack's native macOS Containers window with 38 containers, a Compose project and the Kubernetes containers grouped, and the Statistics tab open for a running container.
seo:
  title: "Morbstack: a native macOS Docker Desktop alternative"
  description: "A native macOS Docker Desktop replacement: stock upstream dockerd in one Virtualization.framework VM, a Rust PID 1, and a SwiftUI app. Pre-release."
slug: morbstack
status: published
tags:
  - developer-tools
  - macos
  - containers
  - docker
  - virtualization
  - mcp
technologies:
  - Swift
  - SwiftUI
  - Rust
  - Virtualization.framework
  - Docker Engine
  - vsock
  - MCP
  - Kubernetes
---

**The Docker you wish Docker shipped.**

Morbstack is a native Mac app for Apple silicon that runs the real Docker Engine. It doesn't reimplement Docker: it downloads the static upstream `dockerd`, `containerd`, `runc`, `docker` CLI, Compose and Buildx, pins them by hash, and runs them unmodified inside one lightweight Linux VM on Apple's Virtualization.framework. Everything around the engine is new: a Rust PID 1 in the guest, a Swift host daemon, a `morb` CLI and a SwiftUI app. No account, no Electron.

It's pre-release (the project calls it milestone M0). There's no DMG yet, so you build it from source.

## How it fits together

The Swift daemon owns the VM and relays the Docker socket to the guest over vsock. Inside, `morbinit`, a static Rust PID 1, brings up networking, the data disk, VirtioFS mounts at the same paths as on your Mac, split DNS for `host.docker.internal`, and Rosetta for amd64 images, then supervises stock `dockerd`.

The best story is port publishing. The first version shipped a 174-line patch to Moby so `docker run -P` could allocate ports on the Mac. A refactor on 4 August deleted it: `dockerd` now starts with its own `--userland-proxy-path` flag pointed at `morbinit`, so every published port is leased back to the Mac through a hook upstream already ships. The engine stays byte-for-byte upstream.

![A container selected in Morbstack, with an inspector showing Overview, Logs, Files, Statistics and Inspect tabs.](/images/projects/morbstack/container-detail.webp)

![Morbstack Images table listing 31 images with sizes and architecture, plus archive and tag actions in the inspector.](/images/projects/morbstack/images.webp)

![Morbstack Disk screen comparing the VM disk's 77 GB reserved size with the 6.6 GB it actually uses on APFS.](/images/projects/morbstack/disk.webp)

*The Disk screen finally answers "why is Docker eating my disk": 77 GB reserved, 6.6 GB actually used.*

## A way out, and a careful way in for agents

Leaving is a first-class command. `morb migrate --to` copies images and volumes out to Docker Desktop, Colima, OrbStack or any socket, and verifies each copy. The Migration screen shows a read-only plan before anything moves.

![Morbstack Migration screen detecting Docker Desktop and planning which images to copy across.](/images/projects/morbstack/migration.webp)

`morb mcp` lets an AI agent drive containers, and its design doc starts from "assume the caller can be influenced by input it did not originate." It's read-only by default, every mutating tool belongs to a permission group checked on one call path, deny always wins, and a test pins the list of ungated tools by name so a new tool registered without a group fails CI. There's an audit log and redaction too.

## How it was built

About 490 commits over six days (2 to 7 August 2026), with a team of specialised agents: an engine developer, a macOS developer, a parity tester and a taste reviewer. The docs are unusually blunt about themselves: a live parity audit, a "truthfulness pass" that rewrote docs whose claims had outrun the code, and a screenshot gallery that names its own visual defects.

The newest work, including the screenshot gallery, lives on the [`swarm/cleanup` branch](https://github.com/alliecatowo/morbstack/tree/swarm/cleanup/docs/gallery), which isn't merged into `main` yet. Apache-2.0. Not affiliated with Docker or OrbStack, despite the name.
