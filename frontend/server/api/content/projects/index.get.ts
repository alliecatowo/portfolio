export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  
  try {
    // For now, return sample data until we set up proper Nuxt Content server queries  
    const sampleProjects = [
      {
        title: "Sample Project",
        slug: "sample-project",
        description: "A sample project showcasing modern web development",
        technologies: ["Vue.js", "Nuxt", "TypeScript"],
        date: new Date().toISOString(),
        _path: "/projects/sample-project"
      }
    ]

    return {
      data: sampleProjects,
      total: sampleProjects.length,
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