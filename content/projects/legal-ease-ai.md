---
title: LegalEase AI
date: 2025-08-30
demo: https://legal-ease.app
description: "Legal discovery search for messy evidence on Firebase: Nuxt 4 dashboard, Genkit flows, Gemini summaries, Chirp 3 transcription, and hybrid search in Qdrant Cloud."
featured: false
github: https://github.com/alliecatowo/legalease-ai
group: earlier-work
image: /images/legalease/search-hero-pink-dark.png
imageAlt: LegalEase AI search page in the dark pink theme, with the hybrid search box and filters for cases, types and levels
seo:
  title: "LegalEase AI: cloud-native legal discovery"
  description: "Legal discovery search for messy evidence on Firebase: Nuxt 4 dashboard, Genkit flows, Gemini summaries, Chirp 3 transcription, and hybrid search in Qdrant Cloud."
slug: legal-ease-ai
status: published
tags:
  - ai
  - legal
  - discovery
  - firebase
  - genkit
  - nuxt
  - vector-search
  - ocr
  - speech-to-text
technologies:
  - Nuxt
  - Vue
  - TypeScript
  - Firebase
  - Genkit
  - Gemini
  - Qdrant
  - Speech-to-Text
---

## Overview

LegalEase AI is a workspace for legal teams, investigators, and anyone who has to wrestle with piles of unstructured evidence like PDFs, video and audio. It turns raw files into transcribed, summarized, searchable case material.

The first version was self-hosted (FastAPI, Celery, Ollama, WhisperX); that design lives on the repo's `archive/self-hosted` branch. The current `main` is a cloud-native rewrite on Firebase.

::demo-video
---
height: 514
width: 800
alt: Animated walkthrough of the LegalEase AI dashboard, searching case
  documents and browsing the results.
mp4: /images/legalease/demo.mp4
poster: /images/legalease/demo-poster.webp
webm: /images/legalease/demo.webm
---
::

---

## Problem

Legal discovery is chaos: mixed file formats, poor metadata, and a lot of audio and video nobody has time to listen to. I wanted a way to **search, summarize, and reason across a case's files** without reading every one.

---

![LegalEase transcript view: a two-speaker conversation split into timestamped, speaker-labelled segments, with per-speaker word counts and speaking time](/images/legalease/transcription-speaker-diarization.png)

---

## Solution

The current app is a **Nuxt 4 dashboard** (Nuxt UI, Firebase Auth and Firestore) backed by **Firebase Cloud Functions (2nd gen) running Genkit flows**:

- **Transcription** with Google Speech-to-Text v2 (Chirp 3), including speaker-labelled segments.
- **Summaries** generated with Gemini 2.5 Flash.
- **Hybrid retrieval** combining keyword and vector search in Qdrant Cloud.
- **Document extraction** through a provider registry that includes a Docling service.
- **A separate landing and docs site** (Nuxt Content on GitHub Pages) at legal-ease.app. The app itself is not hosted publicly; the demo link is the landing page.

Because this version sends audio and text to Google Cloud services, it is not an air-gapped tool; the earlier self-hosted architecture is the one built for that.

---

## Challenges & Lessons

Getting transcription and search to work together on long recordings meant treating each step as its own retryable flow. Swapping the stack also taught me to keep providers (transcription, storage, document parsing) behind small registries so the pipeline survives a rewrite of any one piece.

---

## Reflection

LegalEase started as a local-first experiment and was rebuilt around managed services to get to a working product faster. It remains a good example of choosing a stack on purpose, and the base for several spin-off tools in my stack.

---

## Tech Stack

**Nuxt 4**, **Vue 3**, **TypeScript**, **Firebase (Auth, Firestore, Cloud Functions)**, **Genkit**, **Gemini**, **Google Speech-to-Text v2**, **Qdrant Cloud**, **Docling**
