import { createError, defineEventHandler, getRequestURL } from 'h3'

// Studio function build only (registered in nuxt.config.ts when NITRO_PRESET=firebase).
//
// Firebase Hosting rewrites just /_studio, /__nuxt_studio/** and /sw.js to the `studio`
// function, but the function is also publicly invokable at its own cloudfunctions.net / run.app
// URL. It is built with drafts included, so anything else it could serve there (SSR pages,
// /__nuxt_content/<collection>/sql_dump.txt, the /__nuxt_content/<collection>/query endpoint)
// would leak them. Answer 404 for every path the Hosting rewrites don't cover.
function isStudioPath(path: string) {
  return path === '/_studio'
    || path.startsWith('/_studio/')
    || path.startsWith('/__nuxt_studio/')
    || path === '/sw.js'
}

export default defineEventHandler((event) => {
  if (!isStudioPath(getRequestURL(event).pathname)) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }
})
