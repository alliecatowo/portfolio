<template>
  <article v-if="post" class="blog-post">
    <div class="blog-header">
      <h1 class="text-3xl font-bold mb-3">{{ post.title }}</h1>
      <div class="text-gray-600 mb-4">
        {{ formatDate(post.date_published || post.date) }}
      </div>
      <div v-if="post.featured_image" class="featured-image mb-6">
        <img 
          :src="getImageUrl(post.featured_image, { width: 800, height: 400, fit: 'cover' })" 
          :alt="post.title"
          class="w-full rounded-lg shadow-md"
        />
      </div>
    </div>
    
    <div class="blog-content prose lg:prose-lg mx-auto" v-html="post.content"></div>
    
    <div v-if="post.tags && post.tags.length" class="mt-8 pt-4 border-t border-gray-200">
      <div class="flex flex-wrap gap-2">
        <span v-for="tag in post.tags" :key="tag" 
          class="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
          {{ tag }}
        </span>
      </div>
    </div>
  </article>
  <div v-else class="loading">
    <p>Loading post...</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  postId: string
}>()

// Determine category based on current route
const route = useRoute()
const category = computed(() => {
  return route.path.includes('/tattoo/') ? 'tattoo' : 'dev'
})

// Fetch the blog post directly with queryCollection
const { data: post } = await useAsyncData(
  () => `blog-post-${category.value || 'dev'}-${props.postId || 'unknown'}`,
  async () => {
    // Prefer slug match; fall back to path suffix
    const bySlug = await queryCollection('blog')
      .where('category', '=', category.value || 'dev')
      .where('slug', '=', props.postId || 'unknown')
      .first()
    if (bySlug) return bySlug
    return await queryCollection('blog')
      .where('category', '=', category.value || 'dev')
      .where('path', '=', `/blog/${category.value || 'dev'}/${props.postId || 'unknown'}`)
      .first()
  }
)

function getImageUrl(image: any, options?: any) {
  // For now, return the image URL directly
  // Later this can be enhanced with image optimization
  return image?.url || image
}

function formatDate(dateString?: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date)
}
</script>

<style scoped>
.blog-post {
  @apply max-w-3xl mx-auto py-8 px-4;
}
</style> 
