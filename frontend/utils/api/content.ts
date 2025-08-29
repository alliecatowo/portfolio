/**
 * Service to fetch and handle content using Nuxt Content directly
 */

// Types
export interface Project {
  id: string;
  title: string;
  description: string;
  slug: string;
  cover_image?: string;
  technologies?: string[];
  github?: string;
  live_url?: string;
  featured?: boolean;
  category?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  slug: string;
  cover_image?: string;
  excerpt?: string;
  portfolio_type?: 'dev' | 'tattoo' | 'both';
  date_published?: string;
  featured?: boolean;
  category?: string;
}

export interface TattooWork {
  id: string;
  title: string;
  description: string;
  image?: string;
  featured?: boolean;
  client_testimonial?: string;
  date?: string;
  style?: string;
}

/**
 * Fetch blog posts using Nuxt Content directly
 */
export async function getPosts(page = 1, pageSize = 10, filters: any = {}) {
  try {
    let query = queryContent('blog')
      .where({ published: true })
      .sort({ date: -1 })

    // Apply category filter if provided
    if (filters.category) {
      query = query.where({ category: filters.category })
    }

    // Get total count
    const allPosts = await query.find()
    const total = allPosts.length

    // Get paginated results
    const posts = await query
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .find()

    return {
      data: posts.map(post => ({
        id: post._id,
        title: post.title,
        slug: post._path?.split('/').pop(),
        excerpt: post.description,
        content: post.body,
        date_published: post.date,
        cover_image: post.image,
        category: post.category,
        tags: post.tags || [],
        featured: post.featured || false
      })),
      meta: {
        pagination: {
          page,
          pageSize,
          total
        }
      }
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, total: 0 } } }
  }
}

/**
 * Fetch a single blog post by slug
 */
export async function getPostBySlug(slug: string) {
  try {
    const post = await queryContent('blog', slug)
      .where({ published: true })
      .findOne()
    
    if (!post) return null
    
    return {
      id: post._id,
      title: post.title,
      slug: post._path?.split('/').pop(),
      excerpt: post.description,
      content: post.body,
      date_published: post.date,
      cover_image: post.image,
      category: post.category,
      tags: post.tags || [],
      featured: post.featured || false
    }
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return null
  }
}

/**
 * Fetch developer projects
 */
export async function getProjects(page = 1, pageSize = 10, filters: any = {}) {
  try {
    let query = queryContent('projects')
      .where({ status: 'completed' })
      .sort({ date: -1 })

    // Apply featured filter if provided
    if (filters.featured) {
      query = query.where({ featured: true })
    }

    // Get total count
    const allProjects = await query.find()
    const total = allProjects.length

    // Get paginated results
    const projects = await query
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .find()

    return {
      data: projects.map((project, index) => ({
        id: index + 1,
        title: project.title,
        description: project.description,
        slug: project._path?.split('/').pop(),
        cover_image: project.image,
        technologies: project.technologies || [],
        github: project.github,
        live_url: project.demo,
        featured: project.featured || false,
        category: project.category
      })),
      meta: {
        pagination: {
          page,
          pageSize,
          total
        }
      }
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, total: 0 } } }
  }
}

/**
 * Fetch a single project by slug
 */
export async function getProjectBySlug(slug: string) {
  try {
    const project = await queryContent('projects', slug)
      .where({ status: 'completed' })
      .findOne()
    
    if (!project) return null
    
    return {
      id: project._id,
      title: project.title,
      description: project.description,
      slug: project._path?.split('/').pop(),
      cover_image: project.image,
      technologies: project.technologies || [],
      github: project.github,
      live_url: project.demo,
      featured: project.featured || false,
      category: project.category,
      content: project.body
    }
  } catch (error) {
    console.error('Error fetching project by slug:', error)
    return null
  }
}

/**
 * Fetch gallery items
 */
export async function getTattooWorks(page = 1, pageSize = 10, filters: any = {}) {
  try {
    let query = queryContent('gallery')
      .where({ client_approved: true })
      .sort({ date: -1 })

    // Apply featured filter if provided
    if (filters.featured) {
      query = query.where({ featured: true })
    }

    // Get total count
    const allWorks = await query.find()
    const total = allWorks.length

    // Get paginated results
    const works = await query
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .find()

    return {
      data: works.map((work, index) => ({
        id: index + 1,
        title: work.title,
        description: work.description,
        image: work.image,
        featured: work.featured || false,
        date: work.date,
        style: work.style,
        placement: work.placement,
        session_time: work.session_time,
        size: work.size
      })),
      meta: {
        pagination: {
          page,
          pageSize,
          total
        }
      }
    }
  } catch (error) {
    console.error('Error fetching tattoo works:', error)
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, total: 0 } } }
  }
}

/**
 * Fetch testimonials
 */
export async function getTestimonials(limit = 10) {
  try {
    const testimonials = await queryContent('testimonials')
      .where({ verified: true })
      .sort({ date: -1 })
      .limit(limit)
      .find()

    return {
      data: testimonials.map((testimonial, index) => ({
        id: index + 1,
        name: testimonial.name,
        text: testimonial.body?.children?.[0]?.children?.[0]?.value || testimonial.description || "Amazing tattoo experience!",
        rating: testimonial.rating || 5,
        image: testimonial.image,
        tattoo_image: testimonial.tattoo_image,
        date: testimonial.date,
        location: testimonial.location,
        tattoo_style: testimonial.tattoo_style,
        session_time: testimonial.session_time
      })),
      meta: {}
    }
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return { data: [], meta: {} }
  }
}

/**
 * Simple asset URL helper
 */
export function getAssetUrl(path: string) {
  return path;
}

/**
 * Fetch articles by portfolio type
 */
export async function getArticlesByPortfolioType(type: 'dev' | 'tattoo' | 'both', limit = 3) {
  try {
    const articles = await queryContent('blog')
      .where({ published: true, category: type })
      .sort({ date: -1 })
      .limit(limit)
      .find()

    return {
      data: articles.map(post => ({
        id: post._id,
        title: post.title,
        slug: post._path?.split('/').pop(),
        excerpt: post.description,
        content: post.body,
        date_published: post.date,
        cover_image: post.image,
        category: post.category,
        tags: post.tags || [],
        featured: post.featured || false
      })),
      meta: {}
    }
  } catch (error) {
    console.error(`Error fetching ${type} articles:`, error)
    return { data: [], meta: {} }
  }
}

/**
 * Fetch featured developer projects
 */
export async function fetchFeaturedDevProjects(limit = 3) {
  try {
    const projects = await queryContent('projects')
      .where({ featured: true, status: 'completed' })
      .sort({ date: -1 })
      .limit(limit)
      .find()

    return {
      data: projects.map((project, index) => ({
        id: index + 1,
        title: project.title,
        description: project.description,
        slug: project._path?.split('/').pop(),
        cover_image: project.image,
        technologies: project.technologies || [],
        github: project.github,
        live_url: project.demo,
        featured: project.featured || false,
        category: project.category
      })),
      meta: {}
    }
  } catch (error) {
    console.error('Error fetching featured dev projects:', error)
    return { data: [], meta: {} }
  }
}

// Additional helper functions can be added as needed
export async function fetchDevLandingContent() {
  try {
    const featuredProjects = await fetchFeaturedDevProjects(3);
    const recentPosts = await getArticlesByPortfolioType('dev', 3);
    
    return {
      featuredProjects,
      recentPosts
    };
  } catch (error) {
    console.error('Error fetching dev landing page content:', error);
    return {
      featuredProjects: { data: [] },
      recentPosts: { data: [] }
    };
  }
}

export async function fetchTattooLandingContent() {
  try {
    const featuredWorks = await getTattooWorks(1, 6);
    const recentPosts = await getArticlesByPortfolioType('tattoo', 3);
    const testimonials = await getTestimonials(3);
    
    return {
      featuredWorks,
      recentPosts,
      testimonials
    };
  } catch (error) {
    console.error('Error fetching tattoo landing page content:', error);
    return {
      featuredWorks: { data: [] },
      recentPosts: { data: [] },
      testimonials: { data: [] }
    };
  }
}