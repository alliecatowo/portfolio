module.exports = {
  root: true,
  extends: [
    '@nuxt/eslint-config',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:vuejs-accessibility/recommended',
    'prettier'
  ],
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['tsconfig.json']
      }
    }
  },
  rules: {
    // Common Nuxt/Vue ergonomics
    'vue/multi-word-component-names': 'off',
    // Accessibility - allow aria-labelledby for complex form groups
    'vuejs-accessibility/label-has-for': ['error', {
      required: {
        some: ['nesting', 'id']
      }
    }],
    // TS hygiene
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ],
    // Import organization
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always'
      }
    ]
  }
};
