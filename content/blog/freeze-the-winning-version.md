---
title: 'Freeze the Winning Version'
date: 2026-10-01
description: 'The week after the win I had a moment of attention, a project that needed to stop being a hackathon artifact, and very little of myself to spare. The same split as the build: agents did the hands, I did the calls.'
category: dev
tags:
  - agents
  - open-source
  - hackathon
  - pypi
  - webmcp
author: Allison Coleman
published: false
featured: false
slug: freeze-the-winning-version
---

On September 28 I found out JupyterLite WebMCP was one of the ten winners of OpenAI's WebMCP Challenge. It was also one of the worst-timed good days of my life. I had a lot going on at home that week, and I had maybe a few hours of real attention to spare across the next three days.

I found out from an email, in an inbox I barely check. It said congratulations on the win. I was like: yo, on the _what_ win?

A win like this comes with a short window. People click through from the announcement for a day or two, and then they don't. The repo they land on was built in 40 hours and looked like it. This post is about how I spent that window, mostly by delegating it, and the one rule that kept me from making it worse.

## Did they announce yet?

At 11:14 AM I asked ChatGPT whether the winners were out. It checked and told me confidently that they weren't, and that the announcement was set for 4 PM. In fact @OpenAIDevs had posted the winners thread at 10:00, and my project's own post went up at 10:03.

By 11:35 I knew. Before I told it, I made it guess blind: "I already know, I truly wanna see how intuitive and reliable you are for future interactions." It said "**Win.**", at about 60/40. I said:

> "WE FUCKING WON THERE IS NO "TOP PRIZE" ITS 10 WINNERS AND WERE ON THE LIST"

## A brain dump becomes a plan

Then I did what I always do. I dumped everything on ChatGPT in one message: claim the win, make an X account, post something short, make the project "not suck", update my site, clean up GitHub, LinkedIn, re-do the demo video. And this, which became the series you're reading: "retrospective blog post series on hoe I vibe coded a openai hackathon winner forum my couch, how I had claude drive codex to make the demo".

It turned the dump into a "WebMCP Winner Launch Plan" with sections for now, the next 72 hours, the project, a demo v2, writing, and "things easy to forget". It also drafted a holding post that said I'd won and "More soon."

Its distribution advice was specific, if a little late. The prize included a spotlight from @OpenAIDevs, so it said to make an X account _before_ that post went out, so there'd be a handle to tag. The post had already gone out at 10:03. Neither of us knew yet. Make the README sell the thing that already won. Update my site's content now and redesign it later.

Then it said the thing this post is named after.

## Freeze the winning version

> "You want the story to be **"here's what won; here's what we're turning it into,"** not quietly Ship-of-Theseus-ing the evidence."

Its order of operations: tag the exact commit that won, preserve the submitted video, the screenshots and the Devpost copy, and only _then_ start improving. The rules had forbidden changing submissions during judging. That was over now, but the record of what was judged still matters.

It wasn't the first to say this. Looking back through the logs, everyone kept arriving at the same rule:

- **Me, Sep 3, 3:22 PM**, after submitting: "ensure all code is FROZEN and no commit past 1pm."
- **My fiancé, Violet, 12:50 PM the same day**, after testing the sites: "DO NOT CHANGE ANYTHING IN THE FINAL SUSBMITTED THING".
- **Claude, Sep 4, 12:53 AM**, deciding not to swap in better videos seven minutes before the extended deadline.
- **ChatGPT, Sep 28**, above.

Funny thing: I didn't know ChatGPT had said that. I thought the rule was just "don't edit it until the results are out." We won, so after the announcement, I'm allowed to go on with it.

And I want to keep going. It makes the project more impressive when people show up. It would burn the conversion funnel if I said, "here's the frozen copy, and the real one is over there." I don't want to quietly Ship-of-Theseus it, either. I want to turn it into a community thing. Some people thought it was cool, and I want to see how far it can go. Not as a business. It stays open source. But think Apache Spark and Databricks: Databricks is Spark with a platform around it, and people happily pay a small fee for the hosted version because it adds value. Same with a lot of my home lab. You _can_ host it yourself, but if you have to manage a server through all that mess anyway, why not use the hosted version?

So for me, "freeze" means preserve the record: the commit, the video, the Devpost copy. Then improve the real thing in the open.

## Monitoring that didn't

I'd asked ChatGPT to watch for the OpenAI spotlight and any news, every hour. At 4:47 PM I checked in: "aight how's the winner ops u didnt monitor did you?" It admitted it had scheduled the first run for 7 PM by mistake, so it hadn't monitored anything, and it had missed the @OpenAIDevs thread entirely. It fixed the schedule and did the scan by hand. Earlier that day it had also pointed me at something useful: an AI-assisted review of the whole field, published September 5, that had my project in its top ten.

I'm not dunking on it. It was a genuinely good ops desk for a day. But it's one more data point for this whole series: the agents were each a little wrong, and the system worked because none of them had to be right alone.

## Claude as the hands

The next afternoon I opened Claude Code in the JupyterLite repo:

> "yo, we fucking won! WE WON. okay so a coupel thigns, fix contirbution so project owner is alliecatowo, contributor is juan everywhere. wanna fix the deploys that are failing too (but not break anythign that's already hosted)."

I told it I was distracted and couldn't give it much time. It answered "I'll do the legwork and keep it easy to skim", swept the repo, Vercel and the Devpost page, and came back with a plan before changing anything.

Juan had already opened the first PR that morning, updating the docs to say the project won.

That's very Juan. He's the technically inclined person who test-drives everything, and he keeps my head screwed on straight.

Most of the work happened on September 30, in about four hours of me checking in between other things. By the end of the day the repo had gone from PR #2 to PR #53:

- **Attribution and community files:** me as owner and Juan as contributor everywhere, plus contributing, conduct, security and support docs and a sponsor link.
- **A real deploy setup:** Vercel's Git integration instead of hand-rolled build scripts, after I complained that "all thiese shallwo build scripts seem jank as living fuck."
- **PyPI with Trusted Publishing:** no API token. GitHub Actions proves its identity to PyPI over OIDC. A TestPyPI dry run first, then `jupyterlite-webmcp` 0.1.0 went live.
- **Dependency and security hygiene:** Dependabot grouped and auto-merging when green, CodeQL, and a handful of Copilot autofix PRs for sanitization alerts.
- **Packaging prep for 0.1.1** and a docs pass.

My part was small and specific. I set up the PyPI publishers, because there's no API for that and it needs a logged-in human. I approved one GitHub scope request with a one-time code. And I made one naming call. Claude had a rename ready so the package would match the repo name (`jupyterlite-web-mcp`). I stopped it mid-flight: "oh wait. no, if the devpost url was jupyterlite-webmcp, then we do jupyterlite-webmcp. whats the devpost project name. taht's all I care about". The package matches the winning entry's name. Claude backed the rename out completely.

## Where the agent needed me, and where it didn't

Two moments from that day stuck with me.

The first: auto mode blocked some actions, like setting up Dependabot auto-merge. Claude stopped instead of finding a way around it: "I didn't set this up: the action was blocked before anything ran, and I won't work around it." It went ahead only after I told it explicitly that it was allowed: "you are allowed to do that. i'm saying. please do it." Later, when I'd told it to run the full publish, it approved the PyPI environment gate "on your behalf", because I'd already said so in plain words. That's the boundary I want. It doesn't guess at my consent, and it doesn't make me click the same thing twice.

The second: right after the PyPI release, I asked for an agent to review everything that had landed. It found that the live demo had deployed with **no extensions in it**. The page loaded, the headers were right, and the actual product was missing. Claude owned it: "I only checked the headers after the #18 deploy, not whether the demo itself loaded." It fixed the build, added a guard so a build without the extensions fails, and then wouldn't call it done until production really served all four extensions and loaded in a headless browser.

So for some unknown stretch after the win, the demo people were clicking through to was a bare JupyterLite. My site says "freeze the winning version," and the agent and I still shipped a regression on the first day of improvements. A second agent caught it. That's the system working, and it's also the reason the system needs more than one agent.

## The site

Same pattern on this site, the same week:

- real robots, sitemap and 404s
- a JupyterLite project page
- frontmatter validation in CI
- smaller images
- canonical, OpenGraph and structured metadata
- a homepage that says what I actually do now
- project pages for the other submissions

Claude did the work in pull requests. I reviewed them and said yes or no.

And then this series. I had Claude read every log from the run (two machines, three ChatGPT chats, the Codex rollouts, every commit) and build a timeline before I wrote a word. A lot of what I remembered turned out to be wrong, and I've tried to leave the corrections in.

## What only I could do

Looking at the week as a ledger, the agents did almost all of the typing. What was left for me:

- deciding what "done" meant for a project that had already won
- choosing the package name for a reason no agent would have weighed
- granting the specific permissions it asked for, and only those
- logging into the places that need a person
- saying yes to the plan, and no to the rename
- choosing what to write about, and what to leave out

ChatGPT treated the whole week as a conversion funnel. It scoured my internet presence and decided what needed fixing: the portfolio, a blog I hadn't touched in forever (or maybe Substack), and an X account, because OpenAI had already posted about the win and I hadn't given them a handle to tag. It told me what was lowest- and highest-impact, and it prioritized everything. It wrote the LinkedIn posts. Normally I don't like to post AI slop, but I was busy and stressed, and we needed to use the moment. It planned the PyPI release, the repo cleanup and this site. Then Claude cloned everything and did the work.

The only things I had to do myself: post on LinkedIn (I don't have it hooked up to an agent), set up a couple of GPG keys, and give little bits of feedback, like approving copy. That's basically it.

If you win something, here's my advice, from a week when I had very little to give: preserve the winning thing first, then capture the window, and only then make it better. Hand off everything that's just labor. Keep the calls.

"Demo v2" was on the launch plan, too. I was sure the ElevenLabs re-cuts from the night after submitting were still on my Mac mini. They weren't. They'd only ever lived in the agent's scratch folder. What survived is the overnight batch, including keynote-style cuts that never went public. One of those can be Demo v2.

---

`pip install jupyterlite-webmcp` · [GitHub](https://github.com/alliecatowo/jupyterlite-web-mcp) · [Devpost](https://devpost.com/software/jupyterlite-webmcp)
