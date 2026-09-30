---
name: verify-site
description: Verify any allisons.dev portfolio change before merge and after deploy. Use whenever a PR in this repo touches pages, components, content, config, or the build, or when asked to check the site, a preview channel, or production. Covers pnpm checks, static-output checks, local Firebase emulation, and mandatory Claude in Chrome browser checks.
---

# verify-site

Every PR is verified locally, in a real browser, and again on production after merge. Run from the PR's worktree. If verification is delegated, use a subagent so screenshots and logs stay out of the main context.

## 0. Worktree and toolchain

- One worktree per branch under `.claude/worktrees/<branch-with-dashes>` (gitignored):
  `git fetch origin && git worktree add .claude/worktrees/<branch-with-dashes> -b <branch> origin/main`
- Always pnpm, never npm. pnpm is pinned to 10 (`mise.toml`, `packageManager`). If `pnpm --version` reports 11, stop and fix the toolchain (`mise install`).

## 1. pnpm checks (all must pass)

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm generate        # writes .output/public
```

## 2. Static output checks (`.output/public`)

```bash
cd .output/public
# crawl files (once they exist; after the SEO PR they are required)
ls robots.txt sitemap.xml 404.html 2>&1
# no remote placeholder images anywhere
grep -rln "picsum.photos\|placehold.co" . ../../app ../../content && echo "FAIL: placeholder hosts"
# head metadata per page: expect exactly 1 canonical, og:image absolute, twitter tags, parseable JSON-LD
for f in $(find . -name index.html); do
  printf '%s canonical=%s og=%s twitter=%s ld=%s\n' "$f" \
    "$(grep -o 'rel="canonical"' "$f" | wc -l)" \
    "$(grep -o 'property="og:image"' "$f" | wc -l)" \
    "$(grep -o 'name="twitter:' "$f" | wc -l)" \
    "$(grep -o 'application/ld+json' "$f" | wc -l)"
done
```

- Internal links: extract every `href="/..."` from the HTML files and confirm each resolves to a file in `.output/public` (`<path>/index.html`, `<path>.html`, or a static asset). Report any that do not.
- External links on changed pages: `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' <url>` (fall back to GET when HEAD is rejected). Anything other than 2xx/3xx is a finding; note sites that block bots (403/429) rather than failing on them.
- Validate any JSON-LD block with `python3 -m json.tool` or `node -e 'JSON.parse(...)'`.

## 3. Serve like production

```bash
pnpm emulate          # generate + Firebase hosting emulator at http://127.0.0.1:5000
# fallback if the emulator is unavailable (no Firebase rewrites/headers; less faithful)
pnpm dlx serve .output/public -l 5000
```

Quick HTTP checks: `curl -sI http://127.0.0.1:5000/<route>/` for each changed route; `curl -sI http://127.0.0.1:5000/nope/` should be 404 once real 404 handling exists.

## 4. Browser checks with Claude in Chrome (mandatory)

Load the `claude-in-chrome` skill first, and load the Chrome tools in one ToolSearch call (navigate, computer, resize_window, read_page, read_console_messages, read_network_requests, gif_creator, tabs_create_mcp, tabs_context_mcp).

For every changed route, against http://127.0.0.1:5000 and then the PR's Firebase preview channel URL (posted on the PR by CI):

1. **Screenshots at 375, 768 and 1440 widths** (`resize_window`, then a screenshot). Attach or describe them in the PR description.
2. **Console:** `read_console_messages` must show no errors and no hydration mismatch warnings.
3. **Network:** `read_network_requests` must show no requests to `picsum.photos` or `placehold.co`, no 404s, and the LCP hero image loading eagerly.
4. **Click-through:** header nav, the ⌘K search (social links present, drafts absent), each project card on changed pages, and the external links on changed pages.
5. **GIF:** record a `gif_creator` capture for any visible flow change (for example the homepage 30-second read).

## 5. After merge (production)

1. `gh run list --branch main --limit 5` and `gh run watch <id>` for "Deploy to Production"; it must succeed.
2. `curl -sI https://allisons.dev/<changed-route>/` for each changed route: 200 and a fresh `last-modified`.
3. Repeat the browser checks (section 4, steps 1 to 4) on https://allisons.dev for the changed routes.
4. Remove the worktree: `git worktree remove .claude/worktrees/<branch-with-dashes>`, then `git pull` on main.

## Commit and PR conventions

- Commits: conventional-commit subject + blank line + a short description body. No `Co-Authored-By` trailer.
- PRs: conventional title and a real description (what, why, how verified, screenshots). No "Generated with Claude Code" footer.
- Never commit research artifacts: `.claude/project-dossiers/`, `.claude/build-logs/`, `.claude/site-launch-plan.md`, `.claude/settings.local.json`. Only `.claude/skills/` is committed.
- Do not merge without green CI. `gh pr checks --watch`, then `gh pr merge --squash --delete-branch`.

## Reporting

Report per check: pass/fail, the evidence (command output line, screenshot, console or network entry), and anything fixed along the way.
