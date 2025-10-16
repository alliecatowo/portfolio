import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const callToActionSchema = z.object({
  label: z.string(),
  to: z.string(),
  variant: z.string().optional(),
  leadingIcon: z.string().optional(),
  trailingIcon: z.string().optional(),
  icon: z.string().optional()
})

const badgeItemSchema = z.union([
  z.string(),
  z.object({
    label: z.string(),
    color: z.string().optional()
  })
])

const showcaseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  summary: z.string().optional(),
  image: z.string().optional(),
  iconHighlights: z
    .array(
      z.object({
        icon: z.string(),
        delay: z.string().optional()
      })
    )
    .optional(),
  specializations: z
    .array(
      z.object({
        title: z.string().optional(),
        items: z.array(badgeItemSchema).optional()
      })
    )
    .optional(),
  primaryCta: callToActionSchema.optional(),
  secondaryCta: callToActionSchema.optional()
})

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
    }),
    home: defineCollection({
      type: 'data',
      source: 'home.yml',
      schema: z
        .object({
          seo: z
            .object({
              title: z.string().optional(),
              description: z.string().optional(),
              keywords: z.array(z.string()).optional()
            })
            .optional(),
          hero: z
            .object({
              title: z.string().optional(),
              subtitle: z.string().optional(),
              note: z
                .object({
                  label: z.string().optional(),
                  suffix: z.string().optional(),
                  keys: z.array(z.string()).optional()
                })
                .optional()
            })
            .optional(),
          showcase: showcaseSchema.optional(),
          quickLinks: z
            .array(
              z.object({
                title: z.string(),
                description: z.string(),
                to: z.string(),
                icon: z.string().optional()
              })
            )
            .optional(),
          projectsSection: z
            .object({
              title: z.string().optional(),
              description: z.string().optional(),
              ctaLabel: z.string().optional()
            })
            .optional(),
          skillsSection: z
            .object({
              title: z.string().optional(),
              description: z.string().optional(),
              items: z
                .array(
                  z.object({
                    title: z.string().optional(),
                    description: z.string().optional(),
                    icon: z.string().optional()
                  })
                )
                .optional()
            })
            .optional(),
          blogSection: z
            .object({
              title: z.string().optional(),
              description: z.string().optional(),
              ctaLabel: z.string().optional()
            })
            .optional(),
          contactSection: z
            .object({
              title: z.string().optional(),
              description: z.string().optional(),
              primaryCta: callToActionSchema.optional(),
              secondaryCta: callToActionSchema.optional()
            })
            .optional()
        })
        .optional()
    })
  }
})