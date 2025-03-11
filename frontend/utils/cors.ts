/**
 * CORS utility functions for handling Vercel domains
 */

/**
 * Check if a URL is a Vercel deployment URL
 * @param url - URL to check
 * @returns boolean indicating if the URL is a Vercel deployment
 */
export function isVercelUrl(url: string): boolean {
  // Check for vercel.app domains
  if (url.includes('.vercel.app')) {
    return true;
  }
  
  // Check for vercel preview URLs (*.vercel.app)
  if (url.match(/[a-z0-9-]+\.vercel\.app/i)) {
    return true;
  }
  
  // Check for Vercel branch preview URLs
  if (url.match(/[a-z0-9-]+-[a-z0-9-]+\.vercel\.app/i)) {
    return true;
  }
  
  return false;
}

/**
 * Get allowed CORS origins including Vercel domains
 * @param baseOrigins - Base origins to include
 * @returns Array of allowed origins
 */
export function getAllowedOrigins(baseOrigins: string[] = []): string[] {
  // Start with the base origins
  const origins = [...baseOrigins];
  
  // Add common development origins
  origins.push('http://localhost:3000');
  origins.push('https://localhost:3000');
  
  // Add production domains
  origins.push('https://alliecatowo.com');
  origins.push('https://www.alliecatowo.com');
  origins.push('https://allisons.dev');
  origins.push('https://www.allisons.dev');
  
  // Add Vercel domains for the main project
  origins.push('https://portfolio-alliecatowo.vercel.app');
  
  return origins;
} 