export default defineEventHandler(async (event) => {
  try {
    // Sample testimonials data
    const testimonials = [
      {
        id: 1,
        name: "Sarah Johnson",
        text: "Allison created the most beautiful botanical piece for me. Her attention to detail and artistic vision exceeded all my expectations.",
        rating: 5,
        image: {
          url: "/placeholder-testimonial-1.jpg"
        },
        tattoo_image: {
          url: "/placeholder-tattoo-testimonial-1.jpg"
        },
        date: "2024-03-15"
      },
      {
        id: 2,
        name: "Mike Chen",
        text: "The watercolor technique is incredible. Allison brought my vision to life in ways I never imagined possible.",
        rating: 5,
        image: {
          url: "/placeholder-testimonial-2.jpg"
        },
        tattoo_image: {
          url: "/placeholder-tattoo-testimonial-2.jpg"
        },
        date: "2024-02-28"
      },
      {
        id: 3,
        name: "Emma Rodriguez",
        text: "Professional, clean, and absolutely stunning work. I'll definitely be back for my next piece!",
        rating: 5,
        image: {
          url: "/placeholder-testimonial-3.jpg"
        },
        tattoo_image: {
          url: "/placeholder-tattoo-testimonial-3.jpg"
        },
        date: "2024-02-10"
      }
    ];

    return {
      data: testimonials,
      total: testimonials.length
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching testimonials'
    })
  }
})