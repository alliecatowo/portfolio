
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  
  try {
    // For now, return sample data until we set up proper Nuxt Content server queries
    const samplePosts = [
      {
        title: "Getting Started with Development",
        slug: "getting-started",
        excerpt: "A beginner's guide to web development...",
        date: new Date().toISOString(),
        _path: "/blog/dev/getting-started"
      }
    ]

    return {
      data: samplePosts,
      total: samplePosts.length,
      page,
      limit
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching blog posts'
    })
  }
})