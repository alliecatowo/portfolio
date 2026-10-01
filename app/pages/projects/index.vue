<template>
  <main class="min-h-screen bg-gradient-animated bg-dots relative overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl motion-safe:animate-pulse"/>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl motion-safe:animate-pulse" style="animation-delay: 2s;"/>
    </div>

    <UContainer class="relative z-10 pt-10 pb-16 md:pt-14">
      <header class="mb-6 flex flex-col gap-2 md:mb-8 md:flex-row md:items-end md:justify-between md:gap-8">
        <div>
          <h1 class="text-4xl md:text-5xl font-bold text-gradient-animated">Projects</h1>
          <p class="mt-2 max-w-2xl text-base md:text-lg text-default text-pretty">
            Agent systems, developer tools, languages and runtimes, and a few weird computers.
          </p>
        </div>
        <p v-if="projects?.length" class="shrink-0 text-sm text-muted">
          {{ projects.length }} projects in {{ groups.length }} groups
        </p>
      </header>

      <!-- Filters: group chips (All by default) + text search. Both sync to the URL. -->
      <div
        v-if="projects?.length"
        class="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
      >
        <div
          role="group"
          aria-label="Filter projects by group"
          class="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [scrollbar-width:thin]"
        >
          <button
            v-for="chip in chips"
            :key="chip.key"
            type="button"
            :aria-pressed="activeGroup === chip.key"
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :class="activeGroup === chip.key
              ? 'border-primary bg-primary text-inverted'
              : 'border-default bg-elevated/50 text-default hover:border-primary/60 hover:text-highlighted'"
            @click="setGroup(chip.key)"
          >
            <span>{{ chip.label }}</span>
            <span
              class="rounded-full px-1.5 text-xs tabular-nums"
              :class="activeGroup === chip.key ? 'bg-white/20' : 'bg-accented/60 text-muted'"
            >{{ chip.count }}</span>
          </button>
        </div>

        <UInput
          v-model="search"
          type="search"
          icon="i-lucide-search"
          placeholder="Search name or tech"
          aria-label="Search projects by name, description or technology"
          size="md"
          class="w-full lg:w-72 shrink-0"
        />
      </div>

      <p class="sr-only" aria-live="polite">{{ resultsLabel }}</p>

      <div v-if="pending" class="project-grid grid gap-4">
        <div v-for="n in 8" :key="n" class="rounded-xl overflow-hidden border border-default/60 motion-safe:animate-pulse">
          <div class="aspect-video bg-accented"/>
          <div class="p-4 space-y-2">
            <div class="h-4 bg-accented rounded w-2/3"/>
            <div class="h-3 bg-accented rounded"/>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <UIcon name="i-lucide-alert-circle" class="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h2 class="text-2xl font-bold mb-2 text-default">Something went wrong</h2>
        <p class="text-muted">{{ error.message || 'Failed to load projects' }}</p>
      </div>

      <div v-else-if="!projects?.length" class="text-center py-12">
        <UIcon name="i-lucide-folder-open" class="h-16 w-16 mx-auto text-muted mb-4" />
        <h2 class="text-2xl font-bold mb-2 text-default">No projects found</h2>
        <p class="text-muted">Check back soon for new projects!</p>
      </div>

      <section v-else aria-labelledby="project-list-title">
        <h2 id="project-list-title" class="sr-only">{{ activeLabel }}</h2>

        <div v-if="visibleProjects.length" class="@container">
          <div class="project-grid grid gap-4" :style="{ '--cells-wide': cellCount.wide, '--cells-bento': cellCount.bento }">
            <ProjectTile
              v-for="(project, index) in visibleProjects"
              :key="project.slug || project.path || project.title"
              :project="project"
              :feature="isFeature(project)"
              :bento="bento"
              :group-label="activeGroup === 'all' ? projectGroupOf(project.group).label : undefined"
              :eager="index < 4"
            />
            <!-- Fills whatever is left of the last row (or a full row), so the
                 mosaic always ends flush instead of on a lonely card. -->
            <aside class="grid-filler flex flex-col justify-between gap-4 rounded-xl border border-dashed border-primary/40 bg-elevated/30 p-5" aria-labelledby="projects-cta-title">
              <div>
                <h2 id="projects-cta-title" class="text-lg font-semibold text-highlighted">Building something weird?</h2>
                <p class="mt-1 text-sm text-muted text-pretty">I'm always up for a good collaboration, a hackathon, or a long thread about agent tooling.</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <UButton to="/contact" color="primary" size="sm" leading-icon="i-lucide-mail">Get in touch</UButton>
                <UButton to="/about" color="primary" variant="outline" size="sm" leading-icon="i-lucide-user">About me</UButton>
              </div>
            </aside>
          </div>
        </div>

        <div v-else class="rounded-xl border border-dashed border-default py-12 text-center">
          <p class="text-default mb-3">Nothing matches “{{ search }}”{{ activeGroup !== 'all' ? ` in ${activeLabel}` : '' }}.</p>
          <UButton variant="outline" size="sm" icon="i-lucide-x" @click="clearFilters">Clear filters</UButton>
        </div>
      </section>

    </UContainer>
  </main>
</template>

<script setup lang="ts">
import { useContent } from '~/composables/useContent'
import ProjectTile from '~/components/common/ProjectTile.vue'

const { fetchProjects } = useContent()
const route = useRoute()
const router = useRouter()

// Fetch all published projects, in display order
const { data: projects, pending, error } = await useAsyncData(
  'all-projects',
  () => fetchProjects()
)

type Project = NonNullable<typeof projects.value>[number]

// Groups present in the data, in PROJECT_GROUPS order (unknown keys -> "Other").
const groups = computed(() => {
  const list = projects.value ?? []
  const present = [...PROJECT_GROUPS, OTHER_GROUP].map(g => ({
    ...g,
    count: list.filter(p => projectGroupOf(p.group).key === g.key).length
  }))
  return present.filter(g => g.count > 0)
})

const chips = computed(() => [
  { key: 'all', label: 'All', count: projects.value?.length ?? 0 },
  ...groups.value.map(g => ({ key: g.key, label: g.short, count: g.count }))
])

// Filter state. It always starts as "All" so the prerendered HTML and the
// first client render match (no hydration mismatch); a ?group= / ?q= deep
// link is applied right after mount.
const activeGroup = ref('all')
const search = ref('')

const activeLabel = computed(() =>
  activeGroup.value === 'all'
    ? 'All projects'
    : groups.value.find(g => g.key === activeGroup.value)?.label ?? 'Projects'
)

function readQuery() {
  const g = typeof route.query.group === 'string' ? route.query.group : 'all'
  activeGroup.value = groups.value.some(x => x.key === g) ? g : 'all'
  search.value = typeof route.query.q === 'string' ? route.query.q : ''
}

function writeQuery() {
  const query = { ...route.query }
  if (activeGroup.value === 'all') delete query.group
  else query.group = activeGroup.value
  const q = search.value.trim()
  if (q) query.q = q
  else delete query.q
  if (query.group === route.query.group && query.q === route.query.q) return
  // Keep the trailing slash: Firebase serves /projects/ and redirects /projects
  router.replace({ path: '/projects/', query })
}

function setGroup(key: string) {
  activeGroup.value = key
}

function clearFilters() {
  activeGroup.value = 'all'
  search.value = ''
}

onMounted(() => {
  readQuery()
  watch([activeGroup, search], writeQuery)
  // Header nav to /projects/ (or back/forward) while already here
  watch(() => [route.query.group, route.query.q], readQuery)
})

// "All" interleaves groups in theme order so related work clusters together;
// within a group, projects keep the fetchProjects order.
const visibleProjects = computed<Project[]>(() => {
  const list = projects.value ?? []
  const q = search.value.trim().toLowerCase()
  return list
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => activeGroup.value === 'all' || projectGroupOf(p.group).key === activeGroup.value)
    .filter(({ p }) => !q || [p.title, p.description, ...(p.technologies ?? []), ...(p.tags ?? [])]
      .some(v => typeof v === 'string' && v.toLowerCase().includes(q)))
    .sort((a, b) => projectGroupIndex(a.p.group) - projectGroupIndex(b.p.group) || a.i - b.i)
    .map(({ p }) => p)
})

const resultsLabel = computed(() => {
  const n = visibleProjects.value.length
  return `${n} ${n === 1 ? 'project' : 'projects'} shown: ${activeLabel.value}${search.value.trim() ? `, matching “${search.value.trim()}”` : ''}`
})

// 2x2 feature tiles only in the unfiltered view: there are enough 1x1 tiles
// after them to pack around. A filtered set can be one or two projects, where
// a 2x2 tile would strand a 2x2 hole the one-row filler can't cover.
const bento = computed(() => activeGroup.value === 'all' && !search.value.trim())

// Grid cells the visible tiles occupy, so the CSS can size the trailing
// filler tile. A feature tile is 2x1, or 2x2 in bento mode from four columns.
const cellCount = computed(() => {
  const features = visibleProjects.value.filter(isFeature).length
  const n = visibleProjects.value.length
  return { wide: n + features, bento: n + (bento.value ? 3 : 1) * features }
})

// Award winners and featured projects get the wide tile.
function isFeature(project: Project) {
  return Boolean(project.award || project.featured)
}

useSiteSeo({
  title: 'Projects',
  description: 'Projects by Allison Coleman: agent systems, developer tools, languages and runtimes, and a few weird computers.'
})
</script>

<style scoped>
/*
 * One dense mosaic for every filter. Column count is explicit (not
 * auto-fill) so CSS knows it: one column per ~16rem of container width.
 * Feature tiles are 2x1 at 2-3 columns and 2x2 at 4 (ProjectTile uses the
 * same 33rem / 67rem container breakpoints), and `dense` backfills any cell a
 * big tile would strand.
 */
.project-grid {
  --cols: 1;
  --cells: var(--cells-wide);
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  grid-auto-flow: row dense;
}
@container (width >= 33rem) { .project-grid { --cols: 2; } }
@container (width >= 50rem) { .project-grid { --cols: 3; } }
@container (width >= 67rem) { .project-grid { --cols: 4; --cells: var(--cells-bento); } }

/*
 * The CTA tile spans the cells left on the last row, or a full row when the
 * tiles fill it exactly: ((cols - cells % cols - 1) mod cols) + 1.
 * Browsers without CSS mod() ignore this and give it one cell.
 */
.grid-filler {
  grid-column: span calc(mod(var(--cols) - mod(var(--cells), var(--cols)) - 1, var(--cols)) + 1);
}

@media (prefers-reduced-motion: reduce) {
  .bg-gradient-animated,
  .text-gradient-animated {
    animation: none;
  }
}
</style>
