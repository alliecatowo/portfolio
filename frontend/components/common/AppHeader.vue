<template>
  <header class="sticky top-0 z-50 glass backdrop-blur border-b border-primary/20" aria-label="Site header">
    <UContainer class="py-3">
      <div class="flex items-center justify-between gap-3">
        <!-- Logo / Title -->
        <NuxtLink :to="siteConfig.type === 'dev' ? '/dev' : '/'" class="no-underline group">
          <div class="flex items-center gap-3">
            <span class="text-2xl sm:text-3xl font-bold text-primary select-none transition-all duration-300 group-hover:text-gradient">
              ALLISONS<span class="text-pink-500">.dev</span>
            </span>
            <div class="hidden sm:flex items-center gap-2">
              <UBadge color="primary" variant="soft" size="xs">5+ Years</UBadge>
              <UBadge color="primary" variant="soft" size="xs">20+ Projects</UBadge>
            </div>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav id="site-navigation" class="hidden md:flex items-center gap-3 overflow-x-auto flex-nowrap" role="navigation" aria-label="Main navigation">
          <div class="flex items-center gap-2 flex-nowrap">
            <UTooltip 
              v-for="(item, index) in navigationItems"
              :key="index"
              :text="`Navigate to ${item.name}`"
              :delay-duration="300"
            >
              <UButton
                :to="item.path"
                :variant="route.path === item.path ? 'outline' : 'ghost'"
                color="primary"
                size="sm"
                class="text-sm px-2 rounded-md whitespace-nowrap transition-colors duration-200 flex-shrink-0"
                
                :aria-label="`Navigate to ${item.name}`"
                :aria-current="route.path === item.path ? 'page' : undefined"
              >
                <span class="whitespace-nowrap">{{ item.name }}</span>
              </UButton>
            </UTooltip>
          </div>

          <!-- Portfolio toggle removed - now dev-only -->

          <div class="flex items-center gap-2 ml-2 pl-2 border-l border-white/10">
            <UTooltip text="Search" :kbds="['meta', 'k']" :delay-duration="300">
              <UButton
                variant="ghost"
                color="primary"
                size="sm"
                class="gap-2"
                aria-label="Open search"
                @click="$emit('openSearch')"
              >
                <UIcon name="i-lucide-search" class="w-4 h-4" />
                <UKbd size="sm" class="hidden lg:inline-flex">{{ isMac ? '⌘K' : 'Ctrl+K' }}</UKbd>
              </UButton>
            </UTooltip>

            <UTooltip text="Accessibility Settings" :kbds="['meta', 'a']" :delay-duration="300">
              <UButton
                icon="i-lucide-sliders"
                variant="ghost"
                color="primary"
                size="sm"
                aria-label="Open accessibility settings"
                @click="showAccessibilitySettings = true"
              />
            </UTooltip>

            <UTooltip text="Toggle theme" :kbds="['meta','T']" :delay-duration="300">
              <UColorModeSwitch 
                size="sm" 
                color="neutral"
                checked-icon="i-lucide-sun"
                unchecked-icon="i-lucide-moon"
                :ui="{ icon: 'size-3 text-black/80 dark:text-pink-400' }"
              />
            </UTooltip>
          </div>
        </nav>

        <!-- Mobile Controls -->
        <div class="md:hidden flex items-center gap-2">
          <UTooltip text="Search" :kbds="['meta', 'k']" :delay-duration="300">
            <UButton
              variant="ghost"
              color="primary"
              size="sm"
              icon="i-lucide-search"
              aria-label="Open search"
              class="p-2"
              @click="$emit('openSearch')"
            />
          </UTooltip>
          
          <!-- Enhanced Mobile Theme Toggle -->
          <UTooltip text="Toggle theme" :delay-duration="300">
            <UColorModeSwitch 
              size="md" 
              color="primary"
              checked-icon="i-lucide-sun"
              unchecked-icon="i-lucide-moon"
              :ui="{ 
                base: 'rounded-full p-2 transition-all duration-200 hover:scale-105',
                icon: 'w-4 h-4 text-primary-600 dark:text-primary-400',
                track: 'bg-primary-100 dark:bg-primary-900/50',
                thumb: 'bg-white dark:bg-primary-600 shadow-lg'
              }"
            />
          </UTooltip>
          
          <!-- Mobile Menu Button -->
          <UButton 
            icon="i-lucide-menu" 
            variant="ghost" 
            color="primary" 
            size="sm"
            aria-label="Toggle menu"
            class="p-2"
            @click="isDrawerOpen = true" 
          />
          
          <ClientOnly>
            <UDrawer v-model:open="isDrawerOpen" side="right">
              <template #content>
              <div class="glass-strong h-full p-6 flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
                <!-- Mobile Menu Header -->
                <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-3">
                    <span class="text-xl font-bold text-gradient">{{ siteConfig.title }}</span>
                    <UBadge color="primary" variant="soft" size="xs">Mobile</UBadge>
                  </div>
                  <UButton 
                    icon="i-lucide-x" 
                    variant="ghost" 
                    color="primary"
                    size="sm"
                    aria-label="Close menu" 
                    class="p-2 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/50"
                    @click="isDrawerOpen = false" 
                  />
                </div>

                <!-- Navigation Links -->
                <nav class="flex flex-col gap-2 flex-1">
                  <UButton
                    v-for="(item, index) in navigationItems"
                    :key="index"
                    :to="item.path"
                    :variant="route.path === item.path ? 'soft' : 'ghost'"
                    color="primary"
                    size="lg"
                    class="justify-start text-left py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                    @click="isDrawerOpen = false"
                  >
                    <UIcon :name="getNavIcon(item.name)" class="w-5 h-5 mr-4" />
                    <span class="font-medium">{{ item.name }}</span>
                  </UButton>
                  
                  <!-- Mobile Menu Footer -->
                  <div class="border-t border-gray-200/50 dark:border-gray-700/50 pt-6 mt-6 space-y-3">
                    <UButton
                      icon="i-lucide-sliders"
                      variant="ghost"
                      color="primary"
                      size="lg"
                      block
                      class="justify-start py-3 px-4 rounded-xl"
                      @click="showAccessibilitySettings = true; isDrawerOpen = false"
                    >
                      <span class="font-medium ml-4">Accessibility Settings</span>
                    </UButton>
                    
                    <!-- Theme Toggle in Mobile Menu -->
                    <div class="flex items-center justify-between py-3 px-4">
                      <div class="flex items-center gap-3">
                        <UIcon name="i-lucide-palette" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <span class="font-medium ml-1">Theme</span>
                      </div>
                      <UColorModeSwitch 
                        size="md" 
                        color="primary"
                        checked-icon="i-lucide-sun"
                        unchecked-icon="i-lucide-moon"
                        :ui="{ 
                          base: 'rounded-full transition-all duration-300 hover:scale-110',
                          icon: 'w-4 h-4 text-primary-600 dark:text-primary-400',
                          track: 'bg-primary-100 dark:bg-primary-900/50',
                          thumb: 'bg-white dark:bg-primary-600 shadow-lg'
                        }"
                      />
                    </div>
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
import AccessibilitySettings from '~/components/AccessibilitySettings.vue';
import { useSiteConfig } from '~/utils/site-config';

// Emits
defineEmits<{
  openSearch: []
}>()

// Get site configuration
const siteConfig = useSiteConfig();

// Platform detection for keyboard shortcuts
const isMac = computed(() => {
  if (import.meta.client) {
    return /Mac|iPhone|iPod|iPad/i.test(navigator.platform || navigator.userAgent);
  }
  return false;
});


// Mobile drawer state
const isDrawerOpen = ref(false);
const showAccessibilitySettings = useState<boolean>('showAccessibilitySettings', () => false);


// Close drawer when route changes
const route = useRoute();
watch(() => route.path, () => {
  isDrawerOpen.value = false;
});

// Portfolio toggle function removed - now dev-only

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
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Projects', path: '/projects' },
      { name: 'Open Source', path: '/open-source' },
      { name: 'Blog', path: '/blog' },
      { name: 'Contact', path: '/contact' }
    ];
  } else {
    // Dual mode navigation
    return [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Projects', path: '/projects' },
      { name: 'Blog', path: '/blog' },
      { name: 'Contact', path: '/contact' }
    ];
  }
});

</script>
