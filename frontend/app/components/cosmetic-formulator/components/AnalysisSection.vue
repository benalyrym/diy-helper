<template>
    <section id="analysis" class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div class="flex items-center gap-3 mb-6">
            <div class="p-3 bg-indigo-100 rounded-xl" aria-hidden="true">
                <span class="text-xl">&#128202;</span>
            </div>
            <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ t('analysisTitle') }}</h2>
                <p class="text-gray-600">{{ t('analysisDesc') }}</p>
            </div>
        </div>

        <div class="mb-8">
            <h3 class="font-semibold text-lg mb-4">{{ t('phasesTitle') }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div v-for="phase in phases"
                     :key="phase.name"
                     class="phase-card"
                     :style="{ '--phase-color': phase.color }">
                    <div class="phase-card-header">
                        <span class="phase-icon">{{ phase.icon }}</span>
                        <span class="phase-name">{{ phase.name }}</span>
                    </div>
                    <div class="phase-values">
                        <span class="phase-percent">{{ phase.percent }}%</span>
                        <span class="phase-grams">{{ phase.grams }} g</span>
                    </div>
                    <div class="phase-bar">
                        <div class="phase-bar-fill"
                             :style="{ width: `${phase.percent}%` }"></div>
                    </div>
                    <div class="phase-details">
                        <span class="text-xs text-gray-500">{{ phase.description }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-8">
            <h3 class="font-semibold text-lg mb-4 flex items-center justify-between">
                <span>&#129534; {{ t('inciTitle') }}</span>
                <button
                    @click="copyINCI"
                    class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <span>&#128203; {{ t('copy') }}</span>
                </button>
            </h3>
            <div class="bg-gray-50 p-4 rounded-lg border">
                <p class="text-sm font-mono leading-relaxed" id="inci-list">
                    {{ inciList.join(', ') }}
                </p>
            </div>
            <p class="text-xs text-gray-500 mt-2">
                {{ t('inciNote') }}
            </p>
        </div>

        <div class="border rounded-xl overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b">
                <h3 class="font-semibold text-lg flex items-center gap-2">
                    <span>&#9989;</span>
                    {{ t('validationTitle') }}
                </h3>
            </div>
            <div class="p-6">
                <div class="space-y-4">
                    <div v-for="check in regulatoryChecks"
                         :key="check.name"
                         class="flex items-start gap-3">
                        <span :class="[
                            'flex-shrink-0 mt-1',
                            check.passed ? 'text-green-500' : 'text-red-500'
                        ]">
                            {{ check.passed ? '✓' : '✗' }}
                        </span>
                        <div class="flex-1">
                            <p class="font-medium">{{ check.name }}</p>
                            <p class="text-sm text-gray-600">{{ check.description }}</p>
                            <p v-if="!check.passed" class="text-sm text-red-600 mt-1">
                                {{ check.error }}
                            </p>
                        </div>
                    </div>
                </div>

                <div v-if="mandatoryMentions.length > 0" class="mt-6 pt-6 border-t">
                    <h4 class="font-semibold text-gray-900 mb-3">&#128221; {{ t('mandatoryMentions') }}</h4>
                    <ul class="space-y-2">
                        <li v-for="mention in mandatoryMentions"
                            :key="mention"
                            class="flex items-start gap-2 text-sm">
                            <span class="text-amber-500 mt-1">&#8226;</span>
                            <span>{{ mention }}</span>
                        </li>
                    </ul>
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
    phases,
    inciList,
    copyINCI,
    regulatoryChecks,
    mandatoryMentions
} = form
</script>
