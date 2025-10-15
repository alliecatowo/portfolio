export default defineAppConfig({
  ui: {
    colors: {
      primary: 'pink',
      neutral: 'slate'
    },
    button: {
      default: {
        size: 'md',
        color: 'primary',
        variant: 'solid'
      }
    },
    checkbox: {
      default: {
        size: 'sm'
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
    },
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
