<template>
  <UContainer as="main" class="py-12">
    <header class="mb-6 flex items-center justify-between">
      <div class="text-center md:text-left">
        <h1 class="text-4xl font-bold">Blog</h1>
        <p class="sr-only">{{ siteConfig?.type === 'dev' ? 'Development articles and tutorials' : 'Tattoo art stories and insights' }}</p>
      </div>
      <div class="flex items-center gap-3">
        <ClientOnly>
          <URadioGroup
            v-if="allTags.length"
            v-model="activeTag"
            :items="[{ label: 'All', value: 'all' }, ...allTags.map(t => ({ label: t, value: t }))]"
            orientation="horizontal"
            size="sm"
            class="hidden md:flex"
          />
        </ClientOnly>
        <ClientOnly>
          <ListViewToggle v-model="blogView" />
        </ClientOnly>
      </div>
    </header>
    
    <!-- Loading state -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Loading blog posts">
      <UCard v-for="n in 6" :key="n" :ui="{ body: 'p-0' }">
        <div class="aspect-video mb-4 rounded-lg overflow-hidden">
          <USkeleton class="h-full w-full" />
        </div>
        <div class="px-4 pb-4">
          <USkeleton class="h-6 w-2/3 mb-2" />
          <USkeleton class="h-4 w-full mb-2" />
          <USkeleton class="h-4 w-1/2" />
        </div>
      </UCard>
    </div>
    
    <!-- Error state -->
    <section v-else-if="error" class="max-w-2xl mx-auto" role="alert" aria-labelledby="error-title">
      <h2 id="error-title" class="sr-only">Error loading content</h2>
      <UAlert color="error" :title="error.message || 'Error loading blog posts'" />
    </section>
    
    <!-- Blog posts -->
    <section v-else-if="posts && posts.length > 0" aria-labelledby="posts-heading">
      <h2 id="posts-heading" class="sr-only">Blog posts</h2>
      <UBlogPosts :posts="mappedPosts" :orientation="blogView === 'rows' ? 'vertical' : 'horizontal'" />
    </section>
    
    <!-- Pagination -->
    <section v-if="total > pageSize" class="mt-12 flex justify-center" aria-label="Blog post pagination">
      <UPagination 
        v-model:page="page"
        :items-per-page="pageSize" 
        :total="total" 
        :to="paginationLink"
        show-edges
        :sibling-count="1"
        size="sm"
        variant="link"
        color="neutral"
        active-color="primary"
        active-variant="solid"
        :ui="{ list: 'justify-center gap-1', item: 'rounded-md' }"
      />
    </section>
    
    <!-- Empty state -->
    <section v-else-if="total === 0" class="text-center py-16" role="status" aria-labelledby="no-posts-heading">
      <UIcon name="i-heroicons-document-text" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" aria-hidden="true" />
      <h2 id="no-posts-heading" class="text-xl font-semibold mb-2">No blog posts found</h2>
      <p class="text-gray-500 dark:text-gray-400">Check back later for new content.</p>
    </section>
  </UContainer>
</template>

<script setup lang="ts">
import ListViewToggle from '~/components/common/ListViewToggle.vue'
import { useSiteConfig } from '~/utils/site-config';
interface BlogDoc {
  title?: string;
  description?: string;
  date?: string;
  slug?: string;
  path?: string;
  featured_image?: string;
  tags?: string[];
}

// Get site configuration
const siteConfig = useSiteConfig();

// Content fetched via queryCollection with limit/skip

// View + pagination state
const blogView = useState<'grid' | 'rows'>('blogView', () => 'grid')
const route = useRoute()
const page = ref(Number(route.query.page as string) || 1)
watch(() => route.query.page, (val) => {
  page.value = Number(val as string) || 1
})
const pageSize = 9; // 3 columns x 3 rows

// Determine which blog category to show based on site type
const blogCategory = computed(() => siteConfig.value?.type === 'tattoo' ? 'tattoo' : 'dev');

// Fetch all (for tags), plus page-sized items
const { data: allPostsAll } = await useAsyncData<BlogDoc[]>(
  () => `blog-all-${blogCategory.value}`,
  async () => {
    try {
      return await queryCollection('blog').where('category', '=', blogCategory.value).where('published', '=', true).order('date', 'DESC').all()
    } catch {
      return []
    }
  },
  { watch: [blogCategory] }
)

// Tag filter
const allTags = computed(() => {
  const tags = new Set<string>()
  (allPostsAll.value || []).forEach((p) => (p.tags || []).forEach((t: string) => tags.add(t)))
  return Array.from(tags).sort()
})
const activeTag = ref((route.query.tag as string) || 'all')
watch(activeTag, (val) => {
  if (!process.client) return
  const q = { ...route.query }
  if (val === 'all') delete q.tag
  else q.tag = val
  navigateTo({ query: q }, { replace: true })
})
watch(() => route.query.tag, (v) => { activeTag.value = (v as string) || 'all' })

// Page-sized fetching
const { data: totalCount } = await useAsyncData<number>(
  () => `blog-total-${blogCategory.value}-${activeTag.value}`,
  async () => {
    try {
      if (activeTag.value === 'all') {
        return (await queryCollection('blog').where('category', '=', blogCategory.value).where('published', '=', true).all()).length
      }
      const all = await queryCollection('blog').where('category', '=', blogCategory.value).where('published', '=', true).all()
      return all.filter((p: BlogDoc) => Array.isArray(p.tags) && p.tags!.includes(activeTag.value)).length
    } catch {
      return 0
    }
  },
  { watch: [blogCategory, activeTag] }
)

const { data: pageItems, pending, error } = await useAsyncData<BlogDoc[]>(
  () => `blog-page-${blogCategory.value}-${activeTag.value}-${page.value}`,
  async () => {
    try {
      const base = queryCollection('blog').where('category', '=', blogCategory.value).where('published', '=', true).order('date', 'DESC')
      if (activeTag.value === 'all') {
        return base.limit(pageSize).skip((page.value - 1) * pageSize).all()
      }
      const all = await base.all()
      const filtered = all.filter((p: BlogDoc) => Array.isArray(p.tags) && p.tags!.includes(activeTag.value))
      const start = (page.value - 1) * pageSize
      return filtered.slice(start, start + pageSize)
    } catch {
      return []
    }
  },
  { watch: [blogCategory, page, activeTag] }
)

const total = computed(() => totalCount.value || 0)
const posts = computed(() => pageItems.value || [])

// Map to @nuxt/ui UBlogPosts props shape
const { estimateReadTime, formatReadTime } = useReadTime();
const mappedPosts = computed(() => {
  return posts.value.map((post: BlogDoc) => ({
    title: post.title,
    description: post.description,
    date: post.date,
    image: post.featured_image || 'https://placehold.co/640x360?text=Blog',
    badge: formatReadTime(estimateReadTime(post).minutes),
    to: `/blog/${post.slug || post.path?.split('/').pop()}`
  }))
})

const paginationLink = (p: number) => ({ query: { ...route.query, page: p } })

// No local date/read time helpers needed; UBlogPosts renders core fields

// Meta tags
useHead({
  title: `Blog - ${siteConfig.value?.title || 'Allison\'s Portfolio'}`,
  meta: [
    { name: 'description', content: siteConfig.value?.type === 'dev' 
      ? 'Articles about development, coding, and tech insights from Allison'
      : 'Stories and insights about tattoo art, designs, and client experiences'
    },
    { property: 'og:title', content: `Blog - ${siteConfig.value?.title || 'Allison\'s Portfolio'}` },
    { property: 'og:type', content: 'website' }
  ]
});
</script>
