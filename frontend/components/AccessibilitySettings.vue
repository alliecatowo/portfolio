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
            <div class="grid grid-cols-4 gap-2">
              <UButton
                v-for="size in ['small', 'medium', 'large', 'x-large']"
                :key="size"
                :variant="preferences.fontSize === size ? 'solid' : 'outline'"
                color="primary"
                size="sm"
                @click="updateFontSize(size as ('small' | 'medium' | 'large' | 'x-large'))"
              >
                {{ size === 'x-large' ? 'XL' : size.charAt(0).toUpperCase() + size.slice(1) }}
              </UButton>
            </div>
          </div>
          
          <!-- Line Spacing -->
          <div role="group" aria-labelledby="line-spacing-label">
            <span id="line-spacing-label" class="block text-sm font-medium mb-2">Line Spacing</span>
            <div class="grid grid-cols-3 gap-2">
              <UButton
                v-for="spacing in ['normal', 'relaxed', 'loose']"
                :key="spacing"
                :variant="preferences.lineSpacing === spacing ? 'solid' : 'outline'"
                color="primary"
                size="sm"
                @click="updateLineSpacing(spacing as ('normal' | 'relaxed' | 'loose'))"
              >
                {{ spacing.charAt(0).toUpperCase() + spacing.slice(1) }}
              </UButton>
            </div>
          </div>
          
          <!-- Accessibility Options -->
          <div class="space-y-2">
            <h4 class="text-sm font-medium mb-1">Accessibility</h4>
            <UCheckbox
              :model-value="preferences.dyslexiaFont"
              label="Dyslexia-friendly font"
              help="Uses OpenDyslexic font for better readability"
              size="xs"
              @update:model-value="(val) => updateDyslexiaFont(val === true)"
            />
            <UCheckbox
              :model-value="preferences.highContrast"
              label="High contrast"
              help="Increases text contrast for better visibility"
              size="xs"
              @update:model-value="(val) => updateHighContrast(val === true)"
            />
            <UCheckbox
              :model-value="preferences.reducedMotion"
              label="Reduce motion"
              help="Minimizes animations and transitions"
              size="xs"
              @update:model-value="(val) => updateReducedMotion(val === true)"
            />
          </div>
          
          <!-- Color Blind Mode -->
          <div>
            <label class="block text-sm font-medium mb-2" for="color-vision-select">Color Vision</label>
            <USelectMenu
              id="color-vision-select"
              :model-value="preferences.colorBlindMode"
              :options="[
                { label: 'Normal vision', value: 'none' },
                { label: 'Protanopia (Red-blind)', value: 'protanopia' },
                { label: 'Deuteranopia (Green-blind)', value: 'deuteranopia' },
                { label: 'Tritanopia (Blue-blind)', value: 'tritanopia' }
              ]"
              value-attribute="value"
              option-attribute="label"
              @update:model-value="(value) => updateColorBlindMode(typeof value === 'string' && ['none', 'protanopia', 'deuteranopia', 'tritanopia'].includes(value) ? value as AccessibilityPreferences['colorBlindMode'] : 'none')"
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
            <div class="grid grid-cols-2 gap-2">
              <UButton
                v-for="speed in readingSpeedCategories"
                :key="speed.wpm"
                :variant="preferences.readingSpeed === speed.wpm ? 'solid' : 'outline'"
                color="primary"
                size="sm"
                @click="updateReadingSpeed(speed.wpm)"
              >
                <div class="text-left">
                  <div class="font-medium">{{ speed.label }}</div>
                  <div class="text-xs opacity-75">{{ speed.wpm }} WPM</div>
                </div>
              </UButton>
            </div>
          </div>
          
          <div class="space-y-3">
            <UCheckbox
              :model-value="preferences.dyslexiaFont"
              label="Use dyslexia-friendly font"
              size="xs"
              @update:model-value="(val) => updateDyslexiaFont(val === true)"
            />
            <UCheckbox
              :model-value="preferences.highContrast"
              label="High contrast mode"
              size="xs"
              @update:model-value="(val) => updateHighContrast(val === true)"
            />
            <UCheckbox
              :model-value="preferences.reducedMotion"
              label="Reduce animations"
              size="xs"
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
import type { AccessibilityPreferences } from '~/composables/useAccessibility';

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
