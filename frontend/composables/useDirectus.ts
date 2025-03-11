import { fetchItems, fetchItem, getAssetUrl } from '~/utils/directus'

export function useDirectus() {
  /**
   * Fetch blog posts from Directus
   */
  async function fetchBlogPosts(params = {}) {
    return fetchItems('blog_posts', {
      sort: ['-date_published'],
      ...params
    })
  }

  /**
   * Fetch a single blog post by ID
   */
  async function fetchBlogPost(id: string, params = {}) {
    return fetchItem('blog_posts', id, params)
  }

  /**
   * Fetch project items from Directus
   */
  async function fetchProjects(params = {}) {
    return fetchItems('projects', {
      sort: ['sort'],
      ...params
    })
  }

  /**
   * Fetch a single project by ID
   */
  async function fetchProject(id: string, params = {}) {
    return fetchItem('projects', id, params)
  }

  /**
   * Fetch gallery items from Directus
   */
  async function fetchGalleryItems(params = {}) {
    return fetchItems('gallery', {
      sort: ['sort'],
      ...params
    })
  }

  /**
   * Get asset URL for images with optional transformations
   */
  function getImageUrl(fileId: string, params = {}) {
    return getAssetUrl(fileId, params)
  }

  return {
    fetchBlogPosts,
    fetchBlogPost,
    fetchProjects,
    fetchProject,
    fetchGalleryItems,
    getImageUrl
  }
} 