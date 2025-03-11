<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-6">Directus Debug</h1>
    
    <div class="bg-white shadow rounded p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Configuration</h2>
      <pre class="bg-gray-100 p-4 rounded overflow-auto">{{ configInfo }}</pre>
    </div>
    
    <div class="bg-white shadow rounded p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Direct API Test</h2>
      <button 
        @click="testDirectAPI" 
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Test Direct API
      </button>
      <div v-if="directAPILoading">Testing direct API connection...</div>
      <pre v-else-if="directAPIResult" class="bg-gray-100 p-4 rounded overflow-auto">{{ directAPIResult }}</pre>
    </div>
    
    <div class="bg-white shadow rounded p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Utility Function Test</h2>
      <button 
        @click="testUtilityFunction" 
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Test Utility Function
      </button>
      <div v-if="utilityLoading">Testing utility function...</div>
      <pre v-else-if="utilityResult" class="bg-gray-100 p-4 rounded overflow-auto">{{ utilityResult }}</pre>
    </div>
    
    <div class="bg-white shadow rounded p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Fetch from Directus Test</h2>
      <button 
        @click="testFetchFromDirectus" 
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Test fetchFromDirectus
      </button>
      <div v-if="fetchLoading">Testing fetchFromDirectus function...</div>
      <pre v-else-if="fetchResult" class="bg-gray-100 p-4 rounded overflow-auto">{{ fetchResult }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'
import { fetchFromDirectus } from '~/utils/directus'
import { fetchAllBlogPosts } from '~/utils/api/directus'

const config = useRuntimeConfig()

// State for test results
const directAPILoading = ref(false)
const directAPIResult = ref(null)
const utilityLoading = ref(false)
const utilityResult = ref(null)
const fetchLoading = ref(false)
const fetchResult = ref(null)

// Formatted config information
const configInfo = computed(() => {
  return {
    directusUrl: config.public.directusUrl,
    apiUrl: config.public.apiUrl,
    devSiteUrl: config.public.devSiteUrl,
    tattooSiteUrl: config.public.tattooSiteUrl,
    nodeEnv: process.env.NODE_ENV,
    publicKeys: Object.keys(config.public)
  }
})

// Test direct API connection
async function testDirectAPI() {
  directAPILoading.value = true
  directAPIResult.value = null
  
  try {
    const url = `${config.public.directusUrl}/items/blog_posts?limit=1`
    console.log('Testing direct API URL:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    directAPIResult.value = {
      status: response.status,
      url: url,
      data: data
    }
  } catch (error) {
    directAPIResult.value = {
      error: error.message,
      stack: error.stack
    }
  } finally {
    directAPILoading.value = false
  }
}

// Test utility function
async function testUtilityFunction() {
  utilityLoading.value = true
  utilityResult.value = null
  
  try {
    console.log('Testing utility function fetchAllBlogPosts')
    const posts = await fetchAllBlogPosts({ limit: 1 })
    
    utilityResult.value = {
      success: true,
      posts: posts
    }
  } catch (error) {
    utilityResult.value = {
      error: error.message,
      stack: error.stack
    }
  } finally {
    utilityLoading.value = false
  }
}

// Test fetchFromDirectus function
async function testFetchFromDirectus() {
  fetchLoading.value = true
  fetchResult.value = null
  
  try {
    console.log('Testing fetchFromDirectus function')
    const data = await fetchFromDirectus('blog_posts', { limit: 1 })
    
    fetchResult.value = {
      success: true,
      data: data
    }
  } catch (error) {
    fetchResult.value = {
      error: error.message,
      stack: error.stack
    }
  } finally {
    fetchLoading.value = false
  }
}

// Run tests on page load
onMounted(() => {
  console.log('Directus Debug page loaded')
  console.log('Runtime config:', config.public)
})
</script> 