import { useDirectus } from '~/composables/useDirectus';

/**
 * Fetch all developer projects from Directus
 * @param params Optional parameters to pass to the API
 * @returns Array of project objects
 */
export async function fetchAllDevProjects(params = {}) {
  const { fetchProjects } = useDirectus();
  
  try {
    const projects = await fetchProjects({
      ...params
    });
    
    // Log for debugging
    console.log('Fetched projects from Directus:', projects);
    
    return projects || [];
  } catch (error) {
    console.error('Error fetching all developer projects from Directus:', error);
    return [];
  }
}

/**
 * Fetch a specific project by slug
 * @param slug The slug of the project
 * @returns Project object or null
 */
export async function fetchProjectBySlug(slug: string) {
  const { fetchProjects } = useDirectus();
  
  try {
    const projects = await fetchProjects({
      filter: {
        slug: {
          _eq: slug
        }
      }
    });
    
    // Log for debugging
    console.log('Fetched project by slug from Directus:', projects);
    
    // Return the first matching project
    return projects && projects.length > 0 ? projects[0] : null;
  } catch (error) {
    console.error(`Error fetching project with slug "${slug}" from Directus:`, error);
    return null;
  }
}

/**
 * Fetch all blog posts from Directus
 * @param params Optional parameters to pass to the API
 * @returns Array of blog post objects
 */
export async function fetchAllBlogPosts(params = {}) {
  const { fetchBlogPosts } = useDirectus();
  
  try {
    const posts = await fetchBlogPosts({
      ...params
    });
    
    // Log for debugging
    console.log('Fetched blog posts from Directus:', posts);
    
    return posts || [];
  } catch (error) {
    console.error('Error fetching all blog posts from Directus:', error);
    return [];
  }
}

/**
 * Fetch a specific blog post by slug
 * @param slug The slug of the blog post
 * @returns Blog post object or null
 */
export async function fetchBlogPostBySlug(slug: string) {
  const { fetchBlogPosts } = useDirectus();
  
  try {
    const posts = await fetchBlogPosts({
      filter: {
        slug: {
          _eq: slug
        }
      }
    });
    
    // Log for debugging
    console.log('Fetched blog post by slug from Directus:', posts);
    
    // Return the first matching post
    return posts && posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error(`Error fetching blog post with slug "${slug}" from Directus:`, error);
    return null;
  }
}

/**
 * Fetch all gallery items from Directus
 * @param params Optional parameters to pass to the API
 * @returns Array of gallery item objects
 */
export async function fetchAllGalleryItems(params = {}) {
  const { fetchGalleryItems } = useDirectus();
  
  try {
    const items = await fetchGalleryItems({
      ...params
    });
    
    // Log for debugging
    console.log('Fetched gallery items from Directus:', items);
    
    return items || [];
  } catch (error) {
    console.error('Error fetching all gallery items from Directus:', error);
    return [];
  }
}

/**
 * Get asset URL for images with optional transformations
 * @param fileId ID of the file in Directus
 * @param params Optional transformation parameters
 * @returns URL to the asset
 */
export function getDirectusImageUrl(fileId: string, params = {}) {
  const { getImageUrl } = useDirectus();
  return getImageUrl(fileId, params);
} 