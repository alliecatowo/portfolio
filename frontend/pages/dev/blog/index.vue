<template>
  <div>
    <section class="py-12 md:py-20">
      <UContainer>
        <div class="max-w-5xl mx-auto mb-3 flex items-center justify-between">
          <div class="text-center md:text-left">
            <h1 class="text-4xl md:text-5xl font-bold mb-1 text-primary">Developer Blog</h1>
            <p class="text-lg text-muted">Thoughts, tutorials, and insights about web development.</p>
          </div>
          <div class="flex items-center gap-3">
            <ClientOnly>
              <ListViewToggle v-model="blogView" />
            </ClientOnly>
          </div>
        </div>

        <!-- Tag filter under the heading -->
        <div class="max-w-5xl mx-auto mb-6">
          <ClientOnly>
            <TagFilterBar
              v-if="allTags.length"
              :tags="allTags"
              v-model="activeTag"
              v-model:sort="sort"
            />
          </ClientOnly>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard v-for="n in 6" :key="n" class="glass card-hover">
            <div class="aspect-video mb-4 rounded-lg overflow-hidden">
              <USkeleton class="h-full w-full skeleton-shimmer" />
            </div>
            <USkeleton class="h-6 w-2/3 mb-2 skeleton-shimmer" />
            <USkeleton class="h-4 w-full mb-2 skeleton-shimmer" />
            <USkeleton class="h-4 w-1/2 mb-3 skeleton-shimmer" />
            <div class="flex gap-2">
              <USkeleton class="h-5 w-12 skeleton-shimmer" />
              <USkeleton class="h-5 w-16 skeleton-shimmer" />
              <USkeleton class="h-5 w-14 skeleton-shimmer" />
            </div>
          </UCard>
        </div>

        <!-- Error state -->
        <UAlert v-else-if="error" color="error" variant="subtle" title="Failed to load posts" class="max-w-xl mx-auto" />

        <!-- Blog posts -->
        <div v-else>
          <div v-if="blogView === 'rows'" class="grid grid-cols-1 gap-6">
            <BlogCard
              v-for="post in posts"
              :key="post.slug || post.path || ''"
              :title="post.title || ''"
              :description="post.description || ''"
              :date="post.date || ''"
              :image="post.featured_image || 'https://placehold.co/640x360?text=Blog'"
              :read-time="formatReadTime(estimateReadTime(post as any).minutes)"
              :to="`/dev/blog/${post.slug}`"
              :tags="post.tags || []"
            />
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BlogCard
              v-for="post in posts"
              :key="post.slug || post.path || ''"
              :title="post.title || ''"
              :description="post.description || ''"
              :date="post.date || ''"
              :image="post.featured_image || 'https://placehold.co/640x360?text=Blog'"
              :read-time="formatReadTime(estimateReadTime(post as any).minutes)"
              :to="`/dev/blog/${post.slug}`"
              :tags="post.tags || []"
            />
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="!loading && !error && total > pageSize" class="mt-12 flex justify-center">
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
        </div>

        <!-- Empty state -->
        <div v-if="!loading && !error && total === 0" class="text-center py-16">
          <UIcon name="i-heroicons-document-text" class="w-14 h-14 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <h3 class="text-xl font-semibold mb-2">No posts found</h3>
          <p class="text-gray-500 dark:text-gray-400">Check back later for new content.</p>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import ListViewToggle from '~/components/common/ListViewToggle.vue'
import TagFilterBar from '~/components/common/TagFilterBar.vue'
import BlogCard from '~/components/common/BlogCard.vue'
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
// No need for tag color helpers on list; using UBlogPosts

// Ensure site config is set to dev
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'dev') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'dev'
  };
}

// View + pagination state
const blogView = useState<'grid' | 'rows'>('blogView', () => 'grid')
const route = useRoute()
const page = ref(Number(route.query.page as string) || 1)
watch(() => route.query.page, (val) => {
  page.value = Number(val as string) || 1
})
const pageSize = 9; // 3 columns x 3 rows

// Tag filter (from all posts, lightweight if content small)
const { data: allPostsAll } = await useAsyncData<BlogDoc[]>(
  'dev-blog-all-meta',
  async () => {
    try {
      return await queryCollection('blog')
        .where('category', '=', 'dev')
        .where('published', '=', true)
        .order('date', 'DESC')
        .all()
    } catch {
      return []
    }
  }
)

const allTags = computed((): string[] => {
  const tags = new Set<string>()
  ;(allPostsAll.value || []).forEach((p) => (p.tags || []).forEach((t: string) => tags.add(t)))
  return Array.from(tags).sort()
})
const activeTag = ref((route.query.tag as string) || 'all')
const sort = ref<'newest'|'oldest'>('newest')
watch(activeTag, (val) => {
  if (!process.client) return
  const q = { ...route.query }
  if (val === 'all') delete q.tag
  else q.tag = val
  navigateTo({ query: q }, { replace: true })
})
watch(() => route.query.tag, (v) => { activeTag.value = (v as string) || 'all' })

// Page-sized fetching (server-side via useAsyncData)
const { data: totalCount } = await useAsyncData<number>(
  () => `dev-blog-total-${activeTag.value}`,
  async () => {
    try {
      if (activeTag.value === 'all') {
        return (await queryCollection('blog').where('category', '=', 'dev').where('published', '=', true).all()).length
      }
      const all = await queryCollection('blog').where('category', '=', 'dev').where('published', '=', true).all()
      return all.filter((p: BlogDoc) => Array.isArray(p.tags) && p.tags!.includes(activeTag.value)).length
    } catch {
      return 0
    }
  },
  { watch: [activeTag] }
)

const { data: pageItems, pending: loading, error } = await useAsyncData<BlogDoc[]>(
  () => `dev-blog-page-${activeTag.value}-${page.value}-${sort.value}`,
  async () => {
    try {
      const base = queryCollection('blog')
        .where('category', '=', 'dev')
        .where('published', '=', true)
        .order('date', sort.value === 'newest' ? 'DESC' : 'ASC')
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
  { watch: [page, activeTag, sort] }
)

const total = computed(() => totalCount.value || 0)
const posts = computed(() => pageItems.value || [])

const { estimateReadTime, formatReadTime } = useReadTime();

const paginationLink = (p: number) => ({ query: { ...route.query, page: p } })

// Types inlined above; remove unused interface

// Read time displayed via badge on each item


// Meta tags
useHead({
  title: `Blog - ${siteConfig.value?.title || 'Developer Portfolio'}`,
  meta: [
    { name: 'description', content: 'Read articles about web development, programming tips, and technology insights from my developer blog.' }
  ]
});

</script>
