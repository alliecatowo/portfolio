---
title: Storybook WebMCP
date: 2026-09-01
demo: https://storybook-web-mcp.vercel.app/storybook/
description: A Storybook addon that compiles live stories, controls and globals into WebMCP tools. Built and deployed for the WebMCP Challenge, then deliberately not submitted.
featured: false
github: https://github.com/alliecatowo/storybook-webmcp
group: browser-agents
groupOrder: 5
image: /images/projects/storybook-webmcp/card.webp
imageAlt: Storybook with a WebMCP panel listing the story tools an agent can call and its recent calls.
seo:
  title: "Storybook WebMCP: stories as WebMCP tools"
  description: A Storybook addon that compiles live stories, controls and globals into WebMCP tools. Built and deployed for the WebMCP Challenge, then deliberately not submitted.
slug: storybook-webmcp
status: published
tags:
  - ai-agents
  - webmcp
  - mcp
  - storybook
  - developer-tools
technologies:
  - WebMCP
  - TypeScript
  - Storybook
  - Vercel
---

**Built, deployed, and deliberately not submitted.**

This was the first thing Allison built for OpenAI's WebMCP Challenge, on 1 September 2026, before [JupyterLite WebMCP](/projects/jupyterlite-webmcp/) (the winner), [Swagger UI WebMCP](/projects/swagger-ui-webmcp/), [Careers WebMCP](/projects/careers-webmcp/) and [Strudel WebMCP](/projects/strudel-webmcp/). It works, it's live, and it was never entered.

Storybook WebMCP is a Storybook addon that compiles the live stories, controls, globals and viewport state into versioned [WebMCP](https://github.com/webmachinelearning/webmcp) tools, so a browser agent can find a story, open it and change its controls. A "WebMCP" panel in the Storybook manager shows the current tool surface, the compiler state and the agent's recent calls. It demos against the Mealdrop example Storybook.

The screenshot above shows the Mealdrop Review story with the WebMCP panel: six tools, 16 capability changes this session, and its recent calls, one of which failed.

## Why it wasn't submitted

It took an afternoon: about an hour of Claude Code with up to 13 agents running at once, then mostly Codex. Once it worked, her verdict that afternoon was that it was basically the Storybook MCP server again, only less powerful. An ordinary MCP server can already drive Storybook, so putting the tools in the page added very little.

That turned into the rule for everything after it: use WebMCP for state that only exists in the browser. A notebook's unsaved cells and running kernel are exactly that, which is why JupyterLite came next.

## Try it

The [deployed Storybook](https://storybook-web-mcp.vercel.app/storybook/) is real and browsable; the agent tools need a WebMCP-capable browser. The [source is on GitHub](https://github.com/alliecatowo/storybook-webmcp). It has no license file yet.
