// /webmcp/catalog.json: the published projects and blog posts as plain JSON, pre-rendered at build time.
// The WebMCP tools (app/plugins/webmcp.client.ts) read this instead of querying @nuxt/content in the
// browser, which would download the SQLite WASM. Drafts never appear: only `status: published`
// projects and `published: true` posts are selected (and production builds drop draft files anyway).
import { queryCollection } from '@nuxt/content/nitro'
import { PROJECT_GROUPS, projectGroupOf } from '../../../app/utils/projectGroups'
import { sortProjectsInGroup } from '../../../app/utils/sortProjects'
import type { WebmcpCatalog } from '../../../app/utils/webmcpTools'

const SITE = 'https://allisons.dev'

export default defineEventHandler(async (event): Promise<WebmcpCatalog> => {
  const [projects, posts] = await Promise.all([
    queryCollection(event, 'projects')
      .where('status', '=', 'published')
      .select('title', 'slug', 'description', 'group', 'order', 'groupOrder', 'featured', 'date', 'award', 'technologies', 'tags', 'github', 'demo', 'docs', 'devpost')
      .all(),
    queryCollection(event, 'blog')
      .where('published', '=', true)
      .order('date', 'DESC')
      .select('title', 'slug', 'description', 'date', 'tags')
      .all()
  ])

  const ordered = [...PROJECT_GROUPS.map(g => g.key), 'other'].flatMap(key =>
    sortProjectsInGroup(projects.filter(p => projectGroupOf(p.group).key === key))
  )

  setHeader(event, 'content-type', 'application/json; charset=utf-8')
  return {
    projects: ordered.filter(p => p.slug).map(p => ({
      slug: p.slug as string,
      title: p.title,
      description: p.description,
      group: projectGroupOf(p.group).key,
      groupLabel: projectGroupOf(p.group).label,
      award: p.award || undefined,
      technologies: p.technologies ?? [],
      tags: p.tags ?? [],
      url: `${SITE}/projects/${p.slug}/`,
      github: p.github || undefined,
      demo: p.demo || undefined,
      docs: p.docs || undefined,
      devpost: p.devpost || undefined
    })),
    posts: posts.map(post => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: String(post.date).slice(0, 10),
      tags: post.tags ?? [],
      url: `${SITE}/blog/${post.slug}/`
    }))
  }
})
