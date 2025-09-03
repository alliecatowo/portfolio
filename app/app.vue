<template>
  <UApp>
    <TooltipProvider>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </TooltipProvider>
  </UApp>
</template>

<script setup>
import { TooltipProvider } from 'reka-ui'
// UApp is auto-imported by @nuxt/ui
</script>