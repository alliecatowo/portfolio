/**
 * Service to fetch and handle content from Strapi
 */
import { fetchAPI, formatStrapiResponse, formatStrapiResponseItem } from './strapi';

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