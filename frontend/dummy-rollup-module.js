// Dummy module to replace rollup native modules
export default {
  // Provide empty/mock implementations for any required functions
  loadNative: () => null,
  getDefaultNativeFunctions: () => ({}),
  
  // Add any other exports that might be needed
  // This ensures anything trying to use this module gets mock data instead of errors
  getPluginMethodsFromBindings: () => ({}),
  isPureFunctionModule: () => false
}; 