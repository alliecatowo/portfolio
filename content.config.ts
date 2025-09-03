import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
        category: z.enum(['dev']),
        tags: z.array(z.string()),
        author: z.string(),
        published: z.boolean(),
        featured: z.boolean(),
        date_published: z.string().optional(),
        featured_image: z.string().optional(),
        content: z.string().optional(),
        slug: z.string(),
        // Allow Nuxt Content + remark-reading-time to attach computed reading time
        readingTime: z.object({
          text: z.string(),
          minutes: z.number(),
          time: z.number(),
          words: z.number()
        }).optional()
      })
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**/*.md',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
        featured: z.boolean(),
        status: z.enum(['published', 'draft']).optional(),
        technologies: z.array(z.string()).optional(),
        github: z.string().optional(),
        liveDemo: z.string().optional(),
        demo: z.string().optional(),
        slug: z.string().optional(),
        images: z.any().optional(),
        image: z.string().optional()
      })
    })
  }
})
