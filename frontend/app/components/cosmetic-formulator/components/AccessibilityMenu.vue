<template>
    <div v-if="accessibility.showMenu" class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">{{ t('accessibility') }}</h2>
            <button
                type="button"
                class="text-gray-500 hover:text-gray-700"
                @click="accessibility.toggleMenu"
            >
                {{ t('close') }}
            </button>
        </div>

        <div class="mb-4">
            <label for="language-select" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('language') }}
            </label>
            <select
                id="language-select"
                v-model="locale"
                class="input-field"
            >
                <option v-for="option in languageOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button type="button" class="btn-secondary" @click="accessibility.increaseTextSize">
                {{ t('textIncrease') }}
            </button>
            <button type="button" class="btn-secondary" @click="accessibility.decreaseTextSize">
                {{ t('textDecrease') }}
            </button>
            <button type="button" class="btn-secondary" @click="accessibility.toggleHighContrast">
                {{ t('highContrast') }}: {{ accessibility.highContrast ? t('toggleOn') : t('toggleOff') }}
            </button>
            <button type="button" class="btn-secondary" @click="accessibility.toggleReducedMotion">
                {{ t('reducedMotion') }}: {{ accessibility.reducedMotion ? t('toggleOn') : t('toggleOff') }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { inject } from 'vue'
import { ACCESSIBILITY_CONTEXT_KEY } from '../utils/constants'

const accessibility = inject(ACCESSIBILITY_CONTEXT_KEY)
const { t, locale, languageOptions } = inject('i18n')
</script>
