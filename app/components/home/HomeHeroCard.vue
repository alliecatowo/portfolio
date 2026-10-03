<template>
  <UCard v-if="heroCard" class="glass-accent mb-12">
    <template #header>
      <div class="aspect-[16/9] md:aspect-[21/9] bg-gradient-dev relative overflow-hidden rounded-lg">
        <!--
          The LCP image. NuxtImg builds the srcset from `sizes` and image.screens/densities in
          nuxt.config.ts: the slot is the card, i.e. the viewport minus the page and card padding
          below 944px, and 846px (the section width minus the padding) above it.
        -->
        <NuxtImg
          v-if="heroCard.image"
          :src="heroCard.image"
          sizes="xs:80vw sm:88vw lg:846px"
          width="1200"
          height="675"
          :alt="heroCard.imageAlt || ''"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          class="object-cover w-full h-full"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end p-4 md:p-8">
          <div class="w-full">
            <h3 v-if="heroCard.title" id="main-dev-title" class="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-3 [text-shadow:0_1px_3px_rgb(0_0_0/0.6)]">
              {{ heroCard.title }}
            </h3>
            <p v-if="heroCard.description" class="text-white text-sm md:text-xl max-w-2xl [text-shadow:0_1px_3px_rgb(0_0_0/0.6)]">
              {{ heroCard.description }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <p v-if="heroCard.introduction" id="main-dev-description" class="text-default text-lg mb-8">
      {{ heroCard.introduction }}
    </p>

    <div v-if="heroCard.badges?.length" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div v-for="badge in heroCard.badges" :key="badge.title">
        <h4 class="font-semibold text-default mb-3">{{ badge.title }}</h4>
        <ul class="flex flex-wrap gap-2">
          <li v-for="item in badge.items" :key="item">
            <UBadge color="primary" variant="soft">{{ item }}</UBadge>
          </li>
        </ul>
      </div>
    </div>

    <template #footer>
      <div v-if="heroCard.buttons?.length" class="flex flex-col sm:flex-row gap-4">
        <UButton
          v-for="button in heroCard.buttons"
          :key="button.label"
          :to="button.to"
          :href="button.href"
          :target="button.external ? '_blank' : undefined"
          :rel="button.external ? 'noopener noreferrer' : undefined"
          :download="resolveDownloadAttr(button)"
          :color="(button.color || 'primary') as ButtonProps['color']"
          :variant="(button.variant || 'solid') as ButtonProps['variant']"
          :size="(button.size || 'md') as ButtonProps['size']"
          :leading-icon="button.icon && button.iconPosition !== 'trailing' ? button.icon : undefined"
          :trailing-icon="button.icon && button.iconPosition === 'trailing' ? button.icon : undefined"
          block
          class="flex-1"
        >
          {{ button.label }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

// The card is static except for its links, so the page hydrates it on first interaction (hover, focus,
// click) instead of in the load-time hydration pass. The LCP image is plain server-rendered HTML.
/* eslint-disable @typescript-eslint/no-explicit-any */
defineProps<{ heroCard: any }>()
/* eslint-enable @typescript-eslint/no-explicit-any */

const resolveDownloadAttr = (button: { download?: boolean | string, href?: string }) => {
  if (typeof button.download === 'string' && button.download.trim().length > 0) {
    return button.download
  }

  if (button.download) {
    const filename = button.href?.split('/').filter(Boolean).pop()
    return filename || undefined
  }

  return undefined
}
</script>
