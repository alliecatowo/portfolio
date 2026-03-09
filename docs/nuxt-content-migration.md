# Nuxt Content: Self-Hosted Upgrade Notes

## Current State

| Item | Value |
|------|-------|
| Installed version | `@nuxt/content ^3.12.0` ✅ (upgraded from 3.6.3) |
| `better-sqlite3` | `^12.6.2` ✅ (upgraded from 12.2.0) |
| Database backend | Node.js native SQLite (`experimental.sqliteConnector: 'native'`) |
| Content preview | Nuxt Studio cloud (`api.nuxt.studio`) |

## Upgrade History

### v3.6.3 → v3.12.0 (completed March 2026)

- Upgraded `@nuxt/content` from `^3.6.3` to `^3.12.0`
- Upgraded `better-sqlite3` from `12.2.0` to `^12.6.2` (peer dependency requirement)
- Removed deprecated `experimental.nativeSqlite: true` — use `sqliteConnector: 'native'` only
- No content schema changes required

## What "Self-Hosted Nuxt Content" Means

In Nuxt Content v3, there are two operational modes:

1. **Cloud-managed** (Nuxt Studio / NuxtHub) — content is synced to Nuxt's hosted infrastructure. Studio provides a live editor UI and git-based deploy previews at a cost.
2. **Self-hosted** — all content is local, database runs on your own server (Node.js SQLite or `better-sqlite3`), no dependency on Nuxt's cloud services.

This repo is **already self-hosted** — the SQLite database is generated locally at build time and the output is static HTML. The `content.preview` block in `nuxt.config.ts` enables optional Studio integration for content editing, but it's not required for the site to function.

## Config Reference (Current)

```ts
// nuxt.config.ts
content: {
  experimental: {
    // Use sqliteConnector only — nativeSqlite was removed as deprecated
    sqliteConnector: 'native'
  },
  preview: {
    api: 'https://api.nuxt.studio',
    gitInfo: { ... }  // optional Studio integration
  }
}
```

## Next Steps

### Removing Nuxt Studio Dependency (Optional)

To fully decouple from cloud content preview, remove the `preview` block from `nuxt.config.ts`:

```ts
// Remove this block to go fully self-hosted:
content: {
  preview: {
    api: 'https://api.nuxt.studio',
    gitInfo: { ... }
  }
}
```

This has no impact on the production site — it only disables the Studio live editor integration.

### Future Upgrades

- Monitor `@nuxt/content` releases at https://github.com/nuxt/content/releases
- Run `pnpm db:clean` after major upgrades to clear stale SQLite

## Risk Assessment

- **Low risk** — patch/minor version bump within v3
- **No schema changes** required to `content.config.ts`
- **No content file changes** required
- The `.data/content/contents.sqlite` database rebuilds automatically

## References

- [Nuxt Content v3 Docs](https://content.nuxt.com/docs/getting-started/installation)
- [Changelog](https://github.com/nuxt/content/releases)
- [SQLite Connector Docs](https://content.nuxt.com/docs/getting-started/configuration)
