<template>
    <Transition name="slide-up">
        <div
            v-if="isVisible"
            class="mobile-action-bar-compact"
            :class="{ 'bar-error': !isValid }"
        >
            <div class="compact-content">
                <!-- Status -->
                <div class="compact-status">
          <span class="status-icon" :aria-label="statusText">
            {{ statusIcon }}
          </span>
                    <span class="status-text">
            {{ statusText }}
          </span>
                    <span class="status-progress">
            {{ completionPercentage }}%
          </span>
                </div>

                <!-- Actions -->
                <div class="compact-actions">
                    <button
                        @click="handleSaveDraft"
                        :disabled="saving"
                        class="compact-button button-secondary"
                        type="button"
                    >
                        <span class="button-icon">💾</span>
                    </button>

                    <button
                        @click="handleSave"
                        :disabled="!isValid || saving"
                        class="compact-button button-primary"
                        type="button"
                        :class="{ 'button-disabled': !isValid || saving }"
                    >
            <span class="button-text">
              {{ saving ? '...' : (isValid ? 'SAVE' : 'INVALID') }}
            </span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
// Mêmes props que la version complète
const props = defineProps({
    isValid: Boolean,
    saving: Boolean,
    completionPercentage: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['save', 'save-draft'])

const isVisible = ref(true)

const statusIcon = computed(() => {
    if (props.saving) return '⏳'
    return props.isValid ? '✅' : '⚠️'
})

const statusText = computed(() => {
    if (props.saving) return 'Saving...'
    return props.isValid ? 'Ready' : 'Check errors'
})

const handleSave = () => {
    if (!props.isValid || props.saving) return
    emit('save')
}

const handleSaveDraft = () => {
    if (props.saving) return
    emit('save-draft')
}

// Cacher sur desktop
onMounted(() => {
    if (window.innerWidth >= 1024) {
        isVisible.value = false
    }
})
</script>

<style scoped>
.mobile-action-bar-compact {
    @apply fixed bottom-4 left-4 right-4 z-50
    bg-white/95 backdrop-blur-lg border border-gray-300
    rounded-xl shadow-2xl;
}

.bar-error {
    @apply border-red-400;
}

.compact-content {
    @apply flex items-center justify-between px-4 py-3;
}

.compact-status {
    @apply flex items-center gap-3 flex-1;
}

.status-icon {
    @apply text-xl;
}

.status-text {
    @apply text-sm font-medium text-gray-700 truncate;
}

.status-progress {
    @apply px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold;
}

.compact-actions {
    @apply flex items-center gap-2;
}

.compact-button {
    @apply px-4 py-2 rounded-lg font-medium transition-colors
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed;
}

.button-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
}

.button-secondary {
    @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

.button-disabled {
    @apply bg-red-100 text-red-700;
}

.button-icon {
    @apply text-lg;
}

.button-text {
    @apply font-bold text-sm;
}

/* Animation */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

@media (min-width: 1024px) {
    .mobile-action-bar-compact {
        display: none;
    }
}
</style>