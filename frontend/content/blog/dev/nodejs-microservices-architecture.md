---
title: "Node.js Microservices Architecture: Design Patterns and Best Practices"
date: "2024-04-10"
description: "Comprehensive guide to building scalable Node.js microservices with service discovery, API gateways, event-driven architecture, and monitoring strategies."
category: "dev"
tags: ["nodejs", "microservices", "backend", "architecture", "scalability", "tutorial"]
author: "Allie"
published: true
featured: true
featured_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop"
reading_time: "18 min"
slug: "nodejs-microservices-architecture"
---

# Node.js Microservices Architecture: Design Patterns and Best Practices

Building microservices with Node.js requires careful consideration of architecture patterns, communication strategies, and operational concerns. Let's explore how to design and implement robust microservices that scale.

## Microservice Design Principles

### Single Responsibility and Bounded Context

```javascript
// User Service - focused on user management
// services/user-service/src/domain/user.js
class User {
  constructor({ id, email, profile, preferences }) {
    this.id = id
    this.email = email
    this.profile = profile
    this.preferences = preferences
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  updateProfile(profileData) {
    this.profile = { ...this.profile, ...profileData }
    this.updatedAt = new Date()
    return this
  }

  updatePreferences(preferences) {
    this.preferences = { ...this.preferences, ...preferences }
    this.updatedAt = new Date()
    return this
  }

  static fromDatabase(data) {
    return new User(data)
  }
}

// services/user-service/src/application/user-service.js
class UserService {
  constructor(userRepository, eventBus, logger) {
    this.userRepository = userRepository
    this.eventBus = eventBus
    this.logger = logger
  }

  async createUser(userData) {
    try {
      const user = new User(userData)
      const savedUser = await this.userRepository.save(user)
      
      // Publish domain event
      await this.eventBus.publish('user.created', {
        userId: savedUser.id,
        email: savedUser.email,
        timestamp: new Date().toISOString()
      })

      this.logger.info('User created', { userId: savedUser.id })
      return savedUser
    } catch (error) {
      this.logger.error('Failed to create user', { error: error.message })
      throw error
    }
  }

  async getUserById(userId) {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  async updateUser(userId, updateData) {
    const user = await this.getUserById(userId)
    
    if (updateData.profile) {
      user.updateProfile(updateData.profile)
    }
    
    if (updateData.preferences) {
      user.updatePreferences(updateData.preferences)
    }

    const updatedUser = await this.userRepository.save(user)
    
    await this.eventBus.publish('user.updated', {
      userId: updatedUser.id,
      changes: updateData,
      timestamp: new Date().toISOString()
    })

    return updatedUser
  }
}

module.exports = { User, UserService }
```

### Service Interface Design

```javascript
// services/user-service/src/interfaces/http/routes/users.js
const express = require('express')
const { body, param, validationResult } = require('express-validator')

class UserRoutes {
  constructor(userService, logger) {
    this.userService = userService
    this.logger = logger
    this.router = express.Router()
    this.setupRoutes()
  }

  setupRoutes() {
    this.router.post('/', 
      this.validateCreateUser(),
      this.handleValidationErrors,
      this.createUser.bind(this)
    )
    
    this.router.get('/:id', 
      this.validateUserId(),
      this.handleValidationErrors,
      this.getUser.bind(this)
    )
    
    this.router.put('/:id', 
      this.validateUserId(),
      this.validateUpdateUser(),
      this.handleValidationErrors,
      this.updateUser.bind(this)
    )
  }

  validateCreateUser() {
    return [
      body('email').isEmail().normalizeEmail(),
      body('profile.firstName').notEmpty().trim(),
      body('profile.lastName').notEmpty().trim(),
      body('preferences.language').optional().isIn(['en', 'es', 'fr'])
    ]
  }

  validateUserId() {
    return [param('id').isUUID().withMessage('Invalid user ID')]
  }

  validateUpdateUser() {
    return [
      body('profile.firstName').optional().notEmpty().trim(),
      body('profile.lastName').optional().notEmpty().trim(),
      body('preferences.language').optional().isIn(['en', 'es', 'fr'])
    ]
  }

  handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      })
    }
    next()
  }

  async createUser(req, res) {
    try {
      const user = await this.userService.createUser(req.body)
      res.status(201).json({
        id: user.id,
        email: user.email,
        profile: user.profile,
        createdAt: user.createdAt
      })
    } catch (error) {
      this.logger.error('Create user failed', { error: error.message })
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async getUser(req, res) {
    try {
      const user = await this.userService.getUserById(req.params.id)
      res.json({
        id: user.id,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences
      })
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' })
      }
      this.logger.error('Get user failed', { error: error.message })
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async updateUser(req, res) {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body)
      res.json({
        id: user.id,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences,
        updatedAt: user.updatedAt
      })
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' })
      }
      this.logger.error('Update user failed', { error: error.message })
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

module.exports = UserRoutes
```

## Service Communication Patterns

### API Gateway Implementation

```javascript
// api-gateway/src/gateway.js
const express = require('express')
const httpProxy = require('http-proxy-middleware')
const rateLimit = require('express-rate-limit')
const jwt = require('jsonwebtoken')
const consul = require('consul')()

class ApiGateway {
  constructor() {
    this.app = express()
    this.services = new Map()
    this.setupMiddleware()
    this.setupServiceDiscovery()
    this.setupRoutes()
  }

  setupMiddleware() {
    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP'
    })

    this.app.use(limiter)
    this.app.use(express.json())
    
    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
      next()
    })
  }

  async setupServiceDiscovery() {
    try {
      // Discover services from Consul
      const services = await consul.catalog.service.list()
      
      for (const [serviceName] of Object.entries(services)) {
        await this.discoverService(serviceName)
      }

      // Watch for service changes
      const watch = consul.watch({
        method: consul.catalog.service.list,
      })

      watch.on('change', (data) => {
        this.updateServices(data)
      })

    } catch (error) {
      console.error('Service discovery failed:', error)
    }
  }

  async discoverService(serviceName) {
    try {
      const serviceInstances = await consul.catalog.service.nodes(serviceName)
      
      if (serviceInstances.length > 0) {
        // Simple round-robin load balancing
        const healthyInstances = serviceInstances.filter(instance => 
          instance.ServiceTags.includes('healthy')
        )
        
        this.services.set(serviceName, {
          instances: healthyInstances,
          currentIndex: 0
        })
      }
    } catch (error) {
      console.error(`Failed to discover service ${serviceName}:`, error)
    }
  }

  getServiceInstance(serviceName) {
    const service = this.services.get(serviceName)
    if (!service || service.instances.length === 0) {
      throw new Error(`Service ${serviceName} not available`)
    }

    // Round-robin load balancing
    const instance = service.instances[service.currentIndex]
    service.currentIndex = (service.currentIndex + 1) % service.instances.length
    
    return instance
  }

  authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' })
      }
      req.user = user
      next()
    })
  }

  setupRoutes() {
    // User service routes
    this.app.use('/api/users', 
      this.authenticateToken,
      this.createServiceProxy('user-service')
    )

    // Order service routes
    this.app.use('/api/orders', 
      this.authenticateToken,
      this.createServiceProxy('order-service')
    )

    // Product service routes (public)
    this.app.use('/api/products', 
      this.createServiceProxy('product-service')
    )

    // Health check
    this.app.get('/health', (req, res) => {
      const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {}
      }

      for (const [serviceName, service] of this.services.entries()) {
        healthStatus.services[serviceName] = {
          instances: service.instances.length,
          status: service.instances.length > 0 ? 'available' : 'unavailable'
        }
      }

      res.json(healthStatus)
    })
  }

  createServiceProxy(serviceName) {
    return httpProxy({
      target: (req) => {
        try {
          const instance = this.getServiceInstance(serviceName)
          return `http://${instance.ServiceAddress}:${instance.ServicePort}`
        } catch (error) {
          console.error(`Service routing failed for ${serviceName}:`, error)
          throw error
        }
      },
      changeOrigin: true,
      pathRewrite: {
        [`^/api/${serviceName.replace('-service', 's')}`]: ''
      },
      onError: (err, req, res) => {
        console.error(`Proxy error for ${serviceName}:`, err)
        res.status(503).json({ 
          error: 'Service temporarily unavailable',
          service: serviceName
        })
      },
      onProxyReq: (proxyReq, req) => {
        // Add correlation ID for tracing
        const correlationId = req.headers['x-correlation-id'] || 
          require('crypto').randomUUID()
        proxyReq.setHeader('x-correlation-id', correlationId)
        
        // Forward user context
        if (req.user) {
          proxyReq.setHeader('x-user-id', req.user.id)
          proxyReq.setHeader('x-user-roles', JSON.stringify(req.user.roles))
        }
      }
    })
  }

  start(port = 3000) {
    this.app.listen(port, () => {
      console.log(`API Gateway running on port ${port}`)
    })
  }
}

module.exports = ApiGateway
```

### Event-Driven Communication

```javascript
// shared/event-bus.js
const EventEmitter = require('events')
const Redis = require('ioredis')

class EventBus extends EventEmitter {
  constructor(redisConfig) {
    super()
    this.publisher = new Redis(redisConfig)
    this.subscriber = new Redis(redisConfig)
    this.setupSubscriptions()
  }

  setupSubscriptions() {
    this.subscriber.on('message', (channel, message) => {
      try {
        const event = JSON.parse(message)
        this.emit(channel, event)
      } catch (error) {
        console.error('Failed to parse event message:', error)
      }
    })
  }

  async publish(eventName, eventData) {
    const event = {
      id: require('crypto').randomUUID(),
      name: eventName,
      data: eventData,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }

    try {
      await this.publisher.publish(eventName, JSON.stringify(event))
      console.log(`Published event: ${eventName}`, { eventId: event.id })
    } catch (error) {
      console.error(`Failed to publish event ${eventName}:`, error)
      throw error
    }
  }

  async subscribe(eventName, handler) {
    await this.subscriber.subscribe(eventName)
    this.on(eventName, handler)
    console.log(`Subscribed to event: ${eventName}`)
  }

  async unsubscribe(eventName) {
    await this.subscriber.unsubscribe(eventName)
    this.removeAllListeners(eventName)
    console.log(`Unsubscribed from event: ${eventName}`)
  }
}

// Order service - consuming user events
// services/order-service/src/event-handlers/user-events.js
class UserEventHandler {
  constructor(orderService, logger) {
    this.orderService = orderService
    this.logger = logger
  }

  async handleUserCreated(event) {
    try {
      this.logger.info('Processing user.created event', { 
        eventId: event.id, 
        userId: event.data.userId 
      })

      // Initialize user-specific order data
      await this.orderService.initializeUserOrderData(event.data.userId)
      
      this.logger.info('User order data initialized', { 
        userId: event.data.userId 
      })
    } catch (error) {
      this.logger.error('Failed to handle user.created event', {
        eventId: event.id,
        error: error.message
      })
      
      // Implement dead letter queue or retry mechanism
      throw error
    }
  }

  async handleUserUpdated(event) {
    try {
      this.logger.info('Processing user.updated event', { 
        eventId: event.id, 
        userId: event.data.userId 
      })

      // Update cached user data if needed
      if (event.data.changes.profile) {
        await this.orderService.updateUserProfile(
          event.data.userId, 
          event.data.changes.profile
        )
      }
    } catch (error) {
      this.logger.error('Failed to handle user.updated event', {
        eventId: event.id,
        error: error.message
      })
    }
  }
}

// Event handler registration
// services/order-service/src/app.js
async function setupEventHandlers(eventBus, orderService, logger) {
  const userEventHandler = new UserEventHandler(orderService, logger)

  await eventBus.subscribe('user.created', 
    userEventHandler.handleUserCreated.bind(userEventHandler)
  )
  
  await eventBus.subscribe('user.updated', 
    userEventHandler.handleUserUpdated.bind(userEventHandler)
  )

  logger.info('Event handlers registered')
}
```

## Data Management Patterns

### Database Per Service with Saga Pattern

```javascript
// shared/saga/saga-orchestrator.js
class SagaOrchestrator {
  constructor(eventBus, logger) {
    this.eventBus = eventBus
    this.logger = logger
    this.sagas = new Map()
  }

  async startSaga(sagaType, sagaData) {
    const sagaId = require('crypto').randomUUID()
    const saga = {
      id: sagaId,
      type: sagaType,
      data: sagaData,
      steps: [],
      status: 'started',
      createdAt: new Date().toISOString()
    }

    this.sagas.set(sagaId, saga)

    try {
      await this.executeSaga(saga)
    } catch (error) {
      await this.compensateSaga(saga, error)
    }

    return sagaId
  }

  async executeSaga(saga) {
    const sagaDefinition = this.getSagaDefinition(saga.type)
    
    for (const step of sagaDefinition.steps) {
      try {
        this.logger.info(`Executing saga step: ${step.name}`, { 
          sagaId: saga.id 
        })

        const result = await this.executeStep(step, saga.data)
        
        saga.steps.push({
          name: step.name,
          status: 'completed',
          result,
          completedAt: new Date().toISOString()
        })

      } catch (error) {
        saga.steps.push({
          name: step.name,
          status: 'failed',
          error: error.message,
          failedAt: new Date().toISOString()
        })
        
        throw error
      }
    }

    saga.status = 'completed'
    this.logger.info(`Saga completed successfully`, { sagaId: saga.id })
  }

  async compensateSaga(saga, originalError) {
    this.logger.warn(`Saga failed, starting compensation`, { 
      sagaId: saga.id, 
      error: originalError.message 
    })

    saga.status = 'compensating'
    
    // Execute compensation in reverse order
    const completedSteps = saga.steps
      .filter(step => step.status === 'completed')
      .reverse()

    const sagaDefinition = this.getSagaDefinition(saga.type)

    for (const completedStep of completedSteps) {
      const stepDefinition = sagaDefinition.steps
        .find(s => s.name === completedStep.name)
      
      if (stepDefinition.compensation) {
        try {
          await this.executeStep(stepDefinition.compensation, {
            ...saga.data,
            stepResult: completedStep.result
          })
          
          this.logger.info(`Compensation executed for step: ${completedStep.name}`, {
            sagaId: saga.id
          })
        } catch (compensationError) {
          this.logger.error(`Compensation failed for step: ${completedStep.name}`, {
            sagaId: saga.id,
            error: compensationError.message
          })
        }
      }
    }

    saga.status = 'compensated'
    this.logger.info(`Saga compensation completed`, { sagaId: saga.id })
  }

  getSagaDefinition(sagaType) {
    const sagaDefinitions = {
      'create-order': {
        steps: [
          {
            name: 'reserve-inventory',
            service: 'inventory-service',
            action: 'reserve',
            compensation: {
              service: 'inventory-service',
              action: 'release'
            }
          },
          {
            name: 'process-payment',
            service: 'payment-service',
            action: 'charge',
            compensation: {
              service: 'payment-service',
              action: 'refund'
            }
          },
          {
            name: 'create-order',
            service: 'order-service',
            action: 'create',
            compensation: {
              service: 'order-service',
              action: 'cancel'
            }
          }
        ]
      }
    }

    return sagaDefinitions[sagaType]
  }

  async executeStep(step, data) {
    // Publish event to the target service
    const eventName = `${step.service}.${step.action}`
    await this.eventBus.publish(eventName, data)

    // Wait for response (simplified - in practice, use correlation IDs)
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Step ${step.name} timed out`))
      }, 30000)

      const responseHandler = (responseEvent) => {
        clearTimeout(timeout)
        if (responseEvent.success) {
          resolve(responseEvent.data)
        } else {
          reject(new Error(responseEvent.error))
        }
      }

      this.eventBus.once(`${eventName}.response`, responseHandler)
    })
  }
}
```

### CQRS Implementation

```javascript
// shared/cqrs/command-bus.js
class CommandBus {
  constructor() {
    this.handlers = new Map()
  }

  register(commandType, handler) {
    this.handlers.set(commandType, handler)
  }

  async execute(command) {
    const handler = this.handlers.get(command.type)
    if (!handler) {
      throw new Error(`No handler registered for command: ${command.type}`)
    }

    return await handler.handle(command)
  }
}

// shared/cqrs/query-bus.js
class QueryBus {
  constructor() {
    this.handlers = new Map()
  }

  register(queryType, handler) {
    this.handlers.set(queryType, handler)
  }

  async execute(query) {
    const handler = this.handlers.get(query.type)
    if (!handler) {
      throw new Error(`No handler registered for query: ${query.type}`)
    }

    return await handler.handle(query)
  }
}

// services/order-service/src/commands/create-order-command.js
class CreateOrderCommand {
  constructor(userId, items, shippingAddress) {
    this.type = 'CreateOrder'
    this.id = require('crypto').randomUUID()
    this.userId = userId
    this.items = items
    this.shippingAddress = shippingAddress
    this.timestamp = new Date().toISOString()
  }
}

class CreateOrderCommandHandler {
  constructor(orderRepository, sagaOrchestrator, logger) {
    this.orderRepository = orderRepository
    this.sagaOrchestrator = sagaOrchestrator
    this.logger = logger
  }

  async handle(command) {
    try {
      this.logger.info('Processing CreateOrder command', { 
        commandId: command.id,
        userId: command.userId 
      })

      // Start saga for order creation
      const sagaId = await this.sagaOrchestrator.startSaga('create-order', {
        userId: command.userId,
        items: command.items,
        shippingAddress: command.shippingAddress
      })

      this.logger.info('Order creation saga started', { 
        commandId: command.id,
        sagaId 
      })

      return { sagaId }
    } catch (error) {
      this.logger.error('Failed to process CreateOrder command', {
        commandId: command.id,
        error: error.message
      })
      throw error
    }
  }
}

// Query side - read model
// services/order-service/src/queries/get-user-orders-query.js
class GetUserOrdersQuery {
  constructor(userId, page = 1, limit = 10) {
    this.type = 'GetUserOrders'
    this.userId = userId
    this.page = page
    this.limit = limit
  }
}

class GetUserOrdersQueryHandler {
  constructor(orderReadRepository, logger) {
    this.orderReadRepository = orderReadRepository
    this.logger = logger
  }

  async handle(query) {
    try {
      const orders = await this.orderReadRepository.findByUserId(
        query.userId,
        {
          page: query.page,
          limit: query.limit,
          sort: { createdAt: -1 }
        }
      )

      return {
        orders: orders.data,
        pagination: {
          page: query.page,
          limit: query.limit,
          total: orders.total,
          totalPages: Math.ceil(orders.total / query.limit)
        }
      }
    } catch (error) {
      this.logger.error('Failed to execute GetUserOrders query', {
        userId: query.userId,
        error: error.message
      })
      throw error
    }
  }
}
```

## Service Monitoring and Observability

### Health Checks and Metrics

```javascript
// shared/health/health-check.js
class HealthChecker {
  constructor() {
    this.checks = new Map()
  }

  register(name, checkFunction) {
    this.checks.set(name, checkFunction)
  }

  async check() {
    const results = {}
    let overallStatus = 'healthy'

    for (const [name, checkFunction] of this.checks.entries()) {
      try {
        const startTime = Date.now()
        const result = await Promise.race([
          checkFunction(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Health check timeout')), 5000)
          )
        ])
        
        const duration = Date.now() - startTime

        results[name] = {
          status: 'healthy',
          duration,
          ...result
        }
      } catch (error) {
        results[name] = {
          status: 'unhealthy',
          error: error.message
        }
        overallStatus = 'unhealthy'
      }
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: results
    }
  }
}

// Service-specific health checks
// services/user-service/src/health/checks.js
const healthChecker = new HealthChecker()

// Database connectivity check
healthChecker.register('database', async () => {
  const db = require('../infrastructure/database')
  await db.query('SELECT 1')
  return { connection: 'established' }
})

// Redis connectivity check
healthChecker.register('redis', async () => {
  const redis = require('../infrastructure/redis')
  await redis.ping()
  return { connection: 'established' }
})

// External service dependency check
healthChecker.register('external-api', async () => {
  const response = await fetch('https://api.external-service.com/health', {
    timeout: 3000
  })
  
  if (!response.ok) {
    throw new Error(`External API returned ${response.status}`)
  }
  
  return { 
    connection: 'established',
    latency: response.headers.get('x-response-time')
  }
})

module.exports = healthChecker
```

### Distributed Tracing

```javascript
// shared/tracing/tracer.js
const opentelemetry = require('@opentelemetry/api')
const { NodeSDK } = require('@opentelemetry/auto-instrumentations-node')
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger')

class TracingService {
  constructor(serviceName) {
    this.serviceName = serviceName
    this.setupTracing()
  }

  setupTracing() {
    const jaegerExporter = new JaegerExporter({
      endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
    })

    const sdk = new NodeSDK({
      serviceName: this.serviceName,
      traceExporter: jaegerExporter,
    })

    sdk.start()
    console.log('Tracing initialized')
  }

  createSpan(name, options = {}) {
    const tracer = opentelemetry.trace.getTracer(this.serviceName)
    return tracer.startSpan(name, options)
  }

  async withSpan(name, fn, options = {}) {
    const span = this.createSpan(name, options)
    
    try {
      const result = await fn(span)
      span.setStatus({ code: opentelemetry.SpanStatusCode.OK })
      return result
    } catch (error) {
      span.recordException(error)
      span.setStatus({ 
        code: opentelemetry.SpanStatusCode.ERROR, 
        message: error.message 
      })
      throw error
    } finally {
      span.end()
    }
  }

  addSpanAttributes(span, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      span.setAttribute(key, value)
    })
  }
}

// Usage in service
// services/user-service/src/application/user-service.js
class UserService {
  constructor(userRepository, eventBus, logger, tracingService) {
    this.userRepository = userRepository
    this.eventBus = eventBus
    this.logger = logger
    this.tracingService = tracingService
  }

  async createUser(userData) {
    return await this.tracingService.withSpan(
      'user-service.create-user',
      async (span) => {
        this.tracingService.addSpanAttributes(span, {
          'user.email': userData.email,
          'operation.type': 'create'
        })

        const user = new User(userData)
        
        // Database operation span
        const savedUser = await this.tracingService.withSpan(
          'user-repository.save',
          async () => await this.userRepository.save(user)
        )

        // Event publishing span
        await this.tracingService.withSpan(
          'event-bus.publish',
          async () => {
            await this.eventBus.publish('user.created', {
              userId: savedUser.id,
              email: savedUser.email,
              timestamp: new Date().toISOString()
            })
          }
        )

        return savedUser
      }
    )
  }
}
```

### Centralized Logging

```javascript
// shared/logging/logger.js
const winston = require('winston')
const { ElasticsearchTransport } = require('winston-elasticsearch')

class Logger {
  constructor(serviceName) {
    this.serviceName = serviceName
    this.logger = this.createLogger()
  }

  createLogger() {
    const transports = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${this.serviceName}] ${level}: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta) : ''
            }`
          })
        )
      })
    ]

    // Add Elasticsearch transport in production
    if (process.env.NODE_ENV === 'production' && process.env.ELASTICSEARCH_URL) {
      transports.push(
        new ElasticsearchTransport({
          clientOpts: {
            node: process.env.ELASTICSEARCH_URL,
          },
          index: 'microservices-logs',
          transformer: (logData) => {
            return {
              '@timestamp': logData.timestamp,
              service: this.serviceName,
              level: logData.level,
              message: logData.message,
              ...logData.meta
            }
          }
        })
      )
    }

    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      transports,
      defaultMeta: {
        service: this.serviceName,
        environment: process.env.NODE_ENV,
        version: process.env.SERVICE_VERSION
      }
    })
  }

  info(message, meta = {}) {
    this.logger.info(message, meta)
  }

  error(message, meta = {}) {
    this.logger.error(message, meta)
  }

  warn(message, meta = {}) {
    this.logger.warn(message, meta)
  }

  debug(message, meta = {}) {
    this.logger.debug(message, meta)
  }
}

module.exports = Logger
```

## Deployment and DevOps

### Docker Configuration

```dockerfile
# services/user-service/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

FROM node:18-alpine AS runtime

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app .

USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node health-check.js

CMD ["node", "src/app.js"]
```

### Kubernetes Deployment

```yaml
# k8s/user-service.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  labels:
    app: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: url
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
```

## Conclusion

Building successful Node.js microservices requires careful attention to service design, communication patterns, data management, and operational concerns. Key principles include:

**Design Principles:**
- Single responsibility and clear bounded contexts
- API-first design with proper validation
- Eventual consistency and event-driven architecture

**Communication:**
- API gateways for external communication
- Event-driven patterns for internal communication
- Circuit breakers and bulkheads for resilience

**Data Management:**
- Database per service
- CQRS for complex read/write patterns
- Saga pattern for distributed transactions

**Operations:**
- Comprehensive health checks
- Distributed tracing and centralized logging
- Container orchestration with proper resource management

The complexity of microservices is significant, but the benefits of scalability, maintainability, and team autonomy make them valuable for large, complex applications. Start with a well-designed monolith and extract services as clear boundaries emerge.

Success with microservices depends more on organizational culture, team structure, and operational maturity than on technology choices. Focus on building the right team practices alongside the technical architecture.