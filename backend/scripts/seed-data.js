const axios = require('axios');

const API_URL = 'http://localhost:1337/api';
const ADMIN_URL = 'http://localhost:1337/admin';
const AUTH_URL = 'http://localhost:1337/admin/login';

// Admin user credentials
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Portfolio123!';

// Function to create admin user and get token
async function getAuthToken() {
  try {
    // Try to login first
    const loginResponse = await axios.post(AUTH_URL, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    console.log('Admin login successful');
    return loginResponse.data.data.token;
  } catch (loginError) {
    console.log('Admin login failed, will try again after Strapi server is fully started');
    
    // Wait for Strapi server to be fully ready
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    try {
      // Try login again
      const retryLoginResponse = await axios.post(AUTH_URL, {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      });
      
      console.log('Admin login successful on retry');
      return retryLoginResponse.data.data.token;
    } catch (retryError) {
      console.error('Admin login failed after retry:', retryError.message);
      return null;
    }
  }
}

// Function to create data with error handling
async function createEntry(endpoint, data, token = null) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await axios.post(`${API_URL}/${endpoint}`, {
      data: data
    }, { headers });
    
    console.log(`Created ${endpoint}:`, response.data.data.id);
    return response.data.data;
  } catch (error) {
    console.error(`Error creating ${endpoint}:`, error.response?.data?.error?.message || error.message);
    return null;
  }
}

// Main function to seed data
async function seedData() {
  console.log('Starting to seed data...');
  
  // Get admin token
  const token = await getAuthToken();
  
  if (!token) {
    console.error('Failed to obtain auth token. Make sure Strapi is running and an admin user exists.');
    console.log('You may need to create an admin user through the Strapi UI first at http://localhost:1337/admin');
    console.log('Then create content-type permissions in Settings > USERS & PERMISSIONS PLUGIN > Roles > Public');
    return;
  }

  // 1. Create categories
  const categories = [
    {
      name: 'Web Development',
      slug: 'web-development'
    },
    {
      name: 'Mobile Apps',
      slug: 'mobile-apps'
    },
    {
      name: 'Design',
      slug: 'design'
    },
    {
      name: 'Career',
      slug: 'career'
    }
  ];

  const createdCategories = {};
  for (const category of categories) {
    const result = await createEntry('categories', category, token);
    if (result) {
      createdCategories[category.slug] = result.id;
    }
  }

  // 2. Create tattoo styles
  const tattooStyles = [
    {
      name: 'Neo-Traditional',
      description: 'A modern take on traditional tattoo art with more vibrant colors and detailed imagery.'
    },
    {
      name: 'Watercolor',
      description: 'Style that mimics the fluidity and color blending of watercolor painting.'
    },
    {
      name: 'Minimalist',
      description: 'Simple, clean lines and designs with minimal detail.'
    }
  ];

  const createdTattooStyles = {};
  for (const style of tattooStyles) {
    const result = await createEntry('tattoo-styles', style, token);
    if (result) {
      createdTattooStyles[style.name] = result.id;
    }
  }

  // 3. Create projects
  const projects = [
    {
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment processing.',
      slug: 'ecommerce-platform',
      technologies: JSON.stringify(['React', 'Node.js', 'MongoDB', 'Express']),
      websiteUrl: 'https://ecommerce.example.com',
      githubUrl: 'https://github.com/allison/ecommerce',
      featured: true,
      status: 'Completed',
      category: createdCategories['web-development'],
      publishedAt: new Date().toISOString()
    },
    {
      title: 'Task Management App',
      description: 'A productivity app for task management with features like to-do lists, reminders, and progress tracking.',
      slug: 'task-management-app',
      technologies: JSON.stringify(['Vue.js', 'Firebase', 'Tailwind CSS']),
      websiteUrl: 'https://tasks.example.com',
      githubUrl: 'https://github.com/allison/task-app',
      featured: true,
      status: 'Completed',
      category: createdCategories['web-development'],
      publishedAt: new Date().toISOString()
    },
    {
      title: 'Weather Forecast App',
      description: 'A mobile app that provides real-time weather forecasts based on location. Includes features like hourly and daily forecasts, weather alerts, and location tracking.',
      slug: 'weather-forecast-app',
      technologies: JSON.stringify(['React Native', 'OpenWeatherMap API', 'Redux']),
      websiteUrl: 'https://weather.example.com',
      githubUrl: 'https://github.com/allison/weather-app',
      featured: false,
      status: 'In Progress',
      category: createdCategories['mobile-apps'],
      publishedAt: new Date().toISOString()
    }
  ];

  for (const project of projects) {
    await createEntry('projects', project, token);
  }

  // 4. Create articles
  const articles = [
    {
      title: 'Getting Started with React Hooks',
      content: '# Getting Started with React Hooks\n\nReact Hooks are a powerful feature in React that allows you to use state and other React features without writing a class component.\n\n## useState Hook\n\nThe useState hook allows you to add state to functional components. Let\'s see an example:\n\n```jsx\nimport React, { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```\n\n## useEffect Hook\n\nThe useEffect hook allows you to perform side effects in functional components. It\'s similar to componentDidMount, componentDidUpdate, and componentWillUnmount in class components.\n\n```jsx\nimport React, { useState, useEffect } from \'react\';\n\nfunction Example() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = `You clicked ${count} times`;\n  });\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n```',
      slug: 'getting-started-with-react-hooks',
      summary: 'Learn how to use React Hooks to add state and side effects to your functional components.',
      portfolioType: 'Developer',
      featured: true,
      category: createdCategories['web-development'],
      publishedAt: new Date().toISOString()
    },
    {
      title: 'Designing Tattoos for Different Skin Tones',
      content: '# Designing Tattoos for Different Skin Tones\n\nAs a tattoo artist, understanding how designs appear on different skin tones is crucial for creating beautiful, long-lasting artwork.\n\n## Color Selection\n\nWhen designing for darker skin tones, certain colors stand out better than others:\n\n- Black and dark blues maintain high contrast\n- Rich reds and oranges can complement darker skin\n- Yellow and white may fade faster or be less visible\n\n## Linework Considerations\n\nBold, clean lines are particularly important for visibility across all skin tones. For darker skin, consider:\n\n- Thicker outlines that maintain visibility as they heal\n- More negative space between design elements\n- Higher contrast between elements\n\n## Placement\n\nSome areas of the body hold ink better than others, regardless of skin tone. However, for darker skin tones, areas with naturally lighter skin (like the inner arm) can be ideal for colorful pieces.',
      slug: 'designing-tattoos-for-different-skin-tones',
      summary: 'Techniques and considerations for creating tattoos that look beautiful on all skin tones.',
      portfolioType: 'Tattoo',
      featured: true,
      category: createdCategories['design'],
      publishedAt: new Date().toISOString()
    },
    {
      title: 'Balancing Creative Careers: Developer and Artist',
      content: '# Balancing Creative Careers: Developer and Artist\n\nNavigating dual creative careers as both a developer and tattoo artist has been a journey of finding unexpected parallels and learning to balance different modes of creativity.\n\n## Finding Time\n\nOne of the biggest challenges is time management. Here\'s how I approach it:\n\n- Dedicated days for each profession\n- Morning coding, evening tattooing (or vice versa)\n- Using weekends for the less demanding role that week\n\n## Creative Crossover\n\nSurprisingly, both disciplines inform each other:\n\n- Problem-solving mindsets transfer between fields\n- Visual design principles enhance UI/UX development\n- Logical thinking improves tattoo composition\n\n## Client Relationships\n\nBoth careers involve understanding client needs and translating them into tangible results:\n\n- Active listening skills developed in both fields\n- Setting realistic expectations is universally important\n- Clear communication prevents disappointment\n\nMaintaining dual creative careers isn\'t always easy, but the diversity keeps both skills fresh and inspiration flowing between disciplines.',
      slug: 'balancing-creative-careers',
      summary: 'Personal insights on managing dual careers as a software developer and tattoo artist.',
      portfolioType: 'Both',
      featured: true,
      category: createdCategories['career'],
      publishedAt: new Date().toISOString()
    }
  ];

  for (const article of articles) {
    await createEntry('articles', article, token);
  }

  // 5. Create tattoo works
  const tattooWorks = [
    {
      title: 'Geometric Fox',
      description: 'A geometric fox design with watercolor accents, created for a client who wanted a modern, minimalist animal tattoo.',
      featured: true,
      clientTestimonial: 'I\'m absolutely in love with my fox tattoo! The geometric style with splash of color is exactly what I wanted.',
      date: new Date().toISOString().split('T')[0],
      style: createdTattooStyles['Minimalist'],
      publishedAt: new Date().toISOString()
    },
    {
      title: 'Floral Sleeve',
      description: 'A comprehensive floral sleeve featuring different native flowers and plants, flowing from shoulder to wrist.',
      featured: true,
      clientTestimonial: 'The level of detail in my sleeve is incredible. Everyone asks who did it!',
      date: new Date().toISOString().split('T')[0],
      style: createdTattooStyles['Neo-Traditional'],
      publishedAt: new Date().toISOString()
    },
    {
      title: 'Abstract Landscape',
      description: 'An abstract watercolor landscape depicting mountains, forest, and a river, done with no outline for a soft, painterly effect.',
      featured: false,
      clientTestimonial: 'The tattoo looks exactly like a watercolor painting. The way the colors blend is amazing.',
      date: new Date().toISOString().split('T')[0],
      style: createdTattooStyles['Watercolor'],
      publishedAt: new Date().toISOString()
    }
  ];

  for (const work of tattooWorks) {
    await createEntry('tattoo-works', work, token);
  }

  console.log('Data seeding completed!');
  console.log('Remember to go to http://localhost:1337/admin to configure content type permissions:');
  console.log('1. Go to Settings > USERS & PERMISSIONS PLUGIN > Roles > Public');
  console.log('2. For each content type (Categories, Projects, Articles, etc.), check "find" and "findOne" boxes');
  console.log('3. Save your changes');
}

// Run the seed function
seedData().catch(error => {
  console.error('Error running seed script:', error);
}); 