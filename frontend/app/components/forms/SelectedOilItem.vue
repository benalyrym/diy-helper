<template>
    <div class="selected-oil-item">
        <!-- En-tête -->
        <div class="item-header">
            <div class="header-info">
                <h5 class="oil-name">{{ oil.name }}</h5>
                <p class="oil-latin">{{ oil.latinName }}</p>
            </div>

            <button
                @click="remove"
                class="remove-button"
                type="button"
                :aria-label="`Retirer ${oil.name}`"
            >
                <span class="remove-icon" aria-hidden="true">×</span>
            </button>
        </div>

        <!-- Dosage -->
        <div class="dosage-section">
            <div class="dosage-display">
                <span class="dosage-value">{{ oil.percent }}%</span>
                <span class="dosage-grams">{{ grams }} g</span>
            </div>

            <!-- Contrôle dosage -->
            <div class="dosage-control">
                <label class="control-label">Ajuster dosage</label>
                <div class="control-slider">
                    <input
                        type="range"
                        v-model.number="percent"
                        :min="0"
                        :max="oil.maxFace"
                        step="0.01"
                        class="slider"
                        @input="updatePercent"
                    />
                    <div class="slider-labels">
                        <span>0%</span>
                        <span>{{ oil.maxFace }}%</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Avertissements -->
        <div class="warnings">
            <div v-if="!oil.pregnancy" class="warning">
                <span class="warning-icon" aria-hidden="true">⚠️</span>
                <span class="warning-text">Contre-indiquée grossesse/allaitement</span>
            </div>
            <div v-if="oil.photo" class="warning">
                <span class="warning-icon" aria-hidden="true">☀️</span>
                <span class="warning-text">Photosensible - éviter le soleil</span>
            </div>
            <div v-if="oil.allergen" class="warning">
                <span class="warning-icon" aria-hidden="true">⚠️</span>
                <span class="warning-text">Potentiel allergène</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
    oil: Object,
    volume: {
        type: Number,
        default: 50
    }
})

const emit = defineEmits(['update-percent', 'remove'])

const percent = ref(props.oil.percent)

const grams = computed(() => {
    return ((props.volume * percent.value) / 100).toFixed(2)
})

const updatePercent = () => {
    emit('update-percent', {
        oilName: props.oil.name,
        percent: percent.value
    })
}

const remove = () => {
    emit('remove', props.oil.name)
}
</script>

<style scoped>
.selected-oil-item {
    @apply bg-white rounded-lg p-4 border border-green-200;
}

.item-header {
    @apply flex justify-between items-start mb-3;
}

.header-info {
    @apply flex-1;
}

.oil-name {
    @apply font-bold text-gray-900 text-sm;
}

.oil-latin {
    @apply text-xs text-gray-500 mt-1;
}

.remove-button {
    @apply text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full
    transition-colors flex-shrink-0;
}

.remove-icon {
    @apply text-xl;
}

.dosage-section {
    @apply space-y-3;
}

.dosage-display {
    @apply text-right;
}

.dosage-value {
    @apply font-bold text-green-700 text-lg;
}

.dosage-grams {
    @apply block text-sm text-gray-500;
}

.dosage-control {
    @apply space-y-1;
}

.control-label {
    @apply block text-xs font-medium text-gray-700;
}

.control-slider {
    @apply space-y-1;
}

.slider {
    @apply w-full h-1.5 bg-gradient-to-r from-green-200 to-green-400 rounded
    appearance-none cursor-pointer;
}

.slider::-webkit-slider-thumb {
    @apply appearance-none h-4 w-4 rounded-full bg-green-600 border-2 border-white;
}

.slider-labels {
    @apply flex justify-between text-xs text-gray-500;
}

.warnings {
    @apply mt-3 space-y-1;
}

.warning {
    @apply flex items-center gap-2 text-xs;
}

.warning-icon {
    @apply flex-shrink-0;
}

.warning-text {
    @apply text-red-600;
}
</style>