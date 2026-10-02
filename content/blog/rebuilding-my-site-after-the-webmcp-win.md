---
title: "If You Give a Mouse a Cookie: Rebuilding allisons.dev"
author: Allison Coleman
category: dev
date: 2026-10-02
description: JupyterLite WebMCP won the OpenAI WebMCP Challenge, so I wanted a blog post. Two days and 61 PRs later, allisons.dev scores 100 on mobile PageSpeed.
featured: false
featured_image: /images/blog/rebuilding-my-site-after-the-webmcp-win/psi-mobile-100.png
ogImage: /images/blog/rebuilding-my-site-after-the-webmcp-win/psi-mobile-100.png
published: false
seo:
  description: "How I rebuilt allisons.dev after JupyterLite WebMCP won the OpenAI WebMCP Challenge: SEO fixes, self-hosted Nuxt Studio, WebMCP tools, and a mobile PageSpeed score of 100."
  title: "If You Give a Mouse a Cookie: Rebuilding allisons.dev"
slug: rebuilding-my-site-after-the-webmcp-win
tags:
  - nuxt
  - webmcp
  - seo
  - performance
  - claude-code
---

If you give a developer a cookie, she will want a glass of milk. In my case the cookie was winning the OpenAI WebMCP Challenge with JupyterLite WebMCP, and the milk turned into a two-day rebuild of allisons.dev. The result is a mobile PageSpeed Insights score of 100 in Performance, Accessibility, Best Practices and SEO, plus 4/4 on Lighthouse's Agentic Browsing checks.

JupyterLite WebMCP is a JupyterLab extension that gives a browser agent 22 tools over a live notebook. You can read about it on [its project page](/projects/jupyterlite-webmcp/). This post is about the site that hosts that page.

![PageSpeed Insights mobile report for allisons.dev showing 100 for Performance, Accessibility, Best Practices and SEO, with Agentic Browsing at 4 of 4](/images/blog/rebuilding-my-site-after-the-webmcp-win/psi-mobile-100.png)

## She wins, so she wants a blog post

Winners were announced on September 28. I wanted my public presence ready, and a blog post about the win was the obvious first thing.

## The blog post needs a site worth reading it on

I audited the site on September 30. It had not been deployed since March 9, and nothing on it mentioned the win.

- The first three featured project cards were random stock photos, not my work.
- `/robots.txt` and `/sitemap.xml` returned the HTML homepage with a 200 status, and so did every missing URL. Google was seeing soft 404s.
- No page had a canonical URL, JSON-LD or Twitter card.
- An old resume PDF was still indexed. Its metadata title was "John Doe's CV", and it carried a phone number.
- `/projects/jupyterlite-webmcp` did not exist.

That was not a site I would post from. So I started fixing it.

## A site people can find needs real SEO

The first PRs on September 30 covered the basics. [PR #33](https://github.com/alliecatowo/portfolio/pull/33) turned on `@nuxtjs/robots` and `@nuxtjs/sitemap`, removed the catch-all rewrite so Firebase serves a real `404.html`, and deleted the resume. [PR #36](https://github.com/alliecatowo/portfolio/pull/36) added canonical URLs, Open Graph and Twitter cards, and JSON-LD.

Every page now calls one composable, `useSiteSeo`, which sets the title, description, canonical, social tags and structured data together. The sitemap includes published posts and projects only, plus four video entries for the projects with a YouTube demo. Draft posts and projects are dropped from the production build, so they never reach the public content dumps.

A later check against production found 42 sitemap URLs. All 42 returned 200 with exactly one canonical, a 120-165 character description and an absolute og\:image.

I verified the domain in Google Search Console, and the sitemap now shows "Success". I set up Bing Webmaster Tools too and submitted URLs there.

## A findable site needs to be editable from her phone

I use Nuxt Studio to edit content in a browser, so I can fix a typo without opening a laptop. I self-host it on a Firebase Cloud Function next to the static site. [PR #54](https://github.com/alliecatowo/portfolio/pull/54) added a 2nd-generation function called `studio`. `firebase.json` rewrites only `/_studio`, `/__nuxt_studio/**` and `/sw.js` to it, and everything else stays static.

Firebase Hosting strips every request cookie except `__session`, which breaks Studio's GitHub login. A small middleware packs Studio's cookies into `__session` on the way out and unpacks them on the way in. When I save in Studio, it commits to `main` with my GitHub token, and the normal deploy runs.

Studio writes back what it has stored, so any formatting difference becomes a noisy diff. I added a content formatter that calls the same functions Studio uses to turn a document back into text ([PR #69](https://github.com/alliecatowo/portfolio/pull/69)). A second check, `pnpm content:roundtrip`, loads every built row and confirms that saving it would reproduce the file ([PR #72](https://github.com/alliecatowo/portfolio/pull/72)). Raw `<video>` tags and `:xx:` patterns in prose failed that check, so videos became an MDC component and `6:32:` style timestamps were rewritten.

## An editable site needs to be fast

The mobile run was on October 2 at 2:19 PM PDT: Lighthouse 13.5.0, an emulated Moto G Power, Slow 4G.

| Metric                                          | Result                |
| ----------------------------------------------- | --------------------- |
| Performance, Accessibility, Best Practices, SEO | 100 / 100 / 100 / 100 |
| First Contentful Paint                          | 1.2 s                 |
| Largest Contentful Paint                        | 1.7 s                 |
| Total Blocking Time                             | 10 ms                 |
| Cumulative Layout Shift                         | 0                     |
| Speed Index                                     | 1.3 s                 |

Desktop is in the 90s, not 100. I am still working on it.

What moved the numbers:

- **Responsive images.** Hand-built `srcset` and `sizes` values with the real slot widths, then 580w and 720w hero variants for phones.
- **Lazy hydration.** Everything below the home page hero is still server-rendered, but it hydrates only when it nears the viewport ([PR #85](https://github.com/alliecatowo/portfolio/pull/85)). That cut desktop Total Blocking Time from 205 ms to 109 ms in local runs with a 4x CPU slowdown.
- **Compositor-only animation.** Decorative motion uses only `transform` and `opacity`, because Lighthouse flags `background-position` and `box-shadow` animations as non-composited.
- **A per-page hash CSP.** Nuxt's inline scripts change on every build, so a build hook adds a Content-Security-Policy meta tag to each page with the SHA-256 of that page's inline scripts.

I also tried things that did not work. Merging JavaScript chunks halved the request count but raised simulated First Contentful Paint from 1.5 s to 1.9 s, so I dropped it. A Cross-Origin-Opener-Policy header cost about 3.5 mobile performance points, so I left it off.

## A fast site shouldn't flicker

On my phone, pages I had already visited felt solid. Pages I had not visited yet flickered, and the footer seemed to jump.

My agent's guess was that lazy hydration was rendering sections empty during navigation, so the footer rose and then got pushed down. We built that fix as a preview. Then a separate read-only agent, given only my screen recording and no hypotheses, diagnosed the problem from real-browser measurements.

Neither guess was the cause. A custom `scrollBehavior` in `app/router.options.ts` scrolled to the top as soon as the new route's code loaded, before the new page had rendered. On a throttled phone the old page sat at the top for 341 to 576 ms before the swap. Nuxt's default waits for the page to finish loading.

[PR #91](https://github.com/alliecatowo/portfolio/pull/91) deleted the file. In the local measurement the gap went from 389-1,211 ms to slightly negative, so the scroll now lands with the swap. I compared both previews on my phone, and the diagnosis-based fix won. The same PR fixed a gradient title painting over the sticky header, the mobile menu's Search button popping in late, and a back link that lost your scroll position and project filter.

## A fast site should be easy for agents to use

A winning WebMCP entry on a site with no WebMCP felt wrong. [WebMCP](https://github.com/webmachinelearning/webmcp) is a proposed web standard that lets a page register tools for an in-browser agent.

[PR #82](https://github.com/alliecatowo/portfolio/pull/82) registers `search_projects`, `get_project`, `list_blog_posts`, `get_contact_info` and `navigate` when the browser supports `document.modelContext`. The contact form is a declarative tool, and an agent can fill it but a person has to press Send. The tools read a prerendered `/webmcp/catalog.json` rather than loading Content's SQLite in the browser.

For agents that do not run in the page, there is a `/llms.txt` and an `ai-catalog.json` under `/.well-known/`. `pnpm test:webmcp` drives real Chrome through every tool and passes 23 checks.

## How did I work with Claude Code?

Claude Code subagents did most of the typing, each in its own worktree, one per branch. That makes 61 merged pull requests since September 30, five of them Dependabot version bumps. PRs get a Firebase preview channel.

CI also runs Lighthouse CI and an SEO check against every PR ([PR #93](https://github.com/alliecatowo/portfolio/pull/93)). Accessibility, Best Practices and SEO below 0.95 fail the build, and Performance below 0.85 warns.

The agents were wrong sometimes, as the flicker shows. They also wrote the audits that told me where the site was weak, and the audits were useful because they were specific.

## And then she writes the blog post

Which brings this back around. The site is ready, and this post is the cookie I wanted in the first place. If you find a bug in it, open an issue on [the portfolio repo](https://github.com/alliecatowo/portfolio). Desktop PageSpeed is 92 and I am still working on it. You can see the rest of what I build on [the projects page](/projects/).
