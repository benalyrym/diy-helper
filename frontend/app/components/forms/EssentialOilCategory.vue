<template>
    <div class="essential-oil-category" v-if="shouldShowCategory">
        <!-- En-tête de catégorie -->
        <div class="category-header">
            <h4 class="category-title">
                {{ categoryName }}
                <span class="category-count">({{ oils.length }} HE)</span>
            </h4>
            <div class="category-total">
                {{ categoryTotal.toFixed(2) }}%
            </div>
        </div>

        <!-- Grille d'HE -->
        <div class="oils-grid">
            <EssentialOilCard
                v-for="oil in oils"
                :key="oil.name"
                :oil="oil"
                :is-selected="isOilSelected(oil.name)"
                :total-percent="totalPercent"
                :volume="volume"
                @toggle="handleToggle"
                @update-percent="handleUpdatePercent"
            />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import EssentialOilCard from './EssentialOilCard.vue'

const props = defineProps({
    categoryName: String,
    oils: Array,
    selectedOils: Array,
    totalPercent: Number,
    volume: {
        type: Number,
        default: 50
    },
    showAll: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['toggle-oil', 'update-percent'])

const shouldShowCategory = computed(() => {
    return props.showAll || props.oils.some(oil => isOilSelected(oil.name))
})

const categoryTotal = computed(() => {
    return props.selectedOils
        .filter(oil => props.oils.some(o => o.name === oil.name))
        .reduce((total, oil) => total + oil.percent, 0)
})

const isOilSelected = (oilName) => {
    return props.selectedOils.some(oil => oil.name === oilName)
}

const handleToggle = (oil) => {
    emit('toggle-oil', {
        oil,
        action: isOilSelected(oil.name) ? 'remove' : 'add'
    })
}

const handleUpdatePercent = (data) => {
    emit('update-percent', data)
}
</script>

<style scoped>
.essential-oil-category {
    @apply mb-6 last:mb-0;
}

.category-header {
    @apply flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50
    rounded-lg border border-green-200;
}

.category-title {
    @apply font-bold text-gray-900 flex items-center gap-2;
}

.category-count {
    @apply font-normal text-gray-500 text-sm;
}

.category-total {
    @apply px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold;
}

.oils-grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3;
}
</style>
