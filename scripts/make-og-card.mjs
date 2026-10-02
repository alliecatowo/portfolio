// Renders a 1200x630 share card from an image under public/.
//
//   node scripts/make-og-card.mjs <public-relative source> <name> [cover|contain] [position]
//   node scripts/make-og-card.mjs /images/keyboards/rainbow-rgb-split.jpg zmk-sofle-hdock-fork cover attention
//   node scripts/make-og-card.mjs --stamp <name>   (adds the footer to an existing card, once)
//
// Writes public/images/og/<name>.png. A project whose `slug` matches <name> picks the card up by
// convention; a blog post points at it with `ogImage:` in its frontmatter.
//
//   cover    fills the card and crops the overflow; `position` is a sharp gravity or strategy
//            (top, centre, attention, entropy...; default "top", which keeps a page's header)
//   contain  for portrait or odd-shaped sources: the whole image on a dark, blurred copy of itself
//
// Every card ends in the same 72px footer row: GitHub, LinkedIn and X icons (simple-icons paths) with
// the handles, and allisons.dev on the right. The picture is drawn above it, so nothing overlaps.
//
// `pnpm check:seo` fails if any card under public/images/og is not 1200x630.
import { mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import sharp from 'sharp'



const require = createRequire(import.meta.url)
const icons = require('@iconify-json/simple-icons/icons.json').icons

const W = 1200
const H = 630
const FOOTER = 72
const CONTENT = H - FOOTER
const PINK = '#ff69b4'

const icon = (name, x) =>
  `<g transform="translate(${x} 18) scale(1.5)" fill="#e5e7eb">${icons[name].body.replace(/ fill="currentColor"/, '')}</g>`
const footerSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${FOOTER}" viewBox="0 0 ${W} ${FOOTER}">
  <rect width="${W}" height="${FOOTER}" fill="#0b0a0f"/>
  <rect width="${W}" height="3" fill="${PINK}"/>
  ${icon('github', 48)}<text x="96" y="47" font-family="DejaVu Sans, Inter, sans-serif" font-weight="700" font-size="28" fill="#e5e7eb">alliecatowo</text>
  ${icon('linkedin', 340)}<text x="388" y="47" font-family="DejaVu Sans, Inter, sans-serif" font-weight="700" font-size="28" fill="#e5e7eb">allie-cat</text>
  ${icon('x', 600)}<text x="648" y="47" font-family="DejaVu Sans, Inter, sans-serif" font-weight="700" font-size="28" fill="#e5e7eb">@AllieCatOwO</text>
  <text x="1152" y="47" text-anchor="end" font-family="DejaVu Sans Mono, monospace" font-weight="700" font-size="26" fill="${PINK}">allisons.dev</text>
</svg>`
const footer = () => ({ input: Buffer.from(footerSvg()), top: CONTENT, left: 0 })
const outDir = join(process.cwd(), 'public/images/og')
mkdirSync(outDir, { recursive: true })
const save = img => img.png({ palette: true, quality: 90, effort: 10 })

if (process.argv[2] === '--stamp') {
  const file = join(outDir, `${process.argv[3]}.png`)
  const base = await sharp(file).toBuffer()
  const { data } = await sharp(base).extract({ left: 600, top: CONTENT, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true })
  if (data[0] > 240 && Math.abs(data[1] - 105) < 12 && Math.abs(data[2] - 180) < 12) {
    console.log(`${file} already has the footer`)
    process.exit(0)
  }
  const top = await sharp(base).extract({ left: 0, top: 0, width: W, height: CONTENT }).toBuffer()
  await save(sharp({ create: { width: W, height: H, channels: 3, background: '#0b0a0f' } }).composite([{ input: top, top: 0, left: 0 }, footer()])).toFile(file)
  console.log(`stamped ${file}`)
  process.exit(0)
}

const [source, name, mode = 'cover', position = 'top'] = process.argv.slice(2)
if (!source || !name) {
  console.error('usage: node scripts/make-og-card.mjs <public-relative source> <name> [cover|contain] [position]')
  process.exit(2)
}
const input = join(process.cwd(), 'public', source)
const out = join(outDir, `${name}.png`)

const strategies = { attention: sharp.strategy.attention, entropy: sharp.strategy.entropy }
const fit = (pos) => strategies[pos] ?? pos

let image
if (mode === 'contain') {
  const backdrop = await sharp(input)
    .resize(W, CONTENT, { fit: 'cover', position: 'centre' })
    .blur(40)
    .modulate({ brightness: 0.35 })
    .toBuffer()
  const front = await sharp(input).resize({ width: W - 160, height: CONTENT - 60, fit: 'inside' }).toBuffer()
  image = sharp(backdrop).extend({ bottom: FOOTER, background: '#0b0a0f' }).composite([{ input: front, top: Math.round((CONTENT - (await sharp(front).metadata()).height) / 2), left: Math.round((W - (await sharp(front).metadata()).width) / 2) }, footer()])
}
else {
  image = sharp(await sharp(input).resize(W, CONTENT, { fit: 'cover', position: fit(position) }).toBuffer())
    .extend({ bottom: FOOTER, background: '#0b0a0f' })
    .composite([footer()])
}

await save(image).toFile(out)
console.log(`wrote ${out}`)
