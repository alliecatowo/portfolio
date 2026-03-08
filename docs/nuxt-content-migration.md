# Nuxt Content: Self-Hosted Upgrade Notes

## Current State

| Item | Value |
|------|-------|
| Installed version | `@nuxt/content ^3.6.3` |
| Latest stable | `3.12.0` |
| Database backend | Node.js native SQLite (`experimental.nativeSqlite: true`) |
| Content preview | Nuxt Studio cloud (`api.nuxt.studio`) |

## What "Self-Hosted Nuxt Content" Means

In Nuxt Content v3, there are two operational modes:

1. **Cloud-managed** (Nuxt Studio / NuxtHub) — content is synced to Nuxt's hosted infrastructure. Studio provides a live editor UI and git-based deploy previews at a cost.
2. **Self-hosted** — all content is local, database runs on your own server (Node.js SQLite or `better-sqlite3`), no dependency on Nuxt's cloud services.

This repo is **already self-hosted** — the SQLite database is generated locally at build time and the output is static HTML. The `content.preview` block in `nuxt.config.ts` enables optional Studio integration for content editing, but it's not required for the site to function.

## Recommended Upgrade: `^3.6.3` → `3.12.0`

### What Changed in v3.7–3.12

- `experimental.nativeSqlite` is deprecated in favour of `experimental.sqliteConnector: 'native'` (already in config — no breaking change)
- Performance improvements to query planning and collection indexing
- Better HMR stability (fewer database corruption events)
- `z.object` schema improvements in `content.config.ts`
- Zod v4 compatibility (the project already uses `zod ^4.x`)

### Steps to Upgrade

```bash
# 1. Update the package
pnpm add @nuxt/content@latest

# 2. Clean the stale SQLite database
pnpm db:clean

# 3. Verify the dev server starts cleanly
pnpm dev

# 4. Run a full build to confirm no regressions
pnpm build

# 5. Update pnpm lockfile
pnpm lockfile:update
git add package.json pnpm-lock.yaml
git commit -m "chore: upgrade @nuxt/content to 3.12.0"
```

### Config Change (if needed)

If `experimental.nativeSqlite` is removed in a future version, update `nuxt.config.ts`:

```ts
// Before (current — still works in 3.12)
content: {
  experimental: {
    nativeSqlite: true,
    sqliteConnector: 'native'
  }
}

// After (if nativeSqlite key is dropped)
content: {
  experimental: {
    sqliteConnector: 'native'
  }
}
```

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

## Risk Assessment

- **Low risk** — patch/minor version bump within v3
- **No schema changes** required to `content.config.ts`
- **No content file changes** required
- The `.data/content/contents.sqlite` database rebuilds automatically

## References

- [Nuxt Content v3 Docs](https://content.nuxt.com/docs/getting-started/installation)
- [Changelog](https://github.com/nuxt/content/releases)
- [SQLite Connector Docs](https://content.nuxt.com/docs/getting-started/configuration)
