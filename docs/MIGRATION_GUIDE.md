# Migrating from Strapi to Directus

This guide provides instructions for migrating your content from Strapi to Directus for the portfolio project.

## Data Structure Mapping

### Content Types Mapping

| Strapi Collection | Directus Collection | Notes |
|-------------------|---------------------|-------|
| `articles` | `blog_posts` | Blog posts for both developer and tattoo portfolios |
| `projects` | `projects` | Developer portfolio projects |
| `tattoo-works` | `gallery` (with type="tattoo") | Tattoo portfolio gallery items |
| `testimonials` | `testimonials` | Client testimonials |

### Field Mapping for Articles/Blog Posts

| Strapi Field | Directus Field | Notes |
|--------------|----------------|-------|
| `title` | `title` | |
| `content` | `content` | |
| `slug` | `slug` | |
| `coverImage` | `cover_image` | File handling is different |
| `summary` | `excerpt` | |
| `portfolioType` | `portfolio_type` | In Directus, use: 'dev', 'tattoo', or 'both' |
| `publishedAt` | `date_published` | |
| `featured` | `featured` | |
| `category` | `category` | |

### Field Mapping for Projects

| Strapi Field | Directus Field | Notes |
|--------------|----------------|-------|
| `title` | `title` | |
| `description` | `description` | |
| `slug` | `slug` | |
| `featuredImage` | `cover_image` | File handling is different |
| `images` | `gallery` | File handling is different |
| `technologies` | `technologies` | In Directus, use the M2M relation |
| `websiteUrl` | `live_url` | |
| `githubUrl` | `github` | |
| `featured` | `featured` | |
| `status` | `status` | |
| `category` | `category` | |

### Field Mapping for Tattoo Works

| Strapi Field | Directus Field | Notes |
|--------------|----------------|-------|
| `title` | `title` | |
| `description` | `description` | |
| `image` | `image` | File handling is different |
| `featured` | `featured` | |
| `clientTestimonial` | `client_testimonial` | |
| `date` | `date` | |
| `style` | `style` | |

## Migration Steps

1. **Export Data from Strapi**

   ```bash
   # Navigate to Strapi project folder
   cd strapi-portfolio
   
   # Create a backup of your database
   npm run strapi export -- --file=export.tar.gz
   
   # Extract the backup
   tar -xzvf export.tar.gz
   ```

2. **Convert the Data Format**

   Create a script to convert the Strapi data format to Directus format. Here's a simple Node.js example:

   ```javascript
   // migrate-data.js
   const fs = require('fs');
   const path = require('path');
   
   // Load Strapi exported data
   const strapiData = require('./export/data.json');
   
   // Convert blog posts/articles
   const blogPosts = strapiData.articles.map(article => ({
     title: article.title,
     content: article.content,
     slug: article.slug,
     excerpt: article.summary,
     portfolio_type: article.portfolioType.toLowerCase(),
     date_published: article.publishedAt,
     featured: article.featured,
     // Handle relationships and files differently
   }));
   
   // Convert projects
   const projects = strapiData.projects.map(project => ({
     title: project.title,
     description: project.description,
     slug: project.slug,
     github: project.githubUrl,
     live_url: project.websiteUrl,
     featured: project.featured,
     status: project.status,
     // Handle relationships and files differently
   }));
   
   // Convert tattoo works to gallery items
   const galleryItems = strapiData['tattoo-works'].map(work => ({
     title: work.title,
     description: work.description,
     type: 'tattoo',
     featured: work.featured,
     client_testimonial: work.clientTestimonial,
     date: work.date,
     // Handle relationships and files differently
   }));
   
   // Write the converted data to files
   fs.writeFileSync(
     path.join(__dirname, 'directus-blog-posts.json'),
     JSON.stringify(blogPosts, null, 2)
   );
   
   fs.writeFileSync(
     path.join(__dirname, 'directus-projects.json'),
     JSON.stringify(projects, null, 2)
   );
   
   fs.writeFileSync(
     path.join(__dirname, 'directus-gallery.json'),
     JSON.stringify(galleryItems, null, 2)
   );
   
   console.log('Data conversion complete!');
   ```

3. **Handle Media Files**

   Media files need special handling:
   
   1. Download all files from Strapi's uploads directory
   2. Upload them to Directus using the Directus API or the admin interface
   3. Update the references in your converted data

4. **Import into Directus**

   Use the Directus API to import the converted data:

   ```javascript
   // import-to-directus.js
   const axios = require('axios');
   const fs = require('fs');
   
   const DIRECTUS_URL = 'https://allisons-portfolio-directus-9vxdi.ondigitalocean.app';
   const DIRECTUS_TOKEN = 'your_directus_token';
   
   const blogPosts = require('./directus-blog-posts.json');
   const projects = require('./directus-projects.json');
   const galleryItems = require('./directus-gallery.json');
   
   async function importData() {
     const directus = axios.create({
       baseURL: DIRECTUS_URL,
       headers: {
         'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
         'Content-Type': 'application/json'
       }
     });
     
     // Import blog posts
     for (const post of blogPosts) {
       try {
         await directus.post('/items/blog_posts', post);
         console.log(`Imported blog post: ${post.title}`);
       } catch (error) {
         console.error(`Failed to import blog post ${post.title}:`, error.message);
       }
     }
     
     // Import projects
     for (const project of projects) {
       try {
         await directus.post('/items/projects', project);
         console.log(`Imported project: ${project.title}`);
       } catch (error) {
         console.error(`Failed to import project ${project.title}:`, error.message);
       }
     }
     
     // Import gallery items
     for (const item of galleryItems) {
       try {
         await directus.post('/items/gallery', item);
         console.log(`Imported gallery item: ${item.title}`);
       } catch (error) {
         console.error(`Failed to import gallery item ${item.title}:`, error.message);
       }
     }
     
     console.log('Import complete!');
   }
   
   importData();
   ```

5. **Verify the Import**

   Check your Directus admin panel to ensure all content was imported correctly.

## Manual Data Entry Alternative

If the amount of data is not too large, you may find it easier to manually enter the content into Directus:

1. Open the Directus admin panel
2. Navigate to each collection
3. Click "Create Item" and manually copy data from Strapi
4. Upload files directly through the Directus interface

## Testing

After migrating the data:

1. Start your frontend development server
2. Navigate to all pages that display content
3. Ensure all data is displaying correctly
4. Check that images and other media are loading properly

## Common Issues

- **File/Image Issues**: Directus and Strapi handle file storage differently. Make sure to update all file references.
- **Relationship Fields**: Relations in Directus may need to be set up differently than in Strapi.
- **Date Formats**: Ensure dates are formatted correctly for Directus.
- **Missing Fields**: Some fields might need to be added to your Directus schema if they don't exist.
- **URL Differences**: Make sure your frontend is pointing to the correct Directus API URL.

## Further Support

If you encounter issues during migration, refer to:

- Directus Documentation: https://docs.directus.io/
- Directus API Reference: https://docs.directus.io/reference/introduction.html 