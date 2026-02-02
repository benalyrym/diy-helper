<template>
        <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
            <h2 class="font-bold text-lg mb-4 flex items-center gap-2">
                <span class="text-blue-600">&#128203;</span>
                {{ t('summaryTitle') }}
            </h2>

            <dl class="space-y-4">
                <div>
                    <dt class="text-sm text-gray-500">{{ t('summaryName') }}</dt>
                    <dd class="font-medium truncate" :class="{ 'text-red-500': !formData.name }">
                        {{ formData.name || t('notProvided') }}
                    </dd>
                </div>

                <div>
                    <dt class="text-sm text-gray-500">{{ t('summaryVolume') }}</dt>
                    <dd class="font-medium">{{ formData.volume }} ml</dd>
                </div>

                <div>
                    <dt class="text-sm text-gray-500">{{ t('summarySkin') }}</dt>
                    <dd class="font-medium capitalize">
                        {{ formData.skinType ? t(`skinType.${formData.skinType}`) : t('notSelected') }}
                    </dd>
                </div>

                <div v-if="regulatoryErrors.length > 0" class="bg-red-50 p-4 rounded-lg border border-red-200">
                    <dt class="text-sm text-red-700 font-semibold mb-2">{{ t('summaryAlerts') }}</dt>
                    <dd class="text-sm text-red-600">
                        <ul class="list-disc pl-4 space-y-1">
                            <li v-for="error in regulatoryErrors.slice(0, 2)" :key="error">{{ error }}</li>
                            <li v-if="regulatoryErrors.length > 2">{{ t('summaryMore', { count: regulatoryErrors.length - 2 }) }}</li>
                        </ul>
                    </dd>
                </div>
            </dl>

            <div class="mt-6 pt-6 border-t">
                <button
                    @click="generateReport"
                    class="w-full mb-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    :disabled="!isValid"
                    :aria-disabled="!isValid"
                >
                    <span>&#128196; {{ t('generatePdf') }}</span>
                </button>
                <button
                    @click="exportFormula"
                    class="w-full bg-gray-50 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                    <span>&#128228; {{ t('exportFormula') }}</span>
                </button>
            </div>
        </div>
</template>

<script setup>
import { inject } from 'vue'
import { FORM_CONTEXT_KEY } from '../utils/constants'

const form = inject(FORM_CONTEXT_KEY)
const { t } = inject('i18n')
const {
    formData,
    regulatoryErrors,
    generateReport,
    exportFormula,
    isValid
} = form
</script>
