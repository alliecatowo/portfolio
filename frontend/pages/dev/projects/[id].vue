<template>
  <div>
    <section class="py-12 md:py-20 bg-gradient-to-br from-primary/5 to-primary-50 dark:from-primary-400/10 dark:to-primary-400/20">
      <div class="container-custom">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-400"></div>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="bg-red-100 text-red-800 p-4 rounded-lg max-w-2xl mx-auto">
          <p>{{ error }}</p>
          <NuxtLink to="/dev/projects" class="mt-4 text-primary dark:text-primary-400 font-medium inline-block">
            Back to Projects
          </NuxtLink>
        </div>
        
        <!-- Project details -->
        <div v-else-if="project" class="max-w-4xl mx-auto">
          <div class="mb-8">
            <NuxtLink to="/dev/projects" class="inline-flex items-center text-primary dark:text-primary-400 hover:underline mb-4">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Projects
            </NuxtLink>
            
            <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ project.title }}</h1>
            
            <div class="flex flex-wrap gap-2 mb-6">
              <span 
                v-for="tech in project.technologies" 
                :key="tech.id" 
                class="px-3 py-1 text-sm rounded-full bg-primary-50 dark:bg-primary-400/20 text-primary dark:text-primary-400"
              >
                {{ tech.name }}
              </span>
              <span class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {{ project.category?.name || 'Project' }}
              </span>
            </div>
          </div>
          
          <!-- Project image gallery -->
          <div class="mb-12">
            <div v-if="project.images && project.images.length > 0" class="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
              <img 
                :src="project.images[currentImageIndex].url" 
                :alt="`${project.title} - Image ${currentImageIndex + 1}`"
                class="w-full h-full object-contain"
              >
              
              <!-- Image navigation -->
              <div v-if="project.images.length > 1" class="absolute inset-x-0 bottom-0 flex justify-between p-4">
                <button 
                  @click="prevImage" 
                  class="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none"
                  :disabled="currentImageIndex === 0"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <div class="text-sm text-white bg-black/50 px-3 py-1 rounded-full">
                  {{ currentImageIndex + 1 }} / {{ project.images.length }}
                </div>
                <button 
                  @click="nextImage" 
                  class="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none"
                  :disabled="currentImageIndex === project.images.length - 1"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Thumbnails -->
            <div v-if="project.images && project.images.length > 1" class="grid grid-cols-4 sm:grid-cols-6 gap-2">
              <div 
                v-for="(image, index) in project.images" 
                :key="index" 
                class="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden cursor-pointer"
                :class="{ 'ring-2 ring-primary dark:ring-primary-400': currentImageIndex === index }"
                @click="currentImageIndex = index"
              >
                <img 
                  :src="image.url" 
                  :alt="`${project.title} - Thumbnail ${index + 1}`"
                  class="w-full h-full object-cover"
                >
              </div>
            </div>
          </div>
          
          <!-- Project links -->
          <div class="flex flex-wrap gap-4 mb-8">
            <a 
              v-if="project.github" 
              :href="project.github" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
              GitHub Repository
            </a>
            <a 
              v-if="project.liveDemo" 
              :href="project.liveDemo" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="inline-flex items-center px-4 py-2 bg-primary dark:bg-primary-400 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-400-700 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              Live Demo
            </a>
          </div>
          
          <!-- Project description -->
          <div class="mb-12">
            <h2 class="text-2xl font-bold mb-4">Project Overview</h2>
            <div class="prose dark:prose-invert max-w-none">
              <p>{{ project.description }}</p>
            </div>
          </div>
          
          <!-- Project content -->
          <div v-if="project.content" class="mb-12">
            <h2 class="text-2xl font-bold mb-4">Project Details</h2>
            <div class="prose dark:prose-invert max-w-none">
              <!-- In a real app, this would be rendered HTML from the CMS -->
              <p>{{ project.content }}</p>
            </div>
          </div>
          
          <!-- Related projects -->
          <div v-if="project.related_projects && project.related_projects.length > 0" class="mt-16">
            <h2 class="text-2xl font-bold mb-6">Related Projects</h2>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="relatedProject in project.related_projects" 
                :key="relatedProject.id" 
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <NuxtLink :to="`/dev/projects/${relatedProject.slug}`">
                  <div class="relative aspect-video bg-gray-200 dark:bg-gray-700">
                    <img 
                      v-if="relatedProject.images && relatedProject.images.length > 0" 
                      :src="relatedProject.images[0].url" 
                      :alt="relatedProject.title"
                      class="w-full h-full object-cover"
                    >
                    <div 
                      v-else 
                      class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500"
                    >
                      Project Image
                    </div>
                  </div>
                  <div class="p-4">
                    <h3 class="text-lg font-bold mb-2">{{ relatedProject.title }}</h3>
                    <p class="text-gray-600 dark:text-gray-300 line-clamp-2">
                      {{ relatedProject.description }}
                    </p>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
          
          <!-- Contact CTA -->
          <div class="mt-16 p-8 bg-primary/5 dark:bg-primary-400/10 rounded-lg text-center">
            <h2 class="text-2xl font-bold mb-4">Interested in working together?</h2>
            <p class="mb-6 max-w-2xl mx-auto">
              If you like my work and have a project in mind, I'd love to hear about it.
              Let's discuss how we can collaborate to bring your ideas to life.
            </p>
            <NuxtLink to="/dev/contact" class="inline-block px-6 py-3 bg-primary dark:bg-primary-400 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-400-700 transition-colors">
              Get in Touch
            </NuxtLink>
          </div>
        </div>
        
        <!-- Not found state -->
        <div v-else class="text-center py-16">
          <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold mb-2">Project Not Found</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <NuxtLink to="/dev/projects" class="inline-block px-6 py-3 bg-primary dark:bg-primary-400 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-400-700 transition-colors">
            View All Projects
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';
import { useContent }; const { fetchProject } from '~/composables/useContent';

// Ensure site config is set to dev
const siteConfig = useSiteConfig();
if (siteConfig.value?.type !== 'dev') {
  siteConfig.value = {
    ...siteConfig.value,
    type: 'dev',
    baseRoute: '/dev'
  };
}

// Route params
const route = useRoute();
const projectId = route.params.id as string;

// State
const project = ref(null);
const loading = ref(true);
const error = ref(null);
const currentImageIndex = ref(0);

// Methods
const fetchProject = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // In a real implementation, this would fetch from Strapi
    const response = await getProjectBySlug(projectId);
    
    if (response) {
      project.value = response;
      
      // For demo purposes, if there's no data from Strapi, use placeholder data
      if (!project.value) {
        // This is just for demo purposes - in a real app, we'd show a 404
        project.value = {
          id: 1,
          title: 'Sample Project',
          slug: projectId,
          description: 'This is a sample project description. In a real application, this would be fetched from the CMS.',
          content: 'Detailed content about the project would go here. This could include information about the development process, challenges faced, solutions implemented, and lessons learned.',
          images: [
            { url: 'https://via.placeholder.com/800x600?text=Project+Image+1' },
            { url: 'https://via.placeholder.com/800x600?text=Project+Image+2' },
            { url: 'https://via.placeholder.com/800x600?text=Project+Image+3' }
          ],
          technologies: [
            { id: 1, name: 'Vue.js' },
            { id: 2, name: 'Nuxt.js' },
            { id: 3, name: 'Tailwind CSS' }
          ],
          category: { id: 1, name: 'Web Development' },
          github: 'https://github.com/username/project',
          liveDemo: 'https://example.com',
          related_projects: [
            {
              id: 2,
              title: 'Related Project 1',
              slug: 'related-project-1',
              description: 'Description of a related project.',
              images: [{ url: 'https://via.placeholder.com/400x300?text=Related+1' }]
            },
            {
              id: 3,
              title: 'Related Project 2',
              slug: 'related-project-2',
              description: 'Description of another related project.',
              images: [{ url: 'https://via.placeholder.com/400x300?text=Related+2' }]
            }
          ]
        };
      }
    }
  } catch (err) {
    console.error('Error fetching project:', err);
    error.value = 'Failed to load project details. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Image navigation
const nextImage = () => {
  if (project.value?.images && currentImageIndex.value < project.value.images.length - 1) {
    currentImageIndex.value++;
  }
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

// Lifecycle
onMounted(() => {
  fetchProject();
});

// Watch for route changes to fetch new project data
watch(() => route.params.id, (newId) => {
  if (newId && newId !== projectId) {
    fetchProject();
    currentImageIndex.value = 0;
  }
});

// Meta tags
useHead(() => ({
  title: project.value ? `${project.value.title} - ${siteConfig.value?.title || 'Developer Portfolio'}` : 'Project Details',
  meta: [
    { 
      name: 'description', 
      content: project.value?.description || 'Detailed information about this development project, including technologies used and key features.'
    }
  ]
}));
</script>

<style scoped>
.container-custom {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 