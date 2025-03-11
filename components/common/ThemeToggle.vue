<template>
  <button 
    class="p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary" 
    @click="toggleDarkMode" 
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    title="Toggle dark/light mode"
  >
    <svg v-if="isDark" class="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
    </svg>
    <svg v-else class="w-6 h-6 text-dark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
const isDark = ref(false);

// Initialize dark mode based on user preference or saved setting
onMounted(() => {
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('color-theme');
  const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // If the user has explicitly chosen dark mode or has dark mode preference
  if (savedTheme === 'dark' || (!savedTheme && systemDarkMode)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  }
});

function toggleDarkMode() {
  isDark.value = !isDark.value;
  
  // Add or remove dark class
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('color-theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('color-theme', 'light');
  }
}
</script> 