---
title: 'Contract, Not Prompt: The Agent Workflow Behind Four Hackathon Submissions'
date: 2026-10-01
description: 'I argue with ChatGPT until my objections turn into a 45,000-character build contract, paste it into Claude Code with one line, and only steer for taste. Here is the method, the receipts, and where it broke.'
category: dev
tags:
  - agents
  - claude-code
  - codex
  - workflow
  - webmcp
author: Allison Coleman
published: false
featured: false
slug: contract-not-prompt
---

People keep asking me what prompt I used to win the WebMCP Challenge. The honest answer is one line:

> implement full spec relentlessly and most improtantly EFFECIENTLY

That line went at the bottom of a 45,000-character document. The document did the work. This post is about how I make those documents, what goes in them, and what still broke.

The short version:

1. Think out loud in a cheap chat, mostly by rejecting things.
2. Have the chat compile my rejections into a build contract.
3. Paste the contract as the first message of a fresh agent session, plus one line.
4. Let the repo hold the state, not the chat.
5. Verify on the real surface, with a second vendor's agent as QA.
6. Steer only on taste: what to kill, what to cut, what's dishonest.

Over two days this turned about 300 of my prompts into about 16,000 agent tool calls across Claude Code and Codex on two machines. Treat that as an order of magnitude, since it mixes tools. Six contracts became five builds, four submissions and one winner.

## 1. Think in a cheap chat, by rejection

I always do my thinking in ChatGPT, mainly because it's basically free. It's on my $20 plan, and at the time that meant a GPT-5.6 model at high thinking. Anything I can do to leverage that gives me more usage, which lets me ship more, faster, by leveraging concurrency. I want my Claude credits to go to code. I also just like ChatGPT better for ideation. It's a bit warmer, and it has a better chat system: the memories, the web app, the phone app. It'd be cool to use Opus for it sometimes, but the price wins.

Here's how it actually goes. I start by saying what I want, all at once, freeform: a loose, profane stream of thought, often by voice. That's where the "yes" lives. Then ChatGPT adds structure, and once there's structure it's obvious where it got me right or wrong. That's where the rejecting starts. I don't know exactly what I want up front. As it builds, my vision forms. So why preempt it? I trust it to be pretty much exact on what I said, and I specify what I don't want.

In the WebMCP ideation chat (40 of my turns over about 30 hours, roughly 25 ideas parked), the important messages are all objections:

- "if a normal MCP server can do it, WebMCP is a wrapper" (ChatGPT's restatement of me killing Storybook)
- "its gotta be a task thats far easier visually and exposes _more minute conteol_ then chat interface would."
- "oh and it CANT be dependent on ai."
- "oh drop that then if web mcp cant _trigger_ the agent on state changes"

ChatGPT's job is stenographer. It turns each rant into a principle, and each principle into a named contract section:

| What I said                                                                | What it became                                                                                             |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| "it CANT be dependent on ai"                                               | §2 THIS IS NOT AN AI APPLICATION, and §63 PRODUCT BOUNDARY TEST                                            |
| "drop that then if web mcp cant _trigger_ the agent"                       | §10 CRITICAL WEBMCP LIMITATION, plus a hostile-audit item for "unsupported claims about triggering agents" |
| "google doc style comments on selections of cells"                         | §33–47 threaded review, including "COMMENTS ARE NOT 'AI COMMENTS'"                                         |
| "cargo cults"                                                              | §5 REFERENCE IMPLEMENTATIONS TO STUDY / CARGO-CULT CAREFULLY                                               |
| "the more exactly laid out the spec the less time his agents will … drift" | vendor the contract, "Do not re-ideate", "SHIP, DO NOT KEEP IDEATING"                                      |
| "sonnet / haiku workers where possible"                                    | (OpenAPI contract) §11 MODEL / AGENT BUDGET, §12 EXACT AGENT TOPOLOGY, §98 FINAL HAIKU AUDIT PROMPT        |

Here's §10 of the JupyterLite contract, which exists because I got annoyed at 6:46 PM:

> WebMCP cannot independently wake, summon, or notify an agent when something changes.
>
> Therefore:
>
> - selecting code does NOT call the agent
> - changing a cell does NOT call the agent
>   …
>   Do not imply otherwise anywhere.

I edit by delta, not by rewrite: "if it is, dont bother rewrite", "tweak if you need. otherwise gimme that strudel spec". When I'm done, I ask for the "full and final one paste prompt", and ChatGPT writes "Everything below is the single final paste. It supersedes the earlier prompts."

From killing Storybook to the JupyterLite contract took about an hour and 45 minutes and about 15 of my messages.

I'd still call that "a couple of messages." Fifteen messages over an hour and forty-five minutes is really just a couple of ideas. The rest of those 40 turns was fine-tuning after the fact.

## 2. Compile it into a contract

A prompt asks for something. A contract defines what done means, what's forbidden, how to prove it works, and (in the later ones) who does which part at what price.

Compiling the vision into a contract is super, super important. The vision is just me articulating what I want. Writing it down canonizes those loose freeform ideas, cleaned and scrubbed. The contract is the next step. Once you have a contract, you can break it down into atomic tasks.

The JupyterLite contract has 65 sections and 45,233 characters. Roughly, in order:

- **What and why:** product, THIS IS NOT AN AI APPLICATION, WHY THIS IS WEBMCP
- **Where it comes from:** upstream strategy, reference implementations to "cargo-cult carefully", the exact repository structure, architecture, the Jupyter APIs to use
- **Hard limits:** WebMCP lifecycle, CRITICAL WEBMCP LIMITATION, the core product principle
- **Every tool, one section each:** `jupyter_get_context` through `jupyter_kernel_action`, with schemas
- **The guts:** hashing and concurrency, the error model, security, a minimal UI, sample content, the demo notebook, a golden demo
- **Review:** fifteen sections on threaded comments, anchoring and the review tools
- **Proof:** a test-only WebMCP shim, unit tests, browser tests, CI, deployment
- **Shipping:** README, tool docs, demo script, submission positioning, WHAT NOT TO BUILD, priority order
- **The end:** HOSTILE AUDIT, ACCEPTANCE CRITERIA, GOLDEN FINAL INTERACTION, PRODUCT BOUNDARY TEST, FINAL COPY, SHIP IT

The top of the document is about not stopping:

> Build this project completely.
>
> Do not stop after scaffolding, architecture, a prototype, or partial tool registration. Continue until the extension works end-to-end, the public JupyterLite deployment works, tests pass, the demo fixture is polished, the repository is submission-ready, and the WebMCP Challenge requirements are satisfied.
>
> Do not ask routine implementation questions.

And it gives a tie-break order for ambiguous choices: correctness, native Jupyter behavior, smallest robust architecture, visible shared human/agent state, WebMCP correctness, demo quality, minimal bespoke UI. Plus: "Do not invent features merely because an agent can implement them."

The acceptance criteria are where the honesty lives. The JupyterLite list includes things like "no fake production shim" and "stale write cannot overwrite user". The Storybook contract says "Record actual results only." The Careers contract has a stop condition (§87) that Claude later cited when it decided it was done.

### Writing the org chart into the spec

This is the part I want to be precise about, because it's easy to overstate.

The **JupyterLite** contract, the one that won, doesn't say which models to use. For that build the orchestration came from a process prompt I sent three minutes after the paste: "minimal minimal absolute minimal token / context usage. wait for htings, don't poll, dispatch haiku for mechanical coupel fo fies changed sorta things just never ever ever do shit yourself ot tsave tokens."

By the time I wrote the next three contracts that night (Swagger UI, Strudel, Careers), I'd moved that into the document itself. From the Swagger UI contract:

```
11. MODEL / AGENT BUDGET STRATEGY
This project is token constrained.
USE THE CHEAPEST MODEL CAPABLE OF THE TASK.
...
Do NOT spawn Opus/Fable/high-cost workers for broad exploration.
...
Do not create a hierarchy of agents managing agents.
Do not use 20 reviewers.
Do not fan out repository-wide exploration.
Token efficiency is part of the execution requirement.

12. EXACT AGENT TOPOLOGY
Maximum useful parallel work:
3-4 workers concurrently
...
Scout phase: 2 Haiku workers.
Implementation phase: 3-4 Sonnet workers.
Audit phase: 1 Haiku auditor.
Fix phase: 1 Sonnet only if audit finds real issues.
That is enough.
```

The scouts get named, read-only briefs ("HAIKU SCOUT 1 — SWAGGER INTERNALS"). The workers get named lanes. The audit gets its own prompt. It's an org chart, written once, in the document every agent reads first.

So "one line replaced my harness" is wrong. The harness got compiled into the contract, and the one line started it. When it drifted, I still had to shout. To Codex on Storybook: "HAVE AN AGENT TAKE THE PATCH THROUGH IT. YOU DONT DO ANYTHING. YOU DLEEGATE AGENTS. THATS IT."

Where did I learn to do that? From cost. It's all for cost. That's what I've learned.

- **Count turns, not just tokens.** Every turn resends the previous context plus the new message, so cost grows faster than the number of turns. Prefix caching helps, but it's not enough to offset that. A Haiku agent that writes a couple of files in five turns, consolidated by Sonnet, then checked once by Opus, uses dramatically fewer turns than one Sonnet worker taking 50 to 120 turns to implement and verify.
- **Map-reduce.** Break tasks down until they're atomic, fan out wide, and move checking into deterministic checks instead of Claude. Commit once, when it's ready, not a WIP commit every five minutes. The bigger the batch, the better.
- **No agents managing agents.** Nested subagents can really mess things up. Agents managing agents is where you start to get degradation and confusion.
- **Opus where it counts.** Opus is the one that's smart enough, so it gets the verification. Even the demo filming on the Mac ran on Sonnet, for cost. If I'd said "Opus, figure this out," it would have burned through my usage, and I wouldn't have been able to submit.

Where I'd like to go is even less intelligence in the loop. I think even a smart orchestrator is too much. I'd prefer a deterministic orchestrator that routes the state machine and the tasks, and calls on frontier intelligence only at milestones. Cursor found something like this building SQLite in Rust with agent swarms: few moments in a large task genuinely require frontier intelligence.

And normally I wouldn't even specify the model budget or the exact topology. I wish I had a good harness for that, but nothing has worked as well as just saying what I want and how to work. If I had all-you-can-eat tokens, my instructions would be: I don't give a shit, be exhaustive, maximize concurrency for speed.

## 3. Paste it, plus one line

The contract goes in as message one of a fresh session, often from my phone. Then I send one to three "how to work" messages and leave. I also lean on `/goal` as an autonomy lever. Claude Code keeps working until an evaluator agrees the goal is met:

- JupyterLite: `/goal original spec is fully implemented`
- Strudel: `/goal implement till proud of how submission worthy this is`
- Careers: `/goal implement with swarm till proud of how submission worthy this is and sam Altman wants to pay me a million dollars`

The last one looks like a joke, and it's only half a joke. I knew it was unfulfillable. That's the point. An unfulfillable goal is a `while true` loop: it keeps the agent going until I'm out of usage, instead of letting it decide too early that the goal is met. The real goal is the contract and the state of the repo, not the sentence after `/goal`.

That time, it was a foot-gun. The evaluator read it literally ("The condition is a conjunction (AND) of two clauses…") and kept saying "not met" for half an hour. Claude refused to fake the second clause ("I won't fabricate a message, email, or log claiming otherwise") and asked me to run `/goal clear`. A contract encodes your jokes as firmly as your requirements, so if you want a `while true`, say so.

How long does it run alone? On JupyterLite, the first commit landed 27 minutes after the paste. Strudel ran 140.8 minutes on a single prompt, until the session limit stopped it. JupyterLite ran 100.9 minutes after one taste prompt, and Careers 62.9 minutes. On Linux, 97 of my prompts produced 5,675 Claude tool calls, about 58 per prompt. 47 of those 97 prompts were typed while the agent was already working, and it absorbed them without stopping.

On that first JupyterLite paste, I left my laptop open on the couch and went back to ChatGPT to write the next contract. I knew it would work. The artifact was easy to test (does the WebMCP work or not?), and Storybook had already been almost a test run.

## 4. The repo is the state machine

The first instruction in my later contracts is to save the contract itself into the repo as `docs/BUILD_CONTRACT.md`, next to a `CLAUDE.md` that says "Do not re-ideate the product." From then on the repo is the source of truth, and the chat is just a window.

That's what let this survive everything that happened to it:

- two kernel-update reboots mid-build (I `/resume`d the session)
- a session limit every few hours
- switching vendors mid-project (Codex picked up Storybook five minutes after Claude hit its limit, with the same spec)
- switching machines (the Mac mini picked up the demo work from files, and I told it "keep durable docs so you survivie compact")
- Codex importing my Claude sessions, so it could read what Claude had done

For a while the record had a hole. Between 5:07 and 7:23 PM on Sep 2, 26 commits landed across all four repos (six of them in 28 seconds) while I was connected from my phone, and there was no Claude or Codex transcript for any of them on either machine. When Claude asked me about them, I had no idea. My best guess was OpenCode or some other free harness.

It was OpenCode. Four minutes after all four Claude sessions hit their limit at 4:38 PM, I'd started an OpenCode session on the Linux box, titled "Web MCP projects deep review and prod deploy," with: "review each one with a seperate agent deeply, commit andnrun their deploy to prod". Every one of those 26 commits is in its subagents, to the second. It ran on a GLM model through a coding plan at first, then on free models. I'd forgotten the whole thing. The repo didn't care. It's the same state machine whichever harness writes to it, and that made it the third vendor of the day.

It broke once in an instructive way. On Sep 2 at 9:23 PM, Claude checked the live site and found the deployed bundle didn't match any commit: "the other agent rebuilt and deployed. So production is running code that exists on no commit." Codex, doing QA, had rebuilt and deployed from the same working tree. Claude fixed it by committing the deployed tree. The rule I took from it: **one writer per state.** Two agents can read the same repo all day, but only one should be allowed to deploy it.

Here's the argument for the repo as the state machine, for the skeptical staff engineer.

**It's portable.** If the state lives in the repo, I can pass it off anywhere. I don't need to know what the agent was doing. I `git add`, `git commit` a WIP, push it, and pick it up in Codex, which is something I can do from my phone.

**It's how I start projects.** From my phone, sometimes literally: `gh repo create`, open Vim, paste the vision into `vision.md`, and say "implement the initial vision." Then: make a spec out of it. Then: take the spec and make a `tasks.md`. That file is portable too. You could load it into GitHub Issues, GitHub Projects, Linear, Jira or Todoist. Linear is a little heavy, and you only get a couple hundred tasks, which doesn't fit how atomically I break work down. So why add task-management software when the repo is where the code already lives? It costs nothing.

**It's read as rules.** As an agent explores files, it treats what it finds as rules, no different from a rule file. If the agent builds that state out alongside the implementation, it's much harder for it to drift.

**It's auditable, and you can go back.** Each agent makes PRs. The orchestrating agent reviews them, merges them, or re-delegates. Each PR changes the harness and leaves a trail. When things get really messed up and start to decompose, you can step back and say: wait, three days ago an auditor listed this as the highest priority, and I see no work on it. Then you can throw away a day or two of work and go back to that decision point. Think of it like architectural decision records, which are very successful. The repo as a state machine is an extension of that.

**It doesn't limit the model.** Imagine I spent the time encoding all this into a harness, and it turned out not to use usage efficiently. You lose flexibility, you limit the intelligence, and you inject things into its context. What it needs is access and capability, auditable decisions, and a place to record its decision-making. And what I want changes. I don't want to tweak a pile of settings when it does. I just want to tell it how to work.

## 5. Verify on the real surface, with a second vendor

The contracts ask for a test-only WebMCP shim so Playwright can drive the tools. That's fine for unit coverage. It's not proof. Claude said this better than I did, in the Careers session at 8:28 PM on Sep 2: "**The shim is still the shim.** Everything above proves the _tools and the site_ are correct. It does not prove ChatGPT's in-app browser or Chrome-with-WebMCP will discover them."

The first night I was blunter: "I DONT WANT FUCKING PLAYWRIGHT SURE YOU CAN USE THAT BUT I WANT YOU TO FUCING DRIVE WITH THE FUCKING MCP." Once Claude was driving Chrome 150 with the experimental flag on, it came back with: "Real bugs found by driving the browser, not by reading code." The big one was a race where `jupyter_open_notebook` could fire about 575 ms before JupyterLite had registered its kernels.

Then I added a second vendor. Codex Desktop has a browser that could see WebMCP, so I had Codex drive the live sites as an outside user. The repos ship a `CODEX_DRIVER.md` that starts: "You are an external agent (Codex) with a WebMCP-capable browser. Verify this site from the flows, not the code." Codex's verdicts came back like this:

```
## NOT READY TO RECORD

## BLOCKERS

- Production still emits a Swagger UI `TypeError` on the first WebMCP read. Local fix is not committed or deployed.
```

I pasted those into Claude, Claude fixed them, and the commits say so: "Fix three defects found in the live in-app-browser acceptance pass". I was the relay between two companies' agents. It worked because they don't share blind spots, and neither one is invested in the other's work being good.

Was that deliberate? Partly. Codex had to be the QA. It's an OpenAI competition, the Codex app was the only one set up for this, and I believed the judges would test with Codex. So of course the thing checking it was Codex. It also saves cost. If Codex can do all of that with a cheaper model, Claude isn't fucking around with a broken WebMCP bridge.

## 6. Session limits are a scheduler

I was on the $100 Claude plan and the $20 Codex plan, and I hit Claude's session limit nine times in two days. At 4:38 PM on Sep 2, all four project sessions hit it within 70 seconds. Between 3 and 7 AM that morning, nothing ran at all, because every agent was limited or I was asleep.

So the limits decided who worked when. Claude ran out on Storybook at 1:43 PM, and Codex had the same spec five minutes later. When the reset came at 7:53 AM I sent "rates back, use agents". The contracts' cheapest-model rule isn't style. It's how you get more hours out of the same plan.

The way I think about it: I'm limited by the tokens per second I can get, averaged over the downtime of waiting for a limit to come back. Even at a steady 50 tokens a second, which it isn't, because there's a lot of wall time waiting on requests, every hour spent waiting on usage drags the average down. More usage means more concurrency. Fast mode would have been a dream. Codex filled some gaps, and when Claude was out, OpenCode picked up the slack, on a GLM coding plan and then free models. I hit the wall at 4:38 PM, and the commits started landing again half an hour later.

## 7. Launch remotely, polish locally, steer in bursts

There were two modes, and the logs show them clearly.

**Launch mode** was mostly from my phone: SSH into the Linux box over Tailscale or a Claude Code session started from the app. One contract plus a couple of process prompts, then hours alone. The Careers build got two prompts total. Then I'd get home, check on it from my laptop, supervise a little more, and steer in bursts.

**Polish mode** was at the keyboard, with three sessions side by side, a median of about two minutes between prompts, and bursts of five to seventeen short taste prompts. I'd broadcast the same prompt to all three: "can you SELL IT?" went to JupyterLite, Careers and Swagger UI within 14 seconds.

I don't even remember sending that one. What do I watch when three or four agents are running? Things that stick out. I'm looking at their outputs: the actual apps, the previews, the screenshots they send at checkpoints. I'm not checking their diffs. I'm not at the level where I'm checking their diffs. I'm checking their concepts, and watching for when they start producing internal techno-babble and going down rabbit holes, so I can steer them. That's why preview environments and checkpoint images matter so much to me.

And sometimes, when they've been going a long time and I can see them all wrapping up, I ask: can you sell it? As an agent goes deeper into its context, it gets tunnel vision. The more code it writes and the more it talks like a professional software engineer ("section 3.3 is verified, and the adapter…"), the narrower it gets. When I come in with "bro, can you make sure this shit is good and it ships good?", it destabilizes the agent and seems to activate new hidden states. It almost functions as a temperature fluctuation: as the agent cools down, I inject more randomness, bursts of creativity and taste, and also criticality.

The taste prompts are the actual job. In two days, the calls that changed the outcome were mine:

- kill the finished Storybook
- drive the real WebMCP, not a shim
- cut the "19 tools" panel ("th ecodex ui suppleis it")
- remove the status bar that claimed an agent was connected
- ship without Propose mode, then spec it the next day
- cut widgets ("get it wokring first")
- pick JupyterLite over my own agents' pick

Most of those were typed in all caps, and at least one was wrong (I ignored a deadline extension for four hours). Taste isn't always right. It's just the part you can't hand off.

## 8. Where it broke

I want to be fair about the failures, because they're where the method improves:

- **55 background shells.** Left alone, the lead agent started waiting on things by spawning shells. I found 55 of them, then "now youre spamming monitors when you don't need to". The "don't poll" line in my process prompt exists because of this.
- **Two writers deploying.** Covered above.
- **The wrong-session paste.** From my phone, I pasted the Strudel contract into the Swagger UI session. That one's on me.
- **The `/goal` joke.** Covered above.
- **A false negative from its own tooling.** Claude spent a stretch convinced the live kernel was broken, then retracted: "my automation profile had a remembered 'No Kernel' choice… That's my instrumentation, not your product."
- **CI retries hiding flakes.** Claude flagged that `retries: 1` in CI meant "the green badge is stronger than the signal behind it", logged it, and didn't fix it in time.
- **The safety classifier.** Security-audit subagents got blocked twice and had to be re-prompted with softer wording.

What I'd change, based on the logs rather than my memory:

- fewer broadcast rage prompts
- one writer per deploy, written into the contract
- a demo-video pipeline from day one, not hour 36
- if I want a `while true`, say so, instead of a joke the evaluator takes literally
- turn Claude's scratch-folder cleanup into a rule, on a small disk

## A contract skeleton you can copy

This is the shape, with the hackathon-specific parts stripped out. Fill in each section from your own "no, because…" list.

```markdown
# ONE-SHOT BUILD CONTRACT — <PROJECT>

Build this project completely. Do not stop after scaffolding,
architecture, a prototype, or partial implementation. Do not ask
routine implementation questions; inspect upstream code and decide.

When a choice is ambiguous, optimize for, in order:

1. correctness 2. native platform behavior 3. smallest robust architecture
2. <your product's core value> 5. demo quality 6. minimal bespoke UI
   Do not invent features merely because an agent can implement them.

# 0. FIRST ACTION

Save this contract verbatim to docs/BUILD_CONTRACT.md.
Create CLAUDE.md: "This contract is the source of truth. Do not re-ideate the product."

# 1. PRODUCT — one paragraph, one user, one moment

# 2. WHAT THIS IS NOT — each of your objections, as a hard rule

# 3. WHY THIS APPROACH — why not the obvious alternative

# 4. HARD LIMITS — what the platform cannot do; "Do not imply otherwise anywhere."

# 5. UPSTREAM + LICENSE — what you build on, what you may copy

# 6. REFERENCES — what to study, what to cargo-cult carefully

# 7. REPO LAYOUT — exact tree

# 8. ARCHITECTURE — one-way layers

# 9..N. ONE SECTION PER OPERATION — inputs, outputs, errors, bounds

# N+1. CONCURRENCY — how stale writes are refused

# N+2. ERROR MODEL

# N+3. SECURITY

# N+4. MODEL / AGENT BUDGET

# Use the cheapest model capable of the task.

# Scouts: 2 cheap, read-only. Workers: 3-4 mid-tier, named lanes.

# Auditor: 1 cheap. Fixer: 1 mid-tier, only for confirmed findings.

# No hierarchy of agents managing agents. No 20 reviewers.

# One writer per deploy.

# N+5. TESTS — unit, browser, the CRITICAL cases by name

# N+6. VERIFY ON THE REAL SURFACE — not only the shim

# N+7. WHAT NOT TO BUILD

# N+8. PRIORITY ORDER

# N+9. HOSTILE AUDIT — list the lies this project could tell

# N+10. ACCEPTANCE CRITERIA — "Do not consider the project complete until…"

# N+11. STOP CONDITION

# N+12. SHIP IT — "SHIP, DO NOT KEEP IDEATING."
```

Then paste it as the first message of a fresh session and add one line telling it to go. Mine misspelled two words, and it still worked. We have the spec. You paste it and say make it. That's all you fucking need.

The whole point is that you don't need a prompt-guru structure. The AI takes a loose stream of thought, the kind I dictate from my phone while I'm doing two other things, and it synthesizes. It's a sieve. My job is the ideas, which is the one thing it can't do, and the rejections once it's given them structure.
