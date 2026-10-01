---
title: Building an Agent-Native Notebook Without Adding a Chatbot
author: Allison Coleman
category: dev
date: 2026-10-01
description: JupyterLite WebMCP gives a browser agent 22 tools over your live notebook and no chat box. How the write path, access control, presence UI and Propose/Deny actually work.
featured: false
published: false
slug: agent-native-notebook
tags:
  - jupyter
  - jupyterlite
  - webmcp
  - agents
  - typescript
---

_JupyterLite WebMCP was one of the ten winners of OpenAI's WebMCP Challenge. I built it with Juan Mendoza and with a number of agents; the rest of this series covers that. This post covers the code._

The usual way to add AI to a notebook is a chat panel: a sidebar with a text box, a model picker and an API key field. JupyterLite WebMCP has none of those. It registers 22 typed tools on the page through WebMCP (`document.modelContext.registerTool`), and whatever agent your browser has calls them. The extension has no model, no server and no keys.

The design question that shaped the extension was: **would this still make sense if the second participant were a human?** As a result, the agent edits the live shared model instead of a scratch copy, can't silently overwrite you, can only run cells you can see, leaves comments in the document, and obeys access levels it can't change. The README puts it this way: "It is not an assistant with a scratch space. It is a second editor in your document."

## Shape: seven plugins, one door

The extension is seven JupyterLab plugins: `review`, `access`, `activity`, `propose`, `panel`, `output-selection` and `tools`. Only `tools` touches `document.modelContext`. The other six are ordinary notebook features (review threads, access levels, activity markers, a side panel) that work fine with WebMCP absent. This is intentional. The app has to be fully useful without an agent, and the agent layer is a thin adapter over the same operations the UI uses.

Registration happens once, at activation. It's feature-detected, with no polyfill, and guarded against double registration on hot reload. If WebMCP isn't there, the status bar says `WebMCP unavailable` and everything else keeps working.

The 22 tools fall into four groups:

- **Context and navigation:** `jupyter_get_context`, `jupyter_list_workspace`, `jupyter_open_notebook`, `jupyter_create_notebook`, `jupyter_focus_cell`, `jupyter_export_notebook`, `jupyter_get_output_selection`
- **Cells:** `jupyter_get_cells`, `jupyter_get_cell_access`, `jupyter_insert_cell` (never executes), `jupyter_update_cell`, `jupyter_delete_cell`
- **Execution:** `jupyter_run_cells` (explicit ids or a contiguous range), `jupyter_save_notebook`, `jupyter_kernel_action` (interrupt or restart)
- **Review:** list, get, create, reply, resolve, reopen and focus comments

There is no "execute this string" tool, by design. A Playwright test asserts that no tool name matches `eval|exec|run_code`. If the agent wants to run code, it has to put that code in a visible cell first, where you can see it.

## The write path: read, hash, write

Every tool that changes a cell needs the `sourceHash` from a prior read. If the cell changed since then (because you typed in it, or a collaborator did), the write fails with `STALE_CELL`, and the error carries the current hash and a preview. It's never merged.

The hash is two FNV-1a 32-bit passes with different offset bases, giving 16 hex characters, over `cellType + '\u0000' + source`. The NUL separator is there so a code cell and a markdown cell with adjacent text can't collide. That bug got fixed on the first night (`9f25cf9`). The notebook as a whole gets a revision string built the same way.

I call this rule "the human always wins." It also covers a case I did not design for. Behind `jupyter-collaboration` (real-time multi-user Jupyter), the same check protects a _remote_ human's edits from the agent with no extra code, because the agent writes to the same shared model everyone else does.

Results are bounded too. Every cap lives in one file (`src/limits.ts`): 50 KiB per result, 25 KiB of cell source per read, 10 KiB of text output, 100 cells. Oversized writes are rejected rather than truncated, so the agent never ends up with half a cell.

## Access control: hidden means nonexistent

You can set any cell, or a whole notebook, to Editable, Read only or Hidden for the agent. Only the human can change it, from the cell's right-click menu or the Agent panel. The agent can read the levels but has no tool to set them.

Hidden is the harder level. A hidden cell doesn't answer "access denied," because that tells the agent something is there. Looked up by id, it answers `CELL_NOT_FOUND`, exactly as if it didn't exist. That has to hold everywhere the agent could learn about a cell: listings, focus, export, output selection and review anchors. One checkpoint (`src/access/guard.ts`) enforces it.

It leaked twice during the build, and both leaks were found and closed before submission: once through review-comment anchors (`97d266a`) and once through focus and selection (`6e639ff`). Range reads still report a `hiddenCellCount`, so the agent knows _something_ is hidden in a range without knowing what.

The README states the limits, and they apply here too. This is a guardrail, not a sandbox. Code the agent runs in a visible cell can still read the workspace. The model fails open to Editable. Metadata can be edited by hand.

## Presence without lying

When an agent works in your notebook, you should be able to see it. When a tool call starts, the cell gets a ring and an edge tint, and a badge walks through `Reading… → Applying… → Running… → Done` (or `Failed`). Outputs the agent ran say "Run by Browser agent · HH:MM:SS." A "±N changed" chip opens a line diff titled "What the agent changed." All of it uses `box-shadow: inset`, so nothing shifts the layout, and it respects `prefers-reduced-motion`.

What the UI never does is claim an agent is _connected_. A page can't know that. WebMCP has no "an agent is here" signal, only tool calls when they happen. On the second night, the status bar said an agent was connected when none was, and I objected: "i dont thinkt heres na agent connected it looks hideos". Claude called it "the one dishonest pixel" and removed it (`4b6ffe6`). The status bar now only ever reads `WebMCP ready`, `WebMCP unavailable` or `WebMCP error`. It mentions an agent only while a call is actually in flight or just finished (`Agent · running cell 5`). A unit test fails if an idle status string contains the word "agent."

That decision had later consequences, covered in post 4.

I objected because the status was inaccurate and broke a design rule: adding WebMCP shouldn't change the interaction model or add UI that isn't true. A judge seeing "agent connected" with no agent would have been right to stop trusting everything else on the screen.

The same rule applies to the "Ask about this output" chip. Highlight text inside a cell output and the chip shows exactly what would be shared. It says it can't contact an agent: "This only prepares that context — it cannot open, notify, or otherwise contact an agent."

## Propose/Deny: a tool call that waits for you

By default the agent edits directly, and you see the diff afterward. Propose mode changes that. Flip the toggle in the Agent panel, and `jupyter_update_cell` turns into a question.

When the agent calls it, the edit shows up as an inline banner under the cell with a red/green diff, **Accept**, **Deny** and a reason field. The tool call's `execute()` Promise does not resolve, so the agent waits for as long as the decision takes.

- **Accept** runs the edit through the _same_ `updateCell` function Direct mode uses. There's "exactly one place a cell's source is ever written." It re-checks the hash, so if you edited the cell while deciding, Accept fails `STALE_CELL`. You still win.
- **Deny** resolves the call with a normal, non-error result: code `PROPOSAL_DENIED` plus whatever reason you typed. The agent reads "denied, because…" and revises, instead of treating it as a failure and retrying.
- Only one proposal can be pending per cell (`PROPOSAL_ALREADY_PENDING`), and an `AbortSignal` cancels one cleanly.
- The banner is not a popover, because popovers close when you click outside them, and you shouldn't lose a pending decision by clicking somewhere else.

I wanted this from the start and cut it the night before the deadline ("okay ship without it"). The next afternoon, with twelve extra hours, I typed the spec into one message, and it shipped in 32 minutes. An independent AI-assisted review later singled it out: "Denial returns a human reason as a normal result, allowing constructive revision." The same review named the real gap: Propose only covers updates. Insert, delete and run are still direct.

## Review threads that survive editing

You can comment on a whole cell, a range of source text, or an output, Google Docs style, and the agent can read, reply to, resolve and create threads with the same tools. That idea came from a 7 PM message: "OH WHAT IF YOU COULD JUET LIKE CLAUDES DIFF REVIEW."

The hard part is code moving under a comment. A range comment stores the selected text, its hash, and up to 80 characters of context on each side. When the source changes, it re-anchors into one of four explicit states, `exact`, `reanchored`, `orphaned` or `cell-missing`, by scoring candidate matches on their surrounding context. It doesn't guess silently.

Threads live in the notebook's own metadata (`metadata.jupyterlite_webmcp_review`). So do access levels and a short per-cell history of human versus agent edits. Download the `.ipynb` and the conversation goes with it.

## Small decisions

Smaller design choices:

- `jupyter_focus_cell`, `jupyter_focus_comment` and `jupyter_open_notebook` don't change any data, but they're marked `readOnlyHint: false`, because they move _your_ viewport. Scrolling someone's screen isn't read-only.
- Every tool that returns notebook content sets `untrustedContentHint: true`. A cell can contain anything, including instructions aimed at the agent.
- The demo site sends `COOP: same-origin` and `COEP: credentialless`, so Pyodide gets a real `SharedArrayBuffer`. That's why the demo moved from GitHub Pages to Vercel.

## It runs where Jupyter runs

The same wheel works in JupyterLite, JupyterLab 4.6 and Notebook 7 with no code changes. As of September 30 it's on PyPI:

```
pip install jupyterlite-webmcp
```

On the day I published it, a review agent noticed that the live demo had deployed with no extensions in it. The site loaded and served the correct headers, but the extensions were missing. This is fixed. Post 7 has the story.

## By the numbers

- 22 tools, 7 plugins, about 11,000 lines of TypeScript in `src/`
- 300+ unit tests (Jest) and 52 Playwright tests, which drive the built extension through a test-only WebMCP shim
- CI runs lint, types, unit tests, the extension build, the JupyterLite site build and Playwright
- Tested by hand in Chrome 150 with the WebMCP flag, and demoed in ChatGPT's and Codex's in-app browsers

## What's next

The near-term roadmap is mostly the gaps:

- Propose for insert, delete and run, not just update
- Run a proposed cell _before_ you accept or deny it, so you can see what it does
- Show the agent in the Yjs awareness layer, so collaborators can see it like any other cursor
- A 0.1.1 release (packaging is prepped)
- Talk to Jupyter maintainers about what's worth upstreaming

The longer-term plan is a hosted platform. I want a free hosted version (SaaS or PaaS), because most people will not host their own. For example, to do some data science, ChatGPT could visit the site, start a free notebook, and work in it in its own browser while the user watches. Paid hosted options, such as storage, could be added on top. The model is Apache Spark and Databricks: Databricks is Spark with a platform around it, and people pay for the convenience. The core stays open source.

Other planned work:

- **Multiplayer**, properly
- **More AI-native features**, and making it work in full Jupyter as well as Lite
- **A deep visual revamp**, plus an audit of which tools to keep
- **Widgets.** JupyterLite doesn't support the rich widgets, like the sliders, and they were part of the original motivation for building this. Tweak a slider and the agent sees how you tweaked it.
- **Easier graph styling**, like a nicer default Seaborn theme
- **Export the whole notebook** as an image or a PDF, so the agent can see it the way you do

Juan has been on this since the second night, when he rewrote the demo's shooting script, and he opened the first post-win PR. He tested it, helped write the script, and filmed with me. Watching a technically inclined person use it was very useful, and he tells me whether something makes sense or is AI hallucination. The project began partly with a self-contained prompt I wrote for him to paste into his own Claude, so that I could show him my workflow while it built.

---

[Live demo](https://jupyterlite-web-mcp.vercel.app/lab/index.html) (Chrome with Experimental Web Platform features, or ChatGPT's in-app browser) · [GitHub](https://github.com/alliecatowo/jupyterlite-web-mcp) · [PyPI](https://pypi.org/project/jupyterlite-webmcp/) · [Devpost](https://devpost.com/software/jupyterlite-webmcp)

## Key takeaways

- JupyterLite WebMCP registers 22 typed tools through WebMCP and has no chat UI, model, server or keys.
- Writes require the `sourceHash` from a prior read; stale writes fail with `STALE_CELL` and are never merged.
- Hidden cells answer `CELL_NOT_FOUND`, enforced at one checkpoint; the access levels are a guardrail, not a sandbox.
- The UI reports an agent only while a tool call is in flight or just finished, never as "connected".
- Propose mode makes `jupyter_update_cell` wait for Accept or Deny; Deny returns a reason as a normal result. It covers updates only.
- Review threads, access levels and edit history are stored in the notebook's own metadata.
