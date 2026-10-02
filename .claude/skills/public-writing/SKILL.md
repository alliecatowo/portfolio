---
name: public-writing
description: Use whenever you write or edit public-facing prose for Allison Coleman (allisons.dev blog posts, LinkedIn posts, X threads, project write-ups, launch or win announcements, Devpost text, README intros). Covers her real public voice, AEO/GEO/SEO structure, an AI-slop checklist, fact and privacy rules, and the draft-and-PR workflow.
---

# public-writing

Public prose for Allison must sound like her, be true, and be easy for both engineers and answer engines (ChatGPT, Perplexity, Google AI Overviews) to quote. Frontmatter schemas, description lengths and `useSiteSeo` live in CLAUDE.md; this skill covers the prose.

Depth: `references/voice-profile.md`, `references/templates.md`, `references/aeo-seo.md`, `references/slop-list.md`, `references/sources.md`. Run `pnpm check:prose <file>` before every handoff.

## 1. Voice (short version)

Source: her LinkedIn posts, her published blog posts, the JupyterLite WebMCP Devpost story. Not her chat messages to agents: those are casual and profane, and are raw material to quote at most, never a style to copy.

- Plain, warm, first person. Says what happened and what she thinks, then stops.
- Opens with the real thing: the news, the claim, or the problem. No windup.
- Short paragraphs of 1-3 sentences. Mixes a short declarative with one longer technical sentence.
- Mechanism over adjectives: what it does, how many, what it replaced. Counts and versions beat "powerful".
- Humor is light and self-aware ("an increasingly ridiculous amount", yak-shaving). One per piece, never a bit.
- Credits people and sources by name, specifically. Links the repo, the demo, the announcement.
- Honest about what is unfinished or what she killed. States tradeoffs without apologizing.
- Invites a concrete next step ("open an issue") instead of a generic "thoughts?".
- Avoid: unicode-bold text (breaks search and screen readers), hashtag walls, emoji bullets, manufactured vulnerability. At most 1-2 emoji on LinkedIn, only where she'd really use one.

Her older blog posts drift toward generic polish ("calm", "home", "nails it", rhythmic triplets). Imitate the specific, concrete posts, not those habits.

## 2. Pick the format, then use its template

Templates with worked skeletons are in `references/templates.md`.

- **Blog post**: answer-first intro (2-3 sentences that stand alone as the answer), definitional sentence for the main entity, H2s phrased as the questions people ask, concrete results with numbers and dates, a short "What I'd do differently", a CTA with a real next step. 800-1,500 words unless the content demands more.
- **LinkedIn post**: hook in the first 2 lines (they sit above "see more"; about 140 characters visible on mobile), one idea, short paragraphs with blank lines, one specific number, a question or CTA, 900-1,500 characters typical. Put the external link in the first comment, and name the artifact in the body so the post stands without it.
- **X thread**: tweet 1 is the claim plus the payoff, 5-9 tweets, one point each, a number or screenshot in most, last tweet restates the claim and links. No "A thread" or numbering filler. Every tweet must survive being quoted alone.
- **Project write-up or announcement**: what it is in one sentence, who it is for, what it does that nothing else does, result with source, link, status and what's next.

## 3. AEO / GEO / SEO checklist

- [ ] Frontmatter `seo.title`, `seo.description`, `description` lengths per CLAUDE.md (validator enforces 120-165 for the shipped description). Write them by hand; do not paste the first paragraph.
- [ ] The first 100 words answer the question the title asks, with the main entity named in full.
- [ ] One definitional sentence: "X is a Y that does Z." (JupyterLite WebMCP is a ..., WebMCP is a proposed web standard that ...).
- [ ] Entities spelled out and consistent: Allison Coleman, JupyterLite, WebMCP, OpenAI WebMCP Challenge, Claude Code. No pronoun-only references to the subject at the top of a section.
- [ ] Real numbers with a source and date, in the sentence that uses them. A claim without a source is cut or softened.
- [ ] H2s as questions where that is natural ("How does X work?"). Each section opens with its answer.
- [ ] Internal links with trailing slash (`/projects/<slug>/`), descriptive anchor text, at least two per post.
- [ ] External links to primary sources (spec, repo, announcement), not roundups.
- [ ] Alt text that describes what the image shows and why it is there; never "screenshot".
- [ ] A short FAQ section only when the questions are real; answers 1-3 sentences, self-contained.
- [ ] No new schema work here: `useSiteSeo` already emits the JSON-LD. Do not hand-write it into Markdown.

## 4. Slop and self-review

The banned list is in `references/slop-list.md` and enforced in `scripts/check-prose.mjs`. The patterns to catch by eye:

- Contrast frames ("not just X, but Y", "it's not X, it's Y"), rhetorical question then answer, "Here's the thing".
- Triplets and lists of three adjectives; every paragraph ending on a punchy aphorism.
- Hollow openers and closers ("In today's...", "In conclusion", "At the end of the day").
- Hedging filler ("it's worth noting", "arguably", "essentially"), intensifiers ("truly", "incredibly").
- Em-dash overuse: target at most 1-2 per 500 words; prefer a period or comma.
- Fake vulnerability ("I'll be honest", "I was terrified") and humblebrag framings.
- Emoji bullets, bold on every other phrase, title-case headings, vague attribution ("experts say").

Review pass before handoff:

1. `pnpm check:prose <file>` and fix every hit, not just the errors.
2. **Read-aloud test**: read each paragraph at speaking pace. If you would not say it to a colleague, rewrite it.
3. **Eye-roll test**: would a senior engineer roll their eyes at any sentence? Cut or make it concrete.
4. **Swap test**: if the sentence could appear in anyone's post about anything, replace it with a detail only this project has.
5. **Fact test**: every number, name and date traces to a repo file, PR, commit, or cited URL.

## 5. Fact and privacy rules

- Only verified facts: repo files, PRs, commits, the Devpost page, official announcements. Cite or link the source. No invented metrics, quotes, timelines, user counts, or feelings.
- If a fact is missing, leave a visible `TODO(allie):` in the draft and list it in the PR. Do not guess.
- Never include: medical details or family health situations (even if she mentioned them elsewhere); employer-internal information, names of internal systems, or work-in-progress at a current employer; money, prize amounts, deal terms; details about partners or family. Violet is "my fiancé", and use they/them only if a pronoun is unavoidable; mention them only if she asked.
- Do not quote her private chat with agents without her say-so. Quoting a message she made public is fine.
- Credit teammates and judges by the names already public in the source. Do not tag people.
- AI assistance: say plainly what agents did when it matters to the story (she does). Do not claim hand-written work that agents wrote.

## 6. Workflow

1. Gather sources first (repo, PRs, Devpost). Read two of her published pieces for calibration.
2. Draft blog posts in `content/blog/<slug>.md` with `published: false`; LinkedIn and X drafts go in the PR body (run `pnpm check:prose` on them via a scratch file).
3. Run `pnpm check:prose`, `pnpm validate:content`, `pnpm content:format`.
4. Open a PR for her to read. Put the LinkedIn and X drafts in the description, a facts-and-sources table, and the open `TODO(allie)` items.
5. **Never publish, merge a `published: true` change, or post anywhere without her explicit OK in chat.**
