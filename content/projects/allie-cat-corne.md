---
title: Allie Cat Corne (ZMK Firmware)
slug: allie-cat-corne
description: 'ZMK firmware for a mislabeled AliExpress Corne: pins recovered from the factory UF2, and a TPS43 touchpad brought up over a BLE split.'
date: 2026-04-16
# Draft until there's a photo of the actual Corne
status: draft
featured: false
group: hardware-homelab
technologies:
  - ZMK
  - Zephyr RTOS
  - Devicetree
  - nRF52840
  - I2C
  - Bluetooth LE
  - Python
  - GitHub Actions
tags:
  - keyboard
  - firmware
  - zmk
  - split-keyboard
  - corne
  - touchpad
  - reverse-engineering
github: https://github.com/alliecatowo/allie-cat-corne
---

**A Corne that said it was a Sofle, a touchpad that wouldn't talk, and the firmware that fixed both.**

I bought a wireless Corne from AliExpress: a Nice!Nano v2 in each half and an Azoteq TPS43 touchpad on the right. The stock firmware called it "Sofle_RGB", and the PCB swaps rows and columns compared with the standard Corne shield, so stock ZMK didn't work.

## Reading the pins out of the factory firmware

Zephyr compiles devicetree into C structs, so there's no pin map to decompile. I wrote `tools/extract_pins.py`, which rebuilds a flat image from the UF2 blocks, finds the GPIO port device structs, follows references to them back to `gpio_dt_spec` arrays, and maps the nRF pins to pro-micro numbers. Running it on the factory backups gave the real pin map, and the ZMK config is built around that.

## Five things wrong at once

The touchpad needed five stacked fixes, each insufficient alone: the right RDY and reset pins; dropping the reset line, because the driver waits less time after reset than the chip needs; forwarding input from the peripheral half to the central over BLE; moving the shield overlays to where ZMK actually loads them (the real blocker, proved by grepping CI logs for the driver name: 0 hits before, 26 after); and flipping the X axis. One more lesson: a DFU reboot resets the microcontroller but not the touchpad chip, so both halves need a power cycle after every flash.

It works: movement, tap-click, press-and-hold and two-finger scroll. CI builds UF2 releases, and a DFU-serial flasher gets around Macs that block USB mass storage.
