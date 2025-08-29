export default defineAppConfig({
  ui: {
    primary: 'pink',
    gray: 'neutral',
    
    // Color palette configuration
    colors: {
      // Light mode colors
      primary: {
        50: '#fdf2f8',
        100: '#fce7f3', 
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ec4899',
        600: '#db2777',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843',
        950: '#500724'
      }
    },
    
    // Component-specific overrides
    button: {
      default: {
        size: 'md',
        color: 'primary',
        variant: 'solid'
      }
    },
    
    card: {
      default: {
        background: 'white dark:bg-gray-900',
        ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
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