---
title: Keyboard Layout Visualizer
date: 2026-03-25
description: A Raycast extension that reads QMK/Vial and ZMK keymaps straight off the board over USB and draws every layer as SVG, with reverse key search.
featured: false
github: https://github.com/alliecatowo/raycast-keyboard-layout
group: hardware-homelab
image: /images/projects/raycast-keyboard-layout/card.webp
imageAlt: "A dark SVG drawing of the navigation layer of a split keyboard: number keys across the top, Home, Page Down, Page Up and End on the left, arrow keys on the right, and faded ghost keys where the layer is transparent."
seo:
  description: A Raycast extension that reads QMK/Vial and ZMK keymaps straight off the board over USB and draws every layer as SVG, with reverse key search.
  title: "Keyboard Layout Visualizer: QMK/ZMK in Raycast"
slug: raycast-keyboard-layout
status: published
tags:
  - keyboard
  - qmk
  - vial
  - zmk
  - raycast
  - macos
  - developer-tools
technologies:
  - TypeScript
  - React
  - Raycast API
  - node-hid
  - serialport
  - Protocol Buffers
  - SVG
---

**Which layer was the arrow keys on again?**

Split keyboards with five layers are great right up until you forget where something lives. This Raycast extension answers that from the launcher: it shows the active board's keymap, one layer at a time or all stacked, and it can search backwards from a key name to every board and layer it appears on.

## Reading the board, not a file

The headline feature is that you don't have to export anything. Plug in the keyboard, run **Add Board**, and it reads the keymap over USB:

- **Vial (QMK)** boards over raw HID, using the Vial protocol, including fetching and decompressing the board's LZMA-compressed layout definition.
- **ZMK** boards over serial with ZMK Studio's protobuf RPC.

Raycast extensions can't load native Node modules, so the USB work lives in two small helper scripts (`node-hid` and `serialport`) that the extension runs as separate processes and talks to over JSON. If a board isn't plugged in, it can import a QMK `keymap.json`, a ZMK `.keymap` devicetree file, or one found in a public GitHub repo.

## Drawing it

Keymaps are rendered to SVG by the extension's own renderer: keycaps with a slight 3D bevel, colours by key category, split boards detected and optionally shown one half at a time, and "ghost" keys, where a transparent key on a higher layer shows the key it inherits at half opacity. Labels come from vendored keycode tables (Vial's for QMK, ZMK's own `dt-bindings` for ZMK, without translating one into the other), so mod-taps like `LT(2, KC_SPC)` read as "Spc" and "L2". There are six themes, and per-key RGB effects can be simulated on the drawing.

![The base layer of a sample split keyboard drawn by the extension's SVG renderer in dark mode: QWERTY with home-row mod-taps labelled Cmd, Alt, Ctrl and Shift under their letters, and MO(1) and MO(2) layer keys labelled L1 and L2.](/images/projects/raycast-keyboard-layout/base-layer.webp)

*The extension's own renderer, run in Node outside Raycast on a keymap I wrote for the occasion: a Corne-style 3x6 split with home-row mod-taps. Mod-taps show the tap key with the modifier underneath, and layer keys show their target layer.*

![The navigation layer of the same sample keyboard in light mode. Keys inherited from the base layer are drawn faded as ghost keys; the number row, Home/End cluster, arrow keys, media keys and function keys are coloured by category.](/images/projects/raycast-keyboard-layout/nav-layer-light.webp)

*The same renderer's light theme on the navigation layer. Transparent keys fall through to the base layer and are drawn at low opacity; the rest are coloured by category. This is the SVG the extension shows inside Raycast, not a screenshot of Raycast itself.*

Beyond viewing, there are nine commands in all, including a hotkey-friendly quick layer peek, a menu-bar layer indicator that polls the board, a keypress tester that tracks coverage, and a Board Settings screen that reads and writes QMK settings, RGB lighting and layer names over USB.

## Status

Allison built it in one evening in March 2026 (45 commits), and it's tagged 1.0.0 with lint and build CI green. It is not on the Raycast Store, so for now it runs from source in Raycast's developer mode on macOS, with a separate `npm install` for the USB helpers. The [source is on GitHub](https://github.com/alliecatowo/raycast-keyboard-layout); there's no license yet.
