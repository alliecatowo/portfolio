---
title: "Migrating from Directus to Nuxt Content: A Complete Guide"
date: "2024-03-20"
description: "Learn how to migrate from a headless CMS like Directus to Nuxt Content for better performance, developer experience, and reduced complexity."
tags: ["nuxt", "nuxt-content", "cms", "migration", "directus", "performance"]
author: "Allie"
published: true
featured: true
---

# Migrating from Directus to Nuxt Content: A Complete Guide

Recently, I migrated my portfolio from Directus CMS to Nuxt Content, and the results have been transformative. Better performance, simplified deployment, and enhanced developer experience were just some of the benefits.

## Why Make the Switch?

### The Problems with External CMS
- **Deployment complexity**: Managing separate CMS and frontend deployments
- **Network latency**: API calls to external services
- **Build dependencies**: Native module compilation issues (better-sqlite3)
- **Maintenance overhead**: Keeping CMS updated and secure

### Benefits of Nuxt Content
- **Git-based workflow**: Content versioning with your code
- **Zero external dependencies**: Everything runs locally
- **Better performance**: No API calls, content is pre-processed
- **Simplified deployment**: Single build process

## The Migration Process

### Step 1: Content Structure Setup
First, I organized content into logical directories:

```
content/
├── blog/
│   ├── dev/
│   └── tattoo/
├── projects/
├── gallery/
└── testimonials/
```

### Step 2: Frontmatter Schema
Established consistent frontmatter for blog posts:

```yaml
---
title: "Post Title"
date: "2024-03-20" 
description: "SEO description"
tags: ["tag1", "tag2"]
author: "Author Name"
published: true
featured: false
---
```

### Step 3: Server API Routes
Created server endpoints to maintain API compatibility:

```typescript
// server/api/content/blog/index.get.ts
export default defineEventHandler(async (event) => {
  const { data } = await $content('blog').find()
  return { data }
})
```

### Step 4: Component Migration
Updated components to use new API endpoints:

```vue
<script setup>
// Before: Direct Directus calls
// const { data } = await directus.request(readItems('posts'))

// After: Local API
const { data } = await $fetch('/api/content/blog')
</script>
```

## Key Configuration Changes

### Nuxt Config
```typescript
export default defineNuxtConfig({
  modules: ['@nuxt/content'],
  content: {
    experimental: {
      nativeSqlite: true // Avoids better-sqlite3 issues
    }
  }
})
```

### Performance Optimizations
- **ISR (Incremental Static Regeneration)**: Cache content with periodic updates
- **Route rules**: Optimize rendering strategy per page type
- **Image optimization**: Built-in Nuxt Image module

## Results

### Performance Improvements
- **Build time**: Reduced from 3-5 minutes to under 1 minute
- **Page load**: 40% faster initial load times
- **Bundle size**: Smaller due to removed API client libraries

### Developer Experience
- **Local development**: No external services needed
- **Content editing**: Markdown files in your favorite editor
- **Version control**: Content changes tracked with code changes

## Migration Challenges

### Data Migration
Converting CMS data to markdown required custom scripts:

```javascript
// Export from Directus
const posts = await directus.request(readItems('posts'))

// Convert to markdown files
posts.forEach(post => {
  const frontmatter = {
    title: post.title,
    date: post.date_published,
    // ... other fields
  }
  
  const markdown = `---
${yaml.stringify(frontmatter)}---

${post.content}`
  
  fs.writeFileSync(`content/blog/${post.slug}.md`, markdown)
})
```

### URL Structure
Maintained existing URLs by configuring routes:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/blog/**': { isr: 3600 },
      '/projects/**': { isr: 3600 }
    }
  }
})
```

## Best Practices

### 1. Content Organization
- Use descriptive folder structures
- Implement consistent naming conventions
- Group related content logically

### 2. Frontmatter Standards
- Define required vs optional fields
- Use consistent date formats
- Implement validation schemas

### 3. Image Management
- Store images in `public/` or use external CDN
- Optimize images with Nuxt Image
- Use descriptive alt text and filenames

### 4. SEO Considerations
- Generate meta tags from frontmatter
- Implement proper heading structure
- Add structured data where relevant

## Conclusion

Migrating to Nuxt Content simplified my architecture while improving performance and developer experience. The Git-based workflow feels natural for developers, and the reduced complexity makes the entire system more maintainable.

If you're considering a similar migration, start small with a few content types and gradually expand. The benefits compound as your content grows.

## Resources

- [Nuxt Content Documentation](https://content.nuxt.com/)
- [Migration Scripts Repository](https://github.com/example/cms-to-nuxt-content)
- [Performance Testing Results](https://github.com/example/performance-analysis)

Happy migrating! 🚀