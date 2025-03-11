import { ref } from 'vue';
import { fetchAPI, formatStrapiResponse, formatStrapiResponseItem, getStrapiMedia } from '~/utils/api/strapi';

/**
 * Composable for accessing Strapi content from components
 */
export function useStrapi() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Get featured projects for the developer portfolio
   */
  const getFeaturedProjects = async (limit = 3) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await fetchAPI('/projects', {
        populate: '*',
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
    } catch (err) {
      console.error('Error fetching featured projects:', err);
      error.value = 'Failed to load projects';
      return { data: [], meta: {} };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get featured tattoo works for the tattoo portfolio
   */
  const getFeaturedTattooWorks = async (limit = 3) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await fetchAPI('/tattoo-works', {
        populate: '*',
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
    } catch (err) {
      console.error('Error fetching featured tattoo works:', err);
      error.value = 'Failed to load tattoo works';
      return { data: [], meta: {} };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get blog posts with optional filtering
   */
  const getBlogPosts = async (page = 1, pageSize = 10, siteType: 'dev' | 'tattoo' | 'both' = 'both') => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const filters: any = {};
      
      if (siteType !== 'both') {
        filters.siteType = {
          $eq: siteType,
        };
      }
      
      const response = await fetchAPI('/posts', {
        populate: '*',
        pagination: {
          page,
          pageSize,
        },
        sort: ['publishedAt:desc'],
        filters,
      });
      
      return formatStrapiResponse(response);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      error.value = 'Failed to load blog posts';
      return { data: [], meta: {} };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    getStrapiMedia,
    getFeaturedProjects,
    getFeaturedTattooWorks,
    getBlogPosts,
  };
} 