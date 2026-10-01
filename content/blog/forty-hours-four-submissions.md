---
title: "Four Submissions in 40 Hours: How I Won OpenAI's WebMCP Challenge by Managing Agents"
author: Allison Coleman
category: dev
date: 2026-10-01
description: I found the WebMCP Challenge with two days left, shipped four entries, and one of them won. The logs remember it differently than I do.
featured: false
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

## The result

On September 28, OpenAI posted the ten winners of the WebMCP Challenge. One of them was **JupyterLite WebMCP**, which I built with my friend Juan Mendoza.

Nearly 2,500 projects came in. I submitted four of them, and I didn't start until the challenge was 70% over.

The version of this story I had been telling people: I put Claude in dangerous mode on my Mac mini and told it to make the perfect demo. It filmed, voiced, edited and uploaded everything overnight. Then I submitted from a bar, with minutes to spare, while my fiancé, Violet, clicked CAPTCHAs.

Before writing this, I had Claude read every log from those three days. Most of my story held up. Several details did not, and the corrections are included below.

I have left my prompts as I typed them, profanity and typos included. They show how the work actually went: loose thoughts, often dictated from my phone, which the agents turned into structure I could then make decisions on.

## Day 7 of 10

WebMCP is a proposed web standard that lets a page register typed tools (`document.modelContext.registerTool`). An AI agent in the browser can then work with the live app instead of screenshotting it or scraping the DOM. OpenAI and Devpost ran a ten-day challenge for it. I found it on day seven.

I found it through a ChatGPT monitor that looked for hackathons that fit. The monitor fired weekly, so when the notification arrived I had about three days left. It looked simple and well matched to what I do, and the prize pool was good. I decided to lean on concurrency and build more than one thing at the same time.

My first message to ChatGPT was the two challenge links. Seven minutes later I sent: "anything thats even more WOW ALLIE YOU CAN DO THIS RN or do we ship eotrybook".

## The project I dropped

The first thing I built was a WebMCP addon for Storybook, because it was "the most me."

At 12:39 PM I pasted a 53,000-character spec into Claude Code with "fan out mass agents (cheap as possible so we can keep running)". Forty minutes later 13 agents were working at once, the peak of the entire run. About an hour after the paste it had 340 passing tests, and I hit my first session limit.

Five minutes later I handed the same spec to Codex: "drive cheqp luna agebts. verify state and tell me state / hand off immediatly". Codex finished it, and it was deployed by 4:31 PM. Codex wrote 19 of its 22 commits.

At 5:18 PM I told ChatGPT: "bad news, built it, its basically the same as the storybook mcp but less powerful. next thing?"

Storybook already has an MCP server that can make edits. If a normal MCP server can do the job, WebMCP is just a wrapper, and a wrapper doesn't win. So five hours into my two days, I dropped a finished, deployed, tested project, and treated it as banked.

## Arguing my way to a notebook

The next ninety minutes were me rejecting ideas out loud:

> "its something *collabrative*, that wouldnt make sense on a normal mcp. fuckkkkkk UGHHHH."

> "oh and it CANT be dependent on ai. thats a hig thing. the app has ti have a normal interface for a user and full functionality without web mcp - web mcp just plugs in."

Then, at 6:32, I said: "youre already logged in, and its useful when youre already on the site… I feel like notebooks though really do tell the cleanest colab story."

A JupyterLite notebook runs entirely in the browser. The kernel is Pyodide in a web worker, and the files live in IndexedDB. Unsaved edits, the selection and the running kernel exist only in that tab, and there is no server for an MCP server to talk to. The state the agent needs lives in the browser, and WebMCP is the only way in.

At 7:01 PM: "OH WHAT IF YOU COULD JUET LIKE CLAUDES DIFF REVIEW. SO YOU CAN LEAVE MULTIPLE GOOGLE DOC STYLE COMMENTS ON SLEECTIONS OF CELLS OR CODE." That became threaded review, one of the core features.

Notebooks fit what the challenge was about: the shared interaction between a human and an agent over client-side state. It was also a personal problem: when Claude edited a notebook file, I ended up rerunning the whole notebook because the kernel state no longer matched the new code. Multiplayer notebooks like Google Colab suggested the collaboration model, with review and a live loop an agent can join.

I tell ChatGPT what I want and why things don't work. It turns each complaint into a rule, and the rules add up to a product. "it CANT be dependent on ai" became a contract section titled **THIS IS NOT AN AI APPLICATION**. "drop that then if web mcp cant *trigger* the agent" became **CRITICAL WEBMCP LIMITATION**, which reads in part: "WebMCP cannot independently wake, summon, or notify an agent when something changes."

At 7:03 PM ChatGPT produced a 65-section, 45,000-character build contract. It covers the repo layout, a schema for every tool, test cases, an audit checklist and the submission copy. Its first instruction is "Build this project completely." Its last line is "Build the complete version."

## Paste, plus one line

At 7:31 PM I pasted the contract into Claude Code almost word for word and added one line at the bottom:

> implement full spec relentlessly and most improtantly EFFECIENTLY

Then I sent short "how to work" messages, including "minimal minimal absolute minimal token / context usage. wait for htings, don't poll, dispatch haiku for mechanical coupel fo fies changed sorta things".

The JupyterLite contract doesn't say which models to use; that came from my nudge. The later Swagger UI, Strudel and Careers contracts do specify the agent setup: two cheap Haiku scouts, three or four Sonnet workers, one Haiku auditor, and "Do not create a hierarchy of agents managing agents. Do not use 20 reviewers."

The first commit landed 27 minutes after the paste, and it was deployed three minutes after that.

While it worked I went back to ChatGPT to write more contracts. I expected it to work, since the WebMCP part didn't look hard and Storybook had been close to a dry run. I keep ideation in ChatGPT so my Claude credits go to code.

It was testing against a fake WebMCP shim with Playwright, and I wanted the real thing: "I DONT WANT FUCKING PLAYWRIGHT SURE YOU CAN USE THAT BUT I WANT YOU TO FUCING DRIVE WITH THE FUCKING MCP. anyways. there are 55 backgorund shells. unacceptbale." Once it drove a real WebMCP browser it reported: "Real bugs found by driving the browser, not by reading code." One was a race where the agent could open a notebook about half a second before the kernel existed.

## Four entries and nine session limits

That night I asked ChatGPT whether one person can submit more than once. Yes, as long as each entry is "unique and substantially different", and prizes are per submission. Eight minutes later I told it "girl ive already fully shipped both cause I couldnt wait for him im a MACHINE im a code munching MACHINE." The strategy changed to banking as many good entries as I could.

My rough math: with about a thousand eligible entries, one entry is a one-in-a-thousand chance and four is one in 250. It was also about judge variance and trying different angles in parallel.

By just after midnight I had contracts running for Swagger UI (in Codex), Careers and Strudel (in Claude), plus JupyterLite. I launched Strudel and Careers from my phone, either SSHing into my Linux box over Tailscale or starting a Claude Code session from the app, then pasting a contract and walking away.

I hit Claude's session limit **nine times** in two days. At 4:38 PM on Sep 2, all four sessions hit it within the same 70 seconds, and my Strudel prompt "this looks like vibe coded shit fix it immediately" bounced off the wall. I was on the $100 Claude plan and the $20 Codex plan. When Claude ran out I switched to Codex, and when both ran out I slept. From 3 to 7 AM on Sep 2, nothing ran at all.

That budget shaped the whole run. What limited me was tokens per second, averaged over the downtime of waiting for a limit to reset. More usage would have meant more concurrency, which was the strategy.

Across those two days on Linux, 97 prompts from me turned into about 5,700 Claude tool calls across 106 subagent transcripts, plus about 2,100 from Codex. The longest single-prompt run was Strudel, at 2 hours 20 minutes.

## The night before the deadline

On the evening of Sep 2 I pasted the same "final artifact" checklist into three sessions within four minutes, and sent "can you SELL IT?" to all three within 14 seconds. Claude answered: "**The video doesn't exist**… **Nobody has run this in a real WebMCP browser**."

Then I opened the JupyterLite page: "this is fucked what the fuck is this i dont thinkt heres na agent connected it looks hideos." The status bar said an agent was connected when none was. Claude called it "the one dishonest pixel" and removed it. The status bar now only says `WebMCP ready`, `WebMCP unavailable` or `WebMCP error`, and a unit test fails if an idle status ever contains the word "agent." That detail comes back later.

Several cuts and fixes followed:

- Propose mode, where agent edits show up as suggestions you accept or deny, was not built. "okay ship without it… No matter what hsip what we ahve now."
- Widgets weren't reliable in the demo: "nah rmeove and get it wokring first."
- The repo was still private, and Claude wouldn't flip it: "that's an outward-facing change and yours to make." After a secrets check I said go.
- Codex rebuilt and deployed during QA, and Claude noticed "production is running code that exists on no commit." It fixed that by committing the deployed tree.

Juan came in on the demo. He rewrote the shooting script (Claude called it "a tighter shooting script — genuinely better, and it kept every fact"), and we spent the night trying to record it.

Juan ran through everything on his computer while I wrote the prompts. We had some footage but couldn't get it under three minutes, and every take needed editing because Codex is slow even in fast mode. Eventually Juan had to go to work, and I stopped trying to perfect one demo and aimed to get all of them filmed and under the time limit. Not every entrant meets every eligibility requirement; one video ChatGPT had flagged as a strong competitor had no audio, which the rules require. I was crying. It would have been a shame to build all this and not ship it.

At 10:54 PM I asked Claude: "okay fuck this. cna you drive an applicaiton yes or no… drive trhough the gpt app… video edit it yourself… all I need is a voice over."

It said no. GNOME on Wayland wouldn't let it take a screenshot or inject input:

> "If step 4 of 40 silently missed, I'd cheerfully keep going and hand you garbage at 6am. I won't pretend that's a plan."

I tried installing `ydotool` myself and it failed. Then I wrote the most useful sentence of the run: "It mgith be a smarter investment to get you seutp then for me to try to finish this out at midnight thirty."

## Moving to the Mac mini

The Mac mini was a last-ditch effort. AppleScript would let an agent drive that machine much more easily, and Claude Code Desktop on the Mac has computer use. (The full list of reasons is in the next post.) At 11:21 PM I opened a Claude session on it, pasted Linux Claude's "No," and asked: "that was a previous chat. you're on a mac now. is it feasible on this mac, cn you try?"

Two minutes later: "**Yes, this is feasible on this Mac — and it's not close.**"

Mostly while I slept, steered from my phone, it did this:

- It recorded **only the Codex app's window** (`screencapture -l<windowID> -v`), so the video shows a real user flow.
- It typed Juan's script into the Codex desktop app. Codex opened the live site and called my WebMCP tools (`jupyter_open_notebook`, `jupyter_update_cell`, `jupyter_run_cells`). Claude was the user on camera, and Codex was the agent.
- Keynote wasn't installed, so the "keynote-style" cut was built entirely in ffmpeg by a subagent.
- It went through several voices. The first was "ultra robit." I told it "no I want eleven labs without using eleven labs." The one I chose, at 1:25 AM, was **openai.fm**, OpenAI's own free text-to-speech demo. So the narration on my OpenAI hackathon demo was voiced by OpenAI, for free.
- At 1:04 AM a subagent played audio through the speakers and woke Violet and me. It muted the system and said: "Go back to sleep, I've got it from here."

It filmed all four projects that night. The uploads and submissions happened the next morning, not overnight.

About "dangerous mode": I was sure I had run it that way, but the Mac session was in Claude's **auto** mode the whole time. What was wide open was the Chrome extension, set to skip all permission checks. The only session that logged real bypass mode was an OpenAPI "emergency" session on Linux that afternoon. So it was the right memory attached to the wrong machine.

I normally run in dangerous mode on the Mac mini, my sandbox behind Tailscale. The remote interface doesn't always apply the permissions I set, and auto mode turned out to be good enough.

## Submitting from work

The next morning I was at work. At 9:12 AM: "most impoetant is upload to YouTube since im at work can we check?"

YouTube wanted a channel. Claude filled in the name and handle, then **refused to click Create**, because that accepts YouTube's terms of service on my behalf: "this is a firm line, not a judgment call I can waive under deadline stress." I asked: "please click it i will not be able to submit this competition otherwise, my partner is monitoring but mouse is dead". Violet clicked it, and I typed "OKAY UR CREATED UR IN."

Devpost logged me in through GitHub, and the 2FA prompt went to my phone. Then came CAPTCHA number one. Claude: "solving CAPTCHAs is a hard line I won't cross even here." Me: "IF WE DONT SHIP CAUSE OF A FUCKING CAPTCHA IM GONNA BE PISSED." Violet solved it. The same thing happened twice more.

I was at work for all of this. I'd step into a phone booth and call or text Violet. They don't write code, but they could walk up to the Mac mini, read what it was saying and click. In effect Violet handled the steps the agent isn't allowed to do.

The four submissions:

| Time (PDT) | Submitted          |
| ---------- | ------------------ |
| 11:43 AM   | JupyterLite WebMCP |
| 11:51 AM   | Swagger UI WebMCP  |
| 12:09 PM   | Careers WebMCP     |
| 12:16 PM   | Strudel WebMCP     |

In between I sent "dude ship it ship it ship it ship it fucking ASAP get onto the next one." Four entries in 34 minutes, 44 minutes before a 1 PM deadline.

The deadline was no longer 1 PM. At 11:25, before the first submit, Claude had told me the live countdown on Devpost said **Sep 4, 1:00 AM**. (Later that afternoon we learned why: an OpenAI-side outage had pushed it back 12 hours.) My reply was "fuck it dont care anymore. ship it." At 3:28 PM I was still arguing with it. At 3:57 PM I conceded: "well its expanded for another 10 hours...".

So "I submitted with minutes to spare" isn't accurate. I submitted with 44 minutes to spare before a deadline Claude had already flagged as probably wrong. Claude kept saying one page showed the original deadline and another the extended one, and I didn't want to risk submitting late against a deadline I couldn't confirm.

## My agents gave me 10–20%

That afternoon I had Claude grade my odds. Its first pass sampled about a dozen competitors per project and called each of mine #1 in its niche. I didn't accept that: "13 sampled its gotta sample alllll". So it sent 11 agents to score 541 competitor repos on the four official judging criteria. My four scored 33–34 out of 40, 13 entries beat my best, and its estimate for any one of the four winning was "realistically closer to **10-20%**."

It ranked JupyterLite lowest-tied, at 33, because "an AI pair-editor for an existing IDE" read as incremental. With the extra hours, it recommended putting everything into Swagger UI.

I said: "you didnt like jupyter?"

Then I typed out the feature I'd cut the night before, in one message: Propose mode, where "even edits are propositions like an inline accept deny diff. and if you deny u can deny with reason and itll see that was denied". An hour later I added: "I really do think jupyter is our best bet and deserves the focus btw, especially cause nothing else like it was submitted".

Propose/Deny shipped at 4:38 PM. In Propose mode, the agent's `jupyter_update_cell` call stays pending until a human clicks Accept or Deny under the cell. If you deny, the agent gets your reason back as a normal result instead of an error, so it adjusts instead of retrying.

I knew things the agent didn't. JupyterLite looked the most impressive and was more robust. It was a plugin, not a fork, a developer-tools story my agents' crawl showed nobody else had. The Swagger UI demo ran on a fake task-management API that isn't public and has to be seeded. Propose/Deny also came from Strudel's accept-suggestions mode. That disagreement gets its own post.

## Not swapping the videos

That evening I tried to make better videos with ElevenLabs, and it went badly. The session had compacted and drove worse than the night before. The presence highlights weren't showing up on camera ("I DONT SEE THE PRESENCE RINGS… OR I DONT BELIEVE YOU"), the disk filled up, and a stray Chrome window kept appearing in the recording.

I also sent this, which I stand by: "i do not want to hear "and here's the honest part" in a fucking script."

I was at a bar for most of that evening, steering the re-cut from my phone and watching the cuts come in, until I stopped steering. At 12:52 AM Claude sent: "It's 12:52 AM PT — 7 minutes to deadline. Not enough time to safely upload 4 new YouTube videos and swap Devpost links…" Its decision was not to swap. I replied at 12:56 with "lets not do it idk." A complete, working submission beats a better video with a broken link.

That is the "minutes to spare" I remember. It wasn't the submission. It was the night after, deciding not to touch it. I had merged two days into one memory: the submissions happened from work, from a phone booth, with Violet at the Mac mini, and the bar was the following evening.

Those re-cuts only lived in the agent's scratch folder, which is gone. What survives is the overnight batch, including keynote-style cuts nobody has seen, and I will post those.

## The win, and the automated judges

On September 28 at 10:03 AM, @OpenAIDevs posted: "JupyterLite WebMCP brings an agent into your live notebook to edit cells, run code and review changes together. Built by Allison Coleman and Juan Mendoza."

The Devpost "Meet the winners" post described it as "An agent that works right inside a browser-only Jupyter notebook. It reads your unsaved cells and exact selections, runs code in the kernel you share with it, and marks every change in place." That is a list of the contract's rules in someone else's words.

I found out from an email in an inbox I rarely check. It said congratulations on the win, and I wondered which win it meant.

Before I told ChatGPT the result, I made it guess blind. It said "**Win.**" I said "WE FUCKING WON THERE IS NO "TOP PRIZE" ITS 10 WINNERS AND WERE ON THE LIST".

The winning commit is tagged `webmcp-challenge-winner` (5e3af3a, Sep 3 at 19:03), the last commit before the extended Sep 4 1:00 AM deadline. The repo was judged as of the deadline, not the submit click.

Other people ran their own AI judging on the whole field:

- **HanClinto** published an AI-assisted pre-judging review on Sep 5, weeks before any results. It had JupyterLite at #2 on its initial shortlist, and #9 after widening the review to all of the roughly 2,500 entries. It singled out the Propose/Deny behavior: "Denial returns a human reason as a normal result, allowing constructive revision."
- **A 1,035-agent judging fleet** ranked it **#829**. Its tester's browser didn't have WebMCP turned on, so my status bar accurately reported "WebMCP unavailable", and it marked Execution down.

The challenge page lists the human judges: people from OpenAI, Google Chrome, Vercel, Shopify, Cloudflare, Netlify, and the creator of MCP-B. They picked it. The automated judge ranked it #829, and my own agents gave me 10–20%. I'm keeping all three numbers.

## What I actually did

Roughly 300 prompts from me turned into about 16,000 agent tool calls across Claude, Codex and two machines, about 50 to one (an order of magnitude, since it mixes tools and machines). That is about 43,000 lines of non-Markdown code, tests and config, and 80 commits across the four submitted repos before the original deadline. I wrote very little of the code. This is the part I did:

| I decided                                                | Agents did                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| Four entries, not one (after reading the rules)          | Wrote six contracts from my rants (ChatGPT)                        |
| Kill Storybook, even though it was finished              | Built Storybook, then the four submissions (Claude, Codex)         |
| Drive the real WebMCP, not a shim                        | QA on the live sites (Codex), fixes (Claude)                       |
| No dishonest pixels; cut widgets; cut the 19-tools panel | Found the kernel race, the access leaks, its own false negatives   |
| Switch to the Mac when Linux said no                     | Filmed Codex using the sites, voiced them, cut them, uploaded them |
| Bet on Jupyter when my agents bet on Swagger             | Scored 541 competitors to tell me I'd probably lose                |
| Don't swap the videos at 12:53 AM                        | Made that call first, and waited for me to agree                   |

One thing only a person could do: click "I agree" and pick out the crosswalks.

Codex wrote most of Storybook and a few early JupyterLite commits; after that I saved its credits for QA and on-camera use of the sites.

I don't think the lesson is that AI built my app. I set up a workflow where my attention went only to the decisions that changed the outcome, and on the biggest one my judgment overruled my own agents.

For a hackathon, work to the judging criteria and ship something complete. About half is packaging: the contributing guide, the docs, setup and installation. Get a working demo first, then sell the impact. JupyterLite WebMCP is a plugin you can install now, so it has the reach of millions of JupyterLab installations, even if it isn't all the way there yet. Impact and ambition were half of what we were judged on.

## Key takeaways

- The rules allowed multiple unique entries, so I submitted four and treated each as a separate bet.
- Dropping a finished Storybook addon, because a normal MCP server could do the same job, led to the notebook idea that won.
- Contracts written in ChatGPT and handed to Claude Code and Codex let several builds run in parallel within $100 and $20 plans.
- The agents refused CAPTCHAs and terms-of-service clicks, so a person had to do those steps.
- The deadline had been extended, so I submitted 44 minutes before the original deadline, not minutes before the real one.
- My agents estimated 10-20% odds and ranked JupyterLite lowest; I overruled them and it won.

Next: how an agent on my Mac mini directed, voiced and submitted four demo videos while I slept. That includes ElevenLabs without ElevenLabs, a 1 AM wake-up call, and three CAPTCHAs it would not touch.

---

**Try it:** [live demo](https://jupyterlite-web-mcp.vercel.app/lab/index.html) (Chrome with WebMCP enabled) · `pip install jupyterlite-webmcp` · [GitHub](https://github.com/alliecatowo/jupyterlite-web-mcp) · [Devpost](https://devpost.com/software/jupyterlite-webmcp) · [demo video](https://youtu.be/B_7dSo4hH0k)

Built with Juan Mendoza. Thanks to OpenAI and Devpost for running the challenge. Follow me on X: @AllieCatOwO.
