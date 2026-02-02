<template>
    <div
        class="validation-item"
        :class="{
      'item-passed': check.passed,
      'item-failed': !check.passed
    }"
        role="listitem"
    >
        <!-- Icone de statut -->
        <div class="item-status" :aria-label="check.passed ? 'Validé' : 'Échoué'">
      <span class="status-icon" aria-hidden="true">
        {{ check.passed ? '✅' : '❌' }}
      </span>
        </div>

        <!-- Contenu -->
        <div class="item-content">
            <div class="item-header">
                <h4 class="item-title">{{ check.name }}</h4>
                <span
                    class="item-badge"
                    :class="check.passed ? 'badge-passed' : 'badge-failed'"
                >
          {{ check.passed ? 'Conforme' : 'Non conforme' }}
        </span>
            </div>

            <p class="item-description">
                {{ check.description }}
            </p>

            <!-- Message d'erreur -->
            <div v-if="!check.passed && check.error" class="item-error">
                <div class="error-content">
                    <span class="error-icon" aria-hidden="true">⚠️</span>
                    <span class="error-text">{{ check.error }}</span>
                </div>
                <p v-if="check.recommendation" class="error-recommendation">
                    <strong>Recommandation:</strong> {{ check.recommendation }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    check: {
        type: Object,
        required: true,
        validator: (value) => {
            return value && typeof value === 'object' && value.name && value.description !== undefined
        }
    }
})
</script>

<style scoped>
.validation-item {
    @apply flex items-start gap-4 p-4 rounded-lg border transition-all duration-300;
}

.item-passed {
    @apply bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-green-200;
}

.item-failed {
    @apply bg-gradient-to-r from-red-50/50 to-orange-50/50 border-red-200;
}

.item-status {
    @apply flex-shrink-0;
}

.status-icon {
    @apply text-2xl;
}

.item-passed .status-icon {
    @apply text-green-500;
}

.item-failed .status-icon {
    @apply text-red-500;
}

.item-content {
    @apply flex-1 space-y-2;
}

.item-header {
    @apply flex justify-between items-start gap-2;
}

.item-title {
    @apply font-bold text-gray-900;
}

.item-badge {
    @apply px-2 py-1 rounded text-xs font-bold whitespace-nowrap;
}

.badge-passed {
    @apply bg-green-100 text-green-800;
}

.badge-failed {
    @apply bg-red-100 text-red-800;
}

.item-description {
    @apply text-sm text-gray-600;
}

.item-error {
    @apply mt-3 p-3 bg-white rounded border;
}

.item-passed .item-error {
    @apply border-green-200;
}

.item-failed .item-error {
    @apply border-red-200;
}

.error-content {
    @apply flex items-start gap-2 mb-2;
}

.error-icon {
    @apply text-red-500 mt-0.5 flex-shrink-0;
}

.error-text {
    @apply text-sm text-red-700 font-medium;
}

.error-recommendation {
    @apply text-sm text-gray-700;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .item-passed {
        @apply bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-800;
    }

    .item-failed {
        @apply bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-800;
    }

    .item-title {
        @apply text-gray-100;
    }

    .item-description {
        @apply text-gray-400;
    }

    .item-error {
        @apply bg-gray-800;
    }

    .error-text {
        @apply text-red-300;
    }

    .error-recommendation {
        @apply text-gray-300;
    }

    .badge-passed {
        @apply bg-green-900 text-green-300;
    }

    .badge-failed {
        @apply bg-red-900 text-red-300;
    }
}
</style>