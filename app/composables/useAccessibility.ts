export interface AccessibilityPreferences {
  readingSpeed: number;
  dyslexiaFont: boolean;
  highContrast: boolean;
  fontSize: 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
  lineSpacing: 'normal' | 'relaxed' | 'loose';
  reducedMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  readingSpeed: 225,
  dyslexiaFont: false,
  highContrast: false,
  fontSize: 'medium',
  lineSpacing: 'normal',
  reducedMotion: false,
  colorBlindMode: 'none',
};

export function useAccessibility() {
  const preferences = useState<AccessibilityPreferences>('accessibility-preferences', () => ({ ...DEFAULT_PREFERENCES }));
  const showSettings = useState<boolean>('accessibility-show-settings', () => false);
  const isFirstVisit = useState<boolean>('accessibility-first-visit', () => false);

  // Client-side only operations
  if (import.meta.client) {
    // Load from localStorage on mount
    onMounted(() => {
      const stored = localStorage.getItem('accessibility-preferences');
      if (stored) {
        try {
          preferences.value = { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
        } catch {
          preferences.value = { ...DEFAULT_PREFERENCES };
        }
      } else {
        isFirstVisit.value = true;
      }
      applyStyles();
    });

    // Watch for changes
    watch(preferences, (newPrefs) => {
      localStorage.setItem('accessibility-preferences', JSON.stringify(newPrefs));
      applyStyles();
    }, { deep: true });
  }

  // Apply CSS classes to document
  const applyStyles = () => {
    if (!import.meta.client) return;
    
    const root = document.documentElement;
    root.classList.toggle('dyslexia-font', preferences.value.dyslexiaFont);
    root.classList.toggle('high-contrast', preferences.value.highContrast);
    root.setAttribute('data-font-size', preferences.value.fontSize);
    root.setAttribute('data-line-spacing', preferences.value.lineSpacing);
    root.classList.toggle('reduced-motion', preferences.value.reducedMotion);
    root.setAttribute('data-color-blind-mode', preferences.value.colorBlindMode);
  };

  // Reading speed categories
  const readingSpeedCategories = [
    { label: 'Slow', wpm: 150, description: 'Careful reader' },
    { label: 'Average', wpm: 225, description: 'Most readers' },
    { label: 'Fast', wpm: 300, description: 'Speed reader' },
    { label: 'Very Fast', wpm: 400, description: 'Skimmer' },
  ];

  // Command key display
  const commandKey = computed(() => {
    if (!import.meta.client) return '⌘';
    const platform = window.navigator.platform.toLowerCase();
    if (platform.includes('mac')) return '⌘';
    return 'Ctrl';
  });

  // Update methods
  const updateReadingSpeed = (speed: number) => {
    preferences.value.readingSpeed = speed;
  };

  const updateDyslexiaFont = (enabled: boolean) => {
    preferences.value.dyslexiaFont = enabled;
  };

  const updateHighContrast = (enabled: boolean) => {
    preferences.value.highContrast = enabled;
  };

  const updateFontSize = (size: AccessibilityPreferences['fontSize']) => {
    preferences.value.fontSize = size;
  };

  const updateLineSpacing = (spacing: AccessibilityPreferences['lineSpacing']) => {
    preferences.value.lineSpacing = spacing;
  };

  const updateReducedMotion = (enabled: boolean) => {
    preferences.value.reducedMotion = enabled;
  };

  const updateColorBlindMode = (mode: AccessibilityPreferences['colorBlindMode']) => {
    preferences.value.colorBlindMode = mode;
  };

  const resetPreferences = () => {
    preferences.value = { ...DEFAULT_PREFERENCES };
  };

  const toggleSettings = () => {
    showSettings.value = !showSettings.value;
  };

  const dismissFirstVisit = () => {
    isFirstVisit.value = false;
  };

  return {
    preferences,
    showSettings,
    isFirstVisit,
    readingSpeedCategories,
    commandKey,
    toggleSettings,
    resetPreferences,
    dismissFirstVisit,
    applyStyles,
    updateReadingSpeed,
    updateDyslexiaFont,
    updateHighContrast,
    updateFontSize,
    updateLineSpacing,
    updateReducedMotion,
    updateColorBlindMode,
  };
}

// Export function for reading speed without full composable
export function getReadingSpeed(): number {
  if (import.meta.client) {
    const stored = localStorage.getItem('accessibility-preferences');
    if (stored) {
      try {
        const prefs = JSON.parse(stored);
        return prefs.readingSpeed || DEFAULT_PREFERENCES.readingSpeed;
      } catch {
        return DEFAULT_PREFERENCES.readingSpeed;
      }
    }
  }
  return DEFAULT_PREFERENCES.readingSpeed;
}