// List views render cards, never the markdown. Without .select() every row's parsed body (the full
// AST) lands in the prerendered payload: ~30 KB of unused JSON on the home page, ~190 KB on /projects/.
const BLOG_CARD_FIELDS = ['title', 'slug', 'path', 'description', 'date', 'featured_image', 'tags'] as const
const PROJECT_CARD_FIELDS = [
  'title', 'slug', 'path', 'description', 'date', 'image', 'imageAlt', 'technologies', 'tags',
  'award', 'group', 'groupOrder', 'order', 'featured', 'demo', 'github', 'status'
] as const

export function useContent() {
  /**
   * Fetch blog posts from content (card fields only, no body)
   */
  async function fetchBlogPosts(limit?: number) {
    const query = queryCollection('blog')
      .where('published', '=', true)
      .order('date', 'DESC')
      .select(...BLOG_CARD_FIELDS)
    
    if (limit) {
      query.limit(limit)
    }
    
    return await query.all()
  }

  /**
   * Fetch a single blog post by slug
   */
  async function fetchBlogPost(slug: string) {
    return await queryCollection('blog')
      .where('slug', '=', slug)
      .where('published', '=', true)
      .first()
  }

  /**
   * Fetch project items from content.
   *
   * Sorted by explicit `order` ascending (projects without one go last),
   * then featured first, then newest first. Sorting happens in JS because
   * the query builder can't express "nulls last"; the limit is applied
   * after sorting.
   */
  async function fetchProjects(limit?: number, featured?: boolean) {
    const query = queryCollection('projects')
      .where('status', '<>', 'draft')
      .select(...PROJECT_CARD_FIELDS)

    if (featured) {
      query.where('featured', '=', true)
    }

    const projects = sortProjects(await query.all())
    return limit ? projects.slice(0, limit) : projects
  }

  /**
   * Fetch a single project by slug
   */
  async function fetchProject(slug: string) {
    return await queryCollection('projects')
      .where('path', 'LIKE', `%${slug}%`)
      .first()
  }

  /**
   * Fetch a managed page by slug
   */
  async function fetchPage(slug: string) {
    return await queryCollection('pages')
      .where('slug', '=', slug)
      .first()
  }

  /**
   * Fetch a global config entry by slug
   */
  async function fetchGlobal(slug: string) {
    return await queryCollection('globals')
      .where('slug', '=', slug)
      .first()
  }

  return {
    fetchBlogPosts,
    fetchBlogPost,
    fetchProjects,
    fetchProject,
    fetchPage,
    fetchGlobal
  }
}
