<template>
  <div>
    <div class="min-h-screen bg-white dark:bg-gray-950">
    <!-- Breadcrumb bar (not sticky: the site header and the mobile TOC already stick) -->
    <div class="border-b border-gray-100 dark:border-gray-800">
      <div class="container max-w-6xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between gap-4">
          <UBreadcrumb :items="breadcrumbs" class="hidden sm:flex min-w-0" />
          <UButton
            to="/blog/"
            variant="ghost"
            color="neutral"
            size="sm"
            icon="i-lucide-arrow-left"
            class="text-muted hover:text-default shrink-0 ml-auto"
          >
            Back to Blog
          </UButton>
        </div>
      </div>
    </div>

    <!-- Article Container -->
    <article class="container mx-auto px-6 py-12" :class="tocLinks.length ? 'max-w-6xl' : 'max-w-4xl'">
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
        <UButton to="/blog/" color="primary">Return to Blog</UButton>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!post" class="text-center py-20">
        <UIcon name="i-lucide-file-text" class="h-16 w-16 mx-auto text-muted mb-6" />
        <h2 class="text-2xl font-bold mb-4 text-default">Post not found</h2>
        <p class="text-muted mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <UButton to="/blog/" color="primary">Return to Blog</UButton>
      </div>

      <!--
        Article content. With a TOC, lg screens get two columns: header and body
        on the left, the sticky TOC on the right spanning both rows. Below lg the
        TOC sits between the header and the body as a sticky collapsible.
      -->
      <div v-else :class="tocLinks.length ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-x-12' : ''">
        <!-- Article Header -->
        <header class="mb-8 pb-8 border-b border-gray-100 dark:border-gray-800 min-w-0 lg:col-start-1 lg:row-start-1">
          <h1 class="text-4xl md:text-5xl font-bold leading-tight text-default mb-6 text-balance">
            {{ post.title }}
          </h1>

          <div v-if="post.description" class="text-xl text-muted mb-8 leading-relaxed">
            {{ post.description }}
          </div>

          <!-- Byline -->
          <div class="flex items-center gap-4">
            <UAvatar
              src="/images/personal/allison-avatar.jpg"
              alt="Allison Coleman"
              size="md"
            />
            <div class="flex-1 min-w-0 text-sm">
              <p class="text-default">
                <NuxtLink to="/about/" class="font-medium hover:text-primary transition-colors">{{ AUTHOR_NAME }}</NuxtLink>
                <span class="text-muted"> · {{ AUTHOR_ROLE }}</span>
              </p>
              <p class="text-muted mt-1">
                <time :datetime="post.date">{{ formatContentDate(post.date, { dateStyle: 'long' }) }}</time>
                <span aria-hidden="true"> · </span>
                <span>{{ estimateReadTime(post as any).minutes }} min read</span>
              </p>
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

        <!-- Table of contents, built from the post's own headings -->
        <div v-if="tocLinks.length" class="mb-8 lg:mb-0 lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <LazyUContentToc :links="tocLinks" title="On this page" highlight :hydrate-on-interaction="['pointerenter', 'focusin', 'touchstart']" />
        </div>

        <div class="min-w-0 lg:col-start-1 lg:row-start-2">
          <!-- Featured Image -->
          <div v-if="post.featured_image" class="mb-12">
            <NuxtImg
              :src="post.featured_image"
              :alt="post.title"
              class="w-full rounded-lg"
              loading="eager"
              fetchpriority="high"
              sizes="lg:100vw xl:850px"
            />
          </div>

          <!-- Article Body -->
          <!-- ~72ch keeps lines readable; the TOC column and wide images stay outside it -->
          <div class="max-w-[72ch]">
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

            <!-- Author box -->
            <div class="flex flex-col sm:flex-row items-start gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <UAvatar
                src="/images/personal/allison-avatar.jpg"
                alt="Allison Coleman"
                size="lg"
              />
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-default">{{ AUTHOR_NAME }}</h3>
                <p class="text-sm text-muted mb-3">{{ AUTHOR_ROLE }}</p>
                <p class="text-muted text-sm leading-relaxed mb-4">
                  I write about agents, tools, languages, and whatever I broke this week.
                </p>
                <div class="flex flex-wrap items-center gap-2">
                  <UButton variant="soft" color="primary" size="sm" to="/about/" icon="i-lucide-user">
                    About me
                  </UButton>
                  <UButton
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    :to="AUTHOR_X_URL"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon="i-simple-icons-x"
                  >
                    @AllieCatOwO
                  </UButton>
                </div>
              </div>
            </div>
          </footer>
        </div>
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
            :to="`/blog/${related.slug}/`"
            class="group block p-6 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 class="font-semibold text-default group-hover:text-primary mb-2 line-clamp-2">
              {{ related.title }}
            </h3>
            <p v-if="related.description" class="text-muted text-sm mb-3 line-clamp-2">
              {{ related.description }}
            </p>
            <time :datetime="related.date" class="text-xs text-muted">{{ formatContentDate(related.date, { dateStyle: 'long' }) }}</time>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>

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
  </div>
</template>

<script setup lang="ts">
import { useContent } from '../../composables/useContent';

const AUTHOR_NAME = 'Allison Coleman';
const AUTHOR_ROLE = 'Software engineer: agent systems, developer tools, languages & runtimes';
const AUTHOR_X_URL = 'https://x.com/AllieCatOwO';

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

if (!post.value && !error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true });
}

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
  { label: 'Blog', to: '/blog/' },
  { label: post.value?.title || 'Loading...' }
]);

// Table of contents from the post's own headings (Content v3 builds it at parse time).
const tocLinks = computed(() => post.value?.body?.toc?.links ?? []);

const { estimateReadTime } = useReadTime();

// Reading progress
const readingProgress = ref(0);

const updateProgress = () => {
  const scrolled = window.scrollY;
  const maxHeight = document.body.scrollHeight - window.innerHeight;
  readingProgress.value = maxHeight > 0 ? Math.min((scrolled / maxHeight) * 100, 100) : 0;
};

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress);
});

const getTagColor = (tag: string): 'primary'|'secondary'|'success'|'info'|'warning'|'error'|'neutral' => {
  const colors = ['primary','secondary','success','info','warning','error'] as const;
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  }
  return colors[hash % colors.length] || 'neutral';
};

useSiteSeo(() => {
  const p = post.value
  if (!p) return { title: 'Blog', description: 'Notes from Allison Coleman.' }
  const image = p.ogImage || p.featured_image || DEFAULT_OG_IMAGE
  const url = absoluteSiteUrl(`/blog/${p.slug || slug}/`)
  const published = toIsoDate(p.date_published || p.date)
  // Content v3 fills seo.title from title; a different value is a shorter, hand-written override
  const title = p.seo?.title || p.title
  return {
    title,
    description: p.seo?.description || p.description,
    image,
    imageAlt: p.title,
    type: 'article',
    publishedTime: published,
    breadcrumbs: [{ name: 'Blog', path: '/blog/' }, { name: p.title }],
    jsonLd: {
      '@type': 'BlogPosting',
      'headline': p.title,
      'description': p.description,
      ...(published && { datePublished: published }),
      'author': personRef(),
      'publisher': personRef(),
      'image': absoluteSiteUrl(image),
      url,
      'mainEntityOfPage': { '@type': 'WebPage', '@id': url },
      ...(p.tags?.length && { keywords: p.tags.join(', ') })
    }
  }
})
</script> 
