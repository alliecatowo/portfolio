const axios = require('axios');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:1337';
const API_TOKEN = process.env.API_TOKEN || 'REPLACE_WITH_YOUR_STRAPI_API_TOKEN'; // Get this from Strapi Admin > Settings > API Tokens

// Initialize axios client
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_TOKEN}`
  }
});

// Sample data for developer portfolio
const devData = {
  projects: [
    {
      title: 'Portfolio Website',
      description: 'A dual-purpose portfolio website built with Nuxt.js and Strapi, showcasing both development skills and tattoo art.',
      content: `## Features\n\n- Responsive design\n- Dark/light mode\n- Content management with Strapi\n- Dual portfolio modes\n\n## Technologies\n\n- Nuxt.js\n- Vue.js\n- Tailwind CSS\n- Strapi CMS`,
      slug: 'portfolio-website',
      siteType: 'dev',
      featured: true,
      technologies: ['Vue.js', 'Nuxt.js', 'Tailwind CSS', 'Strapi'],
      coverImage: null,
      githubUrl: 'https://github.com/username/portfolio',
      liveUrl: 'https://portfolio.example.com'
    },
    {
      title: 'E-commerce Platform',
      description: 'A full-featured e-commerce platform with payment processing, user accounts, and inventory management.',
      content: `## Overview\n\nBuilt a complete e-commerce solution with React and Node.js.\n\n## Key Features\n\n- User authentication\n- Payment processing with Stripe\n- Order tracking\n- Admin dashboard\n- Product reviews and ratings`,
      slug: 'ecommerce-platform',
      siteType: 'dev',
      featured: true,
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
      coverImage: null,
      githubUrl: 'https://github.com/username/ecommerce',
      liveUrl: 'https://shop.example.com'
    }
  ],
  
  articles: [
    {
      title: 'Building a Dual-Purpose Portfolio with Nuxt and Strapi',
      content: `# Building a Dual-Purpose Portfolio

## Introduction

This article details how I built a portfolio site that serves two different purposes: showcasing my development work and my tattoo art.

## Architecture

The site is built with:

- **Frontend**: Nuxt.js with TailwindCSS
- **Backend**: Strapi headless CMS
- **Deployment**: Vercel

## Key Challenges

The main challenge was designing a system that could seamlessly switch between two completely different portfolio types while maintaining good performance and SEO.

## Solution

I implemented a site configuration system that detects the current route and loads the appropriate content and styling based on whether the user is viewing the development portfolio or tattoo portfolio.`,
      description: 'Learn how I built this portfolio website that showcases both development work and tattoo art using Nuxt.js and Strapi.',
      slug: 'building-dual-purpose-portfolio',
      siteType: 'dev',
      coverImage: null,
      publishedAt: new Date().toISOString()
    },
    {
      title: 'The Power of Headless CMS for Modern Web Development',
      content: `# The Power of Headless CMS

## Introduction

Headless CMS systems like Strapi are revolutionizing how we build websites and applications.

## What is a Headless CMS?

A headless CMS provides content management capabilities without being tied to a specific frontend or presentation layer. It delivers content via APIs rather than rendering web pages.

## Benefits

- **Flexibility**: Use any frontend technology
- **Scalability**: Easier to scale content independently
- **Future-proof**: Switch frontends without changing your content structure
- **Performance**: Optimize delivery for specific platforms

## Getting Started with Strapi

Strapi makes it easy to set up a headless CMS with a few simple commands...`,
      description: 'Explore the advantages of using headless CMS systems like Strapi for modern web development projects.',
      slug: 'power-of-headless-cms',
      siteType: 'dev',
      coverImage: null,
      publishedAt: new Date().toISOString()
    }
  ],
  
  openSource: [
    {
      title: 'Vue Component Library',
      description: 'A collection of reusable Vue components with TypeScript support and comprehensive documentation.',
      repoUrl: 'https://github.com/username/vue-components',
      stars: 128,
      forks: 35
    },
    {
      title: 'Markdown Parser',
      description: 'A lightweight and extensible markdown parser with support for custom syntax extensions.',
      repoUrl: 'https://github.com/username/markdown-parser',
      stars: 87,
      forks: 23
    }
  ]
};

// Sample data for tattoo portfolio
const tattooData = {
  artworks: [
    {
      title: 'Geometric Wolf',
      description: 'Geometric wolf design with mandala elements',
      content: 'This geometric wolf design combines sharp lines with intricate mandala patterns to create a unique and modern tattoo that balances structure and flow.',
      slug: 'geometric-wolf',
      siteType: 'tattoo',
      featured: true,
      style: 'Geometric',
      coverImage: null,
      placement: 'Forearm'
    },
    {
      title: 'Floral Sleeve',
      description: 'Full sleeve design with native flowers and botanical elements',
      content: 'This full sleeve design incorporates native botanical elements, featuring detailed flowers and leaves that flow naturally with the arm's contours for a harmonious, organic look.',
      slug: 'floral-sleeve',
      siteType: 'tattoo',
      featured: true,
      style: 'Botanical',
      coverImage: null,
      placement: 'Full Sleeve'
    }
  ],
  
  articles: [
    {
      title: 'The Art of Tattoo Design: Finding Your Style',
      content: `# Finding Your Tattoo Style

## Personal Expression Through Tattoo Art

Every tattoo artist develops their own unique style over time. This article explores my journey in finding my artistic voice in the tattoo world.

## Influences and Inspiration

My work draws inspiration from botanical illustrations, geometric patterns, and traditional Japanese tattoo art. These influences combine to create designs that are both structured and organic.

## Technical Development

Developing technical skills in tattooing requires both practice and study. From line work to shading techniques, each element requires dedicated refinement.

## Client Collaboration

The most rewarding part of tattoo design is the collaborative process with clients, transforming their ideas into custom artwork that they'll wear for a lifetime.`,
      description: 'An exploration of how tattoo artists develop their personal style and artistic voice through practice and various influences.',
      slug: 'finding-tattoo-style',
      siteType: 'tattoo',
      coverImage: null,
      publishedAt: new Date().toISOString()
    },
    {
      title: 'Tattoo Aftercare: Essential Tips for Healing',
      content: `# Tattoo Aftercare Guide

## The Importance of Proper Healing

The healing process is just as important as the tattooing process itself. Proper aftercare ensures your tattoo will look its best for years to come.

## Immediate Aftercare (Days 1-3)

- Keep the bandage on for the first few hours
- Wash gently with unscented soap
- Apply a thin layer of aftercare ointment
- Avoid submerging in water

## Ongoing Care (Weeks 1-4)

- Continue to wash and moisturize
- Avoid direct sunlight
- Don't pick at scabs or flaking skin
- Wear loose clothing over the area

## Long-term Care

- Use sunscreen to prevent fading
- Maintain moisturized skin
- Schedule touch-ups if needed`,
      description: 'Essential aftercare tips to ensure your new tattoo heals properly and maintains its quality and vibrancy.',
      slug: 'tattoo-aftercare',
      siteType: 'tattoo',
      coverImage: null,
      publishedAt: new Date().toISOString()
    }
  ],
  
  testimonials: [
    {
      name: 'Alex Johnson',
      quote: 'I couldn\'t be happier with my tattoo. The attention to detail and the care taken during the whole process was exceptional.',
      date: new Date().toISOString(),
      artwork: 'Geometric Wolf'
    },
    {
      name: 'Sarah Chen',
      quote: 'This was my first tattoo and I was nervous, but the experience was amazing. The design process was collaborative and the final result exceeded my expectations.',
      date: new Date().toISOString(),
      artwork: 'Botanical Sleeve'
    }
  ]
};

// Shared data for both portfolio types
const sharedData = {
  contact: {
    email: 'contact@example.com',
    phone: '+1 (555) 123-4567',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/username' },
      { platform: 'GitHub', url: 'https://github.com/username' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/username' }
    ]
  },
  about: {
    devContent: `# About Me - Developer

I'm a full-stack developer with a passion for creating elegant, user-focused web applications. With over 5 years of experience in the industry, I specialize in JavaScript frameworks, particularly Vue.js and React, along with Node.js for backend development.

## Skills

- **Frontend**: Vue.js, React, Nuxt.js, Tailwind CSS
- **Backend**: Node.js, Express, Strapi, MongoDB, PostgreSQL
- **Tools**: Git, Docker, AWS, Vercel

## Work Experience

I've worked with startups and established companies to build everything from e-commerce platforms to SaaS applications. My focus is always on creating performant, accessible, and maintainable code.

## Philosophy

I believe in the power of the web as a platform for innovation and community. My approach to development centers on creating intuitive user experiences backed by solid, scalable architecture.`,
    
    tattooContent: `# About Me - Tattoo Artist

I've been a professional tattoo artist for 7 years, specializing in geometric designs, botanical illustrations, and fine-line work. My background in traditional art and design informs my approach to tattooing, with a focus on creating harmonious, personalized pieces that complement the natural flow of the body.

## Style & Approach

My work blends precise geometric elements with organic forms, creating tattoos that are both structured and fluid. I particularly enjoy large-scale projects like sleeves and back pieces, where I can develop complex compositions that tell a story.

## Process

I believe in a collaborative design process. Each tattoo begins with an in-depth consultation to understand your vision, followed by a custom design phase where we refine the concept until it's perfect for you.

## Studio

I work from a private studio space that provides a comfortable, calm environment for the tattooing process. Hygiene and safety are my top priorities, with strict adherence to professional standards.`
  }
};

// Function to create data in Strapi
async function seedData() {
  try {
    console.log('Starting data seeding process...');
    
    // Check if API token is available
    if (!API_TOKEN) {
      console.error('No API token provided. Please set the API_TOKEN environment variable or update the script.');
      return;
    }
    
    // Verify API connection
    console.log('Verifying API connection...');
    
    try {
      await api.get('/api/articles');
      console.log('API connection successful.');
    } catch (error) {
      console.error('API connection failed:', error.message);
      console.log('Please check your API URL and token.');
      return;
    }
    
    // Seed developer projects
    console.log('\nSeeding developer projects...');
    for (const project of devData.projects) {
      try {
        const response = await api.post('/api/projects', { data: project });
        console.log(`Created project: ${project.title}`);
      } catch (error) {
        console.error(`Failed to create project ${project.title}:`, error.response?.data || error.message);
      }
    }
    
    // Seed articles (both dev and tattoo)
    console.log('\nSeeding articles...');
    const allArticles = [...devData.articles, ...tattooData.articles];
    for (const article of allArticles) {
      try {
        const response = await api.post('/api/articles', { data: article });
        console.log(`Created article: ${article.title}`);
      } catch (error) {
        console.error(`Failed to create article ${article.title}:`, error.response?.data || error.message);
      }
    }
    
    // Seed open source projects
    console.log('\nSeeding open source projects...');
    for (const project of devData.openSource) {
      try {
        const response = await api.post('/api/open-sources', { data: project });
        console.log(`Created open source project: ${project.title}`);
      } catch (error) {
        console.error(`Failed to create open source project ${project.title}:`, error.response?.data || error.message);
      }
    }
    
    // Seed tattoo artworks
    console.log('\nSeeding tattoo artworks...');
    for (const artwork of tattooData.artworks) {
      try {
        const response = await api.post('/api/artworks', { data: artwork });
        console.log(`Created artwork: ${artwork.title}`);
      } catch (error) {
        console.error(`Failed to create artwork ${artwork.title}:`, error.response?.data || error.message);
      }
    }
    
    // Seed testimonials
    console.log('\nSeeding testimonials...');
    for (const testimonial of tattooData.testimonials) {
      try {
        const response = await api.post('/api/testimonials', { data: testimonial });
        console.log(`Created testimonial from: ${testimonial.name}`);
      } catch (error) {
        console.error(`Failed to create testimonial from ${testimonial.name}:`, error.response?.data || error.message);
      }
    }
    
    // Seed contact information
    console.log('\nSeeding contact information...');
    try {
      const contactResponse = await api.post('/api/contact', { data: sharedData.contact });
      console.log('Created contact information');
    } catch (error) {
      console.error('Failed to create contact information:', error.response?.data || error.message);
    }
    
    // Seed about information
    console.log('\nSeeding about information...');
    try {
      const aboutResponse = await api.post('/api/about', { 
        data: {
          devContent: sharedData.about.devContent,
          tattooContent: sharedData.about.tattooContent
        }
      });
      console.log('Created about information');
    } catch (error) {
      console.error('Failed to create about information:', error.response?.data || error.message);
    }
    
    console.log('\nData seeding completed!');
    
  } catch (error) {
    console.error('Unexpected error during seed process:', error);
  }
}

// Execute the seeding function
seedData(); 