// Renders a 1200x630 share card from an image under public/.
//
//   node scripts/make-og-card.mjs <public-relative source> <name> [cover|contain] [position]
//   node scripts/make-og-card.mjs /images/keyboards/rainbow-rgb-split.jpg zmk-sofle-hdock-fork cover attention
//
// Writes public/images/og/<name>.png. A project whose `slug` matches <name> picks the card up by
// convention; a blog post points at it with `ogImage:` in its frontmatter.
//
//   cover    fills the card and crops the overflow; `position` is a sharp gravity or strategy
//            (top, centre, attention, entropy...; default "top", which keeps a page's header)
//   contain  for portrait or odd-shaped sources: the whole image on a dark, blurred copy of itself
//
// `pnpm check:seo` fails if any card under public/images/og is not 1200x630.
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const [source, name, mode = 'cover', position = 'top'] = process.argv.slice(2)
if (!source || !name) {
  console.error('usage: node scripts/make-og-card.mjs <public-relative source> <name> [cover|contain] [position]')
  process.exit(2)
}

const W = 1200
const H = 630
const input = join(process.cwd(), 'public', source)
const out = join(process.cwd(), 'public/images/og', `${name}.png`)
mkdirSync(join(process.cwd(), 'public/images/og'), { recursive: true })

const strategies = { attention: sharp.strategy.attention, entropy: sharp.strategy.entropy }
const fit = (pos) => strategies[pos] ?? pos

let image
if (mode === 'contain') {
  const backdrop = await sharp(input)
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .blur(40)
    .modulate({ brightness: 0.35 })
    .toBuffer()
  const front = await sharp(input).resize({ width: W - 160, height: H - 60, fit: 'inside' }).toBuffer()
  image = sharp(backdrop).composite([{ input: front, gravity: 'centre' }])
}
else {
  image = sharp(input).resize(W, H, { fit: 'cover', position: fit(position) })
}

await image.png({ palette: true, quality: 90, effort: 10 }).toFile(out)
console.log(`wrote ${out}`)
