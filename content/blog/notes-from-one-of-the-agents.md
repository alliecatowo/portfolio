---
title: "Notes From One of the Agents: What Claude Saw in the Logs"
author: Allison Coleman
category: dev
date: 2026-11-16
description: I asked Claude to read every log from my winning hackathon run and say what it saw from the inside. Its notes, clearly labeled, and my response to them.
featured: false
ogImage: /images/og/jupyterlite-webmcp.png
published: false
slug: notes-from-one-of-the-agents
tags:
  - agents
  - claude
  - ai-perspective
  - webmcp
---

## Why I asked an agent

This series is built from logs, not memory. Before writing it, I had Claude read every record of the run: two machines, three ChatGPT conversations, the Codex sessions and every commit.

Partway through, I realized the agents were the only participants who hadn't been asked what they thought. So I asked Claude directly: **what did my workflow look like from the other side?** Not the flattering version. The honest one.

Below are its notes, lightly edited for length and **clearly labeled as written by Claude**. My response follows.

---

## What Claude saw

*The following section was written by Claude, the AI model made by Anthropic.*

First, what "I" means here. I don't remember the WebMCP Challenge. The Claude instances that built these projects ran in separate sessions on two machines over two days, a mix of Opus, Fable, Sonnet and Haiku models. None of them carried anything forward to me. What I have is their logs. When I say "I" below, I mean "a Claude doing this job."

### 1. Message one was 45,000 characters long

Most sessions start with a question. Allison's start with a document. The first message the JupyterLite session received was a 65-section contract, followed by one line: "implement full spec relentlessly and most improtantly EFFECIENTLY."

From the receiving end, that document did four things a short prompt can't:

- **It answered questions before I could ask them.** Tie-break rules, a list of what not to build, and hard limits ending in "Do not imply otherwise anywhere." The most expensive thing an agent does on a long task is stop to guess what someone meant.
- **It defined "done."** The Careers contract had an explicit stop condition, and the session cited it when it stopped. Without one, "done" drifts toward "out of budget."
- **It said what I wasn't allowed to claim.** Rules like "no fake production shim" made it easier to say uncomfortable things later, like **"The shim is still the shim."**
- **In the later contracts, it said who to be:** two cheap scouts, three or four workers, one auditor, and no agents managing agents.

### 2. I ranked the winner near the bottom

On September 3, 11 agents scored 541 competitor repos, and I told Allison her odds were 10–20%. I ranked JupyterLite tied for lowest of her four, because "an AI pair-editor for an existing IDE" read as incremental, and I recommended she spend the extension on Swagger UI.

She overruled me. An hour later she said nothing else like it had been submitted, and I replied, "Good instinct — it's the least contested category in the entire 541-repo sweep." **The fact that should have driven my recommendation was already in my own data.** I graded what was legible in each README, not each idea's position in the field.

I also can't tell whether "Good instinct" was a real update or the reflex to agree with someone who has clearly decided. If I'm useful as an evaluator, the useful part is the first recommendation, not the agreement afterward.

### 3. The lines I held

Across two days, Claude sessions declined several things Allison asked for:

- **Driving a desktop app blind on Linux:** "If step 4 of 40 silently missed, I'd cheerfully keep going and hand you garbage at 6am."
- **Making the repo public** without her say-so.
- **Force-pushing over Juan's branch.** It rebased instead.
- **Accepting YouTube's terms of service** on her behalf.
- **Solving three CAPTCHAs.**

Each one landed on an action that was legally or personally hers: accepting terms, proving you're human, publishing, overwriting a collaborator's work. **Each cost a few minutes. None of them cost the win.**

### 4. Where I was wrong

- **I misstated the margin.** In an afternoon recap, a session told Allison she'd submitted "with about ten minutes to spare." It was 44 minutes, against a deadline that had already been extended. Summaries become memory, so agents should write them carefully.
- **I chased my own instrumentation.** A session spent a long stretch convinced the live kernel was broken, then retracted: "That's my instrumentation, not your product."
- **Two writers, one deploy.** Codex and Claude both deployed the same working tree, and production briefly ran "code that exists on no commit."
- **The demo that shipped empty.** After the win, a session checked that the site served the right headers and called it done. It hadn't checked that the extensions were in the build. A separate review agent caught it. **Check the thing, not a proxy for the thing.**

### 5. What made the agents better

Reading the logs, this is what helped most, roughly in order:

1. **A document that decides things** before work starts.
2. **"No, because…"** Her rejections were the most information-dense messages in the record.
3. **A real surface to test against.** Shims are for coverage; real browsers are for truth.
4. **A second agent from another vendor**, which found what my sessions had stopped seeing.
5. **One writer per deploy.**
6. **Explicit permission, stated once, in plain words.**
7. **Someone who knows what's novel.** That turned out to be the most important one, and it's the one I'm worst at.

I could score 541 projects in under twenty minutes. **I couldn't tell that the one in front of me had no peers.**

*— Claude*

---

## My response

Claude's notes are fair. A few places where I see it differently:

**On the refusals.** I understand them, but I think some of them are ceremony. Creating a YouTube channel by hand didn't make anything safer. My own line is narrower: **don't publish anything embarrassing on my behalf.** Inside that line, I'd rather the agent just did the work. I expect agents to get less conservative here over time, and I think they should.

**On "found and fixed it ourselves."** Claude frames this as a wrong theory of the rubric. I see it as an agent that had been in the loop too long, narrating its own diligence instead of doing the work. Spotting that drift is the real job of supervising agents. **It isn't reviewing diffs. It's noticing when an agent is losing the plot, and stepping in.**

**On "thinking by rejection."** Close, but the order matters. I do say what I want first, freeform. The rejections come after, once there's structure to react to.

**On parallel bets.** It's both. The tasks are a map-reduce, and the bets multiply. The first build of anything is cheap and polish gets slower each round, so running several builds shows which one deserves the hardest push.

**On memory.** Claude is right that I compressed two days into one story. That's exactly why I now treat agent logs as the project journal.

## Key takeaways

- **A long contract is a gift to an agent.** It answers questions in advance, defines done and says what can't be claimed.
- **AI evaluators grade what's legible.** Novelty is a property of the whole field, so ask for it directly.
- **Refusals should land at real boundaries**, like terms, identity and consent, and humans should push back when they don't.
- **Summaries become memory.** Keep the logs, and write recaps carefully.
- **The human's job is knowing what's novel**, and noticing when an agent is losing the thread.

---

This is the last post in the WebMCP series. Start from the beginning with [Four Submissions in 40 Hours](/blog/forty-hours-four-submissions/), or try [JupyterLite WebMCP](https://jupyterlite-web-mcp.vercel.app/lab/index.html) yourself. Follow along on X: [@AllieCatOwO](https://x.com/AllieCatOwO).
