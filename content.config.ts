import { readdirSync, readFileSync } from 'node:fs'
import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'

// Unpublished blog posts (anything without `published: true`) stay in content/blog for
// dev preview, Studio and `validate:content`, but production builds leave them out of the
// collection entirely. Filtering `published` at query time isn't enough: every collection
// row, body included, ships to the client in /__nuxt_content/blog/sql_dump.txt.
// Set CONTENT_INCLUDE_DRAFTS=true to keep them in a production build (e.g. a Studio host).
function unpublishedBlogPosts(): string[] {
  const dir = new URL('./content/blog/', import.meta.url)
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter(file => file.endsWith('.md'))
    .filter((file) => {
      const frontmatter = readFileSync(new URL(file, dir), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
      return !/^published:\s*true\s*$/m.test(frontmatter)
    })
    .map(file => `blog/${file}`)
}
const excludeDrafts = process.env.NODE_ENV === 'production' && process.env.CONTENT_INCLUDE_DRAFTS !== 'true'
const blogDrafts = excludeDrafts ? unpublishedBlogPosts() : []

export default defineContentConfig({
  collections: {
    // Wrapped for @nuxtjs/sitemap; drafts are excluded via the afterParse hook in nuxt.config.ts,
    // and production builds drop them from the collection entirely (blogDrafts above)
    blog: defineCollection(asSitemapCollection({
      type: 'page',
      source: { include: 'blog/**/*.md', exclude: blogDrafts },
      schema: z.object({
        title: z.string(),
        // Accept both string and Date — Nuxt Content may coerce YAML dates
        date: z.union([z.string(), z.date()]).transform(v => String(v)),
        description: z.string(),
        // Extend enum as new content categories are added
        category: z.enum(['dev', 'tattoo', 'life', 'project']).default('dev'),
        tags: z.array(z.string()).default([]),
        author: z.string().default('Allie'),
        published: z.boolean().default(false),
        featured: z.boolean().default(false),
        date_published: z.string().optional(),
        featured_image: z.string().optional(),
        // 1200x630 share image; falls back to featured_image, then /images/og/default.png
        ogImage: z.string().optional(),
        content: z.string().optional(),
        slug: z.string(),
        readingTime: z.object({
          text: z.string(),
          minutes: z.number(),
          time: z.number(),
          words: z.number()
        }).optional()
      })
    })),
    projects: defineCollection(asSitemapCollection({
      type: 'page',
      source: 'projects/**/*.md',
      schema: z.object({
        title: z.string(),
        date: z.union([z.string(), z.date()]).transform(v => String(v)),
        description: z.string(),
        featured: z.boolean().default(false),
        status: z.enum(['published', 'draft']).default('draft'),
        technologies: z.array(z.string()).default([]),
        tags: z.array(z.string()).default([]),
        github: z.string().url().optional(),
        demo: z.string().url().optional(),
        devpost: z.string().url().optional(),
        // Explicit ordering (ascending); projects without it sort after, by date
        order: z.number().optional(),
        award: z.string().optional(),
        group: z.string().optional(),
        // Position within its /projects group (ascending); falls back to the normal order
        groupOrder: z.number().optional(),
        slug: z.string().optional(),
        images: z.any().optional(),
        image: z.string().optional(),
        imageAlt: z.string().optional(),
        // 1200x630 share image; falls back to /images/og/<slug>.png if present, then the default
        ogImage: z.string().optional()
      })
    })),
    pages: defineCollection({
      type: 'data',
      source: 'pages/**/*.{yml,yaml,json}',
      schema: z.object({
        slug: z.string(),
        layout: z.enum(['home', 'about']),
        seo: z.object({
          title: z.string(),
          description: z.string(),
          // Legacy; no longer rendered (search engines ignore meta keywords)
          keywords: z.array(z.string()).optional()
        }).optional(),
        hero: z.object({
          title: z.string(),
          subtitle: z.string().optional(),
          description: z.string().optional(),
          // Small award/winner line under the hero description
          award: z.object({
            label: z.string(),
            to: z.string()
          }).optional(),
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
          body: z.string().optional(),
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
            download: z.union([z.boolean(), z.string()]).optional()
          })).optional(),
          card: z.object({
            title: z.string(),
            description: z.string(),
            introduction: z.string().optional(),
            image: z.string().optional(),
            imageAlt: z.string().optional(),
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
              download: z.union([z.boolean(), z.string()]).optional()
            })).optional()
          }).optional(),
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
            download: z.union([z.boolean(), z.string()]).optional()
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
            // Short date label shown above the title, e.g. "2018–2021"
            period: z.string().optional(),
            color: z.string().optional(),
            icon: z.string().optional(),
            description: z.string()
          }))
        }).optional(),
        // About page "Now" block: current role plus links to current projects
        now: z.object({
          title: z.string(),
          description: z.string(),
          award: z.object({
            label: z.string(),
            to: z.string()
          }).optional(),
          projects: z.array(z.object({
            title: z.string(),
            to: z.string(),
            description: z.string()
          })).optional()
        }).optional(),
        life: z.object({
          title: z.string(),
          description: z.string().optional(),
          cards: z.array(z.object({
            title: z.string(),
            color: z.string().optional(),
            icon: z.string().optional(),
            image: z.string().optional(),
            alt: z.string().optional(),
            // CSS object-position for the cropped image, e.g. "50% 30%"
            imagePosition: z.string().optional(),
            // Optional internal link, e.g. a related project page
            to: z.string().optional(),
            // Render as a tall feature card on wide screens
            featured: z.boolean().optional(),
            description: z.string()
          }))
        }).optional()
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
