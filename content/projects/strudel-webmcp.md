---
title: Strudel WebMCP
date: 2026-09-03
demo: https://strudel-webmcp.vercel.app
description: "OpenAI WebMCP Challenge entry: the Strudel live-coding REPL with 13 WebMCP tools, so an agent can edit, propose and listen to the same buffer you perform from."
devpost: https://devpost.com/software/strudel-webmcp
featured: false
github: https://github.com/alliecatowo/strudel-webmcp
group: browser-agents
groupOrder: 4
image: /images/projects/strudel-webmcp/card.webp
imageAlt: Video thumbnail reading "The agent proposes. You hit accept." over a Strudel editor showing an agent proposal diff.
seo:
  title: "Strudel WebMCP: agents in a live-coding REPL"
  description: "OpenAI WebMCP Challenge entry: the Strudel live-coding REPL with 13 WebMCP tools, so an agent can edit, propose and listen to the same buffer you perform from."
slug: strudel-webmcp
status: published
tags:
  - ai-agents
  - webmcp
  - mcp
  - hackathon
  - live-coding
  - music
technologies:
  - WebMCP
  - TypeScript
  - Strudel
  - CodeMirror
  - Web Audio
  - Vite
  - Playwright
video:
  youtube: 30XNqUlsY4o
  title: Strudel WebMCP — OpenAI WebMCP Challenge Demo
  uploadDate: 2026-09-03
---

**Live-code together.**

One of four entries Allison submitted to OpenAI's WebMCP Challenge on 3 September 2026, with the winning [JupyterLite WebMCP](/projects/jupyterlite-webmcp/), [Swagger UI WebMCP](/projects/swagger-ui-webmcp/) and [Careers WebMCP](/projects/careers-webmcp/). It was the last of the four to go in, about 45 minutes before the original deadline.

[Strudel](https://strudel.cc) is a live-coding environment for music in the browser. Strudel WebMCP wraps the official Strudel REPL and gives a browser agent 13 [WebMCP](https://github.com/webmachinelearning/webmcp) tools over the live, unsaved editor buffer and the running scheduler. You can drag an inline slider while the agent rewrites a different line.

## Demo

:youtube-video{#30XNqUlsY4o title="Strudel WebMCP — OpenAI WebMCP Challenge Demo"}

![Strudel live-coding editor after agent edits, with Read, Review and Live permission modes in the header and a recorded audio take below the code.](/images/projects/strudel-webmcp/takes.webp)

## Sharing a buffer with a performer

- **Stale edits lose.** Every tool that changes the code needs the hash from a fresh read, or it fails with `STALE_CODE`. That includes your slider drags, because Strudel sliders rewrite numeric literals in the source, and there's a Playwright test for exactly that case.
- **You set the dial.** The header has Read, Review and Live modes, and only the human can change them. In Review mode the agent's edits become proposals with a diff that you can audition before you accept or discard them.
- **The agent gets ears.** `strudel_record` captures the page's own audio output, per voice if you tag it, with levels and frequency-band analysis, and leaves a playable take in the page. Two other tools work against the sound registry the scheduler actually uses.
- **Same path as you.** Agent edits are evaluated through Strudel's normal Update path, so they become audible exactly the way yours do.

![The editor with inline sliders, the Read, Review and Live dial, and a status line reading WebMCP ready, 13 tools.](/images/projects/strudel-webmcp/slider.webp)

A provenance bug in `strudel_record`'s code hash was fixed after the submission, during the deadline extension.

## Try it

The [live demo](https://strudel-webmcp.vercel.app) works as a plain Strudel REPL; press Play for sound. The agent tools need ChatGPT's in-app browser or Chrome with experimental web platform features turned on.

![The live Strudel WebMCP editor with a drum, bass and lead pattern, and the Read, Review and Live dial in the header.](/images/projects/strudel-webmcp/live-editor.webp)

*The live demo, captured September 2026.*

There's a [demo video](https://youtu.be/30XNqUlsY4o), with a music bed recorded from the app's own audio, and the [Devpost entry](https://devpost.com/software/strudel-webmcp). AGPL-3.0, because it embeds Strudel; credit for the REPL itself goes to the Strudel project.
