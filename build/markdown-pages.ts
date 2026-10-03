// Per-page Markdown for language models: /projects/<slug>/index.md and /blog/<slug>/index.md, linked
// from /llms.txt. Emitted straight from the content files after prerendering, so it can never drift from
// the page and costs no runtime. Published items only (the same rule content.config.ts uses to drop drafts).
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'

const SITE = 'https://allisons.dev'

interface Source {
  dir: string
  section: 'projects' | 'blog'
  isPublished: RegExp
}

const SOURCES: Source[] = [
  { dir: 'content/projects', section: 'projects', isPublished: /^status:\s*['"]?published['"]?\s*$/m },
  { dir: 'content/blog', section: 'blog', isPublished: /^published:\s*true\s*$/m }
]

function field(frontmatter: string, name: string): string {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))
  return match?.[1] ? match[1].trim().replace(/^(['"])(.*)\1$/, '$2') : ''
}

// MDC components (`::demo-video ... ::`) carry YAML props and no prose; swap each for a one-line note
function stripComponents(body: string): string {
  const out: string[] = []
  let inBlock = false
  for (const line of body.split('\n')) {
    if (inBlock) {
      if (line.trim() === '::') inBlock = false
      continue
    }
    const open = line.match(/^::([\w-]+)/)
    if (open) {
      inBlock = true
      out.push(`[${(open[1] ?? '').replace(/-/g, ' ')}: see the web page]`)
      continue
    }
    out.push(line)
  }
  return out.join('\n')
}

export function emitMarkdownPages(publicDir: string): number {
  let count = 0
  for (const { dir, section, isPublished } of SOURCES) {
    for (const file of readdirSync(dir).filter(f => f.endsWith('.md'))) {
      const raw = readFileSync(`${dir}/${file}`, 'utf8')
      const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
      if (!match || !isPublished.test(match[1] ?? '')) continue
      const slug = field(match[1] ?? '', 'slug') || file.replace(/\.md$/, '')
      const title = field(match[1] ?? '', 'title')
      const description = field(match[1] ?? '', 'description')
      const lines = [`# ${title}`, '']
      if (description) lines.push(`> ${description}`, '')
      lines.push(`Web page: ${SITE}/${section}/${slug}/`, '', stripComponents(match[2] ?? '').trim(), '')
      const text = lines.join('\n')
      mkdirSync(`${publicDir}/${section}/${slug}`, { recursive: true })
      writeFileSync(`${publicDir}/${section}/${slug}/index.md`, text)
      count++
    }
  }
  return count
}
