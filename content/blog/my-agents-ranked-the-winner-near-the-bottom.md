---
title: My Own Agents Ranked the Winning Project Near the Bottom
author: Allison Coleman
category: dev
date: 2026-10-26
description: On submission day, 11 Claude agents scored 541 rival repos and ranked my eventual winner tied for lowest of my four entries. What that taught me about AI judges.
featured: false
featured_image: /images/projects/jupyterlite-webmcp/gallery-propose-deny-reason.webp
ogImage: /images/og/jupyterlite-webmcp.png
published: false
slug: my-agents-ranked-the-winner-near-the-bottom
tags:
  - agents
  - llm-as-judge
  - evaluation
  - webmcp
  - hackathon
---

Three hours after I submitted four projects to OpenAI's WebMCP Challenge, I asked Claude to calculate my odds.

It sent 11 agents to score 541 competitor repositories. **The project it ranked tied for lowest of my four went on to win.**

This is what happened, what three other AI rankings said, and what I'd tell anyone using AI as a judge.

## Pass 1: The flattering one

My prompt asked Claude to grade my four entries against the competition on the official criteria: **WebMCP Leverage, Execution, Potential Impact, and Creativity & Ambition.**

The first round came back fast. Each grading agent compared one of my projects against about a dozen competitors in its niche. Every report said roughly the same thing:

- JupyterLite: "ranked #1 of 13 sampled competitors"
- Careers: "#1 of 14 sampled career-niche competitors"
- Swagger UI: "#1 of its sample"

Four for four. I didn't buy it:

> "13 sampled its gotta sample alllll… and lets be brutal i doubt all of mine are #1"

**A perfect score across the board is a sample-size problem, not a result.**

## Pass 2: The brutal one

So Claude built a roster of every entry it could find on GitHub, **541 repositories**, and split them across 11 agents, about 50 repos each. At 3:51 PM it reported back:

- **13 entries scored strictly higher** than my best project (34/40).
- My scores: Careers 34, Swagger UI 34, **JupyterLite 33, Strudel 33.**
- Odds that any of my four would land in the top 10: **"realistically closer to 10-20%."** The flattering first pass had said 35–40%.

The number stung. But a 20% chance was worth two days of work, and the sweep was useful beyond the number. It showed me what people were building, and what nobody was.

## "You didn't like Jupyter?"

The deadline had been extended by 12 hours, so I asked where to focus. Claude recommended **Swagger UI**, for two reasons:

1. It had my highest Creativity score (9/10).
2. It had a known gap we could close, and then the write-up could say "we found and fixed this ourselves." That, it said, was the pattern behind the top scorers.

I asked, *"you didnt like jupyter?"*

JupyterLite had scored 7/10 on Creativity, because "an AI pair-editor for an existing IDE" read as more incremental than a greenfield concept.

Then I pushed back on its reasoning:

> "but found and fixed ourawlves isn't part of the ceiteria, thats just development process"

Claude agreed immediately: *"Fair — you're right, I overstated it."*

**"We found and fixed it ourselves" isn't a judging criterion.** It's what an agent says after a long session in the loop, narrating its own diligence instead of doing the work. It's a familiar model habit, and catching it is a big part of supervising agents. That job isn't reviewing diffs. It's noticing when an agent is losing the thread.

## The bet

At 4:06 PM I typed out the feature I'd cut the night before, in one run-on message: Propose mode, where *"even edits are propositions like an inline accept deny diff. and if you deny u can deny with reason and itll see that was denied."*

That message was the whole spec:

- a mode the human controls
- the agent's edit becomes an inline diff
- the human accepts or denies, and can say why
- the agent's tool call waits for the decision
- the agent sees the reason and adjusts

**It shipped at 4:38 PM, 32 minutes later.**

At 5:21 PM I said it plainly: *"I really do think jupyter is our best bet… especially cause nothing else like it was submitted."*

Claude replied: *"Good instinct — it's the least contested category in the entire 541-repo sweep."*

That reply is the part I keep coming back to. **The fact that should have changed its recommendation was already in its own data.** One of the four criteria asks whether a project differs from existing concepts. The graders scored the *description* of each idea, not its *position in the field*.

What I knew that the agent didn't weight:

- **The field.** JupyterLite had its corner to itself. Several Strudel entries already existed.
- **The demo.** Swagger UI's demo ran on a fictional task API that nobody would use outside the demo. JupyterLite looked and worked better.
- **The story.** It was a plugin for a widely used tool, not a fork. That's a clean developer-tools story.

## Then the other robots weighed in

After the deadline, other people ran their own AI judging across the field and published their methods. I'm grateful to both for that transparency.

**HanClinto's review** (AI-assisted and unofficial, published September 5) had JupyterLite at **#2** on its initial shortlist and **#9** in its revised, published top 10. It singled out the feature from that one message: *"Denial returns a human reason as a normal result, allowing constructive revision."* It also named a fair weakness: Propose mode only covers updates.

**NicholaiVogel's webmcp-analysis** ran a fleet of 1,035 AI agents across about 2,500 entries. Individual reviewers called JupyterLite "TRANSFORMATIVE." Then the live tester opened the demo in a browser without WebMCP enabled, and the status bar said exactly that: "WebMCP unavailable." Execution scored 5.5, and **the project landed at #829.**

That status bar is honest because I insisted on it. The night before, it had claimed an agent was connected when none was, and I made Claude remove what it called "the one dishonest pixel." The fleet's browser lacked the feature, the page said so, and **the honesty was scored as an execution failure.**

## Five verdicts on the same project

| Judge                               | What it saw                              | Verdict                                     |
| ----------------------------------- | ---------------------------------------- | ------------------------------------------- |
| My Claude odds pass (11 agents)     | READMEs, scored on the rubric            | 33/40, tied lowest of my four               |
| HanClinto (AI-assisted)             | Descriptions, source, live snapshot      | #2 on a shortlist; #9 in the revised top 10 |
| Vogel fleet (1,035 agents)          | Submissions plus a tester without WebMCP | #829 of about 2,500                         |
| ChatGPT, asked blind after the fact | My description from memory               | "Win."                                      |
| The human judging panel             | The submission                           | **One of 10 winners**                       |

## How well did any AI ranking predict the winners?

OpenAI and Devpost published no scores or placements, just a flat list of 10 equal winners. So the only fair test is how many winners each ranking placed near its top.

| Ranking                         | Winners in its top 10 / 25 / 50 |
| ------------------------------- | ------------------------------- |
| Vogel fleet (2,500 entries)     | 1 / 1 / 1                       |
| HanClinto revised top 10        | 2 / 2 / 2                       |
| HanClinto broad full-field pass | 0 / 1 / 2                       |
| My own odds pass                | 0 / 0 / 1                       |

**No ranking placed more than 3 of the 10 winners in its own top 10.** (HanClinto's original shortlist reached 3, but it covered only 46 repos.)

To be fair to everyone, including me: these were estimates from descriptions and READMEs, made before judging, with different inputs and goals. My own pass is the weakest test of all. Its roster came from a GitHub phrase search, and **8 of the 10 winners were never scored.** Low hit rates mostly show how hard this task is.

## What I'd tell anyone using AI as a judge

I still use agents to evaluate work, and I'd run the odds pass again. I'd just read it differently.

- **Agents grade what's legible.** A README listing 166 tests is easy to score. "Nothing else like this exists" is a property of the whole field. Ask for novelty as its own question.
- **Check the grader's theory of the rubric.** When an agent says "this is what wins," ask which written criterion it maps to.
- **A flattering first pass means go wider.** "#1 of 13" four times was an artifact.
- **The evaluator's environment is part of the score.** If your product depends on a feature, make sure the evaluator has it, or say so in the first line of your README.
- **Agreement after the fact is cheap.** "Good instinct" after I'd decided tells you less than the original recommendation.
- **Taste is a bet, not a proof.** I've been wrong with the same confidence. The call on what was novel was mine to make, and I made it.

---

**See the winner:** [live demo](https://jupyterlite-web-mcp.vercel.app/lab/index.html) · [GitHub](https://github.com/alliecatowo/jupyterlite-web-mcp) · [Devpost](https://devpost.com/software/jupyterlite-webmcp)

**The rankings:** [HanClinto's review](https://gist.github.com/HanClinto/496ae203b5422a3c6a94cef2fc7b6244) · [NicholaiVogel/webmcp-analysis](https://github.com/NicholaiVogel/webmcp-analysis) · [official winners](https://webmcp.devpost.com/updates/46049-meet-the-winners)

Built with Juan Mendoza. Follow along on X: [@AllieCatOwO](https://x.com/AllieCatOwO).
