<template>
    <section id="preservatives" class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div class="flex items-center gap-3 mb-6">
            <div class="p-3 bg-red-50 rounded-xl" aria-hidden="true">
                <span class="text-xl">&#128737;</span>
            </div>
            <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ t('preservativeTitle') }}</h2>
                <p class="text-gray-600">{{ t('preservativeDesc') }}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label
                v-for="preservative in preservativeSystems"
                :key="preservative.id"
                class="preservative-card"
                :class="formData.preservativeSystem === preservative.id
                    ? 'preservative-card-selected'
                    : 'preservative-card-default'"
            >
                <input
                    type="radio"
                    v-model="formData.preservativeSystem"
                    :value="preservative.id"
                    class="sr-only"
                />
                <div class="p-4 space-y-2">
                    <div class="flex items-center gap-2">
                        <span class="text-xl">{{ preservative.icon }}</span>
                        <span class="font-semibold">{{ preservative.name }}</span>
                    </div>
                    <p v-if="preservative.description" class="text-sm text-gray-600">{{ preservative.description }}</p>
                    <p v-if="preservative.recommendation" class="text-xs text-gray-500">
                        {{ t('recommendation', { text: preservative.recommendation }) }}
                    </p>
                </div>
            </label>
        </div>
    </section>
</template>

<script setup>
import { inject } from 'vue'
import { FORM_CONTEXT_KEY } from '../utils/constants'

const form = inject(FORM_CONTEXT_KEY)
const { t } = inject('i18n')
const { preservativeSystems, formData } = form
</script>
