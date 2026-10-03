// Renders public/icon-maskable-512.png from public/favicon.svg: the heart at 60% of the canvas
// (inside the 80% circular safe zone Android masks to) on the same dark background as icon-512.png.
//
//   node scripts/make-maskable-icon.mjs
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const SIZE = 512
const HEART = Math.round(SIZE * 0.6)
const BACKGROUND = '#0b0a0f'

const svg = readFileSync(join(process.cwd(), 'public/favicon.svg'))
const heart = await sharp(svg, { density: 600 }).resize(HEART, HEART, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
await sharp({ create: { width: SIZE, height: SIZE, channels: 4, background: BACKGROUND } })
  .composite([{ input: heart, gravity: 'centre' }])
  .png({ compressionLevel: 9 })
  .toFile(join(process.cwd(), 'public/icon-maskable-512.png'))
console.log('wrote public/icon-maskable-512.png')
