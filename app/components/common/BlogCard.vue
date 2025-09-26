<template>
  <UBlogPost
    :title="title"
    :description="description"
    :date="date"
    :image="image"
    :to="to"
    :badge="readTime"
    variant="outline"
    orientation="vertical"
    class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20"
  >
    <!-- Custom footer for tags -->
    <template #footer>
      <div v-if="tags?.length" class="flex flex-wrap gap-2">
        <ColoredTag
          v-for="t in tags!.slice(0, 4)"
          :key="t"
          :tag="t"
        />
        <UBadge
          v-if="tags!.length > 4"
          variant="soft"
          color="gray"
          size="sm"
        >
          +{{ tags!.length - 4 }} more
        </UBadge>
      </div>
    </template>
  </UBlogPost>
</template>

<script setup lang="ts">
import ColoredTag from './ColoredTag.vue'

defineProps<{
  title: string
  description?: string
  date?: string
  image: string
  to: string
  readTime: string
  tags?: string[]
}>()
</script>

