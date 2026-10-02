---
name: verify-site
description: Verify any allisons.dev portfolio change before merge and after deploy. Use whenever a PR in this repo touches pages, components, content, config, or the build, or when asked to check the site, a preview channel, or production. Covers pnpm checks, static-output checks, serving a build, navigation measurements, and mandatory Claude in Chrome browser checks.
---

# verify-site

Verify locally, in a real browser, and again on production after merge. Run from the PR's worktree (`pnpm worktree <branch>`). If delegated, use a subagent so screenshots and logs stay out of the main context. Workflow rules (preview first, merge policy) are in CLAUDE.md.

## 1. pnpm checks (all must pass)

```bash
pnpm install --frozen-lockfile
pnpm typecheck && pnpm lint
pnpm validate:content && pnpm content:format:check
pnpm generate            # writes .output/public
pnpm check:images        # every pre-rendered /_ipx/ URL exists in the build
pnpm check:seo           # canonical, titles, OG/Twitter, JSON-LD, h1, sitemap and robots against the build
```

If content changed, also `pnpm content:roundtrip`; if WebMCP changed, `pnpm test:webmcp`. A failing `validate:content` means real content is broken: fix the file it names, don't loosen the validator.

## 2. Static output (`.output/public`)

- `check:seo` covers per-page head metadata, JSON-LD, sitemap and robots; also `ls llms.txt 404.html`.
- No placeholder hosts: `grep -rln "picsum.photos\|placehold.co" .output/public app content` must be empty.
- Internal links: every `href="/..."` in the HTML resolves to a file in `.output/public`. External links on changed pages: `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' <url>`; anything but 2xx/3xx is a finding (note bot-blocking 403/429 rather than failing on it).

(CI also runs `check:seo` and Lighthouse CI on every PR; `pnpm lighthouse` runs the latter locally.)

## 3. Serve like production

```bash
pnpm serve:static &  echo $!    # Firebase behaviour on :5000 (trailing-slash 301s, redirects, headers, 404); kill by that PID
pnpm emulate                    # the real Firebase emulator, when you need rewrites too
curl -sI http://127.0.0.1:5000/<route>/        # each changed route; /nope/ must be 404
```

## 4. Navigation and perf measurements (UI or routing changes)

```bash
pnpm measure:nav                            # starts its own server on .output/public
pnpm measure:nav --url <preview-or-prod>    # same against a deployed URL
```

Read the `gap ms` column (positive means the old page sat at the top before the new one painted), `CLS`, and `footer pos` (above 1 means still reflowing). Back navigation should end at its start scroll (`endY`), not 0. Paste the table in the PR. For perf claims add one Lighthouse run, not three.

## 5. Browser checks with Claude in Chrome (mandatory)

Load the `claude-in-chrome` skill, then the tools in one ToolSearch call; open your own tab and close it when done. For every changed route, on the local server and then the PR's preview URL:

1. Screenshots at 375, 768 and 1440 (`resize_window`). If resizing fails, use a headless playwright-core capture with the system Chrome, or iframes at 375 and 768.
2. `read_console_messages`: no errors, no hydration mismatch warnings.
3. `read_network_requests`: no placeholder hosts, no 404s, the LCP hero loads eagerly.
4. Click through: header nav, the Cmd+K search (social links present, drafts absent), changed cards and external links.
5. `gif_creator` for any visible flow change.

## 6. After merge (production)

1. `gh run list --branch main --limit 5`, then `gh run watch <id>` on "Deploy to Production".
2. `curl -sI "https://allisons.dev/<route>/?v=<sha>"` for each changed route: 200 and a fresh `last-modified` (HTML is cached for an hour, hence the query).
3. Repeat the browser checks (section 5, steps 1 to 4) on https://allisons.dev, and `pnpm measure:nav --url https://allisons.dev` for UI changes.
4. `pnpm worktree --remove <branch>`.

## Reporting

Per check: pass or fail, the evidence (output line, screenshot, console or network entry), and anything fixed along the way.
