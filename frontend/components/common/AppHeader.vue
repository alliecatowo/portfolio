<template>
  <header class="sticky top-0 z-40 backdrop-blur border-b border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/70">
    <UContainer class="py-3">
      <div class="flex items-center justify-between gap-3">
        <!-- Logo / Title -->
        <NuxtLink :to="siteConfig.type === 'dev' ? '/dev' : siteConfig.type === 'tattoo' ? '/tattoo' : '/'" class="no-underline">
          <span class="text-xl sm:text-2xl font-bold text-primary">
            {{ siteConfig.title }}
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-3">
          <div class="flex items-center gap-1">
            <UButton
              v-for="(item, index) in navigationItems"
              :key="index"
              :to="item.path"
              variant="link"
              color="primary"
              class="text-sm"
            >
              {{ item.name }}
            </UButton>
          </div>

          <UButton
            color="primary"
            variant="solid"
            size="sm"
            class="text-white bg-gradient-to-r from-[--ui-primary] to-pink-600 dark:to-pink-400 border-0 shadow-sm hover:opacity-90"
            @click="togglePortfolioType"
          >
            Switch to {{ siteConfig.type === 'dev' ? 'Tattoo' : 'Developer' }}
          </UButton>

          <AdminNav />
          <ClientOnly>
            <ThemeToggle />
          </ClientOnly>
        </nav>

        <!-- Mobile Controls -->
        <div class="md:hidden flex items-center gap-2">
          <ClientOnly>
            <ThemeToggle />
          </ClientOnly>
          <UButton icon="i-heroicons-bars-3" variant="ghost" color="primary" @click="isMenuOpen = !isMenuOpen" aria-label="Toggle menu" />
        </div>
      </div>
    </UContainer>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="md:hidden border-t border-gray-200/60 dark:border-gray-800/60 bg-white dark:bg-gray-950">
      <UContainer class="py-3">
        <div class="flex flex-col gap-2">
          <NuxtLink
            v-for="(item, index) in navigationItems"
            :key="index"
            :to="item.path"
            class="py-2 no-underline text-primary hover:opacity-80"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </NuxtLink>

          <div class="pt-2">
            <UButton block color="primary" variant="soft" @click="togglePortfolioType">
              Switch to {{ siteConfig.type === 'dev' ? 'Tattoo' : 'Developer' }}
            </UButton>
          </div>
          <div class="pt-1">
            <AdminNav />
          </div>
        </div>
      </UContainer>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useSiteConfig } from '~/utils/site-config';
import AdminNav from '~/components/common/AdminNav.vue';
import ThemeToggle from '~/components/common/ThemeToggle.vue';

// Get site configuration
const siteConfig = useSiteConfig();
const router = useRouter();

// Mobile menu state
const isMenuOpen = ref(false);

// Close menu when route changes
const route = useRoute();
watch(() => route.path, () => {
  isMenuOpen.value = false;
});

// Toggle between developer and tattoo portfolios
const togglePortfolioType = () => {
  const currentType = siteConfig.value.type;
  const newType = currentType === 'dev' ? 'tattoo' : 'dev';
  const baseRoute = newType === 'dev' ? '/dev' : '/tattoo';
  router.push(baseRoute);
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

// Map to Nuxt UI navigation format
const navLinks = computed(() => navigationItems.value.map(i => ({ label: i.name, to: i.path })));
</script>
