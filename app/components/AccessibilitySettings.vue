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
        <UCard :ui="{ body: 'px-4 py-3 sm:px-5 sm:py-4', header: 'px-4 py-3 sm:px-5 sm:py-3', footer: 'px-4 py-3 sm:px-5 sm:py-3' }" class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 id="accessibility-modal-title" class="text-base font-semibold">Reading Preferences</h2>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                aria-label="Close reading preferences modal"
                @click="$emit('close')"
              />
            </div>
          </template>

          <div class="space-y-4">
            <!-- Reading Speed -->
            <UFormField
              :label="`Reading Speed: ${preferences.readingSpeed} WPM`"
              description="Adjust how fast you read to optimize the reading experience"
            >
              <USlider
                :model-value="preferences.readingSpeed"
                :min="100"
                :max="400"
                :step="25"
                tooltip
                color="primary"
                size="sm"
                @update:model-value="updateReadingSpeed"
              />
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>Slow (100)</span>
                <span>Average (250)</span>
                <span>Fast (400)</span>
              </div>
            </UFormField>

            <!-- Font Size -->
            <UFormField
              label="Font Size"
              description="Choose the text size that's most comfortable for you"
            >
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
            </UFormField>

            <!-- Line Spacing -->
            <UFormField
              label="Line Spacing"
              description="Adjust the spacing between lines for better readability"
            >
              <URadioGroup
                :model-value="preferences.lineSpacing"
                :options="[
                  { value: 'normal', label: 'Normal' },
                  { value: 'relaxed', label: 'Relaxed' },
                  { value: 'loose', label: 'Loose' }
                ]"
                @update:model-value="(value: string) => updateLineSpacing(value as 'normal' | 'relaxed' | 'loose')"
              />
            </UFormField>

            <!-- Accessibility Toggles -->
            <div class="space-y-3">
              <!-- Dyslexia Font -->
              <UFormField
                label="Dyslexia-friendly Font"
                description="Use OpenDyslexic font designed for improved readability"
              >
                <USwitch
                  :model-value="preferences.dyslexiaFont"
                  color="primary"
                  size="sm"
                  @update:model-value="updateDyslexiaFont"
                />
              </UFormField>

              <!-- High Contrast -->
              <UFormField
                label="High Contrast"
                description="Increase contrast for better visual distinction"
              >
                <USwitch
                  :model-value="preferences.highContrast"
                  color="primary"
                  size="sm"
                  @update:model-value="updateHighContrast"
                />
              </UFormField>

              <!-- Reduced Motion -->
              <UFormField
                label="Reduced Motion"
                description="Minimize animations and transitions for better accessibility"
              >
                <USwitch
                  :model-value="preferences.reducedMotion"
                  color="primary"
                  size="sm"
                  @update:model-value="updateReducedMotion"
                />
              </UFormField>
            </div>

            <!-- Color Vision -->
            <UFormField
              label="Color Vision Assistance"
              description="Apply color filters to accommodate different color vision types"
            >
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
            </UFormField>
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
        <UCard class="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border-white/20 dark:border-gray-700/20">
          <template #header>
            <h3 class="text-lg font-semibold">Welcome! Let's personalize your reading experience</h3>
          </template>

          <div class="space-y-6">
            <UFormField
              label="How fast do you read?"
              description="Choose your preferred reading speed to start with"
            >
              <URadioGroup
                :model-value="preferences.readingSpeed"
                :options="readingSpeedCategories.map((speed: any) => ({
                  value: speed.wpm,
                  label: `${speed.label} (${speed.wpm} WPM)`
                }))"
                @update:model-value="(value: string) => updateReadingSpeed(Number(value))"
              />
            </UFormField>

            <div class="space-y-4">
              <!-- Welcome Switches -->
              <UFormField
                label="Dyslexia-friendly Font"
                description="Use OpenDyslexic font for improved readability"
              >
                <USwitch
                  :model-value="preferences.dyslexiaFont"
                  color="primary"
                  size="sm"
                  @update:model-value="updateDyslexiaFont"
                />
              </UFormField>

              <UFormField
                label="High Contrast"
                description="Increase contrast for better visual distinction"
              >
                <USwitch
                  :model-value="preferences.highContrast"
                  color="primary"
                  size="sm"
                  @update:model-value="updateHighContrast"
                />
              </UFormField>

              <UFormField
                label="Reduced Motion"
                description="Minimize animations for better accessibility"
              >
                <USwitch
                  :model-value="preferences.reducedMotion"
                  color="primary"
                  size="sm"
                  @update:model-value="updateReducedMotion"
                />
              </UFormField>
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
/* All styling handled by Nuxt UI components */
</style>
