<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-6">Directus Test</h1>
    
    <div class="bg-white shadow rounded p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Connection Info</h2>
      <p><strong>Directus URL:</strong> {{ process.env.NODE_ENV === 'production' ? 'https://directus.allisons.dev' : config.public.directusUrl }}</p>
    </div>
    
    <div class="bg-white shadow rounded p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Diagnostics</h2>
      <div class="bg-gray-100 p-3 rounded">
        <p><strong>Nuxt App Keys:</strong> {{ Object.keys(nuxtApp).join(', ') }}</p>
        <p><strong>Pinia Plugin Present:</strong> {{ nuxtApp.$pinia ? 'Yes' : 'No' }}</p>
      </div>
    </div>
    
    <div class="bg-white shadow rounded p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Blog Posts</h2>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>
      <div v-else>
        <p v-if="!posts.length" class="text-gray-500">No posts found</p>
        <ul v-else class="space-y-2">
          <li v-for="post in posts" :key="post.id" class="p-3 border rounded">
            <h3 class="font-bold">{{ post.title }}</h3>
            <p v-if="post.description" class="text-gray-600">{{ post.description }}</p>
          </li>
        </ul>
      </div>
    </div>
    
    <button 
      @click="fetchData" 
      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    >
      Reload Data
    </button>
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp();
const directusData = useDirectusData();
const config = useRuntimeConfig();

const posts = ref([]);
const loading = ref(true);
const error = ref(null);

async function fetchData() {
  try {
    loading.value = true;
    error.value = null;
    
    // Try to fetch from blog collection - adjust the collection name if needed
    posts.value = await directusData.getItems('blog', {
      limit: 10,
      sort: ['-date_created']
    });
    
    console.log('Fetched posts:', posts.value);
  } catch (err) {
    console.error('Error fetching data:', err);
    error.value = err.message || 'Failed to load data';
  } finally {
    loading.value = false;
  }
}

// Fetch data on page load
onMounted(() => {
  fetchData();
});
</script> 