---
title: "Contract, Not Prompt: The Agent Workflow Behind Four Hackathon Submissions"
author: Allison Coleman
category: dev
date: 2026-10-01
description: I argue with ChatGPT until my objections turn into a 45,000-character build contract, paste it into Claude Code with one line, and only steer for taste. Here is the method, the receipts, and where it broke.
featured: false
published: false
slug: contract-not-prompt
tags:
  - agents
  - claude-code
  - codex
  - workflow
  - webmcp
---

## The prompt was one line

People often ask what prompt I used to win the WebMCP Challenge. The prompt was one line:

> implement full spec relentlessly and most improtantly EFFECIENTLY

That line was added at the bottom of a 45,000-character document. The document did most of the work. This post describes how I make those documents, what goes in them, and what still failed.

The short version:

1. Think out loud in a low-cost chat, mostly by rejecting things.
2. Have the chat compile my rejections into a build contract.
3. Paste the contract as the first message of a fresh agent session, plus one line.
4. Let the repo hold the state, not the chat.
5. Verify on the real surface, with a second vendor's agent as QA.
6. Steer only on taste: what to kill, what to cut, what is dishonest.

Over two days this produced about 300 of my prompts and about 16,000 agent tool calls across Claude Code and Codex on two machines. This is an order of magnitude, since it mixes tools. Six contracts became five builds, four submissions and one winner.

## Think in a low-cost chat, by rejection

I do my thinking in ChatGPT, mainly for cost. It is included in my $20 plan, and at the time that meant a GPT-5.6 model at high thinking. Using it for ideation preserves my Claude credits for code and lets me ship more through concurrency. I also prefer ChatGPT for ideation: its tone is warmer, and it has better memory, web and phone apps. Opus would be a reasonable choice, but price decides it.

Here is how it goes in practice. I start by saying what I want, all at once and freeform, often by voice. That is where the "yes" comes from. ChatGPT then adds structure, and once there is structure it is clear where it matched my intent and where it did not. That is when I start rejecting. I do not know exactly what I want up front; my vision forms as the structure builds. I trust it to restate what I said accurately, and I specify what I do not want.

In the WebMCP ideation chat (40 of my turns over about 30 hours, roughly 25 ideas parked), the key messages are all objections:

- "if a normal MCP server can do it, WebMCP is a wrapper" (ChatGPT's restatement of me killing Storybook)
- "its gotta be a task thats far easier visually and exposes *more minute conteol* then chat interface would."
- "oh and it CANT be dependent on ai."
- "oh drop that then if web mcp cant *trigger* the agent on state changes"

ChatGPT acts as a stenographer. It turns each rant into a principle, and each principle into a named contract section:

| What I said                                                                | What it became                                                                                             |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| "it CANT be dependent on ai"                                               | §2 THIS IS NOT AN AI APPLICATION, and §63 PRODUCT BOUNDARY TEST                                            |
| "drop that then if web mcp cant *trigger* the agent"                       | §10 CRITICAL WEBMCP LIMITATION, plus a hostile-audit item for "unsupported claims about triggering agents" |
| "google doc style comments on selections of cells"                         | §33–47 threaded review, including "COMMENTS ARE NOT 'AI COMMENTS'"                                         |
| "cargo cults"                                                              | §5 REFERENCE IMPLEMENTATIONS TO STUDY / CARGO-CULT CAREFULLY                                               |
| "the more exactly laid out the spec the less time his agents will … drift" | vendor the contract, "Do not re-ideate", "SHIP, DO NOT KEEP IDEATING"                                      |
| "sonnet / haiku workers where possible"                                    | (OpenAPI contract) §11 MODEL / AGENT BUDGET, §12 EXACT AGENT TOPOLOGY, §98 FINAL HAIKU AUDIT PROMPT        |

Section 10 of the JupyterLite contract exists because I was frustrated at 6:46 PM:

> WebMCP cannot independently wake, summon, or notify an agent when something changes.
>
> Therefore:
>
> - selecting code does NOT call the agent
> - changing a cell does NOT call the agent
>   …
>   Do not imply otherwise anywhere.

I edit by delta rather than by rewriting: "if it is, dont bother rewrite", "tweak if you need. otherwise gimme that strudel spec". When I am done, I ask for the "full and final one paste prompt", and ChatGPT writes "Everything below is the single final paste. It supersedes the earlier prompts."

From killing Storybook to the JupyterLite contract took about an hour and 45 minutes and about 15 of my messages.

I would still describe that as "a couple of messages." Fifteen messages over an hour and forty-five minutes amounts to a couple of ideas. The rest of those 40 turns was fine-tuning afterward.

## Compile the vision into a contract

A prompt asks for something. A contract defines what done means, what is forbidden, how to prove it works, and (in the later ones) who does which part at what price.

Compiling the vision into a contract is the key step. The vision is my articulation of what I want. Writing it down makes those loose ideas explicit, cleaned and scrubbed. The contract is the next step, and once there is a contract it can be broken into atomic tasks.

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

The top of the document tells the agent not to stop:

> Build this project completely.
>
> Do not stop after scaffolding, architecture, a prototype, or partial tool registration. Continue until the extension works end-to-end, the public JupyterLite deployment works, tests pass, the demo fixture is polished, the repository is submission-ready, and the WebMCP Challenge requirements are satisfied.
>
> Do not ask routine implementation questions.

It also sets a tie-break order for ambiguous choices: correctness, native Jupyter behavior, smallest robust architecture, visible shared human/agent state, WebMCP correctness, demo quality, minimal bespoke UI. It adds: "Do not invent features merely because an agent can implement them."

The acceptance criteria are where the honesty requirements appear. The JupyterLite list includes items like "no fake production shim" and "stale write cannot overwrite user". The Storybook contract says "Record actual results only." The Careers contract has a stop condition (§87) that Claude later cited when it decided it was done.

### Writing the org chart into the spec

This part needs precision, because it is easy to overstate.

The **JupyterLite** contract, the one that won, does not specify which models to use. For that build, the orchestration came from a process prompt I sent three minutes after the paste: "minimal minimal absolute minimal token / context usage. wait for htings, don't poll, dispatch haiku for mechanical coupel fo fies changed sorta things just never ever ever do shit yourself ot tsave tokens."

By the time I wrote the next three contracts that night (Swagger UI, Strudel, Careers), I had moved that into the document itself. From the Swagger UI contract:

```text
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

The scouts get named, read-only briefs ("HAIKU SCOUT 1 — SWAGGER INTERNALS"). The workers get named lanes. The audit gets its own prompt. The result is an org chart, written once, in the document every agent reads first.

So "one line replaced my harness" is inaccurate. The harness was compiled into the contract, and the one line started it. When an agent drifted, I still had to intervene. To Codex on Storybook: "HAVE AN AGENT TAKE THE PATCH THROUGH IT. YOU DONT DO ANYTHING. YOU DLEEGATE AGENTS. THATS IT."

I learned to do this from cost. The orchestration is driven by cost:

- **Count turns, not just tokens.** Every turn resends the previous context plus the new message, so cost grows faster than the number of turns. Prefix caching helps, but it does not fully offset that. A Haiku agent that writes a couple of files in five turns, consolidated by Sonnet, then checked once by Opus, uses far fewer turns than one Sonnet worker taking 50 to 120 turns to implement and verify.
- **Map-reduce.** Break tasks down until they are atomic, fan out wide, and move checking into deterministic checks instead of Claude. Commit once, when the work is ready, rather than a WIP commit every five minutes. Larger batches are better.
- **No agents managing agents.** Nested subagents can cause problems. Agents managing agents is where degradation and confusion begin.
- **Opus where it counts.** Opus is the model smart enough for verification, so it gets that work. Even the demo filming on the Mac ran on Sonnet, for cost. Had I told Opus to figure it out, it would have used up my usage and I would not have been able to submit.

I would like to move toward even less intelligence in the loop. Even a smart orchestrator may be too much. I would prefer a deterministic orchestrator that routes the state machine and the tasks, and calls on frontier intelligence only at milestones. Cursor found something like this building SQLite in Rust with agent swarms: few moments in a large task genuinely require frontier intelligence.

Normally I would not specify the model budget or the exact topology. I would like a good harness for that, but nothing has worked as well as stating what I want and how to work. With unlimited tokens, my instructions would be to be exhaustive and to maximize concurrency for speed.

## Paste the contract, plus one line

The contract goes in as message one of a fresh session, often from my phone. Then I send one to three "how to work" messages and leave. I also use `/goal` as an autonomy lever. Claude Code keeps working until an evaluator agrees the goal is met:

- JupyterLite: `/goal original spec is fully implemented`
- Strudel: `/goal implement till proud of how submission worthy this is`
- Careers: `/goal implement with swarm till proud of how submission worthy this is and sam Altman wants to pay me a million dollars`

The last one reads as a joke, and it was half of one. I knew the goal could not be fulfilled, and that was the intent. An unfulfillable goal acts as a `while true` loop: it keeps the agent going until I am out of usage, instead of letting it decide too early that the goal is met. The real goal is the contract and the state of the repo, not the sentence after `/goal`.

In that case it backfired. The evaluator read it at face value ("The condition is a conjunction (AND) of two clauses…") and kept saying "not met" for half an hour. Claude refused to fake the second clause ("I won't fabricate a message, email, or log claiming otherwise") and asked me to run `/goal clear`. A contract encodes jokes as firmly as requirements, so if I want a `while true`, I should say so.

How long does it run alone? On JupyterLite, the first commit landed 27 minutes after the paste. Strudel ran 140.8 minutes on a single prompt, until the session limit stopped it. JupyterLite ran 100.9 minutes after one taste prompt, and Careers 62.9 minutes. On Linux, 97 of my prompts produced 5,675 Claude tool calls, about 58 per prompt. 47 of those 97 prompts were typed while the agent was already working, and it absorbed them without stopping.

On that first JupyterLite paste, I left my laptop open on the couch and went back to ChatGPT to write the next contract. I expected it to work. The artifact was easy to test (does the WebMCP work or not?), and Storybook had effectively been a test run.

## The repo is the state machine

The first instruction in my later contracts is to save the contract into the repo as `docs/BUILD_CONTRACT.md`, next to a `CLAUDE.md` that says "Do not re-ideate the product." From then on the repo is the source of truth, and the chat is only a window.

That let the work survive everything that happened to it:

- two kernel-update reboots mid-build (I resumed the session with `/resume`)
- a session limit every few hours
- switching vendors mid-project (Codex picked up Storybook five minutes after Claude hit its limit, with the same spec)
- switching machines (the Mac mini picked up the demo work from files, and I told it "keep durable docs so you survivie compact")
- Codex importing my Claude sessions, so it could read what Claude had done

For a while the record had a hole. Between 5:07 and 7:23 PM on Sep 2, 26 commits landed across all four repos (six of them in 28 seconds) while I was connected from my phone, and there was no Claude or Codex transcript for any of them on either machine. When Claude asked me about them, I did not know where they came from. My best guess was OpenCode or another free harness.

It was OpenCode. Four minutes after all four Claude sessions hit their limit at 4:38 PM, I had started an OpenCode session on the Linux box, titled "Web MCP projects deep review and prod deploy," with: "review each one with a seperate agent deeply, commit andnrun their deploy to prod". Every one of those 26 commits is in its subagents, to the second. It ran on a GLM model through a coding plan at first, then on free models. I had forgotten the session. The repo was unaffected: it is the same state machine whichever harness writes to it, and that made OpenCode the third vendor of the day.

It broke once in an instructive way. On Sep 2 at 9:23 PM, Claude checked the live site and found that the deployed bundle did not match any commit: "the other agent rebuilt and deployed. So production is running code that exists on no commit." Codex, doing QA, had rebuilt and deployed from the same working tree. Claude fixed it by committing the deployed tree. The rule I took from it: **one writer per state.** Two agents can read the same repo all day, but only one should be allowed to deploy it.

Here is the case for the repo as the state machine.

**Portable.** If the state lives in the repo, I can hand it off anywhere without knowing what the agent was doing. I `git add`, `git commit` a WIP, push it, and continue in Codex, which I can do from my phone.

**How I start projects.** Sometimes from my phone: `gh repo create`, open Vim, paste the vision into `vision.md`, and say "implement the initial vision." Then: make a spec out of it. Then: take the spec and make a `tasks.md`. That file is portable too. It could be loaded into GitHub Issues, GitHub Projects, Linear, Jira or Todoist. Linear is somewhat heavy, and it has a limit of a couple hundred tasks, which does not fit how atomically I break work down. Since the repo is where the code already lives, there is little reason to add task-management software, and it costs nothing.

**Read as rules.** As an agent explores files, it treats what it finds as rules, no different from a rule file. If the agent builds that state out alongside the implementation, it is much harder for it to drift.

**Auditable, and reversible.** Each agent makes PRs. The orchestrating agent reviews them, merges them, or re-delegates. Each PR changes the harness and leaves a trail. When work degrades, I can step back and see, for example, that an auditor listed something as the highest priority three days ago and no work followed. Then I can throw away a day or two of work and go back to that decision point. This resembles architectural decision records, which are widely used. The repo as a state machine is an extension of that.

**It does not limit the model.** If I spent the time encoding all this into a harness and it turned out not to use usage efficiently, I would lose flexibility, limit the model's intelligence and inject extra material into its context. The model needs access and capability, auditable decisions, and a place to record its decision-making. My requirements also change, and I would rather tell it how to work than adjust a pile of settings.

## Verify on the real surface, with a second vendor

The contracts ask for a test-only WebMCP shim so Playwright can drive the tools. That works for unit coverage, but it is not proof. Claude put this better than I did, in the Careers session at 8:28 PM on Sep 2: "**The shim is still the shim.** Everything above proves the *tools and the site* are correct. It does not prove ChatGPT's in-app browser or Chrome-with-WebMCP will discover them."

The first night I was more direct: "I DONT WANT FUCKING PLAYWRIGHT SURE YOU CAN USE THAT BUT I WANT YOU TO FUCING DRIVE WITH THE FUCKING MCP." Once Claude was driving Chrome 150 with the experimental flag on, it reported: "Real bugs found by driving the browser, not by reading code." The most significant was a race where `jupyter_open_notebook` could fire about 575 ms before JupyterLite had registered its kernels.

Then I added a second vendor. Codex Desktop has a browser that could see WebMCP, so I had Codex drive the live sites as an outside user. The repos ship a `CODEX_DRIVER.md` that starts: "You are an external agent (Codex) with a WebMCP-capable browser. Verify this site from the flows, not the code." Codex's verdicts looked like this:

```text
## NOT READY TO RECORD

## BLOCKERS

- Production still emits a Swagger UI `TypeError` on the first WebMCP read. Local fix is not committed or deployed.
```

I pasted those into Claude, Claude fixed them, and the commits say so: "Fix three defects found in the live in-app-browser acceptance pass". I acted as the relay between two vendors' agents. It worked because they do not share blind spots, and neither is invested in the other's work being good.

This was partly deliberate. Codex had to be the QA: it is an OpenAI competition, the Codex app was the only one set up for this, and I believed the judges would test with Codex. So Codex was the natural choice for checking the result. It also saves cost. If Codex can do that work with a cheaper model, Claude's usage is not spent on a broken WebMCP bridge.

## Session limits as a scheduler

I was on the $100 Claude plan and the $20 Codex plan, and I hit Claude's session limit nine times in two days. At 4:38 PM on Sep 2, all four project sessions hit it within 70 seconds. Between 3 and 7 AM that morning, nothing ran at all, because every agent was limited or I was asleep.

The limits decided who worked when. Claude ran out on Storybook at 1:43 PM, and Codex had the same spec five minutes later. When the reset came at 7:53 AM I sent "rates back, use agents". The contracts' cheapest-model rule is not a style choice. It is how to get more hours out of the same plan.

My throughput is limited by the tokens per second I can get, averaged over the downtime while waiting for a limit to reset. Even at a steady 50 tokens a second, which is not realistic because much of the wall time is spent waiting on requests, every hour spent waiting on usage lowers the average. More usage allows more concurrency. Fast mode would have been useful. Codex filled some gaps, and when Claude was out, OpenCode covered, on a GLM coding plan and then free models. I hit the limit at 4:38 PM, and commits started landing again half an hour later.

## Launch remotely, polish locally, steer in bursts

There were two modes, and the logs show them clearly.

**Launch mode** was mostly from my phone: SSH into the Linux box over Tailscale or a Claude Code session started from the app. One contract plus a couple of process prompts, then hours alone. The Careers build got two prompts total. Then I would get home, check on it from my laptop, supervise a little more, and steer in bursts.

**Polish mode** was at the keyboard, with three sessions side by side, a median of about two minutes between prompts, and bursts of five to seventeen short taste prompts. I would broadcast the same prompt to all three: "can you SELL IT?" went to JupyterLite, Careers and Swagger UI within 14 seconds.

I do not remember sending that one. When three or four agents are running, I watch their outputs: the actual apps, the previews and the screenshots they send at checkpoints. I do not check their diffs. I check their concepts, and watch for when they start producing internal jargon and going down rabbit holes, so I can steer them. That is why preview environments and checkpoint images matter so much to me.

Sometimes, when they have been running a long time and I can see them all wrapping up, I ask whether they can sell it. As an agent goes deeper into its context, it narrows. The more code it writes and the more it talks like a professional software engineer ("section 3.3 is verified, and the adapter…"), the narrower it gets. When I come in with "bro, can you make sure this shit is good and it ships good?", it seems to destabilize the agent and activate different behavior. I think of it as a temperature fluctuation: as the agent cools down, I inject more randomness, bursts of creativity and taste, and also criticality.

The taste prompts are the actual job. In two days, the calls that changed the outcome were mine:

- kill the finished Storybook
- drive the real WebMCP, not a shim
- cut the "19 tools" panel ("th ecodex ui suppleis it")
- remove the status bar that claimed an agent was connected
- ship without Propose mode, then spec it the next day
- cut widgets ("get it wokring first")
- pick JupyterLite over my own agents' pick

Most of those were typed in all caps, and at least one was wrong (I ignored a deadline extension for four hours). Taste is not always right. It is the part that cannot be handed off.

## Where it broke

The failures are where the method improves:

- **55 background shells.** Left alone, the lead agent started waiting on things by spawning shells. I found 55 of them, then "now youre spamming monitors when you don't need to". The "don't poll" line in my process prompt exists because of this.
- **Two writers deploying.** Covered above.
- **The wrong-session paste.** From my phone, I pasted the Strudel contract into the Swagger UI session. That one is my mistake.
- **The `/goal` joke.** Covered above.
- **A false negative from its own tooling.** Claude spent a stretch convinced the live kernel was broken, then retracted: "my automation profile had a remembered 'No Kernel' choice… That's my instrumentation, not your product."
- **CI retries hiding flakes.** Claude flagged that `retries: 1` in CI meant "the green badge is stronger than the signal behind it", logged it, and didn't fix it in time.
- **The safety classifier.** Security-audit subagents got blocked twice and had to be re-prompted with softer wording.

What I would change, based on the logs rather than my memory:

- fewer broadcast prompts typed in frustration
- one writer per deploy, written into the contract
- a demo-video pipeline from day one, not hour 36
- if I want a `while true`, say so, instead of a joke the evaluator takes at face value
- turn Claude's scratch-folder cleanup into a rule, on a small disk

## A contract skeleton you can copy

This is the shape, with the hackathon-specific parts removed. Fill in each section from your own list of objections.

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

Paste it as the first message of a fresh session and add one line telling the agent to go. My own one-liner misspelled two words, and it still worked. The spec exists; you paste it and ask for it to be built. Nothing more is needed.

A prompt-engineering structure is not required. The AI takes a loose stream of thought, such as what I dictate from my phone while doing other things, and synthesizes it. My job is the ideas, which it cannot supply, and the rejections once it has given them structure.

## Key takeaways

- The one-line prompt worked because it sat under a 45,000-character contract that defined scope, limits and acceptance criteria.
- Objections to a chat model's drafts are a practical source of contract sections: each "no, because" became a named rule.
- Put the model and agent budget in the contract itself, and keep the repo, not the chat, as the state.
- Verify on the real surface with a second vendor's agent; a test-only shim does not prove real discovery.
- Allow one writer per deploy.
- Steer on taste, and say what you mean: an unfulfillable `/goal` is a loop, and an evaluator will take it at face value.
