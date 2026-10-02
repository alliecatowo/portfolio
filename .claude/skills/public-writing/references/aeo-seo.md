# AEO, GEO and SEO for this site

## What the evidence says (and how hard to lean on it)

- Princeton's GEO paper (Aggarwal et al., KDD 2024) tested nine content tweaks on a 10,000-query benchmark. Adding statistics, citations of credible sources and attributed quotations raised visibility in generated answers by up to about 40 percent relative to baseline. Treat it as a benchmark result, not a guarantee for any engine.
- Google's "AI features and your website" guidance (Search Central, May 2026) says no special markup or rewrite is required for AI Overviews and AI Mode. The basics apply: allow crawling, link pages internally, keep important content as text, match structured data to visible text, write helpful content. No chunking tricks.
- LinkedIn-side numbers (dwell-time thresholds, hook lift percentages, comment multipliers) come from third-party creator analyses, not LinkedIn. Use them as directional guidance. Never cite them as facts in a post.

So the highest-yield moves are real numbers with sources, direct answers, clear naming, and not wasting the reader's time. They are also just good writing.

## Answer-first structure

1. The title states the subject and the outcome. The intro answers it in 2-3 sentences. A model that lifts only that block should give a correct, attributable answer.
2. Define the entity once, early: "WebMCP is a proposed web standard that lets a page register typed tools for an AI agent." Definitions are the most-quoted sentence type.
3. Each H2 is a question a person would type or ask, with the answer in its first sentence, then evidence.
4. Make paragraphs self-contained. No "as mentioned above" and no pronoun that points across a heading.
5. Use a table or numbered list for comparison or procedure. Plain prose otherwise.

## Entities and consistency

- Full name on first mention in each section: Allison Coleman, JupyterLite WebMCP, OpenAI WebMCP Challenge, Devpost, Claude Code, Nuxt Content.
- Spell product names exactly and use the same name for the same thing across the post, title, LinkedIn text and project page.
- Link the first mention of each entity to its primary source (spec, repo, announcement).

## Numbers and sources

- Put the number, unit, date and source in the same sentence: "Nearly 2,500 projects were submitted (OpenAI's announcement, Sept 28)".
- Say how a figure was measured when it is her own (tests passing, tools registered, hours).
- No rounding up, no "dozens" for a known number, no invented before/after.

## Frontmatter and links

- Title, `description` and `seo` fields: lengths and fallbacks are defined in CLAUDE.md and enforced by `pnpm validate:content` and `pnpm check:seo`. Write the description as the answer, not a teaser.
- Internal links use the trailing-slash form. Link each post to the related project page and one related post.
- Images: real alt text (what is shown, one clause), `imageAlt` on project pages, meaningful filenames.
- No schema.org JSON-LD in Markdown; `useSiteSeo` handles it.

## FAQ sections

Only when the questions are real (inbox, issues, comments). Question as H2 or H3, answer in 1-3 sentences, no restating the question inside the answer.

## Technical-blog performance notes

- Lead with the result and the artifact (repo, demo). Engineers decide in the first screen whether it is for them.
- Show the failed approach and why. "What I'd do differently" reads as trust, a victory lap does not.
- Keep code or config snippets short and runnable; link the full source.
- When facts change, update the post and say so at the top with a date.
