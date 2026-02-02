<template>
    <div class="oil-category" :class="{ 'category-has-selected': hasSelected }">
        <div class="category-header">
            <div class="header-left">
        <span class="category-icon" :aria-hidden="true">
          {{ category.icon }}
        </span>
                <h4 class="category-title">
                    {{ categoryName }}
                    <span class="category-count">
            ({{ selectedCount }}/{{ category.items.length }})
          </span>
                </h4>
            </div>

            <button
                @click="$emit('toggle-category')"
                type="button"
                class="category-toggle"
                :disabled="!canToggleCategory"
            >
                {{ hasSelected ? 'Tout désélectionner' : 'Tout sélectionner' }}
            </button>
        </div>

        <div class="category-items">
            <OilItem
                v-for="item in category.items"
                :key="item.name"
                :item="item"
                :remaining-percent="remainingPercent"
                @toggle="toggleItem(item.name)"
                @update-percent="updatePercent(item.name, $event)"
            />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import OilItem from './OilItem.vue'

const props = defineProps({
    categoryName: String,
    category: Object,
    remainingPercent: Number
})

const emit = defineEmits(['toggle-category', 'toggle-item', 'update-percent'])

const selectedCount = computed(() => {
    return props.category.items.filter(item => item.selected).length
})

const hasSelected = computed(() => {
    return selectedCount.value > 0
})

const canToggleCategory = computed(() => {
    if (!hasSelected.value && props.remainingPercent <= 0) {
        return false
    }
    return true
})

const toggleItem = (itemName) => {
    emit('toggle-item', { categoryName: props.categoryName, itemName })
}

const updatePercent = (itemName, percent) => {
    emit('update-percent', {
        categoryName: props.categoryName,
        itemName,
        percent
    })
}
</script>

<style scoped>
.oil-category {
    @apply border border-gray-200 rounded-lg p-4 transition-colors;
}

.category-has-selected {
    @apply border-amber-300 bg-amber-50/30;
}

.category-header {
    @apply flex justify-between items-center mb-4;
}

.header-left {
    @apply flex items-center gap-3;
}

.category-icon {
    @apply p-2 bg-amber-100 text-amber-600 rounded-lg text-xl;
}

.category-title {
    @apply font-bold text-gray-900;
}

.category-count {
    @apply font-normal text-gray-500 text-sm ml-2;
}

.category-toggle {
    @apply text-sm text-amber-600 hover:text-amber-800
    focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
    rounded px-2 py-1 transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed;
}

.category-items {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3;
}
</style>