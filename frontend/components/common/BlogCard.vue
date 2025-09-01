<template>
  <article class="group glass-neutral rounded-xl overflow-hidden hover-lift">
    <NuxtLink :to="to" class="block no-underline text-inherit">
      <div class="aspect-video relative overflow-hidden">
        <NuxtImg
          preset="blogCard"
          :src="image"
          :alt="title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="sm:100vw md:50vw lg:33vw"
          loading="lazy"
        />
        
        <!-- Hover overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="absolute bottom-4 left-4">
            <span class="px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-sm font-medium rounded-full">
              Blog Post
            </span>
          </div>
          <div class="absolute bottom-4 right-4">
            <UIcon name="i-lucide-external-link" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      
      <div class="p-6">
        <div class="flex items-center gap-2 text-sm text-muted mb-3">
          <UBadge variant="soft" size="sm">{{ readTime }}</UBadge>
          <span>{{ formattedDate }}</span>
        </div>
        
        <h3 class="text-xl font-bold mb-3 text-default group-hover:text-primary transition-colors">
          {{ title }}
        </h3>
        
        <p v-if="description" class="text-muted mb-4 line-clamp-3">
          {{ description }}
        </p>
        
        <div v-if="tags?.length" class="flex flex-wrap gap-2 mb-4">
          <ColoredTag
            v-for="t in tags!.slice(0, 4)"
            :key="t"
            :tag="t"
          />
          <span v-if="tags!.length > 4" class="px-2 py-1 text-xs text-muted">
            +{{ tags!.length - 4 }} more
          </span>
        </div>
        
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center text-primary hover:text-primary-600 font-medium transition-colors group/link">
            View Post
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import ColoredTag from './ColoredTag.vue'

const props = defineProps<{
  title: string
  description?: string
  date?: string
  image: string
  to: string
  readTime: string
  tags?: string[]
}>()

const formattedDate = computed(() => {
  if (!props.date) return ''
  try { return new Date(props.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } catch { return props.date }
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
