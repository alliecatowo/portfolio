// Seed script for Directus CMS
// This script will populate the CMS with initial data

const { Directus } = require('@directus/sdk');

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
    content: `
# Getting Started with Directus

Directus is a modern, open-source headless CMS and API for managing content across any platform. Here's how I set it up for my portfolio site.

## Why Directus?

I chose Directus because:
- It's completely open-source
- It offers a beautiful admin interface
- It provides a powerful, flexible API
- It can be self-hosted on any infrastructure

## Setup Process

1. Deployed to Digital Ocean App Platform
2. Connected to a PostgreSQL database
3. Configured environment variables for security
4. Added content types for blog posts, projects, and gallery items

## Next Steps

I'll be adding more content and customizing the schema to fit my specific needs. Stay tuned for more updates!
    `,
    excerpt: 'Learn how I set up Directus as the headless CMS for my portfolio website.',
    date_published: '2025-03-11',
    status: 'published',
    featured_image: null // Will be updated once we upload images
  },
  {
    title: 'Building with Nuxt 3',
    slug: 'building-with-nuxt-3',
    content: `
# Building with Nuxt 3

Nuxt 3 is a powerful framework for building modern web applications. Here's why I chose it for my portfolio frontend.

## Features I Love

- **File-based routing**: Create pages by simply adding files to the pages directory
- **Auto-imports**: Components and composables are automatically imported
- **SSR, SSG, and ISR support**: Choose the rendering strategy that works best for each route
- **Vue 3 and Composition API**: Write cleaner, more reusable code

## Performance Optimizations

Nuxt 3 offers several performance features out of the box:
- Automatic code-splitting
- Image optimization
- Smart link prefetching
- Efficient bundling

## Integration with Directus

Using Nuxt with Directus has been a great experience. The combination provides:
- TypeScript support for type-safe development
- Simple API for fetching and displaying content
- Flexible routing options for dynamic content
    `,
    excerpt: 'Exploring the benefits of using Nuxt 3 for my portfolio website frontend.',
    date_published: '2025-03-11',
    status: 'published',
    featured_image: null
  }
];

const projects = [
  {
    title: 'Portfolio Website',
    slug: 'portfolio-website',
    description: 'My personal portfolio website built with Nuxt 3 and Directus.',
    content: `
# Portfolio Website

This is my personal portfolio website where I showcase my projects, share blog posts, and display my work.

## Technologies Used

- **Frontend**: Nuxt 3, Vue 3, TailwindCSS
- **Backend**: Directus Headless CMS
- **Hosting**: Vercel (frontend), Digital Ocean (backend)
- **Other**: GitHub Actions for CI/CD

## Features

- Responsive design
- Dark/light mode toggle
- Blog with markdown support
- Project showcase
- Image gallery
    `,
    featured_image: null,
    status: 'published',
    sort: 1
  },
  {
    title: 'E-Commerce Platform',
    slug: 'e-commerce-platform',
    description: 'A modern e-commerce platform built with Next.js and Stripe.',
    content: `
# E-Commerce Platform

A full-featured e-commerce platform for small businesses.

## Technologies Used

- **Frontend**: Next.js, React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Payment**: Stripe
- **Hosting**: Vercel

## Features

- Product catalog
- Shopping cart
- Secure checkout
- Order management
- Customer accounts
    `,
    featured_image: null,
    status: 'published',
    sort: 2
  }
];

const galleryItems = [
  {
    title: 'Sunset at the Beach',
    description: 'A beautiful sunset captured at the beach.',
    image: null,
    status: 'published',
    sort: 1
  },
  {
    title: 'Mountain Landscape',
    description: 'Snow-capped mountains under a clear blue sky.',
    image: null,
    status: 'published',
    sort: 2
  }
];

// Main function
async function seedData() {
  try {
    console.log('Starting to seed data...');
    
    // Initialize Directus SDK
    const directus = new Directus(config.url);
    
    // Authenticate
    await directus.auth.login(config.auth);
    console.log('Authenticated successfully');
    
    // Create collections if they don't exist (this would normally be done through the Directus interface)
    console.log('Checking and creating collections...');
    
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
    console.error('Error seeding data:', error);
  }
}

// Run the seed function
seedData(); 