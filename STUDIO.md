# Nuxt Studio — Self-Hosted Setup

Portfolio content editing via [nuxt-studio](https://github.com/nuxtlabs/nuxt-studio) (self-hosted, MIT licensed, replaces the deprecated NuxtStudio cloud platform).

---

## Local Development

No configuration required. Studio launches automatically in dev mode.

```bash
pnpm dev
# → Floating 🪄 button appears bottom-left in browser
```

Click the button to open the Studio editor in a side panel. Changes write directly to your local files — use git to commit and push.

---

## Production Setup

Production Studio requires a GitHub OAuth App for authentication.

### 1. Create a GitHub OAuth App

Go to [GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App](https://github.com/settings/applications/new):

| Field | Value |
|-------|-------|
| Application name | `Portfolio Studio` |
| Homepage URL | `https://allisons.dev` |
| Authorization callback URL | `https://allisons.dev/_studio/api/auth/github` |

Copy the **Client ID** and generate a **Client Secret**.

### 2. Set Environment Variables

```bash
# Copy the template
cp .env.example .env

# Fill in your OAuth credentials
STUDIO_GITHUB_CLIENT_ID=your_client_id
STUDIO_GITHUB_CLIENT_SECRET=your_client_secret
```

On Vercel/Netlify: add these as environment variables in the dashboard.

### 3. Deploy with SSR (not static)

Studio requires a live SSR server — it won't work with `nuxt generate` (static export).

```bash
# Build for SSR
pnpm build       # outputs .output/ dir

# Run locally
node .output/server/index.mjs

# Or deploy to Hetzner with PM2
pm2 start ecosystem.config.js
```

The `Dockerfile` (from PR #29) is ready for containerised SSR deploys.

---

## Vercel Deployment

Vercel auto-detects Nuxt SSR. Set the environment variables in the Vercel dashboard and it will work out of the box.

```
Framework Preset: Nuxt.js
Build Command: pnpm build
Output Directory: .output
```

Required env vars in Vercel dashboard:
- `STUDIO_GITHUB_CLIENT_ID`
- `STUDIO_GITHUB_CLIENT_SECRET`

---

## What's Editable in Studio

| Content | Files | Editor type |
|---------|-------|-------------|
| Blog posts | `content/blog/*.md` | Visual (TipTap) + MDC |
| Projects | `content/projects/*.md` | Visual (TipTap) + MDC |
| Home page | `content/pages/home.yml` | Form |
| About page | `content/pages/about.yml` | Form |
| Navigation | `content/globals/main.yml` | Form |

Full editing guide: [`docs/studio-guide.md`](docs/studio-guide.md)

---

## Architecture Notes

```
nuxt.config.ts
├── modules: ['nuxt-studio', '@nuxt/content', ...]
├── studio.repository → alliecatowo/portfolio (main)
└── routeRules
    ├── /_studio/** → SSR only (never pre-rendered)
    ├── /api/_content/** → SSR with cache
    └── /** → prerender: true (static pages)
```

- Static pages (`/**`) are pre-rendered at build time → fast Firebase/CDN delivery
- Studio routes (`/_studio/**`) require an SSR runtime → Hetzner/Vercel/Docker
- CI Firebase deploys use `nuxt generate` → Studio unavailable (intentional; content is read-only in CI)

---

## Linear Tasks

| Task | Status | Description |
|------|--------|-------------|
| ALLIE-160 | ✅ Done | Close stale Oct 2025 PRs (#21-25) |
| ALLIE-161 | ✅ Done | Merge studio waterfall PRs (#26-30) |
| ALLIE-162 | 🔲 Pending | Create GitHub OAuth App + set prod env vars |
| ALLIE-163 | 🔲 Pending | Hetzner/Vercel SSR deployment |
