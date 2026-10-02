<template>
  <UApp>
    <NuxtLayout>
      <div class="mx-auto max-w-2xl px-6 py-24 text-center">
        <p class="text-sm font-semibold text-primary">
          {{ error.statusCode }}
        </p>
        <h1 class="mt-3 text-4xl font-bold text-highlighted md:text-5xl">
          {{ notFound ? 'Page not found' : 'Something went wrong' }}
        </h1>
        <p class="mt-4 text-lg text-muted">
          {{ notFound ? 'That page does not exist, or it moved.' : 'An error got in the way of this page.' }}
        </p>
        <div class="mt-8 flex justify-center gap-3">
          <UButton to="/" size="lg" @click.prevent="clearError({ redirect: '/' })">
            Back to the home page
          </UButton>
          <UButton to="/projects/" size="lg" variant="outline" @click.prevent="clearError({ redirect: '/projects/' })">
            Browse projects
          </UButton>
        </div>
      </div>
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
