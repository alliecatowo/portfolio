# Nuxt Studio

Content editing via [nuxt-studio](https://github.com/nuxt-content/nuxt-studio) 1.7 (self-hosted, MIT). Studio runs in the browser: it reads the site's content from the published `/__nuxt_content/<collection>/sql_dump.txt` files and commits edits straight to `alliecatowo/portfolio` on `main` with the editor's own GitHub OAuth token. A `main` push then redeploys the site like any other commit.

## Local development

```bash
pnpm dev
# Floating Studio button bottom-left; edits write to local files, commit with git
```

## Production: Firebase Hosting + a `studio` Cloud Function

The public site stays a static `nuxt generate` build on Firebase Hosting. Studio's server routes run in one 2nd-gen Cloud Function named `studio` (us-central1, 512 MiB, max 2 instances, scales to zero). `firebase.json` rewrites only these to it:

| Route               | What it does                                                                    |
| ------------------- | ------------------------------------------------------------------------------- |
| `/_studio`          | Entry point (Cmd + `.` anywhere on the site goes to `/_studio?redirect=<path>`) |
| `/__nuxt_studio/**` | GitHub OAuth (`/auth/github`), session, editor meta, media/ipx                  |
| `/sw.js`            | Studio's service worker                                                         |

`pnpm build:studio` (`NITRO_PRESET=firebase nuxt build`) builds the function into `.output-studio/` with prerendering off. The Deploy to Production workflow builds it, writes its runtime `.env` from GitHub secrets, deploys it, then deploys Hosting. PR previews and staging deploy Hosting only; their Studio routes hit the live function.

### The `__session` cookie workaround

Firebase Hosting strips every request cookie except `__session` before calling a function. Studio uses its own cookies (`studio-oauth-state`, `studio-redirect`, `studio-session`, ...), so `server/middleware/studio-firebase-cookies.ts` packs all `studio-*` Set-Cookies into one `__session` cookie (base64url JSON) and unpacks them into the request's Cookie header. `studio-session-check` is also sent as a normal cookie because Studio's client reads it from `document.cookie`. The middleware also restores the original host from `X-Forwarded-Host`, so the OAuth `redirect_uri` uses the host the browser is on. It only runs in the function build (`runtimeConfig.studioFirebaseCookies`).

### Configuration

GitHub Actions secrets (repo level):

| Secret                        | Use                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `STUDIO_GITHUB_CLIENT_ID`     | GitHub OAuth App client ID (build + runtime)                                     |
| `STUDIO_GITHUB_CLIENT_SECRET` | OAuth App client secret (build + runtime)                                        |
| `STUDIO_GITHUB_MODERATORS`    | Comma-separated GitHub emails allowed to log in (Allison's primary GitHub email) |

nuxt-studio reads `STUDIO_GITHUB_*` names, not the `NUXT_STUDIO_AUTH_GITHUB_*` names shown on nuxt.studio/setup. Each deploy also generates a random `NUXT_STUDIO_AUTH_SESSION_SECRET`, so you log in again after a deploy.

GitHub OAuth App (Settings → Developer settings → OAuth Apps):

- Homepage URL: `https://allisons.dev`
- Authorization callback URL: `https://allisons.dev/__nuxt_studio/auth/github`

An OAuth App has a single callback URL and GitHub requires the `redirect_uri` host to match it, so login only completes on allisons.dev. To test login on a PR preview channel, temporarily set the callback to `https://<preview-channel-host>/__nuxt_studio/auth/github`, then set it back.

`repository.private: false` in `nuxt.config.ts` makes Studio request the `public_repo` scope instead of full `repo`.

### Drafts

Drafts (`published: false` posts, `status: draft` projects) stay out of production builds, so the public SQL dumps Studio edits from don't contain them and Studio can't see them. Edit drafts locally with `pnpm dev`, or publish them first. Don't set `CONTENT_INCLUDE_DRAFTS=true` for the static build: that publishes every draft body in `sql_dump.txt`.

### One-time Google Cloud setup

The project must be on Blaze. Before the first function deploy:

```bash
# First deploy (enables Cloud Functions, Cloud Build, Artifact Registry, Run, Eventarc APIs)
pnpm dlx firebase-tools deploy --only functions:studio --project allie-portfolio-project
# Delete old function images after 1 day so Artifact Registry storage doesn't accrue
pnpm dlx firebase-tools functions:artifacts:setpolicy --location us-central1 --days 1 --project allie-portfolio-project
```

The CI service account behind `FIREBASE_SERVICE_ACCOUNT_ALLIE_PORTFOLIO_PROJECT` needs `Cloud Functions Developer` and `Service Account User` (on the default compute service account) on top of its Hosting roles to deploy the function.

### Local emulation

```bash
pnpm generate && pnpm build:studio
(cd .output-studio/server && pnpm install --prod)   # the emulator needs full firebase-functions
printf 'STUDIO_GITHUB_CLIENT_ID=...\nSTUDIO_GITHUB_CLIENT_SECRET=...\n' > .output-studio/server/.env
pnpm dlx firebase-tools emulators:start --only hosting,functions --project demo-portfolio
# http://127.0.0.1:5000/_studio?redirect=/
```

### Costs

Studio is a handful of requests per editing session, well inside the Cloud Functions/Run free tier (2M requests, 180k vCPU-s, 360k GiB-s a month). The likely charges are Artifact Registry storage for function images (kept small by the cleanup policy) and Cloud Build minutes (2,500 free a month).

### Security notes

- `/__nuxt_studio/auth/session` returns the GitHub token to page JavaScript (that's how Studio commits), so an XSS bug on the site would expose repo write access.
- Login is limited to `STUDIO_GITHUB_MODERATORS`; everyone else gets a 403 after the GitHub step.
- The client secret is a plain environment variable on the function (visible to project members in the Cloud console).

## What's editable

| Content            | Files                   | Editor                |
| ------------------ | ----------------------- | --------------------- |
| Blog posts         | `content/blog/*.md`     | Visual (TipTap) + MDC |
| Projects           | `content/projects/*.md` | Visual (TipTap) + MDC |
| Home / About       | `content/pages/*.yml`   | Form                  |
| Navigation, footer | `content/globals/*.yml` | Form                  |

Editing guide: [`docs/studio-guide.md`](docs/studio-guide.md)
