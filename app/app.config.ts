export default defineAppConfig({
  ui: {
    colors: {
      primary: 'pink',
      neutral: 'slate'
    },
    button: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Nuxt UI v4 types are overly restrictive, but runtime supports these configurations
      defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'solid'
      },
      variants: {
        variant: {
          magnet: 'btn-depth magnetic-hover relative overflow-hidden transition-all duration-300 ease-out'
        }
      },
      compoundVariants: [
        // Magnet variant with primary color (matches original solid style)
        {
          color: 'primary',
          variant: 'magnet',
          class: 'bg-primary text-inverted hover:bg-primary/75 active:bg-primary/75 disabled:bg-primary aria-disabled:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary shadow-lg hover:shadow-xl active:translate-y-1'
        }
      ]
    },
    checkbox: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Nuxt UI v4 types are overly restrictive, but runtime supports these configurations
      defaultVariants: {
        size: 'sm'
      }
    },
    card: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Nuxt UI v4 types are overly restrictive, but runtime supports these configurations
      slots: {
        root: 'bg-white dark:bg-gray-950 ring-1 ring-gray-200 dark:ring-gray-800/60 rounded-lg shadow-sm'
      }
    },
    input: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Nuxt UI v4 types are overly restrictive, but runtime supports these configurations
      defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'outline'
      }
    },
    pagination: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Nuxt UI v4 types are overly restrictive, but runtime supports these configurations
      slots: {
        root: 'w-full',
        list: 'flex justify-center gap-1',
        item: 'rounded-md',
        label: 'min-w-7 text-center'
      }
    }
  }
})