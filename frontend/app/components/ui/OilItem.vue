<template>
    <div
        class="oil-item"
        :class="{
      'item-selected': item.selected,
      'item-disabled': !item.selected && remainingPercent <= 0
    }"
    >
        <div class="item-content">
            <div class="item-header">
                <div class="item-checkbox">
                    <input
                        :id="`oil-${item.name}`"
                        type="checkbox"
                        v-model="selected"
                        class="checkbox"
                        :disabled="!item.selected && remainingPercent <= 0"
                        @change="toggle"
                    />
                </div>

                <div class="item-info">
                    <label
                        :for="`oil-${item.name}`"
                        class="item-title"
                        :class="{ 'text-gray-400': !item.selected && remainingPercent <= 0 }"
                    >
                        {{ item.name }}
                    </label>
                    <p class="item-description">
                        {{ item.description }}
                    </p>
                </div>

                <div v-if="item.selected" class="item-percent">
                    <span class="percent-value">{{ item.percent }}%</span>
                </div>

                <div class="item-comedogenic">
          <span
              class="comedogenic-badge"
              :class="comedogenicClass"
              :title="`Indice comédogène: ${item.comedogenic}/5`"
          >
            COM {{ item.comedogenic }}
          </span>
                </div>
            </div>

            <!-- Properties -->
            <div class="item-properties">
        <span
            v-for="prop in item.properties.slice(0, 3)"
            :key="prop"
            class="property-badge"
        >
          {{ prop }}
        </span>
                <span v-if="item.properties.length > 3" class="property-more">
          +{{ item.properties.length - 3 }}
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
                            :max="Math.min(item.max, remainingPercent + item.percent)"
                            step="0.1"
                            class="dosage-number"
                            :class="{ 'input-warning': percent > item.max }"
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
                        :max="Math.min(item.max, remainingPercent + item.percent)"
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
    item: Object,
    remainingPercent: Number
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

const comedogenicClass = computed(() => {
    const value = props.item.comedogenic
    if (value <= 1) return 'comedogenic-low'
    if (value <= 2) return 'comedogenic-medium'
    return 'comedogenic-high'
})

const toggle = () => {
    emit('toggle')
}
</script>

<style scoped>
.oil-item {
    @apply border border-gray-200 rounded-lg p-3 transition-all duration-300
    hover:shadow-md hover:-translate-y-1;
}

.item-selected {
    @apply border-amber-300 bg-amber-50 border-2;
}

.item-disabled {
    @apply opacity-50 cursor-not-allowed;
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
    @apply h-5 w-5 rounded border-2 border-gray-300 text-amber-600
    focus:ring-amber-500 focus:ring-2 focus:ring-offset-2
    disabled:opacity-50;
}

.item-info {
    @apply flex-1 min-w-0;
}

.item-title {
    @apply font-bold text-gray-900 cursor-pointer hover:text-amber-600
    transition-colors block truncate;
}

.item-description {
    @apply text-xs text-gray-500 mt-1;
}

.item-percent {
    @apply flex-shrink-0;
}

.percent-value {
    @apply px-2 py-1 bg-amber-100 text-amber-800 rounded font-bold text-sm;
}

.item-comedogenic {
    @apply flex-shrink-0;
}

.comedogenic-badge {
    @apply px-2 py-1 rounded text-xs font-bold;
}

.comedogenic-low {
    @apply bg-green-100 text-green-800;
}

.comedogenic-medium {
    @apply bg-amber-100 text-amber-800;
}

.comedogenic-high {
    @apply bg-red-100 text-red-800;
}

.item-properties {
    @apply flex flex-wrap gap-1;
}

.property-badge {
    @apply px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800
    border border-amber-200;
}

.property-more {
    @apply px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600;
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
    @apply w-full px-3 py-2 border border-amber-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500
    pr-10;
}

.dosage-number.input-warning {
    @apply border-red-300 focus:ring-red-500 focus:border-red-500;
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
    @apply w-full h-2 bg-gradient-to-r from-amber-200 to-amber-400 rounded-lg
    appearance-none cursor-pointer;
}

.dosage-slider::-webkit-slider-thumb {
    @apply appearance-none h-4 w-4 rounded-full bg-amber-600
    border-2 border-white shadow-sm;
}

.dosage-slider::-moz-range-thumb {
    @apply h-4 w-4 rounded-full bg-amber-600
    border-2 border-white shadow-sm;
}
</style>