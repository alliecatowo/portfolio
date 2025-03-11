// Script to create collections in Directus
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

// Function to check if a collection exists
async function collectionExists(collectionName) {
  try {
    const response = await fetch(`${DIRECTUS_URL}/collections/${collectionName}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Function to create a collection
async function createCollection(collectionName, fields) {
  console.log(`🔧 Creating collection: ${collectionName}...`);
  
  // Check if collection already exists
  const exists = await collectionExists(collectionName);
  if (exists) {
    console.log(`✅ Collection ${collectionName} already exists, skipping creation`);
    return true;
  }
  
  try {
    // Create the collection
    const createResponse = await fetch(`${DIRECTUS_URL}/collections`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collection: collectionName,
        meta: {
          icon: getIconForCollection(collectionName),
          note: `Collection for ${collectionName.replace('_', ' ')}`,
          display_template: "{{title}}",
          hidden: false,
          singleton: false,
          sort_field: "sort",
        },
        schema: {
          name: collectionName,
          comment: `Collection for ${collectionName.replace('_', ' ')}`,
        },
        fields: [
          {
            field: 'id',
            type: 'integer',
            meta: {
              hidden: true,
              interface: 'input',
              readonly: true,
            },
            schema: {
              is_primary_key: true,
              has_auto_increment: true,
            },
          },
          ...fields
        ]
      }),
    });
    
    if (createResponse.ok) {
      console.log(`✅ Successfully created collection: ${collectionName}`);
      return true;
    } else {
      const errorData = await createResponse.json();
      console.error(`❌ Failed to create collection ${collectionName}:`, errorData.errors?.[0]?.message || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.error(`❌ Error creating collection ${collectionName}:`, error.message);
    return false;
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

// Helper to get an appropriate icon for the collection
function getIconForCollection(collectionName) {
  const icons = {
    'blog_posts': 'article',
    'projects': 'code',
    'gallery': 'image',
  };
  
  return icons[collectionName] || 'box';
}

// Function to create blog_posts collection
async function createBlogPostsCollection() {
  const fields = [
    {
      field: 'title',
      type: 'string',
      meta: {
        interface: 'input',
        options: {
          iconLeft: 'title',
        },
        required: true,
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'slug',
      type: 'string',
      meta: {
        interface: 'input',
        options: {
          iconLeft: 'link',
          slug: true,
        },
        required: true,
        note: 'URL-friendly identifier',
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'content',
      type: 'text',
      meta: {
        interface: 'input-rich-text-html',
        required: true,
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'excerpt',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        note: 'Brief summary of the article',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'date_published',
      type: 'timestamp',
      meta: {
        interface: 'datetime',
        display: 'datetime',
        required: true,
      },
      schema: {
        is_nullable: false,
        default_value: 'now()',
      },
    },
    {
      field: 'cover_image',
      type: 'uuid',
      meta: {
        interface: 'file-image',
        note: 'Featured image for the blog post',
      },
      schema: {
        is_nullable: true,
        foreign_key_table: 'directus_files',
      },
    },
    {
      field: 'sort',
      type: 'integer',
      meta: {
        interface: 'input',
        hidden: true,
      },
      schema: {
        is_nullable: true,
      },
    },
  ];
  
  return await createCollection('blog_posts', fields);
}

// Function to create projects collection
async function createProjectsCollection() {
  const fields = [
    {
      field: 'title',
      type: 'string',
      meta: {
        interface: 'input',
        options: {
          iconLeft: 'title',
        },
        required: true,
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'slug',
      type: 'string',
      meta: {
        interface: 'input',
        options: {
          iconLeft: 'link',
          slug: true,
        },
        required: true,
        note: 'URL-friendly identifier',
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'description',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        required: true,
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'content',
      type: 'text',
      meta: {
        interface: 'input-rich-text-html',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'cover_image',
      type: 'uuid',
      meta: {
        interface: 'file-image',
        note: 'Featured image for the project',
      },
      schema: {
        is_nullable: true,
        foreign_key_table: 'directus_files',
      },
    },
    {
      field: 'technologies',
      type: 'json',
      meta: {
        interface: 'tags',
        options: {
          iconLeft: 'code',
        },
        note: 'Technologies used in this project',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'github',
      type: 'string',
      meta: {
        interface: 'input',
        options: {
          iconLeft: 'link',
        },
        note: 'GitHub repository URL',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'live_url',
      type: 'string',
      meta: {
        interface: 'input',
        options: {
          iconLeft: 'link',
        },
        note: 'Live website URL',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'sort',
      type: 'integer',
      meta: {
        interface: 'input',
        hidden: true,
      },
      schema: {
        is_nullable: true,
      },
    },
  ];
  
  return await createCollection('projects', fields);
}

// Function to create gallery collection
async function createGalleryCollection() {
  const fields = [
    {
      field: 'title',
      type: 'string',
      meta: {
        interface: 'input',
        options: {
          iconLeft: 'title',
        },
        required: true,
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'image',
      type: 'uuid',
      meta: {
        interface: 'file-image',
        required: true,
      },
      schema: {
        is_nullable: false,
        foreign_key_table: 'directus_files',
      },
    },
    {
      field: 'description',
      type: 'text',
      meta: {
        interface: 'input-multiline',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'category',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        options: {
          choices: [
            { text: 'Artwork', value: 'artwork' },
            { text: 'Photography', value: 'photography' },
            { text: 'Design', value: 'design' },
            { text: 'Tattoo', value: 'tattoo' },
          ],
        },
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'sort',
      type: 'integer',
      meta: {
        interface: 'input',
        hidden: true,
      },
      schema: {
        is_nullable: true,
      },
    },
  ];
  
  return await createCollection('gallery', fields);
}

// Main function to create collections
async function setupCollections() {
  console.log('🚀 Starting Directus collections setup...\n');
  
  // Step 1: Authenticate as admin
  await authenticate();
  
  // Step 2: Get admin role ID
  await getAdminRoleId();
  
  // Step 3: Create collections
  console.log('\n📚 Creating collections...');
  
  // Create blog_posts collection
  const blogPostsCreated = await createBlogPostsCollection();
  if (blogPostsCreated) {
    await setAdminPermissions('blog_posts');
  }
  
  // Create projects collection
  const projectsCreated = await createProjectsCollection();
  if (projectsCreated) {
    await setAdminPermissions('projects');
  }
  
  // Create gallery collection
  const galleryCreated = await createGalleryCollection();
  if (galleryCreated) {
    await setAdminPermissions('gallery');
  }
  
  console.log('\n✅ Collection setup completed!');
}

// Run the setup
setupCollections().catch(error => {
  console.error('❌ Unhandled error:', error);
}); 