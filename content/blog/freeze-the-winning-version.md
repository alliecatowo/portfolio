---
title: "Freeze the Winning Version: The Week After a Hackathon Win"
author: Allison Coleman
category: dev
date: 2026-11-09
description: Winning gives you a short window of attention. How I used mine with AI agents doing the work, and the one rule that kept me from rewriting the evidence.
featured: false
featured_image: /images/projects/jupyterlite-webmcp/gallery-accepted-provenance.webp
ogImage: /images/og/jupyterlite-webmcp.png
published: false
slug: freeze-the-winning-version
tags:
  - agents
  - open-source
  - hackathon
  - pypi
  - webmcp
---

A hackathon win comes with a short window. **People click through from the announcement for a day or two, and then they stop.** The repo they land on was built in 40 hours, and it looked like it.

When JupyterLite WebMCP was named one of the ten winners of OpenAI's WebMCP Challenge, I had a busy week and only a few hours of real attention to spare. So I ran the week the same way I ran the build: **agents did the work, and I made the calls.**

This is how that went, and the one rule that kept me from making things worse.

## Finding out

I found out from an email congratulating me on the win. At 11:14 AM I asked ChatGPT whether the winners had been announced. It said no, not until 4 PM. In fact, @OpenAIDevs had posted the winners an hour earlier.

Before I told ChatGPT the result, I asked it to guess blind. It said **"Win."** It was right: **one of 10 winners, out of nearly 2,500 projects.**

## Turning a brain dump into a launch plan

I sent ChatGPT one long message with everything on my mind: claim the win, set up an X account, improve the project, update my site, redo the demo video, and write this series.

It came back with a **"WebMCP Winner Launch Plan"**: what to do now, in the next 72 hours, for the project, for a demo v2 and for writing, plus a list of "things easy to forget." It drafted a short holding post. And it gave me the advice this post is named after.

## Freeze the winning version

> "You want the story to be **'here's what won; here's what we're turning it into,'** not quietly Ship-of-Theseus-ing the evidence."

The order of operations:

1. **Tag the exact commit that was judged.**
2. **Preserve the submitted video, screenshots and Devpost copy.**
3. **Only then start improving.**

The winning version is now tagged `webmcp-challenge-winner`, pointing at the last commit before the extended deadline. The repo was judged as of the deadline, not the moment I clicked submit.

ChatGPT wasn't the first to land on this rule. The logs show the same instinct four times:

- **Me, after submitting:** "ensure all code is FROZEN and no commit past 1pm."
- **My fiancé, the same afternoon, after testing the sites:** "DO NOT CHANGE ANYTHING IN THE FINAL SUSBMITTED THING."
- **Claude, seven minutes before the extended deadline:** deciding not to swap in re-cut videos.
- **ChatGPT, on announcement day.**

My version of the rule is slightly different. **I don't want a frozen fork.** I want one living repo, so everyone who clicks through lands in the same place. So "freeze" means preserving the record (the tag, the video, the submission copy) and then improving the real project in the open.

## The ops desk missed its first shift

I'd asked ChatGPT to monitor for the OpenAI spotlight and other news every hour. At 4:47 PM I checked in. It admitted it had scheduled the first run for 7 PM by mistake, so **it had missed the @OpenAIDevs post entirely.** It fixed the schedule and did the scan by hand.

That's a pattern across this whole series: **each agent was wrong sometimes, and the system worked because none of them had to be right alone.**

## Claude Code did the repo work

The next day I opened Claude Code in the JupyterLite repo, told it we'd won, and gave it a short list: fix the attribution, fix the failing deploys, and don't break anything that's already live. I said I couldn't give it much time. It replied, *"I'll do the legwork and keep it easy to skim,"* swept the repo, the deploy setup and the Devpost page, and **came back with a plan before changing anything.**

Juan Mendoza, who built the project with me, had already opened the first pull request that morning, updating the docs to say the project won.

Most of the work happened on September 30, in about four hours of check-ins between other things. **By the end of that day, the repo had gone from PR #2 to PR #53:**

- **Attribution and community files:** contributing, code of conduct, security and support docs.
- **A real deploy setup:** Vercel's Git integration instead of hand-rolled build scripts.
- **PyPI with Trusted Publishing:** GitHub Actions proves its identity to PyPI directly, with no long-lived token. A dry run on TestPyPI first, then `jupyterlite-webmcp` 0.1.0 went live.
- **Dependency and security hygiene:** grouped Dependabot updates, CodeQL and automated fixes for code-scanning alerts.

My part was small and specific. I set up the PyPI publisher, which needs a logged-in person. I approved one access request. And I made one naming call: Claude had a rename ready so the package would match the repo name. I stopped it: **the package should match the name of the entry that won.** Claude backed the rename out completely.

## Where the agent needed me, and where it didn't

Two moments from that day stood out.

**It stopped at a boundary instead of routing around it.** Auto mode blocked a couple of actions, like enabling Dependabot auto-merge. Claude didn't try to sneak around the block: *"the action was blocked before anything ran, and I won't work around it."* It went ahead only after I explicitly said it was allowed. Later, once I'd told it to run the full publish, it approved the PyPI release gate on my behalf without asking again. **That's the boundary I want: don't guess at my consent, and don't make me give it twice.**

**A second agent caught a regression.** After the PyPI release, I asked for a separate agent to review everything that had landed. It found that **the live demo had deployed with no extensions in it.** The page loaded and the headers were correct, but the actual product was missing.

Claude owned it plainly: *"I only checked the headers after the #18 deploy, not whether the demo itself loaded."* It fixed the build, added a guard so a build without the extensions fails, and didn't call it done until production loaded all four extensions in a real headless browser. **The demo was broken for about an hour and a half.**

I had said to freeze the winning version, and we still shipped a regression on the first day of improvements. A second agent caught it. **That's the system working, and it's why the system needs more than one agent.**

## The site

The same pattern applied to this site that week, all through pull requests I reviewed:

- a real sitemap, robots file and 404s
- a project page for JupyterLite and the other submissions
- frontmatter validation in CI
- smaller images and proper share metadata
- a homepage that says what I actually do now

I also had Claude read every log from the run (two machines, three ChatGPT chats, the Codex sessions and every commit) and build a timeline before I wrote a word. Much of what I remembered turned out to be wrong, and this series uses the logs.

## What only I could do

Over the week, agents did nearly all of the typing. What was left for me:

- **Deciding what "done" meant** for a project that had already won
- **Choosing the package name** for a reason no agent would have weighed
- **Granting specific permissions**, and only those
- **Logging into the places that need a person**
- **Choosing what to write about**, and what to leave out

## Key takeaways

- **Preserve the evidence first.** Tag the judged commit and keep the video, screenshots and submission copy.
- **Keep one living repo**, not a frozen fork, and improve it in the open.
- **Use agents for the hands, keep the calls.** Scope, naming and permissions stayed with me.
- **Run a second agent as reviewer.** It caught a regression the first one shipped.
- **Plan for your attention, not just your time.** A good launch plan and a few focused check-ins went a long way.

---

`pip install jupyterlite-webmcp` · [GitHub](https://github.com/alliecatowo/jupyterlite-web-mcp) · [Devpost](https://devpost.com/software/jupyterlite-webmcp) · Follow along on X: [@AllieCatOwO](https://x.com/AllieCatOwO)
