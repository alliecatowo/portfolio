# Tattoo Portfolio - Extracted Code

This directory contains all the tattoo portfolio code that was removed from the main portfolio application for future use as a separate project.

## Extracted Components

### Pages

- `pages/tattoo/` - All tattoo portfolio pages
  - `index.vue` - Tattoo portfolio home
  - `about.vue` - About the artist
  - `gallery.vue` & `gallery/index.vue` - Art gallery
  - `blog/` - Tattoo blog pages
  - `contact.vue` - Contact/booking
  - `testimonials/index.vue` - Client testimonials

### Components

- `components/tattoo/` - Tattoo-specific components
  - `FeaturedWorks.vue` - Featured tattoo pieces component

### Content

- `content/tattoo/` - All tattoo blog posts
- `content/gallery/` - Tattoo gallery items

## Dependencies

When setting up as a separate project, you'll need:

### Core Dependencies

- Nuxt 4
- Vue 3
- @nuxt/content
- @nuxt/ui
- @nuxt/image

### Site Configuration

The original site configuration for tattoo mode:

```typescript
tattoo: {
  domain: 'allisons.gay',
  title: "Allison's Tattoo Art",
  description: "Unique and creative tattoo designs with a personal touch",
  type: 'tattoo',
  themeClass: 'theme-tattoo',
  socialLinks: {
    instagram: 'https://instagram.com/allison.tattoo',
    twitter: 'https://twitter.com/allison.tattoo',
    email: 'ink@allisons.gay',
  }
}
```

### CSS Theme Variables

Key CSS variables for tattoo theme (extract from main.css):

```css
--gradient-tattoo: linear-gradient(
  135deg,
  var(--ui-color-pink-400) 0%,
  var(--ui-color-rose-500) 50%,
  var(--ui-color-purple-600) 100%
);

.theme-tattoo {
  /* Tattoo-specific theme styles */
}
```

## Migration Instructions

1. Create new Nuxt 4 project
2. Copy all files from this directory to appropriate locations
3. Install dependencies listed above
4. Configure site settings for tattoo domain
5. Set up content management for gallery and blog
6. Configure deployment for tattoo domain

## Original Structure

This code was originally part of a multi-site portfolio system with:

- Route-based site detection (`/tattoo/*` routes)
- Shared component library
- Unified content management
- Theme switching system

## Content Types

### Gallery Items

```yaml
---
title: "Piece Title"
description: "Description"
image: "/path/to/image"
style: "watercolor" | "fine-line" | "botanical"
featured: true/false
---
```

### Blog Posts

```yaml
---
title: 'Post Title'
description: 'Description'
date: YYYY-MM-DD
tags: ['tag1', 'tag2']
featured: true/false
---
```

## Future Enhancements

When creating the separate tattoo portfolio:

- Add booking system integration
- Implement image galleries with lightbox
- Add contact form functionality
- Set up Instagram API integration
- Configure separate analytics and SEO

## Notes

- All content was file-based using @nuxt/content
- Images were optimized with @nuxt/image
- Responsive design with mobile-first approach
- Accessibility features included
- SEO optimized with meta tags and structured data
