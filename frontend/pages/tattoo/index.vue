<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="container-custom py-12">
      <!-- Hero Section -->
      <section class="py-16 md:py-24">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h1 class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated">
              Allison's Tattoo Art
            </h1>
            <p class="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300">
              Specializing in custom designs that blend fine art with self-expression, creating a unique tattoo experience for every client.
            </p>
            <div class="flex flex-wrap gap-3">
              <UButton to="/tattoo/gallery" color="primary" variant="solid" size="lg" class="btn-depth magnetic-hover">
                View Gallery
                <UIcon name="i-lucide-image" class="w-4 h-4 ml-2" />
              </UButton>
              <UButton to="/contact" color="primary" variant="soft" size="lg" class="btn-depth magnetic-hover">
                Book a Session
                <UIcon name="i-lucide-calendar" class="w-4 h-4 ml-2" />
              </UButton>
            </div>
          </div>
          <div class="md:w-1/2 rounded-xl overflow-hidden shadow-lg">
            <div class="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <NuxtImg provider="none" src="https://placehold.co/1920x1080?text=Tattoo+Hero" alt="Tattoo Artist Hero Image" class="object-cover w-full h-full" loading="lazy" sizes="sm:100vw md:50vw lg:50vw" />
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Works Section -->
      <section class="py-12 md:py-16">
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-primary dark:text-primary-400">Featured Works</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">A sample of my recent tattoo designs</p>
        </div>

        <div v-if="featuredWorks.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <UCard
            v-for="work in featuredWorks" 
            :key="work.id" 
            class="glass card-hover group overflow-hidden"
            :ui="{ body: 'p-0' }"
          >
            <div class="aspect-square bg-gradient-tattoo relative overflow-hidden">
              <NuxtImg 
                provider="none"
                :src="work.image || 'https://placehold.co/1280x600?text=Tattoo+Work'" 
                :alt="work.title" 
                class="object-cover w-full h-full mix-blend-overlay opacity-80 group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                sizes="sm:100vw md:33vw lg:33vw"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 text-primary group-hover:text-pink-500 transition-colors">
                {{ work.title }}
              </h3>
              <p class="text-muted line-clamp-3 mb-4">
                {{ work.description }}
              </p>
              <div class="flex items-center gap-2 mb-4">
                <UBadge 
                  :color="getTattooStyleColor(work.style || 'Custom')" 
                  variant="soft"
                  size="sm"
                >
                  {{ work.style || 'Custom' }}
                </UBadge>
              </div>
              <UButton 
                @click="openTattooDetails(work)" 
                color="primary" 
                variant="solid" 
                size="sm" 
                block
                class="magnetic-hover"
              >
                View Details
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </UButton>
            </div>
          </UCard>
        </div>
        
        <div v-else class="py-8 flex justify-center">
          <p class="text-gray-500 dark:text-gray-400">Featured works will appear here when added.</p>
        </div>

        <div class="mt-8 text-center">
          <UButton to="/tattoo/gallery" color="primary" variant="soft" class="btn-depth magnetic-hover">View Full Gallery</UButton>
        </div>
      </section>

      <!-- Tattoo Styles Section -->
      <section class="py-12 md:py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div class="container mx-auto px-4">
          <div class="mb-12 text-center">
            <h2 class="text-3xl font-bold text-primary dark:text-primary-400">Tattoo Styles</h2>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Artistic approaches I specialize in</p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary/10 dark:bg-primary-400/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary dark:text-primary-400">🖌️</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">Fine Line</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">Delicate, precise lines for intricate, detailed designs</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary-700/10 dark:bg-primary-400/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary">🎨</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">Watercolor</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">Vibrant, fluid colors that mimic watercolor paintings</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary-700/10 dark:bg-primary-400/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary">🌿</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">Botanical</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">Nature-inspired designs with detailed flora elements</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary-700/10 dark:bg-primary-400/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary">✨</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">Minimalist</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">Simple, clean designs with powerful meaning</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary-700/10 dark:bg-primary-400/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary">🖤</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">Blackwork</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">Bold black ink with strong contrasts and patterns</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-16 h-16 bg-primary-700/10 dark:bg-primary-400/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl text-primary">🧠</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">Custom</h3>
              <p class="text-center text-gray-600 dark:text-gray-300">Unique designs tailored to your personal vision</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Client Testimonials -->
      <section class="py-12 md:py-16">
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-primary">Client Testimonials</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">What my clients are saying</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            v-for="(work, index) in featuredWorksWithTestimonials" 
            :key="work.id" 
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          >
            <div class="flex items-start mb-4">
              <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-4">
                <NuxtImg 
                  provider="none"
                  :src="work.image || 'https://placehold.co/96x96?text=Client'" 
                  alt="Client" 
                  class="w-full h-full object-cover"
                  loading="lazy"
                  sizes="48px"
                />
              </div>
              <div>
                <h3 class="font-semibold text-lg">Client {{ index + 1 }}</h3>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ new Date(work.date || Date.now()).toLocaleDateString() }}</p>
              </div>
            </div>
            <p class="text-gray-600 dark:text-gray-300 italic">
              "{{ work.clientTestimonial }}"
            </p>
          </div>
        </div>
        
        <div v-if="featuredWorksWithTestimonials.length === 0" class="py-8 flex justify-center">
          <p class="text-gray-500 dark:text-gray-400">Testimonials will appear here when added.</p>
        </div>
      </section>

      <!-- Blog Posts Preview -->
      <section class="py-12 md:py-16">
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-primary">Tattoo Articles</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Insights and stories from my tattoo journey</p>
        </div>

        <div v-if="recentPosts.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="post in recentPosts" 
            :key="post.id" 
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
          >
            <div class="aspect-video bg-gray-100 dark:bg-gray-700">
              <NuxtImg 
                provider="none"
                :src="'https://placehold.co/640x360?text=Blog'" 
                :alt="post.title" 
                class="object-cover w-full h-full"
                loading="lazy"
                sizes="sm:100vw md:33vw lg:33vw"
              />
            </div>
            <div class="p-6">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                <span class="inline-flex items-center">
                  <UIcon name="i-lucide-calendar" class="w-3 h-3 mr-1" />
                  {{ new Date(post.date || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                </span>
                <span v-if="getReadTime(post)" class="inline-flex items-center gap-1">
                  <span class="mx-1">•</span>
                  <UIcon name="i-lucide-clock" class="w-3 h-3" />
                  {{ getReadTime(post) }}
                </span>
              </div>
              <h3 class="text-xl font-bold mb-2 text-primary">
                {{ post.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                {{ post.description || '' }}
              </p>
              <UButton :to="`/tattoo/blog/${post.slug || ''}`" color="primary" size="sm" class="btn-depth magnetic-hover" block>Read More</UButton>
            </div>
          </div>
        </div>
        
        <div v-else class="py-8 flex justify-center">
          <p class="text-gray-500 dark:text-gray-400">Blog posts will appear here when published.</p>
        </div>

        <div class="mt-8 text-center">
          <UButton to="/tattoo/blog" color="primary" variant="soft" class="btn-depth magnetic-hover">View All Articles</UButton>
        </div>
      </section>

      <!-- Booking CTA -->
      <section class="py-12 md:py-16 bg-primary-700/10 dark:bg-primary-400/10 rounded-xl text-center">
        <h2 class="text-3xl font-bold text-primary mb-4">Ready for Your New Tattoo?</h2>
        <p class="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Let's create something beautiful together. Contact me to discuss your ideas and schedule a consultation.
        </p>
        <UButton to="/contact" color="primary" class="btn-depth magnetic-hover">Book a Consultation</UButton>
      </section>
    </div>

    <!-- Tattoo Work Modal -->
    <UModal 
      v-model:open="isWorkModalOpen"
      :ui="{ content: 'w-full sm:max-w-3xl max-h-[90vh]' }"
    >
      <template #content>
      <UCard v-if="selectedWork" :ui="{ body: 'p-0' }">
        <template #header>
          <div class="relative">
            <NuxtImg 
              provider="none"
              :src="selectedWork.image || 'https://placehold.co/1280x720?text=Tattoo'" 
              :alt="selectedWork.title" 
              class="w-full aspect-square object-cover rounded-t-lg"
              loading="lazy"
              sizes="sm:100vw md:75vw lg:75vw"
            />
          </div>
        </template>
        
        <div class="p-6">
          <h3 class="text-2xl font-bold mb-2 text-primary">
            {{ selectedWork.title }}
          </h3>
          <div class="flex items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{{ new Date(selectedWork.date || Date.now()).toLocaleDateString() }}</span>
            <span class="mx-2">•</span>
            <span>Style: {{ selectedWork.style || 'Custom' }}</span>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            {{ selectedWork.description }}
          </p>
          
          <div v-if="selectedWork.clientTestimonial" class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h4 class="font-medium mb-2">Client Testimonial</h4>
            <p class="text-gray-600 dark:text-gray-300 italic">
              "{{ selectedWork.clientTestimonial }}"
            </p>
          </div>
        </div>
      </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useContent } from '~/composables/useContent';
import { getTattooStyleColor } from '~/utils/colors';

// Site Configuration
const config = useSiteConfig();
config.value = {
  ...config.value,
  title: "Allison's Tattoo Art",
  description: "Custom tattoo designs specializing in fine line, watercolor, and botanical styles.",
  type: 'tattoo'
};

// Page meta
useHead({
  title: "Allison's Tattoo Art",
  meta: [
    { name: 'description', content: 'Custom tattoo designs specializing in fine line, watercolor, and botanical styles.' }
  ]
});

// Type definitions
interface TattooWork {
  id: string;
  title: string;
  description?: string;
  image?: string;
  images?: string[];
  style?: string;
  placement?: string;
  size?: string;
  sessionTime?: string;
  date?: string;
  clientTestimonial?: string;
}

interface BlogPost {
  id: string;
  title: string;
  description?: string;
  slug: string;
  date?: string;
  readingTime?: {
    text: string;
    minutes: number;
  };
}

interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating?: number;
  date?: string;
}

// Content data
const featuredWorks = ref<TattooWork[]>([]);
const recentPosts = ref<BlogPost[]>([]);
const testimonials = ref<Testimonial[]>([]);
const selectedWork = ref<TattooWork | null>(null);

// Computed property for work modal state
const isWorkModalOpen = computed({
  get: () => selectedWork.value !== null,
  set: (value: boolean) => {
    if (!value) {
      selectedWork.value = null;
    }
  }
});

// Read time: plugin only
const getReadTime = (p: BlogPost) => p?.readingTime?.text || '';

// Computed property for works with testimonials
const featuredWorksWithTestimonials = computed(() => {
  return featuredWorks.value.filter(work => work.clientTestimonial);
});

// Method to open tattoo details modal
function openTattooDetails(work: TattooWork) {
  selectedWork.value = work;
}

// Use content composable
const { fetchGalleryItems, fetchBlogPosts, fetchTestimonials } = useContent();

// Fetch data using useAsyncData for SSR support
const { data: galleryData } = await useAsyncData('tattoo-gallery-featured', () => 
  fetchGalleryItems(3)
);
const { data: blogData } = await useAsyncData('tattoo-blog-recent', () => 
  fetchBlogPosts('tattoo', 3)
);
const { data: testimonialData } = await useAsyncData('tattoo-testimonials', () => 
  fetchTestimonials(4)
);

// Set reactive data
featuredWorks.value = (galleryData.value || []).map((it: any, idx: number) => ({
  id: String(it.id ?? it._id ?? idx),
  title: it.title ?? 'Untitled',
  description: it.description ?? '',
  image: Array.isArray(it.images) ? it.images[0] : (it.images ?? ''),
  style: Array.isArray(it.styles) ? it.styles[0] : it.styles,
  placement: it.placement,
  size: it.size,
  sessionTime: it.session_time,
  date: it.date
}))
recentPosts.value = (blogData.value || []).map((p: any) => ({
  id: String(p.id ?? p._id ?? p.slug ?? Math.random()),
  title: p.title,
  description: p.description,
  slug: p.slug ?? (p.path ? String(p.path).split('/').pop() : ''),
  date: p.date,
  readingTime: p.readingTime
}))
testimonials.value = (testimonialData.value || []).map((t: any, i: number) => ({
  id: String(t.id ?? t._id ?? i),
  name: t.title ?? 'Anonymous',
  content: t.description ?? ''
}))
</script> 
