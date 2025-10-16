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
        readingTime: z.object({
          text: z.string(),
          minutes: z.number(),
          time: z.number(),
          words: z.number()
        }).optional()
      })
    }),
    about: defineCollection({
      type: 'page',
      source: 'about/**/*.md',
      schema: z.object({
        title: z.string(),
        hero: z
          .object({
            heading: z.string(),
            subheading: z.string().optional(),
            image: z.string().optional(),
            imageAlt: z.string().optional(),
            status: z
              .object({
                label: z.string(),
                indicatorColorClass: z.string().optional()
              })
              .optional(),
            stats: z
              .array(
                z.object({
                  label: z.string(),
                  value: z.string()
                })
              )
              .optional(),
            ctas: z
              .array(
                z.object({
                  label: z.string(),
                  to: z.string().optional(),
                  href: z.string().optional(),
                  variant: z.string().optional(),
                  color: z.string().optional(),
                  size: z.string().optional(),
                  icon: z.string().optional(),
                  target: z.string().optional(),
                  download: z.boolean().optional(),
                  type: z.enum(['route', 'external']).optional()
                })
              )
              .optional()
          })
          .optional(),
        introduction: z.array(z.string()).optional(),
        journey: z
          .object({
            title: z.string(),
            items: z.array(
              z.object({
                title: z.string(),
                description: z.string(),
                indicatorClass: z.string().optional(),
                titleClass: z.string().optional()
              })
            )
          })
          .optional(),
        skills: z
          .object({
            title: z.string(),
            categories: z.array(
              z.object({
                title: z.string(),
                icon: z.string(),
                gradientClass: z.string().optional(),
                iconBackgroundClass: z.string().optional(),
                iconColorClass: z.string().optional(),
                titleClass: z.string().optional(),
                highlights: z.array(z.string())
              })
            )
          })
          .optional(),
        interests: z
          .object({
            title: z.string(),
            cards: z.array(
              z.object({
                title: z.string(),
                description: z.string(),
                image: z.string(),
                imageAlt: z.string(),
                gradientClass: z.string().optional(),
                icon: z.string(),
                titleClass: z.string().optional()
              })
            )
          })
          .optional(),
        closing: z
          .object({
            title: z.string(),
            description: z.string(),
            buttons: z
              .array(
                z.object({
                  label: z.string(),
                  to: z.string().optional(),
                  href: z.string().optional(),
                  variant: z.string().optional(),
                  color: z.string().optional(),
                  size: z.string().optional(),
                  icon: z.string().optional(),
                  target: z.string().optional(),
                  type: z.enum(['route', 'external']).optional()
                })
              )
              .optional(),
            socialLinks: z
              .array(
                z.object({
                  label: z.string(),
                  href: z.string(),
                  icon: z.string(),
                  ariaLabel: z.string()
                })
              )
              .optional()
          })
          .optional(),
        seo: z
          .object({
            title: z.string().optional(),
            description: z.string().optional(),
            keywords: z.union([z.string(), z.array(z.string())]).optional()
          })
          .optional()
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