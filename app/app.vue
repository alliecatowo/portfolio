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
        :fuse="{
          resultLimit: 42,
          threshold: 0.3,
          includeScore: true,
          keys: [
            { name: 'title', weight: 0.4 },
            { name: 'description', weight: 0.3 },
            { name: 'content', weight: 0.2 },
            { name: 'tags', weight: 0.1 }
          ]
        }"
        @select="handleGroupAction"
      />
    </ClientOnly>
  </UApp>
</template>

<script setup lang="ts">
// Enhanced navigation with better organization
const { data: navigation } = await useAsyncData('navigation', async () => {
  const [blogNavigation, projectsNavigation] = await Promise.all([
    queryCollectionNavigation('blog'),
    queryCollectionNavigation('projects')
  ])

  // Organize navigation by collection type for better UX
  const organizedNav = [
    // Blog navigation
    ...blogNavigation.map(item => ({
      ...item,
      collection: 'blog' as const
    })),
    // Projects navigation
    ...projectsNavigation.map(item => ({
      ...item,
      collection: 'projects' as const
    }))
  ]

  return organizedNav
})

// Improved search sections with better indexing
const { data: files } = useLazyAsyncData('content-search', async () => {
  const [blogSections, projectSections] = await Promise.all([
    queryCollectionSearchSections('blog'),
    queryCollectionSearchSections('projects')
  ])

  // Combine and enhance sections with collection metadata
  return [
    ...blogSections.map(section => ({
      ...section,
      collection: 'blog',
      // Add weight for better ranking (blog posts get higher priority)
      weight: 1
    })),
    ...projectSections.map(section => ({
      ...section,
      collection: 'projects',
      // Projects get slightly lower priority
      weight: 0.8
    }))
  ]
}, {
  server: false
})

// Enhanced links with descriptions and better organization
const links = [
  {
    label: 'Blog',
    icon: 'i-lucide-pen-tool',
    to: '/blog',
    description: 'Development insights and tutorials'
  },
  {
    label: 'Projects',
    icon: 'i-lucide-folder',
    to: '/projects',
    description: 'Portfolio of development work'
  },
  {
    label: 'About',
    icon: 'i-lucide-user',
    to: '/about',
    description: 'Learn more about me'
  },
  {
    label: 'Home',
    icon: 'i-lucide-home',
    to: '/',
    description: 'Back to homepage'
  }
]

// Enhanced groups with more useful actions and help
const groups = [
  {
    id: 'content-actions',
    label: 'Content',
    items: [
      {
        label: 'All Blog Posts',
        icon: 'i-lucide-file-text',
        to: '/blog',
        description: 'Browse all articles'
      },
      {
        label: 'All Projects',
        icon: 'i-lucide-briefcase',
        to: '/projects',
        description: 'View all projects'
      },
      {
        label: 'Latest Posts',
        icon: 'i-lucide-clock',
        to: '/blog?sort=newest',
        description: 'Most recent articles'
      }
    ]
  },
  {
    id: 'contact',
    label: 'Connect',
    items: [
      {
        label: 'Email Me',
        icon: 'i-lucide-mail',
        to: '/contact',
        description: 'Get in touch'
      },
      {
        label: 'GitHub',
        icon: 'i-lucide-github',
        to: 'https://github.com/alliecatowo',
        target: '_blank',
        description: 'View my code'
      },
      {
        label: 'LinkedIn',
        icon: 'i-lucide-linkedin',
        to: 'https://linkedin.com/in/allison',
        target: '_blank',
        description: 'Professional profile'
      }
    ]
  },
  {
    id: 'quick-actions',
    label: 'Quick Actions',
    items: [
      {
        label: 'Toggle Theme',
        icon: 'i-lucide-palette',
        action: 'toggle-theme',
        description: 'Switch light/dark mode'
      },
      {
        label: 'Accessibility',
        icon: 'i-lucide-accessibility',
        action: 'accessibility',
        description: 'Open accessibility settings'
      }
    ]
  },
  {
    id: 'help',
    label: 'Help',
    items: [
      {
        label: 'Search Tips',
        icon: 'i-lucide-help-circle',
        content: 'help',
        description: 'How to search effectively'
      },
      {
        label: 'Keyboard Shortcuts',
        icon: 'i-lucide-keyboard',
        content: 'shortcuts',
        description: 'Available shortcuts'
      }
    ]
  }
]

// Reactive search state
const searchTerm = ref('')
const searchHistory = useState<string[]>('search-history', () => [])

// Custom action handlers
const handleGroupAction = (action: string) => {
  switch (action) {
    case 'toggle-theme':
      // This will be handled by the built-in color mode
      break
    case 'accessibility':
      // Trigger accessibility modal
      const showAccessibility = useState('showAccessibilitySettings', () => false)
      showAccessibility.value = true
      break
  }
}

// Track search history
watch(searchTerm, (newTerm) => {
  if (newTerm && newTerm.length > 2) {
    const history = [...searchHistory.value]
    const index = history.indexOf(newTerm)
    if (index > -1) {
      history.splice(index, 1)
    }
    history.unshift(newTerm)
    searchHistory.value = history.slice(0, 10) // Keep only last 10 searches
  }
})
</script>