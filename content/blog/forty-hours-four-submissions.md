---
title: "Four Submissions in 40 Hours: How I Won the WebMCP Challenge"
author: Allison Coleman
category: dev
date: 2026-10-05
description: I found OpenAI's WebMCP Challenge with three days left, shipped four entries with a team of AI agents, and one of them won. Here is how the 40 hours went.
featured: false
featured_image: /images/projects/jupyterlite-webmcp/screenshot-2-presence.webp
ogImage: /images/og/jupyterlite-webmcp.png
published: false
slug: forty-hours-four-submissions
tags:
  - webmcp
  - agents
  - claude
  - codex
  - hackathon
  - jupyterlite
---

On September 28, OpenAI announced the ten winners of its WebMCP Challenge. **Nearly 2,500 projects were submitted. One of the winners was mine.**

I found the challenge on day 7 of 10. I submitted four separate entries in a 40-hour sprint, and I wrote very little of the code myself. This is how that worked, with the timestamps to back it up.

## The setup: day 7 of 10

WebMCP is a proposed web standard that lets a web page register typed tools for an AI agent (`document.modelContext.registerTool`). Instead of screenshotting a page or scraping its HTML, an agent in the browser calls the page's own functions, against the page's live state.

OpenAI and Devpost ran a ten-day challenge around it. Over 7,000 people registered. I found it through a weekly ChatGPT task I use to watch for hackathons, which meant I saw it with about three days left.

I made one strategic decision early: **lean on concurrency.** I couldn't out-polish teams who had been working for a week, but I could run several builds at once.

## Step 1: Build something, then kill it

The first thing I built was a WebMCP add-on for Storybook, the UI component workshop, because it was the project closest to my own work.

- At 12:39 PM I pasted a 53,000-character spec into Claude Code.
- Forty minutes later, **13 agents were working in parallel**, the peak of the entire run.
- About an hour in, it had 340 passing tests, and I hit my first session limit.
- I handed the same spec to Codex five minutes later. Codex finished it, and it was deployed by 4:31 PM.

At 5:18 PM I told ChatGPT: *"bad news, built it, its basically the same as the storybook mcp but less powerful. next thing?"*

Storybook already ships an MCP server that can make edits. **If a regular MCP server can do the job, WebMCP is just a wrapper**, and a wrapper doesn't win. So, five hours into my two days, I shelved a finished, tested, deployed project.

That was the most important call of the run.

## Step 2: Argue until it becomes a contract

The next 90 minutes were me rejecting ideas out loud in ChatGPT:

> "its something *collabrative*, that wouldnt make sense on a normal mcp."

> "oh and it CANT be dependent on ai… the app has ti have a normal interface for a user and full functionality without web mcp - web mcp just plugs in."

Then, at 6:32 PM: *"I feel like notebooks though really do tell the cleanest colab story."*

That was the answer. JupyterLite is Jupyter running entirely in the browser: the Python kernel runs in a web worker and files live in IndexedDB. **Your unsaved edits, your selection and your running kernel exist only in that tab.** There is no server for a normal MCP server to talk to. WebMCP is the only way in.

At 7:03 PM, ChatGPT compiled my objections into a **65-section, 45,000-character build contract**. Each complaint had become a rule:

- "it CANT be dependent on ai" became a section titled **THIS IS NOT AN AI APPLICATION**.
- "drop that then if web mcp cant *trigger* the agent" became **CRITICAL WEBMCP LIMITATION**.

At 7:31 PM I pasted the contract into Claude Code and added one line:

> implement full spec relentlessly and most improtantly EFFECIENTLY

The first commit landed 27 minutes later. I went back to ChatGPT and started writing the next contract.

## Step 3: Four bets instead of one

That night I checked the rules: one person could submit multiple entries, as long as each was "unique and substantially different." So I changed strategy, from one entry to as many strong ones as I could ship.

By midnight I had four builds running: **JupyterLite**, **Strudel** (a live-coding music app) and a **Careers page** in Claude Code, and **Swagger UI** in Codex. I launched several of them from my phone.

The constraint was budget. I was on the $100 Claude plan and the $20 Codex plan:

- I hit Claude's session limit **nine times in two days**.
- At 4:38 PM on September 2, all four sessions hit it within the same 70 seconds.
- When Claude ran out, I switched to Codex. When both ran out, I slept.

What limited me wasn't intelligence. It was **tokens per second, averaged over the time spent waiting for a limit to reset.**

## Step 4: The night before the deadline

On the evening of September 2, I sent the same message to three sessions within 14 seconds: *"can you SELL IT?"*

Claude's answer was blunt: **"The video doesn't exist… Nobody has run this in a real WebMCP browser."**

Then I opened the JupyterLite demo myself. The status bar said an agent was connected when none was. I objected (loudly), and Claude removed what it called **"the one dishonest pixel."** The status bar now says only what a page can actually know: `WebMCP ready`, `WebMCP unavailable` or `WebMCP error`. That decision comes back later.

A few more cuts followed. Propose mode, where an agent's edits arrive as suggestions you accept or deny, wasn't ready, so I shipped without it. Notebook widgets weren't reliable in the demo, so I cut them.

My collaborator, **Juan Mendoza**, joined for the demo. He rewrote the shooting script and we spent the evening trying to record it. But every take ran long and needed editing, and the rules required a public demo video under three minutes, with audio, for every entry. I had four projects and zero videos.

At 10:54 PM I asked Claude whether it could drive a desktop app and film the demo itself. On my Linux machine the answer was no: Wayland blocked screenshots and input injection. Its reasoning was hard to argue with:

> "If step 4 of 40 silently missed, I'd cheerfully keep going and hand you garbage at 6am. I won't pretend that's a plan."

## Step 5: Claude directed, Codex starred

So I moved to my Mac mini. At 11:21 PM I opened a new Claude session, pasted the Linux "no" in full, and asked whether this machine could do it.

Two minutes later: **"Yes, this is feasible on this Mac — and it's not close."**

Mostly while I slept, steering from my phone, it ran this setup:

- **Claude was the user.** It typed Juan's scripted prompts into the Codex desktop app.
- **Codex was the agent on camera.** It opened my live site and called my WebMCP tools: `jupyter_open_notebook`, `jupyter_update_cell`, `jupyter_run_cells`.
- **Only the Codex window was recorded** (`screencapture -l<windowID> -v`), so the footage shows a real user flow and nothing else.
- **Editing went to subagents.** When I told it to act as a director, it briefed smaller models to do the rough cuts, title cards and a keynote-style layout, built entirely in ffmpeg.
- **The voiceover came from openai.fm**, OpenAI's free text-to-speech demo. After a few rejected local voices, I picked it at 1:25 AM. The narration on my OpenAI hackathon demo was voiced by OpenAI.

It filmed all four projects overnight.

## Step 6: Submitting from work

The next morning I was at work, steering from my phone. Claude uploaded the videos and filled in the Devpost forms. It also drew three lines it would not cross:

- **It would not click "Create channel" on YouTube**, because that accepts the terms of service on my behalf: *"this is a firm line, not a judgment call I can waive under deadline stress."*
- **It would not solve CAPTCHAs.** There were three, at 11:29, 11:52 and 12:10. Each time it waited, and each time "someone" at the Mac mini cleared it. That someone was my fiancé, who was keeping an eye on the machine while I was out.
- **It left 2FA to me.** The GitHub login prompt went to my phone.

The four submissions:

| Time (PDT) | Entry              |
| ---------- | ------------------ |
| 11:43 AM   | JupyterLite WebMCP |
| 11:51 AM   | Swagger UI WebMCP  |
| 12:09 PM   | Careers WebMCP     |
| 12:16 PM   | Strudel WebMCP     |

**Four entries in 33 minutes, 44 minutes before the 1 PM deadline.**

Except the deadline wasn't 1 PM anymore. At 11:25, Claude had told me the Devpost countdown showed an extension to 1:00 AM. I didn't believe it and told it to ship anyway. It was right; an outage had pushed the deadline back 12 hours.

## Step 7: Overruling my own agents

That afternoon I asked Claude to estimate my odds. It sent **11 agents to score 541 competitor repositories** against the official judging criteria. The verdict:

- My four scored 33–34 out of 40, and 13 entries beat my best.
- Odds that any of my four would win: **"realistically closer to 10-20%."**
- JupyterLite was tied for lowest of my four, because "an AI pair-editor for an existing IDE" read as incremental. It recommended spending the extra hours on Swagger UI.

I asked, *"you didnt like jupyter?"* I knew something its rubric didn't weight: nothing else in the field looked like it.

So I spent the extension on JupyterLite. At 4:06 PM I described Propose/Deny in a single message, and **it shipped 32 minutes later.** In Propose mode, an agent's edit waits as an inline diff until you accept or deny it, and if you deny it, the agent gets your reason back so it can revise instead of retrying.

That evening I tried to re-cut better videos and it went badly. At 12:52 AM, Claude made the call on its own: *"7 minutes to deadline. Not enough time to safely upload 4 new YouTube videos and swap Devpost links."* I agreed. **A complete, working submission beats a better video with a broken link.**

## The result

On September 28, @OpenAIDevs posted:

> "JupyterLite WebMCP brings an agent into your live notebook to edit cells, run code and review changes together. Built by Allison Coleman and Juan Mendoza."

**One of 10 winners, from nearly 2,500 projects.** The judged version is tagged `webmcp-challenge-winner` in the repo.

Independent AI-driven reviews of the field disagreed with each other. One AI-assisted review published in early September had JupyterLite at #2 on its initial shortlist. A separate 1,035-agent judging fleet ranked it #829, because its test browser didn't have WebMCP enabled and my status bar honestly said so. The human panel picked it.

## What the logs corrected

Before writing this, I had Claude read every log from those three days. My memory had compressed the story:

- **"I submitted with minutes to spare."** I submitted with 44 minutes to spare, against a deadline that had already been extended. The "minutes to spare" moment was the following night, deciding *not* to swap the videos.
- **"I ran it all in dangerous mode."** The Mac session ran in Claude's standard auto mode the whole time.
- **"It took about three days."** It was about 40 hours from the first contract to the last submit.

Memory keeps the intensity and drops the timestamps. Agent logs keep both.

## What I actually did

Across the run, **about 300 prompts from me became about 16,000 agent tool calls** across Claude Code and Codex on two machines. That produced about 43,000 lines of code, tests and config, and 80 commits across the four submitted repos.

| I decided                                   | Agents did                                        |
| ------------------------------------------- | ------------------------------------------------- |
| Submit four entries, not one                | Turned my objections into six build contracts     |
| Kill Storybook, even though it was finished | Built Storybook, then the four submissions        |
| Test against the real WebMCP, not a shim    | Ran QA on the live sites and fixed what broke     |
| Remove the dishonest status bar             | Found a kernel race and two access-control leaks  |
| Move to the Mac when Linux said no          | Filmed, voiced, edited and uploaded four demos    |
| Bet on JupyterLite over my agents' pick     | Scored 541 competitors and said I'd probably lose |
| Don't swap the videos at 12:52 AM           | Made that call first and waited for me to agree   |

## Key takeaways

- **Kill the wrapper.** If an existing tool already does the job, your version needs a reason to exist. Shelving a finished project freed me to find the one that won.
- **Write contracts, not prompts.** A 45,000-character contract plus a one-line prompt did more than any amount of mid-session prompting.
- **Parallelize your bets.** Four entries meant four chances, and the run showed which idea was strongest.
- **Keep the human steps human.** Terms of service, CAPTCHAs and 2FA still need a person, and that's fine.
- **Taste is the job.** My agents did the labor. The calls that changed the outcome, including overruling their ranking, were mine.

Over the next few weeks, I'll cover the WebMCP thesis, the contract method, why my agents underrated the winner, and how the notebook works under the hood.

---

**Try it:** [live demo](https://jupyterlite-web-mcp.vercel.app/lab/index.html) (Chrome with WebMCP enabled) · `pip install jupyterlite-webmcp` · [GitHub](https://github.com/alliecatowo/jupyterlite-web-mcp) · [Devpost](https://devpost.com/software/jupyterlite-webmcp) · [demo video](https://youtu.be/B_7dSo4hH0k)

Built with Juan Mendoza. Thanks to OpenAI and Devpost for running the challenge. Follow along on X: [@AllieCatOwO](https://x.com/AllieCatOwO).
