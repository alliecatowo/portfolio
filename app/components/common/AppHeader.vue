<template>
  <UHeader>
    <!-- Custom title with badges -->
    <template #title>
      <div class="flex items-center gap-3">
        <span class="text-2xl sm:text-3xl font-bold text-primary select-none">
          ALLISONS<span class="text-pink-500">.dev</span>
        </span>
        <div class="hidden sm:flex items-center gap-2">
          <UBadge color="primary" variant="soft" size="xs">5+ Years</UBadge>
          <UBadge color="primary" variant="soft" size="xs">20+ Projects</UBadge>
        </div>
      </div>
    </template>

    <!-- Main navigation -->
    <UNavigationMenu
      :items="navigationItems"
      orientation="horizontal"
      variant="link"
      color="primary"
    />

    <!-- Right side actions -->
    <template #right>
      <UContentSearchButton
        :collapsed="false"
        variant="ghost"
        color="primary"
        size="md"
        icon="i-lucide-search"
      />

      <UTooltip text="Accessibility Settings" :kbds="['meta', 'a']">
        <UButton
          icon="i-lucide-accessibility"
          variant="ghost"
          color="primary"
          size="md"
          square
          :ui="{ rounded: 'rounded-lg' }"
          aria-label="Open accessibility settings"
          @click="showAccessibilitySettings = true"
        />
      </UTooltip>

      <UTooltip text="Toggle theme" :kbds="['meta','t']">
        <UColorModeButton
          size="md"
          variant="ghost"
          color="primary"
          square
          :ui="{ rounded: 'rounded-lg' }"
        />
      </UTooltip>
    </template>

    <!-- Mobile menu body -->
    <template #body>
      <UNavigationMenu
        :items="navigationItems"
        orientation="vertical"
        variant="pill"
        color="primary"
        class="-mx-2.5"
      />

      <!-- Mobile actions -->
      <div class="pt-6 mt-6 border-t border-default space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <UButton
            icon="i-lucide-accessibility"
            variant="outline"
            color="primary"
            size="md"
            :ui="{ rounded: 'rounded-lg' }"
            @click="showAccessibilitySettings = true"
          >
            Accessibility
          </UButton>

          <UContentSearchButton
            :collapsed="false"
            variant="outline"
            color="primary"
            size="md"
            icon="i-lucide-search"
          />
        </div>

        <UCard variant="outline" class="p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-palette" class="w-5 h-5 text-primary" />
              <span class="text-sm font-medium">Theme</span>
            </div>
            <UColorModeButton
              size="md"
              variant="ghost"
              color="primary"
              :ui="{ rounded: 'rounded-full' }"
            />
          </div>
        </UCard>
      </div>
    </template>
  </UHeader>

  <!-- Accessibility Settings Modal -->
  <ClientOnly>
    <AccessibilitySettings v-if="showAccessibilitySettings" @close="showAccessibilitySettings = false" />
  </ClientOnly>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import AccessibilitySettings from '~/components/AccessibilitySettings.vue'

const showAccessibilitySettings = useState<boolean>('showAccessibilitySettings', () => false)
const route = useRoute()

const navigationItems = computed((): NavigationMenuItem[] => [
  { label: 'Home', to: '/', icon: 'i-lucide-home', active: route.path === '/' },
  { label: 'About', to: '/about', icon: 'i-lucide-user', active: route.path === '/about' },
  { label: 'Projects', to: '/projects', icon: 'i-lucide-folder', active: route.path.startsWith('/projects') },
  { label: 'Blog', to: '/blog', icon: 'i-lucide-pen-tool', active: route.path.startsWith('/blog') },
  { label: 'Contact', to: '/contact', icon: 'i-lucide-mail', active: route.path === '/contact' }
])

defineShortcuts({
  meta_a: () => { showAccessibilitySettings.value = true },
  escape: () => { showAccessibilitySettings.value = false }
})
</script>
