<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-6">Environment Debug</h1>
    
    <div class="bg-white dark:bg-gray-800 shadow rounded p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Runtime Config</h2>
      <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded">
        <pre class="whitespace-pre-wrap break-words">{{ JSON.stringify(runtimeConfig.public, null, 2) }}</pre>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow rounded p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Process Environment Keys</h2>
      <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded">
        <pre v-if="processEnv">{{ processEnv }}</pre>
        <p v-else>Process environment not available on client</p>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow rounded p-6">
      <h2 class="text-xl font-semibold mb-4">Test Directus Connection</h2>
      <button 
        @click="testConnection"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Test Connection
      </button>
      <div v-if="connectionResult" class="mt-4">
        <h3 class="font-semibold mb-2">Connection Result:</h3>
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded">
          <pre class="whitespace-pre-wrap break-words">{{ JSON.stringify(connectionResult, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

const runtimeConfig = useRuntimeConfig()
const processEnv = ref(null)
const connectionResult = ref(null)

// On server side, we can access process.env
if (process.server) {
  processEnv.value = Object.keys(process.env)
    .filter(key => !key.includes('PASSWORD') && !key.includes('SECRET') && !key.includes('KEY'))
    .reduce((obj, key) => {
      obj[key] = process.env[key]
      return obj
    }, {})
}

async function testConnection() {
  try {
    // Build the URL with the current directusUrl from runtime config
    const url = `${runtimeConfig.public.directusUrl}/server/ping`
    
    connectionResult.value = {
      url,
      status: 'Connecting...'
    }
    
    // Make the request
    const response = await fetch(url)
    
    if (response.ok) {
      const data = await response.json()
      connectionResult.value = {
        status: 'Success',
        statusCode: response.status,
        headers: Object.fromEntries([...response.headers.entries()]),
        data
      }
    } else {
      connectionResult.value = {
        status: 'Error',
        statusCode: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()])
      }
    }
  } catch (error) {
    connectionResult.value = {
      status: 'Exception',
      message: error.message,
      error: String(error)
    }
  }
}
</script> 