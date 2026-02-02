<template>
    <section id="aqueous-phase" class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div class="flex items-center gap-3 mb-6">
            <div class="p-3 bg-blue-50 rounded-xl" aria-hidden="true">
                <span class="text-xl">&#128167;</span>
            </div>
            <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ t('aqueousTitle') }}</h2>
                <p class="text-gray-600">{{ t('aqueousDesc') }}</p>
            </div>
        </div>

            <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{{ t('aqueousEstimate') }}</span>
                <span class="font-medium">{{ waterPhase.toFixed(1) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    class="h-2.5 rounded-full bg-blue-500"
                    :style="{ width: `${Math.min(Math.max(waterPhase, 0), 100)}%` }"
                ></div>
            </div>
            <p class="text-xs text-gray-500 mt-2">
                {{ t('aqueousApprox', { grams: waterPhaseGrams, volume: formData.volume }) }}
            </p>
        </div>
    </section>
</template>

<script setup>
import { inject } from 'vue'
import { FORM_CONTEXT_KEY } from '../utils/constants'

const form = inject(FORM_CONTEXT_KEY)
const { t } = inject('i18n')
const { waterPhase, waterPhaseGrams, formData } = form
</script>
