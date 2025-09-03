---
title: 'Progressive Web Apps: Building App-Like Experiences on the Web'
date: '2024-04-25'
description: 'Complete guide to building Progressive Web Apps with service workers, offline functionality, push notifications, and app-like features that bridge web and native experiences.'
category: 'dev'
tags: ['pwa', 'service-worker', 'offline', 'web', 'mobile', 'performance']
author: 'Allie'
published: false
featured: true
featured_image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=600&fit=crop'
reading_time: '16 min'
slug: 'progressive-web-apps-guide'
---

# Progressive Web Apps: Building App-Like Experiences on the Web

Progressive Web Apps (PWAs) combine the reach of the web with the user experience of native apps. Let's explore how to build PWAs that work offline, feel native, and provide engaging user experiences across all devices.

## PWA Fundamentals

### Web App Manifest

```json
{
  "name": "MyAwesome PWA",
  "short_name": "MyPWA",
  "description": "An awesome Progressive Web App that works everywhere",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#2563eb",
  "background_color": "#ffffff",
  "categories": ["productivity", "utilities"],
  "lang": "en",
  "dir": "ltr",

  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],

  "shortcuts": [
    {
      "name": "Create New",
      "short_name": "New",
      "description": "Create a new item",
      "url": "/create",
      "icons": [
        {
          "src": "/icons/shortcut-new.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Search",
      "short_name": "Search",
      "description": "Search through items",
      "url": "/search",
      "icons": [
        {
          "src": "/icons/shortcut-search.png",
          "sizes": "96x96"
        }
      ]
    }
  ],

  "screenshots": [
    {
      "src": "/screenshots/desktop-1.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Main dashboard view"
    },
    {
      "src": "/screenshots/mobile-1.png",
      "sizes": "640x1136",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Mobile dashboard view"
    }
  ],

  "related_applications": [],
  "prefer_related_applications": false,

  "protocol_handlers": [
    {
      "protocol": "web+myapp",
      "url": "/handle?url=%s"
    }
  ],

  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url",
      "files": [
        {
          "name": "file",
          "accept": ["image/*", "text/plain"]
        }
      ]
    }
  }
}
```

### Service Worker Registration

```javascript
// main.js - Service worker registration
class PWAManager {
  constructor() {
    this.swRegistration = null
    this.isOnline = navigator.onLine
    this.setupEventListeners()
    this.registerServiceWorker()
    this.setupInstallPrompt()
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        console.log('Service Worker registered:', this.swRegistration)

        // Handle updates
        this.swRegistration.addEventListener('updatefound', () => {
          const newWorker = this.swRegistration.installing

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              this.showUpdateNotification()
            }
          })
        })

        // Check for updates every hour
        setInterval(
          () => {
            this.swRegistration.update()
          },
          60 * 60 * 1000
        )
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }
  }

  setupEventListeners() {
    // Online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true
      this.showConnectionStatus('online')
      this.syncWhenOnline()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.showConnectionStatus('offline')
    })

    // Handle service worker messages
    navigator.serviceWorker?.addEventListener('message', event => {
      const { type, data } = event.data

      switch (type) {
        case 'CACHE_UPDATED':
          this.showCacheUpdateNotification(data.url)
          break

        case 'SYNC_SUCCESS':
          this.showSyncNotification('Data synced successfully')
          break

        case 'SYNC_FAILED':
          this.showSyncNotification('Sync failed - will retry when online', 'error')
          break
      }
    })
  }

  setupInstallPrompt() {
    let deferredPrompt = null

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault()
      deferredPrompt = e
      this.showInstallButton()
    })

    // Handle install button click
    document.addEventListener('click', async e => {
      if (e.target.matches('.install-pwa-btn')) {
        if (deferredPrompt) {
          deferredPrompt.prompt()
          const { outcome } = await deferredPrompt.userChoice

          console.log('Install prompt result:', outcome)

          if (outcome === 'accepted') {
            this.hideInstallButton()
          }

          deferredPrompt = null
        }
      }
    })

    // Track installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed')
      this.hideInstallButton()
      this.trackEvent('pwa_installed')
    })
  }

  showInstallButton() {
    const installBtn = document.querySelector('.install-pwa-btn')
    if (installBtn) {
      installBtn.style.display = 'block'
    }
  }

  hideInstallButton() {
    const installBtn = document.querySelector('.install-pwa-btn')
    if (installBtn) {
      installBtn.style.display = 'none'
    }
  }

  showUpdateNotification() {
    const notification = this.createNotification(
      'App Update Available',
      'A new version is available. Refresh to update.',
      [
        {
          text: 'Update',
          action: () => this.updateApp(),
        },
        {
          text: 'Later',
          action: () => this.hideNotification(),
        },
      ]
    )

    document.body.appendChild(notification)
  }

  updateApp() {
    if (this.swRegistration?.waiting) {
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  showConnectionStatus(status) {
    const statusElement = document.querySelector('.connection-status')
    if (statusElement) {
      statusElement.textContent = status === 'online' ? 'Online' : 'Offline'
      statusElement.className = `connection-status ${status}`

      // Auto-hide online status after 3 seconds
      if (status === 'online') {
        setTimeout(() => {
          statusElement.style.display = 'none'
        }, 3000)
      } else {
        statusElement.style.display = 'block'
      }
    }
  }

  async syncWhenOnline() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        await this.swRegistration.sync.register('background-sync')
      } catch (error) {
        console.error('Background sync registration failed:', error)
      }
    }
  }

  createNotification(title, message, actions = []) {
    const notification = document.createElement('div')
    notification.className = 'pwa-notification'

    notification.innerHTML = `
      <div class="notification-content">
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="notification-actions">
          ${actions
            .map(
              action =>
                `<button class="notification-btn" data-action="${action.text.toLowerCase()}">${action.text}</button>`
            )
            .join('')}
        </div>
      </div>
    `

    // Handle action clicks
    actions.forEach(action => {
      const btn = notification.querySelector(`[data-action="${action.text.toLowerCase()}"]`)
      btn?.addEventListener('click', () => {
        action.action()
        notification.remove()
      })
    })

    return notification
  }

  trackEvent(eventName, data = {}) {
    // Analytics tracking for PWA events
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data)
    }
  }
}

// Initialize PWA manager
document.addEventListener('DOMContentLoaded', () => {
  new PWAManager()
})
```

## Service Worker Implementation

### Advanced Service Worker

```javascript
// sw.js - Service Worker with advanced caching strategies
const CACHE_VERSION = 'v1.2.0'
const CACHE_NAMES = {
  static: `static-${CACHE_VERSION}`,
  dynamic: `dynamic-${CACHE_VERSION}`,
  images: `images-${CACHE_VERSION}`,
  api: `api-${CACHE_VERSION}`,
}

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/css/style.css',
  '/js/main.js',
  '/js/app.js',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

const API_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const IMAGE_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

class ServiceWorkerManager {
  constructor() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    self.addEventListener('install', this.handleInstall.bind(this))
    self.addEventListener('activate', this.handleActivate.bind(this))
    self.addEventListener('fetch', this.handleFetch.bind(this))
    self.addEventListener('sync', this.handleBackgroundSync.bind(this))
    self.addEventListener('push', this.handlePush.bind(this))
    self.addEventListener('notificationclick', this.handleNotificationClick.bind(this))
    self.addEventListener('message', this.handleMessage.bind(this))
  }

  async handleInstall(event) {
    console.log('Service Worker installing...')

    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE_NAMES.static)
        await cache.addAll(STATIC_ASSETS)

        // Skip waiting to activate immediately
        await self.skipWaiting()
      })()
    )
  }

  async handleActivate(event) {
    console.log('Service Worker activating...')

    event.waitUntil(
      (async () => {
        // Clean up old caches
        const cacheNames = await caches.keys()
        const deletePromises = cacheNames
          .filter(name => !Object.values(CACHE_NAMES).includes(name))
          .map(name => caches.delete(name))

        await Promise.all(deletePromises)

        // Claim all clients immediately
        await self.clients.claim()

        console.log('Service Worker activated')
      })()
    )
  }

  handleFetch(event) {
    const { request } = event
    const url = new URL(request.url)

    // Handle different types of requests
    if (this.isAPIRequest(url)) {
      event.respondWith(this.handleAPIRequest(request))
    } else if (this.isImageRequest(request)) {
      event.respondWith(this.handleImageRequest(request))
    } else if (this.isStaticAsset(url)) {
      event.respondWith(this.handleStaticAsset(request))
    } else {
      event.respondWith(this.handlePageRequest(request))
    }
  }

  isAPIRequest(url) {
    return url.pathname.startsWith('/api/')
  }

  isImageRequest(request) {
    return request.destination === 'image'
  }

  isStaticAsset(url) {
    return (
      url.pathname.includes('.css') ||
      url.pathname.includes('.js') ||
      url.pathname.includes('.woff') ||
      url.pathname.includes('/icons/')
    )
  }

  // Cache First strategy for static assets
  async handleStaticAsset(request) {
    const cache = await caches.open(CACHE_NAMES.static)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    try {
      const networkResponse = await fetch(request)
      if (networkResponse.status === 200) {
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    } catch (error) {
      console.error('Failed to fetch static asset:', error)
      return new Response('Asset not available offline', { status: 503 })
    }
  }

  // Stale While Revalidate for API requests
  async handleAPIRequest(request) {
    const cache = await caches.open(CACHE_NAMES.api)
    const cachedResponse = await cache.match(request)

    const fetchPromise = fetch(request)
      .then(response => {
        if (response.status === 200) {
          cache.put(request, response.clone())

          // Notify clients about cache update
          this.notifyClients('CACHE_UPDATED', { url: request.url })
        }
        return response
      })
      .catch(error => {
        console.error('API request failed:', error)
        throw error
      })

    // Return cached response immediately if available
    if (cachedResponse) {
      // Check if cache is stale
      const cacheDate = new Date(cachedResponse.headers.get('date'))
      const isStale = Date.now() - cacheDate.getTime() > API_CACHE_DURATION

      if (!isStale) {
        fetchPromise.catch(() => {}) // Ignore errors for background updates
        return cachedResponse
      }
    }

    try {
      return await fetchPromise
    } catch (error) {
      if (cachedResponse) {
        return cachedResponse
      }
      return new Response(
        JSON.stringify({
          error: 'Data not available offline',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  }

  // Cache First with network fallback for images
  async handleImageRequest(request) {
    const cache = await caches.open(CACHE_NAMES.images)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    try {
      const networkResponse = await fetch(request)
      if (networkResponse.status === 200) {
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    } catch (error) {
      // Return placeholder image for offline scenarios
      return caches.match('/icons/placeholder-image.png')
    }
  }

  // Network First with cache fallback for pages
  async handlePageRequest(request) {
    // Don't cache POST requests
    if (request.method !== 'GET') {
      return fetch(request)
    }

    try {
      const networkResponse = await fetch(request)

      if (networkResponse.status === 200) {
        const cache = await caches.open(CACHE_NAMES.dynamic)
        cache.put(request, networkResponse.clone())
      }

      return networkResponse
    } catch (error) {
      // Try to serve from cache
      const cachedResponse = await caches.match(request)
      if (cachedResponse) {
        return cachedResponse
      }

      // Show offline page for navigation requests
      if (request.mode === 'navigate') {
        return caches.match('/offline.html')
      }

      return new Response('Page not available offline', { status: 503 })
    }
  }

  async handleBackgroundSync(event) {
    if (event.tag === 'background-sync') {
      event.waitUntil(this.performBackgroundSync())
    }
  }

  async performBackgroundSync() {
    try {
      // Get pending sync data from IndexedDB
      const pendingData = await this.getPendingSyncData()

      for (const item of pendingData) {
        try {
          await this.syncDataItem(item)
          await this.removePendingSyncData(item.id)
        } catch (error) {
          console.error('Failed to sync item:', error)
        }
      }

      this.notifyClients('SYNC_SUCCESS')
    } catch (error) {
      console.error('Background sync failed:', error)
      this.notifyClients('SYNC_FAILED', { error: error.message })
    }
  }

  async handlePush(event) {
    const options = {
      body: 'You have a new notification',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: 'notification',
      requireInteraction: false,
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/icons/action-view.png',
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/action-dismiss.png',
        },
      ],
      data: {
        url: '/',
        timestamp: Date.now(),
      },
    }

    if (event.data) {
      try {
        const payload = event.data.json()
        Object.assign(options, payload)
      } catch (error) {
        console.error('Failed to parse push payload:', error)
      }
    }

    event.waitUntil(self.registration.showNotification(options.title || 'New Message', options))
  }

  handleNotificationClick(event) {
    event.notification.close()

    const { action, data } = event
    const url = data?.url || '/'

    event.waitUntil(
      (async () => {
        // Get all window clients
        const clients = await self.clients.matchAll({ type: 'window' })

        // Try to focus existing window
        for (const client of clients) {
          if (client.url === url && 'focus' in client) {
            return client.focus()
          }
        }

        // Open new window if none found
        if (self.clients.openWindow) {
          return self.clients.openWindow(url)
        }
      })()
    )
  }

  handleMessage(event) {
    const { type, data } = event.data

    switch (type) {
      case 'SKIP_WAITING':
        self.skipWaiting()
        break

      case 'GET_VERSION':
        event.ports[0].postMessage({ version: CACHE_VERSION })
        break

      case 'CLEAR_CACHE':
        this.clearCache(data.cacheName)
        break
    }
  }

  notifyClients(type, data = {}) {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ type, data })
      })
    })
  }

  // IndexedDB helpers for background sync
  async getPendingSyncData() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PWASync', 1)

      request.onerror = () => reject(request.error)

      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['pending'], 'readonly')
        const store = transaction.objectStore('pending')
        const getAllRequest = store.getAll()

        getAllRequest.onsuccess = () => resolve(getAllRequest.result)
        getAllRequest.onerror = () => reject(getAllRequest.error)
      }
    })
  }

  async syncDataItem(item) {
    const response = await fetch(item.url, {
      method: item.method,
      headers: item.headers,
      body: item.body,
    })

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`)
    }

    return response.json()
  }

  async removePendingSyncData(id) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PWASync', 1)

      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['pending'], 'readwrite')
        const store = transaction.objectStore('pending')
        const deleteRequest = store.delete(id)

        deleteRequest.onsuccess = () => resolve()
        deleteRequest.onerror = () => reject(deleteRequest.error)
      }
    })
  }

  async clearCache(cacheName) {
    if (cacheName) {
      await caches.delete(cacheName)
    } else {
      // Clear all caches
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
    }
  }
}

// Initialize service worker
new ServiceWorkerManager()
```

## Offline Functionality

### Offline Data Management

```javascript
// offline-manager.js - Handle offline data storage and sync
class OfflineDataManager {
  constructor() {
    this.db = null
    this.syncQueue = []
    this.isOnline = navigator.onLine
    this.initDatabase()
    this.setupEventListeners()
  }

  async initDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PWAOfflineData', 2)

      request.onerror = () => reject(request.error)

      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = event => {
        const db = event.target.result

        // Create object stores
        if (!db.objectStoreNames.contains('posts')) {
          const postsStore = db.createObjectStore('posts', { keyPath: 'id' })
          postsStore.createIndex('timestamp', 'timestamp', { unique: false })
          postsStore.createIndex('status', 'status', { unique: false })
        }

        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', {
            keyPath: 'id',
            autoIncrement: true,
          })
          syncStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' })
        }
      }
    })
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.processSyncQueue()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  // CRUD operations with offline support
  async savePost(post) {
    const postWithMeta = {
      ...post,
      id: post.id || this.generateId(),
      timestamp: Date.now(),
      status: this.isOnline ? 'synced' : 'pending',
    }

    // Save to IndexedDB
    await this.storeData('posts', postWithMeta)

    // If online, sync immediately
    if (this.isOnline) {
      try {
        await this.syncPost(postWithMeta)
        postWithMeta.status = 'synced'
        await this.storeData('posts', postWithMeta)
      } catch (error) {
        console.error('Failed to sync post:', error)
        await this.addToSyncQueue('POST', '/api/posts', postWithMeta)
      }
    } else {
      // Add to sync queue for later
      await this.addToSyncQueue('POST', '/api/posts', postWithMeta)
    }

    return postWithMeta
  }

  async getPosts(options = {}) {
    const { limit = 20, offset = 0, status } = options

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['posts'], 'readonly')
      const store = transaction.objectStore('posts')
      const index = store.index('timestamp')

      const request = index.openCursor(null, 'prev') // Newest first
      const results = []
      let count = 0
      let skipped = 0

      request.onsuccess = event => {
        const cursor = event.target.result

        if (!cursor || results.length >= limit) {
          resolve(results)
          return
        }

        const post = cursor.value

        // Filter by status if specified
        if (status && post.status !== status) {
          cursor.continue()
          return
        }

        // Skip offset items
        if (skipped < offset) {
          skipped++
          cursor.continue()
          return
        }

        results.push(post)
        cursor.continue()
      }

      request.onerror = () => reject(request.error)
    })
  }

  async updatePost(id, updates) {
    const existingPost = await this.getPost(id)
    if (!existingPost) {
      throw new Error('Post not found')
    }

    const updatedPost = {
      ...existingPost,
      ...updates,
      timestamp: Date.now(),
      status: this.isOnline ? 'synced' : 'pending',
    }

    await this.storeData('posts', updatedPost)

    if (this.isOnline) {
      try {
        await this.syncPost(updatedPost, 'PUT')
        updatedPost.status = 'synced'
        await this.storeData('posts', updatedPost)
      } catch (error) {
        await this.addToSyncQueue('PUT', `/api/posts/${id}`, updatedPost)
      }
    } else {
      await this.addToSyncQueue('PUT', `/api/posts/${id}`, updatedPost)
    }

    return updatedPost
  }

  async deletePost(id) {
    // Mark as deleted instead of removing
    const post = await this.getPost(id)
    if (post) {
      post.status = 'deleted'
      post.timestamp = Date.now()
      await this.storeData('posts', post)

      if (this.isOnline) {
        try {
          await fetch(`/api/posts/${id}`, { method: 'DELETE' })
          await this.removeData('posts', id)
        } catch (error) {
          await this.addToSyncQueue('DELETE', `/api/posts/${id}`, { id })
        }
      } else {
        await this.addToSyncQueue('DELETE', `/api/posts/${id}`, { id })
      }
    }
  }

  async getPost(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['posts'], 'readonly')
      const store = transaction.objectStore('posts')
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Sync queue management
  async addToSyncQueue(method, url, data) {
    const syncItem = {
      method,
      url,
      data,
      timestamp: Date.now(),
      retries: 0,
    }

    return this.storeData('syncQueue', syncItem)
  }

  async processSyncQueue() {
    const syncItems = await this.getSyncQueue()

    for (const item of syncItems) {
      try {
        await this.syncItem(item)
        await this.removeData('syncQueue', item.id)

        // Update original data status
        if (item.data.id) {
          const originalData = await this.getPost(item.data.id)
          if (originalData) {
            originalData.status = 'synced'
            await this.storeData('posts', originalData)
          }
        }
      } catch (error) {
        console.error('Sync failed for item:', item, error)

        // Increment retry count
        item.retries = (item.retries || 0) + 1

        // Remove from queue if max retries reached
        if (item.retries >= 3) {
          await this.removeData('syncQueue', item.id)
          this.handleSyncFailure(item)
        } else {
          await this.storeData('syncQueue', item)
        }
      }
    }
  }

  async getSyncQueue() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['syncQueue'], 'readonly')
      const store = transaction.objectStore('syncQueue')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async syncItem(item) {
    const options = {
      method: item.method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (item.method !== 'DELETE' && item.data) {
      options.body = JSON.stringify(item.data)
    }

    const response = await fetch(item.url, options)

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`)
    }

    return response.json()
  }

  async syncPost(post, method = 'POST') {
    const url = method === 'POST' ? '/api/posts' : `/api/posts/${post.id}`

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })

    if (!response.ok) {
      throw new Error(`Failed to sync post: ${response.status}`)
    }

    return response.json()
  }

  handleSyncFailure(item) {
    // Notify user of sync failure
    this.showNotification(
      'Sync Failed',
      `Failed to sync ${item.method} ${item.url} after 3 attempts`
    )
  }

  // Database helpers
  async storeData(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async removeData(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  showNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/icons/icon-192x192.png',
      })
    }
  }

  // Export/Import data for debugging
  async exportData() {
    const posts = await this.getPosts({ limit: 1000 })
    const syncQueue = await this.getSyncQueue()

    return {
      posts,
      syncQueue,
      exportedAt: new Date().toISOString(),
    }
  }

  async importData(data) {
    if (data.posts) {
      for (const post of data.posts) {
        await this.storeData('posts', post)
      }
    }
  }

  async clearAllData() {
    const stores = ['posts', 'syncQueue', 'settings']

    for (const storeName of stores) {
      const transaction = this.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      await store.clear()
    }
  }
}

// Initialize offline manager
window.offlineManager = new OfflineDataManager()
```

## Push Notifications

### Push Notification System

```javascript
// push-manager.js - Handle push notifications
class PushNotificationManager {
  constructor() {
    this.swRegistration = null
    this.subscription = null
    this.vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY'
    this.init()
  }

  async init() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      this.swRegistration = await navigator.serviceWorker.ready
      await this.checkExistingSubscription()
    }
  }

  async checkExistingSubscription() {
    try {
      this.subscription = await this.swRegistration.pushManager.getSubscription()
      if (this.subscription) {
        console.log('Existing push subscription found')
        this.updateUI(true)
      }
    } catch (error) {
      console.error('Error checking push subscription:', error)
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported')
      return false
    }

    let permission = Notification.permission

    if (permission === 'default') {
      permission = await Notification.requestPermission()
    }

    if (permission === 'granted') {
      await this.subscribeToPush()
      return true
    } else {
      console.log('Notification permission denied')
      return false
    }
  }

  async subscribeToPush() {
    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      })

      console.log('Push subscription successful:', subscription)

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription)

      this.subscription = subscription
      this.updateUI(true)

      return subscription
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      throw error
    }
  }

  async unsubscribe() {
    if (!this.subscription) {
      return
    }

    try {
      await this.subscription.unsubscribe()
      await this.removeSubscriptionFromServer(this.subscription)

      this.subscription = null
      this.updateUI(false)

      console.log('Unsubscribed from push notifications')
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
    }
  }

  async sendSubscriptionToServer(subscription) {
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send subscription to server')
    }
  }

  async removeSubscriptionFromServer(subscription) {
    await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscription }),
    })
  }

  async sendTestNotification() {
    if (!this.subscription) {
      console.warn('No push subscription available')
      return
    }

    try {
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: this.subscription,
          payload: {
            title: 'Test Notification',
            body: 'This is a test push notification!',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            data: {
              url: '/',
              timestamp: Date.now(),
            },
            actions: [
              {
                action: 'view',
                title: 'View App',
              },
            ],
          },
        }),
      })

      if (response.ok) {
        console.log('Test notification sent successfully')
      } else {
        console.error('Failed to send test notification')
      }
    } catch (error) {
      console.error('Error sending test notification:', error)
    }
  }

  // Configure notification preferences
  async updateNotificationSettings(settings) {
    const response = await fetch('/api/push/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: this.subscription,
        settings: {
          enableNewPosts: settings.enableNewPosts || false,
          enableComments: settings.enableComments || false,
          enableUpdates: settings.enableUpdates || false,
          quietHours: settings.quietHours || { start: '22:00', end: '08:00' },
        },
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to update notification settings')
    }
  }

  updateUI(isSubscribed) {
    const subscribeBtn = document.querySelector('#subscribe-notifications')
    const unsubscribeBtn = document.querySelector('#unsubscribe-notifications')
    const notificationStatus = document.querySelector('#notification-status')

    if (subscribeBtn) {
      subscribeBtn.style.display = isSubscribed ? 'none' : 'block'
    }

    if (unsubscribeBtn) {
      unsubscribeBtn.style.display = isSubscribed ? 'block' : 'none'
    }

    if (notificationStatus) {
      notificationStatus.textContent = isSubscribed
        ? 'Push notifications enabled'
        : 'Push notifications disabled'
      notificationStatus.className = `notification-status ${isSubscribed ? 'enabled' : 'disabled'}`
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
}

// Initialize push manager
document.addEventListener('DOMContentLoaded', () => {
  const pushManager = new PushNotificationManager()

  // Set up event listeners
  document.addEventListener('click', async e => {
    if (e.target.matches('#subscribe-notifications')) {
      try {
        await pushManager.requestPermission()
      } catch (error) {
        console.error('Failed to subscribe to notifications:', error)
      }
    }

    if (e.target.matches('#unsubscribe-notifications')) {
      await pushManager.unsubscribe()
    }

    if (e.target.matches('#test-notification')) {
      await pushManager.sendTestNotification()
    }
  })

  // Expose for debugging
  window.pushManager = pushManager
})
```

## PWA Performance Optimization

### Resource Optimization

```javascript
// performance-optimizer.js - PWA performance optimization
class PWAPerformanceOptimizer {
  constructor() {
    this.observer = null
    this.criticalResourcesLoaded = false
    this.setupPerformanceOptimizations()
  }

  setupPerformanceOptimizations() {
    // Preload critical resources
    this.preloadCriticalResources()

    // Lazy load non-critical resources
    this.setupLazyLoading()

    // Optimize images
    this.setupImageOptimization()

    // Monitor performance
    this.setupPerformanceMonitoring()

    // Implement resource hints
    this.addResourceHints()
  }

  preloadCriticalResources() {
    const criticalResources = [
      { href: '/css/critical.css', as: 'style' },
      { href: '/js/app-shell.js', as: 'script' },
      {
        href: '/fonts/primary-font.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      Object.assign(link, resource)
      document.head.appendChild(link)
    })
  }

  setupLazyLoading() {
    // Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadResource(entry.target)
              this.observer.unobserve(entry.target)
            }
          })
        },
        {
          rootMargin: '50px',
        }
      )

      // Observe lazy-loadable elements
      this.observeLazyElements()
    }
  }

  observeLazyElements() {
    // Images
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.observer.observe(img)
    })

    // Background images
    document.querySelectorAll('[data-bg-src]').forEach(element => {
      this.observer.observe(element)
    })

    // Iframe embeds
    document.querySelectorAll('iframe[data-src]').forEach(iframe => {
      this.observer.observe(iframe)
    })

    // Script tags
    document.querySelectorAll('script[data-src]').forEach(script => {
      this.observer.observe(script)
    })
  }

  loadResource(element) {
    if (element.tagName === 'IMG') {
      element.src = element.dataset.src
      element.onload = () => element.classList.add('loaded')
    } else if (element.dataset.bgSrc) {
      element.style.backgroundImage = `url(${element.dataset.bgSrc})`
      element.classList.add('loaded')
    } else if (element.tagName === 'IFRAME') {
      element.src = element.dataset.src
    } else if (element.tagName === 'SCRIPT') {
      const script = document.createElement('script')
      script.src = element.dataset.src
      script.onload = () => element.classList.add('loaded')
      document.head.appendChild(script)
    }
  }

  setupImageOptimization() {
    // Implement responsive images with WebP support
    const images = document.querySelectorAll('img[data-sizes]')

    images.forEach(img => {
      if (this.supportsWebP()) {
        img.dataset.src = img.dataset.src.replace(/\.(jpg|jpeg|png)/, '.webp')
      }

      // Generate srcset for different screen densities
      if (img.dataset.sizes) {
        const sizes = JSON.parse(img.dataset.sizes)
        const srcset = sizes
          .map(size => `${img.dataset.src.replace(/\.(\w+)$/, `_${size}w.$1`)} ${size}w`)
          .join(', ')

        img.srcset = srcset
        img.sizes = this.generateSizesAttribute(sizes)
      }
    })
  }

  supportsWebP() {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }

  generateSizesAttribute(sizes) {
    // Generate responsive sizes attribute
    const breakpoints = {
      320: sizes[0] || sizes[sizes.length - 1],
      768: sizes[1] || sizes[0] || sizes[sizes.length - 1],
      1024: sizes[2] || sizes[1] || sizes[0] || sizes[sizes.length - 1],
    }

    return (
      Object.entries(breakpoints)
        .map(([breakpoint, size]) => `(max-width: ${breakpoint}px) ${size}px`)
        .join(', ') + `, ${sizes[sizes.length - 1]}px`
    )
  }

  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vitals' in window) {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = window.webVitals

      getCLS(this.sendMetric.bind(this))
      getFID(this.sendMetric.bind(this))
      getFCP(this.sendMetric.bind(this))
      getLCP(this.sendMetric.bind(this))
      getTTFB(this.sendMetric.bind(this))
    }

    // Monitor custom PWA metrics
    this.monitorPWAMetrics()
  }

  monitorPWAMetrics() {
    // Time to App Shell
    const appShellLoadTime = performance.now()
    this.sendMetric({
      name: 'app-shell-load-time',
      value: appShellLoadTime,
      id: 'app-shell',
    })

    // Service Worker registration time
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        const swReadyTime = performance.now()
        this.sendMetric({
          name: 'service-worker-ready',
          value: swReadyTime,
          id: 'sw-ready',
        })
      })
    }

    // Cache hit rate
    this.monitorCacheHitRate()
  }

  async monitorCacheHitRate() {
    if ('caches' in window) {
      let totalRequests = 0
      let cachedRequests = 0

      const originalFetch = window.fetch
      window.fetch = async (...args) => {
        totalRequests++

        try {
          const response = await originalFetch(...args)

          // Check if response came from cache
          if (response.headers.get('x-cache-status') === 'hit') {
            cachedRequests++
          }

          // Send cache hit rate every 100 requests
          if (totalRequests % 100 === 0) {
            const hitRate = (cachedRequests / totalRequests) * 100
            this.sendMetric({
              name: 'cache-hit-rate',
              value: hitRate,
              id: 'cache-performance',
            })
          }

          return response
        } catch (error) {
          throw error
        }
      }
    }
  }

  sendMetric(metric) {
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        custom_map: { metric_value: 'value' },
        value: Math.round(metric.value),
      })
    }

    // Send to performance monitoring service
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...metric,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        connection: navigator.connection?.effectiveType,
      }),
      keepalive: true,
    }).catch(error => {
      console.warn('Failed to send metric:', error)
    })
  }

  addResourceHints() {
    // DNS prefetch for external domains
    const externalDomains = ['fonts.googleapis.com', 'fonts.gstatic.com', 'api.example.com']

    externalDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = `//${domain}`
      document.head.appendChild(link)
    })

    // Preconnect to critical third-party origins
    const criticalOrigins = ['https://fonts.googleapis.com', 'https://api.example.com']

    criticalOrigins.forEach(origin => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = origin
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }

  // Dynamic resource loading based on connection
  loadResourcesBasedOnConnection() {
    const connection = navigator.connection

    if (connection) {
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        // Load minimal resources
        this.loadMinimalResources()
      } else if (connection.effectiveType === '3g') {
        // Load standard resources
        this.loadStandardResources()
      } else {
        // Load all resources including high-quality images
        this.loadAllResources()
      }
    } else {
      // Default to standard loading
      this.loadStandardResources()
    }
  }

  loadMinimalResources() {
    // Disable non-essential features
    document.body.classList.add('reduced-data-mode')

    // Load low-quality images
    document.querySelectorAll('img[data-src-low]').forEach(img => {
      img.src = img.dataset.srcLow
    })
  }

  loadStandardResources() {
    // Standard resource loading
    document.querySelectorAll('img[data-src]').forEach(img => {
      if (this.observer) {
        this.observer.observe(img)
      }
    })
  }

  loadAllResources() {
    // Enable all features
    document.body.classList.add('high-bandwidth-mode')

    // Preload next page resources
    this.preloadNextPageResources()

    // Load high-quality images
    this.loadHighQualityImages()
  }

  preloadNextPageResources() {
    // Predict likely next pages and preload their resources
    const likelyNextPages = this.predictNextPages()

    likelyNextPages.forEach(page => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = page
      document.head.appendChild(link)
    })
  }

  predictNextPages() {
    // Simple prediction based on navigation patterns
    const currentPath = window.location.pathname
    const predictions = {
      '/': ['/blog', '/about'],
      '/blog': ['/blog/post-1', '/blog/post-2'],
      '/about': ['/contact', '/'],
    }

    return predictions[currentPath] || []
  }

  loadHighQualityImages() {
    document.querySelectorAll('img[data-src-hq]').forEach(img => {
      img.src = img.dataset.srcHq
    })
  }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
  new PWAPerformanceOptimizer()
})
```

## Conclusion

Progressive Web Apps represent the future of web development by combining the best aspects of web and native applications. Key benefits include:

**Core Advantages:**

- **Offline functionality** - Apps work without internet connection
- **App-like experience** - Native-like navigation and interactions
- **Discoverability** - Available through web search and app stores
- **Cross-platform compatibility** - Single codebase for all devices
- **Automatic updates** - No app store update process required

**Implementation Essentials:**

- Comprehensive service worker with smart caching strategies
- Proper web app manifest configuration
- Offline data management with IndexedDB
- Push notification system for user engagement
- Performance optimization for fast, reliable experiences

**Best Practices:**

- Start with a solid app shell architecture
- Implement progressive enhancement principles
- Design for various network conditions
- Test extensively across different devices and browsers
- Monitor real user metrics and Core Web Vitals

PWAs bridge the gap between web and native applications, offering users the convenience of instant access through browsers while providing rich, app-like experiences. As browser support continues to improve and new capabilities are added, PWAs become increasingly viable alternatives to traditional native apps.

The technology is particularly powerful for content-driven applications, productivity tools, and services that benefit from the web's inherent shareability and discoverability while requiring the reliability and performance users expect from native applications.

Building successful PWAs requires understanding both web technologies and native app conventions to create experiences that feel natural on every platform.
