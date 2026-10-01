---
title: Swagger UI WebMCP
slug: swagger-ui-webmcp
description: 'OpenAI WebMCP Challenge entry: a Swagger UI plugin that turns any OpenAPI docs page into agent tools, with access the page and the person can only tighten.'
date: 2026-09-03
status: published
featured: false
group: browser-agents
groupOrder: 2
technologies:
  - WebMCP
  - TypeScript
  - Swagger UI
  - OpenAPI
  - Vite
  - Playwright
  - Vercel
tags:
  - ai-agents
  - webmcp
  - mcp
  - hackathon
  - developer-tools
  - browser
github: https://github.com/alliecatowo/openapi-web-mcp
demo: https://openapi-web-mcp.vercel.app
devpost: https://devpost.com/software/swagger-ui-webmcp
image: /images/projects/swagger-ui-webmcp/card.webp
imageAlt: 'Video thumbnail reading "Your API docs are the connector" over Swagger UI with an agent chat beside it.'
seo:
  title: 'Swagger UI WebMCP: OpenAPI docs as agent tools'
---

**If you can Try it out, your agent can too.**

This is one of four entries Allison submitted to OpenAI's WebMCP Challenge on the morning of 3 September 2026. [JupyterLite WebMCP](/projects/jupyterlite-webmcp/) was the one that won. The other two were [Careers WebMCP](/projects/careers-webmcp/) and [Strudel WebMCP](/projects/strudel-webmcp/), and a fifth build, [Storybook WebMCP](/projects/storybook-webmcp/), never got submitted. All five went from first commit to the last Devpost submission in under 48 hours, each starting as a long written build contract handed to Claude Code or Codex agents.

Swagger UI WebMCP is a plugin. Add `plugins: [SwaggerUIWebMCP]` to an existing Swagger UI config and every OpenAPI docs page becomes a set of [WebMCP](https://github.com/webmachinelearning/webmcp) tools a browser agent can call. It gets five core tools for finding, reading and running operations, plus one tool per exposed operation. The agent uses the environment, login and request pipeline the developer already has open in that tab.

![Swagger UI with an agent chat beside it: each API operation has an Agent access dropdown, and a delete endpoint is set to read only.](/images/projects/swagger-ui-webmcp/agent-access.webp)

## Four parties, and the agent isn't one of them

The interesting part is who decides what the agent may do. Four parties each get one instrument:

- **The API publisher** annotates the OpenAPI document with `x-webmcp`.
- **The page owner** sets exposure in the plugin config.
- **The person at the page** gets an "Agent access" dropdown next to every Try-it-out, which locks that operation for the session.
- **The client** gets standard MCP annotations and structured errors.

Every source reduces to a level on `hidden < read < write`, and the tightest one wins. Hidden always wins, so hiding something can never escalate anything. By default it's tighten-only; a page has to opt in before document annotations can relax its exposure. No tool schema has a field for the lock, so the agent gets no vote.

![The agent explains that an operation is hidden from it, in Swagger UI showing the fictional Waypoint demo API.](/images/projects/swagger-ui-webmcp/hidden-operation.webp)

## Tools can't name a URL

The agent never builds a request. Execution writes arguments into Swagger UI's own store and runs its normal execute action, so every call goes through the server you selected, the page's interceptors and your credentials, and the response shows up in the usual response panel. Every path, whether a direct tool, the generic executor or a batch, goes through one authorisation gate checked at call time. Tool names carry a hash of the document, so they change when the spec does, and parameters with credential-shaped names are dropped before they reach a schema.

A few things landed after the submission, during the deadline extension: a cost hint for metered operations, re-checking authorisation on every step of a batch, and closing gaps in the credential-name filter.

## Try it

The [live demo](https://openapi-web-mcp.vercel.app) opens on a fictional "Waypoint" task-tracker API. One click on the Open-Meteo chip loads a real public weather API instead, and Petstore is there too.

![The live demo with the Open-Meteo spec loaded: real weather endpoints, each with an Agent access dropdown set to Full access.](/images/projects/swagger-ui-webmcp/open-meteo.webp)

_The live demo with Open-Meteo selected, captured September 2026._

Without a WebMCP-capable browser it still works as normal Swagger UI. The agent side needs ChatGPT's in-app browser or Chrome with experimental web platform features turned on. The plugin isn't published to npm yet, so for now it's the repo and the demo.

There's a [demo video](https://youtu.be/BVMel5ppiGA) and the [Devpost entry](https://devpost.com/software/swagger-ui-webmcp). Apache-2.0.
