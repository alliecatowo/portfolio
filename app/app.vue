<template>
  <UApp>
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
const { data: navigation } = await useAsyncData('navigation', async () => {
  const [blogNavigation, projectsNavigation] = await Promise.all([
    queryCollectionNavigation('blog').where('published', '=', true),
    queryCollectionNavigation('projects').where('status', '<>', 'draft')
  ])
  return [...blogNavigation, ...projectsNavigation]
})

const { data: files } = useLazyAsyncData('content-search', async () => {
  const [blogSections, projectSections] = await Promise.all([
    queryCollectionSearchSections('blog').where('published', '=', true),
    queryCollectionSearchSections('projects').where('status', '<>', 'draft')
  ])
  return [...blogSections, ...projectSections]
}, {
  server: false
})

const links = [{
  label: 'Blog',
  icon: 'i-lucide-pen-tool',
  to: '/blog'
}, {
  label: 'Projects',
  icon: 'i-lucide-folder',
  to: '/projects'
}, {
  label: 'About',
  icon: 'i-lucide-user',
  to: '/about'
}]

const groups = [{
  id: 'contact',
  label: 'Contact',
  items: [{
    label: 'Email Me',
    icon: 'i-lucide-mail',
    to: '/contact'
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