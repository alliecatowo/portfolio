<template>
  <div class="min-h-screen bg-gradient-animated">
    <div class="container max-w-4xl mx-auto px-6 py-12">
      <NuxtLink to="/projects/" class="inline-flex items-center text-primary hover:text-primary-600 mb-6">
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4 mr-2" />
        Back to Projects
      </NuxtLink>

      <article v-if="project" class="glass-accent rounded-xl p-8">
        <header class="mb-8">
          <AwardBadge v-if="project.award" :award="project.award" size="md" class="mb-4" />
          <h1 class="text-4xl font-bold mb-4 text-gradient-animated">{{ project.title }}</h1>
          <p class="text-xl text-default">{{ project.description }}</p>

          <div v-if="project.technologies" class="flex flex-wrap gap-2 mt-4">
            <span
              v-for="tech in project.technologies"
              :key="tech"
              class="px-3 py-1 bg-primary/10 text-primary-800 dark:text-primary text-sm rounded-full"
            >
              {{ tech }}
            </span>
          </div>
        </header>

        <div v-if="project.image" class="mb-8">
          <NuxtImg
            :src="project.image"
            :alt="project.imageAlt || `${project.title} screenshot`"
            class="w-full h-auto rounded-lg shadow-lg"
            :width="800"
            :height="400"
            loading="eager"
            fetchpriority="high"
            preset="hero"
          />
        </div>

        <div v-if="project.body" class="max-w-[75ch]">
          <ContentRenderer :value="project" />
        </div>
        <div v-else class="prose prose-lg dark:prose-invert max-w-none mb-8">
          {{ project.description }}
        </div>

        <footer class="flex flex-wrap gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <a
            v-if="project.demo"
            :href="project.demo"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-6 py-3 bg-primary text-inverted rounded-lg hover:bg-primary-600 font-semibold transition-all"
          >
            <UIcon name="i-lucide-external-link" class="w-4 h-4 mr-2" />
            Live Demo
          </a>

          <a
            v-if="project.github"
            :href="project.github"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-6 py-3 text-primary-800 dark:text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 font-semibold transition-all"
          >
            <UIcon name="i-lucide-github" class="w-4 h-4 mr-2" />
            View on GitHub
          </a>

          <a
            v-if="project.devpost"
            :href="project.devpost"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-6 py-3 text-primary-800 dark:text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 font-semibold transition-all"
          >
            <UIcon name="i-lucide-trophy" class="w-4 h-4 mr-2" />
            Devpost
          </a>
        </footer>
      </article>

      <div v-else class="text-center py-12">
        <p class="text-xl text-muted">Project not found</p>
      </div>

      <nav v-if="project && related?.length" class="mt-10" aria-labelledby="related-projects-title">
        <h2 id="related-projects-title" class="text-xl font-semibold text-highlighted mb-4">
          More {{ relatedLabel }}
        </h2>
        <ul class="grid gap-3 sm:grid-cols-3">
          <li v-for="item in related" :key="item.slug">
            <NuxtLink
              :to="`/projects/${item.slug}/`"
              class="block h-full rounded-lg border border-default/60 bg-elevated/40 p-4 transition-colors hover:border-primary/60"
            >
              <span class="block font-semibold text-highlighted">{{ item.title }}</span>
              <span class="mt-1 block text-sm text-muted line-clamp-3">{{ item.description }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import AwardBadge from '~/components/common/AwardBadge.vue'
import { projectGroupOf } from '~/utils/projectGroups'
import { sortProjectsInGroup } from '~/utils/sortProjects'

const route = useRoute();
const projectId = route.params.id as string;

// Fetch the project
const { data: project } = await useAsyncData(
  `project-${projectId}`,
  () => queryCollection('projects')
    .where('slug', '=', projectId)
    .where('status', '<>', 'draft')
    .first()
);

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true });
}

// Up to three other projects from the same /projects group
const { data: related } = await useAsyncData(
  `project-related-${projectId}`,
  async () => {
    const group = project.value?.group
    if (!group) return []
    const siblings = await queryCollection('projects')
      .where('group', '=', group)
      .where('status', '<>', 'draft')
      .select('title', 'slug', 'description', 'order', 'groupOrder', 'featured', 'date')
      .all()
    return sortProjectsInGroup(siblings.filter(p => p.slug && p.slug !== projectId)).slice(0, 3)
  }
)

const groupLabel = computed(() => projectGroupOf(project.value?.group).label)
const relatedLabel = computed(() => project.value?.group === 'earlier-work'
  ? 'earlier work'
  : `in ${groupLabel.value.charAt(0).toLowerCase()}${groupLabel.value.slice(1)}`)

const ogImageForSlug = useOgImageForSlug()
useSiteSeo(() => {
  const p = project.value
  if (!p) return { title: 'Project', description: 'Project details' }
  const slug = p.slug || projectId
  const ogImage = p.ogImage || ogImageForSlug(slug)
  // Share image: explicit ogImage, then public/images/og/<slug>.png, then the card image, then the default
  const image = ogImage || p.image
  const url = absoluteSiteUrl(`/projects/${slug}/`)
  const languages = programmingLanguages(p.technologies)
  const created = toIsoDate(p.date)?.slice(0, 10)
  // Content v3 fills seo.title/description from title/description, so a different
  // value is a hand-written override. Without one, the group label pads the title.
  const customTitle = p.seo?.title && p.seo.title !== p.title ? p.seo.title : undefined
  const description = p.seo?.description || p.description
  return {
    title: customTitle || `${p.title}: ${groupLabel.value}`,
    description,
    image,
    imageAlt: ogImage ? `${p.title}, a project by Allison Coleman` : p.imageAlt,
    breadcrumbs: [{ name: 'Projects', path: '/projects/' }, { name: p.title }],
    jsonLd: {
      '@type': 'SoftwareSourceCode',
      'name': p.title,
      description,
      url,
      ...(p.github && { codeRepository: p.github }),
      ...(languages.length && { programmingLanguage: languages }),
      ...(p.technologies?.length && { keywords: p.technologies.join(', ') }),
      ...(p.award && { award: p.award }),
      ...(created && { dateCreated: created }),
      'author': personRef(),
      'image': absoluteSiteUrl(image || DEFAULT_OG_IMAGE)
    }
  }
})
</script>
