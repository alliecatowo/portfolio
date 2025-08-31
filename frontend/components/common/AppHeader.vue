<template>
  <header class="sticky top-0 z-50 glass backdrop-blur border-b border-primary/20" aria-label="Site header">
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

          <UTooltip text="Switch between portfolios" :kbds="['meta','S']" :delay-duration="300">
            <UButton
              color="primary"
              variant="ghost"
              size="sm"
              class="rounded-full frosty-pill px-3 py-1.5 whitespace-nowrap flex-shrink-0"
              aria-label="Switch between developer and tattoo portfolios"
              @click="togglePortfolioType"
            >
              <UIcon name="i-lucide-repeat" class="w-4 h-4 mr-1" />
              <span class="whitespace-nowrap">Switch to {{ siteConfig.type === 'dev' ? 'Tattoo' : 'Developer' }}</span>
            </UButton>
          </UTooltip>

          <div class="flex items-center gap-2 ml-2 pl-2 border-l border-white/10">
            <UTooltip text="Search" :kbds="['meta','K']" :delay-duration="300">
              <UButton
                variant="ghost"
                color="primary"
                size="sm"
                class="gap-2"
                aria-label="Open search"
                @click="$emit('openSearch')"
              >
                <UIcon name="i-lucide-search" class="w-4 h-4" />
                <UKbd class="hidden lg:inline-flex text-[11px]">⌘K</UKbd>
              </UButton>
            </UTooltip>

            <UTooltip text="Accessibility Settings" :kbds="['meta','A']" :delay-duration="300">
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
        <div class="md:hidden flex items-center gap-3">
          <UTooltip text="Search" :kbds="['meta','K']" :delay-duration="300">
            <UButton
              variant="ghost"
              color="primary"
              size="sm"
              class="gap-2"
              @click="$emit('openSearch')"
            >
              <UIcon name="i-lucide-search" class="w-4 h-4" />
              <UKbd class="hidden sm:inline-flex text-[11px]">⌘K</UKbd>
            </UButton>
          </UTooltip>
          <UColorModeSwitch 
            size="sm" 
            color="neutral"
            checked-icon="i-lucide-sun"
            unchecked-icon="i-lucide-moon"
            :ui="{ icon: 'size-3 text-black/80 dark:text-pink-400' }"
          />
          
          <!-- Mobile Drawer -->
          <UButton 
            icon="i-lucide-menu" 
            variant="ghost" 
            color="primary" 
            size="sm"
            aria-label="Toggle menu"
            @click="isDrawerOpen = true" 
          />
          
          <ClientOnly>
            <UDrawer v-model:open="isDrawerOpen" side="right">
              <template #content>
              <div class="glass-strong h-full p-6 flex flex-col">
                <div class="flex items-center justify-between mb-8">
                  <span class="text-xl font-bold text-gradient">{{ siteConfig.title }}</span>
                  <UButton icon="i-lucide-x" variant="ghost" aria-label="Close menu" @click="isDrawerOpen = false" />
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
import AccessibilitySettings from '~/components/AccessibilitySettings.vue';
import { useSiteConfig } from '~/utils/site-config';

// Emits
defineEmits<{
  openSearch: []
}>()

// Get site configuration
const siteConfig = useSiteConfig();
const router = useRouter();


// Mobile drawer state
const isDrawerOpen = ref(false);
const showAccessibilitySettings = useState<boolean>('showAccessibilitySettings', () => false);


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
