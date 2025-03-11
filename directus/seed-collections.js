// Script to seed collections in Directus with sample data
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const DIRECTUS_URL = 'https://allisons-portfolio-directus-9vxdi.ondigitalocean.app';
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD;

let adminToken = null;

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

// Function to seed a collection with data
async function seedCollection(collectionName, items) {
  console.log(`🌱 Seeding collection: ${collectionName}...`);
  
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/${collectionName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(items),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Successfully seeded ${items.length} items into ${collectionName}`);
      return true;
    } else {
      console.error(`❌ Failed to seed ${collectionName}:`, data.errors?.[0]?.message || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.error(`❌ Error seeding ${collectionName}:`, error.message);
    return false;
  }
}

// Helper function to upload a file from a URL
async function uploadFileFromUrl(url, title, description = null) {
  console.log(`📁 Uploading file from URL: ${url}...`);
  
  try {
    // First, we need to get the image data
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) {
      console.error(`❌ Failed to fetch image from URL: ${url}`);
      return null;
    }
    
    const imageBuffer = await imageResponse.buffer();
    
    // Create FormData
    const formData = new FormData();
    formData.append('title', title);
    if (description) {
      formData.append('description', description);
    }
    
    // Get file name from URL
    const fileName = url.split('/').pop();
    
    // Append the file
    formData.append('file', new Blob([imageBuffer]), fileName);
    
    // Upload to Directus
    const uploadResponse = await fetch(`${DIRECTUS_URL}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
      body: formData,
    });
    
    const uploadData = await uploadResponse.json();
    
    if (uploadResponse.ok) {
      console.log(`✅ Successfully uploaded file: ${title}`);
      return uploadData.data.id;
    } else {
      console.error(`❌ Failed to upload file:`, uploadData.errors?.[0]?.message || 'Unknown error');
      return null;
    }
  } catch (error) {
    console.error(`❌ Error uploading file:`, error.message);
    return null;
  }
}

// Function to seed blog posts
async function seedBlogPosts() {
  console.log('📝 Preparing blog post data...');
  
  // Placeholder image URLs
  const placeholderImages = [
    'https://placehold.co/800x400/3498db/ffffff?text=Blog+Post+1',
    'https://placehold.co/800x400/e74c3c/ffffff?text=Blog+Post+2',
    'https://placehold.co/800x400/2ecc71/ffffff?text=Blog+Post+3',
  ];
  
  // Upload images and get their IDs
  const imageIds = [];
  for (let i = 0; i < placeholderImages.length; i++) {
    const imageId = await uploadFileFromUrl(
      placeholderImages[i],
      `Blog Post ${i + 1} Image`,
      `Featured image for blog post ${i + 1}`
    );
    imageIds.push(imageId);
  }
  
  // Create blog post items
  const blogPosts = [
    {
      title: 'Getting Started with Web Development',
      slug: 'getting-started-with-web-development',
      content: `<h2>Introduction to Web Development</h2>
<p>Web development is an exciting field that combines creativity with technical skills. Whether you're just starting out or looking to expand your knowledge, this guide will help you understand the basics.</p>

<h3>Front-End Development</h3>
<p>Front-end development focuses on what users see and interact with. The three core technologies are:</p>
<ul>
  <li><strong>HTML</strong> - Structure</li>
  <li><strong>CSS</strong> - Style</li>
  <li><strong>JavaScript</strong> - Interactivity</li>
</ul>

<h3>Back-End Development</h3>
<p>Back-end development handles what happens behind the scenes, including:</p>
<ul>
  <li>Server configuration</li>
  <li>Database management</li>
  <li>API development</li>
</ul>

<p>Learning both front-end and back-end skills can make you a valuable full-stack developer!</p>`,
      excerpt: 'A beginner-friendly introduction to web development, covering both front-end and back-end technologies.',
      date_published: new Date().toISOString(),
      cover_image: imageIds[0],
      sort: 1
    },
    {
      title: 'Modern JavaScript Frameworks Compared',
      slug: 'modern-javascript-frameworks-compared',
      content: `<h2>Comparing Popular JavaScript Frameworks</h2>
<p>With so many JavaScript frameworks available, it can be difficult to choose the right one for your project. Let's compare some of the most popular options.</p>

<h3>React</h3>
<p>Developed by Facebook, React focuses on component-based architecture and uses a virtual DOM for efficient rendering. It's highly popular for building interactive UIs.</p>

<h3>Vue.js</h3>
<p>Vue combines the best aspects of Angular and React with a gentler learning curve. It's versatile and can be integrated into projects incrementally.</p>

<h3>Angular</h3>
<p>Maintained by Google, Angular provides a complete solution with routing, form validation, and state management built in.</p>

<h3>Svelte</h3>
<p>A newer option that shifts the work to compile time rather than runtime, resulting in highly optimized vanilla JavaScript.</p>

<p>Each framework has its strengths, and the best choice depends on your specific project requirements and team expertise.</p>`,
      excerpt: 'An in-depth comparison of React, Vue.js, Angular, and Svelte to help you choose the right framework for your next project.',
      date_published: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      cover_image: imageIds[1],
      sort: 2
    },
    {
      title: 'Optimizing Website Performance',
      slug: 'optimizing-website-performance',
      content: `<h2>Why Website Performance Matters</h2>
<p>Fast-loading websites provide better user experiences, higher conversion rates, and improved search engine rankings. Here are strategies to optimize your site.</p>

<h3>Image Optimization</h3>
<p>Images often account for most of a website's file size. Optimize by:</p>
<ul>
  <li>Using modern formats like WebP</li>
  <li>Implementing lazy loading</li>
  <li>Serving responsive images</li>
</ul>

<h3>Minification and Bundling</h3>
<p>Reduce file sizes by minifying CSS, JavaScript, and HTML. Use bundlers like Webpack to package your code efficiently.</p>

<h3>Caching Strategies</h3>
<p>Implement browser caching to store resources locally and reduce server requests on subsequent visits.</p>

<h3>Code Splitting</h3>
<p>Load only the code needed for the current page, improving initial load times dramatically.</p>

<p>Remember: A faster website isn't just about technical benefits—it significantly improves your users' experience!</p>`,
      excerpt: 'Learn effective techniques for optimizing website performance, including image optimization, code splitting, and caching strategies.',
      date_published: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      cover_image: imageIds[2],
      sort: 3
    }
  ];
  
  // Seed the blog posts
  return await seedCollection('blog_posts', blogPosts);
}

// Function to seed projects
async function seedProjects() {
  console.log('🔧 Preparing project data...');
  
  // Placeholder image URLs
  const placeholderImages = [
    'https://placehold.co/800x400/9b59b6/ffffff?text=Project+1',
    'https://placehold.co/800x400/f39c12/ffffff?text=Project+2',
    'https://placehold.co/800x400/1abc9c/ffffff?text=Project+3',
  ];
  
  // Upload images and get their IDs
  const imageIds = [];
  for (let i = 0; i < placeholderImages.length; i++) {
    const imageId = await uploadFileFromUrl(
      placeholderImages[i],
      `Project ${i + 1} Image`,
      `Featured image for project ${i + 1}`
    );
    imageIds.push(imageId);
  }
  
  // Create project items
  const projects = [
    {
      title: 'Portfolio Website',
      slug: 'portfolio-website',
      description: 'A modern, responsive portfolio website built with Vue.js and Tailwind CSS.',
      content: `<h2>Portfolio Website Project</h2>
<p>This project was designed to showcase my work and skills in a clean, modern interface.</p>

<h3>Features</h3>
<ul>
  <li>Responsive design that works on all devices</li>
  <li>Dark/light mode toggle</li>
  <li>Project filtering and sorting</li>
  <li>Contact form with validation</li>
  <li>Blog section with CMS integration</li>
</ul>

<h3>Technology Stack</h3>
<ul>
  <li>Vue.js 3 with Composition API</li>
  <li>Tailwind CSS for styling</li>
  <li>Directus as a headless CMS</li>
  <li>Vercel for hosting and deployment</li>
</ul>

<h3>Challenges and Solutions</h3>
<p>One of the biggest challenges was implementing a performant image gallery. I solved this by using lazy loading and optimized image formats.</p>`,
      cover_image: imageIds[0],
      technologies: ['Vue.js', 'Tailwind CSS', 'Directus', 'JavaScript'],
      github: 'https://github.com/username/portfolio',
      live_url: 'https://portfolio.example.com',
      sort: 1
    },
    {
      title: 'Task Management App',
      slug: 'task-management-app',
      description: 'A full-stack task management application with user authentication and real-time updates.',
      content: `<h2>Task Management Application</h2>
<p>This project is a full-featured task management system designed for teams and individuals.</p>

<h3>Features</h3>
<ul>
  <li>User authentication and authorization</li>
  <li>Task creation, editing, and deletion</li>
  <li>Task categorization and tagging</li>
  <li>Due date reminders and notifications</li>
  <li>Team collaboration tools</li>
  <li>Real-time updates using WebSockets</li>
</ul>

<h3>Technology Stack</h3>
<ul>
  <li>React for the frontend</li>
  <li>Node.js and Express for the backend</li>
  <li>MongoDB for the database</li>
  <li>Socket.io for real-time communication</li>
  <li>JWT for authentication</li>
</ul>

<h3>Learning Outcomes</h3>
<p>This project helped me understand state management in complex applications and the implementation of real-time features using WebSockets.</p>`,
      cover_image: imageIds[1],
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
      github: 'https://github.com/username/task-manager',
      live_url: 'https://tasks.example.com',
      sort: 2
    },
    {
      title: 'E-commerce Platform',
      slug: 'e-commerce-platform',
      description: 'A scalable e-commerce solution with product management, cart functionality, and payment processing.',
      content: `<h2>E-commerce Platform</h2>
<p>A complete e-commerce solution built with scalability and performance in mind.</p>

<h3>Features</h3>
<ul>
  <li>Product catalog with categories and filters</li>
  <li>Shopping cart and wishlist functionality</li>
  <li>User accounts and purchase history</li>
  <li>Secure payment processing</li>
  <li>Admin dashboard for inventory management</li>
  <li>Order tracking and management</li>
</ul>

<h3>Technology Stack</h3>
<ul>
  <li>Next.js for frontend and API routes</li>
  <li>PostgreSQL for the database</li>
  <li>Stripe for payment processing</li>
  <li>AWS S3 for image storage</li>
  <li>Redis for caching</li>
</ul>

<h3>Performance Optimizations</h3>
<p>The platform implements server-side rendering for faster initial loads, along with intelligent caching strategies to minimize database queries.</p>`,
      cover_image: imageIds[2],
      technologies: ['Next.js', 'PostgreSQL', 'Stripe', 'AWS', 'Redis'],
      github: 'https://github.com/username/ecommerce',
      live_url: 'https://shop.example.com',
      sort: 3
    }
  ];
  
  // Seed the projects
  return await seedCollection('projects', projects);
}

// Function to seed gallery
async function seedGallery() {
  console.log('🖼️ Preparing gallery data...');
  
  // Placeholder image URLs
  const placeholderImages = [
    'https://placehold.co/800x800/1abc9c/ffffff?text=Gallery+1',
    'https://placehold.co/800x800/3498db/ffffff?text=Gallery+2',
    'https://placehold.co/800x800/e74c3c/ffffff?text=Gallery+3',
    'https://placehold.co/800x800/f39c12/ffffff?text=Gallery+4',
  ];
  
  // Upload images and get their IDs
  const imageIds = [];
  for (let i = 0; i < placeholderImages.length; i++) {
    const imageId = await uploadFileFromUrl(
      placeholderImages[i],
      `Gallery Item ${i + 1}`,
      `Gallery image ${i + 1}`
    );
    imageIds.push(imageId);
  }
  
  // Create gallery items
  const galleryItems = [
    {
      title: 'Abstract Design',
      image: imageIds[0],
      description: 'An abstract design exploring color and form.',
      category: 'artwork',
      sort: 1
    },
    {
      title: 'City Landscape',
      image: imageIds[1],
      description: 'A photographic study of urban architecture.',
      category: 'photography',
      sort: 2
    },
    {
      title: 'Botanical Pattern',
      image: imageIds[2],
      description: 'A repeating pattern inspired by botanical forms.',
      category: 'design',
      sort: 3
    },
    {
      title: 'Geometric Tattoo Design',
      image: imageIds[3],
      description: 'A custom geometric tattoo design with sacred geometry elements.',
      category: 'tattoo',
      sort: 4
    }
  ];
  
  // Seed the gallery
  return await seedCollection('gallery', galleryItems);
}

// Function to set public permissions
async function setPublicPermissions() {
  console.log('🔒 Setting up public permissions...');
  
  try {
    // Get the public role ID
    const rolesResponse = await fetch(`${DIRECTUS_URL}/roles?filter[name][_eq]=Public`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    
    const rolesData = await rolesResponse.json();
    
    if (!rolesResponse.ok || !rolesData.data || rolesData.data.length === 0) {
      console.error('❌ Failed to find public role');
      return false;
    }
    
    const publicRoleId = rolesData.data[0].id;
    console.log(`✅ Found public role ID: ${publicRoleId}`);
    
    // Collections that need public read access
    const collections = ['blog_posts', 'projects', 'gallery', 'directus_files'];
    
    // Set read permissions for each collection
    for (const collection of collections) {
      console.log(`🔧 Setting read permission for ${collection}...`);
      
      // Check if permission already exists
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
          action: 'read',
          role: publicRoleId,
          fields: '*',
          permissions: {},
          validation: {}
        }),
      });
      
      if (response.ok) {
        console.log(`✅ Successfully set read permission for ${collection}`);
      } else {
        const errorData = await response.json();
        console.error(`❌ Failed to set permission for ${collection}:`, errorData.errors?.[0]?.message || 'Unknown error');
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error setting public permissions:', error.message);
    return false;
  }
}

// Main function to seed data
async function seedData() {
  console.log('🚀 Starting Directus data seeding...\n');
  
  // Step 1: Authenticate as admin
  await authenticate();
  
  // Step 2: Seed collections
  console.log('\n🌱 Seeding collections with data...');
  
  // Seed blog posts
  await seedBlogPosts();
  
  // Seed projects
  await seedProjects();
  
  // Seed gallery
  await seedGallery();
  
  // Set public permissions
  await setPublicPermissions();
  
  console.log('\n✅ Data seeding completed!');
  console.log('\nNext steps:');
  console.log('1. Check your Directus admin panel to verify the data');
  console.log('2. Test your frontend connection to Directus');
}

// Run the seeding process
seedData().catch(error => {
  console.error('❌ Unhandled error:', error);
}); 