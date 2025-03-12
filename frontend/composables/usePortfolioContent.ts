import { ref } from 'vue';
import { useDirectus } from '~/composables/useDirectus';
import { fetchAllBlogPosts, fetchAllGalleryItems } from '~/utils/api/directus';

/**
 * Content management API for the portfolio
 * Provides functionality for fetching different types of content
 */
export function usePortfolioContent() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Safe access to useDirectus
  let imageUrlFunction: (fileId: string, params?: any) => string;
  
  try {
    const directus = useDirectus();
    
    // Verify that getImageUrl exists and is a function
    if (directus && typeof directus.getImageUrl === 'function') {
      imageUrlFunction = directus.getImageUrl;
    } else {
      console.error('getImageUrl is not available or not a function in useDirectus');
      // Fallback function
      imageUrlFunction = (fileId: string, params = {}) => {
        return `https://directus.allisons.dev/assets/${fileId}`;
      };
    }
  } catch (err) {
    console.error('Error accessing useDirectus:', err);
    // Fallback function
    imageUrlFunction = (fileId: string, params = {}) => {
      return `https://directus.allisons.dev/assets/${fileId}`;
    };
  }

  /**
   * Get featured projects for the developer portfolio
   */
  const getFeaturedProjects = async (limit = 3) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      let fetchProjects;
      
      try {
        const directus = useDirectus();
        fetchProjects = directus.fetchProjects;
        
        if (typeof fetchProjects !== 'function') {
          throw new Error('fetchProjects is not a function');
        }
      } catch (err) {
        console.error('Error accessing fetchProjects:', err);
        return { data: [], meta: {} };
      }
      
      const response = await fetchProjects({
        filter: {
          featured: {
            _eq: true
          }
        },
        limit
      });
      
      // Handle different response formats
      let projects = [];
      if (response) {
        if (Array.isArray(response)) {
          projects = response;
        } else if (typeof response === 'object') {
          projects = response.data || [];
        }
      }
      
      return {
        data: projects.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          slug: project.slug,
          featured: project.featured,
          image: project.featured_image ? imageUrlFunction(project.featured_image) : null,
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
   * Get featured gallery items for the tattoo portfolio
   */
  const getFeaturedGalleryItems = async (limit = 3) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      let fetchGalleryItems;
      
      try {
        const directus = useDirectus();
        fetchGalleryItems = directus.fetchGalleryItems;
        
        if (typeof fetchGalleryItems !== 'function') {
          throw new Error('fetchGalleryItems is not a function');
        }
      } catch (err) {
        console.error('Error accessing fetchGalleryItems:', err);
        return { data: [], meta: {} };
      }
      
      const response = await fetchGalleryItems({
        filter: {
          featured: {
            _eq: true
          }
        },
        limit
      });
      
      // Handle different response formats
      let items = [];
      if (response) {
        if (Array.isArray(response)) {
          items = response;
        } else if (typeof response === 'object') {
          items = response.data || [];
        }
      }
      
      return {
        data: items.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          slug: item.slug,
          featured: item.featured,
          image: item.image ? imageUrlFunction(item.image) : null,
          style: item.category
        })),
        meta: { pagination: { page: 1, pageSize: limit, total: items.length } }
      };
    } catch (err) {
      console.error('Error fetching featured gallery items:', err);
      error.value = 'Failed to load gallery items';
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
      let fetchBlogPosts;
      
      try {
        const directus = useDirectus();
        fetchBlogPosts = directus.fetchBlogPosts;
        
        if (typeof fetchBlogPosts !== 'function') {
          throw new Error('fetchBlogPosts is not a function');
        }
      } catch (err) {
        console.error('Error accessing fetchBlogPosts:', err);
        return { data: [], meta: {} };
      }
      
      const filter: any = {};
      
      if (siteType !== 'both') {
        filter.portfolio_type = {
          _eq: siteType
        };
      }
      
      const response = await fetchBlogPosts({
        filter,
        sort: ['-date_published'],
        page,
        limit: pageSize
      });
      
      // Handle different response formats
      let posts = [];
      if (response) {
        if (Array.isArray(response)) {
          posts = response;
        } else if (typeof response === 'object') {
          posts = response.data || [];
        }
      }
      
      return {
        data: posts.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          summary: post.summary,
          slug: post.slug,
          date_published: post.date_published,
          featured_image: post.featured_image ? imageUrlFunction(post.featured_image) : null,
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
   * Get testimonials from gallery items with testimonial category
   */
  const getTestimonials = async (limit = 10) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      let fetchGalleryItems;
      
      try {
        const directus = useDirectus();
        fetchGalleryItems = directus.fetchGalleryItems;
        
        if (typeof fetchGalleryItems !== 'function') {
          throw new Error('fetchGalleryItems is not a function');
        }
      } catch (err) {
        console.error('Error accessing fetchGalleryItems for testimonials:', err);
        return { data: [], meta: {} };
      }
      
      const response = await fetchGalleryItems({
        filter: {
          category: {
            _eq: 'testimonial'
          }
        },
        limit
      });
      
      console.log('Raw testimonials response:', response);
      
      // Handle different response formats
      let testimonials = [];
      if (response) {
        if (Array.isArray(response)) {
          testimonials = response;
        } else if (typeof response === 'object') {
          testimonials = response.data || [];
        }
      }
      
      return {
        data: testimonials.map(testimonial => ({
          id: testimonial.id,
          client_name: testimonial.title,
          text: testimonial.description,
          rating: testimonial.rating || 5,
          image: testimonial.image ? imageUrlFunction(testimonial.image) : null
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
   * Get image URL from file ID
   */
  const getMediaUrl = (media: any) => {
    if (!media) return '';
    
    // If it's already a string URL, return it
    if (typeof media === 'string') return media;
    
    // If it's a Directus file ID, get the URL
    if (media.id) return imageUrlFunction(media.id);
    
    // Fallback
    return '';
  };

  return {
    isLoading,
    error,
    getMediaUrl,
    getFeaturedProjects,
    getFeaturedGalleryItems,
    getBlogPosts,
    getTestimonials,
  };
} 