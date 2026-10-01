<template>
  <UApp :locale="locale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <LazyUContentSearch
        v-model:search-term="searchTerm"
        :files="files"
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

const { data: navigation } = await useAsyncData('navigation', async () => {
  const [blogNavigation, projectsNavigation] = await Promise.all([
    queryCollectionNavigation('blog').where('published', '=', true),
    queryCollectionNavigation('projects').where('status', '<>', 'draft')
  ])
  return slashNav([...blogNavigation, ...projectsNavigation])
})

const { data: files } = useLazyAsyncData('content-search', async () => {
  const [blogSections, projectSections] = await Promise.all([
    queryCollectionSearchSections('blog').where('published', '=', true),
    queryCollectionSearchSections('projects').where('status', '<>', 'draft')
  ])
  return [...blogSections, ...projectSections].map(file => ({ ...file, id: withTrailingSlashPath(file.id) }))
}, {
  server: false
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
    to: 'https://linkedin.com/in/allie-cat',
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