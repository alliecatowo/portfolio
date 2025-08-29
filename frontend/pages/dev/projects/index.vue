<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary/5 to-primary-50 dark:from-primary-400/10 dark:to-primary-400/20">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">My Projects</h1>
          <p class="text-lg mb-12">
            A collection of my recent development projects, from web applications to utility tools.
          </p>
        </div>
        
        <!-- Project Filters -->
        <div class="mb-12">
          <div class="flex flex-wrap justify-center gap-3 mb-6">
            <button 
              @click="selectedCategory = null" 
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                !selectedCategory ? 
                  'bg-primary dark:bg-primary-400 text-white' : 
                  'bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-400/10'
              ]"
            >
              All Projects
            </button>
            <button 
              v-for="category in categories" 
              :key="category.id" 
              @click="selectedCategory = category.id" 
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedCategory === category.id ? 
                  'bg-primary dark:bg-primary-400 text-white' : 
                  'bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-400/10'
              ]"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-400"></div>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg max-w-2xl mx-auto">
          <p>{{ error }}</p>
          <button @click="fetchProjects" class="mt-4 text-primary dark:text-primary-400 font-medium">
            Try Again
          </button>
        </div>
        
        <!-- Projects Grid -->
        <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="project in filteredProjects" 
            :key="project.id" 
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div class="relative aspect-video bg-gray-200 dark:bg-gray-700">
              <img 
                v-if="project.cover_image" 
                :src="project.cover_image.url" 
                :alt="project.title"
                class="w-full h-full object-cover"
              >
              <div 
                v-else 
                class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500"
              >
                Project Image
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">{{ project.title }}</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-3">
                {{ project.description }}
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="tech in project.technologies" 
                  :key="tech.id"
                  class="px-2 py-1 text-xs rounded-full bg-primary-50 dark:bg-primary-400/20 text-primary dark:text-primary-400"
                >
                  {{ tech.name }}
                </span>
              </div>
              <div class="flex justify-between items-center mt-4">
                <NuxtLink :to="`/dev/projects/${project.slug}`" class="text-primary dark:text-primary-400 font-medium">
                  View Details →
                </NuxtLink>
                <div class="flex space-x-3">
                  <a 
                    v-if="project.github" 
                    :href="project.github" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
                    title="GitHub Repository"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                    </svg>
                  </a>
                  <a 
                    v-if="project.live_url" 
                    :href="project.live_url" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
                    title="Live Demo"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="!loading && !error && filteredProjects.length === 0" class="text-center py-16">
          <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold mb-2">No projects found</h3>
          <p class="text-gray-500 dark:text-gray-400">Try changing your filter or check back later.</p>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-12">
          <div class="flex space-x-2">
            <button 
              @click="currentPage > 1 && (currentPage--)" 
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded-md bg-white dark:bg-gray-800 disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              v-for="page in totalPages" 
              :key="page" 
              @click="currentPage = page"
              :class="[
                'px-4 py-2 rounded-md',
                currentPage === page ? 
                  'bg-primary dark:bg-primary-400 text-white' : 
                  'bg-white dark:bg-gray-800'
              ]"
            >
              {{ page }}
            </button>
            <button 
              @click="currentPage < totalPages && (currentPage++)" 
              :disabled="currentPage === totalPages"
              class="px-4 py-2 rounded-md bg-white dark:bg-gray-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';
import { getProjects } from '~/utils/api/content';

// Ensure site config is set to dev
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'dev') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'dev',
    baseRoute: '/dev'
  };
}

// State
const projects = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 9;

// Computed
const filteredProjects = computed(() => {
  if (!selectedCategory.value) return projects.value;
  return projects.value.filter(project => 
    project.category && project.category.id === selectedCategory.value
  );
});

// Methods
const fetchProjects = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // In a real implementation, this would fetch from Strapi
    // For demo purposes, we'll use placeholder data
    const response = await getProjects(currentPage.value, pageSize);
    
    if (response) {
      projects.value = response.data || [];
      totalPages.value = Math.ceil((response.meta?.pagination?.total || 0) / pageSize);
      
      // For demo, if there's no data, create placeholder projects
      if (projects.value.length === 0) {
        projects.value = Array.from({ length: 6 }, (_, i) => ({
          id: i + 1,
          title: `Project ${i + 1}`,
          slug: `project-${i + 1}`,
          description: 'This is a placeholder project description. It simulates what would be fetched from a CMS.',
          technologies: [
            { id: 1, name: 'Vue.js' },
            { id: 2, name: 'TypeScript' },
            { id: 3, name: 'Tailwind' },
          ],
          category: { id: i % 2 === 0 ? 1 : 2, name: i % 2 === 0 ? 'Frontend' : 'Backend' },
          github: 'https://github.com/allison',
          live_url: 'https://example.com',
        }));
        
        // Simulate categories
        categories.value = [
          { id: 1, name: 'Frontend' },
          { id: 2, name: 'Backend' },
          { id: 3, name: 'Full Stack' },
        ];
        
        totalPages.value = 2; // For demo purposes
      }
    }
  } catch (err) {
    console.error('Error fetching projects:', err);
    error.value = 'Failed to load projects. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(currentPage, () => {
  fetchProjects();
  // Scroll to top when changing pages
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

watch(selectedCategory, () => {
  currentPage.value = 1;
});

// Lifecycle
onMounted(() => {
  fetchProjects();
});

// Meta tags
useHead({
  title: `Projects - ${siteConfig.value?.title || 'Developer Portfolio'}`,
  meta: [
    { name: 'description', content: 'Explore my web development projects, from responsive websites to interactive applications, built with modern technologies.' }
  ]
});
</script>

<style scoped>
.container-custom {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 