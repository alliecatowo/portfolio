/**
 * Service to fetch and handle content
 */
import { useDirectus } from '~/composables/useDirectus';

// Types
export interface Project {
  id: string;
  title: string;
  description: string;
  slug: string;
  cover_image?: any;
  technologies?: any[];
  github?: string;
  live_url?: string;
  featured?: boolean;
  category?: any;
}

export interface TattooWork {
  id: string;
  title: string;
  description: string;
  image?: any;
  featured?: boolean;
  client_testimonial?: string;
  date?: string;
  style?: any;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  slug: string;
  cover_image?: any;
  excerpt?: string;
  portfolio_type?: 'dev' | 'tattoo' | 'both';
  date_published?: string;
  featured?: boolean;
  category?: any;
}

/**
 * Fetch blog posts with pagination and filtering
 * @param page - The page number
 * @param pageSize - Number of items per page
 * @param filters - Filtering options
 * @returns Paginated list of blog posts
 */
export async function getPosts(page = 1, pageSize = 10, filters = {}) {
  try {
    const { fetchBlogPosts } = useDirectus();
    
    const response = await fetchBlogPosts({
      filter: filters,
      page,
      limit: pageSize
    });

    return {
      data: response.data || [],
      meta: {
        pagination: {
          page: page,
          pageSize: pageSize,
          total: response.meta?.total_count || 0
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
 * @param slug - The post slug
 * @returns The blog post data
 */
export async function getPostBySlug(slug: string) {
  try {
    const { fetchBlogPosts } = useDirectus();
    
    const response = await fetchBlogPosts({
      filter: {
        slug: {
          _eq: slug
        }
      }
    });

    if (response && response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

/**
 * Fetch developer projects with pagination and filtering
 * @param page - The page number
 * @param pageSize - Number of items per page
 * @param filters - Filtering options
 * @returns Paginated list of projects
 */
export async function getProjects(page = 1, pageSize = 10, filters = {}) {
  try {
    const { fetchProjects } = useDirectus();
    
    const response = await fetchProjects({
      filter: filters,
      page,
      limit: pageSize
    });

    return {
      data: response.data || [],
      meta: {
        pagination: {
          page: page,
          pageSize: pageSize,
          total: response.meta?.total_count || 0
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
 * @param slug - The project slug
 * @returns The project data
 */
export async function getProjectBySlug(slug: string) {
  try {
    const { fetchProjects } = useDirectus();
    
    const response = await fetchProjects({
      filter: {
        slug: {
          _eq: slug
        }
      }
    });

    if (response && response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }
}

/**
 * Fetch tattoo works with pagination and filtering
 * @param page - The page number
 * @param pageSize - Number of items per page
 * @param filters - Filtering options
 * @returns Paginated list of tattoo works
 */
export async function getTattooWorks(page = 1, pageSize = 10, filters = {}) {
  try {
    const { fetchGalleryItems } = useDirectus();
    
    const response = await fetchGalleryItems({
      filter: {
        type: {
          _eq: 'tattoo'
        },
        ...filters
      },
      page,
      limit: pageSize
    });

    return {
      data: response.data || [],
      meta: {
        pagination: {
          page: page,
          pageSize: pageSize,
          total: response.meta?.total_count || 0
        }
      }
    };
  } catch (error) {
    console.error('Error fetching tattoo works:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, total: 0 } } };
  }
}

/**
 * Fetch a single tattoo work by slug
 * @param slug - The tattoo work slug
 * @returns The tattoo work data
 */
export async function getTattooWorkBySlug(slug: string) {
  try {
    const { fetchGalleryItems } = useDirectus();
    
    const response = await fetchGalleryItems({
      filter: {
        type: {
          _eq: 'tattoo'
        },
        slug: {
          _eq: slug
        }
      }
    });

    if (response && response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching tattoo work by slug:', error);
    return null;
  }
}

/**
 * Fetch testimonials
 * @param limit - Number of testimonials to fetch
 * @returns List of testimonials
 */
export async function getTestimonials(limit = 10) {
  try {
    const { fetchItems } = useDirectus();
    
    const response = await fetchItems('testimonials', {
      filter: {
        featured: {
          _eq: true
        }
      },
      limit
    });

    return {
      data: response.data || [],
      meta: response.meta || {}
    };
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return { data: [], meta: {} };
  }
}

/**
 * Get asset URL for images
 * @param fileId - The file ID
 * @param params - Optional parameters for transformations
 * @returns The asset URL
 */
export function getAssetUrl(fileId: string, params = {}) {
  const { getImageUrl } = useDirectus();
  return getImageUrl(fileId, params);
}

/**
 * Fetch articles by portfolio type
 * @param type - The portfolio type (dev, tattoo, both)
 * @param limit - Number of articles to fetch
 * @returns List of articles
 */
export async function getArticlesByPortfolioType(type: 'dev' | 'tattoo' | 'both', limit = 3) {
  try {
    const { fetchBlogPosts } = useDirectus();
    
    const response = await fetchBlogPosts({
      filter: {
        portfolio_type: {
          _eq: type
        }
      },
      limit
    });

    return {
      data: response.data || [],
      meta: response.meta || {}
    };
  } catch (error) {
    console.error(`Error fetching ${type} articles:`, error);
    return { data: [], meta: {} };
  }
}

/**
 * Fetch featured developer projects
 * @param limit - Number of projects to fetch
 * @returns List of featured projects
 */
export async function fetchFeaturedDevProjects(limit = 3) {
  try {
    const { fetchProjects } = useDirectus();
    
    const response = await fetchProjects({
      filter: {
        featured: {
          _eq: true
        }
      },
      limit
    });

    return {
      data: response.data || [],
      meta: response.meta || {}
    };
  } catch (error) {
    console.error('Error fetching featured dev projects:', error);
    return { data: [], meta: {} };
  }
}

/**
 * Fetch all developer projects
 */
export async function fetchAllDevProjects(params = {}) {
  try {
    const response = await fetchProjects({
      sort: ['updatedAt:desc'],
      ...params
    });
    
    return formatStrapiResponse(response);
  } catch (error) {
    console.error('Error fetching all developer projects:', error);
    return { data: [], meta: {} };
  }
}

/**
 * Fetch featured tattoo works
 */
export async function fetchFeaturedTattooWorks() {
  try {
    const response = await fetchAPI('/tattoo-works', {
      filters: {
        featured: {
          $eq: true
        }
      },
      populate: '*',
      pagination: {
        limit: 3
      },
      sort: ['date:desc']
    });
    
    return formatStrapiResponse(response);
  } catch (error) {
    console.error('Error fetching featured tattoo works:', error);
    return { data: [], meta: {} };
  }
}

/**
 * Fetch all tattoo works
 */
export async function fetchAllTattooWorks(params = {}) {
  try {
    const response = await fetchTattooWorks({
      sort: ['date:desc'],
      ...params
    });
    
    return formatStrapiResponse(response);
  } catch (error) {
    console.error('Error fetching all tattoo works:', error);
    return { data: [], meta: {} };
  }
}

/**
 * Fetch recent blog posts for a specific portfolio type
 * @param type - The portfolio type (dev, tattoo, both)
 * @param limit - Number of posts to fetch
 * @returns List of recent blog posts
 */
export async function fetchRecentBlogPosts(type: 'dev' | 'tattoo' | 'both', limit = 3) {
  try {
    const { fetchBlogPosts } = useDirectus();
    
    const response = await fetchBlogPosts({
      filter: {
        portfolio_type: {
          _eq: type
        }
      },
      sort: ['-date_published'],
      limit
    });

    return {
      data: response.data || [],
      meta: response.meta || {}
    };
  } catch (error) {
    console.error('Error fetching recent blog posts:', error);
    return { data: [], meta: {} };
  }
}

/**
 * Fetch all blog posts for a specific portfolio type
 */
export async function fetchAllBlogPosts(portfolioType: 'dev' | 'tattoo' | 'both', page = 1, pageSize = 10) {
  try {
    const { fetchBlogPosts } = useDirectus();
    
    const response = await fetchBlogPosts({
      filter: {
        portfolio_type: {
          _eq: portfolioType
        }
      },
      sort: ['-date_published'],
      page,
      limit: pageSize
    });
    
    return {
      data: response.data || [],
      meta: {
        pagination: {
          page: page,
          pageSize: pageSize,
          total: response.meta?.total_count || 0
        }
      }
    };
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, total: 0 } } };
  }
}

/**
 * Fetch content for the developer landing page
 */
export async function fetchDevLandingContent() {
  try {
    // Get featured projects
    let featuredProjects = { data: [] };
    try {
      featuredProjects = await fetchFeaturedDevProjects();
    } catch (error) {
      console.error('Error fetching featured dev projects:', error);
    }
    
    // Get recent blog posts
    let recentPosts = { data: [] };
    try {
      recentPosts = await fetchRecentBlogPosts('dev');
    } catch (error) {
      console.error('Error fetching recent developer blog posts:', error);
    }
    
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

/**
 * Fetch content for the tattoo landing page
 */
export async function fetchTattooLandingContent() {
  try {
    // Get featured tattoo works
    let featuredWorks = { data: [] };
    try {
      const { fetchGalleryItems } = useDirectus();
      
      const response = await fetchGalleryItems({
        filter: {
          type: {
            _eq: 'tattoo'
          },
          featured: {
            _eq: true
          }
        },
        limit: 6
      });
      
      featuredWorks = {
        data: response.data || [],
        meta: response.meta || {}
      };
    } catch (error) {
      console.error('Error fetching featured tattoo works:', error);
    }
    
    // Get recent blog posts
    let recentPosts = { data: [] };
    try {
      recentPosts = await fetchRecentBlogPosts('tattoo');
    } catch (error) {
      console.error('Error fetching recent tattoo blog posts:', error);
    }
    
    // Get testimonials
    let testimonials = { data: [] };
    try {
      testimonials = await getTestimonials(3);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
    
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