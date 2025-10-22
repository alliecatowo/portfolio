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
    <!-- Custom body slot for tags -->
    <template #body>
      <div class="min-w-0 flex-1 flex flex-col">
        <h3 v-if="title" class="text-xl text-pretty font-semibold text-highlighted mb-2">{{ title }}</h3>
        <p v-if="description" class="mt-1 text-base text-pretty text-muted mb-3">{{ description }}</p>

        <!-- Tags -->
        <div v-if="tags?.length" class="flex flex-wrap gap-2 mb-3">
          <UBadge
            v-for="t in tags!.slice(0, 4)"
            :key="t"
            variant="soft"
            size="sm"
            class="capitalize"
          >
            {{ t }}
          </UBadge>
          <UBadge
            v-if="tags!.length > 4"
            variant="soft"
            color="gray"
            size="sm"
          >
            +{{ tags!.length - 4 }} more
          </UBadge>
        </div>

        <div class="pt-4 mt-auto flex flex-wrap gap-x-3 gap-y-1.5">
          <slot name="authors" />
        </div>
      </div>
    </template>
  </UBlogPost>
</template>

<script setup lang="ts">
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

