export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    })
  }
  
  try {
    // For now, return sample data until we set up proper Nuxt Content server queries
    if (slug === 'getting-started') {
      return {
        title: "Getting Started with Development",
        slug: "getting-started", 
        content: "This is a sample blog post about getting started with development...",
        excerpt: "A beginner's guide to web development",
        date: new Date().toISOString(),
        _path: "/blog/dev/getting-started"
      }
    }

    throw createError({
      statusCode: 404,
      statusMessage: 'Blog post not found'
    })
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching blog post'
    })
  }
})