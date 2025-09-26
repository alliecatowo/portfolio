export default defineAppConfig({
  ui: {
    // Map primary/neutral aliases to Tailwind palette names
    colors: {
      primary: 'pink',
      neutral: 'slate'
    },

    // Component-specific defaults
    button: {
      defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'solid'
      }
    },

    // Smaller checkboxes by default (reduce visual weight)
    checkbox: {
      defaultVariants: {
        size: 'sm'
      }
    },

    card: {
      slots: {
        root: 'bg-white dark:bg-gray-950 ring-1 ring-gray-200 dark:ring-gray-800/60 rounded-lg shadow-sm'
      }
    },

    input: {
      defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'outline'
      }
    },

    // Sleeker pagination defaults
    pagination: {
      slots: {
        root: 'w-full',
        list: 'flex justify-center gap-1',
        item: 'rounded-md',
        label: 'min-w-7 text-center'
      }
    }
  }
})
