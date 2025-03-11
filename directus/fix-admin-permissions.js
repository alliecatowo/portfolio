// Script to fix admin permissions in Directus
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const DIRECTUS_URL = 'https://allisons-portfolio-directus-9vxdi.ondigitalocean.app';
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;

let adminToken = null;
let adminRoleId = null;

// Function to authenticate as admin
async function authenticate() {
  console.log('👤 Authenticating as admin...');
  
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ Admin email or password not provided. Please set DIRECTUS_ADMIN_EMAIL and DIRECTUS_ADMIN_PASSWORD environment variables.');
    process.exit(1);
  }
  
  try {
    const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      adminToken = data.data.access_token;
      console.log('✅ Successfully authenticated as admin');
      return adminToken;
    } else {
      console.error('❌ Failed to authenticate:', data.errors?.[0]?.message || 'Unknown error');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error during authentication:', error.message);
    process.exit(1);
  }
}

// Function to get the admin role ID
async function getAdminRoleId() {
  console.log('🔍 Finding admin role ID...');
  
  try {
    const response = await fetch(`${DIRECTUS_URL}/roles?filter[name][_eq]=Administrator`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    
    const data = await response.json();
    
    if (response.ok && data.data && data.data.length > 0) {
      adminRoleId = data.data[0].id;
      console.log(`✅ Found admin role ID: ${adminRoleId}`);
      return adminRoleId;
    } else {
      console.error('❌ Failed to find admin role:', data.errors?.[0]?.message || 'Role not found');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error finding admin role:', error.message);
    process.exit(1);
  }
}

// Function to get all collections
async function getAllCollections() {
  console.log('📚 Getting all collections...');
  
  try {
    const response = await fetch(`${DIRECTUS_URL}/collections`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    
    const data = await response.json();
    
    if (response.ok && data.data) {
      const collections = data.data.map(collection => collection.collection);
      console.log(`✅ Found ${collections.length} collections`);
      return collections;
    } else {
      console.error('❌ Failed to get collections:', data.errors?.[0]?.message || 'Unknown error');
      return [];
    }
  } catch (error) {
    console.error('❌ Error getting collections:', error.message);
    return [];
  }
}

// Function to set permissions for a collection
async function setAdminPermissions(collection) {
  console.log(`🔧 Setting full permissions for ${collection}...`);
  
  // The actions we want to allow for admin
  const actions = ['create', 'read', 'update', 'delete'];
  
  for (const action of actions) {
    try {
      // First check if permission already exists
      const checkResponse = await fetch(`${DIRECTUS_URL}/permissions?filter[collection][_eq]=${collection}&filter[role][_eq]=${adminRoleId}&filter[action][_eq]=${action}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });
      
      const checkData = await checkResponse.json();
      
      // If permission already exists, skip
      if (checkResponse.ok && checkData.data && checkData.data.length > 0) {
        console.log(`✅ ${action} permission for ${collection} already exists, skipping`);
        continue;
      }
      
      // Create new permission
      const response = await fetch(`${DIRECTUS_URL}/permissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection,
          action,
          role: adminRoleId,
          fields: '*',
          permissions: {},
          validation: {}
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Successfully set ${action} permission for ${collection}`);
      } else {
        console.error(`❌ Failed to set ${action} permission for ${collection}:`, data.errors?.[0]?.message || 'Unknown error');
      }
    } catch (error) {
      console.error(`❌ Error setting ${action} permission for ${collection}:`, error.message);
    }
  }
}

// Main function to run the setup
async function fixAdminPermissions() {
  console.log('🚀 Starting Directus admin permissions fix...\n');
  
  // Step 1: Authenticate as admin
  await authenticate();
  
  // Step 2: Get admin role ID
  await getAdminRoleId();
  
  // Step 3: Get all collections
  const collections = await getAllCollections();
  
  // Step 4: Set permissions for all collections
  for (const collection of collections) {
    await setAdminPermissions(collection);
  }
  
  console.log('\n✅ Admin permissions fix completed!');
  console.log('\nNext steps:');
  console.log('1. Try logging in to the Directus admin panel');
  console.log('2. Verify you can access all collections');
  console.log('3. Then set up public role permissions for your frontend');
}

// Run the setup
fixAdminPermissions().catch(error => {
  console.error('❌ Unhandled error:', error);
}); 