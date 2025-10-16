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
    contact: defineCollection({
      type: 'data',
      source: 'contact.{yml,yaml,json}',
      schema: z.object({
        hero: z.object({
          title: z.string(),
          description: z.string()
        }),
        contactCard: z.object({
          title: z.string(),
          description: z.string(),
          methods: z.array(
            z.object({
              id: z.string(),
              label: z.string(),
              value: z.string(),
              url: z.string(),
              icon: z.string()
            })
          )
        }),
        availability: z.object({
          status: z.string(),
          description: z.string(),
          indicatorClass: z.string().optional()
        }),
        form: z.object({
          title: z.string(),
          nameField: z.object({
            label: z.string(),
            placeholder: z.string()
          }),
          emailField: z.object({
            label: z.string(),
            placeholder: z.string()
          }),
          subjectField: z.object({
            label: z.string(),
            placeholder: z.string()
          }),
          messageField: z.object({
            label: z.string(),
            placeholder: z.string()
          }),
          subjectOptions: z.array(
            z.object({
              label: z.string(),
              value: z.string(),
              icon: z.string().optional()
            })
          ),
          defaultSubject: z.string().optional(),
          submitButton: z.object({
            label: z.string(),
            loadingLabel: z.string()
          }),
          resetButton: z.object({
            label: z.string()
          }),
          successAlert: z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string().optional()
          }),
          errorAlert: z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string().optional()
          })
        }),
        faq: z.object({
          title: z.string(),
          items: z.array(
            z.object({
              question: z.string(),
              answer: z.string()
            })
          )
        }),
        meta: z.object({
          title: z.string(),
          description: z.string()
        })
      })
    })
  }
})
