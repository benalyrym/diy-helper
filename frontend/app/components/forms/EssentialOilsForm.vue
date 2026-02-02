<template>
    <div class="essential-oils-form">
        <!-- En-tête avec totaux -->
        <div class="form-header">
            <div class="header-content">
                <h3 class="header-title">Sélection des huiles essentielles</h3>
                <p class="header-description">
                    Sélectionnez parmi 100+ HE - Conformité stricte UE 1223/2009
                </p>
            </div>

            <div class="header-stats">
                <div class="stats-grid">
                    <div class="stat-item" :class="heTotalClass">
                        <span class="stat-label">Total HE</span>
                        <span class="stat-value">{{ heTotal.toFixed(2) }}%</span>
                        <span class="stat-limit">/ 1% limite UE</span>
                    </div>

                    <div class="stat-item">
                        <span class="stat-label">Sélectionnées</span>
                        <span class="stat-value">{{ selectedHECount }}</span>
                        <span class="stat-limit">HE</span>
                    </div>

                    <div class="stat-item">
                        <span class="stat-label">Disponibles</span>
                        <span class="stat-value">{{ filteredHECount }}</span>
                        <span class="stat-limit">HE</span>
                    </div>
                </div>

                <button
                    @click="clearAllHE"
                    type="button"
                    class="clear-button"
                    :disabled="selectedHECount === 0"
                    aria-label="Effacer toutes les huiles essentielles sélectionnées"
                >
                    <span class="button-icon" aria-hidden="true">🗑️</span>
                    <span class="button-text">Tout effacer</span>
                </button>
            </div>
        </div>

        <!-- Filtres de recherche -->
        <div class="filters-section">
            <div class="filters-grid">
                <!-- Recherche -->
                <div class="filter-group">
                    <label for="he-search" class="filter-label">
                        <span class="filter-icon" aria-hidden="true">🔍</span>
                        Recherche
                    </label>
                    <input
                        id="he-search"
                        v-model="heSearchModel"
                        type="text"
                        placeholder="Nom, latin, propriété..."
                        class="filter-input"
                        @input="updateSearch"
                    />
                </div>

                <!-- Filtre par propriété -->
                <div class="filter-group">
                    <label for="he-property" class="filter-label">
                        <span class="filter-icon" aria-hidden="true">🏷️</span>
                        Propriété
                    </label>
                    <select
                        id="he-property"
                        v-model="propertyFilterModel"
                        class="filter-select"
                        @change="updatePropertyFilter"
                    >
                        <option value="">Toutes propriétés</option>
                        <option value="anti-age">Anti-age</option>
                        <option value="hydratant">Hydratant</option>
                        <option value="apaisant">Apaisant</option>
                        <option value="purifiant">Purifiant</option>
                    </select>
                </div>

                <!-- Filtres de sécurité -->
                <div class="filter-group">
                    <div class="filter-label">
                        <span class="filter-icon" aria-hidden="true">🛡️</span>
                        Filtres sécurité
                    </div>
                    <div class="safety-filters">
                        <label class="safety-filter">
                            <input
                                type="checkbox"
                                v-model="filtersModel.safeForPregnancy"
                                class="safety-checkbox"
                                @change="updateFilters"
                            />
                            <span class="safety-label">Grossesse OK</span>
                        </label>

                        <label class="safety-filter">
                            <input
                                type="checkbox"
                                v-model="filtersModel.noPhotosensitivity"
                                class="safety-checkbox"
                                @change="updateFilters"
                            />
                            <span class="safety-label">Non photosensible</span>
                        </label>

                        <label class="safety-filter">
                            <input
                                type="checkbox"
                                v-model="filtersModel.noAllergen"
                                class="safety-checkbox"
                                @change="updateFilters"
                            />
                            <span class="safety-label">Non allergène</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Résultats de recherche -->
            <div class="search-results">
        <span class="results-count">
          <span class="count-number">{{ filteredHECount }}</span> HE trouvées
        </span>
                <button
                    @click="toggleShowAll"
                    class="results-toggle"
                    type="button"
                    :aria-expanded="showAll"
                    :aria-label="showAll ? 'Afficher moins de catégories' : 'Afficher toutes les catégories'"
                >
                    {{ showAll ? 'Afficher moins' : 'Afficher toutes' }}
                </button>
            </div>
        </div>

        <!-- Liste des huiles essentielles -->
        <div class="oils-list">
            <EssentialOilCategory
                v-for="(oils, categoryName) in filteredEssentialOils"
                :key="categoryName"
                :category-name="categoryName"
                :oils="oils"
                :selected-oils="selectedHE"
                :total-percent="heTotal"
                :show-all="showAll"
                :volume="volume"
                @toggle-oil="toggleOil"
                @update-percent="updateOilPercent"
            />
        </div>

        <!-- Message si aucune HE -->
        <div v-if="filteredHECount === 0" class="empty-state">
            <div class="empty-content">
                <span class="empty-icon" aria-hidden="true">🌿</span>
                <h4 class="empty-title">Aucune huile essentielle trouvée</h4>
                <p class="empty-description">
                    Aucune HE ne correspond à vos critères de recherche.
                    Essayez de modifier vos filtres ou utilisez un terme de recherche différent.
                </p>
            </div>
        </div>

        <!-- Panneau des HE sélectionnées -->
        <div v-if="selectedHECount > 0" class="selected-panel">
            <div class="panel-header">
                <h4 class="panel-title">
                    <span class="title-icon" aria-hidden="true">🌿</span>
                    Huiles essentielles sélectionnées
                </h4>
                <div class="panel-total" :class="totalWarningClass">
                    {{ heTotal.toFixed(2) }}% / 1% limite UE
                </div>
            </div>

            <!-- Liste des HE sélectionnées -->
            <div class="selected-grid">
                <SelectedOilItem
                    v-for="oil in selectedHE"
                    :key="oil.name"
                    :oil="oil"
                    :volume="volume"
                    @update-percent="updateOilPercent"
                    @remove="removeOil"
                />
            </div>

            <!-- Avertissements -->
            <div v-if="heWarnings.length > 0" class="warnings-section">
                <div class="warnings-header">
                    <span class="warnings-icon" aria-hidden="true">⚠️</span>
                    <span class="warnings-title">Avertissements</span>
                </div>
                <ul class="warnings-list">
                    <li
                        v-for="(warning, index) in heWarnings.slice(0, 3)"
                        :key="index"
                        class="warning-item"
                    >
                        {{ warning }}
                    </li>
                    <li v-if="heWarnings.length > 3" class="warning-more">
                        + {{ heWarnings.length - 3 }} avertissement(s) supplémentaire(s)
                    </li>
                </ul>
            </div>

            <!-- Barre de progression -->
            <div class="progress-section">
                <div class="progress-header">
                    <span class="progress-label">Progression limite UE</span>
                    <span class="progress-value">{{ heTotal.toFixed(2) }}% / 1%</span>
                </div>
                <div class="progress-bar">
                    <div
                        class="progress-fill"
                        :class="progressFillClass"
                        :style="{ width: `${Math.min(heTotal * 100, 100)}%` }"
                        role="progressbar"
                        :aria-valuenow="heTotal"
                        aria-valuemin="0"
                        aria-valuemax="1"
                    ></div>
                </div>
                <div class="progress-labels">
                    <span>0%</span>
                    <span>0.5%</span>
                    <span>1%</span>
                </div>
            </div>
        </div>

        <!-- Message si aucune sélection -->
        <div v-else-if="filteredHECount > 0" class="no-selection">
            <div class="no-selection-content">
                <span class="no-selection-icon" aria-hidden="true">🌿</span>
                <div class="no-selection-text">
                    <h4 class="no-selection-title">Aucune huile essentielle sélectionnée</h4>
                    <p class="no-selection-description">
                        Les HE sont optionnelles. Vous pouvez les ajouter pour leurs propriétés spécifiques,
                        mais n'oubliez pas la limite réglementaire de 1% pour les produits visage.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import EssentialOilCategory from './EssentialOilCategory.vue'
import SelectedOilItem from './SelectedOilItem.vue'

const props = defineProps({
    // HE sélectionnées
    selectedHE: {
        type: Array,
        required: true,
        default: () => []
    },

    volume: {
        type: Number,
        default: 50
    },

    // Filtres de recherche
    heSearch: {
        type: String,
        default: ''
    },

    // Filtre par propriété
    propertyFilter: {
        type: String,
        default: ''
    },

    // Filtres de sécurité
    filters: {
        type: Object,
        default: () => ({
            safeForPregnancy: false,
            noPhotosensitivity: false,
            noAllergen: false
        })
    },

    // Toutes les huiles essentielles disponibles
    essentialOils: {
        type: Object,
        required: true,
        default: () => ({})
    }
})

const emit = defineEmits([
    'update:selected-he',
    'update:search',
    'update:property-filter',
    'update:filters'
])

// États internes
const showAll = ref(true)

// Modèles pour les v-model
const selectedHEModel = computed({
    get: () => props.selectedHE,
    set: (value) => emit('update:selected-he', value)
})

const heSearchModel = computed({
    get: () => props.heSearch,
    set: (value) => emit('update:search', value)
})

const propertyFilterModel = computed({
    get: () => props.propertyFilter,
    set: (value) => emit('update:property-filter', value)
})

const filtersModel = computed({
    get: () => props.filters,
    set: (value) => emit('update:filters', value)
})

// Computed properties
const heTotal = computed(() => {
    return props.selectedHE.reduce((total, oil) => total + oil.percent, 0)
})

const selectedHECount = computed(() => {
    return props.selectedHE.length
})

const filteredEssentialOils = computed(() => {
    const filtered = {}

    for (const [category, oils] of Object.entries(props.essentialOils)) {
        // Filtrer les HE de cette catégorie
        let filteredOils = oils.filter(oil => {
            // Filtre par recherche
            if (props.heSearch && !matchesSearch(oil, props.heSearch)) {
                return false
            }

            // Filtre par propriété
            if (props.propertyFilter && !matchesProperty(oil, props.propertyFilter)) {
                return false
            }

            // Filtres de sécurité
            if (props.filters.safeForPregnancy && !oil.pregnancy) {
                return false
            }

            if (props.filters.noPhotosensitivity && oil.photo) {
                return false
            }

            if (props.filters.noAllergen && oil.allergen) {
                return false
            }

            return true
        })

        if (filteredOils.length > 0) {
            filtered[category] = filteredOils
        }
    }

    return filtered
})

const filteredHECount = computed(() => {
    return Object.values(filteredEssentialOils.value).reduce(
        (total, oils) => total + oils.length,
        0
    )
})

const heTotalClass = computed(() => {
    if (heTotal.value > 1) return 'stat-danger'
    if (heTotal.value > 0.8) return 'stat-warning'
    return 'stat-safe'
})

const totalWarningClass = computed(() => {
    if (heTotal.value > 1) return 'total-danger'
    if (heTotal.value > 0.8) return 'total-warning'
    return 'total-safe'
})

const progressFillClass = computed(() => {
    if (heTotal.value > 1) return 'fill-danger'
    if (heTotal.value > 0.8) return 'fill-warning'
    return 'fill-safe'
})

const heWarnings = computed(() => {
    const warnings = []

    if (heTotal.value > 1) {
        warnings.push(`Dépassement limite UE: ${heTotal.value.toFixed(2)}% > 1%`)
    }

    if (heTotal.value > 0.8 && heTotal.value <= 1) {
        warnings.push('Approche de la limite UE (1%) - vérification recommandée')
    }

    const pregnancyUnsafe = props.selectedHE.filter(oil => !oil.pregnancy)
    if (pregnancyUnsafe.length > 0) {
        warnings.push(`${pregnancyUnsafe.length} HE non recommandées pendant la grossesse`)
    }

    const photosensitive = props.selectedHE.filter(oil => oil.photo)
    if (photosensitive.length > 0) {
        warnings.push(`${photosensitive.length} HE photosensibilisantes`)
    }

    return warnings
})

// Méthodes utilitaires
const matchesSearch = (oil, searchTerm) => {
    const term = searchTerm.toLowerCase()
    return (
        oil.name.toLowerCase().includes(term) ||
        oil.latinName.toLowerCase().includes(term) ||
        oil.properties.some(p => p.toLowerCase().includes(term))
    )
}

const matchesProperty = (oil, property) => {
    return oil.properties.some(p =>
        p.toLowerCase().includes(property.toLowerCase())
    )
}

// Méthodes d'actions
const updateSearch = (event) => {
    emit('update:search', event.target.value)
}

const updatePropertyFilter = (event) => {
    emit('update:property-filter', event.target.value)
}

const updateFilters = () => {
    emit('update:filters', { ...filtersModel.value })
}

const toggleShowAll = () => {
    showAll.value = !showAll.value
}

const clearAllHE = () => {
    selectedHEModel.value = []
}

const toggleOil = (oilData) => {
    const { oil, action } = oilData
    const index = props.selectedHE.findIndex(h => h.name === oil.name)

    if (action === 'add') {
        if (index === -1) {
            selectedHEModel.value = [
                ...props.selectedHE,
                {
                    ...oil,
                    percent: Math.min(oil.maxFace * 0.5, 0.3)
                }
            ]
        }
    } else {
        if (index !== -1) {
            selectedHEModel.value = props.selectedHE.filter((_, i) => i !== index)
        }
    }
}

const updateOilPercent = (data) => {
    const { oilName, percent } = data
    selectedHEModel.value = props.selectedHE.map(oil =>
        oil.name === oilName ? { ...oil, percent } : oil
    )
}

const removeOil = (oilName) => {
    selectedHEModel.value = props.selectedHE.filter(oil => oil.name !== oilName)
}
</script>

<style scoped>
.essential-oils-form {
    @apply space-y-6;
}

/* Header */
.form-header {
    @apply flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4
    p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200;
}

.header-content {
    @apply flex-1;
}

.header-title {
    @apply text-xl font-bold text-gray-900 mb-1;
}

.header-description {
    @apply text-gray-600 text-sm;
}

.header-stats {
    @apply flex flex-col sm:flex-row items-stretch sm:items-center gap-4;
}

.stats-grid {
    @apply grid grid-cols-3 gap-2;
}

.stat-item {
    @apply p-2 rounded-lg text-center min-w-20;
}

.stat-item:not(.stat-danger):not(.stat-warning) {
    @apply bg-white border border-green-200;
}

.stat-label {
    @apply block text-xs text-gray-600 mb-1;
}

.stat-value {
    @apply block text-lg font-bold text-gray-900;
}

.stat-limit {
    @apply block text-xs text-gray-500 mt-1;
}

.stat-danger {
    @apply bg-red-100 border-red-300;
}

.stat-danger .stat-value {
    @apply text-red-700;
}

.stat-warning {
    @apply bg-amber-100 border-amber-300;
}

.stat-warning .stat-value {
    @apply text-amber-700;
}

.stat-safe {
    @apply bg-green-100 border-green-300;
}

.stat-safe .stat-value {
    @apply text-green-700;
}

.clear-button {
    @apply px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg
    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500
    transition-colors flex items-center gap-2
    disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Filters */
.filters-section {
    @apply p-4 bg-gray-50 rounded-xl border border-gray-200;
}

.filters-grid {
    @apply grid grid-cols-1 md:grid-cols-3 gap-4;
}

.filter-group {
    @apply space-y-2;
}

.filter-label {
    @apply flex items-center gap-2 text-sm font-medium text-gray-700;
}

.filter-icon {
    @apply text-gray-500;
}

.filter-input,
.filter-select {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
    bg-white;
}

.safety-filters {
    @apply flex flex-wrap gap-3;
}

.safety-filter {
    @apply flex items-center gap-2 cursor-pointer;
}

.safety-checkbox {
    @apply h-4 w-4 rounded border-gray-300 text-green-600
    focus:ring-green-500 focus:ring-2 focus:ring-offset-2;
}

.safety-label {
    @apply text-sm text-gray-700;
}

.search-results {
    @apply flex items-center justify-between mt-4 pt-4 border-t border-gray-200;
}

.results-count {
    @apply text-sm text-gray-600;
}

.count-number {
    @apply font-medium text-green-700;
}

.results-toggle {
    @apply text-sm text-green-600 hover:text-green-800 font-medium
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
    rounded px-2 py-1 transition-colors;
}

/* Oils list */
.oils-list {
    @apply space-y-4;
}

/* Empty state */
.empty-state {
    @apply p-8 text-center bg-gradient-to-br from-gray-50 to-green-50
    rounded-xl border border-gray-300;
}

.empty-content {
    @apply max-w-md mx-auto;
}

.empty-icon {
    @apply text-5xl mb-4 block;
}

.empty-title {
    @apply text-xl font-bold text-gray-900 mb-2;
}

.empty-description {
    @apply text-gray-600;
}

/* Selected panel */
.selected-panel {
    @apply p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300;
}

.panel-header {
    @apply flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6;
}

.panel-title {
    @apply text-xl font-bold text-gray-900 flex items-center gap-2;
}

.title-icon {
    @apply text-green-600;
}

.panel-total {
    @apply px-4 py-2 rounded-lg font-bold;
}

.total-safe {
    @apply bg-green-100 text-green-800;
}

.total-warning {
    @apply bg-amber-100 text-amber-800;
}

.total-danger {
    @apply bg-red-100 text-red-800;
}

.selected-grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6;
}

/* Warnings */
.warnings-section {
    @apply p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6;
}

.warnings-header {
    @apply flex items-center gap-2 mb-3;
}

.warnings-icon {
    @apply text-amber-600;
}

.warnings-title {
    @apply font-semibold text-amber-800;
}

.warnings-list {
    @apply space-y-1;
}

.warning-item {
    @apply text-sm text-amber-700 flex items-start gap-2;
}

.warning-item::before {
    content: "•";
    @apply text-amber-600 mt-0.5;
}

.warning-more {
    @apply text-xs text-amber-600 italic;
}

/* Progress section */
.progress-section {
    @apply space-y-2;
}

.progress-header {
    @apply flex justify-between items-center;
}

.progress-label {
    @apply text-sm text-gray-700;
}

.progress-value {
    @apply text-sm font-medium text-gray-900;
}

.progress-bar {
    @apply w-full h-3 bg-gray-200 rounded-full overflow-hidden;
}

.progress-fill {
    @apply h-full rounded-full transition-all duration-1000;
}

.fill-safe {
    @apply bg-gradient-to-r from-green-500 to-emerald-500;
}

.fill-warning {
    @apply bg-gradient-to-r from-amber-500 to-yellow-500;
}

.fill-danger {
    @apply bg-gradient-to-r from-red-500 to-orange-500;
}

.progress-labels {
    @apply flex justify-between text-xs text-gray-500 px-1;
}

/* No selection state */
.no-selection {
    @apply p-6 text-center;
}

.no-selection-content {
    @apply inline-block p-6 bg-gradient-to-br from-green-50 to-emerald-50
    rounded-2xl border border-green-200 max-w-md;
}

.no-selection-icon {
    @apply text-6xl mb-4 block;
}

.no-selection-title {
    @apply text-xl font-bold text-gray-900 mb-2;
}

.no-selection-description {
    @apply text-gray-600;
}

/* Responsive */
@media (max-width: 768px) {
    .filters-grid {
        @apply grid-cols-1;
    }

    .stats-grid {
        @apply grid-cols-3 gap-1;
    }

    .stat-item {
        @apply min-w-16;
    }

    .selected-grid {
        @apply grid-cols-1;
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .form-header {
        @apply bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-800;
    }

    .filters-section {
        @apply bg-gray-800 border-gray-700;
    }

    .filter-label {
        @apply text-gray-300;
    }

    .filter-input,
    .filter-select {
        @apply bg-gray-700 border-gray-600 text-gray-100;
    }

    .safety-label {
        @apply text-gray-300;
    }

    .empty-state {
        @apply bg-gradient-to-br from-gray-800 to-green-900/20 border-gray-700;
    }

    .empty-title {
        @apply text-gray-100;
    }

    .empty-description {
        @apply text-gray-400;
    }

    .selected-panel {
        @apply bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800;
    }

    .panel-title {
        @apply text-gray-100;
    }

    .total-safe {
        @apply bg-green-900/30 text-green-300;
    }

    .total-warning {
        @apply bg-amber-900/30 text-amber-300;
    }

    .total-danger {
        @apply bg-red-900/30 text-red-300;
    }

    .warnings-section {
        @apply bg-amber-900/20 border-amber-800;
    }

    .warning-item {
        @apply text-amber-300;
    }

    .progress-bar {
        @apply bg-gray-700;
    }
}
</style>