import { ref } from 'vue';
import { useDirectus } from '~/composables/useDirectus';
import { fetchAllBlogPosts, fetchAllDevProjects, fetchAllGalleryItems } from '~/utils/api/directus';

/**
 * Compatibility layer for Strapi API using Directus
 * This allows components that were originally built for Strapi to work with Directus
 * without requiring major refactoring
 */
export function useStrapi() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const { getImageUrl } = useDirectus();

  /**
   * Get featured projects for the developer portfolio
   */
  const getFeaturedProjects = async (limit = 3) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const projects = await fetchAllDevProjects({
        filter: {
          featured: {
            _eq: true
          }
        },
        limit
      });
      
      // Format response to match Strapi format
      return {
        data: projects.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          slug: project.slug,
          featured: project.featured,
          image: project.featured_image ? getImageUrl(project.featured_image) : null,
          github_url: project.github_url,
          demo_url: project.demo_url,
          technologies: project.technologies || []
        })),
        meta: { pagination: { page: 1, pageSize: limit, total: projects.length } }
      };
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
      const works = await fetchAllGalleryItems({
        filter: {
          featured: {
            _eq: true
          },
          type: {
            _eq: 'tattoo'
          }
        },
        limit
      });
      
      // Format response to match Strapi format
      return {
        data: works.map(work => ({
          id: work.id,
          title: work.title,
          description: work.description,
          slug: work.slug,
          featured: work.featured,
          image: work.image ? getImageUrl(work.image) : null,
          style: work.category
        })),
        meta: { pagination: { page: 1, pageSize: limit, total: works.length } }
      };
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
      const filter: any = {};
      
      if (siteType !== 'both') {
        filter.portfolio_type = {
          _eq: siteType
        };
      }
      
      const posts = await fetchAllBlogPosts({
        filter,
        sort: ['-date_published'],
        page,
        limit: pageSize
      });
      
      // Format response to match Strapi format
      return {
        data: posts.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          summary: post.summary,
          slug: post.slug,
          date_published: post.date_published,
          featured_image: post.featured_image ? getImageUrl(post.featured_image) : null,
          portfolio_type: post.portfolio_type
        })),
        meta: { pagination: { page, pageSize, total: posts.length } }
      };
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      error.value = 'Failed to load blog posts';
      return { data: [], meta: {} };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get testimonials
   */
  const getTestimonials = async (limit = 10) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const testimonials = await fetchAllGalleryItems({
        filter: {
          category: {
            _eq: 'testimonial'
          }
        },
        limit
      });
      
      // Format response to match Strapi format
      return {
        data: testimonials.map(testimonial => ({
          id: testimonial.id,
          client_name: testimonial.title,
          text: testimonial.description,
          rating: testimonial.rating || 5,
          image: testimonial.image ? getImageUrl(testimonial.image) : null
        })),
        meta: { pagination: { page: 1, pageSize: limit, total: testimonials.length } }
      };
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      error.value = 'Failed to load testimonials';
      return { data: [], meta: {} };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get media URL (compatibility function)
   */
  const getStrapiMedia = (media: any) => {
    if (!media) return '';
    
    // If it's already a string URL, return it
    if (typeof media === 'string') return media;
    
    // If it's a Directus file ID, get the URL
    if (media.id) return getImageUrl(media.id);
    
    // Fallback
    return '';
  };

  return {
    isLoading,
    error,
    getStrapiMedia,
    getFeaturedProjects,
    getFeaturedTattooWorks,
    getBlogPosts,
    getTestimonials,
  };
} 