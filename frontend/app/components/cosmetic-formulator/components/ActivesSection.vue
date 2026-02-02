<template>
    <section id="actives" class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div class="flex items-center gap-3 mb-6">
            <div class="p-3 bg-purple-100 rounded-xl" aria-hidden="true">
                <span class="text-xl">&#129514;</span>
            </div>
            <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ t('activesTitle') }}</h2>
                <p class="text-gray-600">{{ t('activesDesc') }}</p>
            </div>
            <div class="ml-auto text-sm text-gray-500">
                {{ t('activesCount', { count: enabledActivesCount, max: skinProfiles[formData.skinType]?.maxActives || 3 }) }}
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1" for="active-search">
                    {{ t('activesSearchLabel') }}
                </label>
                <input
                    id="active-search"
                    v-model="activeSearch"
                    type="text"
                    class="input-field"
                    :placeholder="t('activesSearchPlaceholder')"
                />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="active-type">
                    {{ t('activesTypeLabel') }}
                </label>
                <select
                    id="active-type"
                    v-model="activeTypeFilter"
                    class="input-field"
                >
                    <option v-for="option in activeTypeOptions" :key="option.value" :value="option.value">
                        {{ t(option.labelKey) }}
                    </option>
                </select>
            </div>
        </div>

        <div class="space-y-4">
            <div v-for="active in filteredActives" :key="active.key" class="active-card">
                <div class="flex items-start gap-4">
                    <div class="flex items-center h-6">
                        <input
                            :id="`active-${active.key}`"
                            type="checkbox"
                            v-model="active.enabled"
                            :disabled="!active.enabled && enabledActivesCount >= skinProfiles[formData.skinType]?.maxActives"
                            class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            :aria-describedby="`active-description-${active.key}`"
                        />
                    </div>

                    <div class="flex-1">
                        <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                            <label :for="`active-${active.key}`" class="font-medium text-gray-900 sm:w-64">
                                {{ active.label }}
                            </label>

                            <div v-if="active.enabled" class="flex-1 space-y-2">
                                <div class="flex justify-between">
                                    <span class="text-sm text-gray-600">{{ t('dosage') }}</span>
                                    <span class="text-sm font-medium">
                                        {{ active.percent }}%
                                    </span>
                                </div>

                                <div class="flex items-center gap-4">
                                    <input
                                        :id="`active-range-${active.key}`"
                                        type="range"
                                        v-model.number="active.percent"
                                        :min="active.min"
                                        :max="active.max"
                                        step="0.1"
                                        class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        :class="getActiveRangeClass(active)"
                                        :aria-valuetext="t('percentValue', { value: active.percent })"
                                    />

                                    <input
                                        type="number"
                                        v-model.number="active.percent"
                                        :min="active.min"
                                        :max="active.max"
                                        step="0.1"
                                        class="w-24 input-field text-center"
                                        :class="{ 'input-error': active.percent < active.min || active.percent > active.max }"
                                    />

                                    <span class="text-sm text-gray-500 min-w-16 text-right">
                                        {{ grams(active.percent) }} g
                                    </span>
                                </div>

                                <div class="flex justify-between text-xs text-gray-500">
                                    <span>{{ t('minLabel') }}: {{ active.min }}%</span>
                                    <span>{{ t('recommendedRange') }}</span>
                                    <span>{{ t('maxLabel') }}: {{ active.max }}%</span>
                                </div>
                            </div>

                            <div v-else class="text-sm text-gray-500">
                                {{ t('rangeValue', { min: active.min, max: active.max }) }}
                            </div>
                        </div>

                        <p :id="`active-description-${active.key}`" class="text-sm text-gray-600 mt-2">
                            {{ active.description }}
                            <span class="block text-xs text-gray-500 mt-1">
                                INCI: {{ active.inci }}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="tooManyActives" class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg" role="alert">
            <div class="flex">
                <div class="flex-shrink-0">
                    <span class="text-amber-500 text-xl">&#9888;</span>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-amber-800">
                        {{ t('tooManyActivesTitle') }}
                    </h3>
                    <div class="mt-2 text-sm text-amber-700">
                        <p>
                            {{ t('tooManyActivesText', {
                                skin: t(`skinType.${formData.skinType}`),
                                max: skinProfiles[formData.skinType]?.maxActives
                            }) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { inject } from 'vue'
import { FORM_CONTEXT_KEY } from '../utils/constants'

const form = inject(FORM_CONTEXT_KEY)
const { t } = inject('i18n')
const {
    formData,
    actives,
    filteredActives,
    activeSearch,
    activeTypeFilter,
    activeTypeOptions,
    skinProfiles,
    enabledActivesCount,
    getActiveRangeClass,
    grams,
    tooManyActives
} = form
</script>
