// /llms.txt (https://llmstxt.org): a short Markdown map of the site for language models.
// Pre-rendered at build time from the content collections, so new projects and posts
// show up without editing this file.
import { queryCollection } from '@nuxt/content/nitro'
import { PROJECT_GROUPS, projectGroupOf } from '../../app/utils/projectGroups'
import { sortProjectsInGroup } from '../../app/utils/sortProjects'

const SITE = 'https://allisons.dev'

export default defineEventHandler(async (event) => {
  const [projects, posts] = await Promise.all([
    queryCollection(event, 'projects')
      .where('status', '=', 'published')
      .select('title', 'slug', 'description', 'group', 'order', 'groupOrder', 'featured', 'date', 'award')
      .all(),
    queryCollection(event, 'blog')
      .where('published', '=', true)
      .order('date', 'DESC')
      .select('title', 'slug', 'description')
      .all()
  ])

  const lines = [
    '# Allison Coleman',
    '',
    '> Software engineer at Hinge Health in the Bay Area, building agent systems, developer tools, and languages & runtimes. Creator of JupyterLite WebMCP, one of 10 winners of the 2026 OpenAI WebMCP Challenge.',
    '',
    'She yells at robots and occasionally programs things. Most of her side projects are open source on GitHub (https://github.com/alliecatowo).',
    '',
    '## Pages',
    '',
    `- [Home](${SITE}/): overview and selected work`,
    `- [About](${SITE}/about/): background, current work and what she builds with`,
    `- [Projects](${SITE}/projects/): every published project, grouped by theme`,
    `- [Blog](${SITE}/blog/): writing on agents, developer tools and hardware`,
    `- [Contact](${SITE}/contact/): email me@allisons.dev, GitHub, LinkedIn and X (@AllieCatOwO)`
  ]

  const groups = [...PROJECT_GROUPS.map(g => g.key), 'other']
  for (const key of groups) {
    const inGroup = sortProjectsInGroup(projects.filter(p => projectGroupOf(p.group).key === key))
    if (!inGroup.length) continue
    lines.push('', `## Projects: ${projectGroupOf(key).label}`, '')
    for (const p of inGroup) {
      // The winner's description already says so
      const award = p.award && !/winning|winner/i.test(p.description ?? '') ? ` (${p.award})` : ''
      lines.push(`- [${p.title}](${SITE}/projects/${p.slug}/)${award}: ${p.description}`)
    }
  }

  if (posts.length) {
    lines.push('', '## Blog', '')
    for (const post of posts) lines.push(`- [${post.title}](${SITE}/blog/${post.slug}/): ${post.description}`)
  }

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `${lines.join('\n')}\n`
})
