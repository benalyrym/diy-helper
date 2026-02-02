<template>
    <div class="aqueous-phase-form">
        <!-- Header with total -->
        <div class="phase-header">
            <div class="header-info">
                <h3 class="header-title">Sélection des hydrolats</h3>
                <p class="header-description">
                    Cochez les hydrolats à inclure dans votre formule
                </p>
            </div>

            <div class="header-total">
                <div class="total-badge">
                    <span class="total-label">Total:</span>
                    <span class="total-value">{{ total.toFixed(1) }}%</span>
                </div>

                <button
                    @click="$emit('auto-calculate')"
                    type="button"
                    class="action-btn"
                >
                    Auto-calcul
                </button>
            </div>
        </div>

        <!-- Categories -->
        <div class="categories-list">
            <PhaseCategory
                v-for="(category, catName) in phaseModel"
                :key="catName"
                :category-name="catName"
                :category="category"
                @toggle-item="toggleItem"
                @toggle-category="toggleCategory(catName)"
                @update-percent="updatePercent"
            />
        </div>

        <!-- Optimize button -->
        <div class="optimize-section">
            <button
                @click="$emit('optimize')"
                type="button"
                class="optimize-btn"
                :disabled="!hasSelectedItems"
            >
                Optimiser la répartition
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import PhaseCategory from '../ui/PhaseCategory.vue'

const props = defineProps({
    phase: {
        type: Object,
        required: true
    },
    total: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits([
    'update:phase',
    'optimize',
    'auto-calculate'
])

const phaseModel = computed({
    get: () => props.phase,
    set: (value) => emit('update:phase', value)
})

const hasSelectedItems = computed(() => {
    return Object.values(props.phase).some(category =>
        category.items.some(item => item.selected)
    )
})

const toggleItem = ({ categoryName, itemName }) => {
    const category = phaseModel.value[categoryName]
    if (!category) return

    const item = category.items.find(i => i.name === itemName)
    if (item) {
        item.selected = !item.selected
    }
}

const toggleCategory = (categoryName) => {
    const category = phaseModel.value[categoryName]
    if (!category) return

    const allSelected = category.items.every(item => item.selected)
    category.items.forEach(item => {
        item.selected = !allSelected
    })
}

const updatePercent = ({ categoryName, itemName, percent }) => {
    const category = phaseModel.value[categoryName]
    if (!category) return

    const item = category.items.find(i => i.name === itemName)
    if (item) {
        item.percent = Math.max(item.min, Math.min(item.max, percent))
    }
}
</script>

<style scoped>
.aqueous-phase-form {
    @apply space-y-6;
}

.phase-header {
    @apply flex flex-col md:flex-row justify-between items-start md:items-center
    gap-4 p-4 bg-blue-50 rounded-lg;
}

.header-info {
    @apply flex-1;
}

.header-title {
    @apply font-bold text-gray-900 text-lg;
}

.header-description {
    @apply text-gray-600 text-sm mt-1;
}

.header-total {
    @apply flex items-center gap-3;
}

.total-badge {
    @apply px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold;
}

.total-label {
    @apply mr-2;
}

.total-value {
    @apply text-lg;
}

.action-btn {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    transition-colors font-medium;
}

.categories-list {
    @apply space-y-4;
}

.optimize-section {
    @apply pt-4 border-t border-gray-200;
}

.optimize-btn {
    @apply w-full md:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700
    text-white rounded-lg hover:from-blue-700 hover:to-blue-800
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    transition-all duration-300 font-medium
    disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>