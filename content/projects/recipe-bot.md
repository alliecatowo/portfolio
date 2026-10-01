---
title: Recipe Bot
date: 2024-11-16
description: "A 2024 command-line MVP that turns Instagram cooking videos into Markdown recipes: download, transcribe with Whisper, check it is actually a recipe, then write it up with GPT."
featured: false
github: https://github.com/alliecatowo/recipe-bot
group: earlier-work
seo:
  title: "Recipe Bot: Instagram cooking videos to recipes"
  description: "A 2024 CLI that turns Instagram cooking videos into Markdown recipes: download, transcribe with Whisper, check it is a recipe, then write it up with GPT."
slug: recipe-bot
status: published
tags:
  - python
  - cli
  - llm
  - transcription
  - recipes
technologies:
  - Python
  - Instaloader
  - FFmpeg
  - Whisper
  - OpenAI API
  - Firebase
  - prompt_toolkit
  - PDM
---

**The recipe is in the video. Nobody wrote it down.**

Cooking reels say the quantities out loud and leave them out of the caption. Recipe Bot takes an Instagram post URL and gives back a written recipe in Markdown.

## The pipeline

1. **Download**: Instaloader fetches the post's video and caption, and FFmpeg pulls out the audio.
2. **Transcribe**: OpenAI's open-source Whisper model (the `small` size, running locally) turns the audio into text.
3. **Check**: before writing anything, `gpt-4o-mini` reads the transcript and caption and estimates how likely it is that the post contains a recipe at all. Below 85% it stops, so a dance video doesn't come back as a casserole.
4. **Write**: the same model turns transcript plus caption into a structured recipe, saved as Markdown.

Audio and recipes are cached in Firebase Storage with metadata in Firestore, so a post is only downloaded and transcribed once, and there's a small terminal viewer built with prompt\_toolkit for browsing saved recipes and opening them in an editor.

## Status

A command-line MVP that Allison built over a weekend in November 2024 (53 commits), with a web app as the stated next step that never happened. It needs your own OpenAI key and Firebase project. The [source is on GitHub](https://github.com/alliecatowo/recipe-bot), with no license.
