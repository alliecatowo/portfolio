import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    // Disable overly strict stylistic rules
    stylistic: false
  }
})
  // Extend with additional rules
  .append({
    rules: {
      // Common Nuxt/Vue ergonomics
      'vue/multi-word-component-names': 'off'
    }
  })