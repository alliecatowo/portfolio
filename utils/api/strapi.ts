/**
 * Utility functions for interacting with Strapi API
 */

// Get Strapi URL from environment variable
const getStrapiURL = (path = '') => {
  const runtimeConfig = useRuntimeConfig();
  return `${runtimeConfig.public.strapiUrl}${path}`;
};

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param endpoint - The endpoint to request data from
 * @param params - Query parameters for the request
 * @returns The API response data
 */
export async function fetchAPI(endpoint: string, params = {}) {
  const runtimeConfig = useRuntimeConfig();
  const queryString = Object.keys(params).length > 0
    ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
    : '';

  try {
    const response = await fetch(
      `${getStrapiURL(`/api${endpoint}${queryString}`)}`, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${runtimeConfig.strapiToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Error fetching from Strapi:', await response.text());
      throw new Error(`Error fetching from Strapi: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    return null;
  }
}

/**
 * Get the full URL for a Strapi media asset
 * @param mediaPath - The path to the media asset
 * @returns The full URL to the media asset
 */
export function getStrapiMedia(mediaPath: string) {
  if (!mediaPath) return null;

  // If the media path is a full URL (external media), return it as is
  if (mediaPath.startsWith('http') || mediaPath.startsWith('//')) {
    return mediaPath;
  }

  // Otherwise, return the URL with the Strapi URL prepended
  return `${getStrapiURL(mediaPath)}`;
}

/**
 * Format Strapi response data for collection types
 * @param response - The Strapi API response
 * @returns Formatted response with data and pagination
 */
export function formatStrapiResponse(response: any) {
  if (!response || !response.data) {
    return { data: [], meta: {} };
  }

  const formattedData = Array.isArray(response.data)
    ? response.data.map((item: any) => ({ id: item.id, ...item.attributes }))
    : [];

  return {
    data: formattedData,
    meta: response.meta,
  };
}

/**
 * Format Strapi response data for single types or single items
 * @param response - The Strapi API response
 * @returns Formatted response item
 */
export function formatStrapiResponseItem(response: any) {
  if (!response || !response.data) {
    return null;
  }

  // Handle single item
  return {
    id: response.data.id,
    ...response.data.attributes,
  };
} 