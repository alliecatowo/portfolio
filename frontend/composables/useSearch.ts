// Simplified command palette types to avoid conflicts with @nuxt/ui internal types
export interface SearchCommandPaletteItem {
  id?: string
  prefix?: string
  label?: string
  suffix?: string
  icon?: string
  active?: boolean
  loading?: boolean
  disabled?: boolean
  slot?: string
  placeholder?: string
  children?: SearchCommandPaletteItem[]
  onSelect?(e?: Event): void
  class?: any
}

export interface SearchCommandPaletteGroup {
  id: string
  label?: string
  slot?: string
  items?: SearchCommandPaletteItem[]
  ignoreFilter?: boolean
  highlightedIcon?: string
}

export interface SearchableContent {
  id: string
  title: string
  description?: string
  path: string
  type: 'page' | 'blog' | 'project' | 'action'
  icon?: string
  category?: string
  tags?: string[]
}

export const useSearch = () => {
  // Mock data for now - replace with actual content queries
  const posts = ref([])
  const projects = ref([])

  const searchableContent = computed<SearchableContent[]>(() => {
    const content: SearchableContent[] = []

    // Navigation pages
    content.push(
      {
        id: 'home',
        title: 'Home',
        description: 'Portfolio homepage showcasing both developer and tattoo work',
        path: '/',
        type: 'page',
        icon: 'i-lucide-home'
      },
      {
        id: 'dev-portfolio',
        title: 'Developer Portfolio',
        description: 'Full-stack developer projects and skills',
        path: '/dev',
        type: 'page',
        icon: 'i-lucide-code'
      },
      {
        id: 'dev-about',
        title: 'About Me (Developer)',
        description: 'My development journey and technical skills',
        path: '/dev/about',
        type: 'page',
        icon: 'i-lucide-user'
      },
      {
        id: 'dev-projects',
        title: 'Development Projects',
        description: 'Browse my coding projects and open source contributions',
        path: '/dev/projects',
        type: 'page',
        icon: 'i-lucide-folder'
      },
      {
        id: 'dev-blog',
        title: 'Developer Blog',
        description: 'Technical articles and development insights',
        path: '/dev/blog',
        type: 'page',
        icon: 'i-lucide-pen-tool'
      },
      {
        id: 'dev-contact',
        title: 'Contact (Developer)',
        description: 'Get in touch about development projects',
        path: '/dev/contact',
        type: 'page',
        icon: 'i-lucide-mail'
      },
      {
        id: 'tattoo-portfolio',
        title: 'Tattoo Portfolio',
        description: 'Custom tattoo designs and artwork',
        path: '/tattoo',
        type: 'page',
        icon: 'i-lucide-brush'
      },
      {
        id: 'tattoo-gallery',
        title: 'Tattoo Gallery',
        description: 'Browse my tattoo artwork and designs',
        path: '/tattoo/gallery',
        type: 'page',
        icon: 'i-lucide-image'
      }
    )

    // Blog posts
    if (posts.value && Array.isArray(posts.value)) {
      posts.value.forEach((post: any) => {
        content.push({
          id: post._id || post._path,
          title: post.title || 'Untitled Post',
          description: post.description || post.excerpt || 'Blog post',
          path: post._path || `/blog/${post.slug}`,
          type: 'blog',
          icon: 'i-lucide-file-text',
          category: post.category,
          tags: post.tags || []
        })
      })
    }

    // Projects
    if (projects.value && Array.isArray(projects.value)) {
      projects.value.forEach((project: any) => {
        content.push({
          id: project._id || project._path,
          title: project.title || 'Untitled Project',
          description: project.description || 'Development project',
          path: project._path || `/projects/${project.slug}`,
          type: 'project',
          icon: 'i-lucide-box',
          category: project.category,
          tags: project.tech || project.technologies || []
        })
      })
    }

    // Quick actions
    content.push(
      {
        id: 'toggle-theme',
        title: 'Toggle Theme',
        description: 'Switch between light and dark mode',
        path: '#',
        type: 'action',
        icon: 'i-lucide-sun-moon'
      },
      {
        id: 'copy-email',
        title: 'Copy Email',
        description: 'Copy email address to clipboard',
        path: '#',
        type: 'action',
        icon: 'i-lucide-copy'
      }
    )

    return content
  })

  const createCommandGroups = (closeModal?: () => void): SearchCommandPaletteGroup[] => {
    const content = searchableContent.value

    return [
      {
        id: 'pages',
        label: 'Pages',
        items: content
          .filter(item => item.type === 'page')
          .map(item => ({
            id: item.id,
            label: item.title,
            suffix: item.description,
            icon: item.icon,
            onSelect: () => {
              navigateTo(item.path)
              closeModal?.()
            }
          }))
      },
      {
        id: 'blog',
        label: 'Blog Posts',
        items: content
          .filter(item => item.type === 'blog')
          .map(item => ({
            id: item.id,
            label: item.title,
            suffix: item.description,
            icon: item.icon,
            onSelect: () => {
              navigateTo(item.path)
              closeModal?.()
            }
          }))
      },
      {
        id: 'projects',
        label: 'Projects',
        items: content
          .filter(item => item.type === 'project')
          .map(item => ({
            id: item.id,
            label: item.title,
            suffix: item.description,
            icon: item.icon,
            onSelect: () => {
              navigateTo(item.path)
              closeModal?.()
            }
          }))
      },
      {
        id: 'actions',
        label: 'Quick Actions',
        items: content
          .filter(item => item.type === 'action')
          .map(item => ({
            id: item.id,
            label: item.title,
            suffix: item.description,
            icon: item.icon,
            onSelect: () => {
              executeAction(item.id)
              closeModal?.()
            }
          }))
      }
    ].filter(group => group.items.length > 0)
  }

  const executeAction = (actionId: string) => {
    const { showSuccess } = useToastNotifications()
    
    switch (actionId) {
      case 'toggle-theme':
        const colorMode = useColorMode()
        const newMode = colorMode.preference === 'dark' ? 'light' : 'dark'
        colorMode.preference = newMode
        showSuccess(`Switched to ${newMode} mode`, 'Theme Updated')
        break
      case 'copy-email':
        navigator.clipboard.writeText('hello@allisons.dev')
        showSuccess('Email address copied to clipboard!', 'Copied')
        break
    }
  }

  return {
    searchableContent: readonly(searchableContent),
    createCommandGroups
  }
}