import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  
  try {
    const posts = await serverQueryContent(event, 'blog')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .find()

    const total = await serverQueryContent(event, 'blog').count()

    return {
      data: posts,
      total,
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