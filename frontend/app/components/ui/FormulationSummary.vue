<template>
    <div class="formulation-summary">
        <!-- En-tête -->
        <div class="summary-header">
            <div class="header-content">
                <div class="header-icon" aria-hidden="true">
                    📋
                </div>
                <h2 class="header-title">Résumé de la formule</h2>
            </div>

            <button
                v-if="isMobile"
                @click="toggleExpanded"
                class="expand-button"
                :aria-label="expanded ? 'Réduire le résumé' : 'Développer le résumé'"
                :aria-expanded="expanded"
            >
        <span class="expand-icon" aria-hidden="true">
          {{ expanded ? '−' : '+' }}
        </span>
            </button>
        </div>

        <!-- Contenu -->
        <div class="summary-content" :class="{ 'content-expanded': expanded || !isMobile }">
            <!-- Informations principales -->
            <div class="info-section">
                <!-- Nom de la formule -->
                <div class="info-item">
                    <div class="info-label">
                        <span>Nom de la formule</span>
                        <span class="info-required" aria-label="Champ obligatoire">*</span>
                    </div>
                    <div class="info-value" :class="{ 'value-empty': !formData.name }">
                        {{ formData.name || 'À renseigner' }}
                    </div>
                </div>

                <!-- Volume et type de peau -->
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Volume total</div>
                        <div class="info-value volume-value">
                            {{ formData.volume }} ml
                        </div>
                    </div>

                    <div class="info-item">
                        <div class="info-label">Type de peau</div>
                        <div class="info-value skin-value">
                            {{ skinTypeLabel }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statut réglementaire -->
            <div v-if="regulatoryErrors.length > 0" class="regulatory-section" role="alert">
                <div class="regulatory-header">
                    <span class="regulatory-icon" aria-hidden="true">⚠️</span>
                    <h3 class="regulatory-title">Alertes réglementaires</h3>
                </div>
                <ul class="regulatory-list">
                    <li
                        v-for="(error, index) in regulatoryErrors.slice(0, 3)"
                        :key="index"
                        class="regulatory-item"
                    >
                        <span class="item-bullet" aria-hidden="true">•</span>
                        <span class="item-text">{{ error }}</span>
                    </li>
                    <li v-if="regulatoryErrors.length > 3" class="regulatory-more">
                        + {{ regulatoryErrors.length - 3 }} autres alertes
                    </li>
                </ul>
            </div>

            <!-- Composition rapide -->
            <div class="composition-section">
                <div class="section-header">
                    <h3 class="section-title">Répartition des phases</h3>
                    <div class="section-total">
                        {{ totalPercentage }}%
                    </div>
                </div>

                <!-- Graphique en barres -->
                <div class="composition-chart">
                    <div class="chart-bars">
                        <div
                            v-for="phase in phases"
                            :key="phase.name"
                            class="chart-bar"
                            :style="{ width: `${phase.percent}%` }"
                            :class="`bar-${phase.name.toLowerCase().replace(/\s+/g, '-')}`"
                            :title="`${phase.name}: ${phase.percent}%`"
                        >
                            <span class="bar-label">{{ phase.percent }}%</span>
                        </div>
                    </div>
                </div>

                <!-- Légende détaillée -->
                <div class="composition-details">
                    <div
                        v-for="phase in phases"
                        :key="phase.name"
                        class="phase-item"
                    >
                        <div class="phase-info">
                            <div class="phase-color" :style="{ backgroundColor: phase.color }"></div>
                            <span class="phase-name">{{ phase.name }}</span>
                        </div>
                        <div class="phase-values">
                            <span class="phase-percent">{{ phase.percent }}%</span>
                            <span class="phase-grams">{{ phase.grams }} g</span>
                        </div>
                    </div>
                </div>

                <!-- Eau restante -->
                <div class="water-section">
                    <div class="water-info">
                        <div class="water-label">
                            <span class="water-icon" aria-hidden="true">💧</span>
                            <span>Eau déminéralisée</span>
                        </div>
                        <div class="water-values">
                            <span class="water-percent">{{ waterPercent }}%</span>
                            <span class="water-grams">{{ waterGrams }} g</span>
                        </div>
                    </div>
                    <div class="water-progress">
                        <div
                            class="water-fill"
                            :style="{ width: `${waterPercent}%` }"
                        ></div>
                    </div>
                </div>
            </div>

            <!-- Informations de conformité -->
            <div class="compliance-section">
                <div class="compliance-header">
                    <div class="compliance-status" :class="complianceClass">
            <span class="status-icon" aria-hidden="true">
              {{ isValid ? '✅' : '❌' }}
            </span>
                        <span class="status-text">
              {{ isValid ? 'Formule valide' : 'Formule non valide' }}
            </span>
                    </div>

                    <div class="completion-progress">
                        <div class="progress-label">Complétion</div>
                        <div class="progress-value">{{ completionPercentage }}%</div>
                    </div>
                </div>

                <!-- Liste des vérifications -->
                <div class="compliance-list">
                    <div
                        v-for="check in quickChecks"
                        :key="check.name"
                        class="compliance-item"
                        :class="check.passed ? 'item-passed' : 'item-failed'"
                    >
            <span class="item-icon" aria-hidden="true">
              {{ check.passed ? '✓' : '✗' }}
            </span>
                        <span class="item-text">{{ check.name }}</span>
                    </div>
                </div>
            </div>

            <!-- Actions rapides -->
            <div class="actions-section">
                <button
                    @click="generateReport"
                    :disabled="!isValid"
                    class="action-button action-primary"
                    :class="{ 'button-disabled': !isValid }"
                    type="button"
                    :aria-disabled="!isValid"
                    aria-label="Générer le rapport PDF de la formule"
                >
                    <span class="button-icon" aria-hidden="true">📄</span>
                    <span class="button-text">Générer PDF</span>
                </button>

                <button
                    @click="exportFormula"
                    class="action-button action-secondary"
                    type="button"
                    aria-label="Exporter la formule au format JSON"
                >
                    <span class="button-icon" aria-hidden="true">📤</span>
                    <span class="button-text">Exporter</span>
                </button>

                <button
                    v-if="hasUnsavedChanges"
                    @click="saveChanges"
                    class="action-button action-save"
                    type="button"
                    aria-label="Sauvegarder les modifications"
                >
                    <span class="button-icon" aria-hidden="true">💾</span>
                    <span class="button-text">Sauvegarder</span>
                </button>
            </div>

            <!-- Métadonnées -->
            <div v-if="metadata" class="metadata-section">
                <div class="metadata-item">
                    <span class="metadata-label">Créée le</span>
                    <span class="metadata-value">{{ formatDate(metadata.createdAt) }}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">Dernière modification</span>
                    <span class="metadata-value">{{ formatDate(metadata.updatedAt) }}</span>
                </div>
                <div v-if="metadata.version" class="metadata-item">
                    <span class="metadata-label">Version</span>
                    <span class="metadata-value">{{ metadata.version }}</span>
                </div>
            </div>
        </div>

        <!-- Indicateur de statut en mobile -->
        <div v-if="isMobile && !expanded" class="mobile-indicator">
            <div class="indicator-content">
                <span class="indicator-dot" :class="complianceClass"></span>
                <span class="indicator-text">
          {{ isValid ? '✓ Valide' : '⚠️ ' + regulatoryErrors.length + ' erreur(s)' }}
        </span>
                <span class="indicator-percent">{{ completionPercentage }}%</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    // Données de la formule
    formData: {
        type: Object,
        required: true,
        default: () => ({
            name: '',
            volume: 50,
            skinType: 'mixte'
        })
    },

    // Erreurs réglementaires
    regulatoryErrors: {
        type: Array,
        default: () => []
    },

    // Phases de la formule
    phases: {
        type: Array,
        default: () => []
    },

    // Pourcentage de complétion
    completionPercentage: {
        type: Number,
        default: 0
    },

    // Statut de validité
    isValid: {
        type: Boolean,
        default: false
    },

    // Métadonnées (optionnel)
    metadata: {
        type: Object,
        default: null
    },

    // Indique s'il y a des modifications non sauvegardées
    hasUnsavedChanges: {
        type: Boolean,
        default: false
    },

    // Volume pour les calculs (optionnel, sinon utilise formData.volume)
    volume: {
        type: Number,
        default: null
    }
})

const emit = defineEmits([
    'generate-report',
    'export-formula',
    'save-changes'
])

// États internes
const expanded = ref(true)
const isMobile = ref(false)

// Computed properties
const skinTypeLabel = computed(() => {
    if (!props.formData.skinType) return '—'
    return props.formData.skinType.charAt(0).toUpperCase() + props.formData.skinType.slice(1)
})

const totalPercentage = computed(() => {
    return props.phases.reduce((total, phase) => total + phase.percent, 0)
})

const waterPercent = computed(() => {
    return 100 - totalPercentage.value
})

const waterGrams = computed(() => {
    const volume = props.volume || props.formData.volume || 50
    return ((volume * waterPercent.value) / 100).toFixed(2)
})

const complianceClass = computed(() => {
    return props.isValid ? 'compliance-valid' : 'compliance-invalid'
})

const quickChecks = computed(() => {
    return [
        {
            name: 'Nom de formule',
            passed: !!props.formData.name?.trim()
        },
        {
            name: 'Type de peau',
            passed: !!props.formData.skinType
        },
        {
            name: 'Volume valide',
            passed: props.formData.volume > 0 && props.formData.volume <= 1000
        },
        {
            name: 'Cohérence phases',
            passed: totalPercentage.value <= 100
        }
    ]
})

// Méthodes
const toggleExpanded = () => {
    expanded.value = !expanded.value
}

const generateReport = () => {
    if (!props.isValid) return
    emit('generate-report')
}

const exportFormula = () => {
    emit('export-formula')
}

const saveChanges = () => {
    emit('save-changes')
}

const formatDate = (dateString) => {
    if (!dateString) return '—'

    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    } catch {
        return dateString
    }
}

// Gestion responsive
const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
}

// Lifecycle
onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.formulation-summary {
    @apply bg-white rounded-xl shadow-sm border border-gray-200
    transition-all duration-300;
    position: sticky;
    top: 1rem;
}

/* Header */
.summary-header {
    @apply flex items-center justify-between p-4 border-b border-gray-200;
}

.header-content {
    @apply flex items-center gap-3;
}

.header-icon {
    @apply p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white text-xl;
}

.header-title {
    @apply text-xl font-bold text-gray-900;
}

.expand-button {
    @apply lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-colors;
}

.expand-icon {
    @apply text-xl font-bold;
}

/* Content */
.summary-content {
    @apply p-4 space-y-6;
}

@media (max-width: 1023px) {
    .summary-content:not(.content-expanded) {
        @apply hidden;
    }
}

/* Info section */
.info-section {
    @apply space-y-4;
}

.info-item {
    @apply space-y-1;
}

.info-label {
    @apply flex items-center gap-1 text-sm font-medium text-gray-700;
}

.info-required {
    @apply text-red-500;
}

.info-value {
    @apply p-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-900
    font-medium truncate;
}

.value-empty {
    @apply text-red-500 italic;
}

.info-grid {
    @apply grid grid-cols-2 gap-4;
}

.volume-value {
    @apply bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700
    border-blue-200 text-lg font-bold;
}

.skin-value {
    @apply bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700
    border-purple-200 text-lg font-bold capitalize;
}

/* Regulatory section */
.regulatory-section {
    @apply p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg
    border border-red-200;
}

.regulatory-header {
    @apply flex items-center gap-2 mb-3;
}

.regulatory-icon {
    @apply text-red-600 text-xl;
}

.regulatory-title {
    @apply font-bold text-red-800;
}

.regulatory-list {
    @apply space-y-2;
}

.regulatory-item {
    @apply flex items-start gap-2;
}

.item-bullet {
    @apply text-red-500 mt-1 text-sm;
}

.item-text {
    @apply text-sm text-red-700;
}

.regulatory-more {
    @apply text-sm text-red-600 italic;
}

/* Composition section */
.composition-section {
    @apply space-y-4;
}

.section-header {
    @apply flex items-center justify-between;
}

.section-title {
    @apply font-bold text-gray-900;
}

.section-total {
    @apply px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold;
}

/* Chart */
.composition-chart {
    @apply h-6 bg-gray-100 rounded-full overflow-hidden;
}

.chart-bars {
    @apply flex h-full rounded-full overflow-hidden;
}

.chart-bar {
    @apply h-full transition-all duration-500 relative;
    min-width: 20px;
}

.bar-label {
    @apply absolute inset-0 flex items-center justify-center text-xs font-bold
    text-white px-1 truncate;
}

/* Couleurs des barres */
.bar-phase-huileuse {
    @apply bg-gradient-to-r from-amber-500 to-yellow-500;
}

.bar-hydrolats {
    @apply bg-gradient-to-r from-blue-500 to-cyan-500;
}

.bar-actifs {
    @apply bg-gradient-to-r from-purple-500 to-pink-500;
}

.bar-he {
    @apply bg-gradient-to-r from-green-500 to-emerald-500;
}

.bar-conservateur {
    @apply bg-gradient-to-r from-red-500 to-orange-500;
}

.bar-émulsifiant {
    @apply bg-gradient-to-r from-pink-500 to-rose-500;
}

/* Composition details */
.composition-details {
    @apply space-y-2;
}

.phase-item {
    @apply flex justify-between items-center py-1;
}

.phase-info {
    @apply flex items-center gap-2;
}

.phase-color {
    @apply w-3 h-3 rounded;
}

.phase-name {
    @apply text-sm text-gray-700;
}

.phase-values {
    @apply flex items-center gap-3;
}

.phase-percent {
    @apply text-sm font-medium text-gray-900;
}

.phase-grams {
    @apply text-xs text-gray-500;
}

/* Water section */
.water-section {
    @apply pt-3 border-t border-gray-200;
}

.water-info {
    @apply flex justify-between items-center mb-2;
}

.water-label {
    @apply flex items-center gap-2 text-sm text-gray-700;
}

.water-icon {
    @apply text-blue-500;
}

.water-values {
    @apply flex items-center gap-3;
}

.water-percent {
    @apply text-sm font-medium text-blue-600;
}

.water-grams {
    @apply text-xs text-blue-500;
}

.water-progress {
    @apply h-2 bg-blue-100 rounded-full overflow-hidden;
}

.water-fill {
    @apply h-full bg-gradient-to-r from-blue-200 to-blue-300 rounded-full
    transition-all duration-500;
}

/* Compliance section */
.compliance-section {
    @apply space-y-3;
}

.compliance-header {
    @apply flex items-center justify-between;
}

.compliance-status {
    @apply flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium;
}

.compliance-valid {
    @apply bg-green-100 text-green-800;
}

.compliance-invalid {
    @apply bg-red-100 text-red-800;
}

.completion-progress {
    @apply text-right;
}

.progress-label {
    @apply text-xs text-gray-600;
}

.progress-value {
    @apply text-lg font-bold text-blue-600;
}

.compliance-list {
    @apply grid grid-cols-2 gap-2;
}

.compliance-item {
    @apply flex items-center gap-2 p-2 rounded-lg text-sm;
}

.item-passed {
    @apply bg-green-50 text-green-700 border border-green-200;
}

.item-failed {
    @apply bg-red-50 text-red-700 border border-red-200;
}

/* Actions section */
.actions-section {
    @apply pt-4 border-t border-gray-200 space-y-3;
}

.action-button {
    @apply w-full py-3 px-4 rounded-xl font-medium transition-all duration-300
    flex items-center justify-center gap-3 focus:outline-none
    focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.action-primary {
    @apply bg-gradient-to-r from-blue-500 to-blue-600 text-white
    hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500;
}

.action-secondary {
    @apply bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200
    text-gray-700 hover:from-gray-100 hover:to-gray-200 focus:ring-gray-500;
}

.action-save {
    @apply bg-gradient-to-r from-green-500 to-emerald-500 text-white
    hover:from-green-600 hover:to-emerald-600 focus:ring-green-500;
}

.button-disabled {
    @apply opacity-50 cursor-not-allowed;
}

.button-icon {
    @apply text-xl;
}

/* Metadata section */
.metadata-section {
    @apply pt-4 border-t border-gray-200 space-y-2;
}

.metadata-item {
    @apply flex justify-between text-sm;
}

.metadata-label {
    @apply text-gray-600;
}

.metadata-value {
    @apply text-gray-900 font-medium;
}

/* Mobile indicator */
.mobile-indicator {
    @apply lg:hidden p-3 border-t border-gray-200;
}

.indicator-content {
    @apply flex items-center justify-between;
}

.indicator-dot {
    @apply w-3 h-3 rounded-full;
}

.indicator-dot.compliance-valid {
    @apply bg-green-500;
}

.indicator-dot.compliance-invalid {
    @apply bg-red-500;
}

.indicator-text {
    @apply text-sm font-medium text-gray-700;
}

.indicator-percent {
    @apply text-sm font-bold text-blue-600;
}

/* Responsive */
@media (min-width: 1024px) {
    .formulation-summary {
        max-height: calc(100vh - 2rem);
        overflow-y: auto;
    }

    .summary-content {
        max-height: calc(100vh - 8rem);
        overflow-y: auto;
        padding-right: 0.5rem;
    }

    /* Custom scrollbar for desktop */
    .summary-content::-webkit-scrollbar {
        width: 4px;
    }

    .summary-content::-webkit-scrollbar-track {
        @apply bg-gray-100 rounded;
    }

    .summary-content::-webkit-scrollbar-thumb {
        @apply bg-gray-300 rounded;
    }

    .summary-content::-webkit-scrollbar-thumb:hover {
        @apply bg-gray-400;
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .formulation-summary {
        @apply bg-gray-900 border-gray-700;
    }

    .header-title {
        @apply text-gray-100;
    }

    .info-value {
        @apply bg-gray-800 border-gray-700 text-gray-100;
    }

    .volume-value {
        @apply bg-gradient-to-br from-blue-900/30 to-blue-800/30 text-blue-300 border-blue-800;
    }

    .skin-value {
        @apply bg-gradient-to-br from-purple-900/30 to-purple-800/30 text-purple-300 border-purple-800;
    }

    .regulatory-section {
        @apply bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-800;
    }

    .section-title {
        @apply text-gray-100;
    }

    .section-total {
        @apply bg-blue-900/30 text-blue-300;
    }

    .composition-chart {
        @apply bg-gray-800;
    }

    .phase-name {
        @apply text-gray-300;
    }

    .phase-percent {
        @apply text-gray-100;
    }

    .phase-grams {
        @apply text-gray-500;
    }

    .water-label {
        @apply text-gray-300;
    }

    .water-progress {
        @apply bg-blue-900/30;
    }

    .water-fill {
        @apply bg-gradient-to-r from-blue-800/50 to-blue-700/50;
    }

    .compliance-valid {
        @apply bg-green-900/30 text-green-300;
    }

    .compliance-invalid {
        @apply bg-red-900/30 text-red-300;
    }

    .item-passed {
        @apply bg-green-900/20 text-green-300 border-green-800;
    }

    .item-failed {
        @apply bg-red-900/20 text-red-300 border-red-800;
    }

    .action-secondary {
        @apply bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700
        text-gray-300 hover:from-gray-700 hover:to-gray-800;
    }

    .metadata-label {
        @apply text-gray-400;
    }

    .metadata-value {
        @apply text-gray-300;
    }
}
</style>