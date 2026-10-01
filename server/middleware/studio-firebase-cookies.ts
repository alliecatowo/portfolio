import type { IncomingMessage, OutgoingHttpHeader, OutgoingHttpHeaders, ServerResponse } from 'node:http'
import { defineEventHandler, getRequestProtocol, parseCookies } from 'h3'

// Firebase Hosting strips every cookie except `__session` from requests it rewrites to a
// Cloud Function (https://firebase.google.com/docs/hosting/manage-cache#using_cookies).
// Nuxt Studio's auth flow relies on its own cookies (OAuth state, PKCE, redirect, sealed
// session), so on the Studio function we:
//   - unpack `__session` (a base64url JSON map of name -> encoded value) back into the
//     request's Cookie header before Studio's handlers read it, and
//   - repack every `studio-*` Set-Cookie into a single `__session` cookie on the way out.
// `studio-session-check` is also sent as a normal cookie: Studio's client plugin reads it
// from document.cookie to decide whether to fetch the session.
//
// Firebase Hosting also calls the function with the function's own Host header, so the
// original host comes from X-Forwarded-Host. Studio derives the OAuth redirect_uri from the
// request host, so restore it here (this keeps preview channels on their own origin too).
//
// Only active in the Studio function build (runtimeConfig.studioFirebaseCookies, set when
// NITRO_PRESET=firebase); a no-op in dev and every other build.

const PACKED = '__session'
const PASSTHROUGH = new Set(['studio-session-check'])
const isStudioCookie = (name: string) => name.startsWith('studio-')

type Bag = Map<string, string>

function decodeBag(raw: string | undefined): Bag {
  if (!raw) return new Map()
  try {
    const parsed = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'))
    return new Map(parsed && typeof parsed === 'object' ? Object.entries(parsed as Record<string, string>) : [])
  } catch {
    return new Map()
  }
}

const encodeBag = (bag: Bag) => Buffer.from(JSON.stringify(Object.fromEntries(bag)), 'utf8').toString('base64url')

// Parses one Set-Cookie string into its name, raw (still encoded) value and whether it deletes.
function parseSetCookie(header: string) {
  const [pair = '', ...attrs] = header.split(';')
  const eq = pair.indexOf('=')
  const name = pair.slice(0, eq).trim()
  const value = pair.slice(eq + 1).trim()
  const deletes = value === '' || attrs.some((attr) => {
    const [key = '', val = ''] = attr.split('=').map(s => s.trim())
    if (key.toLowerCase() === 'max-age') return Number(val) <= 0
    if (key.toLowerCase() === 'expires') return new Date(val).getTime() <= Date.now()
    return false
  })
  return { name, value, deletes }
}

export default defineEventHandler((event) => {
  if (!useRuntimeConfig(event).studioFirebaseCookies) return

  const req: IncomingMessage = event.node.req
  const res: ServerResponse = event.node.res

  const forwardedHost = req.headers['x-forwarded-host']
  if (typeof forwardedHost === 'string' && forwardedHost) {
    req.headers.host = forwardedHost.split(',')[0]!.trim()
  }

  const cookies = parseCookies(event)
  const bag = decodeBag(cookies[PACKED])
  const injected = [...bag]
    .filter(([name]) => !(name in cookies))
    .map(([name, value]) => `${name}=${value}`)
  if (injected.length) {
    req.headers.cookie = [req.headers.cookie, ...injected].filter(Boolean).join('; ')
  }

  const secure = getRequestProtocol(event) === 'https'
  const originalWriteHead = res.writeHead
  let done = false

  // writeHead runs for explicit and implicit (res.end) header flushes alike.
  res.writeHead = function (this: ServerResponse, ...args: unknown[]) {
    if (!done) {
      done = true
      const current = res.getHeader('set-cookie')
      const list = current === undefined ? [] : Array.isArray(current) ? current : [String(current)]
      const kept: string[] = []
      let changed = false
      for (const header of list) {
        const { name, value, deletes } = parseSetCookie(header)
        if (!isStudioCookie(name)) {
          kept.push(header)
          continue
        }
        changed = true
        if (deletes) bag.delete(name)
        else bag.set(name, value)
        if (PASSTHROUGH.has(name)) kept.push(header)
      }
      if (changed) {
        const attrs = `Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`
        kept.push(bag.size
          ? `${PACKED}=${encodeBag(bag)}; ${attrs}`
          : `${PACKED}=; Max-Age=0; ${attrs}`)
        res.setHeader('set-cookie', kept)
      }
    }
    return (originalWriteHead as (...a: unknown[]) => ServerResponse).apply(this, args as [number, OutgoingHttpHeaders | OutgoingHttpHeader[]])
  } as typeof res.writeHead
})
