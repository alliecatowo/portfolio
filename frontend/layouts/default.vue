<template>
  <div class="min-h-screen flex flex-col">
    <ClientOnly>
      <AppHeader />
      <template #fallback>
        <!-- Simple fallback header for SSR -->
        <header class="py-4 shadow-md dark:shadow-gray-800">
          <div class="container-custom">
            <div class="text-2xl font-bold">Allison's Portfolio</div>
          </div>
        </header>
      </template>
    </ClientOnly>
    <main class="flex-grow">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/common/AppHeader.vue';
import AppFooter from '~/components/common/AppFooter.vue';
</script> 