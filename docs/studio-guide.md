# Nuxt Studio — Editing Guide

Quick reference for editing portfolio content via Studio.

## Local Development (no config needed)

```bash
pnpm dev
```

A floating 🪄 button appears in the bottom-left of your browser. Click it to open Studio.

- Changes are written directly to your local files
- Use your normal `git add / commit / push / PR` workflow to publish

## What You Can Edit

| Section             | Files                      | Editor              |
| ------------------- | -------------------------- | ------------------- |
| Blog posts          | `content/blog/*.md`        | TipTap visual + MDC |
| Projects            | `content/projects/*.md`    | TipTap visual + MDC |
| Home page           | `content/pages/home.yml`   | Form editor         |
| About page          | `content/pages/about.yml`  | Form editor         |
| Navigation / footer | `content/globals/main.yml` | Form editor         |

## Adding a New Blog Post

1. Open Studio → click **New File** in `content/blog/`
2. Name it `your-post-slug.md`
3. Fill out the frontmatter form:
   - `title`, `description`, `date` (YYYY-MM-DD)
   - `category`: `dev` | `tattoo` | `life` | `project`
   - `tags`: array of strings
   - `author`: `Allie`
   - `published`: `false` until ready
   - `featured`: `true` for homepage featured
   - `slug`: URL path (e.g. `why-nuxt-content`)
4. Write in the visual editor
5. Save → commit via git

## Adding a New Project

Same as blog, but in `content/projects/`. Key frontmatter:

- `status`: `published` | `draft`
- `technologies`: array
- `github`: URL (optional)
- `demo`: URL (optional)
- `devpost`: URL (optional)
- `order`: number (optional; ascending, used for homepage ordering)
- `award`: string (optional; rendered as a badge)
- `image` / `imageAlt`: card image and its alt text (optional)

## Production Studio

Go to `https://allisons.dev/_studio` (or press `CMD + .` on any page) and sign in with GitHub. Only the emails in the `STUDIO_GITHUB_MODERATORS` secret can log in. Saving commits to `main`, which redeploys the site in a few minutes.

Studio's server routes run in the `studio` Cloud Function behind Firebase Hosting; see [`STUDIO.md`](../STUDIO.md) for setup. Drafts (`published: false`, `status: draft`) show up in production Studio once you're logged in; they stay out of the public site. A save takes a few minutes to show up in Studio, since every push redeploys the Studio function.

## Keyboard Shortcuts (in Studio editor)

| Action      | Shortcut            |
| ----------- | ------------------- |
| Open Studio | `CMD + .`           |
| Bold        | `CMD + B`           |
| Italic      | `CMD + I`           |
| Heading     | `#` + space         |
| Code block  | ` ``` ` + Enter     |
| Component   | `/` (slash command) |

## Troubleshooting

**Studio button not showing?**

- Make sure `pnpm dev` is running (not `pnpm preview`)
- Studio only loads in dev mode by default

**Content not updating?**

- Run `pnpm db:clean` to clear the SQLite cache
- Restart `pnpm dev`
