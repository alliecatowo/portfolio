<template>
  <div>
    <!-- Settings Modal -->
    <UModal 
      :model-value="true" 
      @update:model-value="$emit('close')" 
      :ui="{ 
        overlay: 'bg-gray-900/50 dark:bg-gray-950/80'
      }"
    >
      <UCard :ui="{ body: 'px-4 py-3 sm:px-5 sm:py-4', header: 'px-4 py-3 sm:px-5 sm:py-3', footer: 'px-4 py-3 sm:px-5 sm:py-3' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">Reading Preferences</h3>
            <UButton
              @click="$emit('close')"
              icon="i-lucide-x"
              variant="ghost"
              color="neutral"
              size="xs"
            />
          </div>
        </template>
        
        <div class="space-y-4">
          <!-- Reading Speed -->
          <div>
            <label class="block text-sm font-medium mb-2">
              Reading Speed: {{ preferences.readingSpeed }} WPM
            </label>
            <input
              type="range"
              :value="preferences.readingSpeed"
              @input="updateReadingSpeed(Number(($event.target as HTMLInputElement)?.value))"
              min="100"
              max="400"
              step="25"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>Slow</span>
              <span>Average</span>
              <span>Fast</span>
            </div>
          </div>
          
          <!-- Font Size -->
          <div>
            <label class="block text-sm font-medium mb-2">Font Size</label>
            <div class="grid grid-cols-4 gap-2">
              <UButton
                v-for="size in ['small', 'medium', 'large', 'x-large']"
                :key="size"
                @click="updateFontSize(size as ('small' | 'medium' | 'large' | 'x-large'))"
                :variant="preferences.fontSize === size ? 'solid' : 'outline'"
                color="primary"
                size="sm"
              >
                {{ size === 'x-large' ? 'XL' : size.charAt(0).toUpperCase() + size.slice(1) }}
              </UButton>
            </div>
          </div>
          
          <!-- Line Spacing -->
          <div>
            <label class="block text-sm font-medium mb-2">Line Spacing</label>
            <div class="grid grid-cols-3 gap-2">
              <UButton
                v-for="spacing in ['normal', 'relaxed', 'loose']"
                :key="spacing"
                @click="updateLineSpacing(spacing as ('normal' | 'relaxed' | 'loose'))"
                :variant="preferences.lineSpacing === spacing ? 'solid' : 'outline'"
                color="primary"
                size="sm"
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
              @update:model-value="(val) => updateDyslexiaFont(val as boolean)"
              label="Dyslexia-friendly font"
              help="Uses OpenDyslexic font for better readability"
            />
            <UCheckbox
              :model-value="preferences.highContrast"
              @update:model-value="(val) => updateHighContrast(val as boolean)"
              label="High contrast"
              help="Increases text contrast for better visibility"
            />
            <UCheckbox
              :model-value="preferences.reducedMotion"
              @update:model-value="(val) => updateReducedMotion(val as boolean)"
              label="Reduce motion"
              help="Minimizes animations and transitions"
            />
          </div>
          
          <!-- Color Blind Mode -->
          <div>
            <label class="block text-sm font-medium mb-2">Color Vision</label>
            <USelectMenu
              :model-value="preferences.colorBlindMode"
              @update:model-value="updateColorBlindMode"
              :options="[
                { label: 'Normal vision', value: 'none' },
                { label: 'Protanopia (Red-blind)', value: 'protanopia' },
                { label: 'Deuteranopia (Green-blind)', value: 'deuteranopia' },
                { label: 'Tritanopia (Blue-blind)', value: 'tritanopia' }
              ]"
              value-attribute="value"
              option-attribute="label"
            />
          </div>
        </div>
        
        <template #footer>
          <div class="flex gap-2">
            <UButton
              @click="resetPreferences"
              variant="ghost"
              color="neutral"
              class="flex-1"
            >
              Reset to Defaults
            </UButton>
            <UButton
              @click="$emit('close')"
              color="primary"
              class="flex-1"
            >
              Done
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
    
    <!-- First Visit Welcome Modal -->
    <UModal v-model="isFirstVisit" :prevent-close="false">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Welcome! Let's personalize your reading experience</h3>
        </template>
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">How fast do you read?</label>
            <div class="grid grid-cols-2 gap-2">
              <UButton
                v-for="speed in readingSpeedCategories"
                :key="speed.wpm"
                @click="updateReadingSpeed(speed.wpm)"
                :variant="preferences.readingSpeed === speed.wpm ? 'solid' : 'outline'"
                color="primary"
                size="sm"
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
              @update:model-value="(val) => updateDyslexiaFont(val as boolean)"
              label="Use dyslexia-friendly font"
            />
            <UCheckbox
              :model-value="preferences.highContrast"
              @update:model-value="(val) => updateHighContrast(val as boolean)"
              label="High contrast mode"
            />
            <UCheckbox
              :model-value="preferences.reducedMotion"
              @update:model-value="(val) => updateReducedMotion(val as boolean)"
              label="Reduce animations"
            />
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-between">
            <UButton
              @click="dismissFirstVisit"
              variant="ghost"
              color="neutral"
            >
              Skip
            </UButton>
            <UButton
              @click="dismissFirstVisit"
              color="primary"
            >
              Start Reading
            </UButton>
          </div>
        </template>
      </UCard>
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