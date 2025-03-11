// Script to fix public permissions in Directus
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const DIRECTUS_URL = 'https://allisons-portfolio-directus-9vxdi.ondigitalocean.app';
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;

let adminToken = null;
let publicRoleId = null;

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

// Function to get the public role ID
async function getPublicRoleId() {
  console.log('🔍 Finding public role ID...');
  
  try {
    const response = await fetch(`${DIRECTUS_URL}/roles?filter[name][_eq]=Public`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    
    const data = await response.json();
    
    if (response.ok && data.data && data.data.length > 0) {
      publicRoleId = data.data[0].id;
      console.log(`✅ Found public role ID: ${publicRoleId}`);
      return publicRoleId;
    } else {
      console.error('❌ Failed to find public role:', data.errors?.[0]?.message || 'Role not found');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error finding public role:', error.message);
    process.exit(1);
  }
}

// Function to set READ permissions for a collection
async function setPublicReadPermission(collection) {
  console.log(`🔧 Setting read permission for ${collection}...`);
  
  try {
    // First check if permission already exists
    const checkResponse = await fetch(`${DIRECTUS_URL}/permissions?filter[collection][_eq]=${collection}&filter[role][_eq]=${publicRoleId}&filter[action][_eq]=read`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    
    const checkData = await checkResponse.json();
    
    // If permission already exists, skip
    if (checkResponse.ok && checkData.data && checkData.data.length > 0) {
      console.log(`✅ Read permission for ${collection} already exists, skipping`);
      return;
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
        action: 'read',
        role: publicRoleId,
        fields: '*',
        permissions: {},
        validation: {}
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Successfully set read permission for ${collection}`);
    } else {
      console.error(`❌ Failed to set permission for ${collection}:`, data.errors?.[0]?.message || 'Unknown error');
    }
  } catch (error) {
    console.error(`❌ Error setting permission for ${collection}:`, error.message);
  }
}

// Main function to run the setup
async function fixPublicPermissions() {
  console.log('🚀 Starting Directus public permissions fix...\n');
  
  // Step 1: Authenticate as admin
  await authenticate();
  
  // Step 2: Get public role ID
  await getPublicRoleId();
  
  // Step 3: Set permissions for essential collections
  const collections = [
    'blog_posts',
    'projects',
    'gallery',
    'directus_files'
  ];
  
  for (const collection of collections) {
    await setPublicReadPermission(collection);
  }
  
  console.log('\n✅ Public permissions fix completed!');
  console.log('\nNext steps:');
  console.log('1. Verify permissions by testing API access');
  console.log('2. Check if your frontend can now access the data');
}

// Run the setup
fixPublicPermissions().catch(error => {
  console.error('❌ Unhandled error:', error);
}); 