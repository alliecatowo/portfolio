<template>
  <div>
    <!-- Settings Modal -->
    <UModal 
      :open="true" 
      :ui="{ 
        overlay: 'bg-gray-900/50 dark:bg-gray-950/80',
        content: 'w-full sm:max-w-lg max-h-[85vh] overflow-y-auto',
      }" 
      aria-labelledby="accessibility-modal-title"
      role="dialog"
      aria-modal="true"
      @update:open="$emit('close')"
    >
      <template #content>
        <UCard :ui="{ body: 'px-4 py-3 sm:px-5 sm:py-4', header: 'px-4 py-3 sm:px-5 sm:py-3', footer: 'px-4 py-3 sm:px-5 sm:py-3' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 id="accessibility-modal-title" class="text-base font-semibold">Reading Preferences</h2>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="xs"
                aria-label="Close reading preferences modal"
                @click="$emit('close')"
              />
            </div>
          </template>
        
          <div class="space-y-4">
          <!-- Reading Speed -->
          <div role="group" aria-labelledby="speed-label">
            <label id="speed-label" class="block text-sm font-medium mb-2" for="speed-slider">
              Reading Speed: {{ preferences.readingSpeed }} WPM
            </label>
            <input
              id="speed-slider"
              type="range"
              :value="preferences.readingSpeed"
              min="100"
              max="400"
              step="25"
              aria-label="Reading speed in words per minute"
              aria-valuemin="100"
              aria-valuemax="400"
              :aria-valuenow="preferences.readingSpeed"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              @input="updateReadingSpeed(Number(($event.target as HTMLInputElement)?.value))"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>Slow</span>
              <span>Average</span>
              <span>Fast</span>
            </div>
          </div>
          
          <!-- Font Size -->
          <div role="group" aria-labelledby="font-size-label">
            <span id="font-size-label" class="block text-sm font-medium mb-2">Font Size</span>
            <URadioGroup
              :model-value="preferences.fontSize"
              :options="[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
                { value: 'x-large', label: 'Extra Large' }
              ]"
              @update:model-value="(value: string) => updateFontSize(value as 'small' | 'medium' | 'large' | 'x-large')"
            />
          </div>
          
          <!-- Line Spacing -->
          <div role="group" aria-labelledby="line-spacing-label">
            <span id="line-spacing-label" class="block text-sm font-medium mb-2">Line Spacing</span>
            <URadioGroup
              :model-value="preferences.lineSpacing"
              :options="[
                { value: 'normal', label: 'Normal' },
                { value: 'relaxed', label: 'Relaxed' },
                { value: 'loose', label: 'Loose' }
              ]"
              @update:model-value="(value: string) => updateLineSpacing(value as 'normal' | 'relaxed' | 'loose')"
            />
          </div>
          
          <!-- Accessibility Options -->
          <div class="space-y-2">
            <h4 class="text-sm font-medium mb-1">Accessibility</h4>
            <UCheckbox
              :model-value="preferences.dyslexiaFont"
              label="Dyslexia-friendly font"
              help="Uses OpenDyslexic font for better readability"
              size="sm"
              class="small-checkbox"
              @update:model-value="(val) => updateDyslexiaFont(val === true)"
            />
            <UCheckbox
              :model-value="preferences.highContrast"
              label="High contrast"
              help="Increases text contrast for better visibility"
              size="sm"
              class="small-checkbox"
              @update:model-value="(val) => updateHighContrast(val === true)"
            />
            <UCheckbox
              :model-value="preferences.reducedMotion"
              label="Reduce motion"
              help="Minimizes animations and transitions"
              size="sm"
              class="small-checkbox"
              @update:model-value="(val) => updateReducedMotion(val === true)"
            />
          </div>
          
          <!-- Color Vision -->
          <div role="group" aria-labelledby="color-vision-label">
            <span id="color-vision-label" class="block text-sm font-medium mb-2">Color Vision</span>
            <URadioGroup
              :model-value="preferences.colorBlindMode"
              :options="[
                { value: 'none', label: 'Normal vision' },
                { value: 'protanopia', label: 'Protanopia (Red-blind)' },
                { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
                { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' }
              ]"
              @update:model-value="(value: string) => updateColorBlindMode(value as 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia')"
            />
          </div>
          </div>
        
          <template #footer>
            <div class="flex gap-2">
              <UButton
                variant="ghost"
                color="neutral"
                class="flex-1"
                @click="resetPreferences"
              >
                Reset to Defaults
              </UButton>
              <UButton
                color="primary"
                class="flex-1"
                @click="$emit('close')"
              >
                Done
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
    
    <!-- First Visit Welcome Modal -->
    <UModal v-model:open="isFirstVisit" :prevent-close="false">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Welcome! Let's personalize your reading experience</h3>
          </template>
        
          <div class="space-y-6">
          <div role="group" aria-labelledby="reading-speed-label">
            <span id="reading-speed-label" class="block text-sm font-medium mb-2">How fast do you read?</span>
            <URadioGroup
              :model-value="preferences.readingSpeed"
              :options="readingSpeedCategories.map(speed => ({
                value: speed.wpm,
                label: `${speed.label} (${speed.wpm} WPM)`
              }))"
              @update:model-value="(value: string) => updateReadingSpeed(Number(value))"
            />
          </div>
          
          <div class="space-y-3">
            <UCheckbox
              :model-value="preferences.dyslexiaFont"
              label="Use dyslexia-friendly font"
              size="sm"
              class="small-checkbox"
              @update:model-value="(val) => updateDyslexiaFont(val === true)"
            />
            <UCheckbox
              :model-value="preferences.highContrast"
              label="High contrast mode"
              size="sm"
              class="small-checkbox"
              @update:model-value="(val) => updateHighContrast(val === true)"
            />
            <UCheckbox
              :model-value="preferences.reducedMotion"
              label="Reduce animations"
              size="sm"
              class="small-checkbox"
              @update:model-value="(val) => updateReducedMotion(val === true)"
            />
          </div>
          </div>
        
          <template #footer>
            <div class="flex justify-between">
              <UButton
                variant="ghost"
                color="neutral"
                @click="dismissFirstVisit"
              >
                Skip
              </UButton>
              <UButton
                color="primary"
                @click="dismissFirstVisit"
              >
                Start Reading
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useAccessibility } from '~/composables/useAccessibility';

defineEmits<{
  close: []
}>();

const {
  preferences,
  isFirstVisit,
  readingSpeedCategories,
  resetPreferences,
  dismissFirstVisit,
  updateReadingSpeed,
  updateDyslexiaFont,
  updateHighContrast,
  updateFontSize,
  updateLineSpacing,
  updateReducedMotion,
  updateColorBlindMode,
} = useAccessibility();
</script>

<style scoped>
/* Override Nuxt UI checkbox sizes to be more reasonable */
:deep(.small-checkbox .form-checkbox) {
  width: 1rem;
  height: 1rem;
}

:deep(.small-checkbox) {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

/* Ensure proper spacing and alignment */
:deep(.small-checkbox .label) {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

:deep(.small-checkbox .help-text) {
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgb(107 114 128);
  margin-top: 0.25rem;
}

.dark :deep(.small-checkbox .help-text) {
  color: rgb(156 163 175);
}
</style>
