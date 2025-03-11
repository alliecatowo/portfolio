import { useRuntimeConfig } from '#app'

/**
 * Utility function to fetch data from Directus API
 * @param endpoint - API endpoint (e.g., 'items/blog')
 * @param params - Query parameters
 * @returns Fetched data
 */
export async function fetchFromDirectus(endpoint: string, params: Record<string, any> = {}) {
  const config = useRuntimeConfig()
  const baseUrl = config.public.directusUrl

  // Convert params object to URL parameters
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Handle array parameters (for filter, fields, etc.)
      value.forEach(val => queryParams.append(`${key}[]`, val))
    } else if (typeof value === 'object' && value !== null) {
      // Handle object parameters (deep filters, etc.)
      queryParams.append(key, JSON.stringify(value))
    } else {
      queryParams.append(key, String(value))
    }
  })

  const url = `${baseUrl}/items/${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  
  try {
    const response = await fetch(url)
    
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
  const baseUrl = config.public.directusUrl
  
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value))
  })
  
  return `${baseUrl}/assets/${fileId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
} 