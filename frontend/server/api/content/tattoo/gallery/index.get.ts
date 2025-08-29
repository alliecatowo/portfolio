export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const featured = query.featured === 'true'
  const limit = parseInt(query.limit as string) || 10
  
  try {
    // Sample tattoo gallery data
    const allGallery = [
      {
        id: 1,
        title: "Botanical Rose Tattoo",
        description: "A delicate botanical rose design with fine line work",
        images: {
          data: [{
            attributes: {
              url: "/placeholder-tattoo-1.jpg"
            }
          }]
        },
        styles: {
          data: [
            { id: 1, attributes: { name: "Fine Line" } },
            { id: 2, attributes: { name: "Botanical" } }
          ]
        },
        slug: "botanical-rose-tattoo",
        featured: true
      },
      {
        id: 2,
        title: "Watercolor Butterfly",
        description: "Vibrant watercolor butterfly with splash effects",
        images: {
          data: [{
            attributes: {
              url: "/placeholder-tattoo-2.jpg"
            }
          }]
        },
        styles: {
          data: [
            { id: 3, attributes: { name: "Watercolor" } },
            { id: 4, attributes: { name: "Color" } }
          ]
        },
        slug: "watercolor-butterfly",
        featured: true
      },
      {
        id: 3,
        title: "Minimalist Mountain",
        description: "Simple line art mountain landscape",
        images: {
          data: [{
            attributes: {
              url: "/placeholder-tattoo-3.jpg"
            }
          }]
        },
        styles: {
          data: [
            { id: 1, attributes: { name: "Fine Line" } },
            { id: 5, attributes: { name: "Minimalist" } }
          ]
        },
        slug: "minimalist-mountain",
        featured: false
      }
    ];

    let gallery = featured ? allGallery.filter(item => item.featured) : allGallery;
    
    if (limit) {
      gallery = gallery.slice(0, limit);
    }

    return {
      data: gallery,
      total: gallery.length
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching gallery items'
    })
  }
})