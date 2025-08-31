<template>
  <div class="flex items-center gap-2 w-full">
    <UButton
      variant="ghost"
      color="neutral"
      size="xs"
      icon="i-lucide-chevron-left"
      aria-label="Scroll tags left"
      @click="scrollBy(-1)"
    />

    <div ref="scroller" class="relative flex-1 overflow-x-auto faded-scroll py-1">
      <div class="flex items-center gap-2 w-max">
        <UButton
          :variant="modelValue === 'all' ? 'solid' : 'soft'"
          color="primary"
          size="xs"
          class="rounded-full px-3 py-1 whitespace-nowrap"
          @click="$emit('update:modelValue', 'all')"
        >
          All
        </UButton>
        <UButton
          v-for="t in tags"
          :key="t"
          :variant="modelValue === t ? 'solid' : 'soft'"
          :color="(colorForTag(t) as any)"
          size="xs"
          class="rounded-full px-3 py-1 whitespace-nowrap"
          @click="$emit('update:modelValue', t)"
        >
          {{ t }}
        </UButton>
      </div>
    </div>

    <UButton
      variant="ghost"
      color="neutral"
      size="xs"
      icon="i-lucide-chevron-right"
      aria-label="Scroll tags right"
      @click="scrollBy(1)"
    />

    <USelectMenu
      :items="sortOptions"
      value-key="value"
      label-key="label"
      v-model="selectedSortVal"
      size="xs"
      class="min-w-[9rem]"
      :search-input="false"
    />
  </div>
</template>

<script setup lang="ts">
type SortValue = 'newest' | 'oldest'

const props = defineProps<{
  tags: string[]
  modelValue: string
  sort: SortValue
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
  { label: 'Newest first', value: 'newest' },
  { label: 'Oldest first', value: 'oldest' }
]

const selectedSortVal = ref<SortValue>(props.sort)

watch(() => props.sort, (v) => { selectedSortVal.value = v })
watch(selectedSortVal, (v) => { emit('update:sort', v) })

function colorForTag(t: string): 'primary'|'secondary'|'success'|'info'|'warning'|'error'|'neutral' {
  const colors = ['primary','secondary','success','info','warning','error'] as const
  let hash = 0
  for (let i=0;i<t.length;i++){ hash = (hash*31 + t.charCodeAt(i)) >>> 0 }
  const v = colors[hash % colors.length] as (typeof colors)[number] | undefined
  return v ?? 'neutral'
}
</script>
