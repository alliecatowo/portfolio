import { useRuntimeConfig } from '#app'

/**
 * Interface for image transformation options 
 */
interface ImageOptions {
  width?: number;
  height?: number;
  fit?: string;
  format?: string;
  quality?: number;
  [key: string]: any;
}

/**
 * Interface for fetch options
 */
interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  [key: string]: any;
}

/**
 * Utility function to fetch data from Directus API
 * @param endpoint - API endpoint (e.g., 'items/blog')
 * @param params - Query parameters
 * @returns Fetched data
 */
export async function fetchFromDirectus(endpoint: string, params: Record<string, any> = {}) {
  const config = useRuntimeConfig()
  
  // Use the server-side API proxy instead of direct requests
  // This avoids CORS issues when deployed to Vercel
  let baseUrl = '/api/directus'

  // Add access token to params if not already present
  if (!params.access_token) {
    // Note: You may need to set up a proper token in your environment variables
    params.access_token = '' // No token needed if your API is public
  }

  // Convert params object to URL parameters
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }
    
    if (Array.isArray(value)) {
      // Handle array parameters (for filter, fields, etc.)
      value.forEach(val => queryParams.append(`${key}[]`, String(val)))
    } else if (typeof value === 'object' && value !== null) {
      // Handle object parameters (deep filters, etc.)
      queryParams.append(key, JSON.stringify(value))
    } else {
      queryParams.append(key, String(value))
    }
  })

  // Construct the URL with proper path joining and query parameters
  const url = `${baseUrl}/${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  
  console.log('Fetching from Directus URL:', url)
  
  try {
    // Use standard fetch - the server proxy will handle CORS issues
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'same-origin', // Include cookies for same-origin requests
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error fetching from Directus: ${error}`)
    return null
  }
}

/**
 * Fetch a single item from Directus
 * @param collection - Collection name
 * @param id - Item ID
 * @param params - Additional query parameters
 * @returns Fetched item
 */
export async function fetchItem(collection: string, id: string, params: Record<string, any> = {}) {
  return fetchFromDirectus(`${collection}/${id}`, params)
}

/**
 * Fetch multiple items from a collection
 * @param collection - Collection name
 * @param params - Query parameters
 * @returns Fetched items
 */
export async function fetchItems(collection: string, params: Record<string, any> = {}) {
  return fetchFromDirectus(collection, params)
}

/**
 * Fetch assets from Directus
 * @param fileId - ID of the file
 * @param params - Query parameters for transformations
 * @returns Asset URL
 */
export function getAssetUrl(fileId: string, params: Record<string, any> = {}) {
  const config = useRuntimeConfig()
  
  // Use the server-side API proxy instead of direct requests
  // This avoids CORS issues when deployed to Vercel
  let baseUrl = '/api/directus/assets'
  
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value))
    }
  })

  // Add the access token to assets as well
  if (!params.access_token) {
    // Note: You may need to set up a proper token in your environment variables
    queryParams.append('access_token', '') // No token needed if your API is public
  }
  
  // Return URL to asset through our proxy
  return `${baseUrl}/${fileId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
}

/**
 * Fetch wrapper for Directus API calls with authentication
 * This avoids CORS issues when deployed to Digital Ocean
 */
export async function directusFetch(endpoint: string, options: FetchOptions = {}): Promise<any> {
  const config = useRuntimeConfig()
  const apiUrl = config.public.directusUrl
  
  // Note: You may need to set up a proper token in your environment variables
  const token = '' // No token needed if your API is public

  const url = `${apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  // Set up headers with authentication
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  }

  try {
    // Make the request
    const response = await fetch(url, {
      ...options,
      headers
    })

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Directus API error: ${response.status} ${response.statusText}`)
    }

    // Parse and return the JSON response
    return await response.json()
  } catch (error) {
    console.error('Error fetching from Directus:', error)
    throw error
  }
}

/**
 * Helper to get the direct asset URL for a Directus asset on Digital Ocean
 * This avoids CORS issues when deployed to Digital Ocean
 */
export function getDigitalOceanAssetUrl(assetId: string, options: ImageOptions = {}): string {
  const config = useRuntimeConfig()
  const apiUrl = config.public.directusUrl
  
  // Convert options to query parameters
  const queryParams = new URLSearchParams()
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value))
    }
  })
  
  // Return direct URL to the asset
  return `${apiUrl}/assets/${assetId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
} 