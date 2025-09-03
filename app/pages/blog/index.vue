<template>
  <main class="min-h-screen bg-gradient-animated bg-dots relative overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"/>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"/>
    </div>

    <div class="relative z-10 container max-w-7xl mx-auto px-6 py-20">
      <header class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 text-default">Blog</h1>
        <p class="text-xl md:text-2xl text-muted max-w-3xl mx-auto mb-8">
          Development insights, tutorials, and thoughts on building the web
        </p>
      </header>

      <!-- Controls and Filters -->
      <div class="mb-8">
        <!-- Single Controls Row -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- Sort Menu -->
          <USelectMenu
            v-model="sort"
            :items="sortOptions"
            value-key="value"
            label-key="label"
            size="sm"
            class="min-w-[140px]"
            :search-input="false"
          >
            <template #leading>
              <UIcon :name="getSortIcon(sort)" class="w-4 h-4" />
            </template>
          </USelectMenu>

          <!-- Tags (Center) -->
          <div v-if="allTags.length" class="flex-1 overflow-x-auto scrollbar-hide px-2" @wheel.prevent="handleHorizontalScroll">
            <div class="flex items-center gap-3 justify-center pb-1" style="width: max-content; min-width: 100%;">
              <UBadge
                :label="`All (${total})`"
                :variant="activeTag === 'all' ? 'solid' : 'outline'"
                color="primary"
                size="lg"
                class="cursor-pointer hover:shadow-sm transition-shadow whitespace-nowrap"
                @click="activeTag = 'all'"
              />
              
              <UBadge
                v-for="tag in allTags"
                :key="tag"
                :label="`${tag} (${getTagCount(tag)})`"
                :variant="activeTag === tag ? 'solid' : 'outline'"
                :color="getTagColor(tag)"
                size="lg"
                class="cursor-pointer hover:shadow-sm transition-shadow whitespace-nowrap"
                @click="activeTag = tag"
              />
            </div>
          </div>

          <!-- Right Controls -->
          <div class="flex items-center justify-between lg:justify-end gap-3">
            <!-- View Toggle -->
            <div class="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-1">
              <button
                :class="[
                  'p-1.5 rounded transition-all',
                  blogView === 'grid' 
                    ? 'bg-primary text-white' 
                    : 'text-muted hover:text-default'
                ]"
                title="Grid view"
                @click="blogView = 'grid'"
              >
                <UIcon name="i-lucide-grid-3x3" class="w-3.5 h-3.5" />
              </button>
              <button
                :class="[
                  'p-1.5 rounded transition-all',
                  blogView === 'rows' 
                    ? 'bg-primary text-white' 
                    : 'text-muted hover:text-default'
                ]"
                title="List view"
                @click="blogView = 'rows'"
              >
                <UIcon name="i-lucide-list" class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Clear Filters -->
            <UButton
              v-if="activeTag !== 'all' || sort !== 'newest'"
              variant="ghost"
              color="neutral"
              size="sm"
              icon="i-lucide-x"
              @click="clearFilters"
            >
              Clear
            </UButton>
          </div>
        </div>
      </div>
    
      <!-- Loading state -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="status" aria-label="Loading blog posts">
        <div v-for="n in 6" :key="n" class="glass-accent rounded-xl overflow-hidden animate-pulse">
          <div class="aspect-video bg-gray-300 dark:bg-gray-600"/>
          <div class="p-6">
            <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3"/>
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"/>
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"/>
          </div>
        </div>
      </div>
    
      <!-- Error state -->
      <section v-else-if="error" class="text-center py-16" role="alert" aria-labelledby="error-title">
        <div class="glass-accent rounded-xl p-12 max-w-lg mx-auto border border-red-500/20">
          <UIcon name="i-lucide-alert-circle" class="h-16 w-16 mx-auto text-red-500 mb-6" />
          <h2 id="error-title" class="text-2xl font-bold mb-4 text-default">Something went wrong</h2>
          <p class="text-muted mb-6">{{ error.message || 'Failed to load blog posts' }}</p>
          <UButton color="primary" @click="refreshPage">
            Try Again
          </UButton>
        </div>
      </section>
    
    <!-- Blog posts -->
    <section v-else-if="posts && posts.length > 0" aria-labelledby="posts-heading">
      <h2 id="posts-heading" class="sr-only">Blog posts</h2>
      <div v-if="blogView === 'rows'" class="grid grid-cols-1 gap-8">
        <BlogCard
          v-for="post in posts"
          :key="post.slug || post.path || ''"
          :title="post.title || ''"
          :description="post.description || ''"
          :date="post.date || ''"
          :image="post.featured_image || 'https://placehold.co/640x360?text=Blog'"
          :read-time="formatReadTime(estimateReadTime(post as any).minutes)"
          :to="`/blog/${post.slug || post.path?.split('/').pop()}`"
          :tags="post.tags || []"
        />
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <BlogCard
          v-for="post in posts"
          :key="post.slug || post.path || ''"
          :title="post.title || ''"
          :description="post.description || ''"
          :date="post.date || ''"
          :image="post.featured_image || 'https://placehold.co/640x360?text=Blog'"
          :read-time="formatReadTime(estimateReadTime(post as any).minutes)"
          :to="`/blog/${post.slug || post.path?.split('/').pop()}`"
          :tags="post.tags || []"
        />
      </div>
    </section>
    
      <!-- Pagination -->
      <section v-if="total > pageSize" class="mt-16 flex justify-center" aria-label="Blog post pagination">
        <nav class="flex items-center" role="navigation" aria-label="Pagination">
          <!-- Previous (Fixed width container to prevent jumping) -->
          <div class="w-10 flex justify-center">
            <NuxtLink
              v-if="page > 1"
              :to="paginationLink(page - 1)"
              class="p-2 text-muted hover:text-primary transition-colors rounded-lg hover:bg-white/5"
              title="Previous page"
              aria-label="Go to previous page"
            >
              <UIcon name="i-lucide-chevron-left" class="w-4 h-4" />
            </NuxtLink>
          </div>
          
          <!-- Page Numbers -->
          <div class="flex items-center gap-1 mx-4">
            <template v-for="pageNum in paginationPages" :key="pageNum">
              <span 
                v-if="pageNum === '...'" 
                class="text-muted select-none px-2"
                aria-hidden="true"
              >
                ...
              </span>
              <NuxtLink
                v-else
                :to="paginationLink(Number(pageNum))"
                :class="[
                  'relative text-sm font-medium transition-all py-2 px-2 min-w-[32px] flex items-center justify-center',
                  page === Number(pageNum)
                    ? 'text-primary'
                    : 'text-muted hover:text-default'
                ]"
                :aria-label="`Go to page ${pageNum}`"
                :aria-current="page === Number(pageNum) ? 'page' : undefined"
              >
                {{ pageNum }}
                <span 
                  v-if="page === Number(pageNum)"
                  class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                />
              </NuxtLink>
            </template>
          </div>
          
          <!-- Next (Fixed width container to prevent jumping) -->
          <div class="w-10 flex justify-center">
            <NuxtLink
              v-if="page < totalPages"
              :to="paginationLink(page + 1)"
              class="p-2 text-muted hover:text-primary transition-colors rounded-lg hover:bg-white/5"
              title="Next page"
              aria-label="Go to next page"
            >
              <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </nav>
      </section>
    
      <!-- Empty state -->
      <section v-else-if="total === 0" class="text-center py-16" role="status" aria-labelledby="no-posts-heading">
        <div class="glass-accent rounded-xl p-12 max-w-lg mx-auto">
          <UIcon name="i-lucide-file-text" class="h-16 w-16 mx-auto text-primary/50 mb-6" aria-hidden="true" />
          <h2 id="no-posts-heading" class="text-2xl font-bold mb-4 text-default">No blog posts found</h2>
          <p class="text-muted">Check back later for new content, or try adjusting your filters.</p>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import BlogCard from '../../components/common/BlogCard.vue'

interface BlogDoc {
  title?: string;
  description?: string;
  date?: string;
  slug?: string;
  path?: string;
  featured_image?: string;
  tags?: string[];
}

// Content fetched via queryCollection with limit/skip

// View + pagination state
const blogView = useState<'grid' | 'rows'>('blogView', () => 'grid')
const route = useRoute()
const page = ref(Number(route.query.page as string) || 1)
watch(() => route.query.page, (val) => {
  page.value = Number(val as string) || 1
})
const pageSize = 9; // 3 columns x 3 rows


// Fetch all (for tags), plus page-sized items
const { data: allPostsAll } = await useAsyncData<BlogDoc[]>(
  'blog-all-dev',
  async () => {
    try {
      return await queryCollection('blog').where('category', '=', 'dev').where('published', '=', true).order('date', 'DESC').all()
    } catch {
      return []
    }
  }
)

// Tag filter
const allTags = computed((): string[] => {
  const tags = new Set<string>()
  ;(allPostsAll.value || []).forEach((p) => (p.tags || []).forEach((t: string) => tags.add(t)))
  return Array.from(tags).sort()
})

// Tag counts for display
const tagCounts = computed((): Record<string, number> => {
  const counts: Record<string, number> = {}
  ;(allPostsAll.value || []).forEach((p) => {
    (p.tags || []).forEach((t: string) => {
      counts[t] = (counts[t] || 0) + 1
    })
  })
  return counts
})

const getTagCount = (tag: string): number => {
  if (tag === 'all') return total.value
  return tagCounts.value[tag] || 0
}

const activeTag = ref((route.query.tag as string) || 'all')
const sort = ref<'newest'|'oldest'|'popular'|'alphabetical'|'reverse-alphabetical'>('newest')
watch(activeTag, (val) => {
  if (!import.meta.client) return
  const q = { ...route.query }
  if (val === 'all') delete q.tag
  else q.tag = val
  navigateTo({ query: q }, { replace: true })
})
watch(() => route.query.tag, (v) => { activeTag.value = (v as string) || 'all' })

// Page-sized fetching
const { data: totalCount } = await useAsyncData<number>(
  () => `blog-total-${activeTag.value}`,
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

const { data: pageItems, pending, error } = await useAsyncData<BlogDoc[]>(
  () => `blog-page-${activeTag.value}-${page.value}-${sort.value}`,
  async () => {
    try {
      let base = queryCollection('blog')
        .where('category', '=', 'dev')
        .where('published', '=', true)
      
      // Apply sorting
      if (sort.value === 'newest') {
        base = base.order('date', 'DESC')
      } else if (sort.value === 'oldest') {
        base = base.order('date', 'ASC')
      } else if (sort.value === 'alphabetical') {
        base = base.order('title', 'ASC')
      } else if (sort.value === 'reverse-alphabetical') {
        base = base.order('title', 'DESC')
      } else {
        // For 'popular' or default, use date desc for now
        base = base.order('date', 'DESC')
      }
      
      if (activeTag.value === 'all') {
        return base.limit(pageSize).skip((page.value - 1) * pageSize).all()
      }
      const all = await base.all()
      let filtered = all.filter((p: BlogDoc) => Array.isArray(p.tags) && p.tags!.includes(activeTag.value))
      
      // Apply client-side sorting for filtered results if needed
      if (sort.value === 'popular') {
        // Sort by number of tags as a popularity proxy
        filtered = filtered.sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0))
      }
      
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
const totalPages = computed(() => Math.ceil(total.value / pageSize))

// Smart pagination - show current page plus context
const paginationPages = computed(() => {
  const pages: (number | string)[] = []
  const current = page.value
  const total = totalPages.value
  
  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show first page
    pages.push(1)
    
    if (current > 4) {
      pages.push('...')
    }
    
    // Show pages around current
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (current < total - 3) {
      pages.push('...')
    }
    
    // Show last page
    if (total > 1) {
      pages.push(total)
    }
  }
  
  return pages
})

// Map to @nuxt/ui UBlogPosts props shape
const { estimateReadTime, formatReadTime } = useReadTime();

const paginationLink = (p: number) => ({ query: { ...route.query, page: p } })

const refreshPage = () => {
  if (import.meta.client) {
    window.location.reload()
  }
}


// Sort options
const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'A-Z', value: 'alphabetical' },
  { label: 'Z-A', value: 'reverse-alphabetical' }
]

function getSortIcon(sortValue: string): string {
  const iconMap: Record<string, string> = {
    newest: 'i-lucide-arrow-down',
    oldest: 'i-lucide-arrow-up', 
    popular: 'i-lucide-trending-up',
    alphabetical: 'i-lucide-arrow-up-a-z',
    'reverse-alphabetical': 'i-lucide-arrow-down-z-a'
  }
  return iconMap[sortValue] || 'i-lucide-arrow-down'
}

function clearFilters() {
  activeTag.value = 'all'
  sort.value = 'newest'
}

function handleHorizontalScroll(event: WheelEvent) {
  const container = event.currentTarget as HTMLElement
  container.scrollLeft += event.deltaY
}

function getTagColor(tag: string): 'primary'|'secondary'|'success'|'info'|'warning'|'error'|'neutral' {
  const colors = ['primary','secondary','success','info','warning','error'] as const
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0
  }
  return colors[hash % colors.length] || 'neutral'
}



// Meta tags
useHead({
  title: `Blog - Allison's Portfolio`,
  meta: [
    { name: 'description', content: 'Articles about development, coding, and tech insights from Allison' },
    { property: 'og:title', content: `Blog - Allison's Portfolio` },
    { property: 'og:type', content: 'website' }
  ]
});
</script>
