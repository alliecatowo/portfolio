---
title: Freeze the Winning Version
description: "The week after the win I had a moment of attention, a project that needed to stop being a hackathon artifact, and very little of myself to spare. The same split as the build: agents did the hands, I did the calls."
date: 2026-10-01
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

## The day of the announcement

On September 28 I found out JupyterLite WebMCP was one of the ten winners of OpenAI's WebMCP Challenge. It was a busy week, and I had only a few hours of real attention to spare across the next three days.

I found out about the win from an email in an inbox I rarely check. It congratulated me on the win, and I didn't know which win it meant.

A win like this comes with a short window. People click through from the announcement for a day or two, and then they stop. The repo they land on was built in 40 hours and looked like it. This post covers how I spent that window, mostly by delegating it, and the one rule that kept me from making things worse.

## Checking whether the winners were announced

At 11:14 AM I asked ChatGPT whether the winners were out. It checked and told me they were not, and that the announcement was set for 4 PM. In fact @OpenAIDevs had posted the winners thread at 10:00, and my project's own post went up at 10:03.

By 11:35 I knew. Before I told it, I asked it to guess blind: "I already know, I truly wanna see how intuitive and reliable you are for future interactions." It said "**Win.**", at about 60/40. I replied:

> "WE FUCKING WON THERE IS NO "TOP PRIZE" ITS 10 WINNERS AND WERE ON THE LIST"

## A brain dump becomes a plan

I sent ChatGPT one long message with everything on my list: claim the win, make an X account, post something short, improve the project, update my site, clean up GitHub and LinkedIn, and redo the demo video. It also included the idea for this series: "retrospective blog post series on hoe I vibe coded a openai hackathon winner forum my couch, how I had claude drive codex to make the demo".

It turned the list into a "WebMCP Winner Launch Plan" with sections for now, the next 72 hours, the project, a demo v2, writing, and "things easy to forget". It also drafted a short holding post saying I had won, ending with "More soon."

Its distribution advice was specific, though it came late. The prize included a spotlight from @OpenAIDevs, so it said to make an X account before that post went out, so there would be a handle to tag. The post had already gone out at 10:03, and neither of us knew yet. It also advised making the README sell the project that had already won, and updating my site's content now and redesigning it later. The X account I made for this is @AllieCatOwO.

Then it gave the advice this post is named after.

## Freeze the winning version

> "You want the story to be **"here's what won; here's what we're turning it into,"** not quietly Ship-of-Theseus-ing the evidence."

Its order of operations was to tag the exact commit that won, preserve the submitted video, the screenshots and the Devpost copy, and only then start improving. The rules had forbidden changing submissions during judging. That period was over, but the record of what was judged still matters.

The winning commit is now tagged `webmcp-challenge-winner` and points to 5e3af3a, made on Sep 3 at 7:03 PM. It was the last commit before the extended deadline of Sep 4 at 1:00 AM. The repo was judged as of the deadline, not the moment I clicked submit. I pushed the tag on October 1.

ChatGPT was not the first to arrive at this rule. The logs show the same instruction several times:

- **Me, Sep 3, 3:22 PM**, after submitting: "ensure all code is FROZEN and no commit past 1pm."
- **My fiancé, Violet, 12:50 PM the same day**, after testing the sites: "DO NOT CHANGE ANYTHING IN THE FINAL SUSBMITTED THING".
- **Claude, Sep 4, 12:53 AM**, deciding not to swap in better videos seven minutes before the extended deadline.
- **ChatGPT, Sep 28**, above.

I did not know ChatGPT had said this. I had understood the rule as "don't edit it until the results are out." Now that we had won, I could continue working on it.

I want to keep developing the project. Keeping one living repo keeps the conversion funnel intact, whereas pointing people to "the frozen copy" with the real one somewhere else would break it. I also don't want to quietly rewrite the evidence. I want to turn the project into a community effort: some people thought it was useful, and I want to see how far it can go. It is not meant to be a business, and it stays open source. The model I have in mind is Apache Spark and Databricks. Databricks is Spark with a platform around it, and people pay a small fee for the hosted version because it adds value. The same holds for much of my home lab: you can host it yourself, but if managing a server is a burden anyway, the hosted version is the easier choice.

So for me, "freeze" means preserving the record: the commit, the video and the Devpost copy. Then I improve the real project in the open.

## Monitoring that did not run

I had asked ChatGPT to watch for the OpenAI spotlight and any other news every hour. At 4:47 PM I checked in: "aight how's the winner ops u didnt monitor did you?" It said it had scheduled the first run for 7 PM by mistake, so it had not monitored anything and had missed the @OpenAIDevs thread entirely. It fixed the schedule and did the scan by hand. Earlier that day it had also pointed me to an AI-assisted review of the whole field, published September 5, that had my project in its top ten.

It was a useful ops desk for the day. It is also another example of a pattern across this series: each agent was a little wrong at times, and the system worked because none of them had to be right alone.

## Claude Code does the repo work

The next afternoon I opened Claude Code in the JupyterLite repo:

> "yo, we fucking won! WE WON. okay so a coupel thigns, fix contirbution so project owner is alliecatowo, contributor is juan everywhere. wanna fix the deploys that are failing too (but not break anythign that's already hosted)."

I told it I was distracted and could not give it much time. It answered "I'll do the legwork and keep it easy to skim". It then swept the repo, Vercel and the Devpost page, and came back with a plan before changing anything.

Juan had already opened the first PR that morning, updating the docs to say the project won.

Juan is the technically inclined person who test-drives everything, and he helps keep me on track.

Most of the work happened on September 30, in about four hours of me checking in between other things. By the end of the day the repo had gone from PR #2 to PR #53:

- **Attribution and community files:** me as owner and Juan as contributor everywhere, plus contributing, conduct, security and support docs and a sponsor link.
- **A real deploy setup:** Vercel's Git integration instead of hand-rolled build scripts, after I complained that "all thiese shallwo build scripts seem jank as living fuck."
- **PyPI with Trusted Publishing:** no API token. GitHub Actions proves its identity to PyPI over OIDC. A TestPyPI dry run first, then `jupyterlite-webmcp` 0.1.0 went live.
- **Dependency and security hygiene:** Dependabot grouped and auto-merging when green, CodeQL, and a handful of Copilot autofix PRs for sanitization alerts.
- **Packaging prep for 0.1.1** and a docs pass.

My part was small and specific. I set up the PyPI publishers, because there is no API for that and it needs a logged-in person. I approved one GitHub scope request with a one-time code. And I made one naming call. Claude had a rename ready so the package would match the repo name (`jupyterlite-web-mcp`). I stopped it mid-flight: "oh wait. no, if the devpost url was jupyterlite-webmcp, then we do jupyterlite-webmcp. whats the devpost project name. taht's all I care about". The package matches the winning entry's name, and Claude backed the rename out completely.

## Where the agent needed me, and where it did not

Two moments from that day stood out.

The first: auto mode blocked some actions, such as setting up Dependabot auto-merge. Claude stopped instead of finding a way around the block: "I didn't set this up: the action was blocked before anything ran, and I won't work around it." It went ahead only after I told it explicitly that it was allowed: "you are allowed to do that. i'm saying. please do it." Later, when I had told it to run the full publish, it approved the PyPI environment gate "on your behalf", because I had already said so in plain words. That is the boundary I want: it does not guess at my consent, and it does not make me approve the same thing twice.

The second: right after the PyPI release, I asked for an agent to review everything that had landed. It found that the live demo had deployed with **no extensions in it**. The page loaded and the headers were right, but the actual product was missing. Claude acknowledged it: "I only checked the headers after the #18 deploy, not whether the demo itself loaded." It fixed the build and added a guard so a build without the extensions fails. It did not call the work done until production served all four extensions and loaded in a headless browser.

For an unknown stretch after the win, the demo people were clicking through to was a bare JupyterLite. I had said to freeze the winning version, and the agent and I still shipped a regression on the first day of improvements. A second agent caught it. That shows the system working, and it is also the reason the system needs more than one agent.

## The site

The same pattern applied to this site that week:

- real robots, sitemap and 404s
- a JupyterLite project page
- frontmatter validation in CI
- smaller images
- canonical, OpenGraph and structured metadata
- a homepage that says what I actually do now
- project pages for the other submissions

Claude did the work in pull requests. I reviewed them and approved or rejected each one.

I also had Claude read every log from the run (two machines, three ChatGPT chats, the Codex rollouts and every commit) and build a timeline before I wrote anything. Much of what I remembered turned out to be wrong, and I have tried to leave the corrections in.

## What only I could do

Over the week, the agents did almost all of the typing. What was left for me:

- deciding what "done" meant for a project that had already won
- choosing the package name for a reason no agent would have weighed
- granting the specific permissions it asked for, and only those
- logging into the places that need a person
- saying yes to the plan, and no to the rename
- choosing what to write about, and what to leave out

ChatGPT treated the whole week as a conversion funnel. It reviewed my internet presence and decided what needed fixing: the portfolio, a blog I had not updated in a long time (or possibly Substack), and an X account, because OpenAI had already posted about the win and I had not given them a handle to tag. It ranked the work by impact and prioritized everything. It wrote the LinkedIn posts. I normally avoid posting AI-written text, but I was busy and stressed, and we needed to use the moment. It planned the PyPI release, the repo cleanup and this site. Then Claude cloned everything and did the work.

The only things I had to do myself were posting on LinkedIn (I don't have it connected to an agent), setting up a couple of GPG keys, and giving small bits of feedback, such as approving copy.

"Demo v2" was on the launch plan too. I had believed the ElevenLabs re-cuts from the night after submitting were still on my Mac mini, but they were not. They had only ever lived in the agent's scratch folder. What survived is the overnight batch, including keynote-style cuts that were never made public. One of those can be Demo v2.

## Key takeaways

- Preserve the winning version first: tag the exact commit and keep the video, screenshots and Devpost copy.
- The winning commit is tagged `webmcp-challenge-winner` (5e3af3a), the last commit before the extended deadline.
- Keep one living repo rather than a frozen fork, and improve it in the open.
- Agents handled the repetitive work; I made the decisions about scope, naming and permissions.
- A second agent caught a regression the first one shipped (the demo deployed without its extensions).
- Some steps still need a person: PyPI publisher setup, scope approvals and LinkedIn.

---

`pip install jupyterlite-webmcp` · [GitHub](https://github.com/alliecatowo/jupyterlite-web-mcp) · [Devpost](https://devpost.com/software/jupyterlite-webmcp)
