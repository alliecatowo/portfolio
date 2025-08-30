<template>
  <header class="sticky top-0 z-50 glass backdrop-blur border-b border-primary/20" role="banner" aria-label="Site header">
    <UContainer class="py-3">
      <div class="flex items-center justify-between gap-3">
        <!-- Logo / Title -->
        <NuxtLink :to="siteConfig.type === 'dev' ? '/dev' : siteConfig.type === 'tattoo' ? '/tattoo' : '/'" class="no-underline group">
          <div class="flex items-center gap-3">
            <span class="text-xl sm:text-2xl font-bold text-primary select-none transition-all duration-300 group-hover:text-gradient">
              ALLISON<span class="text-pink-500">.{{ siteConfig.type === 'tattoo' ? 'ink' : 'dev' }}</span>
            </span>
            <div class="hidden sm:flex items-center gap-2">
              <UBadge color="primary" variant="soft" size="xs">5+ Years</UBadge>
              <UBadge color="primary" variant="soft" size="xs">20+ Projects</UBadge>
            </div>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav id="site-navigation" class="hidden md:flex items-center gap-3" role="navigation" aria-label="Main navigation">
          <div class="flex items-center gap-2">
            <UTooltip 
              v-for="(item, index) in navigationItems"
              :key="index"
              :text="`Navigate to ${item.name}`"
              :delay-duration="300"
            >
              <UButton
                :to="item.path"
                :variant="route.path === item.path ? 'soft' : 'ghost'"
                color="primary"
                size="sm"
                class="text-sm hover:scale-105 transition-all duration-200"
                :class="route.path === item.path ? 'ring-1 ring-primary/20' : ''"
                :aria-label="`Navigate to ${item.name}`"
                :aria-current="route.path === item.path ? 'page' : undefined"
              >
                {{ item.name }}
              </UButton>
            </UTooltip>
          </div>

          <UTooltip text="Switch between portfolios" :delay-duration="300">
            <UButton
              color="primary"
              variant="outline"
              size="sm"
              @click="togglePortfolioType"
              aria-label="Switch between developer and tattoo portfolios"
            >
              Switch to {{ siteConfig.type === 'dev' ? 'Tattoo' : 'Developer' }}
              <UIcon name="i-lucide-repeat" class="w-4 h-4 ml-1" />
            </UButton>
          </UTooltip>

          <div class="flex items-center gap-2 ml-3 pl-3 border-l border-gray-200 dark:border-gray-800">
            <UTooltip :text="`Search (⌘K)`" :delay-duration="300">
              <UButton
                icon="i-lucide-search"
                variant="ghost"
                color="primary"
                size="sm"
                @click="$emit('openSearch')"
                class="gap-1"
                aria-label="Open search (⌘K)"
              >
                <template #trailing>
                  <ClientOnly>
                    <UKbd size="sm">{{ commandKey }}K</UKbd>
                    <template #fallback>
                      <UKbd size="sm">⌘K</UKbd>
                    </template>
                  </ClientOnly>
                </template>
              </UButton>
            </UTooltip>

            <UTooltip text="Accessibility Settings" :delay-duration="300">
              <UButton
                icon="i-lucide-sliders"
                variant="ghost"
                color="primary"
                size="sm"
                aria-label="Open accessibility settings"
                @click="showAccessibilitySettings = true"
              />
            </UTooltip>

            <ClientOnly>
              <ThemeToggle />
            </ClientOnly>
          </div>
        </nav>

        <!-- Mobile Controls -->
        <div class="md:hidden flex items-center gap-3">
          <UTooltip text="Search (⌘K)" :delay-duration="300">
            <UButton
              icon="i-lucide-search"
              variant="ghost"
              color="primary"
              size="sm"
              @click="$emit('openSearch')"
            />
          </UTooltip>
          <ClientOnly>
            <ThemeToggle />
          </ClientOnly>
          
          <!-- Mobile Drawer -->
          <UButton 
            icon="i-lucide-menu" 
            variant="ghost" 
            color="primary" 
            size="sm"
            @click="isDrawerOpen = true"
            aria-label="Toggle menu" 
          />
          
          <ClientOnly>
            <UDrawer v-model:open="isDrawerOpen" side="right">
              <template #content>
              <div class="glass-strong h-full p-6 flex flex-col">
                <div class="flex items-center justify-between mb-8">
                  <span class="text-xl font-bold text-gradient">{{ siteConfig.title }}</span>
                  <UButton icon="i-lucide-x" variant="ghost" @click="isDrawerOpen = false" aria-label="Close menu" />
                </div>

                <nav class="flex flex-col gap-4 flex-1">
                  <UButton
                    v-for="(item, index) in navigationItems"
                    :key="index"
                    :to="item.path"
                    variant="ghost"
                    color="primary"
                    class="justify-start text-left"
                    @click="isDrawerOpen = false"
                  >
                    <UIcon :name="getNavIcon(item.name)" class="w-4 h-4 mr-3" />
                    {{ item.name }}
                  </UButton>
                  
                  <div class="border-t border-white/10 pt-4 mt-4">
                    <UButton 
                      block 
                      color="primary" 
                      variant="outline" 
                      class="mb-4"
                      @click="togglePortfolioType"
                    >
                      Switch to {{ siteConfig.type === 'dev' ? 'Tattoo' : 'Developer' }}
                      <UIcon name="i-lucide-repeat" class="w-4 h-4 ml-2" />
                    </UButton>
                    <UButton
                      icon="i-lucide-sliders"
                      variant="ghost"
                      color="primary"
                      block
                      class="mb-4"
                      @click="showAccessibilitySettings = true; isDrawerOpen = false"
                    >
                      Accessibility Settings
                    </UButton>
                  </div>
                </nav>
              </div>
            </template>
          </UDrawer>
          </ClientOnly>
        </div>
      </div>
    </UContainer>
    
    <!-- Accessibility Settings Modal -->
    <ClientOnly>
      <AccessibilitySettings v-if="showAccessibilitySettings" @close="showAccessibilitySettings = false" />
    </ClientOnly>
  </header>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';
import ThemeToggle from '~/components/common/ThemeToggle.vue';
import AccessibilitySettings from '~/components/AccessibilitySettings.vue';

// Emits
defineEmits<{
  openSearch: []
}>()

// Get site configuration
const siteConfig = useSiteConfig();
const router = useRouter();

// Command key display
const commandKey = computed(() => {
  if (!process.client) return '⌘';
  const platform = window.navigator.platform.toLowerCase();
  if (platform.includes('mac')) return '⌘';
  return 'Ctrl';
});

// Mobile drawer state
const isDrawerOpen = ref(false);
const showAccessibilitySettings = ref(false);

// Listen for accessibility settings event from command palette
onMounted(() => {
  window.addEventListener('open-accessibility-settings', () => {
    showAccessibilitySettings.value = true;
  });
});

onUnmounted(() => {
  window.removeEventListener('open-accessibility-settings', () => {
    showAccessibilitySettings.value = true;
  });
});

// Close drawer when route changes
const route = useRoute();
watch(() => route.path, () => {
  isDrawerOpen.value = false;
});

// Toggle between developer and tattoo portfolios
const togglePortfolioType = () => {
  const currentType = siteConfig.value.type;
  const newType = currentType === 'dev' ? 'tattoo' : 'dev';
  const baseRoute = newType === 'dev' ? '/dev' : '/tattoo';
  router.push(baseRoute);
  isDrawerOpen.value = false;
};

// Get navigation icons
const getNavIcon = (name: string): string => {
  const iconMap: Record<string, string> = {
    'Home': 'i-lucide-home',
    'About': 'i-lucide-user',
    'Projects': 'i-lucide-folder',
    'Open Source': 'i-lucide-git-branch',
    'Blog': 'i-lucide-pen-tool',
    'Contact': 'i-lucide-mail',
    'Gallery': 'i-lucide-image',
    'Testimonials': 'i-lucide-star'
  };
  return iconMap[name] || 'i-lucide-circle';
};

// Generate navigation items based on site type
const navigationItems = computed(() => {
  if (siteConfig.value.type === 'dev') {
    return [
      { name: 'Home', path: '/dev' },
      { name: 'About', path: '/dev/about' },
      { name: 'Projects', path: '/dev/projects' },
      { name: 'Open Source', path: '/dev/open-source' },
      { name: 'Blog', path: '/dev/blog' },
      { name: 'Contact', path: '/dev/contact' }
    ];
  } else if (siteConfig.value.type === 'tattoo') {
    return [
      { name: 'Home', path: '/tattoo' },
      { name: 'About', path: '/tattoo/about' },
      { name: 'Gallery', path: '/tattoo/gallery' },
      { name: 'Testimonials', path: '/tattoo/testimonials' },
      { name: 'Blog', path: '/tattoo/blog' },
      { name: 'Contact', path: '/tattoo/contact' }
    ];
  } else {
    return [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' }
    ];
  }
});

</script>
