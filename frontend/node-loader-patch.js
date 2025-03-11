// Node.js loader hook to intercept rollup native module imports
export function resolve(specifier, context, nextResolve) {
  // Intercept requests for rollup native modules
  if (specifier.includes('@rollup/rollup-linux') || 
      specifier.includes('rollup/dist/native')) {
    console.log(`[Loader] Intercepted import for: ${specifier}`);
    
    // Return a dummy module instead
    return {
      shortCircuit: true,
      url: new URL('./dummy-rollup-module.js', import.meta.url).href,
    };
  }

  // Let Node.js handle all other imports
  return nextResolve(specifier, context);
} 