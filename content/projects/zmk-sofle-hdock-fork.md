---
title: AllieCatKeeb Sofle (ZMK Firmware)
date: 2025-08-30
description: A custom split keyboard firmware engineered for power, style, and
  pure typing joy.
featured: false
status: published
technologies:
  - ZMK
  - Bluetooth
  - NRF52
  - Split Keyboards
  - Docs
  - C++
  - GitHub Actions
tags:
  - keyboard
  - firmware
  - zmk
  - bluetooth
  - split-keyboard
  - sofle
  - wireless
  - rgb
  - oled
  - open-source
slug: zmk-sofle-hdock-fork
image: /images/keyboards/rainbow-rgb-split.jpg
github: https://github.com/alliecatowo/zmk-sofle
---

### Overview

The **AllieCatKeeb Sofle** is a fully custom, wireless split keyboard running on the open-source **ZMK firmware**; re-imagined from the ground up to be smarter, prettier, and easier to flash. This project combines embedded firmware development, CI/CD automation, and UX-driven design into a cohesive, community-ready package.

Built for the Eyelash Sofle hardware, the firmware ships with automatic keymap builds, visual diagrams, display support, RGB underglow, and multiple connection modes — all powered by **Nice!Nano controllers** and **GitHub Actions**.

### Problem

ZMK is an incredible ecosystem for custom keyboards but building, flashing, and maintaining firmware across multiple layouts can get complicated fast. I wanted a setup that **“just works”**: a firmware that’s self-updating, CI-verified, and ready to flash without touching a compiler, even for non-technical users.

### Solution

I built a full ZMK development workflow tailored for my **AllieCatKeeb** Sofle, complete with CI/CD, GitBook docs, and prebuilt firmware artifacts.

Key capabilities:

- **Automated firmware builds** for every variant (standard, dongle, and reset) using GitHub Actions.
- **Graphical keymap editor** integration via ZMK Studio — edit your layout without recompiling locally.
- **Dual-mode operation:**
  - Standard split keyboard mode (left-side master).
  - **Dongle mode** using a unified receiver and Nice!Nano-based wireless bridge.
- **OLED and Nice!View display support** with custom status widgets (including a Bongo Cat, of course 🐱).
- **RGB underglow** and low-power tuning for extended battery life.
- **Fully documented GitBook and Wiki**, synced from the repo’s `/docs` directory.

The goal: a firmware that’s developer-friendly but accessible enough for anyone to flash.

### Challenges

Balancing flexibility with ease-of-use was the hardest part. I needed a firmware pipeline that supported three operating modes, auto-built diagrams, and multiple controller targets all without breaking ZMK’s upstream compatibility. Through trial, error, and automation, I built a CI/CD flow that generates, tests, and publishes firmware automatically whenever keymaps change.

### Impact

- Turned firmware flashing into a **one-click process** for users.
- Reduced firmware release prep time from hours to minutes through automation.
- Made the Sofle platform more approachable for newcomers to ZMK.
- Established a maintainable GitBook-based documentation hub for the entire keyboard line.

### Reflection

This project started as a personal obsession with keyboards but it became a case study in **embedded DevOps**. From YAML pipelines to power-saving firmware tweaks, it bridges software reliability and maker creativity. It’s also a reminder that hardware projects deserve the same polish as production software with automated builds, clean docs, and personality.

### Tech Stack

**ZMK Firmware**, **GitHub Actions**, **Nice!Nano v2**, **OLED / Nice!View displays**, **GitBook**, **Markdown Docs**, **Semantic Versioning**
