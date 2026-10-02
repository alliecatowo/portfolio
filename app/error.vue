<template>
  <UApp>
    <NuxtLayout>
      <CommonErrorState
        :status-code="error.statusCode"
        :not-found="notFound"
        @navigate="(path: string) => clearError({ redirect: path })"
      />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

// Replaces Nuxt's built-in error page, which injects an inline <script> at runtime that the site's
// CSP (hashed inline scripts only) would block.
const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)

// Not useSiteSeo: this page answers for every unknown URL, so it has no canonical of its own
useHead(() => ({
  title: notFound.value ? 'Page not found – Allison Coleman' : 'Something went wrong – Allison Coleman',
  meta: [{ name: 'robots', content: 'noindex' }]
}))
</script>
