/**
 * Proxy API route for Directus assets
 * 
 * This specialized route handles proxying image assets from Directus with proper MIME types
 */
import { defineEventHandler, getQuery, sendStream } from 'h3'

export default defineEventHandler(async (event) => {
  // Get directus config from environment variables
  const directusUrl = process.env.NUXT_PUBLIC_API_URL || 'https://allisons-portfolio-directus-9vxdi.ondigitalocean.app'
  const directusToken = process.env.NUXT_PUBLIC_DIRECTUS_TOKEN
  
  // Get the asset ID from path
  const path = event.context.params._?.split('/') || []
  const assetId = path.join('/')
  
  if (!assetId) {
    return {
      error: true,
      message: 'Asset ID is required'
    }
  }
  
  // Get query parameters for transformations
  const query = getQuery(event)
  
  // Add access token if not provided
  if (!query.access_token && directusToken) {
    query.access_token = directusToken
  }
  
  // Build Directus API URL
  // Create a fully qualified URL with proper protocol
  let apiUrl = directusUrl.startsWith('http') 
    ? directusUrl 
    : `https://${directusUrl}`
  
  // Remove trailing slash if present to avoid double slashes
  apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl
  
  // Convert query object to URL parameters
  const queryParams = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(val => queryParams.append(`${key}[]`, String(val)))
      } else {
        queryParams.append(key, String(value))
      }
    }
  })
  
  // Construct full URL for asset
  const url = `${apiUrl}/assets/${assetId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  
  console.log(`[API Proxy] Forwarding asset request to: ${url}`)
  
  try {
    // Fetch the asset directly
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch asset: ${response.status}`)
    }
    
    // Get the content type
    const contentType = response.headers.get('content-type')
    if (contentType) {
      event.node.res.setHeader('Content-Type', contentType)
    }
    
    // Stream the response
    return sendStream(event, response.body)
  } catch (error) {
    console.error(`[API Proxy] Error fetching asset: ${error.message}`)
    
    return {
      error: true,
      message: `API Proxy Error: ${error.message}`
    }
  }
}) 