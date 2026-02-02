<template>
    <div class="preservative-form">
        <!-- Sélection du type -->
        <div class="preservative-selection">
            <fieldset class="selection-fieldset">
                <legend class="fieldset-legend">
                    Type de système de conservation
                </legend>

                <div class="preservative-options">
                    <PreservativeOption
                        v-for="preservative in preservatives"
                        :key="preservative.id"
                        :preservative="preservative"
                        :selected="system === preservative.id"
                        @select="system = preservative.id"
                    />
                </div>
            </fieldset>
        </div>

        <!-- Configuration Cosgard -->
        <div v-if="system === 'cosgard'" class="cosgard-config">
            <div class="config-header">
                <h4 class="config-title">Configuration Cosgard</h4>
                <p class="config-description">
                    Dosage recommandé: 0.5-1.0% selon la formule
                </p>
            </div>

            <div class="config-controls">
                <div class="dosage-control">
                    <label for="cosgard-percent" class="dosage-label">
                        Concentration Cosgard (%)
                    </label>
                    <div class="dosage-input-wrapper">
                        <input
                            id="cosgard-percent"
                            v-model.number="cosgardPercentModel"
                            type="number"
                            min="0.5"
                            max="1.0"
                            step="0.1"
                            class="dosage-input"
                        />
                        <span class="dosage-suffix">%</span>
                    </div>
                </div>

                <div class="dosage-slider-wrapper">
                    <input
                        type="range"
                        v-model.number="cosgardPercentModel"
                        min="0.5"
                        max="1.0"
                        step="0.05"
                        class="dosage-slider"
                    />
                    <div class="slider-labels">
                        <span>0.5%</span>
                        <span>0.75%</span>
                        <span>1.0%</span>
                    </div>
                </div>

                <div class="quick-dosage">
                    <button
                        type="button"
                        @click="cosgardPercentModel = 0.5"
                        class="quick-btn"
                        :class="{ 'btn-active': cosgardPercentModel === 0.5 }"
                    >
                        Minimum (0.5%)
                    </button>
                    <button
                        type="button"
                        @click="cosgardPercentModel = 0.7"
                        class="quick-btn"
                        :class="{ 'btn-active': cosgardPercentModel === 0.7 }"
                    >
                        Recommandé (0.7%)
                    </button>
                    <button
                        type="button"
                        @click="cosgardPercentModel = 1.0"
                        class="quick-btn"
                        :class="{ 'btn-active': cosgardPercentModel === 1.0 }"
                    >
                        Maximum (1.0%)
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import PreservativeOption from './PreservativeOption.vue'

const props = defineProps({
    system: String,
    cosgardPercent: Number,
    preservatives: Array
})

const emit = defineEmits([
    'update:system',
    'update:cosgard-percent'
])

const system = computed({
    get: () => props.system,
    set: (value) => emit('update:system', value)
})

const cosgardPercentModel = computed({
    get: () => props.cosgardPercent,
    set: (value) => emit('update:cosgard-percent', value)
})
</script>

<style scoped>
.preservative-form {
    @apply space-y-6;
}

.selection-fieldset {
    @apply border-0 p-0 m-0;
}

.fieldset-legend {
    @apply text-lg font-bold text-gray-900 mb-4;
}

.preservative-options {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.cosgard-config {
    @apply p-6 bg-red-50 rounded-lg border border-red-200;
}

.config-header {
    @apply mb-6;
}

.config-title {
    @apply text-xl font-bold text-gray-900 mb-1;
}

.config-description {
    @apply text-red-700 text-sm;
}

.config-controls {
    @apply space-y-6;
}

.dosage-control {
    @apply space-y-2;
}

.dosage-label {
    @apply block text-sm font-medium text-gray-700;
}

.dosage-input-wrapper {
    @apply relative max-w-xs;
}

.dosage-input {
    @apply w-full px-4 py-3 border border-red-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
    pr-12 text-lg;
}

.dosage-suffix {
    @apply absolute right-4 top-1/2 transform -translate-y-1/2
    text-gray-500 font-bold;
}

.dosage-slider-wrapper {
    @apply space-y-2;
}

.dosage-slider {
    @apply w-full h-3 bg-gradient-to-r from-red-200 via-red-400 to-red-200
    rounded-lg appearance-none cursor-pointer;
}

.dosage-slider::-webkit-slider-thumb {
    @apply appearance-none h-6 w-6 rounded-full bg-red-600
    border-4 border-white shadow-lg;
}

.dosage-slider::-moz-range-thumb {
    @apply h-6 w-6 rounded-full bg-red-600
    border-4 border-white shadow-lg;
}

.slider-labels {
    @apply flex justify-between text-sm text-gray-600 px-2;
}

.quick-dosage {
    @apply flex flex-wrap gap-2;
}

.quick-btn {
    @apply px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg
    hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500
    transition-colors;
}

.quick-btn.btn-active {
    @apply bg-red-600 text-white border-red-600;
}
</style>