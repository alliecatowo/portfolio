<template>
  <UCard :ui="{ body: 'p-4', header: 'p-0', footer: 'p-3' }" class="overflow-hidden hover-lift">
    <NuxtLink :to="to" class="block no-underline text-inherit">
      <div class="aspect-video w-full overflow-hidden">
        <NuxtImg
          preset="blogCard"
          :src="image"
          :alt="title"
          class="w-full h-full object-cover"
          sizes="sm:100vw md:50vw lg:33vw"
          loading="lazy"
        />
      </div>
      <div class="p-4">
        <div class="flex items-center gap-2 text-sm text-muted mb-2">
          <UBadge variant="soft" size="sm">{{ readTime }}</UBadge>
          <span>{{ formattedDate }}</span>
        </div>
        <h3 class="text-lg font-bold leading-snug mb-1">{{ title }}</h3>
        <p v-if="description" class="text-sm text-muted line-clamp-2">{{ description }}</p>
        <div v-if="tags?.length" class="flex flex-wrap gap-2 mt-3">
          <UBadge
            v-for="t in tags!.slice(0,4)"
            :key="t"
            :color="(colorForTag(t) as any)"
            variant="soft"
            size="sm"
          >{{ t }}</UBadge>
        </div>
      </div>
    </NuxtLink>
  </UCard>
</template>

<script setup lang="ts">
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

function colorForTag(t: string): 'primary'|'secondary'|'success'|'info'|'warning'|'error'|'neutral' {
  const colors = ['primary','secondary','success','info','warning','error'] as const
  let hash = 0
  for (let i=0;i<t.length;i++){ hash = (hash*31 + t.charCodeAt(i)) >>> 0 }
  return colors[hash % colors.length]
}
</script>
