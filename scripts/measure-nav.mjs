// Client-side navigation timing on a throttled phone: the check for "flicker" and scroll jumps.
//
//   pnpm generate && pnpm measure:nav                      # serves .output/public itself
//   pnpm measure:nav --url https://allisons.dev            # any deployed base (preview channel, prod)
//   pnpm measure:nav --no-throttle --settle 3000 --json out.json
//
// Pixel 7 emulation in the system Chrome (CHROME_PATH overrides /usr/bin/google-chrome), Fast 3G
// (1.6 Mbps down, 750 kbps up, 150 ms RTT) and 4x CPU slowdown. For each navigation it samples
// scrollY, the page <h1> and the footer's document position on every animation frame, then reports:
//   route    ms from the tap to the URL changing
//   swap     ms from the tap to the first frame showing the new page's <h1> (the DOM swap)
//   reset    ms from the tap to the first frame where scrollY hit 0 (the old page jumping to the top)
//   gap      swap - reset. Positive means the OLD page sat at the top before the new one painted
//            (the flicker); negative or "-" is fine. Back navigations should restore scroll, not reset it
//   CLS      layout-shift score accumulated during the navigation
//   footer   distinct document positions the footer took from the DOM swap on (1 = settled at once)
//            and how far it travelled in px afterwards; non-zero means content is still reflowing
//   endY     scrollY once the navigation settled
import { writeFileSync } from 'node:fs'
import { chromium, devices } from 'playwright-core'
import { startStaticServer } from './serve-static.mjs'

const args = process.argv.slice(2)
const flag = name => args.includes(`--${name}`)
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i > -1 ? args[i + 1] : fallback }
const settle = Number(opt('settle', 7000)) // the site prefetches on idle after ~6 s; wait like a real reader would
const throttle = !flag('no-throttle')

let local = null
let base = opt('url')
if (!base) {
  try { local = await startStaticServer() } catch (e) { console.error(e.message); process.exit(2) }
  base = local.url
}
base = base.replace(/\/$/, '')

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] })

async function newPage() {
  const ctx = await browser.newContext({ ...devices['Pixel 7'], colorScheme: 'dark' })
  const page = await ctx.newPage()
  const cdp = await ctx.newCDPSession(page)
  if (throttle) {
    await cdp.send('Network.enable')
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  }
  await page.addInitScript(() => {
    window.__cls = 0
    new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value }).observe({ type: 'layout-shift', buffered: true })
  })
  return { ctx, page }
}

// Start per-frame sampling; returns nothing, read window.__nav afterwards.
const startSampling = page => page.evaluate(() => {
  const heading = () => document.querySelector('main h1, h1')?.textContent?.trim().slice(0, 60) || ''
  const footerY = () => { const f = document.querySelector('footer'); return f ? Math.round(f.getBoundingClientRect().top + scrollY) : null }
  window.__nav = { t0: performance.now(), cls0: window.__cls, frames: [] }
  const tick = () => {
    window.__nav.frames.push({ t: Math.round(performance.now() - window.__nav.t0), y: Math.round(scrollY), h1: heading(), path: location.pathname, footer: footerY() })
    if (window.__nav.frames.length < 900) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})

function summarize(name, beforeY, frames, cls) {
  const first = frames[0]
  const swap = frames.find(f => f.h1 !== first.h1)
  const route = frames.find(f => f.path !== first.path)
  const reset = beforeY > 0 ? frames.find(f => f.y === 0) : null
  const after = swap ? frames.filter(f => f.t >= swap.t && f.footer != null) : []
  const positions = [...new Set(after.map(f => f.footer))]
  const travelled = after.reduce((sum, f, i) => (i ? sum + Math.abs(f.footer - after[i - 1].footer) : 0), 0)
  return {
    name, startY: beforeY, route: route?.t ?? null, swap: swap?.t ?? null, reset: reset?.t ?? null,
    gap: swap && reset ? swap.t - reset.t : null,
    cls: +cls.toFixed(4), frames: frames.filter((f, i) => i === 0 || f.y !== frames[i - 1].y || f.h1 !== frames[i - 1].h1 || f.footer !== frames[i - 1].footer), footerPositions: positions.length, footerTravel: travelled, endY: frames.at(-1).y, to: (route ?? first).path
  }
}

// Load a page, scroll down, then run `action` while sampling.
async function scenario(name, { from, scrollY: y = 0, action, afterLoad }) {
  const { ctx, page } = await newPage()
  try {
    await page.goto(base + from, { waitUntil: 'load' })
    await page.waitForTimeout(settle)
    if (afterLoad) await afterLoad(page)
    if (y) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(800) }
    const target = await action.prepare?.(page)
    const beforeY = await page.evaluate(() => Math.round(scrollY))
    await startSampling(page)
    await action.run(page, target)
    await page.waitForTimeout(5000)
    const { frames, cls0 } = await page.evaluate(() => window.__nav)
    const cls = await page.evaluate(() => window.__cls)
    return summarize(name, beforeY, frames, cls - cls0)
  } catch (e) {
    return { name, error: String(e.message || e).split('\n')[0] }
  } finally {
    await ctx.close()
  }
}

const tapLink = selector => ({
  prepare: async page => { const link = page.locator(selector).first(); await link.scrollIntoViewIfNeeded(); await page.waitForTimeout(500); return link },
  run: (_page, link) => link.tap()
})
const POST = 'main a[href^="/blog/"][href$="/"]:not([href="/blog/"])'

const rows = []
rows.push(await scenario('blog list (scrolled) -> post', { from: '/blog/', scrollY: 1200, action: tapLink(POST) }))
rows.push(await scenario('blog list (scrolled) -> home', { from: '/blog/', scrollY: 1500, action: tapLink('header a[href="/"]') }))
rows.push(await scenario('projects (scrolled) -> project', { from: '/projects/', scrollY: 2500, action: tapLink('main a[href^="/projects/"][href$="/"]:not([href="/projects/"])') }))
// Back: open a post from the scrolled list, then go back and see whether scroll is restored without a jump to the top.
rows.push(await scenario('post -> back to blog list', {
  from: '/blog/', scrollY: 1200,
  action: {
    prepare: async page => { const link = page.locator(POST).first(); await link.scrollIntoViewIfNeeded(); await link.tap(); await page.waitForURL(/\/blog\/.+\//); await page.waitForTimeout(3000) },
    run: page => page.goBack()
  }
}))

await browser.close()
if (local) await local.close()

const fmt = v => (v == null ? '-' : String(v))
const cols = [['scenario', 'name'], ['startY', 'startY'], ['route ms', 'route'], ['swap ms', 'swap'], ['reset ms', 'reset'], ['gap ms', 'gap'], ['CLS', 'cls'], ['footer pos', 'footerPositions'], ['footer px', 'footerTravel'], ['endY', 'endY']]
const table = rows.map(r => cols.map(([, k]) => (r.error && k !== 'name' ? (k === 'startY' ? `ERROR: ${r.error}` : '') : fmt(r[k]))))
const widths = cols.map(([h], i) => Math.max(h.length, ...table.map(t => t[i].length)))
const line = cells => cells.map((c, i) => (i === 0 ? c.padEnd(widths[i]) : c.padStart(widths[i]))).join('  ')
console.log(`measure:nav  ${base}  Pixel 7, ${throttle ? 'Fast 3G + 4x CPU' : 'unthrottled'}, settle ${settle} ms`)
console.log(line(cols.map(([h]) => h)))
console.log(widths.map(w => '-'.repeat(w)).join('  '))
for (const t of table) console.log(line(t))
console.log('\ngap > 0: the old page sat at the top before the new one painted. footer pos > 1: the footer was still moving after the swap.')

const jsonPath = opt('json')
if (jsonPath) writeFileSync(jsonPath, JSON.stringify({ base, throttle, settle, rows }, null, 2)) // rows[].frames: every frame where scrollY, <h1> or footer position changed
if (rows.some(r => r.error)) process.exit(1)
