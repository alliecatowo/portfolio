# Nuxt Content: Self-Hosted Upgrade Notes

## Current State

| Item | Value |
|------|-------|
| Installed version | `@nuxt/content ^3.12.0` ✅ (upgraded from 3.6.3) |
| `better-sqlite3` | `^12.6.2` ✅ (upgraded from 12.2.0) |
| Database backend | Node.js native SQLite (`experimental.sqliteConnector: 'native'`) |
| Content preview | `nuxt-studio` 1.4.0 ✅ (self-hosted, replaces cloud `api.nuxt.studio`) |
| Studio route | `/_studio` (requires SSR host in production) |

## Upgrade History

### v3.6.3 → v3.12.0 (completed March 2026)

- Upgraded `@nuxt/content` from `^3.6.3` to `^3.12.0`
- Upgraded `better-sqlite3` from `12.2.0` to `^12.6.2` (peer dependency requirement)
- Removed deprecated `experimental.nativeSqlite: true` — use `sqliteConnector: 'native'` only
- No content schema changes required

### Cloud Studio → Self-Hosted `nuxt-studio` (completed March 2026)

- Installed `nuxt-studio` 1.4.0 (the new open-source module, previously the paid cloud product)
- Removed legacy `content.preview.api: 'https://api.nuxt.studio'` block
- Added `studio` config block with GitHub repository settings
- Removed `nitro.preset: 'static'` — now uses hybrid rendering so Studio can serve `/_studio` via SSR while content pages remain pre-rendered
- **Local dev:** Studio works immediately — click the floating button bottom-left after `pnpm dev`
- **Production:** Requires SSR host + GitHub OAuth app (see Auth Provider Setup below)

## What "Self-Hosted Nuxt Studio" Means

Nuxt Studio was [open-sourced in late 2025](https://content.nuxt.com/blog/studio-oss). The legacy paid cloud platform (`nuxt.studio`) is now the module documentation site. The module runs entirely on your own infrastructure:

- No external Nuxt cloud services required
- TipTap visual editor, Monaco code editor, YAML/JSON form editor
- Git integration — commits directly to GitHub/GitLab from the editor
- Real-time preview of draft changes
- Multi-provider OAuth: GitHub, GitLab, Google

## Config Reference (Current)

```ts
// nuxt.config.ts
modules: ['nuxt-studio'],

content: {
  experimental: {
    sqliteConnector: 'native'
  }
  // Legacy cloud preview removed
},

studio: {
  repository: {
    provider: 'github',
    owner: 'alliecatowo',
    repo: 'portfolio',
    branch: 'main'
  }
},

nitro: {
  // No preset — uses hybrid rendering (node-server default)
  prerender: {
    crawlLinks: true,
    failOnError: false
  }
}
```

## Auth Provider Setup (Production)

Studio requires OAuth to protect `/_studio`. Set up a GitHub OAuth app:

1. Go to GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. **Authorization callback URL:** `https://allisons.dev/_studio/api/auth/github`
3. Add to `.env` (never commit):
   ```env
   STUDIO_GITHUB_CLIENT_ID=<your_client_id>
   STUDIO_GITHUB_CLIENT_SECRET=<your_client_secret>
   ```

See [nuxt.studio/auth-providers](https://nuxt.studio/auth-providers) for full options.

## Deployment Notes

### Development (works today)
```bash
pnpm dev
# Visit http://localhost:3000 — floating Studio button appears bottom-left
```

### Production — SSR required
The `/_studio` route is a server-side endpoint and requires a platform that runs `nuxt build` (not `nuxt generate`). Firebase static hosting alone is **not sufficient** for Studio production access.

Options:
| Platform | Approach |
|----------|----------|
| **Hetzner VPS** (current server) | `nuxt build` + PM2/systemd — simplest path |
| **Firebase** | Cloud Run + Hosting rewrite (future PR) |
| **Railway / Render** | One-click Node.js deploy |

The static `nuxt generate` command still works for Firebase-only deploys — Studio is simply unavailable at `/_studio` in that mode.

## Future Upgrades

- Monitor `@nuxt/content` releases at https://github.com/nuxt/content/releases
- Monitor `nuxt-studio` releases at https://github.com/nuxt-content/nuxt-studio
- Run `pnpm db:clean` after major upgrades to clear stale SQLite

## Risk Assessment

- **Low risk** — module addition only, no content schema changes
- Legacy `preview` block removal has zero production impact (it was cloud-only)
- Studio in dev mode works without any env vars
- Static generate still works for Firebase CI — Studio just requires SSR for prod auth

## References

- [Nuxt Studio Setup Docs](https://nuxt.studio/setup)
- [Studio OSS Announcement](https://content.nuxt.com/blog/studio-oss)
- [Nuxt Content v3 Docs](https://content.nuxt.com/docs/getting-started/installation)
- [SQLite Connector Docs](https://content.nuxt.com/docs/getting-started/configuration)
- [GitHub Repository](https://github.com/nuxt-content/nuxt-studio)
