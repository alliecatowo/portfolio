export function useContent() {
  /**
   * Fetch blog posts from content
   */
  async function fetchBlogPosts(limit?: number) {
    const query = queryCollection('blog')
      .where('published', '=', true)
      .order('date', 'DESC')
    
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
      .first()
  }

  /**
   * Fetch project items from content
   */
  async function fetchProjects(limit?: number, featured?: boolean) {
    const query = queryCollection('projects')
      .where('status', '<>', 'draft')
      .order('featured', 'DESC')
      .order('date', 'DESC')
    
    if (featured) {
      query.where('featured', '=', true)
    }
    
    if (limit) {
      query.limit(limit)
    }
    
    return await query.all()
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

  return {
    fetchBlogPosts,
    fetchBlogPost,
    fetchProjects,
    fetchProject,
    fetchPage
  }
}
