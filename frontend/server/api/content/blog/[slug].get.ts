import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    })
  }
  
  try {
    const post = await serverQueryContent(event, 'blog')
      .where({ _path: { $regex: `/${slug}$` } })
      .findOne()

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog post not found'
      })
    }

    return post
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