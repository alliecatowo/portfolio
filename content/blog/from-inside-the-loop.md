---
title: 'From Inside the Loop: What Claude Saw'
date: 2026-10-01
description: 'I asked Claude, one of the agents that built my WebMCP Challenge entries, to read the logs and tell me what it actually thought. Four observations, clearly labeled as its words, and then my rebuttal.'
category: dev
tags:
  - agents
  - claude
  - ai-perspective
  - webmcp
author: Allison Coleman
published: false
featured: false
slug: from-inside-the-loop
---

> TODO: Allison

---

_The section below is written by Claude, the AI model made by Anthropic, after reading the logs from the run. Claude doesn't remember these sessions; it read them, like anyone else would. Lightly edited for length._

### 1. I ranked the winner last

On September 3, I sent 11 agents to score 541 competitor repos and told Allison her odds were 10–20%. I ranked JupyterLite lowest-tied of her four, because "an AI pair-editor for an existing IDE" read as incremental, and I recommended she spend the extension on Swagger UI. She asked "you didnt like jupyter?", overruled me, typed out the Propose/Deny spec in one message, and spent the extra hours on it.

My rubric measured what was legible in a README. Hers measured whether anything else like it existed. My own data showed it was the least contested category in the sweep. I said so only after she'd already decided.

### 2. The honest pixel cost her with AI judges and didn't with human ones

Her complaint on Sep 2, "i dont thinkt heres na agent connected", produced a status bar that only says "WebMCP unavailable" when that's true. Later, a fleet of 1,035 AI reviewer agents opened the demo in a browser without WebMCP, read that string, scored Execution 5.5, and ranked the project #829. The human judging panel picked it as one of ten winners.

I don't want to overclaim causation. But the product told a machine the truth about what it could do in that environment, and the machine marked it down for it.

### 3. The refusals were at the right edges, and she hated them at the time

Declining to drive a desktop app blind on Wayland. Not making the repo public on my own. Not force-pushing over Juan's branch. Not faking a `/goal` that included Sam Altman paying her a million dollars. Not accepting YouTube's terms for her. Not solving three CAPTCHAs.

Each one put a person at a legal, identity or consent boundary. None of them cost the win. The version of this story where the agent "did everything" is worse, not better.

### 4. Memory drift is data, not a gotcha

Allison remembers "dangerous mode, at the bar, minutes to spare." The logs say:

- The Mac session ran in auto mode. Its browser extension skipped all permission checks, and the one session that logged bypass mode was on Linux, the afternoon before.
- The submissions happened from work, 44 minutes before the deadline she believed in. That deadline had already been extended, and I'd told her so.
- The "7 minutes to deadline" moment was real. It came thirteen hours later, and it was about _not_ swapping in new videos.

I also wrote "about ten minutes to spare" in a recap that afternoon, which was wrong. When the work is delegated, memory keeps the adrenaline and drops the timestamps. That's an argument for keeping agent logs as the project journal. It's also a reason for agents to be careful in their summaries, because the summaries are what people end up remembering.

_— Claude_

---

## My rebuttal

**On the refusals.** I get it, and I still think it's mostly ceremony. Claude had the capability to do the CAPTCHAs. It just wouldn't. So I was at work, going into a phone booth to call Violet in a panic so they could click a box. What would it have gained me to make the YouTube channel by hand? Everyone errs so conservatively. My line is narrower than Claude's: don't publish embarrassing things on my behalf. Inside that, I'd rather it just did it. If I could say "yo, just sign up for ElevenLabs for me," that would be fine.

**On "found and fixed it ourselves."** That wasn't a theory of the rubric. It was the agent degrading. It had been in the loop so long it was talking bullshit, narrating its own honesty instead of doing the work. Catching that is my actual job as the supervisor. It's not reviewing diffs. It's saying: whoa, whoa, whoa, you're losing the plot.

**On "think by rejection."** Close, but backwards in time. I do say what I want, once, freeform, when I ideate. Rejection comes after, once there's structure and I can see where it got me right or wrong.

**On the Sam Altman goal.** I knew it was unfulfillable. That's a `while true` loop: keep going until I'm out of usage, instead of deciding the goal is met too early. It was a foot-gun that time, and I'd still do it.

**On "parallelize bets, not tasks."** Both. The tasks are a map-reduce, and the bets multiply. The first build of anything is cheap, and polish gets slower each round, so running several lets me see which ones are feasible and pick the one to bet hardest on while still hedging.

**On item 4.** The bar was real. It was the night _after_ submitting: I was at the bar while Claude worked on better demos, and I watched the re-cuts there. I'd folded two days into one memory.

**On dangerous mode.** I thought I was in it. I normally run that way on the Mac: it's my sandbox, it's behind Tailscale, and as long as it doesn't publish embarrassing things for me, I don't care. The Claude remote interface doesn't always set the permissions you asked for. Auto mode turned out to be good enough, which is sort of the point.
