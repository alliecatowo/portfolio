---
title: The Browser Already Has the State Your Agent Needs
description: Screenshots, DOM scraping and backend MCP servers all hand your agent a copy. WebMCP lets the page itself offer tools over the live tab. What I learned building five of them in two days.
date: 2026-10-01
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

## WebMCP as an alternative to driving the page with clicks

An agent can already use a website by driving the page: reading a screenshot or the DOM, then clicking and typing. That works, but it is inefficient. It costs many tokens and many steps, and it breaks on some things. WebMCP is a narrower approach. The page registers its own tools, so an agent can view a site and interact with it directly, without simulating a person's clicks.

The rest of this post covers one strong argument for it (the page holds live state nothing else can reach), the rules I settled on, and five things I built in two days to test the idea.

## The live-state argument: a notebook example

Suppose I have a notebook open. I've changed a cell and haven't saved it. I've highlighted one expression that looks wrong. The kernel has a DataFrame in memory that took a while to load. I want an agent to look at that: what is on my screen, as it is right now.

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

## A second argument: no install

There is a second reason to prefer it. If someone says "just use a CLI," the answer is that a CLI can edit files and run Bash, but automating anything in a browser by clicking through pages burns a lot of tokens. WebMCP makes the page itself manipulable, so an agent can view a site and actually interact with it.

I also see WebMCP as a disposable alternative to long-lived plugins. Few people want to download a LinkedIn plugin and set it up, or install a company's MCP server to fill out one job application on its candidate portal. Visiting the site should hand the agent the manifest and every tool it needs. I've asked an agent to look at my LinkedIn and it couldn't. It would be simpler if it could, with nothing to set up.

I care less about the shared human-and-agent interaction. I think that was partly an artifact of the hackathon, where the goal was to show how far the idea could go.

## The rules I ended up with

During two days of OpenAI's WebMCP Challenge, I worked with ChatGPT on what is worth building on WebMCP, then built five candidates. These are the rules that survived, most of them from my objections to ideas along the way:

1. **If a normal MCP server can do it, WebMCP is a wrapper.** The page has to own state that nothing else can reach.
2. **It can't depend on AI.** "the app has ti have a normal interface for a user and full functionality without web mcp - web mcp just plugs in." ChatGPT's version: WebMCP is closer to ARIA, a semantic layer, than to a chatbot.
3. **It has to beat chat on precision.** "its gotta be a task thats far easier visually and exposes *more minute conteol* then chat interface would."
4. **The page can't summon the agent.** Selecting text, editing a cell or posting a comment doesn't call anyone. It changes the state the agent sees the next time you ask.
5. **The human always wins.** If the human changed something since the agent last read it, the agent's write fails.
6. **Hidden means nonexistent.** If a human hides something from the agent, the agent's lookup says "not found," not "access denied."

Rule 1 came from the first project, which I set aside.

## Storybook: the one that was a wrapper

The first thing I built was a WebMCP addon for Storybook, the component workshop. It compiles a project's stories, controls, globals and viewport state into versioned tools, with a panel that shows the tool surface and recent calls. It worked, had 340 passing tests and was deployed by mid-afternoon on day one.

At 5:18 PM I told ChatGPT: "bad news, built it, its basically the same as the storybook mcp but less powerful. next thing?"

Storybook already has an MCP server. Almost everything my addon exposed, a server could expose too, and the server version doesn't need a browser tab open. The one thing my version had that a server didn't was live, unsaved component state. A spike Codex ran as I was moving on showed how to use that.

I picked it because I wanted it for myself. On further reading, the live component state might have been a reasonable fit, but Storybook's own MCP can already make edits, so my addon was not the right one to build. I kept it as a fallback and moved on.

The repo is still public, with no license and no Devpost entry. It taught me what to look for.

## JupyterLite: state only in the tab

*"Your notebook is already in the browser. Now your agent can be too."*

JupyterLite is Jupyter that runs entirely in the browser: Pyodide for the kernel, IndexedDB for files, no server. That makes it the clearest case for rule 1. The state the agent needs isn't just *also* in the browser. It's *only* in the browser.

JupyterLite WebMCP is a JupyterLab extension that registers 22 tools over the open notebook: read the context and the exact selection, read and edit cells, run them, and post and answer review comments anchored to code or output. It has no chat panel and no model of its own. The agent is a second editor in your document, and it follows the rules you'd give a human collaborator:

- every write carries the hash of what it last read, and a stale write is refused
- it only runs cells you can see
- a cell you've hidden doesn't exist as far as it's concerned
- the status bar never claims an agent is present, because a page can't know that

It won the challenge. Post 6 goes through how it works.

## Swagger UI: "If you can Try it out, your agent can too."

Swagger UI pages are everywhere. Every API that publishes OpenAPI docs has one, with a "Try it out" button that sends real requests using whatever server and credentials you've selected on the page.

Swagger UI WebMCP is a plugin you add to that page's config. It compiles the OpenAPI document into agent tools. When the agent runs one, it doesn't build its own request. It writes the arguments into Swagger's own form and presses the same execute path you would. So it inherits your selected server, your login and the page's request interceptors, and the response shows up in the normal panel. Tools can never name a URL.

The interesting part is who gets a say. Four parties can each restrict what the agent may do:

- the API publisher, through `x-webmcp` annotations in the OpenAPI document
- the page owner, through the plugin's exposure config
- the person at the page, through an "Agent access" dropdown next to every operation
- the client, through MCP annotations

Each one reduces to hidden < read < write, and the tightest wins. The agent itself gets no vote: no tool schema has a lock field.

On Sep 2 the demo was a fictional task tracker called "Waypoint" with cookie auth, and I asked Claude "how fucking bad is this / boofed". Claude's answer: "**Not boofed.** The plugin is fine… What's weak is the demo's framing". It added spec chips for real public APIs (Open-Meteo, Petstore). The demo still loads Waypoint by default, which is on my list.

In hindsight, a fictional task-management API was a poor choice for this project. It isn't a public API, there is no reason to use it unless you are already logged in as that user, and it has to be seeded with data, which is hard. I had assumed we would use a real project's API. The full vision is broader than that demo: an agent browsing the web can work through Swagger docs that already exist, including the "Try it out" playground. I still think it had the strongest impact story of my four.

My pitch for impact, typed in a hurry on Sep 3: "millions of sites have swagger docs it makes hundreds of sites instantly accessible with no additional server or mcp bs." The plugin isn't on npm yet, which is the gap between the pitch and anyone using it.

## Careers: "The careers page is the connector."

Job sites are hard to scrape: login walls, applicant tracking systems, forms that change every quarter. Careers WebMCP flips who builds the integration. The employer's careers page registers candidate-side tools, so an agent can answer compound questions the filter UI can't ("staff or above, SF or remote, ≥ $220k"), type that search into the site's own search box, open real job pages in your tab, and co-edit your application draft.

It can't press Submit. `careers_submit_application` runs the same validation as the button, scrolls you to the draft, highlights Submit and returns `awaiting_human_confirmation`. Account creation works the same way. The tools module doesn't even import the function that creates a session. Claude's line for the demo: "The publisher decides what an agent is allowed to finish."

Like the notebook, every agent write carries the revision it last read, and a stale one is refused (`STALE_APPLICATION`), so the cover-note text you're typing always beats the agent's.

## Strudel: performing together

Strudel is a live-coding music environment. You edit code in the browser and it plays as you type. Strudel WebMCP gives an agent 13 tools over the live, unsaved editor buffer and the running scheduler. You can drag an inline slider while the agent rewrites a different line.

A human-owned dial in the header switches between Read, Review and Live. In Review mode the agent's edits arrive as proposals with a diff that you can audition before accepting. The agent also gets ears: `strudel_record` captures the page's own audio output and analyzes it, so it can hear what it changed.

This was my most feature-heavy project: recording, waveform analysis, line-range runs, "permission modes, accept suggestions modes". The propose-and-audition idea appeared here first, the day before I specced Propose/Deny for JupyterLite. Propose/Deny came from Strudel's accept-suggestions mode.

## The one that couldn't exist: WebMCP Channels

On the evening of Sep 2 I wanted to try one more idea (my message: "QUICK PIVOT QUICK PIVOT"). It was WebMCP Channels, a way for the page to push events to the agent (a new comment, a changed field), modeled on Claude Code's channels. ChatGPT wrote a 52,000-character spec, a proposed standards extension and three spikes. Then the idea hit the limit that rule 4 describes:

> "wait....then how does the agent get the notificaitons ocntinuily FUCK"

The conclusion: a page cannot push to an idle agent without support from the browser or the agent host. Same-turn loops might work, but they are a different thing. The idea ended in about half an hour, with no repo.

Channels might come back, and I think someone else has since built something similar. There was also a Marketplace contract, meant as the demo host for Channels. It was only a demo, a marketplace site in the style of Craigslist or Facebook Marketplace, and it is probably dead.

## Three shapes

The four projects that shipped fall into three shapes:

| Shape                                 | Example             | What only the page has                                                   |
| ------------------------------------- | ------------------- | ------------------------------------------------------------------------ |
| **State only in the tab**             | JupyterLite         | Unsaved cells, selection, an in-browser kernel, IndexedDB files          |
| **The page already has your session** | Swagger UI, Careers | Your selected server, your login, the site's own validation and pipeline |
| **A live performance**                | Strudel             | The buffer you're playing *right now*, and what it sounds like           |

They also share one design question, the most useful thing I took away: **who gets to decide what the agent may do?** In each one, the answer ended up being people, never the agent. The publisher decides what's exposed. The person at the page can tighten it. Only a human can press Submit, accept a proposal or create an account.

## The limits, plainly

- **A page can't summon an agent.** Everything is pull. If you need push, you need host support that doesn't exist yet.
- **Availability is early.** As of September 2026 it's a flag in Chrome or an in-app browser. Build so the app is fully usable without it (rule 2), and say so in the UI.
- **Chrome has quirks.** In Chrome 150, arguments, input schemas and results all come back as JSON strings. JupyterLite WebMCP documents this in `docs/webmcp-compatibility.md`.
- **An honest UI can score badly.** An AI judging fleet whose browser didn't have WebMCP saw my status bar say "WebMCP unavailable" and marked the project down. That's post 4.

Some argue that agents should "just use a CLI." For many tasks that is right. But a CLI works on files, and more of the work I care about happens in a tab: half-edited, selected, running. WebMCP lets that tab describe itself to an agent, on the page's terms.

The first real client for all of this was Codex. On the first night, Codex Desktop's in-app browser drove the live JupyterLite site through its WebMCP tools before any other agent had. After that, I mostly saved my Codex credits for using the sites, in QA and on camera, rather than writing code.

## Key takeaways

- Driving a page with clicks works but costs many tokens and steps and breaks on some things; WebMCP lets the page offer tools directly.
- The strongest case is live state that only the tab has: unsaved edits, selection, an in-browser kernel.
- A site can hand an agent its tools on visit, with no plugin or server to install.
- If a normal MCP server can do the job, WebMCP is only a wrapper.
- In all four shipped projects, people, not the agent, decide what the agent may do.
- A page cannot push to an agent, and WebMCP availability is still early.

---

**The five:**

- JupyterLite WebMCP (winner): [demo](https://jupyterlite-web-mcp.vercel.app/lab/index.html) · [repo](https://github.com/alliecatowo/jupyterlite-web-mcp) · `pip install jupyterlite-webmcp`
- Swagger UI WebMCP: [demo](https://openapi-web-mcp.vercel.app) · [repo](https://github.com/alliecatowo/openapi-web-mcp)
- Careers WebMCP: [demo](https://careers-webmcp.vercel.app/careers/open-positions) · [repo](https://github.com/alliecatowo/careers-webmcp)
- Strudel WebMCP: [demo](https://strudel-webmcp.vercel.app) · [repo](https://github.com/alliecatowo/strudel-webmcp)
- Storybook WebMCP (not submitted): [repo](https://github.com/alliecatowo/storybook-webmcp)
