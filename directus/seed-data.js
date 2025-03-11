// Seed script for Directus CMS
// This script will populate the CMS with initial data

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

// Sample data
const blogPosts = [
  {
    title: 'Getting Started with Directus',
    slug: 'getting-started-with-directus',
    content: '# Getting Started with Directus\n\nDirectus is a modern, open-source headless CMS and API for managing content across any platform. Here\'s how I set it up for my portfolio site.\n\n## Why Directus?\n\nI chose Directus because:\n- It\'s completely open-source\n- It offers a beautiful admin interface\n- It provides a powerful, flexible API\n- It can be self-hosted on any infrastructure\n\n## Setup Process\n\n1. Deployed to Digital Ocean App Platform\n2. Connected to a PostgreSQL database\n3. Configured environment variables for security\n4. Added content types for blog posts, projects, and gallery items\n\n## Next Steps\n\nI\'ll be adding more content and customizing the schema to fit my specific needs. Stay tuned for more updates!',
    excerpt: 'Learn how I set up Directus as the headless CMS for my portfolio website.',
    date_published: '2025-03-11',
    status: 'published'
  },
  {
    title: 'Building with Nuxt 3',
    slug: 'building-with-nuxt-3',
    content: '# Building with Nuxt 3\n\nNuxt 3 is a powerful framework for building modern web applications. Here\'s why I chose it for my portfolio frontend.\n\n## Features I Love\n\n- **File-based routing**: Create pages by simply adding files to the pages directory\n- **Auto-imports**: Components and composables are automatically imported\n- **SSR, SSG, and ISR support**: Choose the rendering strategy that works best for each route\n- **Vue 3 and Composition API**: Write cleaner, more reusable code\n\n## Performance Optimizations\n\nNuxt 3 offers several performance features out of the box:\n- Automatic code-splitting\n- Image optimization\n- Smart link prefetching\n- Efficient bundling\n\n## Integration with Directus\n\nUsing Nuxt with Directus has been a great experience. The combination provides:\n- TypeScript support for type-safe development\n- Simple API for fetching and displaying content\n- Flexible routing options for dynamic content',
    excerpt: 'Exploring the benefits of using Nuxt 3 for my portfolio website frontend.',
    date_published: '2025-03-11',
    status: 'published'
  }
];

const projects = [
  {
    title: 'Portfolio Website',
    slug: 'portfolio-website',
    description: 'My personal portfolio website built with Nuxt 3 and Directus.',
    content: '# Portfolio Website\n\nThis is my personal portfolio website where I showcase my projects, share blog posts, and display my work.\n\n## Technologies Used\n\n- **Frontend**: Nuxt 3, Vue 3, TailwindCSS\n- **Backend**: Directus Headless CMS\n- **Hosting**: Vercel (frontend), Digital Ocean (backend)\n- **Other**: GitHub Actions for CI/CD\n\n## Features\n\n- Responsive design\n- Dark/light mode toggle\n- Blog with markdown support\n- Project showcase\n- Image gallery',
    status: 'published',
    sort: 1
  },
  {
    title: 'E-Commerce Platform',
    slug: 'e-commerce-platform',
    description: 'A modern e-commerce platform built with Next.js and Stripe.',
    content: '# E-Commerce Platform\n\nA full-featured e-commerce platform for small businesses.\n\n## Technologies Used\n\n- **Frontend**: Next.js, React\n- **Backend**: Node.js, Express\n- **Database**: MongoDB\n- **Payment**: Stripe\n- **Hosting**: Vercel\n\n## Features\n\n- Product catalog\n- Shopping cart\n- Secure checkout\n- Order management\n- Customer accounts',
    status: 'published',
    sort: 2
  }
];

const galleryItems = [
  {
    title: 'Sunset at the Beach',
    description: 'A beautiful sunset captured at the beach.',
    status: 'published',
    sort: 1
  },
  {
    title: 'Mountain Landscape',
    description: 'Snow-capped mountains under a clear blue sky.',
    status: 'published',
    sort: 2
  }
];

// Alternative approach using Axios directly
async function seedDataWithAxios() {
  try {
    console.log('Starting to seed data with axios...');
    
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
    
    // Create auth headers for API requests
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Add blog posts
    console.log('Adding blog posts...');
    for (const post of blogPosts) {
      try {
        const response = await axios.post(
          `${config.url}/items/blog_posts`,
          post,
          { headers: authHeaders }
        );
        console.log(`Created blog post: ${post.title}`);
      } catch (err) {
        console.error(`Error creating blog post ${post.title}:`, err.message);
        if (err.response) {
          console.error('Server response:', err.response.data);
        }
      }
    }
    
    // Add projects
    console.log('Adding projects...');
    for (const project of projects) {
      try {
        const response = await axios.post(
          `${config.url}/items/projects`,
          project,
          { headers: authHeaders }
        );
        console.log(`Created project: ${project.title}`);
      } catch (err) {
        console.error(`Error creating project ${project.title}:`, err.message);
        if (err.response) {
          console.error('Server response:', err.response.data);
        }
      }
    }
    
    // Add gallery items
    console.log('Adding gallery items...');
    for (const item of galleryItems) {
      try {
        const response = await axios.post(
          `${config.url}/items/gallery`,
          item,
          { headers: authHeaders }
        );
        console.log(`Created gallery item: ${item.title}`);
      } catch (err) {
        console.error(`Error creating gallery item ${item.title}:`, err.message);
        if (err.response) {
          console.error('Server response:', err.response.data);
        }
      }
    }
    
    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data with axios:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
  }
}

// Main function using Directus SDK
async function seedData() {
  try {
    console.log('Starting to seed data with SDK...');
    
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
    
    // Add blog posts
    console.log('Adding blog posts...');
    const blogCollection = directus.items('blog_posts');
    
    for (const post of blogPosts) {
      try {
        await blogCollection.createOne(post);
        console.log(`Created blog post: ${post.title}`);
      } catch (err) {
        console.error(`Error creating blog post ${post.title}:`, err.message);
      }
    }
    
    // Add projects
    console.log('Adding projects...');
    const projectsCollection = directus.items('projects');
    
    for (const project of projects) {
      try {
        await projectsCollection.createOne(project);
        console.log(`Created project: ${project.title}`);
      } catch (err) {
        console.error(`Error creating project ${project.title}:`, err.message);
      }
    }
    
    // Add gallery items
    console.log('Adding gallery items...');
    const galleryCollection = directus.items('gallery');
    
    for (const item of galleryItems) {
      try {
        await galleryCollection.createOne(item);
        console.log(`Created gallery item: ${item.title}`);
      } catch (err) {
        console.error(`Error creating gallery item ${item.title}:`, err.message);
      }
    }
    
    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data with SDK:', error);
    throw error;
  }
}

// Run both approaches
async function main() {
  try {
    // Try with SDK first
    await seedData();
  } catch (sdkError) {
    console.log('SDK approach failed, trying with axios...');
    await seedDataWithAxios();
  }
}

main(); 