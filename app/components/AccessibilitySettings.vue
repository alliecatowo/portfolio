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
            >
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
          
          <!-- Dyslexia Font -->
          <div role="group" aria-labelledby="dyslexia-font-label">
            <span id="dyslexia-font-label" class="block text-sm font-medium mb-2">Dyslexia-friendly font</span>
            <URadioGroup
              :model-value="String(preferences.dyslexiaFont)"
              :options="[
                { value: 'false', label: 'Standard font' },
                { value: 'true', label: 'OpenDyslexic font' }
              ]"
              @update:model-value="(value: string) => updateDyslexiaFont(value === 'true')"
            />
          </div>
          
          <!-- High Contrast -->
          <div role="group" aria-labelledby="high-contrast-label">
            <span id="high-contrast-label" class="block text-sm font-medium mb-2">Contrast</span>
            <URadioGroup
              :model-value="String(preferences.highContrast)"
              :options="[
                { value: 'false', label: 'Normal contrast' },
                { value: 'true', label: 'High contrast' }
              ]"
              @update:model-value="(value: string) => updateHighContrast(value === 'true')"
            />
          </div>
          
          <!-- Reduced Motion -->
          <div role="group" aria-labelledby="reduced-motion-label">
            <span id="reduced-motion-label" class="block text-sm font-medium mb-2">Motion</span>
            <URadioGroup
              :model-value="String(preferences.reducedMotion)"
              :options="[
                { value: 'false', label: 'Normal animations' },
                { value: 'true', label: 'Reduced motion' }
              ]"
              @update:model-value="(value: string) => updateReducedMotion(value === 'true')"
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
              :options="readingSpeedCategories.map((speed: any) => ({
                value: speed.wpm,
                label: `${speed.label} (${speed.wpm} WPM)`
              }))"
              @update:model-value="(value: string) => updateReadingSpeed(Number(value))"
            />
          </div>
          
          <div class="space-y-4">
            <div role="group" aria-labelledby="welcome-dyslexia-font-label">
              <span id="welcome-dyslexia-font-label" class="block text-sm font-medium mb-2">Font type</span>
              <URadioGroup
                :model-value="String(preferences.dyslexiaFont)"
                :options="[
                  { value: 'false', label: 'Standard font' },
                  { value: 'true', label: 'Dyslexia-friendly font' }
                ]"
                @update:model-value="(value: string) => updateDyslexiaFont(value === 'true')"
              />
            </div>
            
            <div role="group" aria-labelledby="welcome-high-contrast-label">
              <span id="welcome-high-contrast-label" class="block text-sm font-medium mb-2">Contrast</span>
              <URadioGroup
                :model-value="String(preferences.highContrast)"
                :options="[
                  { value: 'false', label: 'Normal contrast' },
                  { value: 'true', label: 'High contrast' }
                ]"
                @update:model-value="(value: string) => updateHighContrast(value === 'true')"
              />
            </div>
            
            <div role="group" aria-labelledby="welcome-reduced-motion-label">
              <span id="welcome-reduced-motion-label" class="block text-sm font-medium mb-2">Motion</span>
              <URadioGroup
                :model-value="String(preferences.reducedMotion)"
                :options="[
                  { value: 'false', label: 'Normal animations' },
                  { value: 'true', label: 'Reduced motion' }
                ]"
                @update:model-value="(value: string) => updateReducedMotion(value === 'true')"
              />
            </div>
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
/* No custom overwrites needed - using native radio groups */
</style>
