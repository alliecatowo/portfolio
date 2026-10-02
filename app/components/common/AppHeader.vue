<template>
  <UHeader v-model:open="menuOpen">
    <template #title>
      <span class="text-2xl sm:text-3xl font-bold text-primary select-none">
        ALLISONS<span class="text-pink-500">.dev</span>
      </span>
    </template>

    <!-- Plain links: the bar only needs hover/active styling, not a Reka menu per item -->
    <nav id="site-navigation" aria-label="Main" class="flex items-center gap-1.5">
      <NuxtLink
        v-for="item in navigationItems"
        :key="item.to"
        :to="item.to"
        :active-class="item.exact ? '' : 'is-active'"
        :exact-active-class="item.exact ? 'is-active' : ''"
        :class="linkClass"
      >
        <UIcon :name="item.icon" class="size-5 shrink-0" />
        {{ item.label }}
      </NuxtLink>
    </nav>

    <template #right>
      <!-- Search and accessibility also live in the mobile menu body, so they only
           render from lg up (where the menu toggle is hidden). -->
      <LazyUContentSearchButton
        hydrate-on-media-query="(min-width: 1024px)"
        :collapsed="false"
        variant="ghost"
        color="primary"
        size="md"
        icon="i-lucide-search"
        class="hidden lg:inline-flex min-w-[10.3rem]"
      />

      <button
        type="button"
        class="hidden lg:inline-flex items-center justify-center rounded-md p-2 text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary transition-colors"
        aria-label="Open accessibility settings"
        @click="showAccessibilitySettings = true"
      >
        <UIcon name="i-lucide-accessibility" class="size-5" />
      </button>

      <UColorModeButton
        size="md"
        variant="ghost"
        color="primary"
        square
      />
    </template>

    <!-- Mobile menu body: only rendered while the menu is open -->
    <template #body>
      <nav aria-label="Mobile" class="-mx-2.5 flex flex-col">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          :active-class="item.exact ? '' : 'is-active'"
          :exact-active-class="item.exact ? 'is-active' : ''"
          :class="mobileLinkClass"
        >
          <UIcon :name="item.icon" class="size-5 shrink-0" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="pt-6 mt-6 border-t border-default grid grid-cols-2 gap-3">
        <UButton
          icon="i-lucide-accessibility"
          variant="outline"
          color="primary"
          size="md"
          @click="showAccessibilitySettings = true"
        >
          Accessibility
        </UButton>

        <LazyUContentSearchButton
          :collapsed="false"
          variant="outline"
          color="primary"
          size="md"
          icon="i-lucide-search"
        />
      </div>
    </template>
  </UHeader>

  <ClientOnly>
    <LazyAccessibilitySettings v-if="showAccessibilitySettings" @close="showAccessibilitySettings = false" />
  </ClientOnly>
</template>

<script setup lang="ts">
// The ⌘A shortcut that opens the accessibility dialog lives in useGlobalShortcuts.
const showAccessibilitySettings = useState<boolean>('showAccessibilitySettings', () => false)

// Closing the mobile menu (Esc, backdrop, link) drops focus on <body>; hand it back to the toggle
// so keyboard users keep their place.
const menuOpen = ref(false)
watch(menuOpen, (open) => {
  if (open) return
  // After the dialog's own focus scope has unmounted
  setTimeout(() => {
    if (document.activeElement === document.body || !document.activeElement) {
      document.querySelector<HTMLElement>('header button[aria-label="Open menu"]')?.focus()
    }
  }, 150)
})

const navigationItems = [
  { label: 'Home', to: '/', icon: 'i-lucide-home', exact: true },
  { label: 'About', to: '/about/', icon: 'i-lucide-user', exact: false },
  { label: 'Projects', to: '/projects/', icon: 'i-lucide-folder', exact: false },
  { label: 'Blog', to: '/blog/', icon: 'i-lucide-pen-tool', exact: false },
  { label: 'Contact', to: '/contact/', icon: 'i-lucide-mail', exact: false }
]

// `is-active` is set by NuxtLink (aria-current="page" on exact matches). The muted colour is
// conditional because Nuxt UI's `text-muted` utility would otherwise win over the active colour.
const linkClass = 'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary [&:not(.is-active)]:text-muted [&:not(.is-active)]:hover:text-highlighted [&.is-active]:text-primary'
const mobileLinkClass = 'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary [&:not(.is-active)]:text-muted [&:not(.is-active)]:hover:bg-elevated/50 [&:not(.is-active)]:hover:text-highlighted [&.is-active]:bg-elevated [&.is-active]:text-primary'
</script>
