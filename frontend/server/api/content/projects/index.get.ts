import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  
  try {
    const projects = await serverQueryContent(event, 'projects')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .find()

    const total = await serverQueryContent(event, 'projects').count()

    return {
      data: projects,
      total,
      page,
      limit
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching projects'
    })
  }
})