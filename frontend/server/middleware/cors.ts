import { getAllowedOrigins, isVercelUrl } from '~/utils/cors';

export default defineEventHandler((event) => {
  // Get the request headers
  const headers = getRequestHeaders(event);
  const origin = headers.origin || '';
  
  // Get allowed origins
  const allowedOrigins = getAllowedOrigins();
  
  // Check if the origin is allowed or is a Vercel deployment
  if (allowedOrigins.includes(origin) || isVercelUrl(origin)) {
    // Set CORS headers
    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    });
  }
  
  // Handle preflight requests
  if (getMethod(event) === 'OPTIONS') {
    setResponseStatus(event, 204);
    return 'OK';
  }
}); 