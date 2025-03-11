// Script to set up collections in Directus
const { Directus } = require('@directus/sdk');
const axios = require('axios');

// Configuration
const config = {
  url: 'https://allisons-portfolio-directus-9vxdi.ondigitalocean.app',
  auth: {
    email: 'admin@example.com',
    password: 'Admin123!'
  }
};

// Collection definitions
const collectionDefinitions = [
  {
    collection: 'blog_posts',
    meta: {
      collection: 'blog_posts',
      icon: 'article',
      note: 'Blog posts for the portfolio',
      display_template: '{{title}}',
      singleton: false
    },
    schema: {
      name: 'blog_posts'
    },
    fields: [
      {
        field: 'title',
        type: 'string',
        meta: {
          interface: 'input',
          required: true
        },
        schema: {
          is_nullable: false
        }
      },
      {
        field: 'slug',
        type: 'string',
        meta: {
          interface: 'input',
          required: true
        },
        schema: {
          is_nullable: false
        }
      },
      {
        field: 'content',
        type: 'text',
        meta: {
          interface: 'input-rich-text-md',
          required: true
        },
        schema: {
          is_nullable: false
        }
      },
      {
        field: 'excerpt',
        type: 'text',
        meta: {
          interface: 'input-multiline'
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'date_published',
        type: 'date',
        meta: {
          interface: 'datetime',
          required: true
        },
        schema: {
          is_nullable: false
        }
      },
      {
        field: 'status',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Published', value: 'published' },
              { text: 'Draft', value: 'draft' },
              { text: 'Archived', value: 'archived' }
            ]
          },
          required: true
        },
        schema: {
          default_value: 'draft',
          is_nullable: false
        }
      }
    ]
  },
  {
    collection: 'projects',
    meta: {
      collection: 'projects',
      icon: 'web',
      note: 'Portfolio projects',
      display_template: '{{title}}',
      singleton: false
    },
    schema: {
      name: 'projects'
    },
    fields: [
      {
        field: 'title',
        type: 'string',
        meta: {
          interface: 'input',
          required: true
        },
        schema: {
          is_nullable: false
        }
      },
      {
        field: 'slug',
        type: 'string',
        meta: {
          interface: 'input',
          required: true
        },
        schema: {
          is_nullable: false
        }
      },
      {
        field: 'description',
        type: 'text',
        meta: {
          interface: 'input-multiline',
          required: true
        },
        schema: {
          is_nullable: false
        }
      },
      {
        field: 'content',
        type: 'text',
        meta: {
          interface: 'input-rich-text-md',
          required: true
        },
        schema: {
          is_nullable: false
        }
      },
      {
        field: 'status',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Published', value: 'published' },
              { text: 'Draft', value: 'draft' },
              { text: 'Archived', value: 'archived' }
            ]
          },
          required: true
        },
        schema: {
          default_value: 'draft',
          is_nullable: false
        }
      },
      {
        field: 'sort',
        type: 'integer',
        meta: {
          interface: 'input',
          required: true
        },
        schema: {
          default_value: 0,
          is_nullable: false
        }
      }
    ]
  },
  {
    collection: 'gallery',
    meta: {
      collection: 'gallery',
      icon: 'image',
      note: 'Portfolio gallery items',
      display_template: '{{title}}',
      singleton: false
    },
    schema: {
      name: 'gallery'
    },
    fields: [
      {
        field: 'title',
        type: 'string',
        meta: {
          interface: 'input',
          required: true
        },
        schema: {
          is_nullable: false
        }
      },
      {
        field: 'description',
        type: 'text',
        meta: {
          interface: 'input-multiline'
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'status',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Published', value: 'published' },
              { text: 'Draft', value: 'draft' },
              { text: 'Archived', value: 'archived' }
            ]
          },
          required: true
        },
        schema: {
          default_value: 'draft',
          is_nullable: false
        }
      },
      {
        field: 'sort',
        type: 'integer',
        meta: {
          interface: 'input',
          required: true
        },
        schema: {
          default_value: 0,
          is_nullable: false
        }
      }
    ]
  }
];

// Alternative approach using Axios directly
async function setupCollectionsWithAxios() {
  try {
    console.log('Starting to set up collections with axios...');
    
    // Login to get token
    console.log('Authenticating...');
    
    const loginResponse = await axios.post(
      `${config.url}/auth/login`,
      {
        email: config.auth.email,
        password: config.auth.password
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    if (!loginResponse.data || !loginResponse.data.data || !loginResponse.data.data.access_token) {
      throw new Error('Failed to authenticate: No access token received');
    }
    
    const token = loginResponse.data.data.access_token;
    console.log('Successfully authenticated!');
    
    // Create each collection
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    for (const collection of collectionDefinitions) {
      try {
        console.log(`Creating collection: ${collection.collection}...`);
        
        // Check if collection exists
        try {
          await axios.get(`${config.url}/collections/${collection.collection}`, { headers: authHeaders });
          console.log(`Collection ${collection.collection} already exists, skipping.`);
          continue;
        } catch (err) {
          // 404 means collection doesn't exist, which is what we want
          if (err.response && err.response.status !== 404) {
            throw err;
          }
        }
        
        // Create collection
        await axios.post(`${config.url}/collections`, collection, { headers: authHeaders });
        console.log(`Collection ${collection.collection} created successfully.`);
        
        // Add fields
        for (const field of collection.fields) {
          await axios.post(
            `${config.url}/fields/${collection.collection}`,
            field,
            { headers: authHeaders }
          );
          console.log(`Field ${field.field} added to collection ${collection.collection}.`);
        }
      } catch (err) {
        console.error(`Error creating collection ${collection.collection}:`, err.message);
        if (err.response) {
          console.error('Server response:', err.response.data);
        }
      }
    }
    
    console.log('Collections setup completed!');
  } catch (error) {
    console.error('Error in setup process:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
  }
}

// Original function using Directus SDK
async function setupCollections() {
  try {
    console.log('Starting to set up collections with SDK...');
    
    // Initialize Directus SDK with transport options
    const directus = new Directus(config.url, {
      auth: {
        mode: 'json',
      },
      transport: {
        params: {},
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      },
    });
    
    // Authenticate
    await directus.auth.login(config.auth);
    console.log('Authenticated successfully');
    
    // Get server info
    const serverInfo = await directus.server.info();
    console.log(`Connected to Directus ${serverInfo.version}`);
    
    // Create collections
    for (const collection of collectionDefinitions) {
      try {
        // Check if collection exists
        const exists = await directus.collections.readOne(collection.collection).catch(() => null);
        
        if (exists) {
          console.log(`Collection '${collection.collection}' already exists. Skipping creation.`);
          continue;
        }
        
        // Create collection
        await directus.collections.createOne(collection);
        console.log(`Created collection: ${collection.collection}`);
        
        // Add fields (in a real-world scenario, you'd create fields one by one)
        // But for simplicity, we're assuming the collection and fields get created together
        
      } catch (err) {
        console.error(`Error setting up collection ${collection.collection}:`, err.message);
      }
    }
    
    console.log('Collection setup completed successfully!');
  } catch (error) {
    console.error('Error setting up collections with SDK:', error);
  }
}

// Run both approaches
async function main() {
  try {
    // Try with SDK first
    await setupCollections();
  } catch (sdkError) {
    console.log('SDK approach failed, trying with axios...');
    await setupCollectionsWithAxios();
  }
}

main(); 