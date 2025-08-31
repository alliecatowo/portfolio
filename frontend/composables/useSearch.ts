// Simplified command palette types to avoid conflicts with @nuxt/ui internal types
export interface SearchCommandPaletteItem {
  id?: string
  prefix?: string
  label?: string
  suffix?: string | undefined
  icon?: string | undefined
  active?: boolean
  loading?: boolean
  disabled?: boolean
  slot?: string
  placeholder?: string
  children?: SearchCommandPaletteItem[]
  onSelect?(e?: Event): void
  class?: string | Record<string, boolean> | string[]
  kbds?: (string | undefined)[]
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
  kbds?: (string | undefined)[]
}

export const useSearch = () => {
  // Real content data with reactive updates - using return types from useContent
  const posts = ref<Awaited<ReturnType<typeof fetchBlogPosts>>>([])
  const projects = ref<Awaited<ReturnType<typeof fetchProjects>>>([])
  
  const { fetchBlogPosts, fetchProjects } = useContent()
  const isLoading = ref(false)
  const searchHistory = ref<string[]>([])
  const recentCommands = ref<SearchableContent[]>([])
  
  // Load real content on mount
  onMounted(async () => {
    await loadContent()
  })
  
  const loadContent = async () => {
    isLoading.value = true
    try {
      const [blogPosts, projectItems] = await Promise.all([
        fetchBlogPosts(),
        fetchProjects()
      ])
      posts.value = blogPosts
      projects.value = projectItems
    } catch (error) {
      console.error('Failed to load content:', error)
    } finally {
      isLoading.value = false
    }
  }

  const searchableContent = computed<SearchableContent[]>(() => {
    const content: SearchableContent[] = []

    // Navigation pages (unified portfolio structure)
    content.push(
      {
        id: 'home',
        title: 'Home',
        description: 'Portfolio homepage and overview',
        path: '/',
        type: 'page',
        icon: 'i-lucide-home'
      },
      {
        id: 'about',
        title: 'About Me',
        description: 'My journey, skills, and experience',
        path: '/about',
        type: 'page',
        icon: 'i-lucide-user'
      },
      {
        id: 'projects',
        title: 'Projects',
        description: 'Development projects and case studies',
        path: '/projects',
        type: 'page',
        icon: 'i-lucide-folder'
      },
      {
        id: 'open-source',
        title: 'Open Source',
        description: 'Open source contributions and packages',
        path: '/open-source',
        type: 'page',
        icon: 'i-lucide-github'
      },
      {
        id: 'blog',
        title: 'Blog',
        description: 'Technical articles and development insights',
        path: '/blog',
        type: 'page',
        icon: 'i-lucide-pen-tool'
      },
      {
        id: 'contact',
        title: 'Contact',
        description: 'Get in touch about projects and opportunities',
        path: '/contact',
        type: 'page',
        icon: 'i-lucide-mail'
      }
    )

    // Blog posts (real content with enhanced searchability)
    if (posts.value && Array.isArray(posts.value)) {
      posts.value.forEach((post) => {
        const readingTime = post.readingTime || Math.ceil((typeof post.body === 'object' && post.body !== null && 'length' in post.body ? (post.body as { length: number }).length : 1000) / 200)
        content.push({
          id: post.path || post.slug || 'unknown-post',
          title: post.title || 'Untitled Post',
          description: `${post.description || 'Blog post'} • ${readingTime} min read`,
          path: `/blog/${post.slug || post.path?.split('/').pop()}`,
          type: 'blog',
          icon: 'i-lucide-file-text',
          category: post.category,
          tags: [...(post.tags || []), post.date ? `${new Date(post.date).getFullYear()}` : ''].filter(Boolean)
        })
      })
    }

    // Projects (real content with tech stack visibility)
    if (projects.value && Array.isArray(projects.value)) {
      projects.value.forEach((project) => {
        const techStack = project.technologies || []
        const statusBadge = project.featured ? '⭐ Featured' : project.status || ''
        content.push({
          id: project.path || project.slug || 'unknown-project',
          title: project.title || 'Untitled Project',
          description: `${project.description || 'Development project'} ${statusBadge ? `• ${statusBadge}` : ''}`,
          path: `/projects/${project.slug || project.path?.split('/').pop()}`,
          type: 'project',
          icon: project.featured ? 'i-lucide-star' : 'i-lucide-box',
          category: undefined,
          tags: [...techStack].filter(Boolean)
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
        icon: 'i-lucide-sun-moon',
        kbds: ['meta', 'T']
      },
      {
        id: 'accessibility-settings',
        title: 'Accessibility Settings',
        description: 'Open reading preferences panel',
        path: '#',
        type: 'action',
        icon: 'i-lucide-sliders',
        kbds: ['meta', 'A']
      },
      {
        id: 'switch-portfolio',
        title: 'Switch Portfolio',
        description: 'Toggle between Developer and Tattoo',
        path: '#',
        type: 'action',
        icon: 'i-lucide-repeat',
        kbds: ['meta', 'S']
      },
      {
        id: 'shortcuts-help',
        title: 'Keyboard Shortcuts',
        description: 'Show available keyboard shortcuts',
        path: '#',
        type: 'action',
        icon: 'i-lucide-keyboard',
        kbds: ['?']
      },
      {
        id: 'toggle-dyslexia-font',
        title: 'Toggle Dyslexia Font',
        description: 'Enable/disable OpenDyslexic font',
        path: '#',
        type: 'action',
        icon: 'i-lucide-type'
      },
      {
        id: 'toggle-high-contrast',
        title: 'Toggle High Contrast',
        description: 'Enable/disable high contrast mode',
        path: '#',
        type: 'action',
        icon: 'i-lucide-contrast'
      },
      {
        id: 'toggle-reduced-motion',
        title: 'Toggle Reduced Motion',
        description: 'Enable/disable animations',
        path: '#',
        type: 'action',
        icon: 'i-lucide-zap-off'
      },
      {
        id: 'increase-font-size',
        title: 'Increase Font Size',
        description: 'Make text larger',
        path: '#',
        type: 'action',
        icon: 'i-lucide-zoom-in'
      },
      {
        id: 'decrease-font-size',
        title: 'Decrease Font Size',
        description: 'Make text smaller',
        path: '#',
        type: 'action',
        icon: 'i-lucide-zoom-out'
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

  // Advanced search with prefix support
  const parseSearchTerm = (term: string) => {
    const trimmed = term.trim()
    
    // Handle search prefixes
    if (trimmed.startsWith('>blog ')) {
      return { prefix: 'blog', query: trimmed.slice(6) }
    }
    if (trimmed.startsWith('>projects ') || trimmed.startsWith('>proj ')) {
      return { prefix: 'projects', query: trimmed.slice(trimmed.startsWith('>projects ') ? 10 : 6) }
    }
    if (trimmed.startsWith('>actions ') || trimmed.startsWith('>act ')) {
      return { prefix: 'actions', query: trimmed.slice(trimmed.startsWith('>actions ') ? 9 : 5) }
    }
    if (trimmed.startsWith('>pages ')) {
      return { prefix: 'pages', query: trimmed.slice(7) }
    }
    if (trimmed === '?' || trimmed.startsWith('?')) {
      return { prefix: 'help', query: trimmed.slice(1) }
    }
    if (trimmed.startsWith('!')) {
      return { prefix: 'execute', query: trimmed.slice(1) }
    }
    
    return { prefix: null, query: trimmed }
  }

  const addToHistory = (item: SearchableContent) => {
    // Add to recent commands, avoiding duplicates
    const filtered = recentCommands.value.filter((cmd: SearchableContent) => cmd.id !== item.id)
    recentCommands.value = [item, ...filtered].slice(0, 10)
  }

  const addSearchToHistory = (term: string) => {
    if (term.trim() && !searchHistory.value.includes(term.trim())) {
      searchHistory.value = [term.trim(), ...searchHistory.value].slice(0, 20)
    }
  }

  const createCommandGroups = (closeModal?: () => void, searchTerm?: string): SearchCommandPaletteGroup[] => {
    const content = searchableContent.value
    const parsed = parseSearchTerm(searchTerm || '')
    
    // If help prefix, show shortcuts and help
    if (parsed.prefix === 'help') {
      return [{
        id: 'help',
        label: 'Help & Shortcuts',
        items: [
          {
            id: 'help-prefixes',
            label: 'Search Prefixes',
            suffix: '>blog, >projects, >actions, >pages',
            icon: 'i-lucide-hash',
            onSelect: () => closeModal?.()
          },
          {
            id: 'help-shortcuts',
            label: 'Keyboard Shortcuts',
            suffix: '⌘K to open, ↑↓ to navigate, ↵ to select',
            icon: 'i-lucide-keyboard',
            onSelect: () => closeModal?.()
          },
          {
            id: 'help-actions',
            label: 'Quick Actions',
            suffix: 'Use ! prefix for immediate execution',
            icon: 'i-lucide-zap',
            onSelect: () => closeModal?.()
          }
        ]
      }]
    }

    // Filter content based on prefix
    let filteredContent = content
    if (parsed.prefix === 'blog') {
      filteredContent = content.filter(item => item.type === 'blog')
    } else if (parsed.prefix === 'projects') {
      filteredContent = content.filter(item => item.type === 'project')
    } else if (parsed.prefix === 'actions') {
      filteredContent = content.filter(item => item.type === 'action')
    } else if (parsed.prefix === 'pages') {
      filteredContent = content.filter(item => item.type === 'page')
    }

    const groups: SearchCommandPaletteGroup[] = []

    // Add recent commands if no search term or prefix
    if (!parsed.query && !parsed.prefix && recentCommands.value.length > 0) {
      groups.push({
        id: 'recent',
        label: 'Recently Used',
        items: recentCommands.value.slice(0, 5).map((item: SearchableContent) => ({
          id: item.id,
          label: item.title,
          suffix: item.description,
          icon: item.icon,
          onSelect: () => {
            if (item.type === 'action') {
              executeAction(item.id)
            } else {
              navigateTo(item.path)
            }
            addToHistory(item)
            closeModal?.()
          }
        }))
      })
    }

    // Add content groups based on prefix or show all
    if (!parsed.prefix || parsed.prefix === 'pages') {
      const pages = filteredContent.filter(item => item.type === 'page')
      if (pages.length > 0) {
        groups.push({
          id: 'pages',
          label: 'Pages',
          items: pages.map((item: SearchableContent) => ({
            id: item.id,
            label: item.title,
            suffix: item.description,
            icon: item.icon,
            onSelect: () => {
              navigateTo(item.path)
              addToHistory(item)
              closeModal?.()
            }
          }))
        })
      }
    }

    if (!parsed.prefix || parsed.prefix === 'blog') {
      const blogPosts = filteredContent.filter(item => item.type === 'blog')
      if (blogPosts.length > 0) {
        groups.push({
          id: 'blog',
          label: parsed.prefix === 'blog' ? 'Blog Posts' : 'Recent Blog Posts',
          items: blogPosts.slice(0, parsed.prefix === 'blog' ? 50 : 6).map((item: SearchableContent) => ({
            id: item.id,
            label: item.title,
            suffix: item.description,
            icon: item.icon,
            onSelect: () => {
              navigateTo(item.path)
              addToHistory(item)
              closeModal?.()
            }
          }))
        })
      }
    }

    if (!parsed.prefix || parsed.prefix === 'projects') {
      const projectItems = filteredContent.filter(item => item.type === 'project')
      if (projectItems.length > 0) {
        groups.push({
          id: 'projects',
          label: parsed.prefix === 'projects' ? 'All Projects' : 'Featured Projects',
          items: projectItems.slice(0, parsed.prefix === 'projects' ? 50 : 6).map((item: SearchableContent) => ({
            id: item.id,
            label: item.title,
            suffix: item.description,
            icon: item.icon,
            onSelect: () => {
              navigateTo(item.path)
              addToHistory(item)
              closeModal?.()
            }
          }))
        })
      }
    }

    if (!parsed.prefix || parsed.prefix === 'actions') {
      const actions = filteredContent.filter(item => item.type === 'action')
      if (actions.length > 0) {
        groups.push({
          id: 'actions',
          label: 'Quick Actions',
          items: actions.map((item: SearchableContent) => ({
            id: item.id,
            label: item.title,
            suffix: item.description,
            icon: item.icon,
            kbds: item.kbds,
            onSelect: () => {
              executeAction(item.id)
              addToHistory(item)
              closeModal?.()
            }
          }))
        })
      }
    }

    return groups.filter((group: SearchCommandPaletteGroup) => group.items && group.items.length > 0)
  }


  const executeAction = (actionId: string) => {
    const { showSuccess } = useToastNotifications()
    
    switch (actionId) {
      case 'toggle-theme': {
        const colorMode = useColorMode()
        const newMode = colorMode.preference === 'dark' ? 'light' : 'dark'
        colorMode.preference = newMode
        showSuccess(`Switched to ${newMode} mode`, 'Theme Updated')
        break
      }
      case 'accessibility-settings': {
          const showAccessibilitySettings = useState<boolean>('showAccessibilitySettings', () => false)
          showAccessibilitySettings.value = true
          break
        }
      case 'switch-portfolio': {
          const siteConfig = useSiteConfig()
          const router = useRouter()
          const currentType = siteConfig.value.type
          const newType = currentType === 'dev' ? 'tattoo' : 'dev'
          const baseRoute = newType === 'dev' ? '/dev' : '/tattoo'
          router.push(baseRoute)
          showSuccess(`Switched to ${newType} portfolio`, 'Navigation')
          break
        }
        break
      case 'shortcuts-help':
        {
          const showShortcutsHelp = useState<boolean>('showShortcutsHelp', () => false)
          showShortcutsHelp.value = true
        }
        break
      case 'toggle-dyslexia-font':
        {
          const { preferences, updateDyslexiaFont } = useAccessibility()
          const newDyslexia = !preferences.value.dyslexiaFont
          updateDyslexiaFont(newDyslexia)
          showSuccess(newDyslexia ? 'Dyslexia font enabled' : 'Dyslexia font disabled', 'Accessibility')
        }
        break
      case 'toggle-high-contrast':
        {
          const { preferences, updateHighContrast } = useAccessibility()
          const newContrast = !preferences.value.highContrast
          updateHighContrast(newContrast)
          showSuccess(newContrast ? 'High contrast enabled' : 'High contrast disabled', 'Accessibility')
        }
        break
      case 'toggle-reduced-motion':
        {
          const { preferences, updateReducedMotion } = useAccessibility()
          const newMotion = !preferences.value.reducedMotion
          updateReducedMotion(newMotion)
          showSuccess(newMotion ? 'Animations disabled' : 'Animations enabled', 'Accessibility')
        }
        break
      case 'increase-font-size':
        {
          const { preferences, updateFontSize } = useAccessibility()
          const sizes: Array<'small' | 'medium' | 'large' | 'x-large'> = ['small', 'medium', 'large', 'x-large']
          const currentIndex = sizes.indexOf(preferences.value.fontSize)
          if (currentIndex < sizes.length - 1 && currentIndex >= 0) {
            updateFontSize(sizes[currentIndex + 1]!)
            showSuccess(`Font size: ${sizes[currentIndex + 1]}`, 'Accessibility')
          }
        }
        break
      case 'decrease-font-size':
        {
          const { preferences, updateFontSize } = useAccessibility()
          const sizesDown: Array<'small' | 'medium' | 'large' | 'x-large'> = ['small', 'medium', 'large', 'x-large']
          const currentIndexDown = sizesDown.indexOf(preferences.value.fontSize)
          if (currentIndexDown > 0 && currentIndexDown < sizesDown.length) {
            updateFontSize(sizesDown[currentIndexDown - 1]!)
            showSuccess(`Font size: ${sizesDown[currentIndexDown - 1]}`, 'Accessibility')
          }
        }
        break
      case 'copy-email':
        navigator.clipboard.writeText('hello@allisons.dev')
        showSuccess('Email address copied to clipboard!', 'Copied')
        break
    }
  }

  return {
    searchableContent: readonly(searchableContent),
    createCommandGroups,
    parseSearchTerm,
    addToHistory,
    addSearchToHistory,
    searchHistory: readonly(searchHistory),
    recentCommands: readonly(recentCommands),
    isLoading: readonly(isLoading),
    loadContent
  }
}
