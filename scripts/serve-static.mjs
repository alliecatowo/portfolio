// Serve .output/public the way Firebase Hosting does, without the emulator or Java.
//
//   pnpm generate && pnpm serve:static [--port 5000] [--dir .output/public]
//
// Mirrors the parts of firebase.json that change what a browser sees: bare directory URLs 301 to the
// trailing-slash form, the `redirects` and `headers` blocks apply, gzip/brotli is negotiated, and an
// unknown path returns 404 with the generated 404.html. Function rewrites (Nuxt Studio) are not served.
//
// Also exported as startStaticServer() so scripts/measure-nav.mjs can serve a build on a free port.
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { brotliCompressSync, constants, gzipSync } from 'node:zlib'

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.wasm': 'application/wasm', '.webmanifest': 'application/manifest+json'
}
const COMPRESSIBLE = /^(text\/|application\/(json|xml|manifest\+json)|image\/svg)/

// firebase.json glob ("**", "**/", "**/*.html") to a RegExp over the URL path.
const globToRegExp = glob =>
  new RegExp('^' + glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*\//g, '\0').replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*').replace(/\0/g, '(?:.*/)?') + '$')

export async function startStaticServer({ dir = '.output/public', port = 0, config = 'firebase.json' } = {}) {
  const root = resolve(dir)
  if (!existsSync(join(root, 'index.html'))) throw new Error(`No build in ${root}. Run \`pnpm generate\` first.`)
  const hosting = existsSync(config) ? JSON.parse(readFileSync(config, 'utf8')).hosting || {} : {}
  const headerRules = (hosting.headers || []).map(h => ({ re: globToRegExp(h.source), headers: h.headers }))
  const redirects = (hosting.redirects || []).map(r => ({ re: globToRegExp(r.source), to: r.destination, type: r.type || 301 }))
  const cache = new Map()

  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://x')
    const path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '')
    const redirect = redirects.find(r => r.re.test(path))
    if (redirect) return void res.writeHead(redirect.type, { location: redirect.to }).end()

    let file = join(root, path)
    let status = 200
    const isDir = existsSync(file) && statSync(file).isDirectory()
    if (isDir && !path.endsWith('/')) return void res.writeHead(301, { location: path + '/' + url.search }).end()
    if (isDir) file = join(file, 'index.html')
    if (!existsSync(file)) { file = join(root, '404.html'); status = 404 }

    const type = TYPES[extname(file)] || 'application/octet-stream'
    const headers = { 'content-type': type }
    for (const rule of headerRules) if (rule.re.test(path)) for (const h of rule.headers) headers[h.key.toLowerCase()] = h.value
    const accept = String(req.headers['accept-encoding'] || '')
    const encoding = COMPRESSIBLE.test(type) ? (/\bbr\b/.test(accept) ? 'br' : /\bgzip\b/.test(accept) ? 'gzip' : null) : null
    if (!encoding) {
      res.writeHead(status, { ...headers, 'content-length': statSync(file).size })
      return void (req.method === 'HEAD' ? res.end() : createReadStream(file).pipe(res))
    }
    const key = `${encoding}:${file}`
    if (!cache.has(key)) {
      const body = readFileSync(file)
      cache.set(key, encoding === 'br'
        ? brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } })
        : gzipSync(body))
    }
    const body = cache.get(key)
    res.writeHead(status, { ...headers, 'content-encoding': encoding, vary: 'Accept-Encoding', 'content-length': body.length })
    res.end(req.method === 'HEAD' ? undefined : body)
  })
  await new Promise(done => server.listen(port, '127.0.0.1', done))
  return { server, url: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(done => server.close(done)) }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i > -1 ? process.argv[i + 1] : fallback }
  try {
    const { url } = await startStaticServer({ dir: arg('dir', '.output/public'), port: Number(arg('port', 5000)) })
    console.log(`Serving ${arg('dir', '.output/public')} at ${url} (Ctrl+C to stop)`)
  } catch (e) {
    console.error(e.message)
    process.exit(2)
  }
}
