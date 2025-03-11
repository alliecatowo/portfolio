/**
 * Proxy API route for Directus
 * 
 * This server-side route proxies requests to Directus API, 
 * adding CORS headers and handling authentication.
 */
import { defineEventHandler, getQuery, readBody } from 'h3'
import { useRuntimeConfig } from '#app'

export default defineEventHandler(async (event) => {
  // Get runtime config
  const config = useRuntimeConfig()
  
  // Get the URL path parts after /api/directus/
  const path = event.context.params._?.split('/') || []
  const endpoint = path.join('/')
  
  // Get query parameters
  const query = getQuery(event)
  
  // Add access token if not provided
  if (!query.access_token) {
    query.access_token = config.public.directusToken
  }
  
  // Build Directus API URL
  let baseUrl = config.public.directusUrl
  
  // Create a fully qualified URL with proper protocol
  let apiUrl = baseUrl.startsWith('http') 
    ? baseUrl 
    : `https://${baseUrl}`
  
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
  
  // Construct full URL
  const url = `${apiUrl}/${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  
  console.log(`[API Proxy] Forwarding request to: ${url}`)
  
  try {
    // Get request method
    const method = event.node.req.method || 'GET'
    
    // Prepare fetch options
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    }
    
    // Handle request body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const body = await readBody(event)
      fetchOptions.body = JSON.stringify(body)
    }
    
    // Make the request to Directus
    const response = await fetch(url, fetchOptions)
    
    // Get response data
    const data = await response.json()
    
    return data
  } catch (error) {
    console.error(`[API Proxy] Error forwarding request: ${error}`)
    
    return {
      error: true,
      message: `API Proxy Error: ${error.message}`
    }
  }
}) 