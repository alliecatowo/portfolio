// WebMCP tool definitions for allisons.dev. Kept free of Nuxt/browser globals so a test can
// import them: the plugin (app/plugins/webmcp.client.ts) supplies the catalog loader and router.
//
// Spec: https://webmachinelearning.github.io/webmcp/ (Draft Community Group Report). Tools are
// registered with `document.modelContext.registerTool`, and `execute` returns the MCP result
// shape ({ content, structuredContent }) the same way JupyterLite WebMCP does.

export interface CatalogProject {
  slug: string
  title: string
  description: string
  group: string
  groupLabel: string
  award?: string
  technologies: string[]
  tags: string[]
  url: string
  github?: string
  demo?: string
  devpost?: string
}

export interface CatalogPost {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  url: string
}

export interface WebmcpCatalog {
  projects: CatalogProject[]
  posts: CatalogPost[]
}

export interface ToolResult {
  content: { type: 'text', text: string }[]
  structuredContent: Record<string, unknown>
  isError?: boolean
}

export interface WebmcpToolDefinition {
  name: string
  title: string
  description: string
  inputSchema: Record<string, unknown>
  annotations: { readOnlyHint: boolean }
  execute: (input?: unknown) => Promise<ToolResult>
}

export interface WebmcpToolDeps {
  getCatalog: () => Promise<WebmcpCatalog>
  /** Client-side route change. Resolves to the path that was opened, or null if no page matches. */
  navigate: (path: string) => Promise<string | null>
}

export const CONTACT = {
  name: 'Allison Coleman',
  email: 'me@allisons.dev',
  emailLink: 'mailto:me@allisons.dev',
  github: 'https://github.com/alliecatowo',
  linkedin: 'https://linkedin.com/in/allie-cat',
  x: 'https://x.com/AllieCatOwO',
  contactPage: 'https://allisons.dev/contact/',
  note: 'Email works best. The contact page also has a form; submitting it is up to the person using the page.'
} as const

function ok(payload: Record<string, unknown>): ToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(payload) }], structuredContent: payload }
}

function fail(message: string, extra: Record<string, unknown> = {}): ToolResult {
  const payload = { error: message, ...extra }
  return { content: [{ type: 'text', text: JSON.stringify(payload) }], structuredContent: payload, isError: true }
}

// Arguments can arrive as an object or, in Chrome's current implementation, a JSON string.
function asArgs(input: unknown): Record<string, unknown> {
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input)
      return parsed && typeof parsed === 'object' ? parsed : {}
    } catch {
      return {}
    }
  }
  return input && typeof input === 'object' ? input as Record<string, unknown> : {}
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

const summary = (p: CatalogProject) => ({
  slug: p.slug,
  title: p.title,
  description: p.description,
  group: p.group,
  url: p.url
})

export function createWebmcpTools(deps: WebmcpToolDeps): WebmcpToolDefinition[] {
  const readOnly = { readOnlyHint: true }

  return [
    {
      name: 'search_projects',
      title: 'Search projects',
      description: 'Search Allison Coleman\'s published projects by keyword (matches title, description, technologies and tags). Leave the query empty to list every project. Returns title, slug, description, group and URL for each match.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Keyword or phrase to look for, e.g. "webmcp", "rust" or "keyboard". Empty returns all projects.' },
          group: { type: 'string', description: 'Optional project group key to filter by, e.g. "browser-agents", "agent-systems-devtools", "languages-runtimes", "creative-coding", "social-systems", "hardware-homelab" or "earlier-work".' }
        },
        required: ['query'],
        additionalProperties: false
      },
      annotations: readOnly,
      async execute(input) {
        const args = asArgs(input)
        const query = str(args.query).toLowerCase()
        const group = str(args.group).toLowerCase()
        const { projects } = await deps.getCatalog()
        const terms = query.split(/\s+/).filter(Boolean)
        const results = projects.filter((p) => {
          if (group && p.group.toLowerCase() !== group) return false
          const haystack = [p.title, p.description, p.slug, p.groupLabel, ...p.technologies, ...p.tags].join(' ').toLowerCase()
          return terms.every(t => haystack.includes(t))
        })
        return ok({ count: results.length, projects: results.map(summary) })
      }
    },
    {
      name: 'get_project',
      title: 'Get project details',
      description: 'Get one project\'s summary and links (page, GitHub, demo, Devpost), plus technologies, tags and any award. Use a slug from search_projects.',
      inputSchema: {
        type: 'object',
        properties: {
          slug: { type: 'string', description: 'The project slug, e.g. "jupyterlite-webmcp".' }
        },
        required: ['slug'],
        additionalProperties: false
      },
      annotations: readOnly,
      async execute(input) {
        const slug = str(asArgs(input).slug).toLowerCase()
        const { projects } = await deps.getCatalog()
        const project = projects.find(p => p.slug.toLowerCase() === slug)
        if (!project) {
          return fail(`No published project with slug "${slug}".`, { availableSlugs: projects.map(p => p.slug) })
        }
        return ok({ project })
      }
    },
    {
      name: 'list_blog_posts',
      title: 'List blog posts',
      description: 'List the published blog posts, newest first, with title, slug, date, description and URL.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: readOnly,
      async execute() {
        const { posts } = await deps.getCatalog()
        return ok({ count: posts.length, posts })
      }
    },
    {
      name: 'navigate',
      title: 'Go to a page',
      description: 'Open a page of this site in the current tab (client-side navigation), e.g. "/projects/", "/blog/" or "/contact/". Only same-site paths are accepted. This changes what the user is looking at.',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'A same-site path starting with "/", e.g. "/projects/jupyterlite-webmcp/".' }
        },
        required: ['path'],
        additionalProperties: false
      },
      // Not read-only: it moves the person's viewport (same reasoning as JupyterLite WebMCP's focus tools)
      annotations: { readOnlyHint: false },
      async execute(input) {
        const path = str(asArgs(input).path)
        if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
          return fail('path must be a same-site path starting with a single "/", e.g. "/projects/".')
        }
        const opened = await deps.navigate(path)
        return opened ? ok({ navigatedTo: opened }) : fail(`No page matches "${path}".`)
      }
    },
    {
      name: 'get_contact_info',
      title: 'Get contact info',
      description: 'Get Allison Coleman\'s email link and her GitHub, LinkedIn and X profiles.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: readOnly,
      async execute() {
        return ok({ ...CONTACT })
      }
    }
  ]
}
