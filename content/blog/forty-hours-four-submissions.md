---
title: "Four Submissions in 40 Hours: How I Won OpenAI's WebMCP Challenge by Managing Agents"
date: 2026-10-01
description: 'I found the WebMCP Challenge with two days left, shipped four entries, and one of them won. The logs remember it differently than I do.'
category: dev
tags:
  - webmcp
  - agents
  - claude
  - codex
  - hackathon
  - jupyterlite
author: Allison Coleman
published: false
featured: false
slug: forty-hours-four-submissions
---

On September 28, OpenAI posted the ten winners of the WebMCP Challenge. One of them was **JupyterLite WebMCP**, which I built with my friend Juan Mendoza.

Nearly 2,500 projects came in. I submitted four of them, and I didn't start until the challenge was 70% over.

The version of this story I've been telling people goes like this. I put Claude in dangerous mode on my Mac mini and told it to make the perfect demo. It filmed, voiced, edited and uploaded everything overnight. Then I submitted from a bar, with minutes to spare, while my fiancé, Violet, clicked CAPTCHAs.

Before writing this, I had Claude read every log from those three days: two machines' worth of agent sessions, every commit, the ChatGPT chats, the Codex rollouts. Most of my story held up. A lot of the details didn't. The corrections turned out to be more interesting than the version I remembered, so they're in here too.

I left my prompts the way I typed them, profanity and typos included. People sell prompt-guru courses on how to structure a prompt. That's the opposite of the point. The whole point of the AI is to take my loose stream of thought, often dictated from my phone while I'm doing two or three other things or having a drink, and make something that wins an OpenAI competition. It's a sieve. It's generative. It synthesizes. It takes my ideas, which is the one thing it can't do, and cleans them up and structures them. From that structure I can see the decision points where I need to fine-tune again. Every little sentence I give it is worth its weight in gold.

## Day 7 of 10

WebMCP is a proposed web standard that lets a page register typed tools (`document.modelContext.registerTool`). An AI agent in your browser can then work with the live app instead of screenshotting it or scraping the DOM. OpenAI and Devpost ran a ten-day challenge for it.

I found it on day seven.

I didn't stumble on it. I had ChatGPT running a monitor that looked for hackathons I could do easily and that actually fit the criteria. Unfortunately, that monitor fired weekly. When the notification came in, I realized: oh, okay, I only have three days left. It felt a little late. But it also looked very, very simple, it stood out as perfect for me, the prize pool was nice, and I was worried I'd already missed it.

So I decided to lean on concurrency and build more than one thing at the same time.

My first message to ChatGPT was the two challenge links. Seven minutes later I sent: "anything thats even more WOW ALLIE YOU CAN DO THIS RN or do we ship eotrybook". That's how I type when I'm thinking fast. I'm leaving the typos in, because they're how this whole thing actually worked.

## The one I killed

The first thing I built was a WebMCP addon for Storybook. I picked it because it was "the most me."

At 12:39 PM I pasted a 53,000-character spec into Claude Code with "fan out mass agents (cheap as possible so we can keep running)". Forty minutes later, 13 agents were working at once, which turned out to be the peak of the entire run. About an hour after the paste it had 340 passing tests, and I'd hit my first session limit.

Five minutes later I handed the same spec to Codex: "drive cheqp luna agebts. verify state and tell me state / hand off immediatly". Codex finished it, and by 4:31 PM it was deployed. Codex wrote 19 of its 22 commits. I also spent part of that afternoon yelling at Codex to rewrite history because my commits were signed with the wrong name.

At 5:18 PM I told ChatGPT: "bad news, built it, its basically the same as the storybook mcp but less powerful. next thing?"

Storybook already has an MCP server. If a normal MCP server can do the job, WebMCP is just a wrapper, and a wrapper doesn't win. So five hours into my two days, I killed a finished, deployed, tested project.

I'd picked Storybook because it's something I'd really want for myself. As I read more, I could see the live state of Storybook, the component states and so on, might have been an OK fit for WebMCP. But Storybook's own MCP can already make edits, so mine wasn't the correct fit. I didn't feel like I'd thrown it away, exactly. I banked it. I still had something I could submit, and with a day or two left, I might as well try other things.

## Arguing my way to a notebook

The next ninety minutes were me rejecting ideas out loud:

> "its something _collabrative_, that wouldnt make sense on a normal mcp. fuckkkkkk UGHHHH."

> "its gotta be a task thats far easier visually and exposes _more minute conteol_ then chat interface would."

> "oh and it CANT be dependent on ai. thats a hig thing. the app has ti have a normal interface for a user and full functionality without web mcp - web mcp just plugs in."

Then, at 6:32: "youre already logged in, and its useful when youre already on the site… I feel like notebooks though really do tell the cleanest colab story."

A JupyterLite notebook runs entirely in your browser. The kernel is Pyodide in a web worker, and your files live in IndexedDB. Your unsaved edits, your selection and your running kernel exist only in that tab, and there's no server for an MCP server to talk to. That became the pitch: the state your agent needs already lives in the browser, and WebMCP is the only way in.

At 7:01 PM: "OH WHAT IF YOU COULD JUET LIKE CLAUDES DIFF REVIEW. SO YOU CAN LEAVE MULTIPLE GOOGLE DOC STYLE COMMENTS ON SLEECTIONS OF CELLS OR CODE." That became threaded review, one of the core features.

What made notebooks click was what the challenge was actually about. I didn't want to do games. And I was realizing WebMCP is a limited spec: it's really just a way to expose what's on a page to the browser's agent. But the hackathon wasn't "take an existing app and let an agent drive it through WebMCP instead of the DOM." It was about the shared interaction between a human and an agent over client-side state. A notebook is a visual artifact with a layer of state that lives in the client, not on a server and not just in the file.

It was also personal. Whenever I had Claude edit a notebook file, I'd end up rerunning the whole notebook, reloading heavy cells, or going down rabbit holes because the kernel state didn't match the new code. Then I thought about multiplayer notebooks like Google Colab, and that was the actual perfect collab story.

"Google Doc comments on cells" came from Colab, and from living in Google Docs lately. It has nothing to do with Google Docs. It's the interaction model: review, auditability, a real-time loop you can add an agent into. It's also something a chatbot can't do. I'd been using a Google Docs MCP, and it absolutely sucks for resolving comment threads with other people.

I don't tell ChatGPT what I want. I tell it why things suck. It turns each complaint into a rule, and the rules add up to a product. "it CANT be dependent on ai" became a contract section titled **THIS IS NOT AN AI APPLICATION**. "drop that then if web mcp cant _trigger_ the agent" became **CRITICAL WEBMCP LIMITATION**, which reads in part: "WebMCP cannot independently wake, summon, or notify an agent when something changes."

At 7:03 PM ChatGPT produced a 65-section, 45,000-character build contract. It covers the product boundary, the exact repo layout, a schema for every tool, a hashing protocol for stale writes, a test-only WebMCP shim, the Playwright cases, a hostile audit checklist, acceptance criteria and the submission copy. Its first instruction is "Build this project completely." Its last line is "Build the complete version."

## Paste, plus one line

At 7:31 PM I pasted it into Claude Code, almost word for word, and added one line at the bottom:

> implement full spec relentlessly and most improtantly EFFECIENTLY

Then I sent three short "how to work" messages in four minutes. The middle one was "minimal minimal absolute minimal token / context usage. wait for htings, don't poll, dispatch haiku for mechanical coupel fo fies changed sorta things". The last was "continue relentlessly, this si my last time steering. good luck… cook it and send it one hunna."

The JupyterLite contract says what to build and how to prove it. It doesn't say which models to use. That part came from my nudge. The contracts I wrote later that night for Swagger UI, Strudel and Careers do carry the org chart: two cheap Haiku scouts, three or four Sonnet workers, one Haiku auditor, and "Do not create a hierarchy of agents managing agents. Do not use 20 reviewers." I wrote more about that in the contract post.

The first commit landed 27 minutes after the paste, and it was deployed three minutes after that.

While it worked, I left my laptop open on the couch. I knew it would work. I'd used Codex and Claude a lot before, the WebMCP part didn't look hard, and the artifact was easy to test: does the WebMCP work or not? Storybook had been almost a test run. With that working, it was like, oh shit, yeah, we can get JupyterLite done, easy peasy. So I went straight back to ChatGPT and kept writing more contracts. ChatGPT is free in the chat, and I'll do anything I can to keep the ideation and chatting out of Claude Code. I want my credits to go to code.

I did get loud once. It was testing against a fake WebMCP shim with Playwright, and I wanted the real thing: "I DONT WANT FUCKING PLAYWRIGHT SURE YOU CAN USE THAT BUT I WANT YOU TO FUCING DRIVE WITH THE FUCKING MCP. anyways. there are 55 backgorund shells. unacceptbale." Once it was driving a real WebMCP browser it came back with: "Real bugs found by driving the browser, not by reading code." One was a race where the agent could open a notebook about half a second before the kernel existed.

## Four at once, and nine walls

That night, with JupyterLite running and the Swagger UI contract already handed to Codex, I asked ChatGPT the rules question that shaped the rest of the run: can one person submit more than once? Yes, as long as each entry is "unique and substantially different", and prizes are per submission. Eight minutes later I told it "girl ive already fully shipped both cause I couldnt wait for him im a MACHINE im a code munching MACHINE." The strategy stopped being win-with-one and became bank-as-many-good-ones-as-I-can.

Being allowed more than one entry changed everything. How hard is it, really? I can shit out projects. Look at how many I've shipped the same way: I ideate, I make a basic spec in the chat app, I hand it to Claude Code remotely, and boom, the project is pretty much finished. After that, my usage is the only limit, and it wasn't burning as fast as I'd expected.

So I did the napkin math. It's something like a Bernoulli trial. Say there are about a thousand eligible entries. With one entry, I've got a one-in-a-thousand chance. With four, it's one in 250. It was also about judge variance, quality and different angles. I see something and think there are five different angles I could go with, and with AI I can build all five and see which one is best.

By just after midnight I had contracts running for Swagger UI (in Codex), Careers and Strudel (in Claude), plus JupyterLite. I launched Strudel and Careers from my phone, either SSHing into my Linux box over Tailscale or starting a Claude Code session from the app, then pasting a contract and walking away.

It wasn't smooth. I pasted the Strudel contract into the wrong session ("wait you may be in wrong repo… check out jewelry repo", which was dictation for "the new repo"). The Careers contract hit a session limit the moment it landed. My Linux box rebooted twice mid-build for a kernel update.

I hit Claude's session limit **nine times** in two days. At 4:38 PM on Sep 2, all four sessions hit it within the same 70 seconds, and my Strudel prompt "this looks like vibe coded shit fix it immediately" bounced straight off the wall. I was on the $100 Claude plan and the $20 Codex plan. When Claude ran out I switched to Codex, and when both ran out I slept. From 3 to 7 AM on Sep 2, nothing ran at all.

That $100 plus $20 budget shaped the whole thing. Imagine if I'd had a $200 Claude and a $200 Codex. Imagine if I could have used fast mode. What limits me is tokens per second, averaged over the downtime of waiting for a limit to come back. More usage would have meant more concurrency, and concurrency is the whole strategy. It's why I ideate in ChatGPT, why I want cheap models on small tasks, and why I'd rather an agent commit once, when it's ready, than do git ceremony all day. I care about the code getting onto the machine.

Across those two days on Linux, 97 prompts from me turned into about 5,700 Claude tool calls, spread over 106 subagent transcripts. Codex made about 2,100 more. The longest stretch on a single prompt was Strudel, which ran 2 hours 20 minutes until the limit stopped it.

One goal evaluator flatly refused me. I set Careers' `/goal` to "implement with swarm till proud of how submission worthy this is and sam Altman wants to pay me a million dollars". For half an hour the evaluator kept saying "not met", and Claude kept declining to fake it: "I won't fabricate a message, email, or log claiming otherwise." Fair.

## The night it almost didn't happen

Sep 2 evening is where it got real. I pasted the same "final artifact" checklist into three sessions within four minutes, and sent "can you SELL IT?" to all three within 14 seconds. Claude answered with the sentence nobody wants the night before a deadline: "**The video doesn't exist**… **Nobody has run this in a real WebMCP browser**."

Then I opened the JupyterLite page and lost it: "this is fucked what the fuck is this i dont thinkt heres na agent connected it looks hideos." The status bar said an agent was connected when none was. Claude called it "the one dishonest pixel" and removed it. Now the status bar only ever says `WebMCP ready`, `WebMCP unavailable` or `WebMCP error`, and a unit test fails if an idle status ever contains the word "agent." Remember that one, because it comes back.

A bunch of cuts happened fast after that:

- I'd wanted a Propose mode, where agent edits show up as suggestions you accept or deny. It wasn't built. "okay ship without it… No matter what hsip what we ahve now."
- Widgets weren't reliable in the demo: "nah rmeove and get it wokring first."
- The repo was still private, and Claude wouldn't flip it: "that's an outward-facing change and yours to make." After a secrets check I said go.
- Codex, doing QA in parallel, rebuilt and deployed, and Claude noticed "production is running code that exists on no commit." It fixed that by committing the deployed tree.

Juan came in on the demo. He rewrote the shooting script (Claude called it "a tighter shooting script — genuinely better, and it kept every fact"), and we spent the night trying to record it.

Juan ran through everything on his computer while I wrote the prompts. We already had some footage. We just couldn't get it under three minutes. It's hard to write a script and then actually recite it, and we couldn't one-shot a take, because Codex is slow even in fast mode, so every take needed editing. I didn't want my voice on it, either. I'm anxious, I'd tried, it took forever, and then I realized I'd have to download audio editing tools. I've used Premiere, but that's a lot of stuff to do. I felt defeated.

Eventually Juan was like, yo, I've got to go to work, I'm tired. I was kind of on one, so I decided to stop drilling into making one demo perfect. Just get them filmed and under the time limit. That was part of my game theory too. How many people actually fulfill every little eligibility requirement? One video that ChatGPT had flagged as a really strong competitor had no audio in its YouTube demo. Instantly disqualified. It's not good sportsmanship to win by default, but I had to ship. I was literally crying. It would be such a shame if I made all this and didn't ship it.

At 10:54 PM I asked Claude: "okay fuck this. cna you drive an applicaiton yes or no… drive trhough the gpt app… video edit it yourself… all I need is a voice over."

It said no. GNOME on Wayland wouldn't let it take a screenshot or inject input:

> "If step 4 of 40 silently missed, I'd cheerfully keep going and hand you garbage at 6am. I won't pretend that's a plan."

I tried installing `ydotool` myself, it failed, and I pasted the error back like a cat bringing in a dead bird. Then I wrote the most useful sentence of the whole run: "It mgith be a smarter investment to get you seutp then for me to try to finish this out at midnight thirty."

## You're on a Mac now

The Mac mini was a last-ditch effort. I knew AppleScript would let an agent drive that machine much more easily, and Claude Code Desktop on the Mac has computer use. (The full list of reasons is in the next post.) At 11:21 PM I opened a Claude session on it, pasted Linux Claude's "No," and asked: "that was a previous chat. you're on a mac now. is it feasible on this mac, cn you try?"

Two minutes later: "**Yes, this is feasible on this Mac — and it's not close.**"

Here's what it did, mostly while I slept, steered from my phone:

- It recorded **only the Codex app's window** (`screencapture -l<windowID> -v`), so the video shows a real user flow and not Claude taking over my screen.
- It typed Juan's script into the Codex desktop app. Codex opened the live site in its own browser and called my WebMCP tools (`jupyter_open_notebook`, `jupyter_update_cell`, `jupyter_run_cells`). Claude was the user on camera, and Codex was the agent on camera.
- Keynote wasn't installed, so the "keynote-style" cut I asked for was built entirely in ffmpeg by a subagent.
- It went through voices. The first was "ultra robit." I told it "no I want eleven labs without using eleven labs." The one I loved, at 1:25 AM, was **openai.fm**, OpenAI's own free text-to-speech demo. So the narration on my OpenAI hackathon demo was voiced by OpenAI, for free.
- At 1:04 AM a subagent played audio through the speakers and woke Violet and me up. I told it so, in words I'll let you imagine. It muted the system and said: "Go back to sleep, I've got it from here."

It filmed all four projects that night. The uploads and submissions happened the next morning, not overnight. The whole Mac mini night gets its own post.

About "dangerous mode": I was sure I'd run it that way. The Mac session was actually in Claude's **auto** mode the whole time. What _was_ wide open was the Chrome extension, set to skip all permission checks, and at one point Claude itself ran Codex with `--dangerously-bypass-approvals-and-sandbox` to test something. The only session that logged real bypass mode was an OpenAPI "emergency" session on Linux that afternoon. So it's the right memory attached to the wrong machine.

My side of it: I normally run in loud, dangerous mode, because I don't care. It's my little Mac mini. Screw it. The Mac is my sandbox, it's behind Tailscale, it's reasonably secure, and that's a trade-off I make. When I'm racing, I don't care about permissions. As long as it doesn't publish embarrassing things on my behalf, I've found Claude is actually very sensible, and if I lose some work, whatever. I'd rather ship it.

I really did think I was in dangerous mode that night. The Claude remote interface doesn't always set the permissions you wanted. And auto mode is, as you can see, good enough. YOLO mode is an old habit from before auto mode existed. My one complaint is speed: the classifier checking each command takes a little time, which is annoying when you're racing.

## Submitting from work

The next morning I was at work. At 9:12 AM: "most impoetant is upload to YouTube since im at work can we check?"

YouTube wanted a channel. Claude filled in the name and handle, then **refused to click Create**, because that accepts YouTube's terms of service on my behalf: "this is a firm line, not a judgment call I can waive under deadline stress." I begged: "please click it i will not be able to submit this competition otherwise, my partner is monitoring but mouse is dead". Violet clicked it, and I typed "OKAY UR CREATED UR IN."

Devpost logged me in through GitHub, and the 2FA prompt went to my phone. Then came CAPTCHA number one. Claude: "solving CAPTCHAs is a hard line I won't cross even here." Me: "IF WE DONT SHIP CAUSE OF A FUCKING CAPTCHA IM GONNA BE PISSED." Violet solved it. The same thing happened twice more.

I was literally at work for all of this. I'd go into a phone booth, call Violet in a panic, and say: I need you to click this. They don't write code, but a couple of times I texted them, yo, it's stuck, can you check its status, where is it? I was busy working, so they'd walk up to the Mac mini, read what it was saying, and click. The Mac mini is hooked up to a monitor that's always on, so it can use computer control. (I haven't messed with headless computer use yet.)

In that case, Violet was the agent. They clicked the things the agent can't do, which sucks, because it's totally capable. It's just not allowed. I get why. But what would it have gained me to manually make the YouTube channel and everything? A lot of that is ceremony.

Then the four submissions:

| Time (PDT) | Submitted          |
| ---------- | ------------------ |
| 11:43 AM   | JupyterLite WebMCP |
| 11:51 AM   | Swagger UI WebMCP  |
| 12:09 PM   | Careers WebMCP     |
| 12:16 PM   | Strudel WebMCP     |

In between I sent "dude ship it ship it ship it ship it fucking ASAP get onto the next one." Four entries in 34 minutes, 44 minutes before a 1 PM deadline.

Except the deadline wasn't 1 PM anymore. At 11:25, before the first submit, Claude had told me the live countdown on Devpost said **Sep 4, 1:00 AM**. (Later that afternoon we learned why: an OpenAI-side outage had pushed it back 12 hours.) My reply was "fuck it dont care anymore. ship it." At 3:28 PM I was still arguing with it. At 3:57 PM I finally conceded: "well its expanded for another 10 hours...".

So "I submitted with minutes to spare" isn't true. I submitted with 44 minutes to spare before a deadline Claude had already flagged as probably wrong.

I do remember being told. Claude kept saying there was a mismatch: one page had the original deadline, another had the extended one. It didn't search widely enough to find the actual extension announcement. I did not want to fuck around and risk submitting late against a deadline I couldn't confirm. When it finally landed, I thought: oh, crap, now I can actually make some of this better.

## My agents gave me 10–20%

That afternoon I had Claude grade my odds. Its first pass sampled a dozen or so competitors per project and came back saying each of mine was #1 in its niche. I didn't buy it: "13 sampled its gotta sample alllll". So it sent 11 agents to score 541 competitor repos on the four official judging criteria. My four scored 33–34 out of 40, 13 entries beat my best, and its estimate for any one of the four winning was "realistically closer to **10-20%**."

It ranked JupyterLite lowest-tied, at 33, because "an AI pair-editor for an existing IDE" read as incremental. With the extra hours, it recommended I put everything into Swagger UI.

I said: "you didnt like jupyter?"

Then I typed out the feature I'd cut the night before, in one message: Propose mode, where "even edits are propositions like an inline accept deny diff. and if you deny u can deny with reason and itll see that was denied". An hour later I added: "I really do think jupyter is our best bet and deserves the focus btw, especially cause nothing else like it was submitted".

Propose/Deny shipped at 4:38 PM. In Propose mode, the agent's `jupyter_update_cell` call stays pending until a human clicks Accept or Deny under the cell. If you deny, the agent gets your reason back as a normal result instead of an error, so it adjusts instead of retrying.

What did I know that the agent didn't? Partly, JupyterLite just looked the most visually impressive, and it was working better and was more robust. I actually liked the Swagger UI one more. An agent that's just browsing the web could use Swagger docs that already exist, and how many people use Swagger docs? Everybody. But we'd built its demo on a fake task-management API, and that was the absolute worst choice. It's not a public API, there's no reason you'd use it unless you were already logged in as that user, and you have to seed it.

JupyterLite was also a plugin, not a fork, which made it a clean developer-tools story. My agents' crawl of the field showed nobody else was doing that. And Propose/Deny definitely came from Strudel's accept-suggestions mode.

That fight gets its own post too.

## Not swapping the videos

That evening I tried to make better videos. I hooked up ElevenLabs and we re-filmed. It went badly. I was still juggling all four, the session had compacted, and it was worse at driving than it had been the night before. The presence highlights I'd built weren't showing up on camera ("I DONT SEE THE PRESENCE RINGS… OR I DONT BELIEVE YOU"), the disk filled up, and a stray Chrome window kept ghosting into the recording.

I also sent this, which I stand by: "i do not want to hear "and here's the honest part" in a fucking script."

I was at the bar for most of that. I'd hooked up ElevenLabs from there, steered the re-cut from my phone, and watched the cuts as they came in. Eventually I stopped steering. At 12:52 AM Claude sent: "It's 12:52 AM PT — 7 minutes to deadline. Not enough time to safely upload 4 new YouTube videos and swap Devpost links…" Its decision was not to swap. I replied at 12:56: "lets not do it idk." A complete, working submission beats a better video with a broken link.

That, I'm pretty sure, is the "minutes to spare" I remember. It wasn't the submission. It was the night after, deciding _not_ to touch it.

So the bar was real. I was at the bar while Claude finished the better demos, and I watched the second round of cuts there. I'd merged two days into one memory. The submissions happened from work, from a phone booth, with Violet at the Mac mini.

I watched those re-cuts. The voice was perfect. Some of them went too short, and some were missing things. I was sure they still existed. They don't: they only ever lived in the agent's scratch folder, which is gone. What survives is the overnight batch, including keynote-style cuts nobody has seen, and I'll post those.

## The win, and the robots who disagreed

On September 28 at 10:03 AM, @OpenAIDevs posted: "JupyterLite WebMCP brings an agent into your live notebook to edit cells, run code and review changes together. Built by Allison Coleman and Juan Mendoza."

The Devpost "Meet the winners" post described it as "An agent that works right inside a browser-only Jupyter notebook. It reads your unsaved cells and exact selections, runs code in the kernel you share with it, and marks every change in place." That's a list of the contract's rules, in someone else's words, which is the nicest thing anyone could have said about it.

I found out from an email, in an inbox I barely check. It said congratulations on the win. My reaction was: yo, on the _what_ win?

Before I told ChatGPT the result, I made it guess blind. It said "**Win.**" I said "WE FUCKING WON THERE IS NO "TOP PRIZE" ITS 10 WINNERS AND WERE ON THE LIST".

The funniest part came after. Other people ran their own AI judging on the whole field:

- **HanClinto** published an AI-assisted pre-judging review on Sep 5, weeks before any results. It had JupyterLite at #2 on its initial shortlist, and #9 after widening the review to all of the roughly 2,500 entries. It singled out the Propose/Deny behavior: "Denial returns a human reason as a normal result, allowing constructive revision."
- **A 1,035-agent judging fleet** ranked it **#829**. Its tester's browser didn't have WebMCP turned on, so my status bar honestly told it "WebMCP unavailable", and it marked Execution down.

The challenge page lists the judges by name: people from OpenAI, Google Chrome, Vercel, Shopify, Cloudflare, Netlify, and the creator of MCP-B. They picked it. The status bar I'd made honest is what told the robots "WebMCP unavailable", and they ranked it #829. My own agents gave me 10–20%. I'm keeping all three numbers.

## What I actually did

Roughly 300 prompts from me turned into about 16,000 agent tool calls across Claude, Codex and two machines, about 50 to one. Treat that as an order of magnitude, since it mixes tools and machines. That's about 43,000 lines of non-Markdown code, tests and config, and 80 commits across the four submitted repos before the original deadline. I wrote very little of the code. This is the part I did:

| I decided                                                | Agents did                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| Four entries, not one (after reading the rules)          | Wrote six contracts from my rants (ChatGPT)                        |
| Kill Storybook, even though it was finished              | Built Storybook, then the four submissions (Claude, Codex)         |
| Notebooks, because the state only lives in the tab       | Scaffolding, tools, tests, deploys, subagent fan-out               |
| Drive the real WebMCP, not a shim                        | QA on the live sites (Codex), fixes (Claude)                       |
| No dishonest pixels; cut widgets; cut the 19-tools panel | Found the kernel race, the access leaks, its own false negatives   |
| Switch to the Mac when Linux said no                     | Filmed Codex using the sites, voiced them, cut them, uploaded them |
| Bet on Jupyter when my agents bet on Swagger             | Scored 541 competitors to tell me I'd probably lose                |
| Propose/Deny, specced in one message                     | Shipped it in 32 minutes                                           |
| Don't swap the videos at 12:53 AM                        | Made that call first, and waited for me to agree                   |

And one thing only a person could do: click "I agree" and pick out the crosswalks.

Codex deserves its own line. It wrote most of Storybook after Claude hit a limit, made a few early JupyterLite commits, and then I deliberately stopped spending its credits on code. I saved them so Codex could be the one using the sites: in QA, and on camera.

My takeaway isn't that AI built my app. I built a setup where my attention only went to the decisions that changed the outcome, and on the biggest one, my taste overruled my own agents.

If you're starting a hackathon tomorrow: be goal-oriented, and make it about the criteria. It's about shipping something complete. It's only half about what you're building. The other half is packaging: the contributing guide, the docs, the setup and installation, every T crossed and every I dotted, every box checked. Hedge your time. Get a working demo.

Then sell the impact. JupyterLite WebMCP is a plugin you can install right now, so it has the reach of millions of JupyterLab installations, even if it isn't all the way there yet. Impact and ambition were half of what we were judged on. Go T-shaped: a wide breadth, and real depth in one or two areas.

Next: how an agent on my Mac mini directed, voiced and submitted four demo videos while I slept. That includes ElevenLabs without ElevenLabs, a 1 AM wake-up call, and three CAPTCHAs it would not touch.

---

**Try it:** [live demo](https://jupyterlite-web-mcp.vercel.app/lab/index.html) (Chrome with WebMCP enabled) · `pip install jupyterlite-webmcp` · [GitHub](https://github.com/alliecatowo/jupyterlite-web-mcp) · [Devpost](https://devpost.com/software/jupyterlite-webmcp) · [demo video](https://youtu.be/B_7dSo4hH0k)

Built with Juan Mendoza. Thanks to OpenAI and Devpost for running the challenge.
