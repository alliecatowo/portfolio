/**
 * Health check endpoint for Digital Ocean App Platform
 * This endpoint is used to verify the application is running properly
 */
export default defineEventHandler((event) => {
  try {
    // Basic health check response
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      version: '1.0.0'
    };
  } catch (error) {
    console.error('Health check failed:', error);
    
    // Set HTTP status code to 500 on error
    event.node.res.statusCode = 500;
    
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV !== 'production' ? error.message : 'Internal server error'
    };
  }
}); 