<template>
  <UColorModeButton
    size="sm"
    title="Toggle dark/light mode"
  >
    <template #fallback>
      <UButton
        loading
        variant="ghost"
        color="neutral"
        size="sm"
      />
    </template>
  </UColorModeButton>
</template>
