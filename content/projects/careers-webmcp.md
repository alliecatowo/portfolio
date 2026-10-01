---
title: Careers WebMCP
slug: careers-webmcp
description: 'OpenAI WebMCP Challenge entry: a careers site with 18 WebMCP tools. The agent searches, navigates and fills in your application; only you can press Submit.'
date: 2026-09-03
status: published
featured: false
group: browser-agents
groupOrder: 3
technologies:
  - WebMCP
  - TypeScript
  - Next.js
  - React
  - Playwright
  - Vercel
tags:
  - ai-agents
  - webmcp
  - mcp
  - hackathon
  - browser
github: https://github.com/alliecatowo/careers-webmcp
demo: https://careers-webmcp.vercel.app/careers/open-positions
devpost: https://devpost.com/software/careers-webmcp
image: /images/projects/careers-webmcp/card.webp
imageAlt: 'Video thumbnail reading "The agent fills the form. You press the button." over a pre-filled candidate sign-up form.'
---

**The careers page is the connector.**

One of four entries I submitted to OpenAI's WebMCP Challenge on 3 September 2026, alongside the winning [JupyterLite WebMCP](/projects/jupyterlite-webmcp/), [Swagger UI WebMCP](/projects/swagger-ui-webmcp/) and [Strudel WebMCP](/projects/strudel-webmcp/). All of them were built in under 48 hours from long written contracts handed to coding agents.

Careers WebMCP is a normal careers site for a fictional employer, Northwind. When the browser supports [WebMCP](https://github.com/webmachinelearning/webmcp), the site registers 18 candidate-side tools. The agent can answer compound questions the filter UI can't ("staff or above, SF or remote, at least $220k"), type that query into the site's own search box, open real pages in your tab, co-edit an application draft with you, and pre-fill sign-up.

![An agent has pre-filled a job application draft on the Northwind careers site; the person's own cover note sits in the form and the draft revision counter shows under the title.](/images/projects/careers-webmcp/coedit-revision.webp)

## The agent fills in; you press Submit

- **No submit, no sign-up.** `careers_submit_application` runs the same validation as the button, opens the draft, highlights Submit and returns `awaiting_human_confirmation`. Creating an account works the same way: the tools module imports the sign-up form's field store, but not the function that actually creates a session.
- **Your edits win.** Every agent write carries the revision it last read. If you've typed since then, the write is refused with `STALE_APPLICATION`, so your cover note can't be clobbered.
- **One code path.** Agent search runs the same deterministic scorer as the visible list, so the page and the agent can't disagree about what matches.
- **Exports by handle.** Instead of pulling twenty job descriptions into the agent's context, it creates a CSV export and pages through it.
- **Presence without injection.** Agent activity shows up in the real UI, but the captions are built from counts and enums only, never from site text. A prompt injection hidden in a job description has nowhere to land.

![The pre-filled sign-up form, noting that nothing is created until you press Create account.](/images/projects/careers-webmcp/account-prefill.webp)

![Application submitted confirmation, reached only after the person pressed Submit themselves.](/images/projects/careers-webmcp/application-submitted.webp)

## Try it

The [live site](https://careers-webmcp.vercel.app/careers/open-positions) works without an agent. The tools need ChatGPT's in-app browser or Chrome with experimental web platform features turned on.

![The live Northwind careers site: Open Positions Worldwide, with search, filters and 20 open positions.](/images/projects/careers-webmcp/open-positions.webp)

_The live site, captured September 2026._

The careers UI is built on the MIT-licensed Baalvion Jobs Portal (provenance is in the repo's `NOTICE`); the WebMCP layer is what this project adds. There's a [demo video](https://youtu.be/Rqt9sBN__6E) and the [Devpost entry](https://devpost.com/software/careers-webmcp). MIT.
