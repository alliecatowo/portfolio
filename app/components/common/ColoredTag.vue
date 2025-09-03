<template>
  <UBadge
    :color="colorForTag(tag)"
    variant="soft"
    size="sm"
  >
    {{ tag }}
  </UBadge>
</template>

<script setup lang="ts">
const { tag } = defineProps<{
  tag: string
}>()

function colorForTag(t: string): 'primary'|'secondary'|'success'|'info'|'warning'|'error'|'neutral' {
  const colors = ['primary','secondary','success','info','warning','error'] as const
  let hash = 0
  for (let i=0;i<t.length;i++){ hash = (hash*31 + t.charCodeAt(i)) >>> 0 }
  const v = colors[hash % colors.length] as (typeof colors)[number] | undefined
  return v ?? 'neutral'
}
</script>