---
title: Building an Agent-Native Notebook Without a Chatbot
author: Allison Coleman
category: dev
date: 2026-11-02
description: JupyterLite WebMCP gives a browser agent 22 tools over your live notebook and no chat box. How the write path, access control and Propose/Deny work.
featured: false
featured_image: /images/projects/jupyterlite-webmcp/gallery-review-comments.webp
ogImage: /images/og/jupyterlite-webmcp.png
published: false
slug: agent-native-notebook
tags:
  - jupyter
  - jupyterlite
  - webmcp
  - agents
  - typescript
---

*JupyterLite WebMCP was one of ten winners of OpenAI's WebMCP Challenge, out of nearly 2,500 projects. I built it with Juan Mendoza and a team of AI agents. This post is about the code.*

The usual way to add AI to a notebook is a chat panel: a sidebar, a text box, a model picker and an API key field.

**JupyterLite WebMCP has none of those.** It registers 22 typed tools on the page through WebMCP (`document.modelContext.registerTool`), and whatever agent your browser has calls them. The extension ships no model, no server and no keys.

One design question shaped everything: **would this still make sense if the second participant were a human?** So the agent edits the live document instead of a copy, can't silently overwrite you, can only run cells you can see, and obeys access levels it can't change. As the README puts it: *"It is not an assistant with a scratch space. It is a second editor in your document."*

## Architecture: seven plugins, one door

The extension is seven JupyterLab plugins. **Only one of them, `tools`, touches WebMCP.** The other six (review threads, access levels, activity markers, Propose mode, a side panel, output selection) are ordinary notebook features that work fine without an agent.

That is deliberate. The app has to be fully useful on its own, and the agent layer is a thin adapter over the same operations the UI uses. If WebMCP isn't available, the status bar says `WebMCP unavailable` and everything else keeps working.

The 22 tools fall into four groups:

- **Context and navigation:** get context, list the workspace, open, create, focus and export notebooks
- **Cells:** read, insert (never executes), update, delete, check access
- **Execution:** run specific cells, save, interrupt or restart the kernel
- **Review:** list, create, reply to, resolve and reopen comments

**There's no "execute this string" tool, by design.** A test asserts that no tool name matches `eval|exec|run_code`. If the agent wants to run code, it has to put it in a visible cell first, where you can see it.

## The write path: read, hash, write

Every tool that changes a cell requires the `sourceHash` from a prior read. If the cell changed since then, because you typed in it or a collaborator did, **the write fails with `STALE_CELL`**. The error includes the current hash and a preview. Nothing is ever merged silently.

I call this rule **"the human always wins."** It also covered a case I didn't design for: with `jupyter-collaboration` (real-time multi-user Jupyter), the same check protects a *remote* human's edits from the agent with no extra code, because everyone writes to the same shared model.

Results are bounded too. All limits live in one file: 50 KiB per result, 25 KiB of cell source per read, 100 cells. **Oversized writes are rejected rather than truncated**, so the agent never ends up with half a cell.

## Access control: hidden means nonexistent

You can mark any cell, or a whole notebook, as **Editable, Read only or Hidden** for the agent. Only you can change these settings. The agent can read them but has no tool to set them.

Hidden is the hard one. A hidden cell doesn't return "access denied," because that tells the agent something is there. **It returns `CELL_NOT_FOUND`, exactly as if it didn't exist.** That has to hold everywhere the agent could learn about a cell: listings, focus, export, output selection and review anchors. One checkpoint enforces it.

It leaked twice during the build, through comment anchors and through focus and selection. Both leaks were found and closed before submission.

The README is upfront about limits: **this is a guardrail, not a sandbox.** Code the agent runs in a visible cell can still read the workspace.

## Presence without lying

When an agent works in your notebook, you should see it. When a tool call starts, the cell gets a ring and a tint, and a badge walks through `Reading… → Applying… → Running… → Done`. Outputs the agent ran are labeled. A "±N changed" chip opens a diff titled "What the agent changed," so you can review every edit.

What the UI never does is claim an agent is *connected*, because **a page can't know that.** WebMCP has no "an agent is here" signal, only tool calls when they happen.

On the second night, the status bar did say an agent was connected when none was. I objected, and Claude removed what it called **"the one dishonest pixel."** The status bar now reads only `WebMCP ready`, `WebMCP unavailable` or `WebMCP error`, and mentions an agent only while a call is in flight. **A unit test fails if an idle status ever contains the word "agent."**

## Propose/Deny: a tool call that waits for you

By default, the agent edits directly and you review the diff afterward. **Propose mode** changes that. Flip the toggle, and `jupyter_update_cell` becomes a question.

The edit appears as an inline banner under the cell, with a red/green diff, **Accept**, **Deny** and a reason field. The tool call's Promise doesn't resolve, so **the agent waits for as long as your decision takes.**

- **Accept** runs the edit through the same function Direct mode uses, so there's exactly one place a cell's source is ever written. It re-checks the hash, so if you edited the cell while deciding, you still win.
- **Deny** returns a normal result, not an error: `PROPOSAL_DENIED` plus your reason. **The agent reads "denied, because…" and revises** instead of blindly retrying.
- Only one proposal can be pending per cell, and the banner isn't a popover, so you can't lose a pending decision by clicking elsewhere.

I cut this feature the night before the deadline. The next afternoon, with 12 extra hours, I described it in one message and **it shipped in 32 minutes.** An independent AI-assisted review later singled it out: *"Denial returns a human reason as a normal result, allowing constructive revision."*

## Review threads that survive editing

You can comment on a cell, a range of code, or an output, Google Docs style, and the agent can read, reply to, resolve and create threads with the same tools.

The hard part is code moving underneath a comment. A range comment stores the selected text, its hash and some surrounding context. When the source changes, it re-anchors into one of four explicit states: **`exact`, `reanchored`, `orphaned` or `cell-missing`**. It never guesses silently.

Threads live in the notebook's own metadata, alongside access levels and a short history of human versus agent edits. **Download the `.ipynb` and the conversation goes with it.**

## Small decisions that matter

- **Moving your view isn't read-only.** Focus and open tools don't change data, but they're marked `readOnlyHint: false` because they scroll *your* screen.
- **Notebook content is untrusted.** Every tool that returns it sets `untrustedContentHint: true`, because a cell can contain instructions aimed at the agent.
- **Headers matter.** The demo sends cross-origin isolation headers so the Python runtime gets a real `SharedArrayBuffer`, which is why the demo moved to Vercel.

## It runs where Jupyter runs

The same package works in **JupyterLite, JupyterLab 4.6 and Notebook 7** with no code changes. It's on PyPI:

```text
pip install jupyterlite-webmcp
```

**By the numbers:**

- 22 tools, 7 plugins, about 11,000 lines of TypeScript
- 300+ unit tests and 52 Playwright browser tests
- CI covering lint, types, unit tests, the extension build, the site build and browser tests

## What's next

The near-term roadmap is mostly the honest gaps:

- **Propose for insert, delete and run**, not just update
- **Run a proposed cell before accepting it**, so you can see what it does
- **Show the agent in the collaboration presence layer**, like any other cursor
- **Widgets**, like sliders, which weren't working in the demo: tweak a slider and the agent sees how you tweaked it
- **Export the whole notebook as an image or PDF**, so the agent can see it the way you do

Longer term, I'd like a free hosted version, so anyone can open a notebook and let their agent work in it while they watch, with the core staying open source.

## Key takeaways

- **No chat box required.** An agent-native app is a set of honest, typed operations over live state.
- **Read, hash, write.** Stale writes fail, and the human always wins.
- **Hidden means nonexistent**, enforced at a single checkpoint.
- **Never claim what the page can't know.** Show tool calls, not "connected."
- **Let tool calls wait for people.** A denied proposal with a reason is better feedback than an error.

Juan Mendoza has been on this project since the second night, when he rewrote the demo's shooting script. He tests it, films it and tells me when something doesn't make sense, and he opened the first pull request after the win.

---

[Live demo](https://jupyterlite-web-mcp.vercel.app/lab/index.html) (Chrome with Experimental Web Platform features enabled) · [GitHub](https://github.com/alliecatowo/jupyterlite-web-mcp) · [PyPI](https://pypi.org/project/jupyterlite-webmcp/) · [Devpost](https://devpost.com/software/jupyterlite-webmcp) · Follow along on X: [@AllieCatOwO](https://x.com/AllieCatOwO)
