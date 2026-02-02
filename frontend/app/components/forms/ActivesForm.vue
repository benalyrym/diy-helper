<template>
    <div class="actives-form">
        <!-- Filtres -->
        <div class="filters-section">
            <div class="filter-group">
                <label for="active-search" class="filter-label">
                    Rechercher un actif
                </label>
                <input
                    id="active-search"
                    type="text"
                    :value="search"
                    @input="$emit('update:search', $event.target.value)"
                    placeholder="Nom, INCI ou propriété..."
                    class="filter-input"
                />
            </div>

            <div class="filter-group">
                <label for="active-type" class="filter-label">
                    Type d'actif
                </label>
                <select
                    id="active-type"
                    :value="typeFilter"
                    @change="$emit('update:type-filter', $event.target.value)"
                    class="filter-select"
                >
                    <option value="">Tous les types</option>
                    <option value="hydratant">Hydratant</option>
                    <option value="antioxydant">Antioxydant</option>
                    <option value="repair">Régénérant</option>
                    <option value="exfoliant">Exfoliant</option>
                </select>
            </div>
        </div>

        <!-- Liste des actifs -->
        <div class="actives-list">
            <ActiveCard
                v-for="active in filteredActives"
                :key="active.key"
                :active="active"
                :skin-profile="skinProfile"
                @update:active="updateActive"
            />
        </div>

        <!-- Avertissement limite -->
        <div v-if="tooManyActives" class="limit-warning" role="alert">
            <div class="warning-content">
                <span class="warning-icon" aria-hidden="true">⚠️</span>
                <div class="warning-text">
                    <p class="warning-title">Limite d'actifs atteinte</p>
                    <p class="warning-description">
                        Maximum recommandé pour une peau {{ skinProfile?.label || 'sélectionnée' }} :
                        <strong>{{ skinProfile?.maxActives || 3 }} actifs</strong>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import ActiveCard from '../ui/ActiveCard.vue'

const props = defineProps({
    actives: {
        type: Array,
        required: true
    },
    search: String,
    typeFilter: String,
    skinProfile: Object
})

const emit = defineEmits([
    'update:search',
    'update:type-filter',
    'update:actives'
])

const filteredActives = computed(() => {
    return props.actives.filter(active => {
        const searchTerm = props.search?.toLowerCase() || ''
        const matchesSearch = !searchTerm ||
            active.label.toLowerCase().includes(searchTerm) ||
            active.inci.toLowerCase().includes(searchTerm)

        const matchesType = !props.typeFilter ||
            active.type === props.typeFilter

        return matchesSearch && matchesType
    })
})

const tooManyActives = computed(() => {
    const enabledCount = props.actives.filter(a => a.enabled).length
    const max = props.skinProfile?.maxActives || 3
    return enabledCount > max
})

const updateActive = (updatedActive) => {
    const index = props.actives.findIndex(a => a.key === updatedActive.key)
    if (index !== -1) {
        const newActives = [...props.actives]
        newActives[index] = updatedActive
        emit('update:actives', newActives)
    }
}
</script>

<style scoped>
.actives-form {
    @apply space-y-4;
}

.filters-section {
    @apply grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg;
}

.filter-group {
    @apply space-y-1;
}

.filter-label {
    @apply block text-sm font-medium text-gray-700;
}

.filter-input,
.filter-select {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    bg-white;
}

.actives-list {
    @apply space-y-3;
}

.limit-warning {
    @apply p-4 bg-orange-50 border border-orange-300 rounded-lg;
}

.warning-content {
    @apply flex items-start gap-3;
}

.warning-icon {
    @apply text-orange-600 text-xl flex-shrink-0;
}

.warning-text {
    @apply flex-1;
}

.warning-title {
    @apply font-semibold text-orange-800 mb-1;
}

.warning-description {
    @apply text-sm text-orange-700;
}
</style>