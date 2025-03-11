// Debug script to check API connectivity and environment variables
// Run this before the build to identify potential issues

const https = require('https');
const http = require('http');

console.log('=== Prerender Debug Script ===');
console.log('Node version:', process.version);
console.log('Environment variables:');
console.log('- NUXT_PUBLIC_API_URL:', process.env.NUXT_PUBLIC_API_URL || '(not set)');
console.log('- NUXT_PUBLIC_DIRECTUS_TOKEN:', process.env.NUXT_PUBLIC_DIRECTUS_TOKEN ? '(set)' : '(not set)');

// Check API connectivity
const apiUrl = process.env.NUXT_PUBLIC_API_URL || 'https://allisons-portfolio-directus-9vxdi.ondigitalocean.app';
console.log(`\nChecking connectivity to API: ${apiUrl}`);

const client = apiUrl.startsWith('https') ? https : http;
const request = client.get(apiUrl, (res) => {
  console.log(`API Status Code: ${res.statusCode}`);
  
  if (res.statusCode >= 200 && res.statusCode < 300) {
    console.log('✓ API connection successful');
  } else {
    console.log('⚠️ API returned non-success status code');
  }
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      // Try to parse as JSON to see if it's a valid API response
      JSON.parse(data);
      console.log('✓ API returned valid JSON');
    } catch (e) {
      console.log('⚠️ API did not return valid JSON');
      console.log('First 200 characters of response:', data.substring(0, 200));
    }
  });
});

request.on('error', (error) => {
  console.error('⚠️ API connection error:', error.message);
});

request.end();

// Check memory limits
const memoryUsage = process.memoryUsage();
console.log('\nMemory Usage:');
console.log('- RSS:', Math.round(memoryUsage.rss / 1024 / 1024), 'MB');
console.log('- Heap Total:', Math.round(memoryUsage.heapTotal / 1024 / 1024), 'MB');
console.log('- Heap Used:', Math.round(memoryUsage.heapUsed / 1024 / 1024), 'MB');

console.log('\nThis script helps identify potential issues with API connectivity and environment variables.');
console.log('If the API connection is successful but prerendering still fails, the issue might be with:');
console.log('1. Data fetching during prerendering');
console.log('2. Memory limits during the build process');
console.log('3. Timeout issues with API requests');
console.log('=== End of Debug Script ==='); 