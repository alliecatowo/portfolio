// Stand-in for `@nuxt/content`, loaded only by scripts/validate-content.ts.
//
// The real defineCollection() converts the zod schema to JSON Schema and throws
// outside a running Nuxt (its zod converters are registered by the module
// setup). The validator needs the raw zod schemas, so these two helpers become
// identity functions. Everything else (z, property, ...) is the real export,
// so content.config.ts and @nuxtjs/sitemap/content share one zod instance.
export * from '@nuxt/content'

export const defineCollection = collection => collection
export const defineContentConfig = config => config
