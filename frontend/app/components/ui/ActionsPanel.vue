<template>
    <div class="actions-panel" :class="{ 'panel-disabled': !isValid && !isDraftMode }">
        <!-- En-tête -->
        <div class="panel-header">
            <h3 class="header-title">Actions de finalisation</h3>
            <div class="header-status" :class="statusClass">
                <span class="status-icon" aria-hidden="true">{{ statusIcon }}</span>
                <span class="status-text">{{ statusText }}</span>
            </div>
        </div>

        <!-- Message d'information -->
        <div v-if="!isValid && !isDraftMode" class="validation-message" role="alert">
            <div class="message-content">
                <span class="message-icon" aria-hidden="true">⚠️</span>
                <div class="message-text">
                    <p class="message-title">Formulaire incomplet</p>
                    <p class="message-description">
                        Veuillez corriger les erreurs avant d'enregistrer définitivement.
                        Vous pouvez toujours sauvegarder un brouillon.
                    </p>
                </div>
            </div>
        </div>

        <!-- Informations de modification -->
        <div v-if="isEditMode && initialData?.updatedAt" class="edit-info">
            <div class="info-content">
                <span class="info-icon" aria-hidden="true">📅</span>
                <div class="info-text">
                    <p class="info-title">Dernière modification</p>
                    <p class="info-date">{{ formatDate(initialData.updatedAt) }}</p>
                    <p v-if="initialData.createdAt" class="info-created">
                        Créé le {{ formatDate(initialData.createdAt) }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Actions principales -->
        <div class="actions-grid">
            <!-- Sauvegarde brouillon -->
            <button
                @click="handleSaveDraft"
                :disabled="saving"
                class="action-button action-draft"
                type="button"
                :aria-busy="saving"
            >
        <span v-if="saving" class="button-spinner" aria-hidden="true">
          ⏳
        </span>
                <span v-else class="button-icon" aria-hidden="true">
          💾
        </span>
                <span class="button-label">Sauvegarder en brouillon</span>
                <span class="button-description">
          Enregistre temporairement votre travail
        </span>
            </button>

            <!-- Enregistrement définitif -->
            <button
                @click="handleSave"
                :disabled="!isValid || saving"
                class="action-button action-save"
                type="button"
                :aria-disabled="!isValid || saving"
                :aria-busy="saving"
            >
        <span v-if="saving" class="button-spinner" aria-hidden="true">
          ⏳
        </span>
                <span v-else class="button-icon" aria-hidden="true">
          ✅
        </span>
                <span class="button-label">
          {{ isEditMode ? 'Mettre à jour' : 'Enregistrer la formule' }}
        </span>
                <span class="button-description">
          {{ isEditMode ? 'Met à jour la formule existante' : 'Enregistre définitivement la formule' }}
        </span>
            </button>

            <!-- Annulation -->
            <button
                @click="handleCancel"
                class="action-button action-cancel"
                type="button"
            >
        <span class="button-icon" aria-hidden="true">
          ↩️
        </span>
                <span class="button-label">Annuler</span>
                <span class="button-description">
          {{ isEditMode ? 'Revenir à la formule' : 'Abandonner la création' }}
        </span>
            </button>

            <!-- Options supplémentaires -->
            <div class="additional-actions">
                <button
                    @click="handleExport"
                    class="additional-button"
                    type="button"
                    aria-label="Exporter la formule"
                >
                    <span class="additional-icon" aria-hidden="true">📤</span>
                    <span class="additional-text">Exporter</span>
                </button>

                <button
                    @click="handlePrint"
                    class="additional-button"
                    type="button"
                    aria-label="Imprimer la formule"
                >
                    <span class="additional-icon" aria-hidden="true">🖨️</span>
                    <span class="additional-text">Imprimer</span>
                </button>

                <button
                    @click="handleDuplicate"
                    class="additional-button"
                    type="button"
                    aria-label="Dupliquer la formule"
                >
                    <span class="additional-icon" aria-hidden="true">📋</span>
                    <span class="additional-text">Dupliquer</span>
                </button>
            </div>
        </div>

        <!-- Avertissements et conseils -->
        <div v-if="showTips" class="tips-section">
            <div class="tips-header">
                <span class="tips-icon" aria-hidden="true">💡</span>
                <h4 class="tips-title">Conseils d'enregistrement</h4>
            </div>
            <ul class="tips-list">
                <li class="tip-item">
                    <span class="tip-bullet" aria-hidden="true">•</span>
                    <span class="tip-text">
            Les brouillons sont conservés pendant 30 jours
          </span>
                </li>
                <li class="tip-item">
                    <span class="tip-bullet" aria-hidden="true">•</span>
                    <span class="tip-text">
            Les formules enregistrées peuvent être modifiées ultérieurement
          </span>
                </li>
                <li class="tip-item">
                    <span class="tip-bullet" aria-hidden="true">•</span>
                    <span class="tip-text">
            Exportez régulièrement vos formules pour les sauvegarder
          </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
    // État de validation
    isValid: {
        type: Boolean,
        default: false
    },

    // Mode édition
    isEditMode: {
        type: Boolean,
        default: false
    },

    // État de sauvegarde
    saving: {
        type: Boolean,
        default: false
    },

    // Données initiales (pour mode édition)
    initialData: {
        type: Object,
        default: () => ({})
    },

    // Mode brouillon
    isDraftMode: {
        type: Boolean,
        default: false
    },

    // Afficher les conseils
    showTips: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['save', 'save-draft', 'cancel', 'export', 'print', 'duplicate'])

// États internes
const showMoreActions = ref(false)

// Computed properties
const statusClass = computed(() => ({
    'status-valid': props.isValid,
    'status-invalid': !props.isValid,
    'status-draft': props.isDraftMode
}))

const statusIcon = computed(() => {
    if (props.saving) return '⏳'
    if (props.isDraftMode) return '📝'
    return props.isValid ? '✅' : '⚠️'
})

const statusText = computed(() => {
    if (props.saving) return 'En cours de sauvegarde...'
    if (props.isDraftMode) return 'Mode brouillon'
    return props.isValid ? 'Prêt à enregistrer' : 'Validation requise'
})

// Méthodes
const handleSave = () => {
    if (!props.isValid || props.saving) return
    emit('save')
}

const handleSaveDraft = () => {
    if (props.saving) return
    emit('save-draft')
}

const handleCancel = () => {
    emit('cancel')
}

const handleExport = () => {
    emit('export')
}

const handlePrint = () => {
    emit('print')
}

const handleDuplicate = () => {
    emit('duplicate')
}

const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue'

    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return dateString
    }
}
</script>

<style scoped>
.actions-panel {
    @apply space-y-6;
}

.panel-disabled {
    @apply opacity-75;
}

/* Header */
.panel-header {
    @apply flex flex-col sm:flex-row sm:items-center justify-between gap-4
    pb-4 border-b border-gray-200;
}

.header-title {
    @apply text-xl font-bold text-gray-900;
}

.header-status {
    @apply flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium;
}

.status-valid {
    @apply bg-green-100 text-green-800;
}

.status-invalid {
    @apply bg-red-100 text-red-800;
}

.status-draft {
    @apply bg-blue-100 text-blue-800;
}

.status-icon {
    @apply text-base;
}

/* Validation message */
.validation-message {
    @apply p-4 bg-red-50 border border-red-200 rounded-lg;
}

.message-content {
    @apply flex items-start gap-3;
}

.message-icon {
    @apply text-red-600 text-xl flex-shrink-0;
}

.message-text {
    @apply flex-1;
}

.message-title {
    @apply font-semibold text-red-800 mb-1;
}

.message-description {
    @apply text-sm text-red-700;
}

/* Edit info */
.edit-info {
    @apply p-4 bg-blue-50 border border-blue-200 rounded-lg;
}

.info-content {
    @apply flex items-start gap-3;
}

.info-icon {
    @apply text-blue-600 text-xl flex-shrink-0;
}

.info-text {
    @apply flex-1;
}

.info-title {
    @apply font-semibold text-blue-800 text-sm;
}

.info-date {
    @apply font-medium text-blue-900 text-base;
}

.info-created {
    @apply text-xs text-blue-700 mt-1;
}

/* Actions grid */
.actions-grid {
    @apply space-y-4;
}

.action-button {
    @apply w-full p-4 rounded-xl border-2 transition-all duration-200
    flex flex-col items-center text-center
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed;
}

.action-draft {
    @apply bg-gray-50 border-gray-300 text-gray-700
    hover:bg-gray-100 hover:border-gray-400
    focus:ring-gray-500;
}

.action-save {
    @apply bg-gradient-to-r from-green-50 to-emerald-50
    border-green-300 text-green-800
    hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100
    hover:border-green-400
    focus:ring-green-500;
}

.action-save:not(:disabled):hover {
    @apply shadow-lg transform -translate-y-0.5;
}

.action-cancel {
    @apply bg-white border-gray-300 text-gray-700
    hover:bg-gray-50 hover:border-gray-400
    focus:ring-gray-500;
}

.button-spinner {
    @apply animate-spin text-2xl mb-2;
}

.button-icon {
    @apply text-2xl mb-2;
}

.button-label {
    @apply font-bold text-lg mb-1;
}

.button-description {
    @apply text-sm opacity-75;
}

/* Additional actions */
.additional-actions {
    @apply flex gap-2 pt-4 border-t border-gray-200;
}

.additional-button {
    @apply flex-1 flex flex-col items-center p-3 rounded-lg
    bg-gray-50 text-gray-700 hover:bg-gray-100
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    transition-colors;
}

.additional-icon {
    @apply text-xl mb-1;
}

.additional-text {
    @apply text-xs font-medium;
}

/* Tips section */
.tips-section {
    @apply p-4 bg-amber-50 border border-amber-200 rounded-lg;
}

.tips-header {
    @apply flex items-center gap-2 mb-3;
}

.tips-icon {
    @apply text-amber-600;
}

.tips-title {
    @apply font-semibold text-amber-800;
}

.tips-list {
    @apply space-y-1;
}

.tip-item {
    @apply flex items-start gap-2;
}

.tip-bullet {
    @apply text-amber-600 mt-1 flex-shrink-0;
}

.tip-text {
    @apply text-sm text-amber-700;
}

/* Responsive */
@media (min-width: 768px) {
    .actions-grid {
        @apply grid grid-cols-2 gap-4;
    }

    .action-cancel {
        @apply col-span-2;
    }

    .additional-actions {
        @apply col-span-2;
    }
}

@media (min-width: 1024px) {
    .actions-grid {
        @apply grid-cols-3;
    }

    .action-cancel {
        @apply col-span-1;
    }

    .additional-actions {
        @apply col-span-3;
    }
}

/* Animations */
.action-button {
    transition: all 0.2s ease;
}

.action-button:active:not(:disabled) {
    transform: scale(0.98);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    .action-button {
        transition: none;
    }

    .action-button:hover {
        transform: none;
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .actions-panel {
        @apply bg-gray-900;
    }

    .header-title {
        @apply text-gray-100;
    }

    .action-draft {
        @apply bg-gray-800 border-gray-700 text-gray-300
        hover:bg-gray-700;
    }

    .action-save {
        @apply bg-gradient-to-r from-green-900/20 to-emerald-900/20
        border-green-700 text-green-300
        hover:bg-gradient-to-r hover:from-green-800/30 hover:to-emerald-800/30;
    }

    .action-cancel {
        @apply bg-gray-800 border-gray-700 text-gray-300
        hover:bg-gray-700;
    }

    .validation-message {
        @apply bg-red-900/20 border-red-800;
    }

    .edit-info {
        @apply bg-blue-900/20 border-blue-800;
    }

    .tips-section {
        @apply bg-amber-900/20 border-amber-800;
    }
}
</style>