import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.{md,mdc}',
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
      source: 'projects/**/*.{md,mdc}',
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
    }),
    pages: defineCollection({
      type: 'page',
      source: 'pages/**/*.{md,mdc}',
      schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        slug: z.string().optional(),
        layout: z.enum(['home', 'about']).optional()
      })
    }),
    globals: defineCollection({
      type: 'data',
      source: 'globals/**/*.{yml,yaml,json}',
      schema: z.object({
        slug: z.string(),
        brand: z.object({
          title: z.string(),
          tagline: z.string().optional()
        }),
        description: z.string().optional(),
        socials: z.array(z.object({
          label: z.string(),
          href: z.string(),
          icon: z.string(),
          tooltip: z.string().optional(),
          external: z.boolean().optional()
        })).optional(),
        navigation: z.array(z.object({
          label: z.string(),
          to: z.string()
        })).optional(),
        contact: z.object({
          description: z.string().optional(),
          email: z.string().optional()
        }).optional(),
        bottom: z.object({
          text: z.string().optional(),
          subtext: z.string().optional()
        }).optional()
      })
    })
  }
})
