<template>
    <div class="phase-item" :class="{ 'item-selected': item.selected }">
        <div class="item-content">
            <div class="item-header">
                <div class="item-checkbox">
                    <input
                        :id="`item-${item.name}`"
                        type="checkbox"
                        v-model="selected"
                        class="checkbox"
                        @change="toggle"
                    />
                </div>

                <div class="item-info">
                    <label :for="`item-${item.name}`" class="item-title">
                        {{ item.name }}
                    </label>
                    <p class="item-description">
                        {{ item.description }}
                    </p>
                </div>

                <div v-if="item.selected" class="item-percent">
                    <span class="percent-value">{{ item.percent }}%</span>
                </div>
            </div>

            <!-- Properties -->
            <div class="item-properties">
        <span
            v-for="prop in item.properties"
            :key="prop"
            class="property-badge"
        >
          {{ prop }}
        </span>
            </div>

            <!-- Dosage controls when selected -->
            <div v-if="item.selected" class="dosage-controls">
                <div class="dosage-input-wrapper">
                    <label :for="`dosage-${item.name}`" class="dosage-label">
                        Dosage (%)
                    </label>
                    <div class="dosage-input">
                        <input
                            :id="`dosage-${item.name}`"
                            type="number"
                            v-model.number="percent"
                            :min="item.min"
                            :max="item.max"
                            step="0.1"
                            class="dosage-number"
                        />
                        <span class="dosage-suffix">%</span>
                    </div>
                </div>

                <div class="dosage-slider-wrapper">
                    <div class="slider-labels">
                        <span class="slider-min">{{ item.min }}%</span>
                        <span class="slider-max">{{ item.max }}%</span>
                    </div>
                    <input
                        type="range"
                        v-model.number="percent"
                        :min="item.min"
                        :max="item.max"
                        step="0.1"
                        class="dosage-slider"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    item: Object
})

const emit = defineEmits(['toggle', 'update-percent'])

const selected = computed({
    get: () => props.item.selected,
    set: (value) => {
        if (value !== props.item.selected) {
            emit('toggle')
        }
    }
})

const percent = computed({
    get: () => props.item.percent,
    set: (value) => {
        emit('update-percent', value)
    }
})

const toggle = () => {
    emit('toggle')
}
</script>

<style scoped>
.phase-item {
    @apply border border-gray-200 rounded-lg p-3 transition-all duration-300
    hover:shadow-md hover:-translate-y-1;
}

.item-selected {
    @apply border-blue-300 bg-blue-50 border-2;
}

.item-content {
    @apply space-y-3;
}

.item-header {
    @apply flex items-start gap-3;
}

.item-checkbox {
    @apply flex-shrink-0 pt-1;
}

.checkbox {
    @apply h-5 w-5 rounded border-2 border-gray-300 text-blue-600
    focus:ring-blue-500 focus:ring-2 focus:ring-offset-2;
}

.item-info {
    @apply flex-1 min-w-0;
}

.item-title {
    @apply font-bold text-gray-900 cursor-pointer hover:text-blue-600
    transition-colors block truncate;
}

.item-description {
    @apply text-xs text-gray-500 mt-1;
}

.item-percent {
    @apply flex-shrink-0;
}

.percent-value {
    @apply px-2 py-1 bg-blue-100 text-blue-800 rounded font-bold text-sm;
}

.item-properties {
    @apply flex flex-wrap gap-1;
}

.property-badge {
    @apply px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800
    border border-blue-200;
}

.dosage-controls {
    @apply space-y-3 pt-3 border-t border-gray-200;
}

.dosage-input-wrapper {
    @apply space-y-1;
}

.dosage-label {
    @apply block text-xs font-medium text-gray-700;
}

.dosage-input {
    @apply relative;
}

.dosage-number {
    @apply w-full px-3 py-2 border border-blue-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    pr-10;
}

.dosage-suffix {
    @apply absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500;
}

.dosage-slider-wrapper {
    @apply space-y-1;
}

.slider-labels {
    @apply flex justify-between text-xs text-gray-500;
}

.dosage-slider {
    @apply w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg
    appearance-none cursor-pointer;
}

.dosage-slider::-webkit-slider-thumb {
    @apply appearance-none h-4 w-4 rounded-full bg-blue-600
    border-2 border-white shadow-sm;
}

.dosage-slider::-moz-range-thumb {
    @apply h-4 w-4 rounded-full bg-blue-600
    border-2 border-white shadow-sm;
}
</style>