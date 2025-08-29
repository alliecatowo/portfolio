export function useContent() {
  /**
   * Fetch blog posts from content
   */
  async function fetchBlogPosts(category: 'dev' | 'tattoo' = 'dev', limit?: number) {
    const query = queryContent(`blog/${category}`)
      .sort({ date: -1 })
      .where({ published: { $ne: false } })
    
    if (limit) {
      query.limit(limit)
    }
    
    return await query.find()
  }

  /**
   * Fetch a single blog post by slug
   */
  async function fetchBlogPost(category: 'dev' | 'tattoo', slug: string) {
    return await queryContent(`blog/${category}`, slug).findOne()
  }

  /**
   * Fetch project items from content
   */
  async function fetchProjects(limit?: number) {
    const query = queryContent('projects')
      .sort({ featured: -1, date: -1 })
      .where({ status: { $ne: 'draft' } })
    
    if (limit) {
      query.limit(limit)
    }
    
    return await query.find()
  }

  /**
   * Fetch a single project by slug
   */
  async function fetchProject(slug: string) {
    return await queryContent('projects', slug).findOne()
  }

  /**
   * Fetch gallery items from content
   */
  async function fetchGalleryItems(limit?: number) {
    const query = queryContent('gallery')
      .sort({ featured: -1, date: -1 })
    
    if (limit) {
      query.limit(limit)
    }
    
    return await query.find()
  }

  /**
   * Fetch testimonials from content
   */
  async function fetchTestimonials(limit?: number) {
    const query = queryContent('testimonials')
      .sort({ featured: -1, date: -1 })
      .where({ verified: { $ne: false } })
    
    if (limit) {
      query.limit(limit)
    }
    
    return await query.find()
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