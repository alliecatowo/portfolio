---
title: Glassy
date: 2026-06-19
demo: https://alliecatowo.github.io/glassy/
description: "A lean GPU terminal emulator in Rust: wgpu instanced rendering, damage-only redraws, no idle frames, 60 themes, and CRT/glass effects. Built for Claude Code."
featured: true
github: https://github.com/alliecatowo/glassy
group: agent-systems-devtools
image: /images/projects/glassy/card.webp
imageAlt: The Glassy terminal showing a directory listing and syntax-highlighted Rust source.
order: 4
seo:
  title: "Glassy: a lean GPU terminal emulator in Rust"
  description: "A lean GPU terminal emulator in Rust: wgpu instanced rendering, damage-only redraws, no idle frames, 60 themes, and CRT/glass effects. Built for Claude Code."
slug: glassy
status: published
tags:
  - rust
  - wgpu
  - terminal-emulator
  - gpu-rendering
  - developer-tools
  - claude-code
  - open-source
technologies:
  - Rust
  - wgpu
  - WGSL
  - winit
  - cosmic-text
  - alacritty_terminal
  - GitHub Actions
  - Homebrew
---

**Small and quiet on purpose: a GPU terminal that only draws what changed.**

Glassy is a GPU-accelerated terminal emulator written in Rust, and the repo describes it as "built to run Claude Code". The goal was a terminal that stays small and does nothing while nothing is happening, but keeps up when an agent streams tokens into it. Allison built it in about three weeks, from June 19 to July 9, 2026, much of it pair-programmed with Claude Code: 404 commits and 12 releases, shipped for macOS and Linux. (The Rust file in the screenshots is a demo file, not Glassy's source.)

## How it stays quiet

The core idea is doing no work when nothing changes. There's no frame clock: at idle the winit event loop just waits, and bursts of terminal output are coalesced to at most one frame per monitor refresh, so a flood of streamed tokens becomes one redraw per vsync. Each frame rebuilds only the rows that alacritty's damage tracker marks dirty and reuses the rest from cache.

Text is drawn with wgpu in a single instanced draw call from a glyph atlas, and glyph coverage is blended in linear light in the shader, which gives correctly weighted strokes without an sRGB surface. Glassy asks for the integrated GPU by default, because a 2D grid of glyphs never needs the discrete one (`GLASSY_GPU=high` overrides it). The PTY and VT state machine come from `alacritty_terminal`; Glassy adds its own byte-stream tap alongside it for kitty graphics, sixel, synchronized output and several OSC sequences, passing the bytes through unchanged so it never has to fork the parser.

## Built for an agent's terminal

A lot of the details exist because of Claude Code. Shift+Enter sends the sequence Claude Code reads as a newline instead of submitting. Kitty keyboard protocol negotiation works, so apps that ask for it get it. Hyperlinks stay clickable inside mouse-capturing apps while you hold the modifier. OSC 133 and 633 command blocks and OSC 9 and 777 desktop notifications are supported too.

::demo-video
---
height: 702
width: 1100
alt: Opening Glassy's command palette, typing 'split' to filter actions, and
  choosing Split vertical.
mp4: /images/projects/glassy/command-palette.mp4
poster: /images/projects/glassy/command-palette-poster.webp
webm: /images/projects/glassy/command-palette.webm
---
::

## The fun layer

Tabs, splits, a command palette, a live settings overlay, a quake-style drop-down mode and a `glassy @` control socket cover the serious parts. Then there are 60 built-in themes (plus Alacritty and base16 import), GPU post-process window effects (frosted, acrylic, CRT, scanlines, grain, vignette, bloom) that cost nothing when switched off, and Power Mode, which throws sparks behind your cursor while you type.

::demo-video
---
height: 130
width: 720
alt: "Glassy Power Mode: a particle trail sparks behind the cursor while typing
  quickly."
mp4: /images/projects/glassy/power-mode.mp4
poster: /images/projects/glassy/power-mode-poster.webp
webm: /images/projects/glassy/power-mode.webm
---
::

*Power Mode, cropped to the prompt.*

![Glassy with the CRT window effect, the prompt text bent by barrel distortion over faint scanlines.](/images/projects/glassy/effect-crt.webp)

![Glassy settings overlay on the Themes tab with a dropdown of built-in color themes and swatches.](/images/projects/glassy/theme-picker.webp)

## Measuring honestly

Glassy has criterion micro-benchmarks for its hot paths and a scripted hyperfine and vtebench harness that reports missing tools instead of silently skipping them. Its [benchmark notes](https://github.com/alliecatowo/glassy/blob/main/docs/benchmarks.md) include a comparison with ghostty, and the caveat matters: it's from a single machine (a Ryzen 7 6800U on Fedora, June 2026), with two runs each. On that machine Glassy's binary was about 11 MB against ghostty's 123 MB distro binary, idle memory was about 133 MB against 214 MB, and Glassy recorded zero CPU ticks at idle with the default steady cursor. Input latency hasn't been measured, and the notes say so. The current Linux release binary is about 12 MB.

## Shipping it

Releases are published to the `alliecatowo/tap` Homebrew tap automatically: the release workflow renders the cask and formula from templates on every release, and it also publishes GPG-signed apt and dnf repositories to GitHub Pages, and builds `.dmg`, `.deb` and `.rpm` packages. On macOS:

```sh
brew install --cask alliecatowo/tap/glassy
```

The CLI-only formula, `brew install alliecatowo/tap/glassy`, installs a prebuilt binary on macOS and on x86\_64 Linux; on aarch64 Linux it builds from source. Fedora and Debian/Ubuntu users can use the apt and dnf repositories, and every build is on the [releases page](https://github.com/alliecatowo/glassy/releases). Glassy now has a [landing page](https://alliecatowo.github.io/glassy) with install tabs for Homebrew, the install script, apt, dnf and a direct download, plus screenshots from the repo; the apt and dnf repositories are served from the same site. The latest release is v0.6.2 (October 4, 2026). MIT licensed.
