export default defineNuxtPlugin(() => {
  // Better Vue error formatting
  if (import.meta.client) {
    const originalErrorHandler = window.console.error
    window.console.error = (...args: unknown[]) => {
      const formattedArgs = args.map(arg => {
        if (arg && typeof arg === 'object') {
          try {
            // Try to stringify objects with better formatting
            return JSON.stringify(arg, null, 2)
          } catch {
            // If circular reference or other stringify error, use toString
            return arg.toString ? arg.toString() : String(arg)
          }
        }
        return arg
      })
      originalErrorHandler.apply(window.console, formattedArgs)
    }

    // Also handle Vue warnings
    const originalWarnHandler = window.console.warn
    window.console.warn = (...args: unknown[]) => {
      const formattedArgs = args.map(arg => {
        if (arg && typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2)
          } catch {
            return arg.toString ? arg.toString() : String(arg)
          }
        }
        return arg
      })
      originalWarnHandler.apply(window.console, formattedArgs)
    }
  }
})