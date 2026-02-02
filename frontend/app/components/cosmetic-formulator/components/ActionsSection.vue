<template>
    <section id="actions" class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ t('actionsTitle') }}</h2>
                <p class="text-gray-600">
                    {{ t('actionsDesc') }}
                </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
                <div v-if="!isValid" class="mb-4 sm:mb-0">
                    <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p class="text-sm text-red-700 font-medium">
                            {{ t('fixErrors') }}
                        </p>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <button
                        @click="saveDraft"
                        class="btn-secondary"
                        :disabled="saving">
                        <span v-if="saving">&#9203;</span>
                        <span>&#128190; {{ t('saveDraft') }}</span>
                    </button>

                    <button
                        @click="save"
                        :disabled="!isValid || saving"
                        class="btn-primary"
                        :class="{ 'opacity-50 cursor-not-allowed': !isValid }"
                        :aria-disabled="!isValid || saving">
                        <template v-if="saving">
                            <span class="animate-spin mr-2">&#9203;</span>
                            {{ t('saving') }}
                        </template>
                        <template v-else>
                            <span>&#9989;</span>
                            {{ isEditMode ? t('updateFormula') : t('saveFormula') }}
                        </template>
                    </button>

                    <button
                        @click="cancel"
                        type="button"
                        class="btn-outline">
                        <span>&#8617;</span>
                        {{ t('cancel') }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="isEditMode" class="mt-6 p-4 bg-blue-50 rounded-lg">
            <div class="flex items-center gap-2 text-sm text-blue-700">
                <span>&#128197;</span>
                <span>
                    {{ t('lastUpdate') }}: {{ formatDate(props.initialData.updatedAt) }}
                </span>
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
    props,
    saving,
    isValid,
    isEditMode,
    saveDraft,
    save,
    cancel,
    formatDate
} = form
</script>
