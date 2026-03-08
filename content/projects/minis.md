---
technologies:
  - Python
  - PyTorch
  - LoRA
  - Hugging Face
  - GitHub API
  - Transformers
  - PEFT
tags:
  - ai
  - ml
  - lora
  - fine-tuning
  - github
  - neural-networks
  - personalization
  - open-source
slug: minis
title: Minis
description: Lightweight neural artifacts generated via LoRA fine-tuning from GitHub profiles — distill a developer's coding style into a deployable mini-model.
date: 2025-12-01
status: published
featured: true
github: https://github.com/alliecatowo/minis-v2
---

### Overview

Minis generates **personalized micro-models** from a developer's GitHub profile. Point it at a GitHub user, it scrapes their public repos and commit history, and fine-tunes a small language model via LoRA to capture their coding patterns, documentation style, and technical vocabulary.

The output: a lightweight neural artifact — a LoRA adapter — that can be loaded on top of a base model to produce outputs "in the voice" of that developer.

---

### Problem

Fine-tuning large language models is expensive, slow, and requires significant data curation. Most personalization approaches assume you have a clean, curated dataset. GitHub profiles are the opposite: messy, varied, multilingual across programming languages — but *rich* with authentic developer signal.

The question: can you distill a developer's unique style into something small enough to run locally?

---

### Solution

Minis is a Python pipeline built on **PyTorch**, **Hugging Face PEFT**, and the GitHub API:

- **Profile scraper** — fetches READMEs, comments, docstrings, commit messages, and inline code from public repos
- **Data preprocessor** — filters noise, normalizes formatting, and builds a training corpus
- **LoRA trainer** — fine-tunes a small base model (e.g., Phi-2, Mistral 7B Q4) using PEFT/LoRA for parameter-efficient adaptation
- **Adapter packaging** — exports a `.safetensors` LoRA adapter + metadata for re-use or sharing
- **Inference CLI** — test your mini-model locally with `minis generate --user <github_handle>`

Training a mini takes minutes on a consumer GPU, not hours — LoRA keeps the parameter count tiny while still capturing meaningful stylistic signal.

---

### Challenges

GitHub is not a clean dataset. Boilerplate, generated code, and dependency lock files dominate many repos. Getting the signal-to-noise ratio right required aggressive filtering and tokenization heuristics. LoRA rank selection also matters a lot: too low and nothing sticks, too high and you overfit to a handful of files.

---

### Impact

- Demonstrates practical LoRA fine-tuning on unstructured, real-world data
- Opens the door to "developer digital twins" — models that can continue someone's work in their style
- Useful as a code-style transfer tool, documentation generator, or creative exploration of identity in AI

---

### Reflection

Minis started as a weekend experiment: "can a model learn *me* from just my public GitHub?" The answer is a qualified yes — the adapter picks up vocabulary, commenting habits, and structural preferences reliably. The deeper question of what that *means* for identity, authorship, and AI attribution is still wide open, and that's what makes it interesting.

---

### Tech Stack

**Python**, **PyTorch**, **Hugging Face Transformers**, **PEFT / LoRA**, **GitHub REST API**, **safetensors**, **Mistral / Phi-2 base models**
