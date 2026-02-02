<template>
    <section id="basic-info" class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div class="flex items-center gap-3 mb-6">
            <div class="p-3 bg-blue-100 rounded-xl" aria-hidden="true">
                <span class="text-xl">&#128221;</span>
            </div>
            <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ t('basicInfoTitle') }}</h2>
                <p class="text-gray-600">{{ t('basicInfoDesc') }}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <label for="formula-name" class="label required">
                    {{ t('formulaName') }}
                </label>
                <input
                    id="formula-name"
                    v-model="formData.name"
                    type="text"
                    :placeholder="t('formulaNamePlaceholder')"
                    class="input-field"
                    :class="{ 'input-error': errors.name }"
                    required
                    aria-required="true"
                    aria-describedby="name-help"
                />
                <p v-if="errors.name" id="name-error" class="error-message">
                    {{ errors.name }}
                </p>
                <p id="name-help" class="help-text">
                    {{ t('formulaNameHelp') }}
                </p>
            </div>

            <div>
                <label for="formula-volume" class="label required">
                    {{ t('totalVolume') }}
                </label>
                <div class="relative">
                    <input
                        id="formula-volume"
                        v-model.number="formData.volume"
                        type="number"
                        min="1"
                        max="1000"
                        step="1"
                        class="input-field pr-12"
                        :class="{ 'input-error': errors.volume }"
                        required
                        aria-required="true"
                        aria-describedby="volume-help"
                    />
                    <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ml
                    </span>
                </div>
                <p v-if="errors.volume" id="volume-error" class="error-message">
                    {{ errors.volume }}
                </p>
                <p id="volume-help" class="help-text">
                    {{ t('volumeHelp') }}
                </p>
            </div>

            <div>
                <label for="formula-type" class="label">
                    {{ t('formulaTypeLabel') }}
                </label>
                <select
                    id="formula-type"
                    v-model="formData.formulaType"
                    class="input-field"
                >
                    <option v-for="option in formulaTypeOptions" :key="option.value" :value="option.value">
                        {{ t(option.labelKey) }}
                    </option>
                </select>
            </div>

            <div>
                <label for="formula-spf" class="label">
                    {{ t('spfLabel') }}
                </label>
                <input
                    id="formula-spf"
                    v-model.number="formData.spf"
                    type="number"
                    min="0"
                    max="50"
                    step="1"
                    class="input-field"
                />
                <p class="help-text">
                    {{ t('spfHelp') }}
                </p>
            </div>

            <div class="lg:col-span-2">
                <fieldset class="space-y-4">
                    <legend class="label required">
                        {{ t('skinTypeLabel') }}
                    </legend>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label
                            v-for="profile in skinProfilesOptions"
                            :key="profile.value"
                            :class="[
                                'skin-type-card',
                                formData.skinType === profile.value
                                    ? 'skin-type-card-selected'
                                    : 'skin-type-card-default'
                            ]"
                        >
                            <input
                                type="radio"
                                v-model="formData.skinType"
                                :value="profile.value"
                                class="sr-only"
                                required
                            />
                            <div class="flex flex-col items-center text-center p-4">
                                <span class="text-2xl mb-2" :aria-label="t(`skinTypeIcon.${profile.value}`)">{{ profile.icon }}</span>
                                <span class="font-medium capitalize">{{ t(`skinType.${profile.value}`) }}</span>
                                <span class="text-sm text-gray-500 mt-1">
                                    {{ t('oilPhaseLabel') }}: {{ profile.oil }}%
                                </span>
                                <span class="text-xs text-gray-400 mt-2">
                                    {{ t('maxActivesLabel', { count: profile.maxActives }) }}
                                </span>
                            </div>
                        </label>
                    </div>
                </fieldset>
            </div>
        </div>
    </section>
</template>

<script setup>
import { inject } from 'vue'
import { FORM_CONTEXT_KEY } from '../utils/constants'

const form = inject(FORM_CONTEXT_KEY)
const { t } = inject('i18n')
const { formData, errors, skinProfilesOptions, formulaTypeOptions } = form
</script>
