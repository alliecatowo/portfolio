---
title: 'Advanced TypeScript Patterns: Type-Level Programming and Utility Mastery'
date: '2024-03-20'
description: 'Explore advanced TypeScript patterns including conditional types, mapped types, template literal types, and type-level programming techniques that will transform your code.'
category: 'dev'
tags: ['typescript', 'advanced', 'types', 'tutorial', 'patterns', 'backend', 'frontend']
author: 'Allie'
published: false
featured: true
featured_image: 'https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=1200&h=600&fit=crop'
reading_time: '15 min'
slug: 'typescript-advanced-patterns'
---

# Advanced TypeScript Patterns: Type-Level Programming and Utility Mastery

TypeScript's type system is incredibly powerful, capable of complex computations at compile time. Let's explore advanced patterns that will elevate your TypeScript skills from intermediate to expert level.

## Conditional Types: Logic at the Type Level

Conditional types allow you to create types based on conditions, enabling powerful type-level programming.

### Basic Conditional Types

```typescript
// Basic syntax: T extends U ? X : Y
type IsString<T> = T extends string ? true : false

type Test1 = IsString<string> // true
type Test2 = IsString<number> // false
type Test3 = IsString<'hello'> // true

// More practical example
type ApiResponse<T> = T extends string ? { message: T } : { data: T }

type StringResponse = ApiResponse<string> // { message: string }
type NumberResponse = ApiResponse<number> // { data: number }
```

### Distributive Conditional Types

When conditional types act on union types, they distribute over each union member:

```typescript
type ToArray<T> = T extends any ? T[] : never

type StringOrNumberArray = ToArray<string | number>
// Becomes: string[] | number[]

// Useful for filtering union types
type NonNullable<T> = T extends null | undefined ? never : T

type CleanUnion = NonNullable<string | null | number | undefined>
// Result: string | number
```

### Advanced Conditional Type Patterns

```typescript
// Extract function return types
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type FuncReturn = ReturnType<(x: number) => string> // string

// Extract promise values
type Awaited<T> = T extends Promise<infer U> ? U : T

type PromiseValue = Awaited<Promise<number>> // number
type NonPromiseValue = Awaited<string> // string

// Deep readonly implementation
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

interface User {
  name: string
  address: {
    street: string
    city: string
  }
}

type ReadonlyUser = DeepReadonly<User>
// All properties and nested properties become readonly
```

## Mapped Types: Transforming Object Types

Mapped types allow you to create new types by transforming properties of existing types.

### Basic Mapped Types

```typescript
// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P]
}

// Make all properties required
type Required<T> = {
  [P in keyof T]-?: T[P] // -? removes the optional modifier
}

// Make all properties readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

### Advanced Mapped Type Patterns

```typescript
// Create getters for all properties
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

interface User {
  name: string
  age: number
  email: string
}

type UserGetters = Getters<User>
// {
//   getName: () => string;
//   getAge: () => number;
//   getEmail: () => string;
// }

// Create both getters and setters
type GettersAndSetters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
} & {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void
}

// Filter properties by type
type StringProperties<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

type UserStringProps = StringProperties<User> // "name" | "email"

// Pick only string properties
type StringPropertiesOnly<T> = Pick<T, StringProperties<T>>
type UserStrings = StringPropertiesOnly<User> // { name: string; email: string; }
```

## Template Literal Types: String Manipulation at Type Level

Template literal types enable sophisticated string manipulation in the type system.

### Basic Template Literal Types

```typescript
type Greeting = `Hello ${string}`

type PersonalGreeting = `Hello ${'World' | 'TypeScript'}`
// "Hello World" | "Hello TypeScript"

// Event naming pattern
type EventName<T extends string> = `on${Capitalize<T>}`
type ButtonEvents = EventName<'click' | 'hover' | 'focus'>
// "onClick" | "onHover" | "onFocus"
```

### Advanced String Manipulation

```typescript
// Convert camelCase to kebab-case
type CamelToKebab<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends Lowercase<First>
    ? `${First}${CamelToKebab<Rest>}`
    : `-${Lowercase<First>}${CamelToKebab<Rest>}`
  : S

type KebabCase = CamelToKebab<'backgroundColor'> // "background-color"

// Extract route parameters
type ExtractParams<T extends string> = T extends `${infer Start}/:${infer Param}/${infer Rest}`
  ? { [K in Param]: string } & ExtractParams<`${Start}/${Rest}`>
  : T extends `${infer Start}/:${infer Param}`
    ? { [K in Param]: string }
    : {}

type UserRoute = ExtractParams<'/users/:userId/posts/:postId'>
// { userId: string; postId: string; }

// SQL query builder types
type SelectClause<
  T extends Record<string, any>,
  K extends keyof T,
> = `SELECT ${K extends string ? K : never} FROM ${string}`

interface Users {
  id: number
  name: string
  email: string
}

type UserSelectQuery = SelectClause<Users, 'name' | 'email'>
// "SELECT name | email FROM string"
```

## Utility Types: Building Complex Type Transformations

### Advanced Utility Type Implementations

```typescript
// Deep partial - makes all nested properties optional
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Merge two types, with the second overriding the first
type Merge<A, B> = Omit<A, keyof B> & B

interface DefaultConfig {
  theme: 'light' | 'dark'
  language: string
  debug: boolean
}

interface UserConfig {
  theme: 'blue' | 'red'
  apiUrl: string
}

type FinalConfig = Merge<DefaultConfig, UserConfig>
// {
//   language: string;
//   debug: boolean;
//   theme: 'blue' | 'red';
//   apiUrl: string;
// }

// Strict Pick - ensures all keys exist
type StrictPick<T, K extends keyof T> = Pick<T, K>

// Value of - get the type of object values
type ValueOf<T> = T[keyof T]

type UserValues = ValueOf<User> // string | number (from name, age, email)

// Create a union of all possible paths in an object
type Paths<T> = {
  [K in keyof T]: T[K] extends object ? K | `${K & string}.${Paths<T[K]> & string}` : K
}[keyof T]

interface NestedObject {
  user: {
    profile: {
      name: string
      age: number
    }
    settings: {
      theme: string
    }
  }
  meta: {
    version: string
  }
}

type ObjectPaths = Paths<NestedObject>
// "user" | "meta" | "user.profile" | "user.settings" | "user.profile.name" |
// "user.profile.age" | "user.settings.theme" | "meta.version"
```

## Function Type Patterns

### Advanced Function Typing

```typescript
// Curried function types
type Curry<T> = T extends (...args: infer Args) => infer Return
  ? Args extends [infer First, ...infer Rest]
    ? (arg: First) => Rest extends [] ? Return : Curry<(...rest: Rest) => Return>
    : () => Return
  : never

// Usage
declare function curry<T extends (...args: any[]) => any>(fn: T): Curry<T>

const add = (a: number, b: number, c: number) => a + b + c
const curriedAdd = curry(add)

const result = curriedAdd(1)(2)(3) // number

// Type-safe event emitter
interface EventMap {
  'user:login': { userId: string; timestamp: Date }
  'user:logout': { userId: string }
  'data:update': { table: string; id: string; data: any }
}

class TypedEventEmitter<T extends Record<string, any>> {
  private listeners: {
    [K in keyof T]?: Array<(data: T[K]) => void>
  } = {}

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event]!.push(listener)
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const eventListeners = this.listeners[event]
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data))
    }
  }
}

const emitter = new TypedEventEmitter<EventMap>()

emitter.on('user:login', data => {
  // data is typed as { userId: string; timestamp: Date }
  console.log(`User ${data.userId} logged in at ${data.timestamp}`)
})

emitter.emit('user:login', {
  userId: 'user123',
  timestamp: new Date(),
})
```

## Brand Types and Nominal Typing

TypeScript uses structural typing, but sometimes you need nominal typing:

```typescript
// Brand types for type safety
type Brand<T, B> = T & { __brand: B }

type UserId = Brand<string, 'UserId'>
type Email = Brand<string, 'Email'>
type PostId = Brand<string, 'PostId'>

// Helper function to create branded types
function createUserId(id: string): UserId {
  // Add validation logic here
  if (!id.startsWith('user_')) {
    throw new Error('Invalid user ID format')
  }
  return id as UserId
}

function createEmail(email: string): Email {
  if (!email.includes('@')) {
    throw new Error('Invalid email format')
  }
  return email as Email
}

// Functions that require specific branded types
function getUserPosts(userId: UserId): Promise<Post[]> {
  // userId is guaranteed to be a properly formatted user ID
  return fetch(`/api/users/${userId}/posts`).then(r => r.json())
}

function sendEmail(to: Email, subject: string): Promise<void> {
  // to is guaranteed to be a valid email
  return emailService.send({ to, subject })
}

// Usage
const userId = createUserId('user_123')
const userEmail = createEmail('user@example.com')

getUserPosts(userId) // ✅ Type safe
// getUserPosts('invalid-id'); // ❌ TypeScript error
```

## Generic Constraints and Conditional Logic

### Advanced Generic Patterns

```typescript
// Constrain generics with conditional types
type ApiEndpoint<T extends 'GET' | 'POST' | 'PUT' | 'DELETE'> = {
  method: T
  url: string
} & (T extends 'GET' ? { params?: Record<string, string> } : { data: any })

const getEndpoint: ApiEndpoint<'GET'> = {
  method: 'GET',
  url: '/users',
  params: { page: '1' },
  // data is not allowed for GET
}

const postEndpoint: ApiEndpoint<'POST'> = {
  method: 'POST',
  url: '/users',
  data: { name: 'John' },
  // params is not required for POST
}

// Builder pattern with type safety
class QueryBuilder<T extends Record<string, any>> {
  private conditions: Array<keyof T> = []
  private selectFields: Array<keyof T> = []

  select<K extends keyof T>(...fields: K[]): QueryBuilder<Pick<T, K>> {
    this.selectFields = fields
    return this as any
  }

  where<K extends keyof T>(
    field: K,
    operator: '=' | '!=' | '>' | '<' | 'IN',
    value: T[K] extends any[] ? (operator extends 'IN' ? T[K][number][] : T[K][number]) : T[K]
  ): this {
    this.conditions.push(field)
    return this
  }

  build(): string {
    // Build SQL query string
    return `SELECT ${this.selectFields.join(', ')} FROM table WHERE ...`
  }
}

interface User {
  id: number
  name: string
  email: string
  roles: string[]
  createdAt: Date
}

const query = new QueryBuilder<User>()
  .select('name', 'email')
  .where('id', '=', 123)
  .where('roles', 'IN', ['admin', 'user'])
  .build()
```

## Real-World Application: Type-Safe API Client

Let's build a complete type-safe API client using these advanced patterns:

```typescript
// API schema definition
interface ApiSchema {
  '/users': {
    GET: {
      response: User[]
      params: { page?: number; limit?: number }
    }
    POST: {
      response: User
      body: Omit<User, 'id' | 'createdAt'>
    }
  }
  '/users/:id': {
    GET: {
      response: User
      params: { id: string }
    }
    PUT: {
      response: User
      params: { id: string }
      body: Partial<Omit<User, 'id' | 'createdAt'>>
    }
    DELETE: {
      response: { success: boolean }
      params: { id: string }
    }
  }
}

// Extract route parameters from URL
type ExtractRouteParams<T extends string> = T extends `${infer Start}:${infer Param}/${infer Rest}`
  ? { [K in Param]: string } & ExtractRouteParams<`${Start}${Rest}`>
  : T extends `${infer Start}:${infer Param}`
    ? { [K in Param]: string }
    : {}

// Type-safe API client
class ApiClient<Schema extends Record<string, any>> {
  constructor(private baseUrl: string) {}

  async request<
    Path extends keyof Schema,
    Method extends keyof Schema[Path],
    Config = Schema[Path][Method],
  >(
    method: Method,
    path: Path,
    options?: {
      params?: Config extends { params: infer P } ? P : never
      body?: Config extends { body: infer B } ? B : never
    }
  ): Promise<Config extends { response: infer R } ? R : never> {
    const url = this.buildUrl(path as string, options?.params)

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: method as string,
      headers: {
        'Content-Type': 'application/json',
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    })

    return response.json()
  }

  private buildUrl(path: string, params?: Record<string, any>): string {
    let url = path

    // Replace route parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, String(value))
      })
    }

    return url
  }
}

// Usage with full type safety
const api = new ApiClient<ApiSchema>('https://api.example.com')

// GET /users with optional query params
const users = await api.request('GET', '/users', {
  params: { page: 1, limit: 10 },
})

// POST /users with required body
const newUser = await api.request('POST', '/users', {
  body: {
    name: 'John Doe',
    email: 'john@example.com',
    roles: ['user'],
  },
})

// PUT /users/:id with route params and body
const updatedUser = await api.request('PUT', '/users/:id', {
  params: { id: '123' },
  body: { name: 'Jane Doe' },
})

// DELETE /users/:id
const result = await api.request('DELETE', '/users/:id', {
  params: { id: '123' },
})
```

## Testing Advanced Types

TypeScript provides utilities for testing types at compile time:

```typescript
// Type testing utilities
type Expect<T extends true> = T
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

// Test our utility types
type Tests = [
  Expect<Equal<CamelToKebab<'backgroundColor'>, 'background-color'>>,
  Expect<Equal<ExtractParams<'/users/:id'>, { id: string }>>,
  Expect<Equal<ValueOf<{ a: string; b: number }>, string | number>>,
  // More tests...
]
```

## Conclusion

Advanced TypeScript patterns unlock the full power of the type system, enabling you to catch more errors at compile time and create more expressive, self-documenting code.

These patterns require practice to master, but they'll significantly improve your code's reliability and developer experience. Start by incorporating conditional types and mapped types in your projects, then gradually introduce more complex patterns as needed.

Remember: the goal isn't to use every advanced pattern, but to choose the right tool for each problem. Sometimes a simple type is better than a complex one, even if the complex version is more "correct."

Happy type-level programming!
