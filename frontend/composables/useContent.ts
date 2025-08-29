export function useContent() {
  /**
   * Fetch blog posts from content
   */
  async function fetchBlogPosts(category: 'dev' | 'tattoo' = 'dev', limit?: number) {
    const query = queryCollection('blog')
      .where('category', '=', category)
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
  async function fetchBlogPost(category: 'dev' | 'tattoo', slug: string) {
    return await queryCollection('blog')
      .where('category', '=', category)
      .where('path', 'LIKE', `%${slug}%`)
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
   * Fetch gallery items from content
   */
  async function fetchGalleryItems(limit?: number, featured?: boolean) {
    const query = queryCollection('gallery')
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
   * Fetch testimonials from content
   */
  async function fetchTestimonials(limit?: number) {
    const query = queryCollection('testimonials')
      .where('verified', '=', true)
      .order('featured', 'DESC')
      .order('date', 'DESC')
    
    if (limit) {
      query.limit(limit)
    }
    
    return await query.all()
  }

  return {
    fetchBlogPosts,
    fetchBlogPost,
    fetchProjects,
    fetchProject,
    fetchGalleryItems,
    fetchTestimonials
  }
}