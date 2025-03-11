/**
 * CORS utility functions for handling trusted deployment domains
 */

/**
 * Check if a URL is a Digital Ocean deployment URL
 * 
 * @param url The URL to check
 * @returns boolean indicating if the URL is a Digital Ocean deployment
 */
export function isDigitalOceanUrl(url: string): boolean {
  // Check for ondigitalocean.app domains
  if (url.includes('.ondigitalocean.app')) {
    return true;
  }
  
  // Check for droplet or app platform specific domains
  if (url.includes('.digitaloceanspaces.com')) {
    return true;
  }
  
  return false;
}

/**
 * Get allowed origins for CORS
 * This includes our known domains and Digital Ocean preview URLs
 * 
 * @returns string[] Array of allowed origins
 */
export function getAllowedOrigins(): string[] {
  // Base allowed domains
  const allowedDomains = [
    'https://allisons.dev',
    'https://tattoo.allisons.dev',
    'https://www.allisons.dev',
    'http://localhost:3000'
  ];
  
  // Will dynamically add Digital Ocean preview URLs if detected
  
  return allowedDomains;
}

/**
 * Handle CORS for a specific request/response
 * 
 * @param origin The origin of the request
 * @returns object with CORS headers
 */
export function getCorsHeaders(origin?: string): Record<string, string> {
  if (!origin) {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };
  }
  
  // Check if origin is allowed or is a Digital Ocean preview
  const isAllowed = getAllowedOrigins().includes(origin) || isDigitalOceanUrl(origin);
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : getAllowedOrigins()[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
} 