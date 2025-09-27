<template>
  <UModal
    v-model:open="isOpen"
    title="Reading Preferences"
    description="Customize your reading experience with font size, speed, and accessibility options"
  >
    <template #body>
      <div class="space-y-6">
        <!-- Reading Speed -->
        <div>
          <label class="block text-sm font-medium mb-2">
            Reading Speed: {{ preferences.readingSpeed }} WPM
          </label>
          <USlider
            :model-value="preferences.readingSpeed"
            :min="100"
            :max="500"
            :step="50"
            color="primary"
            @update:model-value="updateReadingSpeed"
          />
          <div class="flex justify-between text-xs text-muted mt-1">
            <span>Very Slow (100)</span>
            <span>Slow (200)</span>
            <span>Average (300)</span>
            <span>Fast (400)</span>
            <span>Very Fast (500)</span>
          </div>
        </div>

        <!-- Font Size -->
        <div>
          <label class="block text-sm font-medium mb-2">Font Size</label>
          <URadioGroup
            v-model="preferences.fontSize"
            :items="[
              { label: 'Small', value: 'small' },
              { label: 'Medium', value: 'medium' },
              { label: 'Large', value: 'large' },
              { label: 'Extra Large', value: 'x-large' }
            ]"
            placeholder="Select font size"
          />
        </div>

        <!-- Simple Toggles -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Dyslexia Font</span>
            <USwitch
              :model-value="preferences.dyslexiaFont"
              @update:model-value="updateDyslexiaFont"
            />
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">High Contrast</span>
            <USwitch
              :model-value="preferences.highContrast"
              @update:model-value="updateHighContrast"
            />
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Reduced Motion</span>
            <USwitch
              :model-value="preferences.reducedMotion"
              @update:model-value="updateReducedMotion"
            />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-3">
        <UButton variant="outline" color="gray" @click="resetPreferences">
          Reset
        </UButton>
        <UButton color="primary" @click="isOpen = false">
          Done
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useAccessibility } from '~/composables/useAccessibility'

const isOpen = useState<boolean>('showAccessibilitySettings', () => false)

const {
  preferences,
  resetPreferences,
  updateReadingSpeed,
  updateDyslexiaFont,
  updateHighContrast,
  updateReducedMotion,
} = useAccessibility()
</script>

<style scoped>
/* Ensure proper styling context */
</style>
