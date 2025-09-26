<template>
  <UCard class="mb-6 backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20" variant="outline">
    <div class="flex flex-col gap-4">
      <!-- Tags Carousel -->
      <div>
      <UCarousel
        v-slot="{ item }"
        :items="carouselItems"
        arrows
        :prev="{ size: 'sm', variant: 'outline' }"
        :next="{ size: 'sm', variant: 'outline' }"
      >
          <UChip
            v-if="item.type === 'all'"
            :text="totalCount"
            :color="modelValue === 'all' ? 'primary' : 'neutral'"
            size="sm"
            position="top-right"
            class="cursor-pointer"
            @click="$emit('update:modelValue', 'all')"
          >
            <UBadge
              :variant="modelValue === 'all' ? 'solid' : 'soft'"
              color="primary"
              size="sm"
            >
              All
            </UBadge>
          </UChip>

          <UChip
            v-else
            :text="getTagCount(item.tag)"
            :color="modelValue === item.tag ? colorForTag(item.tag) : 'neutral'"
            size="sm"
            position="top-right"
            class="cursor-pointer"
            @click="$emit('update:modelValue', item.tag)"
          >
            <UBadge
              :variant="modelValue === item.tag ? 'solid' : 'soft'"
              :color="colorForTag(item.tag)"
              size="sm"
            >
              {{ item.tag }}
            </UBadge>
          </UChip>
        </UCarousel>
      </div>

      <!-- Sort & Clear Controls -->
      <UFieldGroup orientation="horizontal" class="justify-between">
        <USelectMenu
          v-model="selectedSortVal"
          :options="sortOptions"
          value-attribute="value"
          option-attribute="label"
          size="sm"
          variant="outline"
          searchable="false"
        >
          <template #leading>
            <UIcon :name="getSortIcon(selectedSortVal)" />
          </template>
        </USelectMenu>

        <UButton
          v-if="hasActiveFilters"
          variant="outline"
          color="gray"
          size="sm"
          icon="i-lucide-x"
          @click="clearFilters"
        >
          Clear
        </UButton>
        </UFieldGroup>
    </div>
  </UCard>
</template>

<script setup lang="ts">
type SortValue = 'newest' | 'oldest' | 'popular' | 'alphabetical'

interface CarouselItem {
  type: 'all' | 'tag'
  tag?: string
}

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

// Create carousel items with 'All' as first item
const carouselItems = computed<CarouselItem[]>(() => [
  { type: 'all' },
  ...props.tags.map(tag => ({ type: 'tag' as const, tag }))
])

// Check if any filters are active
const hasActiveFilters = computed(() =>
  props.modelValue !== 'all' || props.sort !== 'newest'
)

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
