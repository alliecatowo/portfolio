---
title: My Agents Ranked the Winner Last
author: Allison Coleman
category: dev
date: 2026-10-01
description: On submission day I had Claude score 541 competitor repos. It put JupyterLite lowest of my four and gave me 10–20% odds. Two other AI judges disagreed with each other. The humans picked it.
featured: false
published: false
slug: my-agents-ranked-the-winner-last
tags:
  - agents
  - llm-as-judge
  - evaluation
  - webmcp
  - hackathon
---

On the afternoon of September 3, about three hours after I'd submitted four projects to OpenAI's WebMCP Challenge, I asked Claude to tell me my odds:

> "literally fispatch agents and calculate each of my 4 projects odds and my holistic odds of any 1/4 being a winner based on the quality of the competition by grading us all on the same criteria. fan out to parellelelize be in depth"

It did. In that pass the eventual winner scored lowest among my four, tied with Strudel at 33/40 (Careers and Swagger UI scored 34).

## The flattering pass

The first round came back fast. Claude pulled the four official judging criteria from the rules page (WebMCP Leverage, Execution, Potential Impact, Creativity & Ambition) and sent one grading agent per project to compare each one against about a dozen competitors in its niche. Every report said roughly the same thing. JupyterLite was "ranked #1 of 13 sampled competitors". Careers was "#1 of 14 sampled career-niche competitors". Swagger UI was "#1 of its sample".

Four for four. I didn't buy it:

> "13 sampled its gotta sample alllll not to mention exclusions etc we want full holistic relentless review of competition. and lets be brutal i doubt all of mine are #1 but who knows we'll see."

I wanted my odds on submission day to understand the competition. Did I have a realistic chance? Were larger teams doing better work? What were other people building, and which categories were empty?

## The brutal pass

So it built a roster of the whole field it could find on GitHub. That was 541 repos it could confirm as genuine entrants, out of roughly 2,500 projects. It split them across 11 batch agents, about 50 repos each, and scored every one on the same rubric. One batch got blocked by a safety classifier ("mass-curling many repos looked scan-like") and had to be retried with softer wording. As results came in, it narrated the leaderboard: "Found our first competitor to actually beat our best score"; then a 36; then a 37.

At 3:51 PM:

> - **13 entries scored strictly higher** than your best project (34/40): three at 37, two at 36, eight at 35.
> - Your 4 projects' scores: Careers 34, OpenAPI 34, JupyterLite 33, Strudel 33.

Its revised estimate for at least one of my four landing in the top 10: "realistically closer to **10-20%**". It also noted that the earlier, flattering number had been 35–40%.

The 10–20% estimate stung, but it also made the effort feel worthwhile: a 20 percent chance was worth a couple of days and a couple million tokens. The sweep was also useful beyond the number. It showed what people were and weren't building, which helped me decide where to focus and what the judges were likely to reward.

## Deadline extension and the "you didnt like jupyter?" exchange

Six minutes later I learned the deadline had been extended by twelve hours, after an outage on OpenAI's side. (Claude had told me that at 11:25 AM. I hadn't believed it.) So I asked whether we could take the strongest one further.

Claude's pick was Swagger UI. Its reasoning: Swagger UI had the highest Creativity score of my four (9/10), and it had a known gap it could close, after which it could write up "we found and fixed this ourselves". That, it said, "is exactly the pattern that pushed the top scorers… above everyone else".

I asked:

> "you didnt like jupyter?"

It said it did, and that JupyterLite "just scored a point lower (33 vs 34)". The specific reason was Creativity & Ambition, 7/10 against Swagger UI's 9/10, because "the grading agent's read was that "an AI pair-editor for an existing IDE" reads as a more incremental idea than a greenfield concept, even though the execution is excellent."

Then I pushed back on its rubric:

> "but found and fixed ourawlves isn't part of the ceiteria, thats just development process"

Claude agreed right away: "Fair — you're right, I overstated it." It also admitted the pattern wasn't even universal among the top scorers. Some of them got there on "concept novelty and a credible impact case, not bug-hunting."

"Found and fixed it ourselves" had nothing to do with the judges. I read it as agent degradation: an agent that has been in the loop for a long time starts producing claims like "they're going to love that we found this bug and fixed it ourselves." I'd call it a known model tic. The agent is trained to be honest, and it ends up narrating its own honesty instead of getting work done.

The rules say what the human judges will reward, so the rules are the thing to read. Finding and fixing bugs is ordinary development, and putting it in the pitch would have made the project look messy.

Catching that is the main part of my job when I supervise models. It isn't reviewing diffs. It's noticing when an agent is losing the thread and stopping it.

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

The idea came from Strudel's accept-suggestions mode. I'd wanted it from the start, and looking through the competition made it make more sense. Before agents ran in loops, editors worked by having you accept edits. That gives you iterative, incremental control, instead of "why doesn't it just write the files?" I didn't reach the best version: running the proposed cell to see what happens before accepting or denying it.

Why did it take until then? I'd wanted Propose all along, but we were short on time and the agent was struggling with it. It had too many layers at once: it was driving WebMCP, and also approving and denying in the browser, but not through WebMCP. That meant too many interaction models at the same time. Once we'd shipped what we had, I decided to fix Propose mode, and that was the version I'd wanted all along.

At 5:21 PM, after reading more of the analysis, I said it plainly: "I really do think jupyter is our best bet and deserves the focus btw, especially cause nothing else like it was submitted".

Claude's reply: "Good instinct — it's the least contested category in the entire 541-repo sweep."

That reply is the part I keep coming back to. The fact that would have changed its recommendation, that nothing else in the field looked like JupyterLite, was already in its own data. Its rubric just didn't weight it. Whether a project is different from everything else is one of the four criteria (Creativity & Ambition: "does the project differ from existing concepts?"). The grader read "pair-editor for an existing IDE" as incremental instead.

I also can't tell from the logs whether "Good instinct" was a real update or just agreeing with the person who's clearly decided. Probably some of each.

So what did I know that the agent didn't?

Some of it was simple. JupyterLite looked the most visually impressive, and it worked better and more robustly. I actually liked the Swagger UI project more. In its full version, an agent browsing the web can work through Swagger docs that already exist and use the docs' playground to show things to the user. I thought that scored better on impact, because Swagger docs are widely used. But the demo API we'd made was a fake task manager, which was the worst choice: it isn't a public API, there's no reason to use it unless you're logged in as that user, and it has to be seeded, which is hard. I'd assumed it would use a real project's API.

The rest was the field. While developing JupyterLite, I realized I hadn't known what JupyterLite was versus standard Jupyter, and its being client-side only made the project much more feasible. It was a plugin, not a fork, which made a clean developer-tools story. I'm interested in developer tools, and they're an easier sell than a set of proofs of concept, because developers want things that make their work easier. My agents' crawl of the public repos showed that corner was empty. Several Strudel entries already existed (I'd thought Strudel might be my dark horse), which told me JupyterLite had its corner to itself.

## Then the other robots

After the deadline, other people ran their own AI judging on the whole field. Both published their methods, and I'm grateful for that.

**HanClinto's review** (AI-assisted, unofficial) went up on September 5, weeks before results. JupyterLite was #2 (90/100) on its initial shortlist. After the review widened to all of the roughly 2,500 entries, it was #9 (85/100). The write-up singled out the thing I'd specced in one message: "Denial returns a human reason as a normal result, allowing constructive revision." It also listed fair weaknesses: "Propose mode covers updates only; insert, delete and run remain direct."

**NicholaiVogel's webmcp-analysis** ran a fleet of 1,035 AI agents over the field. It ranked JupyterLite **#829**. Individual reviewer passes called it "TRANSFORMATIVE" and gave it 10/10 on WebMCP Leverage. Then the live tester opened the demo in a browser without WebMCP turned on. Its observation: "The full JupyterLite workspace loaded, showing sample notebooks and launcher options, while a status element explicitly said WebMCP unavailable." Execution got 5.5, and the project landed in the 800s.

**dcontessa's winners analysis** (AI-generated by Kiro Agent, published after the results) said: "shared kernel state and awareness of unsaved/selected content is a genuinely deep integration." It's a positive assessment, but it was written by an agent grading a project it already knew had won.

That status bar says "WebMCP unavailable" because of a decision I pushed for. On Sep 2, the bar claimed an agent was connected when none was, and I objected until Claude removed what it called "the one dishonest pixel". The bar now reports only what the page can actually know: `WebMCP ready`, `WebMCP unavailable` or `WebMCP error`. The fleet's browser didn't have WebMCP, the page told it so, and it scored the honesty as an execution failure.

It bothered me because it was ugly and it was inaccurate. It appeared in several places, and "agent not connected" isn't something a page can know through WebMCP, as far as I understand it. The hover also covered other elements. Meanwhile, the agent would take a screenshot and report that everything looked fine. Part of the WebMCP criteria, as I read it, is that a project shouldn't change the interaction model or add inaccessible UI. I was worried a judge would see "agent not connected" and penalize it.

The fix was one short message. It tells the agent to look at the current state, step back and focus on design and UX. A short "this looks fucking hideous, make it better" was enough to send it to spin up a large fleet of agents and change what it was working on.

The same fleet's ranks for my other three: Strudel #527, Swagger UI #873, Careers #1383. When I cross-checked its final list against the real results, only one of the ten actual winners was in its top ten. That's not a criticism. Judging a browser feature that isn't in stable browsers yet, at scale, with agents, is hard. It's a measurement problem, not a quality problem. The next section puts that number next to the other rankings.

## Five verdicts

| Judge                                             | What it saw                                   | Verdict on JupyterLite                       |
| ------------------------------------------------- | --------------------------------------------- | -------------------------------------------- |
| My Claude odds pass, Sep 3 (11 agents, 541 repos) | READMEs and code, rubric-scored               | 33/40, lowest-tied of my four; "incremental" |
| HanClinto, Sep 5 (AI-assisted, unofficial)        | Descriptions, source inventory, live snapshot | #2 on a shortlist, then #9 of the full field |
| NicholaiVogel fleet (1,035 AI agents)             | Submissions plus a live tester without WebMCP | #829 of \~2,500                              |
| ChatGPT, Sep 28, blind (I already knew)           | My description of the project from memory     | "Win." (\~60/40)                             |
| The judging panel                                 | The submission                                | One of 10 winners                            |

The judging panel, per the challenge page, included people from OpenAI, Google Chrome, Vercel, Shopify, Cloudflare and Netlify, plus the creator of MCP-B. I don't know how they ran it. The panel may have been able to see things the automated passes could not, or may have weighed things differently.

## How the rankings compared with the actual winners

OpenAI and Devpost published no scores, ranks, placements or runner-ups. The official ["Meet the winners" post](https://webmcp.devpost.com/updates/46049-meet-the-winners) is a flat list of 10 equal winners, so there is no official ordering to compare against. The only available test is whether a ranking's top picks include any of the 10 winners.

That is a limited test. These were description- or README-based estimates made before judging, with different inputs and different goals. Vogel's README says its output is "not an official ranking or prediction". HanClinto's review was an AI-assisted, unofficial pre-judging prediction. My own pass was an odds estimate for my four projects. Low hit rates say more about how hard the task is than about the people who ran them.

Winners placed in each ranking's top 10, top 25 and top 50:

| Ranking                                         | Winners in top 10 / 25 / 50 | JupyterLite (winner)  | Strudel               | Swagger UI      | Careers         |
| ----------------------------------------------- | --------------------------- | --------------------- | --------------------- | --------------- | --------------- |
| Vogel fleet (2,500 entries)                     | 1 / 1 / 1                   | 829                   | 527                   | 873             | 1383            |
| HanClinto revised top 10 (Sep 5)                | 2 / 2 / 2                   | 9                     | not in its 25         | 17 of 25        | not in its 25   |
| HanClinto original shortlist (46 repos)         | 3 / 3 / 3                   | 2                     | not listed            | not listed      | not listed      |
| HanClinto broad full-field pass (2,500 entries) | 0 / 1 / 2                   | 24                    | 136                   | 11              | 622             |
| My Claude odds pass (about 540 repos, /40)      | 0 / 0 / 1                   | tied about 32 (33/40) | tied about 32 (33/40) | tied 14 (34/40) | tied 14 (34/40) |

Notes on each row:

- **Vogel.** Faraday just missed the top 50, at 52. The median winner rank was about 470 of 2,500.
- **HanClinto, revised top 10.** This is the published prediction. Roque Nights was #8 and JupyterLite #9. Among its 25 reconciled candidates three winners appeared (Roque Nights 8, JupyterLite 9, Alza 15), but only two were in its top 10.
- **HanClinto, original shortlist.** It was later superseded, and it covered only 46 repos with source and live inventories, so its 3 / 3 / 3 is not comparable to a full-field ranking. JupyterLite was #2, Roque Nights #3 and Alza #10.
- **HanClinto, broad full-field pass.** This is a description score for all 2,500 entries, from the "all-projects" tab of the [Google Sheet](https://docs.google.com/spreadsheets/d/1iQJsfmEKkVyRQLloUvGw6j1-d5uKGtfqi4sdkMVO-Kw) linked in his [gist](https://gist.github.com/HanClinto/496ae203b5422a3c6a94cef2fc7b6244). It did best on the top-50 measure, with two winners (JupyterLite at 24 and Alza at 37). The tie caveat matters: about 36 entries share ranks at or below 24 and about 22 share rank 37, so counting by position is looser than counting by rank number. The counts above are by rank number.
- **My odds pass.** I hold it to the same scrutiny. Its roster came from a GitHub search for the phrase "OpenAI WebMCP Challenge", so it was a README-phrase sample, not the real field. Besides JupyterLite, only one winner repo, Faraday (29/40), appears in the scored set. Eight of the 10 winners were never scored, so it is not a field-wide test. The one winner in its top 50 is there only because it is my own repo.

No ranking placed more than 3 of the 10 winners in its own top 10. Of my four entries, only JupyterLite won. Swagger UI was placed above JupyterLite by HanClinto's broad pass (11 against 24) and by my own pass (34 against 33), and it did not win. JupyterLite was HanClinto's #2 pick on his original shortlist.

## What I take from it

I still use agents to evaluate things, and I'd do the odds pass again. Here is what I'd change about how I read one.

**Agents grade what's legible.** A README that lists 166 tests and two disclosed vulnerabilities is easy to score. "nothing else like it was submitted" is a property of the whole field, and it's only visible if you ask for it directly. Ask for novelty as its own question.

**Watch for the grader's theory of the rubric.** Claude invented a criterion ("found and fixed it ourselves") from the pattern among the top scorers and nearly steered my last ten hours by it. When an agent says "this is what wins," ask which written criterion that maps to.

**A flattering first pass is a signal to go wider.** "#1 of 13" four times in a row was a sample-size artifact. The full pass was more useful and less pleasant.

**Your environment is part of the score.** The fleet's Execution scores depended on whether its browser had the feature. If your product is honest about what it can't do, make sure the evaluator's setup can actually do it, or say so in the README in the first line.

**Agreement after the fact is cheap.** "Good instinct" after I'd already decided tells you less than the original recommendation did. The original recommendation is the evaluation. The rest is conversation.

**Taste is a bet, not a proof.** I picked JupyterLite because I thought nothing else was like it, and because I liked it. I've been wrong with the same confidence: on the same day I insisted for four hours that a deadline hadn't moved. The point isn't that my judgment beats agents. The call about what was novel was mine to make, and I made it.

One more thing about that afternoon. Once Propose/Deny existed, it was the most impressive part of the project, and my video didn't show it. I'd seen the pattern in many demos, including OpenAI's. That's what sent me into the evening re-cuts. We couldn't get there, but it's in the code. A demo doesn't have to show everything.

## Key takeaways

- Agents grade what is legible in a README or description. Ask for novelty as its own question, because it is a property of the whole field.
- A flattering first pass ("#1 of 13" four times) was a sample-size artifact. The wider pass was more useful and less pleasant.
- The agent's theory of the rubric ("found and fixed it ourselves") did not map to any written criterion. Ask which criterion a recommendation corresponds to.
- The evaluator's environment is part of the score: a browser without WebMCP turned an honest status bar into an Execution penalty.
- Across the public rankings, no ranking placed more than 3 of the 10 winners in its own top 10. These were pre-judging estimates from descriptions, so the low hit rates mostly show how hard the task is.
- My own odds pass covered only about 540 README-phrase repos and never scored 8 of the 10 winners, so it is not a field-wide test either.
