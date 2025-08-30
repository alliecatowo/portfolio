---
title: "Full-Stack JavaScript Performance: Optimizing from Browser to Server"
description: "Comprehensive guide to JavaScript performance optimization across the entire stack - from frontend bundle optimization to Node.js server performance and database queries."
date: "2024-12-15"
tags: ["javascript", "performance", "fullstack", "nodejs", "optimization", "tutorial"]
featured_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop"
author: "Allison"
category: "tutorial"
reading_time: "18 min read"
slug: "fullstack-javascript-performance"
published: true
featured: true
---

# Full-Stack JavaScript Performance: Optimizing from Browser to Server

Performance is a feature, not an afterthought. In modern web development, optimizing JavaScript performance requires a holistic approach that spans the entire stack. Let's explore comprehensive strategies for building lightning-fast JavaScript applications from frontend to backend.

## Frontend Performance Optimization

### Bundle Analysis and Code Splitting

The foundation of frontend performance starts with understanding and optimizing your bundle size.

```javascript
// webpack-bundle-analyzer for Webpack projects
npm install --save-dev webpack-bundle-analyzer

// Add to your build script
"analyze": "npx webpack-bundle-analyzer build/static/js/*.js"

// For Vite projects
npm install --save-dev rollup-plugin-visualizer

// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      filename: 'bundle-analysis.html',
      open: true,
      gzipSize: true
    })
  ]
}
```

**Smart Code Splitting Strategies:**

```javascript
// Route-based splitting
const LazyDashboard = lazy(() => import('./Dashboard'));
const LazyProfile = lazy(() => import('./Profile'));

// Feature-based splitting
const ChartingLibrary = lazy(() => 
  import('./charts').then(module => ({ default: module.AdvancedCharts }))
);

// Component-based splitting with loading states
function AsyncComponent({ Component, fallback = <LoadingSpinner /> }) {
  const [component, setComponent] = useState(null);
  
  useEffect(() => {
    Component().then(comp => setComponent(() => comp.default));
  }, [Component]);
  
  return component ? createElement(component) : fallback;
}

// Preloading critical routes
const preloadRoute = (routeComponent) => {
  const componentImporter = routeComponent();
  if (componentImporter && componentImporter.then) {
    componentImporter.then(module => {
      // Route is now preloaded
      console.log('Route preloaded:', module);
    });
  }
};

// Preload on hover
<Link 
  to="/dashboard" 
  onMouseEnter={() => preloadRoute(() => import('./Dashboard'))}
>
  Dashboard
</Link>
```

### Advanced Tree Shaking and Dead Code Elimination

```javascript
// Configure for optimal tree shaking
// package.json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js"
  ]
}

// Import specific functions, not entire modules
// ❌ Poor - imports entire lodash
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ Better - specific import
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);

// ✅ Best - use native alternatives when possible
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Custom utility for selective imports
function createSelectiveImport(moduleImporter) {
  const cache = new Map();
  
  return async (exportName) => {
    if (!cache.has(exportName)) {
      const module = await moduleImporter();
      cache.set(exportName, module[exportName]);
    }
    return cache.get(exportName);
  };
}

// Usage
const importFromUtils = createSelectiveImport(() => import('./utils'));
const formatDate = await importFromUtils('formatDate');
```

### Memory Management and Garbage Collection

```javascript
// Efficient event listener management
class EventManager {
  constructor() {
    this.listeners = new Map();
    this.abortController = new AbortController();
  }
  
  addEventListener(element, event, handler, options = {}) {
    const boundHandler = handler.bind(this);
    const listenerOptions = {
      ...options,
      signal: this.abortController.signal
    };
    
    element.addEventListener(event, boundHandler, listenerOptions);
    
    // Track for cleanup
    const key = `${element.tagName}-${event}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push({ element, handler: boundHandler });
  }
  
  cleanup() {
    this.abortController.abort();
    this.listeners.clear();
  }
}

// WeakMap for memory-efficient data association
const componentData = new WeakMap();

function enhanceComponent(component, data) {
  componentData.set(component, data);
  // When component is garbage collected, data is automatically cleaned up
}

// Efficient DOM manipulation
function batchDOMOperations(operations) {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      const fragment = document.createDocumentFragment();
      
      operations.forEach(op => {
        const element = op.create();
        fragment.appendChild(element);
      });
      
      // Single DOM write
      document.body.appendChild(fragment);
      resolve();
    });
  });
}

// Memory-conscious infinite scrolling
class VirtualizedList {
  constructor(container, itemHeight, bufferSize = 5) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.bufferSize = bufferSize;
    this.renderedItems = new Map();
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this));
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        // Remove items that are out of view
        const index = parseInt(entry.target.dataset.index);
        this.recycleItem(index);
      }
    });
  }
  
  recycleItem(index) {
    if (this.renderedItems.has(index)) {
      const item = this.renderedItems.get(index);
      item.remove();
      this.renderedItems.delete(index);
    }
  }
  
  renderVisibleItems(startIndex, endIndex, data) {
    for (let i = startIndex; i <= endIndex; i++) {
      if (!this.renderedItems.has(i) && data[i]) {
        const item = this.createItem(data[i], i);
        this.renderedItems.set(i, item);
        this.container.appendChild(item);
        this.observer.observe(item);
      }
    }
  }
}
```

## Node.js Backend Performance

### V8 Engine Optimization

```javascript
// Profile and optimize hot paths
const { performance } = require('perf_hooks');

function measurePerformance(fn, name) {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  };
}

// V8 optimization hints
function optimizeHotFunction(data) {
  // Keep function shape consistent for V8 optimizations
  'use strict';
  
  // Avoid changing object shapes
  const result = {
    processed: 0,
    errors: 0,
    data: null
  };
  
  // Use consistent types
  if (typeof data !== 'object' || data === null) {
    result.errors = 1;
    return result;
  }
  
  // Monomorphic function calls
  result.data = processData(data);
  result.processed = 1;
  
  return result;
}

// Efficient array processing
function processLargeDataset(items) {
  // Use typed arrays for numeric data
  const results = new Float64Array(items.length);
  
  // Avoid array methods that create intermediate arrays
  for (let i = 0; i < items.length; i++) {
    results[i] = Math.sqrt(items[i]) * 1.5;
  }
  
  return results;
}

// Streaming JSON parsing for large payloads
const StreamingJsonParser = require('stream-json');
const StreamArray = require('stream-json/streamers/StreamArray');

function processLargeJson(jsonStream) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    jsonStream
      .pipe(StreamingJsonParser.parser())
      .pipe(StreamArray.streamArray())
      .on('data', ({ value }) => {
        // Process each item as it's parsed
        const processed = processItem(value);
        if (processed) results.push(processed);
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}
```

### Database Query Optimization

```javascript
// Connection pool optimization
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Optimize pool settings
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  // Enable prepared statements
  namedPlaceholders: true
});

// Query optimization with prepared statements
class DatabaseManager {
  constructor(pool) {
    this.pool = pool;
    this.preparedStatements = new Map();
  }
  
  async prepareStatement(key, sql) {
    if (!this.preparedStatements.has(key)) {
      const connection = await this.pool.getConnection();
      const statement = await connection.prepare(sql);
      this.preparedStatements.set(key, statement);
      connection.release();
    }
    return this.preparedStatements.get(key);
  }
  
  async executeOptimized(key, sql, params = []) {
    const statement = await this.prepareStatement(key, sql);
    const [rows] = await statement.execute(params);
    return rows;
  }
  
  // Batch operations
  async batchInsert(table, records) {
    if (records.length === 0) return;
    
    const keys = Object.keys(records[0]);
    const placeholders = keys.map(() => '?').join(',');
    const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES ${
      records.map(() => `(${placeholders})`).join(',')
    }`;
    
    const values = records.flatMap(record => keys.map(key => record[key]));
    const [result] = await this.pool.execute(sql, values);
    return result;
  }
  
  // Query result caching
  async getCachedQuery(cacheKey, sql, params, ttl = 300000) {
    const cached = await this.cache.get(cacheKey);
    if (cached) return JSON.parse(cached);
    
    const results = await this.executeOptimized(cacheKey, sql, params);
    await this.cache.setex(cacheKey, ttl / 1000, JSON.stringify(results));
    return results;
  }
}

// Aggregate queries for efficiency
async function getDashboardData(userId) {
  const sql = `
    SELECT 
      u.name, u.email,
      COUNT(DISTINCT p.id) as project_count,
      COUNT(DISTINCT t.id) as task_count,
      COALESCE(AVG(t.priority), 0) as avg_priority
    FROM users u
    LEFT JOIN projects p ON u.id = p.user_id
    LEFT JOIN tasks t ON p.id = t.project_id
    WHERE u.id = ?
    GROUP BY u.id, u.name, u.email
  `;
  
  return await db.executeOptimized('dashboard', sql, [userId]);
}
```

### Caching Strategies

```javascript
// Multi-layer caching system
const Redis = require('redis');
const LRU = require('lru-cache');

class AdvancedCache {
  constructor() {
    // L1: In-memory cache (fastest)
    this.memoryCache = new LRU({
      max: 500,
      ttl: 1000 * 60 * 5 // 5 minutes
    });
    
    // L2: Redis cache (shared across instances)
    this.redisClient = Redis.createClient({
      host: process.env.REDIS_HOST,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    });
  }
  
  async get(key) {
    // Try L1 cache first
    let value = this.memoryCache.get(key);
    if (value !== undefined) {
      return value;
    }
    
    // Try L2 cache
    try {
      const redisValue = await this.redisClient.get(key);
      if (redisValue) {
        value = JSON.parse(redisValue);
        // Populate L1 cache
        this.memoryCache.set(key, value);
        return value;
      }
    } catch (error) {
      console.warn('Redis cache error:', error);
    }
    
    return null;
  }
  
  async set(key, value, ttl = 300) {
    // Set in L1
    this.memoryCache.set(key, value);
    
    // Set in L2
    try {
      await this.redisClient.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.warn('Redis set error:', error);
    }
  }
  
  // Smart invalidation
  async invalidatePattern(pattern) {
    // Clear from memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
      }
    }
    
    // Clear from Redis
    try {
      const keys = await this.redisClient.keys(`*${pattern}*`);
      if (keys.length > 0) {
        await this.redisClient.del(keys);
      }
    } catch (error) {
      console.warn('Redis invalidation error:', error);
    }
  }
}

// HTTP caching middleware
function createCacheMiddleware(cache) {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next();
    
    const cacheKey = `${req.path}:${JSON.stringify(req.query)}`;
    const etag = req.get('If-None-Match');
    
    try {
      const cached = await cache.get(cacheKey);
      if (cached) {
        if (etag === cached.etag) {
          return res.status(304).send();
        }
        
        res.set('ETag', cached.etag);
        res.set('Cache-Control', 'public, max-age=300');
        return res.json(cached.data);
      }
      
      // Store reference to original send
      const originalSend = res.json;
      res.json = function(data) {
        const newEtag = `"${Date.now()}-${Buffer.from(JSON.stringify(data)).toString('base64').slice(0, 16)}"`;
        
        // Cache the response
        cache.set(cacheKey, { data, etag: newEtag }, 300);
        
        res.set('ETag', newEtag);
        res.set('Cache-Control', 'public, max-age=300');
        return originalSend.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
}
```

## API Performance Optimization

### Request/Response Optimization

```javascript
// Efficient data serialization
const { Transform } = require('stream');
const zlib = require('zlib');

class JSONStream extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true });
    this.first = true;
  }
  
  _transform(chunk, encoding, callback) {
    const prefix = this.first ? '[' : ',';
    this.first = false;
    callback(null, prefix + JSON.stringify(chunk));
  }
  
  _flush(callback) {
    callback(null, this.first ? '[]' : ']');
  }
}

// Streaming API responses
app.get('/api/large-dataset', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Encoding': 'gzip',
    'Transfer-Encoding': 'chunked'
  });
  
  const jsonStream = new JSONStream();
  const gzipStream = zlib.createGzip();
  
  // Stream data directly from database
  const query = db.query('SELECT * FROM large_table');
  
  query
    .pipe(jsonStream)
    .pipe(gzipStream)
    .pipe(res);
});

// Request deduplication
class RequestDeduplicator {
  constructor() {
    this.pendingRequests = new Map();
  }
  
  async deduplicate(key, requestFn) {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }
    
    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key);
    });
    
    this.pendingRequests.set(key, promise);
    return promise;
  }
}

const deduplicator = new RequestDeduplicator();

app.get('/api/user/:id', async (req, res) => {
  const userId = req.params.id;
  const cacheKey = `user:${userId}`;
  
  try {
    const user = await deduplicator.deduplicate(cacheKey, async () => {
      return await db.getUserById(userId);
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Connection and Resource Management

```javascript
// HTTP/2 server with performance optimizations
const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  // Performance settings
  settings: {
    headerTableSize: 4096,
    enablePush: true,
    maxConcurrentStreams: 100,
    initialWindowSize: 65535,
    maxFrameSize: 16383,
    maxHeaderListSize: 8192
  }
});

// Connection pooling for external APIs
const https = require('https');

const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 60000
});

class APIClient {
  constructor() {
    this.agent = httpsAgent;
    this.circuitBreaker = new CircuitBreaker();
  }
  
  async makeRequest(url, options = {}) {
    return this.circuitBreaker.execute(async () => {
      const response = await fetch(url, {
        ...options,
        agent: this.agent
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    });
  }
}

// Circuit breaker pattern
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.recoveryTimeout = options.recoveryTimeout || 30000;
    this.monitoringPeriod = options.monitoringPeriod || 60000;
    
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failures = 0;
    this.lastFailureTime = 0;
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.recoveryTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}
```

## Monitoring and Profiling

### Performance Metrics Collection

```javascript
// Custom performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.startTimes = new Map();
  }
  
  start(operationId) {
    this.startTimes.set(operationId, performance.now());
  }
  
  end(operationId, metadata = {}) {
    const startTime = this.startTimes.get(operationId);
    if (!startTime) return;
    
    const duration = performance.now() - startTime;
    this.recordMetric(operationId, duration, metadata);
    this.startTimes.delete(operationId);
  }
  
  recordMetric(operation, duration, metadata) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, {
        count: 0,
        totalTime: 0,
        minTime: Infinity,
        maxTime: 0,
        samples: []
      });
    }
    
    const metric = this.metrics.get(operation);
    metric.count++;
    metric.totalTime += duration;
    metric.minTime = Math.min(metric.minTime, duration);
    metric.maxTime = Math.max(metric.maxTime, duration);
    
    // Keep last 100 samples for percentile calculations
    metric.samples.push({ duration, timestamp: Date.now(), ...metadata });
    if (metric.samples.length > 100) {
      metric.samples.shift();
    }
  }
  
  getStats(operation) {
    const metric = this.metrics.get(operation);
    if (!metric) return null;
    
    const sortedSamples = [...metric.samples].sort((a, b) => a.duration - b.duration);
    const p95Index = Math.floor(sortedSamples.length * 0.95);
    const p99Index = Math.floor(sortedSamples.length * 0.99);
    
    return {
      count: metric.count,
      averageTime: metric.totalTime / metric.count,
      minTime: metric.minTime,
      maxTime: metric.maxTime,
      p95Time: sortedSamples[p95Index]?.duration || 0,
      p99Time: sortedSamples[p99Index]?.duration || 0
    };
  }
  
  // Express middleware
  middleware() {
    return (req, res, next) => {
      const operationId = `${req.method}:${req.path}`;
      this.start(operationId);
      
      const originalSend = res.send;
      res.send = function(data) {
        monitor.end(operationId, {
          statusCode: res.statusCode,
          userAgent: req.get('User-Agent'),
          responseSize: Buffer.isBuffer(data) ? data.length : JSON.stringify(data).length
        });
        return originalSend.call(this, data);
      };
      
      next();
    };
  }
}

// Real-time performance dashboard
const monitor = new PerformanceMonitor();

app.get('/api/performance-stats', (req, res) => {
  const stats = {};
  for (const [operation, _] of monitor.metrics) {
    stats[operation] = monitor.getStats(operation);
  }
  res.json(stats);
});

// Memory usage monitoring
function monitorMemoryUsage() {
  const usage = process.memoryUsage();
  const formatMB = (bytes) => Math.round(bytes / 1024 / 1024 * 100) / 100;
  
  console.log({
    rss: `${formatMB(usage.rss)} MB`,
    heapTotal: `${formatMB(usage.heapTotal)} MB`,
    heapUsed: `${formatMB(usage.heapUsed)} MB`,
    external: `${formatMB(usage.external)} MB`,
    heapUtilization: `${Math.round((usage.heapUsed / usage.heapTotal) * 100)}%`
  });
  
  // Alert if memory usage is high
  if (usage.heapUsed / usage.heapTotal > 0.9) {
    console.warn('High memory usage detected!');
    // Trigger garbage collection if needed
    if (global.gc) global.gc();
  }
}

setInterval(monitorMemoryUsage, 30000); // Monitor every 30 seconds
```

## Advanced Optimization Techniques

### Worker Threads for CPU-Intensive Tasks

```javascript
// Main thread - worker-manager.js
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const os = require('os');

class WorkerPool {
  constructor(workerFile, poolSize = os.cpus().length) {
    this.workerFile = workerFile;
    this.poolSize = poolSize;
    this.workers = [];
    this.queue = [];
    this.workerIndex = 0;
    
    this.initializeWorkers();
  }
  
  initializeWorkers() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerFile);
      worker.busy = false;
      worker.id = i;
      
      worker.on('message', (result) => {
        worker.busy = false;
        if (worker.currentResolve) {
          worker.currentResolve(result);
          delete worker.currentResolve;
          delete worker.currentReject;
        }
        this.processQueue();
      });
      
      worker.on('error', (error) => {
        worker.busy = false;
        if (worker.currentReject) {
          worker.currentReject(error);
          delete worker.currentResolve;
          delete worker.currentReject;
        }
        this.processQueue();
      });
      
      this.workers.push(worker);
    }
  }
  
  execute(data) {
    return new Promise((resolve, reject) => {
      this.queue.push({ data, resolve, reject });
      this.processQueue();
    });
  }
  
  processQueue() {
    if (this.queue.length === 0) return;
    
    const availableWorker = this.workers.find(w => !w.busy);
    if (!availableWorker) return;
    
    const { data, resolve, reject } = this.queue.shift();
    availableWorker.busy = true;
    availableWorker.currentResolve = resolve;
    availableWorker.currentReject = reject;
    availableWorker.postMessage(data);
  }
  
  terminate() {
    return Promise.all(this.workers.map(worker => worker.terminate()));
  }
}

// Worker file - cpu-intensive-worker.js
const { parentPort } = require('worker_threads');

function processImageData(imageData) {
  // CPU-intensive image processing
  const processed = new Uint8Array(imageData.length);
  
  for (let i = 0; i < imageData.length; i += 4) {
    // Apply complex filters
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    const a = imageData[i + 3];
    
    // Complex color transformation
    processed[i] = Math.min(255, r * 1.2);     // Red
    processed[i + 1] = Math.min(255, g * 0.8); // Green  
    processed[i + 2] = Math.min(255, b * 1.1); // Blue
    processed[i + 3] = a;                       // Alpha
  }
  
  return processed;
}

parentPort.on('message', (data) => {
  try {
    const result = processImageData(data.imageData);
    parentPort.postMessage({ success: true, result });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
});

// Usage in Express app
const workerPool = new WorkerPool('./cpu-intensive-worker.js', 4);

app.post('/api/process-image', async (req, res) => {
  try {
    const result = await workerPool.execute({
      imageData: req.body.imageData
    });
    
    if (result.success) {
      res.json({ processedImage: result.result });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Cluster Mode for Scaling

```javascript
// cluster-manager.js
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // Handle worker deaths
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Starting a new worker');
    cluster.fork();
  });
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Master received SIGTERM, shutting down gracefully');
    
    for (const id in cluster.workers) {
      cluster.workers[id].disconnect();
      
      setTimeout(() => {
        if (!cluster.workers[id].isDead()) {
          cluster.workers[id].kill();
        }
      }, 5000);
    }
    
    setTimeout(() => {
      process.exit(0);
    }, 10000);
  });
  
} else {
  // Worker process
  require('./app.js');
  console.log(`Worker ${process.pid} started`);
}
```

## Performance Testing and Benchmarking

```javascript
// Comprehensive benchmark suite
const { performance } = require('perf_hooks');

class BenchmarkSuite {
  constructor() {
    this.tests = [];
    this.results = [];
  }
  
  add(name, fn, options = {}) {
    this.tests.push({ name, fn, options });
    return this;
  }
  
  async run(iterations = 1000) {
    console.log(`Running benchmark suite with ${iterations} iterations...\n`);
    
    for (const test of this.tests) {
      const times = [];
      
      // Warmup
      for (let i = 0; i < 100; i++) {
        await test.fn();
      }
      
      // Actual benchmark
      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        await test.fn();
        const end = performance.now();
        times.push(end - start);
      }
      
      times.sort((a, b) => a - b);
      const min = times[0];
      const max = times[times.length - 1];
      const mean = times.reduce((a, b) => a + b) / times.length;
      const median = times[Math.floor(times.length / 2)];
      const p95 = times[Math.floor(times.length * 0.95)];
      const p99 = times[Math.floor(times.length * 0.99)];
      
      const result = {
        name: test.name,
        iterations,
        min: parseFloat(min.toFixed(3)),
        max: parseFloat(max.toFixed(3)),
        mean: parseFloat(mean.toFixed(3)),
        median: parseFloat(median.toFixed(3)),
        p95: parseFloat(p95.toFixed(3)),
        p99: parseFloat(p99.toFixed(3)),
        opsPerSec: Math.round(1000 / mean)
      };
      
      this.results.push(result);
      this.printResult(result);
    }
    
    return this.results;
  }
  
  printResult(result) {
    console.log(`${result.name}:`);
    console.log(`  Min: ${result.min}ms`);
    console.log(`  Max: ${result.max}ms`);
    console.log(`  Mean: ${result.mean}ms`);
    console.log(`  Median: ${result.median}ms`);
    console.log(`  95th percentile: ${result.p95}ms`);
    console.log(`  99th percentile: ${result.p99}ms`);
    console.log(`  Operations/second: ${result.opsPerSec}`);
    console.log('');
  }
}

// Example benchmark usage
const suite = new BenchmarkSuite();

suite
  .add('Array.map vs for loop', () => {
    const arr = Array.from({ length: 1000 }, (_, i) => i);
    return arr.map(x => x * 2);
  })
  .add('For loop version', () => {
    const arr = Array.from({ length: 1000 }, (_, i) => i);
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(arr[i] * 2);
    }
    return result;
  })
  .add('JSON.parse vs eval', () => {
    return JSON.parse('{"foo": "bar", "baz": [1, 2, 3]}');
  });

// Run benchmarks
suite.run(10000).then(results => {
  console.log('Benchmark completed!');
});
```

## Conclusion

Full-stack JavaScript performance optimization requires a systematic approach that addresses every layer of your application. By implementing these strategies, you can achieve significant performance improvements:

**Key Performance Principles:**
- **Measure First**: Always profile before optimizing
- **Optimize Bottlenecks**: Focus on the slowest parts first
- **Cache Strategically**: Implement multi-layer caching
- **Resource Management**: Pool connections and manage memory
- **Async Processing**: Use workers for CPU-intensive tasks
- **Monitor Continuously**: Track performance in production

**Performance Impact:**
- Bundle optimization can reduce initial load times by 40-60%
- Efficient caching can improve API response times by 80-90%
- Database query optimization can reduce response times by 70-85%
- Worker threads can improve CPU-intensive task performance by 200-400%

Remember, performance is not a one-time task but an ongoing process. Continuous monitoring, testing, and optimization ensure your JavaScript applications remain fast and responsive as they scale.

The key is to start with measurement, optimize systematically, and always validate your improvements with real-world testing. Happy optimizing!