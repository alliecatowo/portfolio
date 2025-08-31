<template>
  <div class="glass-accent rounded-xl p-4 mb-6">
    <div class="flex flex-col gap-4">
      <!-- Tags Row -->
      <div class="flex items-center gap-2 w-full">
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          icon="i-lucide-chevron-left"
          aria-label="Scroll tags left"
          class="flex-shrink-0"
          @click="scrollBy(-1)"
        />

        <div ref="scroller" class="flex-1 overflow-x-auto">
          <div class="flex items-center gap-2 pb-2" style="width: max-content;">
            <UBadge
              :variant="modelValue === 'all' ? 'solid' : 'soft'"
              color="primary"
              size="sm"
              class="cursor-pointer transition-all hover:scale-105 whitespace-nowrap"
              @click="$emit('update:modelValue', 'all')"
            >
              All ({{ totalCount }})
            </UBadge>
            
            <UBadge
              v-for="t in tags"
              :key="t"
              :variant="modelValue === t ? 'solid' : 'soft'"
              :color="(colorForTag(t) as any)"
              size="sm"
              class="cursor-pointer transition-all hover:scale-105 whitespace-nowrap"
              @click="$emit('update:modelValue', t)"
            >
              {{ t }} ({{ getTagCount(t) }})
            </UBadge>
          </div>
        </div>

        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          icon="i-lucide-chevron-right"
          aria-label="Scroll tags right"
          class="flex-shrink-0"
          @click="scrollBy(1)"
        />
      </div>

      <!-- Sort & Clear Row -->
      <div class="flex items-center justify-between">
        <USelectMenu
          v-model="selectedSortVal"
          :items="sortOptions"
          value-key="value"
          label-key="label"
          size="sm"
          class="min-w-[140px]"
          :search-input="false"
        >
          <template #leading>
            <UIcon :name="getSortIcon(selectedSortVal)" class="w-4 h-4" />
          </template>
        </USelectMenu>

        <UButton
          v-if="modelValue !== 'all' || selectedSortVal !== 'newest'"
          variant="ghost"
          color="neutral"
          size="sm"
          icon="i-lucide-x"
          @click="clearFilters"
        >
          Clear
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type SortValue = 'newest' | 'oldest' | 'popular' | 'alphabetical'

const props = defineProps<{
  tags: string[]
  modelValue: string
  sort: SortValue
  totalCount?: number
  filteredCount?: number
  tagCounts?: Record<string, number>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:sort': [value: SortValue]
}>()

const scroller = ref<HTMLDivElement | null>(null)

function scrollBy(dir: number) {
  const el = scroller.value
  if (!el) return
  el.scrollBy({ left: dir * 180, behavior: 'smooth' })
}

const sortOptions = [
  { label: 'Newest First', value: 'newest', icon: 'i-lucide-arrow-down' },
  { label: 'Oldest First', value: 'oldest', icon: 'i-lucide-arrow-up' },
  { label: 'Most Popular', value: 'popular', icon: 'i-lucide-trending-up' },
  { label: 'A-Z', value: 'alphabetical', icon: 'i-lucide-arrow-up-a-z' }
]

const selectedSortVal = ref<SortValue>(props.sort)

watch(() => props.sort, (v) => { selectedSortVal.value = v })
watch(selectedSortVal, (v) => { emit('update:sort', v) })

function clearFilters() {
  emit('update:modelValue', 'all')
  emit('update:sort', 'newest')
}

function getTagCount(tag: string): number {
  return props.tagCounts?.[tag] || 0
}

function getSortIcon(sortValue: SortValue): string {
  const iconMap = {
    newest: 'i-lucide-arrow-down',
    oldest: 'i-lucide-arrow-up', 
    popular: 'i-lucide-trending-up',
    alphabetical: 'i-lucide-arrow-up-a-z'
  }
  return iconMap[sortValue] || 'i-lucide-arrow-down'
}

function colorForTag(t: string): 'primary'|'secondary'|'success'|'info'|'warning'|'error'|'neutral' {
  const colors = ['primary','secondary','success','info','warning','error'] as const
  let hash = 0
  for (let i=0;i<t.length;i++){ hash = (hash*31 + t.charCodeAt(i)) >>> 0 }
  const v = colors[hash % colors.length] as (typeof colors)[number] | undefined
  return v ?? 'neutral'
}
</script>
