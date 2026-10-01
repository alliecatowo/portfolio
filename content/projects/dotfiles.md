---
title: Dotfiles
slug: dotfiles
description: "Allison's Fedora workstation setup, managed with GNU Stow: mise for every toolchain, Zsh and Starship, Ghostty, and Neovim on LazyVim."
date: 2025-06-16
# Draft: not her current setup yet; publish once the repo catches up
status: draft
featured: false
group: earlier-work
technologies:
  - GNU Stow
  - mise
  - Zsh
  - Starship
  - Ghostty
  - Neovim
  - Lua
tags:
  - dotfiles
  - linux
  - fedora
  - developer-environment
github: https://github.com/alliecatowo/dotfiles
---

**A development machine you can rebuild from one repo.**

Allison's dotfiles for Fedora Linux with KDE Plasma, laid out as GNU Stow packages (one directory per tool) so each config can be linked into place on its own. The organising idea is "mise-first": Node, Python, Rust and Go versions all come from [mise](https://mise.jdx.dev/) instead of a separate version manager per language.

The rest is a fast shell and a pleasant terminal: Zsh (and Bash) with a Starship prompt, Ghostty as the terminal, Neovim on LazyVim, and the usual modern CLI tools (lazygit, zoxide, eza, bat, gh).

## Status

The last big change was an October 2025 refactor to the mise-first layout, so this isn't her current setup. The [source is on GitHub](https://github.com/alliecatowo/dotfiles).
