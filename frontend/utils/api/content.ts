/**
 * Service to fetch and handle content from Strapi
 */
import { 
  fetchAPI, 
  formatStrapiResponse, 
  formatStrapiResponseItem, 
  fetchProjects,
  fetchTattooWorks,
  fetchArticlesByPortfolioType,
} from './strapi';

// Import types using type import to prevent runtime errors
import type { 
  Project, 
  TattooWork, 
  Article 
} from './strapi';

/**
 * Fetch blog posts with pagination and filtering
 * @param page - The page number
 * @param pageSize - Number of items per page
 * @param filters - Filtering options
 * @returns Paginated list of blog posts
 */
export async function getPosts(page = 1, pageSize = 10, filters = {}) {
  // Construct the query parameters
  const params = {
    populate: ['image', 'categories', 'author.avatar'],
    sort: ['publishedAt:desc'],
    pagination: {
      page,
      pageSize,
    },
    ...filters,
  };

  try {
    const response = await fetchAPI('/posts', {
      populate: '*',
      pagination: {
        page: params.pagination.page,
        pageSize: params.pagination.pageSize,
      },
      sort: params.sort,
      filters: filters,
    });

    return formatStrapiResponse(response);
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
    const response = await fetchAPI('/posts', {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: '*',
    });

    if (response && response.data && response.data.length > 0) {
      return formatStrapiResponseItem({ data: response.data[0] });
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
  // Construct the query parameters
  const params = {
    populate: ['images', 'technologies', 'category'],
    sort: ['publishedAt:desc'],
    pagination: {
      page,
      pageSize,
    },
    ...filters,
  };

  try {
    const response = await fetchAPI('/projects', {
      populate: '*',
      pagination: {
        page: params.pagination.page,
        pageSize: params.pagination.pageSize,
      },
      sort: params.sort,
      filters: filters,
    });

    return formatStrapiResponse(response);
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
    const response = await fetchAPI('/projects', {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: '*',
    });

    if (response && response.data && response.data.length > 0) {
      return formatStrapiResponseItem({ data: response.data[0] });
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
  // Construct the query parameters
  const params = {
    populate: ['images', 'styles', 'details'],
    sort: ['publishedAt:desc'],
    pagination: {
      page,
      pageSize,
    },
    ...filters,
  };

  try {
    const response = await fetchAPI('/tattoo-works', {
      populate: '*',
      pagination: {
        page: params.pagination.page,
        pageSize: params.pagination.pageSize,
      },
      sort: params.sort,
      filters: filters,
    });

    return formatStrapiResponse(response);
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
    const response = await fetchAPI('/tattoo-works', {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: '*',
    });

    if (response && response.data && response.data.length > 0) {
      return formatStrapiResponseItem({ data: response.data[0] });
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
    const response = await fetchAPI('/testimonials', {
      populate: ['client_image', 'tattoo_image'],
      sort: ['rating:desc'],
      pagination: {
        limit,
      },
      filters: {
        featured: {
          $eq: true,
        },
      },
    });

    return formatStrapiResponse(response);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return { data: [], meta: {} };
  }
}

/**
 * Fetch open source projects
 * @param limit - Number of projects to fetch
 * @returns List of open source projects
 */
export async function getOpenSourceProjects(limit = 10) {
  try {
    const response = await fetchAPI('/open-source-projects', {
      populate: ['image'],
      sort: ['stars:desc'],
      pagination: {
        limit,
      },
      filters: {
        featured: {
          $eq: true,
        },
      },
    });

    return formatStrapiResponse(response);
  } catch (error) {
    console.error('Error fetching open source projects:', error);
    return { data: [], meta: {} };
  }
}

/**
 * Fetch featured projects for the developer portfolio
 */
export async function fetchFeaturedDevProjects() {
  try {
    const response = await fetchAPI('/projects', {
      filters: {
        featured: {
          $eq: true
        }
      },
      populate: '*',
      pagination: {
        limit: 3
      },
      sort: ['updatedAt:desc']
    });
    
    return formatStrapiResponse(response);
  } catch (error) {
    console.error('Error fetching featured developer projects:', error);
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
 */
export async function fetchRecentBlogPosts(portfolioType: 'Developer' | 'Tattoo', limit = 3) {
  try {
    const response = await fetchArticlesByPortfolioType(portfolioType, {
      pagination: {
        limit
      },
      sort: ['publishedAt:desc']
    });
    
    return formatStrapiResponse(response);
  } catch (error) {
    console.error('Error fetching recent blog posts:', error);
    return { data: [], meta: {} };
  }
}

/**
 * Fetch all blog posts for a specific portfolio type
 */
export async function fetchAllBlogPosts(portfolioType: 'Developer' | 'Tattoo', params = {}) {
  try {
    const response = await fetchArticlesByPortfolioType(portfolioType, {
      sort: ['publishedAt:desc'],
      ...params
    });
    
    return formatStrapiResponse(response);
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
    return { data: [], meta: {} };
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
      recentPosts = await fetchRecentBlogPosts('Developer');
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
      featuredWorks = await fetchFeaturedTattooWorks();
    } catch (error) {
      console.error('Error fetching featured tattoo works:', error);
    }
    
    // Get recent blog posts
    let recentPosts = { data: [] };
    try {
      recentPosts = await fetchRecentBlogPosts('Tattoo');
    } catch (error) {
      console.error('Error fetching recent tattoo blog posts:', error);
    }
    
    return {
      featuredWorks,
      recentPosts
    };
  } catch (error) {
    console.error('Error fetching tattoo landing page content:', error);
    return {
      featuredWorks: { data: [] },
      recentPosts: { data: [] }
    };
  }
} 