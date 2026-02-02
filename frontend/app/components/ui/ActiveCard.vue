<template>
    <div class="active-card" :class="{ 'card-enabled': active.enabled }">
        <div class="card-checkbox">
            <input
                :id="`active-${active.key}`"
                type="checkbox"
                v-model="localActive.enabled"
                :disabled="!localActive.enabled && isLimitReached"
                class="checkbox-input"
                @change="updateActive"
            />
        </div>

        <div class="card-content">
            <div class="card-header">
                <div class="header-info">
                    <label :for="`active-${active.key}`" class="info-title">
                        {{ active.label }}
                    </label>
                    <p class="info-subtitle">
                        INCI: {{ active.inci }}
                    </p>

                    <div class="info-badges">
            <span class="type-badge" :class="typeBadgeClass">
              {{ activeTypeLabel }}
            </span>
                        <span v-if="active.stability" class="stability-badge">
              {{ active.stability }}
            </span>
                    </div>
                </div>

                <div v-if="active.enabled" class="header-controls">
                    <div class="percent-display">
            <span :class="percentClass">
              {{ active.percent }}%
            </span>
                        <span class="percent-grams">
              ({{ grams(active.percent) }} g)
            </span>
                    </div>
                </div>
            </div>

            <!-- Dosage controls when enabled -->
            <div v-if="active.enabled" class="dosage-controls">
                <div class="slider-section">
                    <div class="slider-labels">
                        <span>Min: {{ active.min }}%</span>
                        <span class="current-value">{{ active.percent }}%</span>
                        <span>Max: {{ active.max }}%</span>
                    </div>

                    <input
                        type="range"
                        v-model.number="localActive.percent"
                        :min="active.min"
                        :max="active.max"
                        step="0.1"
                        class="dosage-slider"
                        @input="updateActive"
                    />
                </div>

                <div class="numeric-controls">
                    <div class="numeric-input-wrapper">
                        <input
                            type="number"
                            v-model.number="localActive.percent"
                            :min="active.min"
                            :max="active.max"
                            step="0.1"
                            class="numeric-input"
                            @input="updateActive"
                        />
                        <span class="numeric-suffix">%</span>
                    </div>

                    <div class="quick-buttons">
                        <button
                            type="button"
                            @click="setPercent(active.min)"
                            class="quick-btn"
                        >
                            Min
                        </button>
                        <button
                            type="button"
                            @click="setPercent((active.min + active.max) / 2)"
                            class="quick-btn"
                        >
                            Moyen
                        </button>
                        <button
                            type="button"
                            @click="setPercent(active.max)"
                            class="quick-btn"
                        >
                            Max
                        </button>
                    </div>
                </div>
            </div>

            <!-- Description when disabled -->
            <div v-else class="active-description">
                <p class="description-text">
                    Plage recommandée: <strong>{{ active.min }}% - {{ active.max }}%</strong>
                </p>
                <p class="description-detail">
                    {{ active.description }}
                </p>
            </div>

            <!-- Compatibility when enabled -->
            <div v-if="active.enabled && (active.compatibility?.length || active.restrictions)"
                 class="compatibility-section">
                <div v-if="active.compatibility?.length" class="compatibility-list">
                    <span class="compatibility-label">Compatible avec:</span>
                    <div class="compatibility-badges">
            <span v-for="comp in active.compatibility" :key="comp" class="compatibility-badge">
              {{ comp }}
            </span>
                    </div>
                </div>

                <div v-if="active.restrictions" class="restrictions">
                    <span class="restrictions-label">Précautions:</span>
                    <span class="restrictions-text">{{ active.restrictions }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
    active: {
        type: Object,
        required: true
    },
    skinProfile: Object
})

const emit = defineEmits(['update:active'])

const localActive = ref({ ...props.active })
const volume = 50 // Hardcoded pour l'exemple

watch(() => props.active, (newActive) => {
    localActive.value = { ...newActive }
}, { deep: true })

const grams = (percent) => {
    return Number(((volume * percent) / 100).toFixed(2))
}

const activeTypeLabel = computed(() => {
    const labels = {
        'hydratant': 'Hydratant',
        'antioxydant': 'Antioxydant',
        'repair': 'Régénérant',
        'exfoliant': 'Exfoliant'
    }
    return labels[props.active.type] || props.active.type
})

const typeBadgeClass = computed(() => {
    const classes = {
        'hydratant': 'bg-blue-100 text-blue-800',
        'antioxydant': 'bg-green-100 text-green-800',
        'repair': 'bg-orange-100 text-orange-800',
        'exfoliant': 'bg-purple-100 text-purple-800'
    }
    return classes[props.active.type] || 'bg-gray-100 text-gray-800'
})

const percentClass = computed(() => {
    const percent = props.active.percent
    const min = props.active.min
    const max = props.active.max
    const optimal = (min + max) / 2

    if (percent < min || percent > max) return 'text-red-600 font-bold'
    if (Math.abs(percent - optimal) < (max - min) * 0.2) return 'text-green-600 font-bold'
    return 'text-amber-600 font-bold'
})

const isLimitReached = computed(() => {
    const enabledCount = props.skinProfile?.enabledActives || 0
    const max = props.skinProfile?.maxActives || 3
    return enabledCount >= max
})

const updateActive = () => {
    emit('update:active', { ...localActive.value })
}

const setPercent = (value) => {
    localActive.value.percent = value
    updateActive()
}
</script>

<style scoped>
.active-card {
    @apply border border-gray-200 rounded-lg p-4 transition-colors;
}

.card-enabled {
    @apply border-purple-300 bg-purple-50;
}

.card-checkbox {
    @apply mb-3;
}

.checkbox-input {
    @apply h-5 w-5 rounded border-gray-300 text-purple-600
    focus:ring-purple-500 focus:ring-2 focus:ring-offset-2;
}

.card-content {
    @apply space-y-3;
}

.card-header {
    @apply flex justify-between items-start gap-4;
}

.header-info {
    @apply flex-1;
}

.info-title {
    @apply font-bold text-gray-900 text-lg block cursor-pointer
    hover:text-purple-600 transition-colors;
}

.info-subtitle {
    @apply text-sm text-gray-500 font-mono mt-1;
}

.info-badges {
    @apply flex gap-2 mt-2;
}

.type-badge,
.stability-badge {
    @apply px-2 py-1 rounded-full text-xs font-medium;
}

.stability-badge {
    @apply bg-gray-100 text-gray-800;
}

.header-controls {
    @apply flex-shrink-0;
}

.percent-display {
    @apply text-right;
}

.percent-display .percent-grams {
    @apply block text-sm text-gray-500;
}

.dosage-controls {
    @apply space-y-3;
}

.slider-section {
    @apply space-y-1;
}

.slider-labels {
    @apply flex justify-between text-xs text-gray-500;
}

.current-value {
    @apply font-medium text-gray-700;
}

.dosage-slider {
    @apply w-full h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full
    appearance-none cursor-pointer;
}

.dosage-slider::-webkit-slider-thumb {
    @apply appearance-none h-5 w-5 rounded-full bg-purple-600
    border-4 border-white shadow-md;
}

.dosage-slider::-moz-range-thumb {
    @apply h-5 w-5 rounded-full bg-purple-600
    border-4 border-white shadow-md;
}

.numeric-controls {
    @apply flex items-center gap-3;
}

.numeric-input-wrapper {
    @apply relative flex-1;
}

.numeric-input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    text-center;
}

.numeric-suffix {
    @apply absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500;
}

.quick-buttons {
    @apply flex gap-1;
}

.quick-btn {
    @apply px-2 py-1 text-sm border border-gray-300 rounded
    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-colors;
}

.active-description {
    @apply p-3 bg-gray-50 rounded-lg;
}

.description-text {
    @apply text-sm text-gray-600;
}

.description-detail {
    @apply text-xs text-gray-500 mt-1;
}

.compatibility-section {
    @apply pt-3 border-t border-gray-200 space-y-2;
}

.compatibility-list {
    @apply flex items-center gap-2;
}

.compatibility-label {
    @apply text-sm font-medium text-gray-700;
}

.compatibility-badges {
    @apply flex gap-1;
}

.compatibility-badge {
    @apply px-2 py-1 rounded-full text-xs bg-green-100 text-green-800;
}

.restrictions {
    @apply flex items-center gap-2;
}

.restrictions-label {
    @apply text-sm font-medium text-gray-700;
}

.restrictions-text {
    @apply text-xs text-red-600;
}
</style>