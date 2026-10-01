---
title: Lily58 HolyKeebs QMK Fork
description: A QMK fork that brings Vial to the HolyKeebs Lily58 tree, keeps its trackball, touchpad and trackpoint drivers, and ships prebuilt firmware built in CI.
technologies:
  - C
  - QMK
  - Vial
  - GitHub Actions
tags:
  - keyboard
  - firmware
  - qmk
  - vial
  - split-keyboard
  - lily58
  - holykeebs
  - trackball
  - touchpad
  - open-source
github: https://github.com/alliecatowo/allie-cat-keeb-vial
slug: lily58-holy-keebs-qmk-fork
group: hardware-homelab
image: /images/keyboards/keyboards-collection-1.jpg
status: published
date: 2025-08-30
featured: false
imageAlt: A Lily58 split keyboard in a pink case with grey and navy keycaps, a red trackpoint on the left half and a square touchpad module between the halves
seo:
  title: Lily58 HolyKeebs QMK fork with Vial support
  description: A QMK fork that brings Vial to the HolyKeebs Lily58 tree, keeps its trackball, touchpad and trackpoint drivers, and ships prebuilt firmware built in CI.
---

## Overview

I love split boards and pointing modules, but the Holykeebs QMK tree lagged behind on **Vial** support.
So I forked it, integrated Vial cleanly, kept **all** of Holykeebs’ pointer drivers (trackball, touchpad, trackpoint), and layered on **automation**: CI builds, release artifacts, keymap diagrams, and versioned tags. The result is a keyboard firmware that **just works** for Lily58 (and friends), with real-time configuration and zero drama.

---

## Problem

- Holykeebs’ excellent pointer stack lived on an older QMK base → **no modern Vial**.
- New users had to compile locally, pick flags, and hope nothing broke.
- Release management was manual and fragile.

---

## Solution

A maintained fork that backports and wires **Vial** into the Holykeebs tree while preserving device support, plus a production-style delivery pipeline.

**What I built**

- **Vial core integration** (protocol, keycodes, defs, `.vil`) with **VIA compatibility** kept intact.
- **Automated GitHub Actions**: build all variants, attach artifacts to releases, generate keymap diagrams, changelog on tag.
- **Memory footprint tuning** for RP2040 targets (Vial + pointers without blowing flash).
- **Build script** for common combos (dual devices, left/right halves, debug vs release).
- **Prebuilt firmware** so non-devs can drag-and-drop `.uf2` and go.

---

## Features

- ✅ **Full Vial** (real-time config, no reflashing)
- ✅ **Holykeebs pointing devices**
  - Pimoroni RGB trackball
  - Azoteq IQS5xx TPS43 touchpad
  - PS/2 trackpoint
  - Dual-pointer configs
- ✅ **VIA compatible** (for folks who prefer VIA)
- ✅ **Automated builds & releases** (Actions)
- ✅ **Keymap diagram autogeneration**
- ✅ **Debug + standard firmware flavors**

---

## Architecture

| Layer            | What it does                                               |
| ---------------- | ---------------------------------------------------------- |
| **QMK fork**     | Holykeebs drivers + Vial backport + memory optimizations   |
| **Build system** | Make targets + `build.py` options for side/device variants |
| **CI/CD**        | GitHub Actions: build matrix → artifacts → release tagging |
| **Docs**         | Repo README + Holykeebs docs links + usage recipes         |

---

## Developer UX (why this matters)

- **One-click firmware**: grab the right `.uf2` from Releases and flash both halves.
- **Real-time tuning**: open Vial → edit layers, macros, pointer settings live.
- **Predictable releases**: tag `vX.Y.Z` → CI builds everything and publishes.
- **Portable**: no local toolchain unless you’re hacking internals.

---

## Impact

- Made advanced **pointer + split** setups accessible to non-compilers.
- Reduced “it doesn’t detect in Vial” support churn by shipping the **correct** images.
- Standardized release hygiene for a niche but passionate hardware community.

---

## Reflection

Firmware should be **pleasant**. This project treats keyboard firmware like a real product: reproducible builds, versioned releases, crisp docs, and room to tinker. It’s also a fun intersection of embedded constraints, UX, and CI discipline.

---

## Tech Stack

**QMK (forked), Vial, VIA, RP2040 targets, GitHub Actions, Python build scripts**

---

## Links

- 🛍️ [Holykeebs Store](https://holykeebs.com)
- 📖 [Holykeebs Docs](https://docs.holykeebs.com)
