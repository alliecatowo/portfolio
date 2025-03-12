import { H3Error } from 'h3';

export default function(error: H3Error) {
  console.error('Server error:', error);
  
  // Only show detailed errors in development
  const isDev = process.env.NODE_ENV !== 'production';
  
  return {
    statusCode: error.statusCode || 500,
    statusMessage: error.statusMessage || 'Internal Server Error',
    stack: isDev ? error.stack : undefined,
    data: {
      message: error.message,
      // Include the original error details in development
      ...(isDev ? { 
        name: error.name,
        cause: error.cause,
        data: error.data
      } : {})
    }
  };
} 