---
title: "TypeScript Best Practices for Vue and Nuxt Applications"
date: "2024-03-10"
description: "Essential TypeScript patterns, configurations, and best practices for building maintainable Vue.js and Nuxt.js applications."
tags: ["typescript", "vue", "nuxt", "best-practices", "development"]
author: "Allie"
published: true
featured: true
---

# TypeScript Best Practices for Vue and Nuxt Applications

TypeScript has become essential for building maintainable Vue and Nuxt applications. Here are the patterns and practices I've learned from building production applications.

## Project Setup

### TSConfig Configuration
Start with a solid `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "**/*.ts",
    "**/*.vue"
  ]
}
```

### Nuxt Configuration
Enable TypeScript in your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  typescript: {
    strict: true,
    typeCheck: true
  }
})
```

## Component Typing

### Props and Emits
Use `defineProps` and `defineEmits` with TypeScript:

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  items: Array<{ id: string; name: string }>
}

interface Emits {
  update: [value: string]
  delete: [id: string]
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

const emit = defineEmits<Emits>()

// Usage
emit('update', 'new value')
emit('delete', 'item-1')
</script>
```

### Ref and Reactive
Type your reactive data properly:

```typescript
// Primitive types
const count = ref<number>(0)
const message = ref<string>('')

// Complex types
interface User {
  id: string
  name: string
  email: string
}

const user = ref<User | null>(null)
const users = ref<User[]>([])

// Reactive objects
const state = reactive<{
  loading: boolean
  error: string | null
  data: User[]
}>({
  loading: false,
  error: null,
  data: []
})
```

## Composables

### Typed Composables
Create reusable, well-typed composables:

```typescript
// composables/useApi.ts
export interface ApiResponse<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(url: string): ApiResponse<T> & {
  refresh: () => Promise<void>
} {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const refresh = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<T>(url)
      data.value = response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  // Auto-fetch on creation
  refresh()

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    refresh
  }
}
```

### Usage in Components
```vue
<script setup lang="ts">
interface BlogPost {
  id: string
  title: string
  content: string
  publishedAt: string
}

const { data: posts, loading, error } = useApi<BlogPost[]>('/api/posts')
</script>
```

## Server API Types

### Consistent API Types
Define shared types for client-server communication:

```typescript
// types/api.ts
export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  publishedAt: string
  tags: string[]
  author: {
    name: string
    avatar?: string
  }
}

export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    page: number
    limit: number
  }
}
```

### Server Handlers
Use types in your API handlers:

```typescript
// server/api/blog/index.get.ts
import type { BlogPost, ApiResponse } from '~/types/api'

export default defineEventHandler(async (event): Promise<ApiResponse<BlogPost[]>> => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10

  // Your data fetching logic
  const posts = await queryContent<BlogPost>('blog')
    .limit(limit)
    .skip((page - 1) * limit)
    .find()

  return {
    data: posts,
    meta: {
      total: posts.length,
      page,
      limit
    }
  }
})
```

## Advanced Patterns

### Generic Utilities
Create reusable generic types:

```typescript
// types/utils.ts
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Optional<T, K extends keyof T> = Prettify<
  Partial<Pick<T, K>> & Omit<T, K>
>

export type RequireFields<T, K extends keyof T> = Prettify<
  Required<Pick<T, K>> & Omit<T, K>
>

// Usage
interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

// Make email optional
type UserInput = Optional<User, 'email'>

// Make avatar required
type CompleteUser = RequireFields<User, 'avatar'>
```

### Form Handling
Type-safe forms with validation:

```vue
<script setup lang="ts">
interface ContactForm {
  name: string
  email: string
  message: string
}

interface FormErrors {
  [K in keyof ContactForm]?: string
}

const form = reactive<ContactForm>({
  name: '',
  email: '',
  message: ''
})

const errors = ref<FormErrors>({})

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.name.trim()) {
    errors.value.name = 'Name is required'
  }

  if (!form.email.includes('@')) {
    errors.value.email = 'Valid email is required'
  }

  if (form.message.length < 10) {
    errors.value.message = 'Message must be at least 10 characters'
  }

  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) return

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: form
    })
  } catch (error) {
    // Handle error
  }
}
</script>
```

## Common Patterns

### Environment Variables
Type your runtime config:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // Server-only
    dbUrl: process.env.DATABASE_URL,
    
    // Public (exposed to client)
    public: {
      apiBase: process.env.API_BASE_URL || '/api',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000'
    }
  }
})

// Usage with types
const config = useRuntimeConfig()
// config.dbUrl is string | undefined
// config.public.apiBase is string
```

### Plugin Typing
Type your plugins properly:

```typescript
// plugins/api.client.ts
interface ApiClient {
  get<T>(url: string): Promise<T>
  post<T>(url: string, data: any): Promise<T>
}

export default defineNuxtPlugin(() => {
  const apiClient: ApiClient = {
    async get<T>(url: string): Promise<T> {
      return await $fetch(url)
    },
    
    async post<T>(url: string, data: any): Promise<T> {
      return await $fetch(url, { method: 'POST', body: data })
    }
  }

  return {
    provide: {
      api: apiClient
    }
  }
})

// Usage in components
const { $api } = useNuxtApp()
const user = await $api.get<User>('/api/user/me')
```

## Performance Considerations

### Lazy Loading Types
Use dynamic imports for large types:

```typescript
// Instead of importing everything
// import type { HugeLibraryType } from 'huge-library'

// Use dynamic import
type HugeLibraryType = Awaited<ReturnType<typeof import('huge-library').getType>>
```

### Template Optimization
Minimize template re-renders with computed properties:

```vue
<script setup lang="ts">
interface Item {
  id: string
  name: string
  category: string
  price: number
}

const items = ref<Item[]>([])
const selectedCategory = ref<string>('all')

// Computed property for filtered items
const filteredItems = computed(() => {
  if (selectedCategory.value === 'all') return items.value
  return items.value.filter(item => item.category === selectedCategory.value)
})
</script>

<template>
  <div v-for="item in filteredItems" :key="item.id">
    {{ item.name }} - ${{ item.price }}
  </div>
</template>
```

## Common Mistakes to Avoid

### 1. Any Types
```typescript
// ❌ Avoid
const data: any = await $fetch('/api/data')

// ✅ Better
interface ApiData {
  id: string
  name: string
}
const data: ApiData = await $fetch('/api/data')
```

### 2. Non-null Assertions
```typescript
// ❌ Dangerous
const user = users.find(u => u.id === id)!

// ✅ Safe
const user = users.find(u => u.id === id)
if (!user) throw new Error('User not found')
```

### 3. Missing Error Handling
```typescript
// ❌ No error handling
const data = await $fetch('/api/data')

// ✅ With proper error handling
try {
  const data = await $fetch('/api/data')
  // Use data
} catch (error) {
  console.error('Failed to fetch data:', error)
  // Handle error appropriately
}
```

## Conclusion

TypeScript in Vue and Nuxt applications significantly improves code quality, developer experience, and maintainability. Start with basic typing and gradually adopt more advanced patterns as your application grows.

The key is consistency - establish patterns early and stick to them throughout your project.

Happy typing! 🎯