// Gives Markdown images their intrinsic size without touching the content.
//
// Prose images (`![alt](/images/...)`) need an `aspect-ratio` so the page doesn't shift while they
// load. That used to be added to the parsed Markdown by a Nuxt Content hook, but Nuxt Studio saves
// the stored document back to the file, so the hook's `{style=... loading=... decoding=...}` was
// committed into every image. Instead this module reads the size of each local image the content
// references, straight from its file header, and exposes the lot as `#build/content-image-sizes.mjs`
// ({ '/images/a.webp': [width, height] }). app/components/content/ProseImg.vue looks images up there.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineNuxtModule, addTemplate, createResolver } from 'nuxt/kit'
import { imageDimensions } from '../scripts/image-dimensions'

// Markdown image destinations and raw src="..." attributes that point at the site's own files
const LOCAL_IMAGE = /(?:!\[[^\]]*\]\(\s*|\bsrc=["'])(\/[^\s)"']+)/g

export default defineNuxtModule({
  meta: { name: 'content-image-sizes' },
  setup() {
    const { resolve } = createResolver(import.meta.url)
    const contentDir = resolve('../content')
    const publicDir = resolve('../public')

    addTemplate({
      filename: 'content-image-sizes.mjs',
      write: true,
      getContents() {
        const sizes: Record<string, [number, number]> = {}
        const files = readdirSync(contentDir, { recursive: true, encoding: 'utf8' }).filter(f => f.endsWith('.md'))
        for (const file of files) {
          for (const [, src] of readFileSync(join(contentDir, file), 'utf8').matchAll(LOCAL_IMAGE)) {
            if (!src || src.startsWith('//') || sizes[src]) continue
            const size = imageDimensions(join(publicDir, decodeURI(src.split(/[?#]/)[0]!)))
            if (size) sizes[src] = [size.width, size.height]
          }
        }
        return `export default ${JSON.stringify(sizes, null, 2)}\n`
      }
    })
  }
})
