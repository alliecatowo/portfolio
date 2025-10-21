<template>
  <div>
    <main class="min-h-screen bg-white dark:bg-gray-950">
    <!-- Minimal Header -->
    <header class="border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50">
      <div class="container max-w-4xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <UBreadcrumb :links="breadcrumbs" />
          <UButton
            to="/blog"
            variant="ghost"
            color="neutral"
            size="sm"
            icon="i-lucide-arrow-left"
            class="text-muted hover:text-default"
          >
            Back to Blog
          </UButton>
        </div>
      </div>
    </header>

    <!-- Article Container -->
    <article class="container max-w-4xl mx-auto px-6 py-12">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-8">
        <div class="animate-pulse">
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"/>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"/>
          <div class="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"/>
          <div class="space-y-4">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"/>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"/>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"/>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <UIcon name="i-lucide-alert-circle" class="h-16 w-16 mx-auto text-red-500 mb-6" />
        <h2 class="text-2xl font-bold mb-4 text-default">Something went wrong</h2>
        <p class="text-muted mb-6">{{ error.message || 'Failed to load blog post' }}</p>
        <UButton to="/blog" color="primary">Return to Blog</UButton>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!post" class="text-center py-20">
        <UIcon name="i-lucide-file-text" class="h-16 w-16 mx-auto text-muted mb-6" />
        <h2 class="text-2xl font-bold mb-4 text-default">Post not found</h2>
        <p class="text-muted mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <UButton to="/blog" color="primary">Return to Blog</UButton>
      </div>

      <!-- Article Content -->
      <div v-else>
        <!-- Article Header -->
        <header class="mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
          <h1 class="text-4xl md:text-5xl font-bold leading-tight text-default mb-6">
            {{ post.title }}
          </h1>
          
          <div v-if="post.description" class="text-xl text-muted mb-8 leading-relaxed">
            {{ post.description }}
          </div>

          <!-- Author & Meta -->
          <div class="flex items-center gap-4">
            <UAvatar
              src="/images/personal/allison-avatar.jpg"
              alt="Allison"
              size="md"
            >
              A
            </UAvatar>
            <div class="flex-1">
              <div class="flex items-center gap-4 text-sm">
                <span class="font-medium text-default">Allison</span>
                <span class="text-muted">•</span>
                <time :datetime="post.date" class="text-muted">{{ formatDate(post.date) }}</time>
                <span class="text-muted">•</span>
                <span class="text-muted">{{ estimateReadTime(post as any).minutes }} min read</span>
              </div>
              <div class="text-sm text-muted mt-1">Full-Stack Developer</div>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="post.tags?.length" class="flex flex-wrap gap-2 mt-6">
            <UBadge
              v-for="tag in post.tags"
              :key="tag"
              variant="soft"
              :color="getTagColor(tag)"
              size="sm"
            >
              {{ tag }}
            </UBadge>
          </div>
        </header>

        <!-- Featured Image -->
        <div v-if="post.featured_image" class="mb-12">
          <NuxtImg 
            :src="post.featured_image" 
            :alt="post.title"
            class="w-full rounded-lg"
            loading="eager"
            sizes="sm:100vw md:100vw lg:800px"
          />
        </div>

        <!-- Article Body -->
        <div class="max-w-none">
          <ContentRenderer v-if="post.body" :value="post" />
          <div v-else class="text-muted py-8">
            No content available for this post.
          </div>
        </div>

        <!-- Article Footer -->
        <footer class="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
          <!-- Tags (repeated for easy access) -->
          <div v-if="post.tags?.length" class="mb-8">
            <h3 class="text-sm font-semibold text-default mb-3">Filed under:</h3>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="tag in post.tags"
                :key="tag"
                variant="soft"
                :color="getTagColor(tag)"
                size="sm"
              >
                {{ tag }}
              </UBadge>
            </div>
          </div>

          <!-- Author Bio -->
          <div class="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            <UAvatar
              src="/images/personal/allison-avatar.jpg"
              alt="Allison"
              size="lg"
            >
              A
            </UAvatar>
            <div class="flex-1">
              <h3 class="font-semibold text-default mb-2">Written by Allison</h3>
              <p class="text-muted text-sm leading-relaxed mb-4">
                Full-stack developer passionate about building exceptional web experiences. 
                I write about modern web development, JavaScript, and the tools that make our work better.
              </p>
              <div class="flex items-center gap-4">
                <UButton variant="soft" color="primary" size="sm" to="/about">
                  About Me
                </UButton>
                <UButton variant="ghost" color="neutral" size="sm" to="/contact">
                  Get in Touch
                </UButton>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </article>

    <!-- Related Posts Section -->
    <section v-if="relatedPosts?.length" class="bg-gray-50 dark:bg-gray-900/30 py-16">
      <div class="container max-w-4xl mx-auto px-6">
        <h2 class="text-2xl font-bold text-default mb-8">Related Articles</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <NuxtLink
            v-for="related in relatedPosts.slice(0, 4)"
            :key="related.slug"
            :to="`/blog/${related.slug}`"
            class="group block p-6 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 class="font-semibold text-default group-hover:text-primary mb-2 line-clamp-2">
              {{ related.title }}
            </h3>
            <p v-if="related.description" class="text-muted text-sm mb-3 line-clamp-2">
              {{ related.description }}
            </p>
            <time class="text-xs text-muted">{{ formatDate(related.date) }}</time>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>

  <!-- Floating Progress Indicator -->
  <div 
    v-if="!loading && post" 
    class="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50"
  >
    <div 
      class="h-full bg-primary transition-all duration-300 ease-out"
      :style="{ width: `${readingProgress}%` }"
    />
  </div>

  <!-- Floating TOC Button (Mobile) -->
  <UButton
    v-if="!loading && post && tableOfContents.length"
    class="fixed bottom-6 right-6 lg:hidden"
    color="primary"
    size="lg"
    icon="i-lucide-list"
    @click="showTOC = !showTOC"
  />

  <!-- Mobile TOC Overlay -->
  <div
    v-if="showTOC && tableOfContents.length"
    class="fixed inset-0 bg-black/50 z-50 lg:hidden"
    role="button"
    tabindex="0"
    aria-label="Close table of contents"
    @click="showTOC = false"
    @keydown.escape="showTOC = false"
  >
    <div class="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-xl p-6 max-h-[50vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-default">Table of Contents</h3>
        <UButton variant="ghost" size="sm" icon="i-lucide-x" @click="showTOC = false" />
      </div>
      <nav>
        <ul class="space-y-2">
          <li v-for="item in tableOfContents" :key="item.id">
            <a 
              :href="`#${item.id}`"
              class="block py-2 text-muted hover:text-primary transition-colors"
              :class="{ 'pl-4': item.depth > 2 }"
              @click="showTOC = false"
            >
              {{ item.text }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { useContent } from '../../composables/useContent';

// Get post slug from route
const route = useRoute();
const slug = route.params.id as string;

// Use content composable
const { fetchBlogPost, fetchBlogPosts } = useContent();

// Fetch the blog post
const { data: post, pending: loading, error } = await useAsyncData(
  `blog-post-${slug}`,
  () => fetchBlogPost(slug)
);

// Fetch related posts
const { data: relatedPosts } = await useAsyncData(
  `related-posts-${slug}`,
  async () => {
    if (!post.value?.tags?.length) return [];
    const allPosts = await fetchBlogPosts();
    return allPosts
      .filter(p => p.slug !== slug && p.tags?.some(tag => post.value?.tags?.includes(tag)))
      .slice(0, 5);
  },
  { watch: [post] }
);

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: post.value?.title || 'Loading...', to: `/blog/${slug}` }
]);

// Table of contents (mock for now - would extract from content in real implementation)
interface TocItem {
  id: string;
  text: string;
  depth: number;
}

const tableOfContents = computed((): TocItem[] => {
  if (!post.value?.body) return [];
  // This would typically be extracted from the markdown content
  // For now, return empty array
  return [];
});

// Helper functions
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const { estimateReadTime } = useReadTime();

// Reading progress
const readingProgress = ref(0);
const showTOC = ref(false);

onMounted(() => {
  const updateProgress = () => {
    const scrolled = window.scrollY;
    const maxHeight = document.body.scrollHeight - window.innerHeight;
    const progress = Math.min((scrolled / maxHeight) * 100, 100);
    readingProgress.value = progress;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  onUnmounted(() => {
    window.removeEventListener('scroll', updateProgress);
  });
});

const getTagColor = (tag: string): 'primary'|'secondary'|'success'|'info'|'warning'|'error'|'neutral' => {
  const colors = ['primary','secondary','success','info','warning','error'] as const;
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  }
  return colors[hash % colors.length] || 'neutral';
};

// Meta tags
useHead(() => ({
  title: post.value 
    ? `${post.value.title} - Allison's Portfolio`
    : `Blog - Allison's Portfolio`,
  meta: [
    { 
      name: 'description', 
      content: post.value?.description || 'Detailed article with insights and information.' 
    },
    {
      property: 'og:title',
      content: post.value?.title || 'Blog Post'
    },
    {
      property: 'og:description', 
      content: post.value?.description || 'Detailed article with insights and information.'
    },
    {
      property: 'og:image',
      content: post.value?.featured_image || ''
    }
  ]
}));
</script> 
