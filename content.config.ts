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
    pages: defineCollection({
      type: 'data',
      source: 'pages/**/*.{yml,yaml,json}',
      schema: z.object({
        slug: z.string(),
        layout: z.enum(['home', 'about']),
        seo: z.object({
          title: z.string(),
          description: z.string(),
          keywords: z.array(z.string())
        }).optional(),
        hero: z.object({
          title: z.string(),
          subtitle: z.string().optional(),
          description: z.string().optional(),
          note: z.object({
            prefix: z.string(),
            keys: z.array(z.string()),
            suffix: z.string()
          }).optional(),
          image: z.object({
            src: z.string(),
            alt: z.string(),
            status: z.string().optional()
          }).optional(),
          stats: z.array(z.object({
            label: z.string(),
            value: z.string()
          })).optional(),
          paragraphs: z.array(z.string()).optional(),
          buttons: z.array(z.object({
            label: z.string(),
            to: z.string().optional(),
            href: z.string().optional(),
            variant: z.string().optional(),
            color: z.string().optional(),
            size: z.string().optional(),
            icon: z.string().optional(),
            iconPosition: z.enum(['leading', 'trailing']).optional(),
            external: z.boolean().optional(),
            download: z.boolean().optional()
          })).optional(),
          card: z.object({
            title: z.string(),
            description: z.string(),
            introduction: z.string().optional(),
            image: z.string().optional(),
            badges: z.array(z.object({
              title: z.string(),
              items: z.array(z.string())
            })).optional(),
            buttons: z.array(z.object({
              label: z.string(),
              to: z.string().optional(),
              href: z.string().optional(),
              variant: z.string().optional(),
              color: z.string().optional(),
              size: z.string().optional(),
              icon: z.string().optional(),
              iconPosition: z.enum(['leading', 'trailing']).optional(),
              external: z.boolean().optional(),
              download: z.boolean().optional()
            })).optional()
          }).optional()
        }),
        quickLinks: z.object({
          links: z.array(z.object({
            title: z.string(),
            description: z.string(),
            to: z.string(),
            icon: z.string().optional()
          }))
        }).optional(),
        projects: z.object({
          title: z.string(),
          description: z.string(),
          cta: z.object({
            label: z.string(),
            to: z.string()
          }).optional()
        }).optional(),
        skills: z.object({
          title: z.string(),
          description: z.string().optional(),
          items: z.array(z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string().optional()
          })).optional(),
          categories: z.array(z.object({
            title: z.string(),
            color: z.string().optional(),
            icon: z.string().optional(),
            items: z.array(z.string())
          })).optional()
        }).optional(),
        blog: z.object({
          title: z.string(),
          description: z.string(),
          cta: z.object({
            label: z.string(),
            to: z.string()
          }).optional()
        }).optional(),
        cta: z.object({
          title: z.string(),
          description: z.string(),
          buttons: z.array(z.object({
            label: z.string(),
            to: z.string().optional(),
            href: z.string().optional(),
            variant: z.string().optional(),
            color: z.string().optional(),
            size: z.string().optional(),
            icon: z.string().optional(),
            iconPosition: z.enum(['leading', 'trailing']).optional(),
            external: z.boolean().optional(),
            download: z.boolean().optional()
          })).optional(),
          socials: z.array(z.object({
            label: z.string(),
            href: z.string(),
            icon: z.string().optional()
          })).optional()
        }).optional(),
        journey: z.object({
          title: z.string(),
          items: z.array(z.object({
            title: z.string(),
            color: z.string().optional(),
            description: z.string()
          }))
        }).optional(),
        life: z.object({
          title: z.string(),
          cards: z.array(z.object({
            title: z.string(),
            color: z.string().optional(),
            icon: z.string().optional(),
            image: z.string().optional(),
            alt: z.string().optional(),
            description: z.string()
          }))
        }).optional()
      })
    })
  }
})
