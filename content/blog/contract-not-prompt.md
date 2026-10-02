---
title: "Contract, Not Prompt: How I Run Coding Agents in Parallel"
author: Allison Coleman
category: dev
date: 2026-10-19
description: The prompt that started my winning hackathon build was one line. It sat under a 45,000-character contract. Here is the method, the receipts and a template.
featured: false
ogImage: /images/og/jupyterlite-webmcp.png
published: false
slug: contract-not-prompt
tags:
  - agents
  - claude-code
  - codex
  - workflow
  - webmcp
---

People ask what prompt I used to win OpenAI's WebMCP Challenge. **The prompt was one line:**

> implement full spec relentlessly and most improtantly EFFECIENTLY

Typos included. What made it work was what sat above it: a **45,000-character build contract**. This post explains how I write those contracts, what goes in them, and where the method still breaks.

## The method in six steps

1. **Think out loud in a low-cost chat**, mostly by rejecting ideas.
2. **Have the chat compile those rejections** into a build contract.
3. **Paste the contract as message one** of a fresh agent session, plus one line.
4. **Let the repo hold the state**, not the chat.
5. **Verify on the real surface**, with a second vendor's agent as QA.
6. **Steer only on taste:** what to kill, what to cut, what's dishonest.

Over two days, this turned **about 300 of my prompts into about 16,000 agent tool calls** across Claude Code and Codex on two machines. Six contracts became five builds, four submissions and one winner.

## Step 1: Ideate by rejection

I do my thinking in ChatGPT, mainly because of cost. It's included in my $20 plan, and using it for ideation saves my Claude budget for code.

My process: I say what I want, all at once and unstructured, often by voice. ChatGPT gives it structure. **Once there's structure, I can see where it's wrong, and that's when the real work starts.** I don't know exactly what I want up front. I know what I don't want when I see it.

In the WebMCP ideation chat, the messages that mattered were all objections:

- "its gotta be a task thats far easier visually and exposes *more minute conteol* then chat interface would."
- "oh and it CANT be dependent on ai."
- "oh drop that then if web mcp cant *trigger* the agent on state changes"

ChatGPT acted as a stenographer, turning each objection into a principle and each principle into a contract section:

| What I said                                          | What it became                                     |
| ---------------------------------------------------- | -------------------------------------------------- |
| "it CANT be dependent on ai"                         | §2 THIS IS NOT AN AI APPLICATION                   |
| "drop that then if web mcp cant *trigger* the agent" | §10 CRITICAL WEBMCP LIMITATION                     |
| "google doc style comments on selections of cells"   | §33–47 threaded review                             |
| "sonnet / haiku workers where possible"              | §11 MODEL / AGENT BUDGET, §12 EXACT AGENT TOPOLOGY |

From shelving my first project to the finished JupyterLite contract took **about an hour and 45 minutes and about 15 messages.**

## Step 2: Compile the vision into a contract

**A prompt asks for something. A contract defines what "done" means**, what's forbidden, how to prove it works and, in later versions, who does which part at what cost.

The JupyterLite contract has 65 sections. In order, roughly:

- **What and why:** the product, what it is not, why WebMCP
- **Where it comes from:** upstream code, references, exact repo layout, architecture
- **Hard limits:** what the platform cannot do, ending in "Do not imply otherwise anywhere."
- **One section per tool**, with schemas
- **The guts:** concurrency, errors, security, a minimal UI, the demo notebook
- **Proof:** a test shim, unit tests, browser tests, CI, deployment
- **Shipping:** README, demo script, what not to build, priority order
- **The end:** a hostile audit, acceptance criteria and "SHIP IT"

The opening tells the agent not to stop early:

> Build this project completely. Do not stop after scaffolding, architecture, a prototype, or partial tool registration… Do not ask routine implementation questions.

It also sets a tie-break order for ambiguous choices (correctness first, demo quality sixth) and adds one of my favorite lines: **"Do not invent features merely because an agent can implement them."**

### Write the org chart into the spec

The winning JupyterLite contract didn't say which models to use. That came from a short process prompt I sent three minutes after the paste: use minimal tokens, don't poll, and dispatch cheap Haiku agents for mechanical work.

By the next three contracts, I'd moved that into the document itself. From the Swagger UI contract:

```text
11. MODEL / AGENT BUDGET STRATEGY
USE THE CHEAPEST MODEL CAPABLE OF THE TASK.
Do not create a hierarchy of agents managing agents.
Do not use 20 reviewers.

12. EXACT AGENT TOPOLOGY
Scout phase: 2 Haiku workers.
Implementation phase: 3-4 Sonnet workers.
Audit phase: 1 Haiku auditor.
Fix phase: 1 Sonnet only if audit finds real issues.
That is enough.
```

**The harness is prose, compiled into the document every agent reads first.**

### Why cost drives the structure

- **Count turns, not just tokens.** Every turn resends the prior context, so cost grows faster than the turn count. A cheap agent that finishes in five turns, consolidated by a mid-tier model and checked once by a frontier model, costs far less than one mid-tier worker grinding through 50 to 120 turns.
- **Map-reduce the work.** Break tasks down until they're atomic, fan out wide and push checking into deterministic tests.
- **No agents managing agents.** Nesting is where confusion starts.
- **Spend frontier models where judgment matters.** Even the overnight demo filming ran on a mid-tier model, Sonnet, to save budget for the work that needed more.

## Step 3: Paste it, add one line, walk away

The contract goes in as message one, often from my phone. Then I send one to three "how to work" notes and leave.

**How long does it run unattended?**

- JupyterLite: the first commit landed **27 minutes** after the paste.
- Strudel: **140.8 minutes** on a single prompt, until the session limit stopped it.
- On Linux, **97 prompts from me produced 5,675 Claude tool calls**, about 58 per prompt.
- **47 of those 97 prompts** were sent while the agent was already working, and it absorbed them without stopping.

I also used `/goal`, which keeps Claude Code working until an evaluator agrees the goal is met. One lesson: I once wrote a deliberately impossible goal as a joke, intending it as a "keep going" loop. The evaluator took it literally and kept reporting "not met" for half an hour. **A contract encodes jokes as firmly as requirements.** If you want a loop, say so.

## Step 4: The repo is the state machine

The first instruction in my later contracts: **save this contract into the repo** as `docs/BUILD_CONTRACT.md`, next to a `CLAUDE.md` that says "Do not re-ideate the product." From then on, the repo is the source of truth and the chat is only a window.

That let the work survive everything that happened to it:

- two system reboots mid-build
- a session limit every few hours
- switching vendors mid-project (Codex picked up Storybook five minutes after Claude hit its limit)
- switching machines for the demo work

One episode proved the point. Between 5:07 and 7:23 PM on September 2, 26 commits landed across all four repos, and I had no idea where they came from. It turned out I had started an **OpenCode** session four minutes after all my Claude sessions hit their limits, and then forgotten about it. The repo didn't care. It was the same state machine, whichever tool wrote to it.

It broke once in a useful way. Codex, doing QA, rebuilt and deployed from the same working tree as Claude, and Claude found that **"production is running code that exists on no commit."** The rule I took from it: **one writer per deploy.**

Why I prefer this over a custom harness:

- **Portable.** I can commit, push and continue in another tool, even from my phone.
- **Read as rules.** Agents treat files they find as instructions, so a spec in the repo resists drift.
- **Auditable and reversible.** Every PR leaves a trail, and I can roll back to a decision point.
- **It doesn't limit the model.** I describe how to work; I don't build a cage.

## Step 5: Verify on the real surface, with a second vendor

The contracts include a test-only WebMCP shim, so browser tests can run anywhere. That's useful for coverage, but it isn't proof. Claude said it better than I did: **"The shim is still the shim."**

Once Claude drove a real WebMCP-enabled browser, it reported: *"Real bugs found by driving the browser, not by reading code."* The worst was a race where the agent could open a notebook about 575 ms before the kernel existed.

Then I added a second vendor. Codex's desktop app had a WebMCP-capable browser, so I had **Codex test the live sites as an outside user**, and pasted its verdicts into Claude:

```text
## NOT READY TO RECORD
## BLOCKERS
- Production still emits a Swagger UI `TypeError` on the first WebMCP read.
```

It worked because two vendors' agents don't share blind spots. It also fit the challenge: this was an OpenAI event, and I assumed judges would try the entries with OpenAI's own tools.

## Step 6: Steer on taste

At the keyboard, I ran three sessions side by side and steered in bursts. **I didn't review diffs. I reviewed outputs**: the running apps, previews and checkpoint screenshots. I watched for agents drifting into internal jargon and rabbit holes.

The calls that changed the outcome were all mine:

- kill the finished Storybook project
- test against the real WebMCP, not a shim
- remove the status bar that claimed an agent was connected
- ship without Propose mode, then build it the next day
- bet on JupyterLite over my own agents' pick

Not every call was right. I ignored a deadline extension for four hours. **Taste isn't always correct. It's just the part you can't delegate.**

## Where it broke

- **55 background shells.** Left alone, the lead agent waited on tasks by spawning watchers. The "don't poll" line in my process prompt exists because of this.
- **Two writers deploying.** Fixed with "one writer per deploy."
- **A wrong-session paste.** From my phone, I pasted the Strudel contract into the Swagger session. My mistake.
- **CI retries hiding flaky tests.** Claude flagged that "the green badge is stronger than the signal behind it," and it didn't get fixed in time.

## A contract skeleton you can copy

```markdown
# ONE-SHOT BUILD CONTRACT — <PROJECT>

Build this project completely. Do not stop after scaffolding or a prototype.
Do not ask routine implementation questions; inspect upstream code and decide.
Tie-breaks, in order: correctness, native platform behavior, smallest robust
architecture, <your core value>, demo quality, minimal bespoke UI.
Do not invent features merely because an agent can implement them.

0. FIRST ACTION: save this file to docs/BUILD_CONTRACT.md. Do not re-ideate.
1. PRODUCT: one paragraph, one user, one moment
2. WHAT THIS IS NOT: each of your objections, as a hard rule
3. WHY THIS APPROACH: why not the obvious alternative
4. HARD LIMITS: what the platform cannot do. "Do not imply otherwise anywhere."
5. REPO LAYOUT AND ARCHITECTURE
6..N. ONE SECTION PER OPERATION: inputs, outputs, errors, bounds
N+1. CONCURRENCY, ERRORS, SECURITY
N+2. MODEL / AGENT BUDGET: cheapest capable model; 2 scouts, 3-4 workers,
     1 auditor; no agents managing agents; one writer per deploy
N+3. TESTS, then VERIFY ON THE REAL SURFACE
N+4. WHAT NOT TO BUILD and PRIORITY ORDER
N+5. HOSTILE AUDIT: list the lies this project could tell
N+6. ACCEPTANCE CRITERIA and STOP CONDITION
N+7. SHIP IT
```

## Key takeaways

- **The one-line prompt worked because of the 45,000-character contract above it.**
- **Your objections are your spec.** Each "no, because…" becomes a named rule.
- **Put the org chart and the budget in the contract**, and keep the state in the repo.
- **Verify on the real surface** with a second vendor's agent. A shim proves coverage, not reality.
- **One writer per deploy.**
- **Steer on outputs and taste**, not on diffs.

Next in the series: my own agents scored 541 competitors and ranked the eventual winner near the bottom. Here's why.

---

[JupyterLite WebMCP on GitHub](https://github.com/alliecatowo/jupyterlite-web-mcp) · [Devpost](https://devpost.com/software/jupyterlite-webmcp) · Follow along on X: [@AllieCatOwO](https://x.com/AllieCatOwO)
