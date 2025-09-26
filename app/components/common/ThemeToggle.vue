<template>
  <UColorModeButton
    size="md"
    variant="ghost"
    color="primary"
    square
    title="Toggle dark/light mode"
  >
    <template #fallback>
      <UButton
        loading
        variant="ghost"
        color="primary"
        size="md"
        square
      />
    </template>
  </UColorModeButton>
</template>
