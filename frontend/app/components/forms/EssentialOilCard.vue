<template>
    <article
        class="essential-oil-card"
        :class="{
      'card-selected': isSelected,
      'card-warning': hasWarnings,
      'card-disabled': !isSelected && isLimitReached
    }"
        role="article"
        :aria-label="`Carte de l'huile essentielle ${oil.name}`"
    >
        <!-- Input checkbox (accessible mais caché) -->
        <input
            :id="`he-${oil.id || oil.name}`"
            type="checkbox"
            :checked="isSelected"
            @change="toggleSelection"
            :disabled="!isSelected && isLimitReached"
            class="card-checkbox sr-only"
            :aria-label="`Sélectionner ${oil.name}`"
        />

        <div class="card-container">
            <!-- En-tête de la carte -->
            <header class="card-header">
                <!-- Titre et nom latin -->
                <div class="header-main">
                    <label
                        :for="`he-${oil.id || oil.name}`"
                        class="header-title"
                        tabindex="0"
                        @keydown.enter="toggleSelection"
                        @keydown.space.prevent="toggleSelection"
                    >
                        <h3 class="oil-name">{{ oil.name }}</h3>
                        <p class="oil-latin" :aria-label="`Nom latin: ${oil.latinName}`">
                            {{ oil.latinName }}
                        </p>
                    </label>
                </div>

                <!-- Indicateur de sélection -->
                <div class="header-selection">
                    <div
                        class="selection-indicator"
                        :class="{ 'indicator-selected': isSelected }"
                        role="status"
                        :aria-label="isSelected ? 'Sélectionné' : 'Non sélectionné'"
                    >
            <span v-if="isSelected" class="indicator-icon" aria-hidden="true">
              ✓
            </span>
                    </div>
                </div>
            </header>

            <!-- Contenu principal -->
            <div class="card-body">
                <!-- Informations rapides -->
                <div class="oil-meta">
                    <div class="meta-item" v-if="oil.ifra">
                        <span class="meta-label" aria-label="Limite IFRA">IFRA</span>
                        <span
                            class="meta-value"
                            :class="getIFRAClass(oil.ifra)"
                            :title="`Limite d'utilisation maximale: ${oil.ifra}%`"
                        >
              {{ oil.ifra }}%
            </span>
                    </div>

                    <div class="meta-item" v-if="oil.maxFace">
                        <span class="meta-label" aria-label="Limite visage">Visage max</span>
                        <span class="meta-value">
              {{ oil.maxFace }}%
            </span>
                    </div>
                </div>

                <!-- Dosage (visible seulement si sélectionné) -->
                <div v-if="isSelected" class="oil-dosage">
                    <div class="dosage-header">
                        <label class="dosage-label">Concentration</label>
                        <div class="dosage-display">
                            <span class="dosage-value">{{ currentPercent }}%</span>
                            <span class="dosage-grams" :aria-label="`${grams} grammes`">
                ({{ grams }} g)
              </span>
                        </div>
                    </div>

                    <!-- Contrôle de dosage -->
                    <div class="dosage-controls">
                        <!-- Slider -->
                        <div class="dosage-slider">
                            <input
                                type="range"
                                v-model.number="currentPercent"
                                :min="0"
                                :max="oil.maxFace"
                                step="0.01"
                                class="slider-input"
                                :class="{ 'slider-warning': isDosageWarning }"
                                :aria-label="`Dosage de ${oil.name}`"
                                :aria-valuemin="0"
                                :aria-valuemax="oil.maxFace"
                                :aria-valuenow="currentPercent"
                                @input="updateDosage"
                            />
                            <div class="slider-track">
                                <div
                                    class="slider-fill"
                                    :style="{ width: `${(currentPercent / oil.maxFace) * 100}%` }"
                                ></div>
                            </div>
                            <div class="slider-labels">
                                <span class="slider-min">0%</span>
                                <span class="slider-max">{{ oil.maxFace }}%</span>
                            </div>
                        </div>

                        <!-- Contrôle numérique -->
                        <div class="dosage-numeric">
                            <div class="numeric-input">
                                <input
                                    type="number"
                                    v-model.number="currentPercent"
                                    :min="0"
                                    :max="oil.maxFace"
                                    step="0.01"
                                    class="input-field"
                                    :class="{ 'input-warning': isDosageWarning }"
                                    aria-label="Pourcentage numérique"
                                    @input="updateDosage"
                                />
                                <span class="input-suffix">%</span>
                            </div>
                            <div class="numeric-buttons">
                                <button
                                    type="button"
                                    @click="setDosage(0)"
                                    class="numeric-button"
                                    :class="{ 'button-active': currentPercent === 0 }"
                                    aria-label="Dosage zéro"
                                >
                                    0%
                                </button>
                                <button
                                    type="button"
                                    @click="setDosage(oil.maxFace * 0.5)"
                                    class="numeric-button"
                                    :class="{ 'button-active': Math.abs(currentPercent - oil.maxFace * 0.5) < 0.01 }"
                                    aria-label="Dosage moitié"
                                >
                                    50%
                                </button>
                                <button
                                    type="button"
                                    @click="setDosage(oil.maxFace)"
                                    class="numeric-button"
                                    :class="{ 'button-active': currentPercent === oil.maxFace }"
                                    aria-label="Dosage maximum"
                                >
                                    100%
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Propriétés -->
                <div class="oil-properties" v-if="oil.properties && oil.properties.length">
                    <div class="properties-label" aria-label="Propriétés">Propriétés</div>
                    <div class="properties-list">
            <span
                v-for="(prop, index) in displayedProperties"
                :key="index"
                class="property-badge"
                :class="getPropertyClass(prop)"
            >
              {{ prop }}
            </span>
                        <span
                            v-if="oil.properties.length > maxProperties"
                            class="property-more"
                            :title="`${oil.properties.length - maxProperties} propriétés supplémentaires`"
                        >
              +{{ oil.properties.length - maxProperties }}
            </span>
                    </div>
                </div>
            </div>

            <!-- Pied de carte avec avertissements -->
            <footer class="card-footer">
                <!-- Avertissements -->
                <div class="oil-warnings">
          <span
              v-if="!oil.pregnancy"
              class="warning-badge pregnancy"
              :title="`Non recommandée pendant la grossesse et l'allaitement`"
              aria-label="Contre-indiquée grossesse"
          >
            <span class="warning-icon" aria-hidden="true">👶</span>
            <span class="warning-text">Grossesse</span>
          </span>

                    <span
                        v-if="oil.photo"
                        class="warning-badge photo"
                        :title="`Photosensible - éviter l'exposition au soleil après application`"
                        aria-label="Photosensible"
                    >
            <span class="warning-icon" aria-hidden="true">☀️</span>
            <span class="warning-text">Photosensible</span>
          </span>

                    <span
                        v-if="oil.allergen"
                        class="warning-badge allergen"
                        :title="`Potentiel allergène - mention obligatoire sur l'étiquetage`"
                        aria-label="Potentiel allergène"
                    >
            <span class="warning-icon" aria-hidden="true">⚠️</span>
            <span class="warning-text">Allergène</span>
          </span>

                    <span
                        v-if="isDosageWarning"
                        class="warning-badge dosage"
                        :title="`Dosage proche ou supérieur à la limite maximale recommandée`"
                        aria-label="Dosage élevé"
                    >
            <span class="warning-icon" aria-hidden="true">📈</span>
            <span class="warning-text">Dosage élevé</span>
          </span>
                </div>

                <!-- Message si limite atteinte -->
                <div
                    v-if="!isSelected && isLimitReached"
                    class="limit-message"
                    role="alert"
                    aria-label="Limite d'huiles essentielles atteinte"
                >
                    <span class="limit-icon" aria-hidden="true">⛔</span>
                    <span class="limit-text">Limite totale atteinte</span>
                </div>
            </footer>
        </div>
    </article>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
    // Données de l'huile essentielle
    oil: {
        type: Object,
        required: true,
        validator: (value) => {
            return value && value.name && value.latinName
        }
    },

    // Si l'huile est sélectionnée
    isSelected: {
        type: Boolean,
        default: false
    },

    // Pourcentage total des HE (pour vérifier la limite)
    totalPercent: {
        type: Number,
        default: 0
    },

    // Volume de la formule (pour calcul des grammes)
    volume: {
        type: Number,
        default: 50
    },

    // Nombre max de propriétés à afficher
    maxProperties: {
        type: Number,
        default: 2
    }
})

const emit = defineEmits(['toggle', 'update-percent'])

// État local pour le dosage
const currentPercent = ref(props.oil.percent || 0)

// Surveiller les changements externes
watch(() => props.oil.percent, (newValue) => {
    if (newValue !== undefined) {
        currentPercent.value = newValue
    }
})

watch(() => props.isSelected, (newValue) => {
    if (newValue && currentPercent.value === 0) {
        // Initialiser à 50% de la limite max si sélectionnée
        currentPercent.value = Math.min(props.oil.maxFace * 0.5, 0.3)
        updateDosage()
    }
})

// Computed properties
const hasWarnings = computed(() => {
    return !props.oil.pregnancy || props.oil.photo || props.oil.allergen || isDosageWarning.value
})

const isLimitReached = computed(() => {
    return props.totalPercent >= 1
})

const isDosageWarning = computed(() => {
    return currentPercent.value > (props.oil.maxFace || 1) * 0.8
})

const grams = computed(() => {
    return ((props.volume * currentPercent.value) / 100).toFixed(2)
})

const displayedProperties = computed(() => {
    return props.oil.properties?.slice(0, props.maxProperties) || []
})

// Méthodes utilitaires
const getIFRAClass = (ifraValue) => {
    if (ifraValue <= 0.3) return 'ifra-high'
    if (ifraValue <= 0.8) return 'ifra-medium'
    return 'ifra-low'
}

const getPropertyClass = (property) => {
    const propertyMap = {
        'Anti-âge': 'property-antiage',
        'Hydratant': 'property-hydrating',
        'Apaisant': 'property-soothing',
        'Purifiant': 'property-purifying',
        'Antioxydant': 'property-antioxidant',
        'Régénérant': 'property-regenerating',
        'Antiseptique': 'property-antiseptic',
        'Cicatrisant': 'property-healing'
    }

    return propertyMap[property] || 'property-default'
}

// Méthodes d'actions
const toggleSelection = () => {
    if (!props.isSelected && isLimitReached.value) {
        return // Ne pas permettre la sélection si limite atteinte
    }

    emit('toggle', {
        oil: props.oil,
        action: props.isSelected ? 'remove' : 'add',
        percent: currentPercent.value
    })
}

const updateDosage = () => {
    // S'assurer que le dosage reste dans les limites
    const max = props.oil.maxFace || 1
    currentPercent.value = Math.max(0, Math.min(currentPercent.value, max))

    emit('update-percent', {
        oilName: props.oil.name,
        percent: currentPercent.value
    })
}

const setDosage = (value) => {
    currentPercent.value = value
    updateDosage()
}
</script>

<style scoped>
.essential-oil-card {
    @apply relative border-2 rounded-xl bg-white
    transition-all duration-300
    focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2;
}

.card-selected {
    @apply border-green-400 bg-gradient-to-br from-green-50 to-emerald-50
    shadow-lg;
}

.card-warning {
    @apply border-orange-300;
}

.card-disabled {
    @apply opacity-60 cursor-not-allowed border-gray-300;
}

.card-container {
    @apply p-4 h-full flex flex-col;
}

/* Header */
.card-header {
    @apply flex justify-between items-start mb-3;
}

.header-main {
    @apply flex-1 min-w-0;
}

.header-title {
    @apply cursor-pointer focus:outline-none;
}

.oil-name {
    @apply font-bold text-gray-900 text-base leading-tight truncate
    group-hover:text-green-700 transition-colors;
}

.card-selected .oil-name {
    @apply text-green-800;
}

.oil-latin {
    @apply text-xs text-gray-500 font-mono truncate mt-1;
}

.header-selection {
    @apply ml-2;
}

.selection-indicator {
    @apply w-6 h-6 rounded-full border-2 border-gray-300
    flex items-center justify-center transition-colors;
}

.indicator-selected {
    @apply border-green-500 bg-green-500;
}

.indicator-icon {
    @apply text-white text-xs font-bold;
}

/* Body */
.card-body {
    @apply flex-1 space-y-3;
}

/* Meta informations */
.oil-meta {
    @apply flex gap-3;
}

.meta-item {
    @apply flex flex-col;
}

.meta-label {
    @apply text-xs text-gray-500 mb-0.5;
}

.meta-value {
    @apply text-sm font-semibold;
}

.ifra-high {
    @apply text-red-600;
}

.ifra-medium {
    @apply text-amber-600;
}

.ifra-low {
    @apply text-green-600;
}

/* Dosage section */
.oil-dosage {
    @apply space-y-3 pt-3 border-t border-gray-200;
}

.dosage-header {
    @apply flex justify-between items-center;
}

.dosage-label {
    @apply text-sm font-medium text-gray-700;
}

.dosage-display {
    @apply text-right;
}

.dosage-value {
    @apply text-lg font-bold text-green-700;
}

.dosage-grams {
    @apply block text-xs text-gray-500;
}

.dosage-controls {
    @apply space-y-3;
}

/* Slider */
.dosage-slider {
    @apply space-y-2;
}

.slider-input {
    @apply sr-only; /* Caché, on utilise notre propre slider personnalisé */
}

.slider-track {
    @apply relative h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full;
}

.slider-fill {
    @apply absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-green-400 to-green-500
    transition-all duration-300;
}

.slider-warning + .slider-track .slider-fill {
    @apply from-amber-400 to-amber-500;
}

.slider-labels {
    @apply flex justify-between text-xs text-gray-500 px-1;
}

/* Contrôle numérique */
.dosage-numeric {
    @apply flex items-center gap-3;
}

.numeric-input {
    @apply relative flex-1;
}

.input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
    text-center;
}

.input-warning {
    @apply border-amber-300 focus:ring-amber-500 focus:border-amber-500;
}

.input-suffix {
    @apply absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500;
}

.numeric-buttons {
    @apply flex gap-1;
}

.numeric-button {
    @apply px-2 py-1 text-xs border border-gray-300 rounded
    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500
    transition-colors;
}

.button-active {
    @apply bg-green-100 text-green-800 border-green-400;
}

/* Propriétés */
.oil-properties {
    @apply pt-3 border-t border-gray-200;
}

.properties-label {
    @apply text-xs font-medium text-gray-700 mb-2;
}

.properties-list {
    @apply flex flex-wrap gap-1;
}

.property-badge {
    @apply px-2 py-1 rounded-full text-xs font-medium border;
}

.property-antiage {
    @apply bg-purple-50 text-purple-800 border-purple-200;
}

.property-hydrating {
    @apply bg-blue-50 text-blue-800 border-blue-200;
}

.property-soothing {
    @apply bg-green-50 text-green-800 border-green-200;
}

.property-purifying {
    @apply bg-teal-50 text-teal-800 border-teal-200;
}

.property-antioxidant {
    @apply bg-orange-50 text-orange-800 border-orange-200;
}

.property-regenerating {
    @apply bg-pink-50 text-pink-800 border-pink-200;
}

.property-antiseptic {
    @apply bg-red-50 text-red-800 border-red-200;
}

.property-healing {
    @apply bg-indigo-50 text-indigo-800 border-indigo-200;
}

.property-default {
    @apply bg-gray-50 text-gray-800 border-gray-200;
}

.property-more {
    @apply px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600;
}

/* Footer avec avertissements */
.card-footer {
    @apply pt-3 border-t border-gray-200;
}

.oil-warnings {
    @apply flex flex-wrap gap-1;
}

.warning-badge {
    @apply inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium;
}

.pregnancy {
    @apply bg-red-100 text-red-800;
}

.photo {
    @apply bg-amber-100 text-amber-800;
}

.allergen {
    @apply bg-orange-100 text-orange-800;
}

.dosage {
    @apply bg-purple-100 text-purple-800;
}

.warning-icon {
    @apply text-xs;
}

.warning-text {
    @apply truncate;
}

/* Message limite */
.limit-message {
    @apply flex items-center gap-1 mt-2 px-2 py-1 bg-red-50 text-red-700
    rounded text-xs font-medium;
}

.limit-icon {
    @apply text-xs;
}

/* Animations */
.essential-oil-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.essential-oil-card:hover:not(.card-disabled) {
    @apply -translate-y-1 shadow-md;
}

.essential-oil-card:active:not(.card-disabled) {
    transform: translateY(0) scale(0.98);
}

/* Accessibilité améliorée */
@media (prefers-reduced-motion: reduce) {
    .essential-oil-card,
    .slider-fill,
    .numeric-button {
        transition: none;
    }

    .essential-oil-card:hover:not(.card-disabled) {
        transform: none;
    }
}

/* Focus visible amélioré */
:focus-visible {
    outline: 2px solid #10b981;
    outline-offset: 2px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .essential-oil-card {
        @apply bg-gray-800;
    }

    .card-selected {
        @apply bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700;
    }

    .oil-name {
        @apply text-gray-100;
    }

    .card-selected .oil-name {
        @apply text-green-300;
    }

    .oil-latin {
        @apply text-gray-400;
    }

    .selection-indicator {
        @apply border-gray-600;
    }

    .indicator-selected {
        @apply border-green-600 bg-green-600;
    }

    .meta-label {
        @apply text-gray-400;
    }

    .ifra-high {
        @apply text-red-400;
    }

    .ifra-medium {
        @apply text-amber-400;
    }

    .ifra-low {
        @apply text-green-400;
    }

    .dosage-label {
        @apply text-gray-300;
    }

    .dosage-value {
        @apply text-green-400;
    }

    .dosage-grams {
        @apply text-gray-500;
    }

    .slider-track {
        @apply bg-gray-700;
    }

    .input-field {
        @apply bg-gray-700 border-gray-600 text-gray-100;
    }

    .numeric-button {
        @apply bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600;
    }

    .button-active {
        @apply bg-green-900/30 text-green-300 border-green-700;
    }

    .properties-label {
        @apply text-gray-300;
    }

    /* Propriétés en dark mode */
    .property-antiage {
        @apply bg-purple-900/30 text-purple-300 border-purple-800;
    }

    .property-hydrating {
        @apply bg-blue-900/30 text-blue-300 border-blue-800;
    }

    .property-soothing {
        @apply bg-green-900/30 text-green-300 border-green-800;
    }

    .property-purifying {
        @apply bg-teal-900/30 text-teal-300 border-teal-800;
    }

    .property-antioxidant {
        @apply bg-orange-900/30 text-orange-300 border-orange-800;
    }

    .property-regenerating {
        @apply bg-pink-900/30 text-pink-300 border-pink-800;
    }

    .property-antiseptic {
        @apply bg-red-900/30 text-red-300 border-red-800;
    }

    .property-healing {
        @apply bg-indigo-900/30 text-indigo-300 border-indigo-800;
    }

    .property-default {
        @apply bg-gray-700 text-gray-300 border-gray-600;
    }

    .property-more {
        @apply bg-gray-700 text-gray-400;
    }

    /* Avertissements en dark mode */
    .pregnancy {
        @apply bg-red-900/30 text-red-300;
    }

    .photo {
        @apply bg-amber-900/30 text-amber-300;
    }

    .allergen {
        @apply bg-orange-900/30 text-orange-300;
    }

    .dosage {
        @apply bg-purple-900/30 text-purple-300;
    }

    .limit-message {
        @apply bg-red-900/30 text-red-300;
    }
}

/* High contrast support */
@media (prefers-contrast: high) {
    .essential-oil-card {
        @apply border-2;
    }

    .card-selected {
        @apply border-4;
    }

    .property-badge,
    .warning-badge {
        @apply border-2;
    }
}
</style>