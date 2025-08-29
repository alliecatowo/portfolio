export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  
  try {
    // Sample projects data with structure matching frontend expectations
    const sampleProjects = [
      {
        id: 1,
        title: "Portfolio Website",
        description: "A full-stack portfolio website built with Nuxt.js and Tailwind CSS",
        categories: [
          { id: 1, name: "Vue.js" },
          { id: 2, name: "Nuxt.js" },
          { id: 3, name: "TypeScript" }
        ],
        thumbnail: {
          url: "/placeholder-project-1.jpg"
        },
        demoUrl: "https://example.com",
        repositoryUrl: "https://github.com/example/portfolio"
      },
      {
        id: 2,
        title: "E-commerce Platform",
        description: "A modern e-commerce solution with payment integration",
        categories: [
          { id: 4, name: "React" },
          { id: 5, name: "Node.js" },
          { id: 6, name: "MongoDB" }
        ],
        thumbnail: {
          url: "/placeholder-project-2.jpg"
        },
        demoUrl: "https://example.com/shop",
        repositoryUrl: "https://github.com/example/ecommerce"
      },
      {
        id: 3,
        title: "Task Management App",
        description: "A collaborative task management application with real-time updates",
        categories: [
          { id: 7, name: "Vue.js" },
          { id: 8, name: "Socket.io" },
          { id: 9, name: "Express.js" }
        ],
        thumbnail: {
          url: "/placeholder-project-3.jpg"
        },
        demoUrl: "https://example.com/tasks",
        repositoryUrl: "https://github.com/example/task-manager"
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