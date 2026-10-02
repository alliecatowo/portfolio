// End-to-end check of the site's WebMCP tools in a real Chrome with WebMCP switched on.
//
//   pnpm generate && pnpm test:webmcp
//
// Serves .output/public, launches Chrome with --enable-features=WebMCPTesting (needs Chrome 149+;
// set CHROME_PATH if it isn't at /usr/bin/google-chrome), then calls every tool through the browser's
// own document.modelContext.getTools()/executeTool(), the way an agent would. Per Chrome's current
// implementation, arguments go in as a JSON string and the result comes back as a JSON string
// (see jupyterlite-web-mcp/docs/webmcp-compatibility.md).
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright-core'

const ROOT = join(process.cwd(), '.output/public')
if (!existsSync(join(ROOT, 'index.html'))) {
  console.error('No .output/public build found. Run `pnpm generate` first.')
  process.exit(2)
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2' }
const server = createServer((req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '')
  let file = join(ROOT, path)
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
  if (!existsSync(file)) { res.writeHead(404).end('not found'); return }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' })
  createReadStream(file).pipe(res)
})
await new Promise(r => server.listen(0, '127.0.0.1', r))
const BASE = `http://127.0.0.1:${server.address().port}`

let failed = 0
const check = (name, ok, extra = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`)
  if (!ok) failed++
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--enable-features=WebMCPTesting']
})
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  await page.goto(`${BASE}/`)

  const supported = await page.evaluate(() => !!document.modelContext)
  check('document.modelContext exists (WebMCP enabled)', supported)
  if (!supported) throw new Error('This Chrome has no WebMCP. Need Chrome 149+ with --enable-features=WebMCPTesting.')

  // Registration is deferred to idle time
  await page.evaluate(async () => {
    for (let i = 0; i < 100; i++) {
      if ((await document.modelContext.getTools()).length >= 5) return
      await new Promise(r => setTimeout(r, 100))
    }
  })

  // getTools() returns schemas as JSON strings in Chrome; run an agent-style call
  const run = (name, args) => page.evaluate(async ([n, a]) => {
    const tools = await document.modelContext.getTools()
    const tool = tools.find(t => t.name === n)
    if (!tool) return { missing: true }
    const raw = await document.modelContext.executeTool(tool, JSON.stringify(a))
    return JSON.parse(raw)
  }, [name, args])
  const payload = r => r.structuredContent ?? JSON.parse(r.content[0].text)

  const tools = await page.evaluate(async () => (await document.modelContext.getTools()).map(t => ({
    name: t.name,
    readOnly: t.annotations?.readOnlyHint,
    schema: typeof t.inputSchema === 'string' ? JSON.parse(t.inputSchema) : t.inputSchema
  })))
  const names = tools.map(t => t.name).sort()
  const expected = ['get_contact_info', 'get_project', 'list_blog_posts', 'navigate', 'search_projects']
  check('registers the five imperative tools', expected.every(n => names.includes(n)), names.join(', '))
  for (const t of tools.filter(t => expected.includes(t.name))) {
    const props = Object.keys(t.schema?.properties ?? {})
    check(`${t.name}: input schema is an object schema, required ⊆ properties`,
      t.schema?.type === 'object' && (t.schema.required ?? []).every(r => props.includes(r)))
  }

  let r = payload(await run('search_projects', { query: 'webmcp' }))
  check('search_projects "webmcp" finds jupyterlite-webmcp', r.projects.some(p => p.slug === 'jupyterlite-webmcp' && p.url.startsWith('https://allisons.dev/projects/')), `${r.count} results`)
  r = payload(await run('search_projects', { query: '', group: 'hardware-homelab' }))
  check('search_projects group filter', r.count > 0 && r.projects.every(p => p.group === 'hardware-homelab'), `${r.count} results`)
  r = payload(await run('search_projects', { query: 'zzzz-no-such-thing' }))
  check('search_projects no match returns empty', r.count === 0)

  const jl = payload(await run('get_project', { slug: 'jupyterlite-webmcp' })).project
  check('get_project returns summary and links', jl.title && jl.description && jl.github?.startsWith('https://github.com/') && jl.url.endsWith('/projects/jupyterlite-webmcp/'))
  const missing = await run('get_project', { slug: 'definitely-not-a-project' })
  check('get_project unknown slug is an error with suggestions', missing.isError === true && Array.isArray(payload(missing).availableSlugs))

  r = payload(await run('list_blog_posts', {}))
  check('list_blog_posts returns published posts', r.count > 0 && r.posts.every(p => /^\d{4}-\d{2}-\d{2}$/.test(p.date) && p.url.includes('/blog/')), `${r.count} posts`)

  r = payload(await run('get_contact_info', {}))
  check('get_contact_info', r.emailLink === 'mailto:me@allisons.dev' && r.linkedin === 'https://linkedin.com/in/allie-cat' && r.github === 'https://github.com/alliecatowo' && r.x === 'https://x.com/AllieCatOwO')

  for (const bad of ['https://evil.example/', '//evil.example/', 'javascript:alert(1)']) {
    const res = await run('navigate', { path: bad })
    check(`navigate rejects ${bad}`, res.isError === true)
  }
  check('navigate rejects unknown route', (await run('navigate', { path: '/no-such-page-xyz/' })).isError === true)
  const nav = await run('navigate', { path: '/contact/' })
  await page.waitForURL('**/contact/', { timeout: 5000 }).catch(() => {})
  check('navigate /contact/ client-side', !nav.isError && page.url().endsWith('/contact/'), page.url())

  // Declarative form tool on the contact page
  await page.waitForTimeout(500)
  const form = await page.evaluate(() => {
    const f = document.querySelector('form[toolname]')
    return f && {
      toolname: f.getAttribute('toolname'),
      description: !!f.getAttribute('tooldescription'),
      autosubmit: f.hasAttribute('toolautosubmit'),
      fields: [...f.querySelectorAll('[name]')].map(i => ({ name: i.name, described: !!i.getAttribute('toolparamdescription') }))
    }
  })
  check('contact form is a declarative tool without toolautosubmit', form?.toolname === 'send_message' && form.description && !form.autosubmit)
  check('every contact form field has a description', form?.fields.length === 4 && form.fields.every(f => f.described), form?.fields.map(f => f.name).join(','))
  const declared = await page.evaluate(async () => (await document.modelContext.getTools()).map(t => t.name))
  check('declarative send_message is visible to getTools()', declared.includes('send_message'), declared.join(', '))

  check('no page errors', errors.length === 0, errors.join(' | '))
} catch (err) {
  failed++
  console.error(err)
} finally {
  await browser.close()
  server.close()
}
console.log(failed ? `\n${failed} check(s) failed` : '\nAll WebMCP checks passed')
process.exit(failed ? 1 : 0)
