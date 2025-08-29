export default defineAppConfig({
  ui: {
    // Map primary/neutral aliases to Tailwind palette names
    colors: {
      primary: 'pink',
      neutral: 'slate'
    },

    // Component-specific defaults
    button: {
      default: {
        size: 'md',
        color: 'primary',
        variant: 'solid'
      }
    },

    card: {
      default: {
        background: 'white dark:bg-gray-950',
        ring: 'ring-1 ring-gray-200 dark:ring-gray-800/60',
        rounded: 'rounded-lg',
        shadow: 'shadow-sm'
      }
    },

    input: {
      default: {
        size: 'md',
        color: 'primary',
        variant: 'outline'
      }
    }
  }
})
