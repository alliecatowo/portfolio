/**
 * Debug script for Nuxt prerendering issues
 * 
 * This script is used to debug prerendering issues with Nuxt on Digital Ocean.
 * It simulates fetching data from Directus and verifies the response.
 */

// Import fetch for Node.js
const fetch = require('node-fetch');

// Test the Directus API connection
async function testDirectusConnection() {
  console.log('Testing Directus API connection...');
  
  const apiUrl = process.env.NUXT_PUBLIC_API_URL || 'https://directus.allisons.dev';
  const apiToken = process.env.NUXT_PUBLIC_DIRECTUS_TOKEN || '2eEMQA40l35OBtWNH6nDS166k0o800sb';
  
  // Test endpoints
  const endpoints = [
    'blog_posts?limit=1',
    'projects?limit=1',
    'gallery?limit=1'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const url = `${apiUrl}/items/${endpoint}`;
      console.log(`Fetching from: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        }
      });
      
      if (!response.ok) {
        console.error(`Error fetching from ${endpoint}: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`Successfully fetched from ${endpoint}:`, JSON.stringify(data).substring(0, 100) + '...');
    } catch (error) {
      console.error(`Error testing ${endpoint}:`, error.message);
    }
  }
}

// Execute tests
(async () => {
  try {
    console.log('*** Starting Debug Prerender Tests ***');
    console.log('Current environment:', process.env.NODE_ENV);
    console.log('Current platform:', process.platform);
    
    await testDirectusConnection();
    
    console.log('*** Debug Prerender Tests Completed ***');
  } catch (error) {
    console.error('*** Debug Prerender Tests Failed ***', error);
    process.exit(1);
  }
})(); 