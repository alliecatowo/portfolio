# Voice profile

Derived on 2026-10-02 from: her public LinkedIn posts (profile linkedin.com/in/allie-cat, five most recent posts, read-only), her four published blog posts in `content/blog/`, and the JupyterLite WebMCP Devpost story. Patterns are described, not copied. Short quoted fragments are only there to anchor a pattern.

Her chat style with agents (lowercase, fast, profane, typo-tolerant, thinking out loud) is source material for stories, not a template. Her public voice is edited, warm and specific.

## Patterns

| Trait                     | What she does                                                                                                                                                                    | Rule for drafts                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Openers                   | Leads with the news or the feeling in one plain sentence ("Still kind of processing this:", "Some belated (but very exciting) news:"), then says what the thing is.              | First sentence is the news, claim, or problem. No scene-setting, no question hook unless the question is the real problem. |
| Sentence length           | Mostly 10-25 words. Short declaratives next to one long technical sentence. In the Devpost story, short statements of constraint ("There is no backend holding it").             | Vary length. Keep most sentences under 25 words.                                                                           |
| Paragraphs                | 1-3 sentences on LinkedIn; blog paragraphs 2-4 sentences.                                                                                                                        | Never a wall of text. One idea per paragraph.                                                                              |
| Specificity               | Names the tools (FastAPI, Qdrant, Ollama, Nuxt, QuickSync), the counts (22 tools, 7 plugins), versions, hardware, bitrates, upload speeds.                                       | Replace every adjective that could be a number or a noun.                                                                  |
| Mechanism                 | Explains why it works the way it does, usually through a constraint ("the state exists only in the tab").                                                                        | Lead with the constraint, then the design.                                                                                 |
| Humor                     | Light, parenthetical or aside ("an increasingly ridiculous amount", "yak-shaving", "TLC"). Self-aware, never at others' expense.                                                 | At most one aside per piece. Cut it if it needs setting up.                                                                |
| Credit                    | Thanks named people and organizations for specific help (a collaborator, the organizers, a former team). Credits other reviewers fairly even when their ranking cut against her. | Name who did what, once, specifically. No blanket "thanks to everyone".                                                    |
| Honesty about status      | Says it is early alpha, that the repo needs TLC, that she shelved a finished project because it was only a wrapper.                                                              | State limits and what was cut. This is her best credibility signal.                                                        |
| Calls to action           | Concrete: open an issue, see the source, read the announcement. Labels each link. Sometimes signs "- Allie".                                                                     | One real CTA. Links labelled by what they are.                                                                             |
| Origin stories            | Projects start from a real person's problem or her own workflow, told in two sentences.                                                                                          | Use only if a source confirms it; keep family detail minimal and public-only.                                              |
| Emoji                     | Present on LinkedIn (trophy, party, a few link markers). Absent in blog and Devpost.                                                                                             | At most 1-2 on LinkedIn, none on blog or X unless she asks.                                                                |
| Formatting habits to drop | Unicode bold lettering, long hashtag blocks, bullet lists with bold lead-ins on every item (her older LinkedIn and blog posts).                                                  | Do not reproduce. Plain text on LinkedIn; real Markdown headings on the blog.                                              |

## Recurring themes

- Agents working inside the thing a person is already using, not a copy of it (WebMCP, JupyterLite, "the human always wins a conflict").
- Local-first, self-hosted, open and accessible tooling; small teams and individuals over gatekeeping.
- Developer experience and calm codebases; owning your infrastructure and content.
- Building fast with agents and being transparent about it; process as story (specs, contracts, concurrency, shelving ideas).
- Ergonomics and craft (split keyboards, a pink Sofle with OLEDs). The personal side is allowed when it is about the work and hobbies, not health or family.

## What she avoids

- Hype words and thought-leader cadence. No "game-changer", no "unlock".
- Claiming credit that belongs to others or to agents.
- Over-explaining her own feelings; one honest line is enough, and sensitive personal circumstances stay out of drafts.

## Weaknesses in the existing posts (do not imitate)

The 2025 blog posts (Vue vs React, Nuxt Content, Hetzner, split keyboards) are warm and concrete where they name hardware, prices and tradeoffs, and generic where they say a stack "feels calm" or "nails it". They also lean on rhythmic triplets ("No context switches, no brittle webforms, no ...") and aphoristic closers. Keep the first kind of sentence and cut the second.

## Calibration sentences (write like these, with your own facts)

- "I found the challenge on day 7 of 10." Time-stamped, plain, no flourish.
- "If a regular MCP server can do the job, WebMCP is just a wrapper." A claim with its reason, one line.
- "The repo could use some TLC, so feel free to open an issue." Invitation plus honest status.
