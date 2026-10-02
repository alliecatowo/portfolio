---
title: The Browser Already Has the State Your Agent Needs
author: Allison Coleman
category: dev
date: 2026-10-12
description: Screenshots, DOM scraping and backend MCP servers all hand your agent a copy. WebMCP lets the page offer tools over the live tab. Lessons from building five.
featured: false
featured_image: /images/projects/swagger-ui-webmcp/agent-access.webp
ogImage: /images/og/swagger-ui-webmcp.png
published: false
slug: the-browser-already-has-the-state
tags:
  - webmcp
  - mcp
  - agents
  - web-platform
---

There are three common ways to connect an AI agent to a web app today, and **all three hand the agent a copy of what you're looking at.** WebMCP is the first approach that lets the agent work with the real thing.

I spent two days of OpenAI's WebMCP Challenge building five WebMCP projects to test that idea. One of them, JupyterLite WebMCP, was among the ten winners. Here's what I learned about where WebMCP fits, and where it doesn't.

## The problem: your agent is working from a copy

Picture a data notebook open in your browser. You've edited a cell but haven't saved it. You've highlighted one expression that looks wrong. The kernel is holding a DataFrame in memory that took a minute to load.

You want an agent to look at *that*: what's on your screen, right now. Here's what the usual options actually see:

- **Computer use sees pixels.** It can read your screen, but it has to guess what it's looking at, and every click is a chance to miss.
- **DOM scraping sees markup.** It can find the cell, but not which characters you selected or what's in kernel memory.
- **A backend MCP server sees the server.** For a normal Jupyter setup, that's the file on disk, without your unsaved edit. For JupyterLite there is no server at all: the kernel runs in a web worker and the files live in your browser's IndexedDB.

**WebMCP is a fourth option.** It's a proposed web standard where the page registers its own tools, with typed inputs and outputs, and an agent in the browser calls them. The calls run inside the tab, against the live state, through the app's own code.

```js
// Illustrative sketch
document.modelContext.registerTool({
  name: 'notebook_get_selection',
  description: 'Return the exact text the user has selected in the active cell.',
  inputSchema: { type: 'object', properties: {} },
  async execute() {
    return { content: [{ type: 'text', text: JSON.stringify(currentSelection()) }] }
  },
})
```

As of September 2026, WebMCP isn't in any stable browser. I tested in Chrome 150 with the Experimental Web Platform features flag, and in the in-app browsers of ChatGPT and Codex.

## The second argument: nothing to install

The live-state argument is the strongest one, but there's a practical one too.

Few people want to install a company's browser plugin or MCP server to do one task on its website, like applying for one job. With WebMCP, **visiting the site is the install.** The page hands the agent its tools, scoped to what the site allows, and they disappear when you close the tab.

It's also cheaper. Driving a page by screenshots and clicks burns tokens and steps on every action. A typed tool call does the same job in one step, with a structured result.

## Six rules for what's worth building

During the challenge, I worked through ideas with ChatGPT and rejected most of them. The rules that survived:

1. **If a normal MCP server can do it, WebMCP is a wrapper.** The page has to own state that nothing else can reach.
2. **It can't depend on AI.** The app needs a complete interface for a person, with or without an agent. WebMCP is closer to an accessibility layer than to a chatbot.
3. **It has to beat chat on precision.** The task should be easier to show than to describe, with finer control than a chat box gives you.
4. **The page can't summon the agent.** Selecting text or editing a cell doesn't call anyone. It changes what the agent sees the next time you ask.
5. **The human always wins.** If you changed something since the agent last read it, the agent's write fails.
6. **Hidden means nonexistent.** If you hide something from the agent, its lookup returns "not found," not "access denied."

Rule 1 cost me a finished project.

## Storybook: the one that was only a wrapper

My first build was a WebMCP add-on for Storybook, the UI component workshop. It turned a project's stories, controls and viewport state into versioned tools. It had 340 passing tests and was deployed by mid-afternoon on day one.

Then I looked harder. **Storybook already has an MCP server, and it can already make edits.** Almost everything my add-on exposed, a server could expose too, without needing a browser tab open. So I shelved it and moved on. It taught me what to look for.

## Three shapes that do work

The four projects I submitted fall into three patterns.

### 1. State that exists only in the tab: JupyterLite

*"Your notebook is already in the browser. Now your agent can be too."*

JupyterLite runs Jupyter entirely in the browser, so the state the agent needs isn't just *also* in the browser. **It's only in the browser.** JupyterLite WebMCP registers 22 tools over the open notebook: read the exact selection, edit cells, run them, and leave review comments. It has no chat panel and no model of its own. The agent is a second editor in your document:

- Every write carries a hash of what it last read, and stale writes are refused.
- It only runs cells you can see.
- A cell you've hidden doesn't exist as far as it's concerned.

This is the one that won.

### 2. The page already has your session: Swagger UI and Careers

**Swagger UI WebMCP** is a plugin for Swagger UI docs pages that compiles the OpenAPI document into agent tools. When the agent calls one, it fills in Swagger's own form and presses the same "Try it out" path you would. It inherits your selected server, your login and the page's interceptors. **"If you can Try it out, your agent can too."**

The interesting part is who gets a say. The API publisher, the page owner, the person at the page and the client can each restrict what the agent may do, and the tightest setting wins. **The agent gets no vote.**

**Careers WebMCP** flips who builds the integration: *"The careers page is the connector."* The employer's site registers candidate-side tools, so an agent can answer questions the filter UI can't ("staff or above, SF or remote") and co-edit your application. It can't press Submit. That tool highlights the button and returns `awaiting_human_confirmation`.

### 3. A live performance: Strudel

Strudel is a live-coding music environment. Strudel WebMCP gives an agent 13 tools over the live editor buffer and the running scheduler. In Review mode, the agent's edits arrive as proposals you can audition before accepting. It can also record the page's audio output, so the agent can hear what it changed. This propose-and-audition pattern later became Propose/Deny in JupyterLite.

## The design question that matters most

All three shapes answer one question the same way: **who decides what the agent may do?**

In every project, the answer was people. The publisher decides what's exposed. The person at the page can tighten it. Only a human can press Submit, accept a proposal or create an account.

If you take one design principle from this post, take that one.

## The limits

WebMCP is early, and there are real constraints:

- **A page can't push to an agent.** I spent half an hour on a "WebMCP Channels" idea for page-to-agent notifications before hitting this wall. Everything is pull. Push would need support from the browser or the agent host.
- **Availability is limited.** For now it's a flag in Chrome or an in-app browser. Build the app to be fully usable without it, and say so in the UI.
- **Implementations have quirks.** In Chrome 150, arguments, schemas and results come back as JSON strings. The JupyterLite repo documents this in `docs/webmcp-compatibility.md`.
- **Honesty can cost you with automated evaluators.** One AI judging fleet's browser lacked WebMCP, read my status bar saying "WebMCP unavailable," and marked the project down. More on that later in this series.

## Key takeaways

- **The strongest case for WebMCP is live state only the tab has:** unsaved edits, selections, in-browser runtimes.
- **The second case is zero install.** A site can hand an agent its tools on visit, scoped and temporary.
- **If a normal MCP server can do the job, WebMCP is only a wrapper.** Check this first.
- **People, not agents, should decide what an agent may do.** Build that into the tools, not the prompt.
- **Design for absence.** Pages can't summon agents, and most browsers don't support WebMCP yet.

Some will say agents should "just use a CLI." For a lot of work, they're right. But a CLI works on files, and more of the work I care about happens in a tab: half-edited, selected, running. WebMCP lets that tab describe itself to an agent, on the page's terms.

---

**The projects:**

- JupyterLite WebMCP (winner): [demo](https://jupyterlite-web-mcp.vercel.app/lab/index.html) · [repo](https://github.com/alliecatowo/jupyterlite-web-mcp) · `pip install jupyterlite-webmcp`
- Swagger UI WebMCP: [demo](https://openapi-web-mcp.vercel.app) · [repo](https://github.com/alliecatowo/openapi-web-mcp)
- Careers WebMCP: [demo](https://careers-webmcp.vercel.app/careers/open-positions) · [repo](https://github.com/alliecatowo/careers-webmcp)
- Strudel WebMCP: [demo](https://strudel-webmcp.vercel.app) · [repo](https://github.com/alliecatowo/strudel-webmcp)
- Storybook WebMCP (not submitted): [repo](https://github.com/alliecatowo/storybook-webmcp)

JupyterLite WebMCP was built with Juan Mendoza. Follow along on X: [@AllieCatOwO](https://x.com/AllieCatOwO).
