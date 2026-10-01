import { createError, defineEventHandler, getRequestProtocol, getRouterParam, setHeader, useSession } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

// GET /__nuxt_studio/content/<collection>/sql_dump.txt. Studio function build only: it's
// registered in nuxt.config.ts when NITRO_PRESET=firebase and never exists in the static site.
//
// The public /__nuxt_content/<collection>/sql_dump.txt files come from the static build, which
// leaves drafts out (content.config.ts). Studio's client lists and opens only what is in that
// dump, so the patched @nuxt/content client (patches/@nuxt__content@3.12.0.patch) fetches this route
// instead when the `studio-session-check` cookie is set. The function is built with
// CONTENT_INCLUDE_DRAFTS=true, so its bundled dump has the drafts; this returns it only to a
// logged-in Studio user.
//
// Auth mirrors nuxt-studio's requireStudioAuth (runtime/server/utils/auth.js, not exported):
// the sealed `studio-session` cookie must hold a user. studio-firebase-cookies.ts has already
// unpacked it from `__session` by the time this runs.
const COLLECTIONS = new Set(['blog', 'projects', 'pages', 'globals'])

const notFound = () => createError({ statusCode: 404, statusMessage: 'Not found' })

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'private, no-store')

  const collection = getRouterParam(event, 'collection') ?? ''
  if (!COLLECTIONS.has(collection)) throw notFound()

  const config = useRuntimeConfig(event) as { studio?: { auth?: { sessionSecret?: string } } }
  const password = config.studio?.auth?.sessionSecret
  if (!password) throw notFound()

  const session = await useSession(event, {
    name: 'studio-session',
    password,
    cookie: { secure: getRequestProtocol(event) === 'https', path: '/' }
  })
  if (!session.data?.user) throw notFound()

  // Same source as @nuxt/content's node preset dump handler (presets/node/database-handler.js)
  // @ts-expect-error virtual module aliased by @nuxt/content in the Nitro build
  const dumps = await import('#content/dump') as Record<string, string | undefined>
  const dump = dumps[collection]
  if (!dump) throw notFound()

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return dump
})
