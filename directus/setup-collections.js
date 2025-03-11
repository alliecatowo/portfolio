// Script to set up collections in Directus
const { Directus } = require('@directus/sdk');

// Configuration
const config = {
  url: 'https://allisons-portfolio-directus-9vxdi.ondigitalocean.app',
  auth: {
    email: 'admin@example.com',
    password: 'Admin123!'
  }
};

// Collection definitions
const collections = [
  {
    collection: 'blog_posts',
    meta: {
      collection: 'blog_posts',
      icon: 'article',
      note: 'Blog posts for the portfolio',
      display_template: '{{title}}',
      singleton: false,
      sort_field: 'date_published',
      sort: -1,
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'draft',
      archive_app_filter: true,
      accountability: 'all'
    },
    schema: {
      name: 'blog_posts',
      comment: 'Blog posts for the portfolio site'
    },
    fields: [
      {
        field: 'id',
        type: 'integer',
        meta: {
          interface: 'input',
          readonly: true,
          hidden: true,
          special: ['uuid']
        },
        schema: {
          is_primary_key: true,
          is_nullable: false
        }
      },
      {
        field: 'title',
        type: 'string',
        meta: {
          interface: 'input',
          width: 'full',
          required: true,
          options: {
            placeholder: 'Enter a title...'
          }
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
          width: 'full',
          required: true,
          options: {
            placeholder: 'Enter a slug...',
            slug: true
          }
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
          width: 'full',
          required: true,
          options: {
            placeholder: 'Write your blog post content...'
          }
        },
        schema: {
          is_nullable: false
        }
      },
      {
        field: 'excerpt',
        type: 'text',
        meta: {
          interface: 'input-multiline',
          width: 'full',
          options: {
            placeholder: 'A short summary...'
          }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'featured_image',
        type: 'uuid',
        meta: {
          interface: 'file-image',
          width: 'full',
          special: ['file']
        },
        schema: {
          is_nullable: true,
          default_value: null
        }
      },
      {
        field: 'date_published',
        type: 'date',
        meta: {
          interface: 'datetime',
          width: 'half',
          display: 'datetime',
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
          width: 'half',
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
      singleton: false,
      sort_field: 'sort',
      sort: 1,
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'draft',
      archive_app_filter: true,
      accountability: 'all'
    },
    schema: {
      name: 'projects',
      comment: 'Portfolio projects'
    },
    fields: [
      {
        field: 'id',
        type: 'integer',
        meta: {
          interface: 'input',
          readonly: true,
          hidden: true,
          special: ['uuid']
        },
        schema: {
          is_primary_key: true,
          is_nullable: false
        }
      },
      {
        field: 'title',
        type: 'string',
        meta: {
          interface: 'input',
          width: 'full',
          required: true,
          options: {
            placeholder: 'Enter a title...'
          }
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
          width: 'full',
          required: true,
          options: {
            placeholder: 'Enter a slug...',
            slug: true
          }
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
          width: 'full',
          required: true,
          options: {
            placeholder: 'A short description...'
          }
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
          width: 'full',
          required: true,
          options: {
            placeholder: 'Write your project content...'
          }
        },
        schema: {
          is_nullable: false
        }
      },
      {
        field: 'featured_image',
        type: 'uuid',
        meta: {
          interface: 'file-image',
          width: 'full',
          special: ['file']
        },
        schema: {
          is_nullable: true,
          default_value: null
        }
      },
      {
        field: 'status',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          width: 'half',
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
          width: 'half',
          required: true,
          options: {
            placeholder: 'Sort order...'
          }
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
      singleton: false,
      sort_field: 'sort',
      sort: 1,
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'draft',
      archive_app_filter: true,
      accountability: 'all'
    },
    schema: {
      name: 'gallery',
      comment: 'Portfolio gallery items'
    },
    fields: [
      {
        field: 'id',
        type: 'integer',
        meta: {
          interface: 'input',
          readonly: true,
          hidden: true,
          special: ['uuid']
        },
        schema: {
          is_primary_key: true,
          is_nullable: false
        }
      },
      {
        field: 'title',
        type: 'string',
        meta: {
          interface: 'input',
          width: 'full',
          required: true,
          options: {
            placeholder: 'Enter a title...'
          }
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
          width: 'full',
          options: {
            placeholder: 'A short description...'
          }
        },
        schema: {
          is_nullable: true
        }
      },
      {
        field: 'image',
        type: 'uuid',
        meta: {
          interface: 'file-image',
          width: 'full',
          required: true,
          special: ['file']
        },
        schema: {
          is_nullable: true,
          default_value: null
        }
      },
      {
        field: 'status',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          width: 'half',
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
          width: 'half',
          required: true,
          options: {
            placeholder: 'Sort order...'
          }
        },
        schema: {
          default_value: 0,
          is_nullable: false
        }
      }
    ]
  }
];

// Main function
async function setupCollections() {
  try {
    console.log('Starting to set up collections...');
    
    // Initialize Directus SDK
    const directus = new Directus(config.url);
    
    // Authenticate
    await directus.auth.login(config.auth);
    console.log('Authenticated successfully');
    
    // Get server info
    const serverInfo = await directus.server.info();
    console.log(`Connected to Directus ${serverInfo.version}`);
    
    // Create collections
    for (const collection of collections) {
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
    console.error('Error setting up collections:', error);
  }
}

// Run the setup function
setupCollections(); 