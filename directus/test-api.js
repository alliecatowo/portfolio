// Script to test Directus API access
// Import fetch for older Node.js versions
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const DIRECTUS_URL = 'https://allisons-portfolio-directus-9vxdi.ondigitalocean.app';
const API_TOKEN = '2eEMQA40l35OBtWNH6nDS166k0o800sb';

// Function to test fetching data from a collection
async function testCollection(collection) {
  console.log(`Testing access to ${collection}...`);
  
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/${collection}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Successfully accessed ${collection}`);
      console.log(`Data received: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
    } else {
      console.log(`❌ Failed to access ${collection}: ${response.status} ${response.statusText}`);
      console.log(`Error: ${JSON.stringify(data, null, 2)}`);
    }
    
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.log(`❌ Error accessing ${collection}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Function to test accessing system collections
async function testSystemCollections() {
  // Test access to roles
  await testCollection('directus_roles');
  
  // Test access to permissions
  await testCollection('directus_permissions');
}

// Main function to run tests
async function runTests() {
  console.log('🔍 Testing Directus API Access with provided token...\n');
  
  // Test content collections
  await testCollection('blog_posts');
  await testCollection('projects');
  await testCollection('gallery');
  
  // Test file access
  await testCollection('directus_files');
  
  // Test system collections
  console.log('\n🔧 Testing access to system collections...');
  await testSystemCollections();
}

// Run the tests
runTests().then(() => {
  console.log('\n✅ Tests completed');
});