---
title: claude-flip
date: 2025-12-28
description: "Approve or deny Claude Code permission requests with a Flipper Zero: a C Flipper app, a Python BLE bridge, and a PermissionRequest hook that scores risk."
featured: false
github: https://github.com/alliecatowo/claude-flip
group: agent-systems-devtools
slug: claude-flip
status: draft
tags:
  - claude-code
  - hardware
  - flipper-zero
  - ble
  - hooks
technologies:
  - C
  - Python
  - Bluetooth LE
  - bleak
  - Flipper Zero
  - Claude Code
---

## Overview

claude-flip routes Claude Code permission requests to a Flipper Zero. When Claude wants to run a command, the Flipper vibrates and shows the request with a risk label; a D-pad press allows or denies it.

## How it works

- **Flipper app (C)**: uses the BLE serial profile, shows the request, and sends back one letter for allow, deny, always allow or always deny.
- **Python bridge**: a `PermissionRequest` hook scores the request (low to critical), sends it over BLE with [bleak](https://github.com/hbldh/bleak), waits for an acknowledgement, then waits for the button press, retrying flaky connections.
- **Claude Code plugin**: registers the hook and adds slash commands to enable, disable and test it.

The [source is on GitHub](https://github.com/alliecatowo/claude-flip) under the MIT license, with a write-up of the BLE lessons learned along the way.
