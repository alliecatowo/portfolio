
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const category = query.category as string
  
  try {
    // Sample blog posts with categories
    const allPosts = [
      {
        id: 1,
        title: "Getting Started with Vue.js",
        slug: "getting-started-vue",
        excerpt: "A comprehensive guide to building your first Vue.js application",
        content: "Vue.js is a progressive JavaScript framework...",
        date_published: "2024-03-01T00:00:00.000Z",
        cover_image: {
          url: "/placeholder-blog-dev-1.jpg"
        },
        categories: [
          { id: 1, name: "Vue.js" },
          { id: 2, name: "Frontend" }
        ],
        tags: ["vue", "javascript", "frontend"],
        category_type: "dev"
      },
      {
        id: 2,
        title: "The Art of Fine Line Tattoos",
        slug: "fine-line-tattoo-art",
        excerpt: "Exploring the delicate world of fine line tattoo techniques",
        content: "Fine line tattoos require precision and skill...",
        date_published: "2024-02-15T00:00:00.000Z",
        cover_image: {
          url: "/placeholder-blog-tattoo-1.jpg"
        },
        categories: [
          { id: 3, name: "Fine Line" },
          { id: 4, name: "Techniques" }
        ],
        tags: ["fine-line", "tattoo", "art"],
        category_type: "tattoo"
      },
      {
        id: 3,
        title: "Building RESTful APIs with Node.js",
        slug: "restful-apis-nodejs",
        excerpt: "Learn how to build scalable REST APIs using Node.js and Express",
        content: "Building APIs is a fundamental skill...",
        date_published: "2024-02-28T00:00:00.000Z",
        cover_image: {
          url: "/placeholder-blog-dev-2.jpg"
        },
        categories: [
          { id: 5, name: "Node.js" },
          { id: 6, name: "Backend" }
        ],
        tags: ["nodejs", "api", "backend"],
        category_type: "dev"
      },
      {
        id: 4,
        title: "Watercolor Tattoo Inspiration",
        slug: "watercolor-tattoo-inspiration",
        excerpt: "Discovering creative inspiration for watercolor tattoo designs",
        content: "Watercolor tattoos bring vibrancy...",
        date_published: "2024-01-20T00:00:00.000Z",
        cover_image: {
          url: "/placeholder-blog-tattoo-2.jpg"
        },
        categories: [
          { id: 7, name: "Watercolor" },
          { id: 8, name: "Design" }
        ],
        tags: ["watercolor", "design", "inspiration"],
        category_type: "tattoo"
      }
    ];

    // Filter by category if specified
    let posts = category ? allPosts.filter(post => post.category_type === category) : allPosts;
    
    // Sort by date (newest first)
    posts = posts.sort((a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime());
    
    // Paginate
    const startIndex = (page - 1) * limit;
    const paginatedPosts = posts.slice(startIndex, startIndex + limit);

    return {
      data: paginatedPosts,
      total: posts.length,
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