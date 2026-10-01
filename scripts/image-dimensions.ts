// Intrinsic size of a PNG, JPEG, GIF or WebP file, read from its header.
// Used at build time to give Markdown images an aspect ratio (no layout shift)
// without adding an image-size dependency.
import { closeSync, openSync, readSync } from 'node:fs'

export interface ImageDimensions { width: number, height: number }

function readHead(path: string, bytes = 256 * 1024): Buffer {
  const fd = openSync(path, 'r')
  try {
    const buf = Buffer.alloc(bytes)
    const n = readSync(fd, buf, 0, bytes, 0)
    return buf.subarray(0, n)
  } finally {
    closeSync(fd)
  }
}

export function imageDimensions(path: string): ImageDimensions | undefined {
  let b: Buffer
  try {
    b = readHead(path)
  } catch {
    return undefined
  }
  // PNG: IHDR right after the signature
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504E47) {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) }
  }
  // GIF: logical screen size
  if (b.length > 10 && b.toString('ascii', 0, 3) === 'GIF') {
    return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) }
  }
  // WebP: VP8 (lossy), VP8L (lossless) or VP8X (extended)
  if (b.length > 30 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16)
    if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3FFF, height: b.readUInt16LE(28) & 0x3FFF }
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21)
      return { width: (bits & 0x3FFF) + 1, height: ((bits >> 14) & 0x3FFF) + 1 }
    }
    if (chunk === 'VP8X') return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 }
  }
  // JPEG: walk the segments to the first SOFn marker
  if (b.length > 4 && b[0] === 0xFF && b[1] === 0xD8) {
    let i = 2
    while (i + 9 < b.length) {
      if (b[i] !== 0xFF) { i++; continue }
      const marker = b[i + 1]!
      const length = b.readUInt16BE(i + 2)
      const isSof = marker >= 0xC0 && marker <= 0xCF && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC
      if (isSof) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) }
      i += 2 + length
    }
  }
  return undefined
}
