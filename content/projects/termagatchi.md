---
title: Termagatchi
description: "A Tamagotchi for your terminal: feed it, play with it and chat with it. Underneath, an AI-driven game engine with persistent state and a real-time Textual UI."
technologies:
  - Python
  - Textual
  - Google Gemini
  - OpenAI
  - Anthropic
  - Ollama
  - UV
tags:
  - ai
  - terminal
  - python
  - llm
  - cli
  - game
  - pet
  - textual
featured: false
slug: termagatchi
group: earlier-work
image: /images/termagatchi/termagatchi-2025-09-28-t17-06-13-176682.png
status: published
date: 2025-08-30
github: https://github.com/alliecatowo/termagatchi
imageAlt: Termagatchi running in a terminal, with stat bars, a pixel-art pet, and a chat with the pet
seo:
  title: "Termagatchi: an AI pet that lives in your terminal"
  description: "A Tamagotchi for your terminal: feed it, play with it and chat with it. Underneath, an AI-driven game engine with persistent state and a real-time Textual UI."
---

## Overview

Termagatchi started as a joke between productivity and nostalgia: “what if you could have a Tamagotchi in your terminal?” It evolved into a fully interactive command-line companion powered by modern language models.

You feed it, play with it, and chat with it like a tiny coworker who lives in your shell; except under the hood, it’s running an **AI-driven game engine**, persistent state management, and a **real-time Textual UI** that turns your terminal into a digital habitat.

<video class="w-full h-auto rounded-lg" width="1300" height="900" autoplay muted loop playsinline poster="/images/projects/termagatchi/demo-poster.webp" aria-label="A terminal recording of Termagatchi in offline mode: an ASCII-dot pet sits in the left pane with a chat log on the right. The commands /feed, /play and /pet are typed in turn, and the log answers 'Fed Kibble!', 'Played with Ball!' and 'Pet loves the attention!'.">
  <source src="/images/projects/termagatchi/demo.webm" type="video/webm">
  <source src="/images/projects/termagatchi/demo.mp4" type="video/mp4">
</video>

_Run with no AI provider configured, so it starts in offline mode. The three commands are typed into the input bar and the pet's replies land in the chat log._

## Problem

Most AI projects chase complexity with web dashboards, APIs, flashy front-ends. I wanted to do the opposite: build something _delightful_ and _deeply technical_ that lives where developers actually are: the command line.

The goal was to combine:

- nostalgic interaction (virtual pets),
- a modern terminal UI,
- and advanced conversational AI — all without leaving the shell.

## Solution

I built Termagatchi using **Python 3.11+**, **Textual**, and **UV**, blending game logic, LLM interaction, and terminal UX into one package.

**Core systems:**

- 🤖 **AI Personality Engine** – Integrates Google Gemini, OpenAI, Anthropic, or local Ollama models.
- 🎮 **Game Loop** – Manages hunger, happiness, energy, hygiene, affection, and health in real time.
- 📊 **Persistent Saves** – Your pet remembers everything between sessions.
- 🎨 **Textual UI** – Responsive, animated, and color-themed interface.
- ⚙️ **Extensible Framework** – Modular provider system for AI backends and mechanics.

The whole thing runs locally. No backend, no cloud dependency; just pure Python and a healthy dose of serotonin.

## Challenges

The biggest challenge was balancing _game feel_ with _AI performance_. LLMs are slow compared to a traditional game loop, so I built a hybrid tick system that keeps gameplay responsive while AI tasks run asynchronously. Designing believable personality states, ones that persist and evolve naturally, was another rabbit hole entirely.

## Impact

- Brought **AI interaction into the command line** in a way that’s actually fun.
- Demonstrated real-time stateful gameplay over LLM backends.
- Used by developers and hobbyists as both a demo app and stress relief tool.
- Laid the groundwork for future “AI pet” experiments and interactive CLIs.

## Reflection

Termagatchi is a love letter to the terminal; proof that creativity and code can coexist in a text window. It’s whimsical, a little absurd, and deeply technical under the hood. It taught me a lot about threading, UI design, and how to make AI _feel alive_ instead of just “smart.”

## Tech Stack

**Python 3.11+**, **Textual**, **UV**, **TOML**, **LLM APIs (Gemini, OpenAI, Anthropic, Ollama)**
