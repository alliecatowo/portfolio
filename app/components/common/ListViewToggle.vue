<template>
  <UTabs
    v-model="internal"
    :items="items"
    variant="pill"
    size="sm"
    color="primary"
    :ui="{ list: 'justify-end', trigger: 'px-2 py-1', content: 'hidden' }"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: 'grid' | 'rows'
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: 'grid' | 'rows'): void
}>()

const items = [
  { label: 'Cards', icon: 'i-lucide-layout-grid', value: 'grid' },
  { label: 'Rows', icon: 'i-lucide-list', value: 'rows' }
]

const internal = computed({
  get: () => props.modelValue,
  set: (v: 'grid' | 'rows') => emit('update:modelValue', v)
})
</script>

