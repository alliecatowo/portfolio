<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="max-w-md text-center">
      <h1 class="text-5xl font-bold mb-6 text-primary dark:text-primary-400">404</h1>
      <h2 class="text-3xl font-bold mb-8">Page Not Found</h2>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <UButton @click="$router.go(-1)" variant="outline" color="primary">
          Go Back
        </UButton>
        <UButton to="/" color="primary">
          Back to Home
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  error: Object
});
</script> 