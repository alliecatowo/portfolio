<template>
  <UApp :locale="locale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- Mounted (and its content dump fetched) the first time search opens -->
    <ClientOnly>
      <LazyUContentSearch
        v-if="searchReady"
        v-model:search-term="searchTerm"
        :files="files ?? []"
        shortcut="meta_k"
        :navigation="navigation"
        :links="links"
        :groups="groups"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>

<script setup lang="ts">
import { en } from '@nuxt/ui/locale'
import type { ContentNavigationItem } from '@nuxt/content'

// Nuxt UI 4.0's English locale has no contentSearch.title/description, so the
// search dialog's (screen-reader) title and description showed the raw keys.
// Patch the shared `en` object itself: useLocale() is a shared composable on the
// client, so a locale passed only to <UApp> can lose to the first caller's default
// (`en`), and the dialog kept showing the keys.
Object.assign(en.messages.contentSearch, {
  title: 'Search the site',
  description: 'Search projects, posts and pages'
})
const locale = en

// Content paths have no trailing slash; link to the canonical /path/ form instead.
const slashNav = (items: ContentNavigationItem[]): ContentNavigationItem[] =>
  items.map(item => ({
    ...item,
    path: withTrailingSlashPath(item.path),
    ...(item.children && { children: slashNav(item.children) })
  }))

// Search is the only consumer of the content dump and the navigation tree, and fetching them
// boots the SQLite WASM (~390 KB gz) plus the dump downloads. So none of it runs until search is
// first opened (button or ⌘K); until then the page only pays for a keydown listener.
const { open: searchOpen } = useContentSearch()
const searchReady = ref(false)

const { data: navigation, execute: loadNavigation } = useLazyAsyncData('navigation', async () => {
  const [blogNavigation, projectsNavigation] = await Promise.all([
    queryCollectionNavigation('blog').where('published', '=', true),
    queryCollectionNavigation('projects').where('status', '<>', 'draft')
  ])
  return slashNav([...blogNavigation, ...projectsNavigation])
}, { server: false, immediate: false })

const { data: files, execute: loadFiles } = useLazyAsyncData('content-search', async () => {
  const [blogSections, projectSections] = await Promise.all([
    queryCollectionSearchSections('blog').where('published', '=', true),
    queryCollectionSearchSections('projects').where('status', '<>', 'draft')
  ])
  return [...blogSections, ...projectSections].map(file => ({ ...file, id: withTrailingSlashPath(file.id) }))
}, { server: false, immediate: false })

function prepareSearch() {
  if (searchReady.value) return
  searchReady.value = true
  loadNavigation()
  loadFiles()
}
watch(searchOpen, (isOpen) => {
  if (isOpen) prepareSearch()
})
// UContentSearch registers ⌘K itself, but only once mounted. Until then, this opens it.
defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      if (!searchReady.value) searchOpen.value = true
    }
  }
})

const links = [{
  label: 'Blog',
  icon: 'i-lucide-pen-tool',
  to: '/blog/'
}, {
  label: 'Projects',
  icon: 'i-lucide-folder',
  to: '/projects/'
}, {
  label: 'About',
  icon: 'i-lucide-user',
  to: '/about/'
}]

const groups = [{
  id: 'contact',
  label: 'Contact',
  items: [{
    label: 'Email Me',
    icon: 'i-lucide-mail',
    to: '/contact/'
  }, {
    label: 'GitHub',
    icon: 'i-lucide-github',
    to: 'https://github.com/alliecatowo',
    target: '_blank'
  }, {
    label: 'LinkedIn',
    icon: 'i-lucide-linkedin',
    to: 'https://linkedin.com/in/alliecat',
    target: '_blank'
  }, {
    label: 'X',
    icon: 'i-simple-icons-x',
    to: 'https://x.com/AllieCatOwO',
    target: '_blank'
  }]
}]

const searchTerm = ref('')
</script>