/**
 * Utility functions for interacting with Strapi API
 */

// Types
export interface Project {
  id: number;
  attributes: {
    title: string;
    description: string;
    slug: string;
    featuredImage: {
      data: {
        attributes: {
          url: string;
          alternativeText?: string;
        }
      }
    };
    technologies: string[];
    websiteUrl?: string;
    githubUrl?: string;
    featured: boolean;
    status: 'In Progress' | 'Completed' | 'Maintenance';
    category: {
      data: {
        id: number;
        attributes: {
          name: string;
          slug: string;
        }
      }
    };
    createdAt: string;
    updatedAt: string;
  }
}

export interface TattooWork {
  id: number;
  attributes: {
    title: string;
    description: string;
    image: {
      data: {
        attributes: {
          url: string;
          alternativeText?: string;
        }
      }
    };
    featured: boolean;
    clientTestimonial?: string;
    date: string;
    style: {
      data: {
        id: number;
        attributes: {
          name: string;
        }
      }
    };
    createdAt: string;
    updatedAt: string;
  }
}

export interface Article {
  id: number;
  attributes: {
    title: string;
    content: string;
    slug: string;
    coverImage: {
      data: {
        attributes: {
          url: string;
          alternativeText?: string;
        }
      }
    };
    summary: string;
    portfolioType: 'Developer' | 'Tattoo' | 'Both';
    publishedAt: string;
    featured: boolean;
    category: {
      data: {
        id: number;
        attributes: {
          name: string;
          slug: string;
        }
      }
    };
    createdAt: string;
    updatedAt: string;
  }
}

export interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
  }
}

export interface TattooStyle {
  id: number;
  attributes: {
    name: string;
    description: string;
  }
}

/**
 * Get the Strapi API URL
 */
const getStrapiURL = (path = '') => {
  return `${process.env.STRAPI_URL || 'http://localhost:1337'}${path}`;
};

/**
 * Basic fetch API implementation
 */
export async function fetchAPI(endpoint: string, params = {}) {
  const queryString = Object.keys(params).length > 0
    ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
    : '';
  
  const url = `${getStrapiURL(`/api${endpoint}${queryString}`)}`;
  
  try {
    console.log(`Fetching from Strapi: ${url}`);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      // For 404s, just return empty data without throwing
      if (response.status === 404) {
        console.warn(`Strapi endpoint not found (404): ${endpoint}`);
        return { data: [] };
      }
      
      console.error('Error fetching from Strapi:', await response.text());
      throw new Error(`Error fetching from Strapi: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint} from Strapi:`, error);
    // Return an empty data array rather than null to avoid further errors
    return { data: [] };
  }
}

/**
 * Get the URL for Strapi media assets
 */
export function getStrapiMedia(mediaPath: string) {
  if (!mediaPath) return null;
  if (mediaPath.startsWith('http') || mediaPath.startsWith('//')) {
    return mediaPath;
  }
  return `${getStrapiURL(mediaPath)}`;
}

/**
 * Format Strapi API response for consistent usage
 */
export function formatStrapiResponse(response: any) {
  if (!response || !response.data) {
    return { data: [], meta: {} };
  }
  
  const formattedData = Array.isArray(response.data) 
    ? response.data.map((item) => ({ id: item.id, ...item.attributes })) 
    : [];
  
  return {
    data: formattedData,
    meta: response.meta
  };
}

/**
 * Format a single Strapi item response
 */
export function formatStrapiResponseItem(response: any) {
  if (!response || !response.data) {
    return null;
  }
  
  return {
    id: response.data.id,
    ...response.data.attributes
  };
}

/**
 * Fetch all projects with filters
 */
export async function fetchProjects(params: any = {}) {
  try {
    const response = await fetchAPI('/projects', {
      populate: '*',
      ...params
    });
    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { data: [] };
  }
}

/**
 * Fetch a single project by slug
 */
export async function fetchProjectBySlug(slug: string) {
  try {
    const response = await fetchAPI('/projects', {
      filters: { slug: { $eq: slug } },
      populate: '*'
    });
    return response;
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return { data: [] };
  }
}

/**
 * Fetch all tattoo works with filters
 */
export async function fetchTattooWorks(params: any = {}) {
  try {
    const response = await fetchAPI('/tattoo-works', {
      populate: '*',
      ...params
    });
    return response;
  } catch (error) {
    console.error('Error fetching tattoo works:', error);
    return { data: [] };
  }
}

/**
 * Fetch a single tattoo work by ID
 */
export async function fetchTattooWorkById(id: number) {
  try {
    const response = await fetchAPI(`/tattoo-works/${id}`, {
      populate: '*'
    });
    return response;
  } catch (error) {
    console.error('Error fetching tattoo work by ID:', error);
    return { data: null };
  }
}

/**
 * Fetch all articles with filters
 */
export async function fetchArticles(params: any = {}) {
  try {
    const response = await fetchAPI('/articles', {
      populate: '*',
      ...params
    });
    return response;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { data: [] };
  }
}

/**
 * Fetch a single article by slug
 */
export async function fetchArticleBySlug(slug: string) {
  try {
    const response = await fetchAPI('/articles', {
      filters: { slug: { $eq: slug } },
      populate: '*'
    });
    return response;
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return { data: [] };
  }
}

/**
 * Fetch articles by portfolio type
 */
export async function fetchArticlesByPortfolioType(type: 'Developer' | 'Tattoo' | 'Both', params: any = {}) {
  try {
    const response = await fetchAPI('/articles', {
      filters: {
        portfolioType: {
          $in: [type, 'Both']
        }
      },
      populate: '*',
      ...params
    });
    return response;
  } catch (error) {
    console.error('Error fetching articles by portfolio type:', error);
    return { data: [] };
  }
}

/**
 * Fetch categories
 */
export async function fetchCategories() {
  try {
    const response = await fetchAPI('/categories', {
      populate: '*'
    });
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: [] };
  }
}

/**
 * Fetch tattoo styles
 */
export async function fetchTattooStyles() {
  try {
    const response = await fetchAPI('/tattoo-styles', {
      populate: '*'
    });
    return response;
  } catch (error) {
    console.error('Error fetching tattoo styles:', error);
    return { data: [] };
  }
} 