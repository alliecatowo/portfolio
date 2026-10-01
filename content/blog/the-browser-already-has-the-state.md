---
title: 'The Browser Already Has the State Your Agent Needs'
date: 2026-10-01
description: 'Screenshots, DOM scraping and backend MCP servers all hand your agent a copy. WebMCP lets the page itself offer tools over the live tab. What I learned building five of them in two days.'
category: dev
tags:
  - webmcp
  - mcp
  - agents
  - web-platform
author: Allison Coleman
published: false
featured: false
slug: the-browser-already-has-the-state
---

Here's a situation I'm in most days. I have a notebook open. I've changed a cell and haven't saved it. I've highlighted one expression that looks wrong. The kernel has a DataFrame in memory that took a while to load. I want an agent to look at _that_: the thing on my screen, as it is right now.

Every common way of connecting an agent gives it a copy instead:

- **Computer use** sees pixels. It can read my screen, but it has to guess what it's looking at, and clicking is fragile.
- **DOM scraping** sees markup. It can find the cell, but not which characters I selected or what's in kernel memory.
- **A backend MCP server** sees the server. For a regular Jupyter server, that's the notebook file on disk, without my unsaved edit. For JupyterLite there's no server at all. The kernel runs in a web worker, and the files live in my browser's IndexedDB.

WebMCP is a proposed web standard for a fourth option. The page registers its own tools, with typed inputs and outputs, and an agent in the browser calls them. The calls run inside the tab, against the live state, through the app's own code.

```js
// Sketch, not from any of the repos
document.modelContext.registerTool({
  name: 'notebook_get_selection',
  description: 'Return the exact text the user has selected in the active cell.',
  inputSchema: { type: 'object', properties: {} },
  async execute() {
    return { content: [{ type: 'text', text: JSON.stringify(currentSelection()) }] }
  },
})
```

As of September 2026, WebMCP isn't in any stable browser. I tested in Chrome 150 with the Experimental Web Platform features flag turned on, and in ChatGPT's and Codex's in-app browsers.

My one-line pitch, for people who say "just use a CLI": look how hard it is to automate anything in a browser. Yes, an agent can edit files and do everything it needs with Bash. It can click through pages, too, but think about how many tokens that burns. WebMCP is a narrow thing. It makes the page manipulable, so an agent can view a site and actually interact with it.

Honestly, the shared human-and-agent interaction isn't the part I care most about. I think that was partly an artifact of the hackathon, of taking it above and beyond to show what you can do. The bigger idea is that WebMCP is a **disposable alternative to long-lived plugins**. No one wants to download a LinkedIn plugin and hook it up. No one is going to install some company's MCP server to fill out one job application on its own little candidate portal. Visiting the site should hand the agent the manifest and every tool it needs. I've asked an agent to look at my LinkedIn and it couldn't. What if it could, without me setting anything up? It's just easier.

> TODO: Allison

## The rules I ended up with

I spent two days of OpenAI's WebMCP Challenge arguing with ChatGPT about what's actually worth building on this, then building five candidates. These are the rules that survived, most of them from me saying "no, because…":

1. **If a normal MCP server can do it, WebMCP is a wrapper.** The page has to own state that nothing else can reach.
2. **It can't depend on AI.** "the app has ti have a normal interface for a user and full functionality without web mcp - web mcp just plugs in." ChatGPT's version: WebMCP is closer to ARIA, a semantic layer, than to a chatbot.
3. **It has to beat chat on precision.** "its gotta be a task thats far easier visually and exposes _more minute conteol_ then chat interface would."
4. **The page can't summon the agent.** Selecting text, editing a cell or posting a comment doesn't call anyone. It changes the state the agent sees the next time you ask.
5. **The human always wins.** If the human changed something since the agent last read it, the agent's write fails.
6. **Hidden means nonexistent.** If a human hides something from the agent, the agent's lookup says "not found," not "access denied."

Rule 1 came from the first project, which I threw away.

## Storybook: the one that was a wrapper

The first thing I built was a WebMCP addon for Storybook, the component workshop. It compiles a project's stories, controls, globals and viewport state into versioned tools, with a panel that shows the tool surface and recent calls. It worked. It had 340 passing tests and was deployed by mid-afternoon on day one.

At 5:18 PM I told ChatGPT: "bad news, built it, its basically the same as the storybook mcp but less powerful. next thing?"

Storybook already has an MCP server. Almost everything my addon exposed, a server could expose too, and the server version doesn't need a browser tab open. The one thing my version had that a server didn't was live, unsaved component state. I only figured out how to lean on that in a spike Codex ran right as I was moving on.

I'd picked it because it's something I'd want for myself. As I read more, I could see the live component state might have been an OK fit. But Storybook's own MCP can already make edits, so mine wasn't the correct fit. I banked it as a fallback and moved on.

The repo is still public, with no license and no Devpost entry. I think of it as the project that taught me what to look for.

## JupyterLite: state only in the tab

_"Your notebook is already in the browser. Now your agent can be too."_

JupyterLite is Jupyter that runs entirely in the browser: Pyodide for the kernel, IndexedDB for files, no server. That makes it the clearest case for rule 1. The state the agent needs isn't just _also_ in the browser. It's _only_ in the browser.

JupyterLite WebMCP is a JupyterLab extension that registers 22 tools over the open notebook: read the context and the exact selection, read and edit cells, run them, and post and answer review comments anchored to code or output. It has no chat panel and no model of its own. The agent is a second editor in your document, and it follows the rules you'd give a human collaborator:

- every write carries the hash of what it last read, and a stale write is refused
- it only runs cells you can see
- a cell you've hidden doesn't exist as far as it's concerned
- the status bar never claims an agent is present, because a page can't know that

It won. Post 6 goes through how it works.

## Swagger UI: "If you can Try it out, your agent can too."

Swagger UI pages are everywhere. Every API that publishes OpenAPI docs has one, with a "Try it out" button that sends real requests using whatever server and credentials you've selected on the page.

Swagger UI WebMCP is a plugin you add to that page's config. It compiles the OpenAPI document into agent tools. When the agent runs one, it doesn't build its own request. It writes the arguments into Swagger's own form and presses the same execute path you would. So it inherits your selected server, your login and the page's request interceptors, and the response shows up in the normal panel. Tools can never name a URL.

The interesting part is who gets a say. Four parties can each restrict what the agent may do:

- the API publisher, through `x-webmcp` annotations in the OpenAPI document
- the page owner, through the plugin's exposure config
- the person at the page, through an "Agent access" dropdown next to every operation
- the client, through MCP annotations

Each one reduces to hidden < read < write, and the tightest wins. The agent itself gets no vote: no tool schema has a lock field.

This one almost didn't make it. On Sep 2 the demo was a fictional task tracker called "Waypoint" with cookie auth, and I asked Claude "how fucking bad is this / boofed". Claude's answer: "**Not boofed.** The plugin is fine… What's weak is the demo's framing". It added spec chips for real public APIs (Open-Meteo, Petstore). The demo still loads Waypoint by default, which is on my list.

Looking back, a fake task-management API was the absolute worst choice for this one. It's not a public API. There's no reason you'd use it unless you were already logged in as that user. And you have to seed it with data, which is really hard. I'd assumed we'd use a real project's API. The full vision is much better than that demo: an agent that's just browsing the web can work through Swagger docs that already exist, including the "Try it out" playground. I still think it had the bigger impact story of my four.

My pitch for impact, typed in a hurry on Sep 3: "millions of sites have swagger docs it makes hundreds of sites instantly accessible with no additional server or mcp bs." The plugin isn't on npm yet. That's the gap between the pitch and anyone actually using it.

## Careers: "The careers page is the connector."

Job sites are where agent scraping gets ugly: login walls, applicant tracking systems, forms that change every quarter. Careers WebMCP flips who builds the integration. The employer's careers page registers candidate-side tools, so an agent can answer compound questions the filter UI can't ("staff or above, SF or remote, ≥ $220k"), type that search into the site's own search box, open real job pages in your tab, and co-edit your application draft.

It can't press Submit. `careers_submit_application` runs the same validation as the button, scrolls you to the draft, highlights Submit and returns `awaiting_human_confirmation`. Account creation works the same way. The tools module doesn't even import the function that creates a session. Claude's line for the demo became the thesis: "The publisher decides what an agent is allowed to finish."

Like the notebook, every agent write carries the revision it last read, and a stale one is refused (`STALE_APPLICATION`), so the cover-note text you're typing always beats the agent's.

## Strudel: performing together

Strudel is a live-coding music environment. You edit code in the browser and it plays as you type. Strudel WebMCP gives an agent 13 tools over the live, unsaved editor buffer and the running scheduler. You can drag an inline slider while the agent rewrites a different line.

A human-owned dial in the header switches between Read, Review and Live. In Review mode the agent's edits arrive as proposals with a diff that you can audition before accepting. The agent also gets ears: `strudel_record` captures the page's own audio output and analyzes it, so it can hear what it changed.

This was my most feature-hungry project. Recording, waveform analysis, line-range runs, "permission modes, accept suggestions modes". The propose-and-audition idea showed up here first, the day before I specced Propose/Deny for JupyterLite. That's not a coincidence. Propose/Deny definitely came from Strudel's accept-suggestions mode.

## The one that couldn't exist: WebMCP Channels

On the evening of Sep 2 I got excited about one more idea: "QUICK PIVOT QUICK PIVOT". The idea was WebMCP Channels, a way for the page to push events to the agent (a new comment, a changed field), modeled on Claude Code's channels. ChatGPT wrote a 52,000-character spec, a proposed standards extension and three spikes. Then I hit the wall that rule 4 describes:

> "wait....then how does the agent get the notificaitons ocntinuily FUCK"

The conclusion: there's no way for a page to push to an idle agent without support from the browser or the agent host. Same-turn loops might work, but that's not the same thing. It died in about half an hour, with no repo.

Channels might come back. I think someone else built something like it since. There was also a Marketplace contract, meant as the demo host for Channels. That one was just a demo, basically "imagine if Craigslist or Facebook Marketplace didn't suck," and it's probably dead.

## Three shapes

Looking back at the four that shipped, they're three shapes of the same idea:

| Shape                                 | Example             | What only the page has                                                   |
| ------------------------------------- | ------------------- | ------------------------------------------------------------------------ |
| **State only in the tab**             | JupyterLite         | Unsaved cells, selection, an in-browser kernel, IndexedDB files          |
| **The page already has your session** | Swagger UI, Careers | Your selected server, your login, the site's own validation and pipeline |
| **A live performance**                | Strudel             | The buffer you're playing _right now_, and what it sounds like           |

And they share one design question, which is the most useful thing I took away: **who gets to decide what the agent may do?** In every one of them, the answer ended up being the people, never the agent. The publisher decides what's exposed. The person at the page can tighten it. Only a human can press Submit, accept a proposal or create an account.

## The limits, plainly

- **A page can't summon an agent.** Everything is pull. If you need push, you need host support that doesn't exist yet.
- **Availability is early.** As of September 2026 it's a flag in Chrome or an in-app browser. Build so the app is fully usable without it (rule 2), and say so in the UI.
- **Chrome has quirks.** In Chrome 150, arguments, input schemas and results all come back as JSON strings. JupyterLite WebMCP documents this in `docs/webmcp-compatibility.md`.
- **Honest UIs can score badly.** An AI judging fleet whose browser didn't have WebMCP saw my status bar say "WebMCP unavailable" and marked the project down. That's post 4.

People argue that agents should "just use a CLI." For a lot of things they should. But a CLI works on files, and the work I care about increasingly happens in a tab: half-edited, selected, running. WebMCP is how that tab can describe itself to an agent, on the page's terms.

The first real client for all of this was Codex. On the first night, Codex Desktop's in-app browser drove the live JupyterLite site through its WebMCP tools before any other agent had. After that, I mostly saved my Codex credits for exactly that job: using the sites, in QA and on camera, rather than writing code.

---

**The five:**

- JupyterLite WebMCP (winner): [demo](https://jupyterlite-web-mcp.vercel.app/lab/index.html) · [repo](https://github.com/alliecatowo/jupyterlite-web-mcp) · `pip install jupyterlite-webmcp`
- Swagger UI WebMCP: [demo](https://openapi-web-mcp.vercel.app) · [repo](https://github.com/alliecatowo/openapi-web-mcp)
- Careers WebMCP: [demo](https://careers-webmcp.vercel.app/careers/open-positions) · [repo](https://github.com/alliecatowo/careers-webmcp)
- Strudel WebMCP: [demo](https://strudel-webmcp.vercel.app) · [repo](https://github.com/alliecatowo/strudel-webmcp)
- Storybook WebMCP (not submitted): [repo](https://github.com/alliecatowo/storybook-webmcp)
