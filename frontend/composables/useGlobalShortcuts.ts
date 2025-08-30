export const useGlobalShortcuts = () => {
  // Shared states
  const showAccessibilitySettings = useState<boolean>('showAccessibilitySettings', () => false)
  const showShortcutsHelp = useState<boolean>('showShortcutsHelp', () => false)

  const colorMode = useColorMode()
  const router = useRouter()
  const siteConfig = useSiteConfig()

  const toggleColorMode = () => {
    const next = colorMode.preference === 'dark' ? 'light' : 'dark'
    colorMode.preference = next
  }

  const togglePortfolioType = () => {
    const currentType = siteConfig.value?.type
    const newType = currentType === 'dev' ? 'tattoo' : 'dev'
    const baseRoute = newType === 'dev' ? '/dev' : '/tattoo'
    router.push(baseRoute)
  }

  const closeActiveModals = () => {
    if (showAccessibilitySettings.value) showAccessibilitySettings.value = false
    if (showShortcutsHelp.value) showShortcutsHelp.value = false
    // Command palette handles its own Escape via defineShortcuts in component
  }

  // Register global shortcuts using Nuxt UI defineShortcuts
  defineShortcuts({
    meta_a: () => {
      showAccessibilitySettings.value = true
    },
    meta_t: () => {
      toggleColorMode()
    },
    meta_s: () => {
      togglePortfolioType()
    },
    '?': () => {
      showShortcutsHelp.value = true
    },
    escape: {
      usingInput: true,
      handler: () => closeActiveModals()
    }
  })

  return {
    showAccessibilitySettings,
    showShortcutsHelp,
    toggleColorMode,
    togglePortfolioType,
    closeActiveModals
  }
}

