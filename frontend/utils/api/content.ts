/**
 * Service to fetch and handle content using Nuxt Content
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
 * Fetch blog posts using Nuxt Content
 */
export async function getPosts(page = 1, pageSize = 10, filters = {}) {
  try {
    const posts = await $fetch('/api/content/blog', {
      query: {
        page,
        limit: pageSize,
        ...filters
      }
    });

    return {
      data: posts.data || [],
      meta: {
        pagination: {
          page,
          pageSize,
          total: posts.total || 0
        }
      }
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, total: 0 } } };
  }
}

/**
 * Fetch a single blog post by slug
 */
export async function getPostBySlug(slug: string) {
  try {
    const post = await $fetch(`/api/content/blog/${slug}`);
    return post;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

/**
 * Fetch developer projects
 */
export async function getProjects(page = 1, pageSize = 10, filters = {}) {
  try {
    const projects = await $fetch('/api/content/projects', {
      query: {
        page,
        limit: pageSize,
        ...filters
      }
    });

    return {
      data: projects.data || [],
      meta: {
        pagination: {
          page,
          pageSize,
          total: projects.total || 0
        }
      }
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, total: 0 } } };
  }
}

/**
 * Fetch a single project by slug
 */
export async function getProjectBySlug(slug: string) {
  try {
    const project = await $fetch(`/api/content/projects/${slug}`);
    return project;
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }
}

/**
 * Fetch gallery items
 */
export async function getTattooWorks(page = 1, pageSize = 10, filters = {}) {
  try {
    const works = await $fetch('/api/content/gallery', {
      query: {
        page,
        limit: pageSize,
        ...filters
      }
    });

    return {
      data: works.data || [],
      meta: {
        pagination: {
          page,
          pageSize,
          total: works.total || 0
        }
      }
    };
  } catch (error) {
    console.error('Error fetching tattoo works:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, total: 0 } } };
  }
}

/**
 * Fetch testimonials
 */
export async function getTestimonials(limit = 10) {
  try {
    const testimonials = await $fetch('/api/content/testimonials', {
      query: { limit }
    });

    return {
      data: testimonials.data || [],
      meta: {}
    };
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return { data: [], meta: {} };
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
    const articles = await $fetch(`/api/content/blog/${type}`, {
      query: { limit }
    });

    return {
      data: articles.data || [],
      meta: {}
    };
  } catch (error) {
    console.error(`Error fetching ${type} articles:`, error);
    return { data: [], meta: {} };
  }
}

/**
 * Fetch featured developer projects
 */
export async function fetchFeaturedDevProjects(limit = 3) {
  try {
    const projects = await $fetch('/api/content/projects/featured', {
      query: { limit }
    });

    return {
      data: projects.data || [],
      meta: {}
    };
  } catch (error) {
    console.error('Error fetching featured dev projects:', error);
    return { data: [], meta: {} };
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