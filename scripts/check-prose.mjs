#!/usr/bin/env node
// Flags AI-slop phrases, em-dash density, long paragraphs and emoji bullets in a draft.
// Usage: pnpm check:prose <file.md|file.txt>
// Exit 1 on banned phrases (errors); style issues are warnings. See .claude/skills/public-writing/.
import { readFileSync } from 'node:fs'

const BANNED = [
  'delve',
  'tapestry',
  'a testament to',
  'testament to',
  'realm',
  'leverage',
  'harness',
  'unlock',
  'unleash',
  'elevate',
  'empower',
  'seamless',
  'robust',
  'cutting-edge',
  'game-changer',
  'game changer',
  'revolutionary',
  'transformative',
  'groundbreaking',
  'paradigm shift',
  'synergy',
  'holistic',
  'pivotal',
  'multifaceted',
  'underscores',
  'showcases',
  'fosters',
  'deep dive',
  'dive into',
  "let's dive",
  "in today's",
  'fast-paced',
  'ever-evolving',
  'in an era of',
  'without further ado',
  'in conclusion',
  'in summary',
  'at the end of the day',
  'moving forward',
  "it's no secret",
  "it's worth noting",
  'it is worth noting',
  'it is important to note',
  'needless to say',
  'arguably',
  "here's the thing",
  "here's the kicker",
  'let me be clear',
  'let that sink in',
  'read that again',
  'buckle up',
  "i'm excited to announce",
  "i'm thrilled",
  "i'm humbled",
  "i'd be remiss",
  'navigate the',
  'the evolving landscape',
  'more than just',
  'incredibly',
  'truly',
]
const PATTERNS = [
  [/\bnot (?:just|only|merely) [^.!?\n]{1,60}, but\b/gi, 'contrast frame "not just X, but Y"'],
  [
    /\b(?:it|this|that)(?:'s| is) not (?:about )?[^.!?\n]{1,50}[,;] (?:it|this|that)(?:'s| is)\b/gi,
    'contrast frame "it\'s not X, it\'s Y"',
  ],
  [
    /\b(?:isn't|aren't) (?:just )?[^.!?\n]{1,40}[,;] (?:it's|they're)\b/gi,
    'contrast frame "isn\'t X, it\'s Y"',
  ],
  [/\b\w+, \w+,? and \w+\b(?=[.!?])/g, 'possible rule-of-three list (check by eye)', 'warn'],
]
const MAX_EM_PER_500 = 2
const MAX_PARA_WORDS = 90
const MAX_PARA_SENTENCES = 4

const file = process.argv[2]
if (!file) {
  console.error('usage: pnpm check:prose <file>')
  process.exit(2)
}

let text = readFileSync(file, 'utf8')
text = text.replace(/^---\n[\s\S]*?\n---\n/, '') // frontmatter
text = text.replace(/```[\s\S]*?```/g, ' ') // fenced code
text = text.replace(/`[^`\n]*`/g, ' ') // inline code

const lineOf = index => text.slice(0, index).split('\n').length
const errors = []
const warns = []

for (const phrase of BANNED) {
  const re = new RegExp(
    `(?<![\\w])${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/'/g, "['\u2019]")}(?![\\w])`,
    'gi'
  )
  for (const m of text.matchAll(re)) errors.push(`line ${lineOf(m.index)}: banned phrase "${m[0]}"`)
}
for (const [re, label, level] of PATTERNS) {
  for (const m of text.matchAll(re)) {
    ;(level === 'warn' ? warns : errors).push(
      `line ${lineOf(m.index)}: ${label}: "${m[0].slice(0, 70)}"`
    )
  }
}

const words = text.split(/\s+/).filter(Boolean).length
const em = (text.match(/\u2014/g) || []).length
const emLimit = Math.max(1, Math.ceil((words / 500) * MAX_EM_PER_500))
if (em > emLimit)
  warns.push(`${em} em dashes in ${words} words (limit about ${emLimit}); use periods or commas`)

text.split(/\n\s*\n/).forEach(para => {
  const p = para.trim()
  if (!p || /^(#|\||>|!\[)/.test(p)) return
  const start = text.indexOf(para)
  const w = p.split(/\s+/).length
  const s = (p.match(/[.!?](?:\s|$)/g) || []).length
  if (w > MAX_PARA_WORDS || s > MAX_PARA_SENTENCES) {
    warns.push(`line ${lineOf(start)}: long paragraph (${w} words, ${s} sentences); split it`)
  }
})
for (const m of text.matchAll(/^\s*[-*]?\s*[\p{Extended_Pictographic}]\s/gmu)) {
  warns.push(`line ${lineOf(m.index)}: emoji bullet`)
}
for (const m of text.matchAll(/^#{2,6} (?:[A-Z][a-z]+ ){2,}[A-Z][a-z]+\s*$/gm)) {
  warns.push(`line ${lineOf(m.index)}: Title Case heading: "${m[0].trim()}"`)
}

for (const e of errors) console.log(`error  ${e}`)
for (const w of warns) console.log(`warn   ${w}`)
console.log(`${file}: ${words} words, ${errors.length} errors, ${warns.length} warnings`)
process.exit(errors.length ? 1 : 0)
