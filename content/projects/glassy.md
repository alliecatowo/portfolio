---
title: Glassy
slug: glassy
description: 'A lean GPU terminal emulator in Rust: wgpu instanced rendering, damage-only redraws, no idle frames, 60 themes, and CRT/glass effects. Built for Claude Code.'
date: 2026-06-19
status: published
featured: true
order: 4
group: agent-systems-devtools
technologies:
  - Rust
  - wgpu
  - WGSL
  - winit
  - cosmic-text
  - alacritty_terminal
  - GitHub Actions
  - Homebrew
tags:
  - rust
  - wgpu
  - terminal-emulator
  - gpu-rendering
  - developer-tools
  - claude-code
  - open-source
github: https://github.com/alliecatowo/glassy
image: /images/projects/glassy/card.webp
imageAlt: 'The Glassy terminal showing a directory listing and syntax-highlighted Rust source.'
seo:
  title: 'Glassy: a lean GPU terminal emulator in Rust'
---

**Small and quiet on purpose: a GPU terminal that only draws what changed.**

Glassy is a GPU-accelerated terminal emulator written in Rust, and the repo describes it as "built to run Claude Code". The goal was a terminal that stays small and does nothing while nothing is happening, but keeps up when an agent streams tokens into it. Allison built it in about three weeks, from June 19 to July 9, 2026, much of it pair-programmed with Claude Code: 404 commits and 12 releases, shipped for macOS and Linux. (The Rust file in the screenshots is a demo file, not Glassy's source.)

## How it stays quiet

The core idea is doing no work when nothing changes. There's no frame clock: at idle the winit event loop just waits, and bursts of terminal output are coalesced to at most one frame per monitor refresh, so a flood of streamed tokens becomes one redraw per vsync. Each frame rebuilds only the rows that alacritty's damage tracker marks dirty and reuses the rest from cache.

Text is drawn with wgpu in a single instanced draw call from a glyph atlas, and glyph coverage is blended in linear light in the shader, which gives correctly weighted strokes without an sRGB surface. Glassy asks for the integrated GPU by default, because a 2D grid of glyphs never needs the discrete one (`GLASSY_GPU=high` overrides it). The PTY and VT state machine come from `alacritty_terminal`; Glassy adds its own byte-stream tap alongside it for kitty graphics, sixel, synchronized output and several OSC sequences, passing the bytes through unchanged so it never has to fork the parser.

## Built for an agent's terminal

A lot of the details exist because of Claude Code. Shift+Enter sends the sequence Claude Code reads as a newline instead of submitting. Kitty keyboard protocol negotiation works, so apps that ask for it get it. Hyperlinks stay clickable inside mouse-capturing apps while you hold the modifier. OSC 133 and 633 command blocks and OSC 9 and 777 desktop notifications are supported too.

<video class="w-full h-auto rounded-lg" width="1100" height="702" autoplay muted loop playsinline poster="/images/projects/glassy/command-palette-poster.webp" aria-label="Opening Glassy's command palette, typing 'split' to filter actions, and choosing Split vertical.">
  <source src="/images/projects/glassy/command-palette.webm" type="video/webm">
  <source src="/images/projects/glassy/command-palette.mp4" type="video/mp4">
</video>

## The fun layer

Tabs, splits, a command palette, a live settings overlay, a quake-style drop-down mode and a `glassy @` control socket cover the serious parts. Then there are 60 built-in themes (plus Alacritty and base16 import), GPU post-process window effects (frosted, acrylic, CRT, scanlines, grain, vignette, bloom) that cost nothing when switched off, and Power Mode, which throws sparks behind your cursor while you type.

<video class="w-full h-auto rounded-lg" width="720" height="130" autoplay muted loop playsinline poster="/images/projects/glassy/power-mode-poster.webp" aria-label="Glassy Power Mode: a particle trail sparks behind the cursor while typing quickly.">
  <source src="/images/projects/glassy/power-mode.webm" type="video/webm">
  <source src="/images/projects/glassy/power-mode.mp4" type="video/mp4">
</video>

_Power Mode, cropped to the prompt._

![Glassy with the CRT window effect, the prompt text bent by barrel distortion over faint scanlines.](/images/projects/glassy/effect-crt.webp)

![Glassy settings overlay on the Themes tab with a dropdown of built-in color themes and swatches.](/images/projects/glassy/theme-picker.webp)

## Measuring honestly

Glassy has criterion micro-benchmarks for its hot paths and a scripted hyperfine and vtebench harness that reports missing tools instead of silently skipping them. Its [benchmark notes](https://github.com/alliecatowo/glassy/blob/main/docs/benchmarks.md) include a comparison with ghostty, and the caveat matters: it's from a single machine (a Ryzen 7 6800U on Fedora, June 2026), with two runs each. On that machine Glassy's binary was about 11 MB against ghostty's 123 MB distro binary, idle memory was about 133 MB against 214 MB, and Glassy recorded zero CPU ticks at idle with the default steady cursor. Input latency hasn't been measured, and the notes say so. The current Linux release binary is about 12 MB.

## Shipping it

The repo is its own Homebrew tap. The release workflow renders the cask and formula from templates on every release, publishes GPG-signed apt and dnf repositories to GitHub Pages, and builds `.dmg`, `.deb` and `.rpm` packages. On macOS:

```sh
brew tap alliecatowo/glassy https://github.com/alliecatowo/glassy
brew install --cask glassy
```

Linux install commands for Fedora and Debian/Ubuntu are on the [package repository page](https://alliecatowo.github.io/glassy/), and every build is on the [releases page](https://github.com/alliecatowo/glassy/releases). The latest release is v0.6.1 (July 9, 2026). MIT licensed.
