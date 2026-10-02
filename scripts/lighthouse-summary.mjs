// Turns the .lighthouseci output into the Markdown for the sticky PR comment.
//
//   node scripts/lighthouse-summary.mjs > lighthouse-comment.md
//
// Reads the lhr-*.json files from `lhci collect` (median-performance run per URL), the optional
// links.json from `lhci upload` (public report links) and assertion-results.json from `lhci assert`.
// Set SEO_CHECK_OUTCOME (success/failure/...) to include the `pnpm check:seo` result in the comment.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIR = join(process.cwd(), '.lighthouseci')
const MARKER = '<!-- lighthouse-ci-report -->'
const read = file => JSON.parse(readFileSync(join(DIR, file), 'utf8'))

const runs = existsSync(DIR)
  ? readdirSync(DIR).filter(f => /^lhr-.*\.json$/.test(f)).map(read)
  : []

const byUrl = new Map()
for (const lhr of runs) {
  const path = new URL(lhr.finalUrl).pathname
  if (!byUrl.has(path)) byUrl.set(path, [])
  byUrl.get(path).push(lhr)
}

const links = existsSync(join(DIR, 'links.json')) ? read('links.json') : {}
const reportFor = (path) => {
  const key = Object.keys(links).find(u => new URL(u).pathname === path)
  return key ? links[key] : undefined
}

const THRESHOLDS = { performance: 0.85, accessibility: 0.95, 'best-practices': 0.95, seo: 0.95 }
const cell = (name, score) => {
  const n = Math.round(score * 100)
  const bad = score < THRESHOLDS[name]
  return bad ? `**${n}** (${name === 'performance' ? 'warn' : 'fail'})` : `${n}`
}

const lines = [MARKER, '## Lighthouse and SEO report', '']
if (process.env.SEO_CHECK_OUTCOME) {
  lines.push(process.env.SEO_CHECK_OUTCOME === 'success'
    ? '`pnpm check:seo`: passed.'
    : '`pnpm check:seo`: **failed**, see the job log.', '')
}

if (!byUrl.size) {
  lines.push('No Lighthouse results were produced, see the job log.')
}
else {
  lines.push(
    'Mobile preset, median of 3 runs per URL against the generated site (`.output/public`). '
    + 'Performance below 85 warns only; accessibility, best practices and SEO below 95 fail the check.',
    '',
    '| URL | Performance | Accessibility | Best practices | SEO | Report |',
    '| --- | ---: | ---: | ---: | ---: | --- |'
  )
  for (const [path, group] of byUrl) {
    group.sort((a, b) => a.categories.performance.score - b.categories.performance.score)
    const lhr = group[Math.floor(group.length / 2)]
    const c = lhr.categories
    const link = reportFor(path)
    lines.push(`| \`${path}\` | ${cell('performance', c.performance.score)} | ${cell('accessibility', c.accessibility.score)} | ${cell('best-practices', c['best-practices'].score)} | ${cell('seo', c.seo.score)} | ${link ? `[report](${link})` : 'n/a'} |`)
  }
}

if (existsSync(join(DIR, 'assertion-results.json'))) {
  const failed = read('assertion-results.json')
  if (failed.length) {
    const seen = new Set()
    lines.push('', '### Assertions', '')
    for (const a of failed) {
      const path = new URL(a.url).pathname
      const key = `${a.level}|${a.auditId}|${path}`
      if (seen.has(key)) continue
      seen.add(key)
      lines.push(`- ${a.level === 'error' ? 'error' : 'warn'}: \`${a.auditId}\` on \`${path}\` (${a.auditTitle ?? a.message ?? 'see report'}; got ${a.actual}, expected ${a.operator === '>=' ? 'at least ' : ''}${a.expected})`)
    }
  }
}

lines.push('', `_Commit ${process.env.GITHUB_SHA?.slice(0, 7) ?? 'local'}. Scores on shared CI runners vary a few points run to run._`)
console.log(lines.join('\n'))
