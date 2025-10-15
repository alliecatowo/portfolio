---
title: "GraphQL Implementation Guide: From Schema Design to Production"
date: 2024-04-15
description: Complete guide to implementing GraphQL APIs with schema design,
  resolvers, authentication, caching, and performance optimization strategies
  for production applications.
category: dev
tags:
  - graphql
  - api
  - backend
  - nodejs
  - tutorial
  - performance
author: Allie
published: false
featured: true
featured_image: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop
reading_time: 17 min
slug: graphql-implementation-guide
---

# GraphQL Implementation Guide: From Schema Design to Production

GraphQL revolutionizes API development by providing precise data fetching, strong typing, and excellent developer experience. Let's explore how to build production-ready GraphQL APIs from the ground up.

## Schema-First Design

### Designing Your GraphQL Schema

```graphql
# schema/types.graphql
scalar DateTime
scalar EmailAddress
scalar URL

enum UserRole {
  ADMIN
  MODERATOR
  USER
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

type User {
  id: ID!
  email: EmailAddress!
  username: String!
  profile: UserProfile!
  role: UserRole!
  posts(first: Int = 10, after: String, status: PostStatus): PostConnection!
  followers(first: Int = 10, after: String): UserConnection!
  following(first: Int = 10, after: String): UserConnection!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type UserProfile {
  firstName: String!
  lastName: String!
  bio: String
  avatar: URL
  website: URL
  location: String
  birthDate: DateTime
}

type Post {
  id: ID!
  title: String!
  content: String!
  excerpt: String
  slug: String!
  status: PostStatus!
  author: User!
  tags: [Tag!]!
  comments(first: Int = 10, after: String): CommentConnection!
  likesCount: Int!
  commentsCount: Int!
  isLikedByViewer: Boolean
  featuredImage: URL
  publishedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Comment {
  id: ID!
  content: String!
  author: User!
  post: Post!
  parent: Comment
  replies(first: Int = 10, after: String): CommentConnection!
  likesCount: Int!
  isLikedByViewer: Boolean
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Tag {
  id: ID!
  name: String!
  slug: String!
  description: String
  posts(first: Int = 10, after: String): PostConnection!
  postsCount: Int!
}

# Relay-style connections for pagination
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PostEdge {
  node: Post!
  cursor: String!
}

type CommentConnection {
  edges: [CommentEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type CommentEdge {
  node: Comment!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

# Input types
input CreatePostInput {
  title: String!
  content: String!
  excerpt: String
  status: PostStatus = DRAFT
  tagIds: [ID!] = []
  featuredImage: URL
}

input UpdatePostInput {
  title: String
  content: String
  excerpt: String
  status: PostStatus
  tagIds: [ID!]
  featuredImage: URL
}

input CreateUserInput {
  email: EmailAddress!
  username: String!
  password: String!
  profile: UserProfileInput!
}

input UserProfileInput {
  firstName: String!
  lastName: String!
  bio: String
  website: URL
  location: String
  birthDate: DateTime
}

# Query root
type Query {
  # User queries
  viewer: User
  user(id: ID, username: String): User
  users(first: Int = 10, after: String, search: String, role: UserRole): UserConnection!

  # Post queries
  post(id: ID, slug: String): Post
  posts(
    first: Int = 10
    after: String
    authorId: ID
    status: PostStatus
    tagIds: [ID!]
    search: String
  ): PostConnection!

  # Tag queries
  tag(id: ID, slug: String): Tag
  tags(first: Int = 10, after: String, search: String): [Tag!]!

  # Search
  search(
    query: String!
    first: Int = 10
    after: String
    types: [SearchType!] = [POST, USER, TAG]
  ): SearchConnection!
}

# Mutation root
type Mutation {
  # Authentication
  login(email: EmailAddress!, password: String!): AuthPayload!
  logout: Boolean!
  register(input: CreateUserInput!): AuthPayload!

  # User mutations
  updateProfile(input: UserProfileInput!): User!
  followUser(userId: ID!): User!
  unfollowUser(userId: ID!): User!

  # Post mutations
  createPost(input: CreatePostInput!): Post!
  updatePost(id: ID!, input: UpdatePostInput!): Post!
  deletePost(id: ID!): Boolean!
  likePost(postId: ID!): Post!
  unlikePost(postId: ID!): Post!

  # Comment mutations
  addComment(postId: ID!, content: String!, parentId: ID): Comment!
  updateComment(id: ID!, content: String!): Comment!
  deleteComment(id: ID!): Boolean!
  likeComment(commentId: ID!): Comment!
  unlikeComment(commentId: ID!): Comment!
}

# Subscription root
type Subscription {
  postAdded(authorId: ID): Post!
  commentAdded(postId: ID!): Comment!
  userFollowed(userId: ID!): User!
  postLiked(postId: ID!): PostLikeEvent!
}

type AuthPayload {
  token: String!
  user: User!
}

type PostLikeEvent {
  post: Post!
  user: User!
  action: LikeAction!
}

enum LikeAction {
  LIKED
  UNLIKED
}

enum SearchType {
  POST
  USER
  TAG
}

type SearchConnection {
  edges: [SearchEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type SearchEdge {
  node: SearchResult!
  cursor: String!
}

union SearchResult = Post | User | Tag
```

## Resolver Implementation

### Context and Data Sources

```javascript
// src/context.js
const { AuthenticationError } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const DataLoader = require('dataloader')

class GraphQLContext {
  constructor({ req, res, dataSources }) {
    this.req = req
    this.res = res
    this.dataSources = dataSources
    this.user = null
    this.setupUser()
    this.setupLoaders()
  }

  async setupUser() {
    const token = this.getTokenFromRequest()
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        this.user = await this.dataSources.userAPI.findById(decoded.userId)
      } catch (error) {
        // Invalid token - continue as unauthenticated
      }
    }
  }

  getTokenFromRequest() {
    const authorization = this.req.headers.authorization
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.substring(7)
    }
    return null
  }

  requireAuth() {
    if (!this.user) {
      throw new AuthenticationError('Authentication required')
    }
    return this.user
  }

  requireRole(role) {
    const user = this.requireAuth()
    if (user.role !== role && user.role !== 'ADMIN') {
      throw new ForbiddenError(`${role} role required`)
    }
    return user
  }

  setupLoaders() {
    // User loader
    this.userLoader = new DataLoader(async userIds => {
      const users = await this.dataSources.userAPI.findByIds(userIds)
      return userIds.map(id => users.find(user => user.id === id))
    })

    // Post loader
    this.postLoader = new DataLoader(async postIds => {
      const posts = await this.dataSources.postAPI.findByIds(postIds)
      return postIds.map(id => posts.find(post => post.id === id))
    })

    // Posts by author loader
    this.postsByAuthorLoader = new DataLoader(async authorIds => {
      const postsByAuthor = await this.dataSources.postAPI.findByAuthorIds(authorIds)
      return authorIds.map(authorId => postsByAuthor.filter(post => post.authorId === authorId))
    })

    // Comment count loader
    this.commentCountLoader = new DataLoader(async postIds => {
      const counts = await this.dataSources.commentAPI.getCountsByPostIds(postIds)
      return postIds.map(postId => counts[postId] || 0)
    })

    // Like status loader
    this.likeStatusLoader = new DataLoader(
      async keys => {
        if (!this.user) {
          return keys.map(() => false)
        }

        const likes = await this.dataSources.likeAPI.getUserLikes(
          this.user.id,
          keys.map(k => ({ type: k.type, id: k.id }))
        )

        return keys.map(key =>
          likes.some(like => like.type === key.type && like.targetId === key.id)
        )
      },
      {
        cacheKeyFn: key => `${key.type}:${key.id}`,
      }
    )
  }
}

module.exports = GraphQLContext
```

### Resolver Functions

```javascript
// src/resolvers/user.js
const { UserInputError, ForbiddenError } = require('apollo-server-express')
const { validateEmail, validateUsername } = require('../utils/validation')

const userResolvers = {
  Query: {
    viewer: async (parent, args, context) => {
      return context.user
    },

    user: async (parent, { id, username }, context) => {
      if (id) {
        return await context.userLoader.load(id)
      }
      if (username) {
        return await context.dataSources.userAPI.findByUsername(username)
      }
      throw new UserInputError('Either id or username must be provided')
    },

    users: async (parent, { first, after, search, role }, context) => {
      return await context.dataSources.userAPI.findMany({
        first,
        after,
        search,
        role,
      })
    },
  },

  Mutation: {
    register: async (parent, { input }, context) => {
      // Validation
      if (!validateEmail(input.email)) {
        throw new UserInputError('Invalid email format')
      }

      if (!validateUsername(input.username)) {
        throw new UserInputError(
          'Username must be 3-20 characters, alphanumeric and underscore only'
        )
      }

      // Check for existing user
      const existingUser = await context.dataSources.userAPI.findByEmailOrUsername(
        input.email,
        input.username
      )

      if (existingUser) {
        throw new UserInputError(
          existingUser.email === input.email ? 'Email already registered' : 'Username already taken'
        )
      }

      // Create user
      const user = await context.dataSources.userAPI.create(input)
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      })

      return { user, token }
    },

    login: async (parent, { email, password }, context) => {
      const user = await context.dataSources.userAPI.findByEmail(email)
      if (!user) {
        throw new AuthenticationError('Invalid credentials')
      }

      const isValid = await context.dataSources.userAPI.validatePassword(user.id, password)

      if (!isValid) {
        throw new AuthenticationError('Invalid credentials')
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      })

      return { user, token }
    },

    updateProfile: async (parent, { input }, context) => {
      const user = context.requireAuth()

      return await context.dataSources.userAPI.updateProfile(user.id, input)
    },

    followUser: async (parent, { userId }, context) => {
      const currentUser = context.requireAuth()

      if (currentUser.id === userId) {
        throw new UserInputError('Cannot follow yourself')
      }

      const targetUser = await context.userLoader.load(userId)
      if (!targetUser) {
        throw new UserInputError('User not found')
      }

      await context.dataSources.followAPI.follow(currentUser.id, userId)

      // Invalidate cache
      context.userLoader.clear(userId)

      return targetUser
    },
  },

  User: {
    posts: async (user, { first, after, status }, context) => {
      // Use DataLoader for caching
      if (!first && !after && !status) {
        return await context.postsByAuthorLoader.load(user.id)
      }

      return await context.dataSources.postAPI.findByAuthor(user.id, {
        first,
        after,
        status,
      })
    },

    followers: async (user, { first, after }, context) => {
      return await context.dataSources.followAPI.getFollowers(user.id, {
        first,
        after,
      })
    },

    following: async (user, { first, after }, context) => {
      return await context.dataSources.followAPI.getFollowing(user.id, {
        first,
        after,
      })
    },
  },
}

module.exports = userResolvers
```

### Post Resolvers with Advanced Features

```javascript
// src/resolvers/post.js
const postResolvers = {
  Query: {
    post: async (parent, { id, slug }, context) => {
      if (id) {
        return await context.postLoader.load(id)
      }
      if (slug) {
        return await context.dataSources.postAPI.findBySlug(slug)
      }
      throw new UserInputError('Either id or slug must be provided')
    },

    posts: async (parent, args, context) => {
      return await context.dataSources.postAPI.findMany(args)
    },
  },

  Mutation: {
    createPost: async (parent, { input }, context) => {
      const user = context.requireAuth()

      // Generate slug from title
      const slug = await context.dataSources.postAPI.generateSlug(input.title)

      const postData = {
        ...input,
        slug,
        authorId: user.id,
      }

      const post = await context.dataSources.postAPI.create(postData)

      // Publish subscription
      context.pubsub.publish('POST_ADDED', {
        postAdded: post,
        authorId: user.id,
      })

      return post
    },

    updatePost: async (parent, { id, input }, context) => {
      const user = context.requireAuth()
      const post = await context.postLoader.load(id)

      if (!post) {
        throw new UserInputError('Post not found')
      }

      // Check ownership or admin role
      if (post.authorId !== user.id && user.role !== 'ADMIN') {
        throw new ForbiddenError('Not authorized to update this post')
      }

      // Generate new slug if title changed
      if (input.title && input.title !== post.title) {
        input.slug = await context.dataSources.postAPI.generateSlug(input.title)
      }

      const updatedPost = await context.dataSources.postAPI.update(id, input)

      // Clear cache
      context.postLoader.clear(id)

      return updatedPost
    },

    likePost: async (parent, { postId }, context) => {
      const user = context.requireAuth()

      await context.dataSources.likeAPI.likePost(user.id, postId)

      const post = await context.postLoader.load(postId)

      // Clear like status cache
      context.likeStatusLoader.clear({ type: 'POST', id: postId })

      // Publish subscription
      context.pubsub.publish('POST_LIKED', {
        postLiked: {
          post,
          user,
          action: 'LIKED',
        },
      })

      return post
    },
  },

  Post: {
    author: async (post, args, context) => {
      return await context.userLoader.load(post.authorId)
    },

    tags: async (post, args, context) => {
      if (!post.tagIds || post.tagIds.length === 0) {
        return []
      }
      return await context.dataSources.tagAPI.findByIds(post.tagIds)
    },

    comments: async (post, { first, after }, context) => {
      return await context.dataSources.commentAPI.findByPost(post.id, {
        first,
        after,
      })
    },

    commentsCount: async (post, args, context) => {
      return await context.commentCountLoader.load(post.id)
    },

    likesCount: async (post, args, context) => {
      return await context.dataSources.likeAPI.getPostLikesCount(post.id)
    },

    isLikedByViewer: async (post, args, context) => {
      if (!context.user) {
        return false
      }

      return await context.likeStatusLoader.load({
        type: 'POST',
        id: post.id,
      })
    },

    excerpt: post => {
      if (post.excerpt) {
        return post.excerpt
      }

      // Auto-generate excerpt from content
      const plainText = post.content.replace(/<[^>]*>/g, '')
      return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
    },
  },
}

module.exports = postResolvers
```

## Data Sources and Database Integration

### Base Data Source

```javascript
// src/datasources/base-datasource.js
const { DataSource } = require('apollo-datasource')
const { UserInputError } = require('apollo-server-express')

class BaseDataSource extends DataSource {
  constructor(db) {
    super()
    this.db = db
  }

  initialize(config) {
    this.context = config.context
  }

  // Pagination helpers
  encodeCursor(data) {
    return Buffer.from(JSON.stringify(data)).toString('base64')
  }

  decodeCursor(cursor) {
    try {
      return JSON.parse(Buffer.from(cursor, 'base64').toString())
    } catch (error) {
      throw new UserInputError('Invalid cursor')
    }
  }

  async paginate(query, { first = 10, after, orderBy = 'createdAt' }) {
    // Limit first to reasonable bounds
    first = Math.min(first, 100)

    let whereClause = {}

    if (after) {
      const cursor = this.decodeCursor(after)
      whereClause[orderBy] = { lt: cursor[orderBy] }
      if (cursor.id) {
        whereClause = {
          OR: [
            { [orderBy]: { lt: cursor[orderBy] } },
            {
              [orderBy]: cursor[orderBy],
              id: { lt: cursor.id },
            },
          ],
        }
      }
    }

    const [items, totalCount] = await Promise.all([
      query({
        where: whereClause,
        orderBy: { [orderBy]: 'desc', id: 'desc' },
        take: first + 1, // Fetch one extra to check if there's a next page
      }),
      this.getTotalCount(query, whereClause),
    ])

    const hasNextPage = items.length > first
    if (hasNextPage) {
      items.pop() // Remove the extra item
    }

    const edges = items.map(item => ({
      cursor: this.encodeCursor({ [orderBy]: item[orderBy], id: item.id }),
      node: item,
    }))

    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: !!after,
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      },
      totalCount,
    }
  }

  async getTotalCount(query, whereClause) {
    // This would need to be implemented based on your ORM
    // For Prisma: return await this.db.model.count({ where: whereClause })
    return 0
  }
}

module.exports = BaseDataSource
```

### Specific Data Sources

```javascript
// src/datasources/post-datasource.js
const BaseDataSource = require('./base-datasource')
const slugify = require('slugify')

class PostDataSource extends BaseDataSource {
  async findById(id) {
    return await this.db.post.findUnique({
      where: { id },
      include: {
        author: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })
  }

  async findByIds(ids) {
    const posts = await this.db.post.findMany({
      where: { id: { in: ids } },
      include: {
        author: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })

    // Return in the same order as requested IDs
    return ids.map(id => posts.find(post => post.id === id))
  }

  async findBySlug(slug) {
    return await this.db.post.findUnique({
      where: { slug },
      include: {
        author: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })
  }

  async findMany({ first, after, authorId, status, tagIds, search }) {
    const where = {}

    if (authorId) {
      where.authorId = authorId
    }

    if (status) {
      where.status = status
    }

    if (tagIds && tagIds.length > 0) {
      where.tags = {
        some: {
          id: { in: tagIds },
        },
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    return await this.paginate(
      options =>
        this.db.post.findMany({
          ...options,
          where: { ...where, ...options.where },
          include: {
            author: true,
            tags: true,
            _count: {
              select: {
                comments: true,
                likes: true,
              },
            },
          },
        }),
      { first, after }
    )
  }

  async findByAuthorIds(authorIds) {
    const posts = await this.db.post.findMany({
      where: {
        authorId: { in: authorIds },
        status: 'PUBLISHED',
      },
      include: {
        author: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: 10, // Limit for performance
    })

    // Group by author ID
    const postsByAuthor = {}
    posts.forEach(post => {
      if (!postsByAuthor[post.authorId]) {
        postsByAuthor[post.authorId] = []
      }
      postsByAuthor[post.authorId].push(post)
    })

    return authorIds.map(authorId => postsByAuthor[authorId] || [])
  }

  async create(input) {
    const { tagIds, ...postData } = input

    return await this.db.post.create({
      data: {
        ...postData,
        tags: tagIds
          ? {
              connect: tagIds.map(id => ({ id })),
            }
          : undefined,
      },
      include: {
        author: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })
  }

  async update(id, input) {
    const { tagIds, ...postData } = input

    return await this.db.post.update({
      where: { id },
      data: {
        ...postData,
        tags: tagIds
          ? {
              set: tagIds.map(id => ({ id })),
            }
          : undefined,
        updatedAt: new Date(),
      },
      include: {
        author: true,
        tags: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })
  }

  async delete(id) {
    await this.db.post.delete({
      where: { id },
    })
    return true
  }

  async generateSlug(title) {
    const baseSlug = slugify(title, { lower: true, strict: true })
    let slug = baseSlug
    let counter = 1

    // Ensure unique slug
    while (await this.db.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    return slug
  }
}

module.exports = PostDataSource
```

## Authentication and Authorization

### JWT-based Authentication

```javascript
// src/auth/auth-service.js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { AuthenticationError, ForbiddenError } = require('apollo-server-express')

class AuthService {
  constructor(userDataSource) {
    this.userDataSource = userDataSource
  }

  async createToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: 'your-app',
      audience: 'your-app-users',
    })
  }

  async verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'your-app',
        audience: 'your-app-users',
      })
    } catch (error) {
      throw new AuthenticationError('Invalid token')
    }
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 12)
  }

  async comparePasswords(plaintext, hash) {
    return await bcrypt.compare(plaintext, hash)
  }

  async authenticate(email, password) {
    const user = await this.userDataSource.findByEmail(email)
    if (!user) {
      throw new AuthenticationError('Invalid credentials')
    }

    const isValidPassword = await this.comparePasswords(password, user.passwordHash)
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid credentials')
    }

    const token = await this.createToken(user)

    // Update last login
    await this.userDataSource.updateLastLogin(user.id)

    return { user, token }
  }

  requireRole(user, requiredRole) {
    const roleHierarchy = ['USER', 'MODERATOR', 'ADMIN']
    const userRoleIndex = roleHierarchy.indexOf(user.role)
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole)

    if (userRoleIndex < requiredRoleIndex) {
      throw new ForbiddenError(`${requiredRole} role required`)
    }

    return true
  }

  canAccessResource(user, resource) {
    // Resource-based access control
    if (resource.authorId === user.id) {
      return true // Owner can access
    }

    if (user.role === 'ADMIN') {
      return true // Admins can access everything
    }

    if (user.role === 'MODERATOR' && resource.type === 'POST') {
      return true // Moderators can access posts
    }

    return false
  }
}

module.exports = AuthService
```

### Authorization Directives

```javascript
// src/directives/auth-directive.js
const {
  SchemaDirectiveVisitor,
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express')
const { defaultFieldResolver } = require('graphql')

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    const requiredRole = this.args.requires

    field.resolve = async function (...args) {
      const [, , context] = args

      // Check if user is authenticated
      if (!context.user) {
        throw new AuthenticationError('Authentication required')
      }

      // Check role if specified
      if (requiredRole) {
        context.authService.requireRole(context.user, requiredRole)
      }

      return resolve.apply(this, args)
    }
  }
}

class OwnerDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async function (...args) {
      const [source, , context] = args

      if (!context.user) {
        throw new AuthenticationError('Authentication required')
      }

      // Check ownership
      if (source.authorId !== context.user.id && context.user.role !== 'ADMIN') {
        throw new ForbiddenError('Access denied: resource owner required')
      }

      return resolve.apply(this, args)
    }
  }
}

module.exports = { AuthDirective, OwnerDirective }

// Usage in schema:
// directive @auth(requires: Role = USER) on FIELD_DEFINITION
// directive @owner on FIELD_DEFINITION

// type User {
//   id: ID!
//   email: String! @auth(requires: ADMIN)
//   profile: UserProfile!
// }

// type Mutation {
//   updatePost(id: ID!, input: UpdatePostInput!): Post! @owner
//   deleteUser(id: ID!): Boolean! @auth(requires: ADMIN)
// }
```

## Caching and Performance

### Query Complexity Analysis

```javascript
// src/plugins/query-complexity.js
const costAnalysis = require('graphql-cost-analysis')

const costAnalysisPlugin = {
  requestDidStart() {
    return {
      didResolveOperation({ request, document }) {
        const complexity = costAnalysis({
          schema,
          query: document,
          variables: request.variables,
          createError: (max, actual) => {
            return new Error(`Query complexity limit exceeded: ${actual} > ${max}`)
          },
          maximumCost: 1000,
          defaultCost: 1,
          scalarCost: 1,
          objectCost: 2,
          listFactor: 10,
          introspectionCost: 1000,
          fieldExtensions: {
            // Custom field costs
            posts: { cost: 3 },
            comments: { cost: 2 },
            search: { cost: 10 },
          },
        })

        if (complexity > 1000) {
          throw new Error(`Query too complex: ${complexity}`)
        }
      },
    }
  },
}

module.exports = costAnalysisPlugin
```

### Response Caching

```javascript
// src/plugins/response-cache.js
const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_URL)

const responseCachePlugin = {
  requestDidStart() {
    return {
      willSendResponse(requestContext) {
        const { query, variables, response } = requestContext.request
        const { user } = requestContext.context

        // Only cache successful queries
        if (response.errors || !isQuery(query)) {
          return
        }

        // Don't cache authenticated user-specific queries
        if (user && containsUserSpecificFields(query)) {
          return
        }

        const cacheKey = generateCacheKey(query, variables)
        const ttl = getCacheTTL(query)

        if (ttl > 0) {
          redis.setex(cacheKey, ttl, JSON.stringify(response.data))
        }
      },

      async responseForOperation(requestContext) {
        const { query, variables } = requestContext.request
        const { user } = requestContext.context

        if (!isQuery(query) || user) {
          return null
        }

        const cacheKey = generateCacheKey(query, variables)
        const cached = await redis.get(cacheKey)

        if (cached) {
          return {
            data: JSON.parse(cached),
            extensions: {
              cacheHit: true,
            },
          }
        }

        return null
      },
    }
  },
}

function generateCacheKey(query, variables) {
  const queryString = query.definitions[0].loc.source.body
  return `graphql:${crypto
    .createHash('sha256')
    .update(queryString + JSON.stringify(variables))
    .digest('hex')}`
}

function getCacheTTL(query) {
  // Determine TTL based on query type
  const queryName = getQueryName(query)

  const ttlMap = {
    posts: 300, // 5 minutes
    post: 600, // 10 minutes
    user: 1800, // 30 minutes
    tags: 3600, // 1 hour
    search: 60, // 1 minute
  }

  return ttlMap[queryName] || 0
}

module.exports = responseCachePlugin
```

## Real-time Features with Subscriptions

### Subscription Implementation

```javascript
// src/resolvers/subscription.js
const { PubSub } = require('graphql-subscriptions')
const { RedisPubSub } = require('graphql-redis-subscriptions')
const Redis = require('ioredis')

// Use Redis for distributed subscriptions
const pubsub = new RedisPubSub({
  publisher: new Redis(process.env.REDIS_URL),
  subscriber: new Redis(process.env.REDIS_URL),
})

const subscriptionResolvers = {
  Subscription: {
    postAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['POST_ADDED']),
        (payload, variables, context) => {
          // Filter by author if specified
          if (variables.authorId) {
            return payload.authorId === variables.authorId
          }
          return true
        }
      ),
      resolve: payload => payload.postAdded,
    },

    commentAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['COMMENT_ADDED']),
        (payload, variables) => {
          return payload.postId === variables.postId
        }
      ),
      resolve: payload => payload.commentAdded,
    },

    postLiked: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['POST_LIKED']),
        (payload, variables) => {
          return payload.postLiked.post.id === variables.postId
        }
      ),
      resolve: payload => payload.postLiked,
    },

    userFollowed: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(['USER_FOLLOWED']),
        (payload, variables, context) => {
          // Only notify the followed user
          return payload.followedUserId === variables.userId
        }
      ),
      resolve: payload => payload.user,
    },
  },
}

module.exports = { subscriptionResolvers, pubsub }
```

### WebSocket Authentication

```javascript
// src/subscriptions/auth.js
const jwt = require('jsonwebtoken')

const authenticateWebSocket = async (connectionParams, webSocket) => {
  const token = connectionParams.Authorization || connectionParams.authorization

  if (!token) {
    throw new Error('Authentication token required')
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)

    // Fetch user data
    const user = await userDataSource.findById(decoded.userId)
    if (!user) {
      throw new Error('User not found')
    }

    return { user }
  } catch (error) {
    throw new Error('Invalid authentication token')
  }
}

module.exports = authenticateWebSocket
```

## Testing GraphQL APIs

### Integration Testing

```javascript
// tests/integration/post.test.js
const { createTestClient } = require('apollo-server-testing')
const { gql } = require('apollo-server-express')
const { createServer } = require('../helpers/test-server')

describe('Post Queries and Mutations', () => {
  let server, query, mutate

  beforeAll(async () => {
    server = await createServer()
    const testClient = createTestClient(server)
    query = testClient.query
    mutate = testClient.mutate
  })

  afterAll(async () => {
    await server.stop()
  })

  describe('Query: posts', () => {
    test('should return paginated posts', async () => {
      const GET_POSTS = gql`
        query GetPosts($first: Int, $after: String) {
          posts(first: $first, after: $after) {
            edges {
              node {
                id
                title
                author {
                  username
                }
              }
              cursor
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            totalCount
          }
        }
      `

      const response = await query({
        query: GET_POSTS,
        variables: { first: 5 },
      })

      expect(response.errors).toBeUndefined()
      expect(response.data.posts.edges).toHaveLength(5)
      expect(response.data.posts.pageInfo.hasNextPage).toBe(true)
      expect(response.data.posts.totalCount).toBeGreaterThan(5)
    })
  })

  describe('Mutation: createPost', () => {
    test('should create a new post when authenticated', async () => {
      const CREATE_POST = gql`
        mutation CreatePost($input: CreatePostInput!) {
          createPost(input: $input) {
            id
            title
            content
            status
            author {
              username
            }
          }
        }
      `

      const response = await mutate({
        mutation: CREATE_POST,
        variables: {
          input: {
            title: 'Test Post',
            content: 'This is a test post content.',
            status: 'PUBLISHED',
          },
        },
      })

      expect(response.errors).toBeUndefined()
      expect(response.data.createPost.title).toBe('Test Post')
      expect(response.data.createPost.status).toBe('PUBLISHED')
    })

    test('should require authentication', async () => {
      const CREATE_POST = gql`
        mutation CreatePost($input: CreatePostInput!) {
          createPost(input: $input) {
            id
          }
        }
      `

      // Test without authentication
      const response = await mutate({
        mutation: CREATE_POST,
        variables: {
          input: {
            title: 'Unauthorized Post',
            content: 'This should fail.',
          },
        },
      })

      expect(response.errors).toBeDefined()
      expect(response.errors[0].extensions.code).toBe('UNAUTHENTICATED')
    })
  })
})
```

## Production Deployment

### Server Configuration

```javascript
// src/server.js
const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const compression = require('compression')
const rateLimit = require('express-rate-limit')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const { AuthDirective, OwnerDirective } = require('./directives/auth')
const costAnalysisPlugin = require('./plugins/query-complexity')
const responseCachePlugin = require('./plugins/response-cache')

async function createServer() {
  const app = express()

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  )

  // CORS configuration
  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
      credentials: true,
    })
  )

  // Compression and rate limiting
  app.use(compression())
  app.use(
    '/graphql',
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs
      message: 'Too many GraphQL requests',
    })
  )

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives: {
      auth: AuthDirective,
      owner: OwnerDirective,
    },
    plugins: [costAnalysisPlugin, responseCachePlugin],
    context: ({ req, res, connection }) => {
      if (connection) {
        // WebSocket connection context
        return { ...connection.context }
      }

      return new GraphQLContext({ req, res, dataSources })
    },
    dataSources: () => ({
      userAPI: new UserDataSource(db),
      postAPI: new PostDataSource(db),
      commentAPI: new CommentDataSource(db),
      tagAPI: new TagDataSource(db),
      likeAPI: new LikeDataSource(db),
    }),
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production',
    formatError: error => {
      console.error('GraphQL Error:', error)

      // Don't expose internal errors in production
      if (process.env.NODE_ENV === 'production') {
        if (error.extensions?.code === 'INTERNAL_ERROR') {
          return new Error('Internal server error')
        }
      }

      return error
    },
  })

  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: false, // CORS handled by Express
  })

  return { app, server }
}

module.exports = createServer
```

## Conclusion

Building production-ready GraphQL APIs requires careful consideration of schema design, performance optimization, security, and monitoring. Key takeaways:

**Schema Design:**

- Use schema-first approach with clear type definitions
- Implement proper pagination with Relay-style connections
- Design efficient resolver patterns with DataLoader

**Performance:**

- Implement query complexity analysis and depth limiting
- Use DataLoader for N+1 query prevention
- Add response caching for public queries
- Monitor and optimize slow resolvers

**Security:**

- Implement proper authentication and authorization
- Use directives for declarative access control
- Validate and sanitize all inputs
- Implement rate limiting and request monitoring

**Real-time Features:**

- Use subscriptions for live updates
- Implement proper filtering and authentication
- Consider scalability with Redis PubSub

GraphQL's power lies in its flexibility, but that same flexibility requires discipline in implementation. Focus on clear contracts, performance optimization, and robust error handling to build APIs that scale with your application's needs.

The investment in proper GraphQL architecture pays dividends in developer productivity, API consistency, and client application performance.
