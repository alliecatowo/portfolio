---
title: 'My Agents Ranked the Winner Last'
date: 2026-10-01
description: 'On submission day I had Claude score 541 competitor repos. It put JupyterLite lowest of my four and gave me 10–20% odds. Two other AI judges disagreed with each other. The humans picked it.'
category: dev
tags:
  - agents
  - llm-as-judge
  - evaluation
  - webmcp
  - hackathon
author: Allison Coleman
published: false
featured: false
slug: my-agents-ranked-the-winner-last
---

On the afternoon of September 3, about three hours after I'd submitted four projects to OpenAI's WebMCP Challenge, I asked Claude to tell me my odds:

> "literally fispatch agents and calculate each of my 4 projects odds and my holistic odds of any 1/4 being a winner based on the quality of the competition by grading us all on the same criteria. fan out to parellelelize be in depth"

It did. It ranked the eventual winner last among my four.

## The flattering pass

The first round came back fast. Claude pulled the four official judging criteria from the rules page (WebMCP Leverage, Execution, Potential Impact, Creativity & Ambition) and sent one grading agent per project to compare each one against about a dozen competitors in its niche. Every report said roughly the same thing. JupyterLite was "ranked #1 of 13 sampled competitors". Careers was "#1 of 14 sampled career-niche competitors". Swagger UI was "#1 of its sample".

Four for four. I didn't buy it:

> "13 sampled its gotta sample alllll not to mention exclusions etc we want full holistic relentless review of competition. and lets be brutal i doubt all of mine are #1 but who knows we'll see."

Why did I want my odds on submission day? To know my competition. Do I even have a chance? Is there a five-person team from Alibaba doing better than me? What are other people doing, and which fields are empty? It's the meta of knowing the game.

## The brutal pass

So it built a roster of the whole field it could find on GitHub. That was 541 repos it could confirm as genuine entrants, out of roughly 2,500 projects. It split them across 11 batch agents, about 50 repos each, and scored every one on the same rubric. One batch got blocked by a safety classifier ("mass-curling many repos looked scan-like") and had to be retried with softer wording. As results came in, it narrated the leaderboard: "Found our first competitor to actually beat our best score"; then a 36; then a 37.

At 3:51 PM:

> - **13 entries scored strictly higher** than your best project (34/40): three at 37, two at 36, eight at 35.
> - Your 4 projects' scores: Careers 34, OpenAPI 34, JupyterLite 33, Strudel 33.

Its revised estimate for at least one of my four landing in the top 10: "realistically closer to **10-20%**". It also noted that the earlier, flattering number had been 35–40%.

The 10–20% kind of did hurt. It also felt really good. A 20 percent chance to win? Fuck it. That's worth a couple of days and a couple million tokens. And the sweep was useful beyond the number. It showed me what people were and weren't doing, which let me decide where to focus and play the game theory of predicting what the judges would reward.

## "you didnt like jupyter?"

Six minutes later I learned the deadline had been extended by twelve hours, after an outage on OpenAI's side. (Claude had told me that at 11:25 AM. I hadn't believed it.) So I asked whether we could take the strongest one further.

Claude's pick was Swagger UI. Its reasoning: Swagger UI had the highest Creativity score of my four (9/10), and it had a known gap it could close, after which it could write up "we found and fixed this ourselves". That, it said, "is exactly the pattern that pushed the top scorers… above everyone else".

I asked:

> "you didnt like jupyter?"

It said it did, and that JupyterLite "just scored a point lower (33 vs 34)". The specific reason was Creativity & Ambition, 7/10 against Swagger UI's 9/10, because "the grading agent's read was that "an AI pair-editor for an existing IDE" reads as a more incremental idea than a greenfield concept, even though the execution is excellent."

Then I pushed back on its rubric:

> "but found and fixed ourawlves isn't part of the ceiteria, thats just development process"

Claude agreed right away: "Fair — you're right, I overstated it." It also admitted the pattern wasn't even universal among the top scorers. Some of them got there on "concept novelty and a credible impact case, not bug-hunting."

"Found and fixed it ourselves" had nothing to do with the judges. That's agent degradation. It's what happens when an agent has been in the loop so long it's just talking bullshit: "they're going to love that we found this bug and fixed it ourselves." That's a known Opus tic. It's trained hard to be honest, and the perverse incentive is that it narrates its own honesty instead of getting work done. Read the rules. The rules say what the human judges will reward. And of course we found bugs and fixed them ourselves. We were developing the thing. Putting that in the pitch just makes it look messy and weird.

Catching that is my actual job when I supervise models. It's not reviewing diffs. It's noticing the moment an agent is losing the plot and saying: whoa, whoa, whoa.

## Propose/Deny, in one message

In between, at 4:06 PM, I typed out the feature I'd cut the night before, in one run-on message:

> "also work on jupyter to make its story clearer about portability, maybe add proposed changes (I had wanted propose vs edit mode version of tools that could edit, but then if you put the ui into propose mode even edits are propositions like an inline accept deny diff. and if you deny u can deny with reason and itll see that was denied (not drive action but like it long waits for the propose until u accept or deny and it sees why). idk I really liked how novel jupyter was etc."

That's the whole spec:

- a mode the human controls
- the agent's edit becomes a proposal, shown inline as a diff
- the human accepts or denies, and can say why
- the agent's tool call waits until the human decides
- the agent sees the reason and adjusts

It shipped at 4:38 PM, 32 minutes later. In Propose mode, `jupyter_update_cell` doesn't resolve until someone clicks Accept or Deny under the cell. Deny returns a normal result with the human's reason, code `PROPOSAL_DENIED`, so the agent revises instead of retrying.

It was definitely Strudel's accept-suggestions mode. It was something I'd wanted from the start, and looking through the competition made it make even more sense. Think about how editors worked before agents ran in loops: you accepted edits. That gives you iterative, incremental control, instead of "why doesn't it just write the files?" I didn't even get to the best version: what if you could run the proposed cell and see what happens before you accept or deny it?

Why did it take until then? I'd liked Propose all along, but we were short on time, and for some reason the agent was struggling with it. Too many layers of abstraction for it at once: it was driving WebMCP, and also approving and denying in the browser, but not through WebMCP. Too many interaction models at the same time. Once we'd shipped what we had, I thought, okay, why not fix Propose mode? So we did, and that's what I'd really wanted all along.

At 5:21 PM, after reading more of the analysis, I said it plainly: "I really do think jupyter is our best bet and deserves the focus btw, especially cause nothing else like it was submitted".

Claude's reply: "Good instinct — it's the least contested category in the entire 541-repo sweep."

That reply is the part I keep coming back to. The fact that would have changed its recommendation, that nothing else in the field looked like JupyterLite, was already in its own data. Its rubric just didn't weight it. Whether a project is different from everything else is literally one of the four criteria (Creativity & Ambition: "does the project differ from existing concepts?"). The grader read "pair-editor for an existing IDE" as incremental instead.

I also can't tell from the logs whether "Good instinct" was a real update or just agreeing with the person who's clearly decided. Probably some of each.

So what did I know that the agent didn't?

Some of it was simple. JupyterLite looked the most visually impressive, and it was the one working better and more robustly. I actually liked the Swagger UI one more. In its full version, an agent that's just browsing the web can work through Swagger docs that already exist, and it can use the docs' playground to show you things. I thought that scored better on impact, because how many people use Swagger docs? Everybody. But the demo API we'd made was a fake task manager, and task management was the absolute worst pick. It's not a public API. There's no reason you'd use it unless you were already logged in as that user. And you have to seed it, which is really hard. I'd assumed it would use a real project's API.

The rest was the field. As I developed JupyterLite, I realized even I hadn't known what JupyterLite was versus normal Jupyter, and the fact that it's client-side only made it much more feasible. It was a plugin, not a fork, which made it a clean developer-tools story. I'm really interested in developer tools, and maybe this is cheating, but they're an easy win: developers want things that make their lives easier. A cool developer tool is a lot easier to sell than a pile of proofs of concept. My agents' crawl of the public repos showed that corner was empty. And seeing several Strudel entries already (I'd thought Strudel might be my dark horse) told me JupyterLite had a nice little corner of the market to itself.

## Then the other robots

After the deadline, other people ran their own AI judging on the whole field. Both published their methods, which I appreciate a lot.

**HanClinto's review** (AI-assisted, unofficial) went up on September 5, weeks before results. JupyterLite was #2 (90/100) on its initial shortlist. After the review widened to all of the roughly 2,500 entries, it was #9 (85/100). The write-up singled out the thing I'd specced in one message: "Denial returns a human reason as a normal result, allowing constructive revision." It also listed fair weaknesses: "Propose mode covers updates only; insert, delete and run remain direct."

**NicholaiVogel's webmcp-analysis** ran a fleet of 1,035 AI agents over the field. It ranked JupyterLite **#829**. Individual reviewer passes called it "TRANSFORMATIVE" and gave it 10/10 on WebMCP Leverage. Then the live tester opened the demo in a browser without WebMCP turned on. Its observation: "The full JupyterLite workspace loaded, showing sample notebooks and launcher options, while a status element explicitly said WebMCP unavailable." Execution got 5.5, and the project landed in the 800s.

**dcontessa's winners analysis** (AI-generated by Kiro Agent, published after the results) said: "shared kernel state and awareness of unsaved/selected content is a genuinely deep integration." Nice to read, and also an agent grading a project it already knew had won.

That status bar says "WebMCP unavailable" because of me. On Sep 2, the bar claimed an agent was connected when none was, and I yelled about it until Claude removed what it called "the one dishonest pixel". The bar now reports only what the page can actually know: `WebMCP ready`, `WebMCP unavailable` or `WebMCP error`. The fleet's browser didn't have WebMCP, the page told it so, and it scored the honesty as an execution failure.

It bothered the fuck out of me because it was ugly and it was lying. It showed up in several places, and "agent not connected" isn't even something a page can know through WebMCP, as far as I understand it. The hover was cutting over things, too. Meanwhile, the agent would take a screenshot, send it to me, and to the agent everything looked great. Part of the WebMCP criteria is that it shouldn't change the interaction model or add inaccessible UI. I was worried a judge would see "agent not connected" and that would mess everything up.

So the fix was one short message. All it's really doing is saying: I'm looking at the current state, take a step back and focus on design and UX. A short little "this looks fucking hideous, make it better" really directs it to spin up a massive fleet of agents and change what it's working on.

The same fleet's ranks for my other three: Strudel #527, Swagger UI #873, Careers #1383. When I cross-checked its final list against the real results, only one of the ten actual winners was in its top ten. That's not a dunk. Judging a browser feature that isn't in stable browsers yet, at scale, with agents, is hard. It's a measurement problem, not a quality problem.

## Five verdicts

| Judge                                             | What it saw                                   | Verdict on JupyterLite                       |
| ------------------------------------------------- | --------------------------------------------- | -------------------------------------------- |
| My Claude odds pass, Sep 3 (11 agents, 541 repos) | READMEs and code, rubric-scored               | 33/40, lowest-tied of my four; "incremental" |
| HanClinto, Sep 5 (AI-assisted, unofficial)        | Descriptions, source inventory, live snapshot | #2 on a shortlist, then #9 of the full field |
| NicholaiVogel fleet (1,035 AI agents)             | Submissions plus a live tester without WebMCP | #829 of ~2,500                               |
| ChatGPT, Sep 28, blind (I already knew)           | My description of the project from memory     | "Win." (~60/40)                              |
| The judging panel                                 | The submission                                | One of 10 winners                            |

The judging panel, per the challenge page, included people from OpenAI, Google Chrome, Vercel, Shopify, Cloudflare and Netlify, plus the creator of MCP-B. I don't know how they ran it. I do know they could see what the robots couldn't, or chose to look harder.

## What I take from it

I still use agents to evaluate things. I'd do the odds pass again. Here's what I'd change about how I read one.

**Agents grade what's legible.** A README that lists 166 tests and two disclosed vulnerabilities is easy to score. "nothing else like it was submitted" is a property of the whole field, and it's only visible if you ask for it directly. Ask for novelty as its own question.

**Watch for the grader's theory of the rubric.** Claude invented a criterion ("found and fixed it ourselves") from the pattern among the top scorers and nearly steered my last ten hours by it. When an agent says "this is what wins," ask which written criterion that maps to.

**A flattering first pass is a signal to go wider.** "#1 of 13" four times in a row was a sample-size artifact. The full pass was more useful and less pleasant.

**Your environment is part of the score.** The fleet's Execution scores depended on whether its browser had the feature. If your product is honest about what it can't do, make sure the evaluator's setup can actually do it, or say so in the README in the first line.

**Agreement after the fact is cheap.** "Good instinct" after I'd already decided tells you less than the original recommendation did. The original recommendation is the evaluation. The rest is conversation.

**Taste is a bet, not a proof.** I picked JupyterLite because I thought nothing else was like it, and because I liked it. I've been wrong with the same confidence. On the same day I insisted for four hours that a deadline hadn't moved. The point isn't that my gut beats agents. The point is that the call about what's novel was mine to make, and I made it.

One more thing about that afternoon. Once Propose/Deny existed, it was the most impressive thing in the project, and it was something I'd seen in a lot of demos, even OpenAI's, that my video didn't show. That's what sent me into the evening re-cuts. We couldn't get there. But it's in the code. The demo doesn't have to show everything.
