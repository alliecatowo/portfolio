---
title: "Vue 3 Composition API Mastery: Building Scalable Components"
date: "2024-03-25"
description: "Master the Vue 3 Composition API with advanced patterns, custom composables, and TypeScript integration for building maintainable, scalable applications."
category: "dev"
tags: ["vue", "composition-api", "typescript", "frontend", "tutorial", "javascript"]
author: "Allie"
published: false
featured: true
featured_image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=600&fit=crop"
reading_time: "14 min"
slug: "vue3-composition-api-mastery"
---

# Vue 3 Composition API Mastery: Building Scalable Components

The Vue 3 Composition API revolutionizes how we build Vue applications by providing better logic reuse, type inference, and component organization. Let's explore advanced patterns that will transform your Vue development.

## Understanding Reactivity in Depth

Vue 3's reactivity system is built on Proxies, offering more powerful and predictable reactive behavior than Vue 2.

### Reactive vs Ref: When to Use What

```typescript
import { reactive, ref, computed, watch } from 'vue'

// Use ref for primitives and when you need .value access
const count = ref(0)
const message = ref('Hello')

// Use reactive for objects when you want direct property access
const user = reactive({
  name: 'John',
  age: 30,
  preferences: {
    theme: 'dark',
    language: 'en'
  }
})

// Computed properties work with both
const greeting = computed(() => `${message.value}, ${user.name}!`)

// Watchers can observe both
watch(count, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`)
})

// Watch reactive objects
watch(
  () => user.preferences.theme,
  (newTheme) => {
    document.body.className = `theme-${newTheme}`
  }
)
```

### Advanced Reactivity Patterns

```typescript
// Shallow reactivity for performance
import { shallowReactive, shallowRef } from 'vue'

const expensiveData = shallowReactive({
  items: new Array(10000).fill(0).map((_, i) => ({ id: i, value: Math.random() })),
  metadata: { count: 10000 }
})

// Only top-level properties are reactive
expensiveData.metadata.count = 20000 // Triggers reactivity
expensiveData.items[0].value = 0.5   // Does NOT trigger reactivity

// Manual reactivity control
import { triggerRef } from 'vue'

const manualRef = shallowRef({ deep: { value: 1 } })

const updateDeepValue = () => {
  manualRef.value.deep.value++
  triggerRef(manualRef) // Manually trigger reactivity
}

// Read-only reactive data
import { readonly } from 'vue'

const writableUser = reactive({ name: 'John', age: 30 })
const readonlyUser = readonly(writableUser)

// readonlyUser.name = 'Jane' // TypeError in dev mode
```

## Advanced Composable Patterns

### Generic Composables with TypeScript

```typescript
// Generic API composable
interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

function useApi<T>(url: ComputedRef<string> | string): ApiState<T> & {
  execute: () => Promise<void>
  reset: () => void
} {
  const state = reactive<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const execute = async () => {
    state.loading = true
    state.error = null
    
    try {
      const response = await fetch(unref(url))
      if (!response.ok) throw new Error(response.statusText)
      state.data = await response.json()
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Unknown error'
    } finally {
      state.loading = false
    }
  }

  const reset = () => {
    state.data = null
    state.error = null
    state.loading = false
  }

  // Auto-execute when URL changes
  watchEffect(execute)

  return {
    ...toRefs(state),
    execute,
    reset
  }
}

// Usage with full type safety
interface User {
  id: number
  name: string
  email: string
}

const userId = ref(1)
const userUrl = computed(() => `/api/users/${userId.value}`)
const { data: user, loading, error, execute } = useApi<User>(userUrl)
```

### Composable Composition Patterns

```typescript
// Base validation composable
function useValidation<T extends Record<string, any>>(
  data: T,
  rules: ValidationRules<T>
) {
  const errors = reactive<Partial<Record<keyof T, string>>>({})
  
  const validate = (field?: keyof T) => {
    const fieldsToValidate = field ? [field] : Object.keys(rules) as Array<keyof T>
    
    fieldsToValidate.forEach(key => {
      const rule = rules[key]
      const value = data[key]
      const error = rule(value)
      
      if (error) {
        errors[key] = error
      } else {
        delete errors[key]
      }
    })
  }

  const isValid = computed(() => Object.keys(errors).length === 0)
  
  return { errors: readonly(errors), validate, isValid }
}

// Form composable that uses validation
function useForm<T extends Record<string, any>>(
  initialData: T,
  validationRules?: ValidationRules<T>
) {
  const data = reactive<T>({ ...initialData })
  const originalData = { ...initialData }
  
  const validation = validationRules 
    ? useValidation(data, validationRules)
    : null

  const isDirty = computed(() => 
    Object.keys(data).some(key => data[key] !== originalData[key])
  )

  const reset = () => {
    Object.assign(data, originalData)
    validation?.validate()
  }

  const submit = async (submitFn: (data: T) => Promise<void>) => {
    if (validation) {
      validation.validate()
      if (!validation.isValid.value) {
        throw new Error('Form validation failed')
      }
    }
    
    await submitFn(data)
  }

  return {
    data,
    isDirty,
    reset,
    submit,
    validation
  }
}

// Usage in component
const ContactForm = defineComponent({
  setup() {
    const { data, validation, submit, reset } = useForm(
      {
        name: '',
        email: '',
        message: ''
      },
      {
        name: (value: string) => !value ? 'Name is required' : null,
        email: (value: string) => 
          !/\S+@\S+\.\S+/.test(value) ? 'Invalid email' : null,
        message: (value: string) => 
          value.length < 10 ? 'Message too short' : null
      }
    )

    const handleSubmit = () => submit(async (formData) => {
      await api.post('/contact', formData)
      reset()
    })

    return {
      data,
      errors: validation?.errors,
      handleSubmit,
      reset
    }
  }
})
```

### State Management Composables

```typescript
// Global state composable
function createGlobalState<T>(key: string, initialValue: T) {
  const state = ref(initialValue)
  
  // Sync with localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        state.value = JSON.parse(stored)
      } catch (error) {
        console.error(`Failed to parse stored value for ${key}:`, error)
      }
    }

    watch(
      state,
      (newValue) => {
        localStorage.setItem(key, JSON.stringify(newValue))
      },
      { deep: true }
    )
  }

  return state
}

// Theme state
const useTheme = () => {
  const theme = createGlobalState('theme', 'light')
  
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  // Apply theme on mount and when it changes
  onMounted(applyTheme)
  watch(theme, applyTheme)

  return { theme: readonly(theme), toggleTheme }
}

// User preferences store
interface UserPreferences {
  language: string
  notifications: boolean
  autoSave: boolean
}

const useUserPreferences = () => {
  const preferences = createGlobalState<UserPreferences>('userPrefs', {
    language: 'en',
    notifications: true,
    autoSave: true
  })

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    preferences.value[key] = value
  }

  return {
    preferences: readonly(preferences),
    updatePreference
  }
}
```

## Advanced Component Patterns

### Render Function Components

```typescript
// Flexible list component using render functions
interface ListItem {
  id: string | number
  [key: string]: any
}

interface ListProps<T extends ListItem> {
  items: T[]
  renderItem: (item: T, index: number) => VNode
  emptyMessage?: string
  loading?: boolean
}

const List = defineComponent({
  name: 'List',
  props: {
    items: { type: Array as PropType<ListItem[]>, required: true },
    renderItem: { type: Function as PropType<(item: ListItem, index: number) => VNode>, required: true },
    emptyMessage: { type: String, default: 'No items found' },
    loading: { type: Boolean, default: false }
  },
  setup(props) {
    return () => {
      if (props.loading) {
        return h('div', { class: 'list-loading' }, 'Loading...')
      }

      if (props.items.length === 0) {
        return h('div', { class: 'list-empty' }, props.emptyMessage)
      }

      return h(
        'div',
        { class: 'list-container' },
        props.items.map((item, index) => 
          h('div', { key: item.id, class: 'list-item' }, [
            props.renderItem(item, index)
          ])
        )
      )
    }
  }
})

// Usage
const UserList = defineComponent({
  setup() {
    const users = ref<User[]>([])
    
    const renderUser = (user: User, index: number) => 
      h('div', { class: 'user-card' }, [
        h('h3', user.name),
        h('p', user.email),
        h('button', {
          onClick: () => editUser(user.id)
        }, 'Edit')
      ])

    return () => h(List, {
      items: users.value,
      renderItem: renderUser,
      emptyMessage: 'No users found'
    })
  }
})
```

### Higher-Order Components (HOCs)

```typescript
// WithLoading HOC
function withLoading<T extends Record<string, any>>(
  WrappedComponent: Component,
  loadingComponent?: Component
) {
  return defineComponent({
    name: `WithLoading(${WrappedComponent.name})`,
    props: {
      loading: Boolean,
      ...WrappedComponent.props
    },
    setup(props, { slots }) {
      return () => {
        if (props.loading) {
          return loadingComponent 
            ? h(loadingComponent)
            : h('div', 'Loading...')
        }

        return h(WrappedComponent, props, slots)
      }
    }
  })
}

// WithErrorBoundary HOC
function withErrorBoundary<T extends Record<string, any>>(
  WrappedComponent: Component,
  fallbackComponent?: Component
) {
  return defineComponent({
    name: `WithErrorBoundary(${WrappedComponent.name})`,
    setup(props, { slots }) {
      const error = ref<Error | null>(null)

      const resetError = () => {
        error.value = null
      }

      onErrorCaptured((err) => {
        error.value = err
        return false
      })

      return () => {
        if (error.value) {
          return fallbackComponent
            ? h(fallbackComponent, { error: error.value, resetError })
            : h('div', [
                h('h2', 'Something went wrong'),
                h('p', error.value.message),
                h('button', { onClick: resetError }, 'Try again')
              ])
        }

        return h(WrappedComponent, props, slots)
      }
    }
  })
}

// Usage
const EnhancedUserList = withErrorBoundary(withLoading(UserList))
```

### Teleport and Portal Patterns

```typescript
// Modal composable using Teleport
function useModal() {
  const isOpen = ref(false)
  const modalRoot = ref<HTMLElement>()

  const open = () => {
    isOpen.value = true
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
  }

  const close = () => {
    isOpen.value = false
    document.body.style.overflow = ''
  }

  // Close on Escape key
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen.value) {
      close()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
    if (isOpen.value) {
      document.body.style.overflow = ''
    }
  })

  return { isOpen: readonly(isOpen), open, close }
}

// Modal component
const Modal = defineComponent({
  name: 'Modal',
  props: {
    show: Boolean,
    title: String
  },
  emits: ['close'],
  setup(props, { slots, emit }) {
    const close = () => emit('close')

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === event.currentTarget) {
        close()
      }
    }

    return () => {
      if (!props.show) return null

      return h(Teleport, { to: 'body' }, [
        h('div', {
          class: 'modal-backdrop',
          onClick: handleBackdropClick
        }, [
          h('div', { class: 'modal-content' }, [
            h('div', { class: 'modal-header' }, [
              h('h2', props.title),
              h('button', {
                class: 'modal-close',
                onClick: close
              }, '×')
            ]),
            h('div', { class: 'modal-body' }, slots.default?.())
          ])
        ])
      ])
    }
  }
})
```

## Performance Optimization Techniques

### Efficient Watchers and Effects

```typescript
// Debounced search with cleanup
function useSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  delay = 300
) {
  const query = ref('')
  const results = ref<T[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let timeoutId: ReturnType<typeof setTimeout>
  let abortController: AbortController

  const debouncedSearch = () => {
    // Clear previous timeout
    clearTimeout(timeoutId)
    
    // Abort previous request
    if (abortController) {
      abortController.abort()
    }

    if (!query.value.trim()) {
      results.value = []
      return
    }

    timeoutId = setTimeout(async () => {
      abortController = new AbortController()
      loading.value = true
      error.value = null

      try {
        const searchResults = await searchFn(query.value)
        if (!abortController.signal.aborted) {
          results.value = searchResults
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          error.value = err instanceof Error ? err.message : 'Search failed'
          results.value = []
        }
      } finally {
        if (!abortController.signal.aborted) {
          loading.value = false
        }
      }
    }, delay)
  }

  watch(query, debouncedSearch)

  onUnmounted(() => {
    clearTimeout(timeoutId)
    if (abortController) {
      abortController.abort()
    }
  })

  return { query, results: readonly(results), loading: readonly(loading), error: readonly(error) }
}

// Smart computed with expensive operations
function useExpensiveComputation(data: Ref<any[]>) {
  const result = computed(() => {
    console.log('Computing expensive result...')
    
    // Expensive operation
    return data.value
      .filter(item => item.active)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 100)
  })

  // Only recompute when relevant properties change
  const optimizedResult = computed(() => {
    const activeItems = data.value.filter(item => item.active)
    const hash = activeItems
      .map(item => `${item.id}-${item.priority}`)
      .join(',')
    
    // Cache based on hash
    return result.value
  })

  return optimizedResult
}
```

### Virtual Scrolling Composable

```typescript
function useVirtualScroll<T>(
  items: Ref<T[]>,
  itemHeight: number,
  containerHeight: number
) {
  const scrollTop = ref(0)
  const scrollElement = ref<HTMLElement>()

  const visibleRange = computed(() => {
    const start = Math.floor(scrollTop.value / itemHeight)
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const end = Math.min(start + visibleCount + 1, items.value.length)

    return { start: Math.max(0, start - 1), end }
  })

  const visibleItems = computed(() => {
    const { start, end } = visibleRange.value
    return items.value.slice(start, end).map((item, index) => ({
      item,
      index: start + index,
      top: (start + index) * itemHeight
    }))
  })

  const totalHeight = computed(() => items.value.length * itemHeight)
  const offsetY = computed(() => visibleRange.value.start * itemHeight)

  const handleScroll = (event: Event) => {
    scrollTop.value = (event.target as HTMLElement).scrollTop
  }

  return {
    scrollElement,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  }
}

// Virtual list component
const VirtualList = defineComponent({
  props: {
    items: { type: Array as PropType<any[]>, required: true },
    itemHeight: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  setup(props, { slots }) {
    const {
      scrollElement,
      visibleItems,
      totalHeight,
      offsetY,
      handleScroll
    } = useVirtualScroll(toRef(props, 'items'), props.itemHeight, props.height)

    return () => h('div', {
      ref: scrollElement,
      class: 'virtual-list',
      style: { height: `${props.height}px`, overflow: 'auto' },
      onScroll: handleScroll
    }, [
      h('div', {
        class: 'virtual-list-phantom',
        style: { height: `${totalHeight.value}px` }
      }),
      h('div', {
        class: 'virtual-list-content',
        style: { transform: `translateY(${offsetY.value}px)` }
      }, visibleItems.value.map(({ item, index, top }) =>
        h('div', {
          key: index,
          class: 'virtual-list-item',
          style: {
            height: `${props.itemHeight}px`,
            position: 'absolute',
            top: `${top}px`,
            width: '100%'
          }
        }, slots.default?.({ item, index }))
      ))
    ])
  }
})
```

## Testing Composition API

```typescript
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Testing composables in isolation
describe('useCounter', () => {
  it('should increment count', async () => {
    let result: any

    const TestComponent = defineComponent({
      setup() {
        result = useCounter()
        return () => h('div')
      }
    })

    mount(TestComponent)

    expect(result.count.value).toBe(0)
    
    result.increment()
    await nextTick()
    
    expect(result.count.value).toBe(1)
  })
})

// Testing components using composables
describe('UserList component', () => {
  it('should display users when loaded', async () => {
    const mockUsers = [
      { id: 1, name: 'John', email: 'john@example.com' },
      { id: 2, name: 'Jane', email: 'jane@example.com' }
    ]

    // Mock the API composable
    vi.mock('@/composables/useApi', () => ({
      useApi: vi.fn(() => ({
        data: ref(mockUsers),
        loading: ref(false),
        error: ref(null)
      }))
    }))

    const wrapper = mount(UserList)
    
    expect(wrapper.findAll('.user-item')).toHaveLength(2)
    expect(wrapper.text()).toContain('John')
    expect(wrapper.text()).toContain('Jane')
  })
})
```

## Conclusion

The Vue 3 Composition API provides unprecedented flexibility and reusability in component logic. By mastering these advanced patterns, you can build more maintainable, testable, and performant applications.

Key takeaways:
- Use composables for logic reuse and better organization
- Leverage TypeScript for better development experience
- Optimize performance with smart watchers and computed properties
- Test composables in isolation for better reliability

The Composition API's true power lies not in replacing the Options API, but in providing better tools for complex scenarios and logic reuse. Choose the right approach for each situation, and don't be afraid to mix both APIs when it makes sense.

Happy composing!
