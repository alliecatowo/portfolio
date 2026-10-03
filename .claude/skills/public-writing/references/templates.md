# Templates

All templates are skeletons. Every bracket must be filled from a verified source or left as `TODO(allie):`.

## Blog post

```markdown
---
title: <specific, 50-65 chars, names the entity; not a pun>
description: <120-165 chars, one concrete claim + a number>
published: false
---

<Answer in 2-3 sentences. What happened / what it is / what the reader gets. Includes the main entity by full name and one number with its source.>

<One definitional sentence: "X is a Y that Z.">

## What is <thing> and why does it exist?

<Problem in concrete terms: who hits it, what it costs, what existed before.>

## How does <thing> work?

<Mechanism. Lead with the constraint. A small diagram, code block, or screenshot with real alt text.>

## What were the results?

<Numbers, dates, sources. Table if three or more comparable figures. State the method behind each number.>

## What went wrong, and what I'd do differently

<Two to four bullets. Specific mistakes, specific fixes. No self-flagellation.>

## <Real question readers ask, e.g. "Can I try it?">

<Answer first. Link to the demo/repo with descriptive anchor text.>

## What's next

<Status, one CTA (issue, repo, demo). Internal links: /projects/<slug>/ and a related post.>
```

Notes: 800-1,500 words. Each H2 opens with its answer. No "Conclusion" heading; end on the CTA or the next step. Add `seo` fields per CLAUDE.md. Optional FAQ only for real questions.

## LinkedIn post

```text
<Line 1: the news or claim, plain, under ~140 chars so it sits above "see more".>
<Line 2: the number or the tension that makes someone tap.>

<What it is, in one sentence, naming the thing.>

<Why it is different: one constraint or mechanism, 2 sentences.>

<One specific result with its source: "22 tools, 4 submissions in 40 hours".>

<Credit: who helped with what, by name.>

<Honest status or what's next, one line.>

<Question or CTA that someone can actually answer.>
```

- 900-1,500 characters typical; blank line between every paragraph; 0-3 relevant hashtags at the end, never a wall.
- Link goes in the first comment. Name the artifact in the body so the post is complete without the click. LinkedIn guidance on this is third-party and inconsistent; say which choice you made in the PR and let her override.
- Images: a real screenshot or short demo clip beats a stock graphic. Carousels (PDF, 6-10 slides, one point per slide) suit walkthroughs and "how it works" diagrams; write slide 1 as the hook.
- Post as a person: first person, no "we're thrilled to announce".

## X thread

```text
1/ <Claim + payoff. Standalone. Number if you have one. Media attached.>
2/ <Context: what problem, one sentence.>
3/ <Mechanism or step. One screenshot or snippet.>
4-7/ <One point each. Concrete. No filler transitions.>
8/ <What did not work / what's next.>
9/ <Restate the claim in new words. Link to repo/demo/post. One ask.>
```

- 5-9 tweets. Links only in the last tweet. Every tweet should still make sense if quoted alone.

## Project write-up (portfolio project page body)

```markdown
<One-sentence definition: "<Name> is a <type> that <does what> for <whom>.">

## Why I built it

<The problem, 2-3 sentences, sourced.>

## What it does

<Three to six capabilities as short bullets with specifics.>

## How it works

<Architecture in a paragraph. Stack named.>

## Results

<Numbers with source: awards, test counts, tool counts, links to the announcement.>

## Try it

<Demo, repo, docs. Status and roadmap in one line.>
```

## Announcement or win post

Lead with the result in one sentence, name the contest and what the project is, say what is next, thank specific people, link in the first comment. Prize amounts and anything about judges' private feedback stay out.
