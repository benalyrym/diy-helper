<template>
    <header class="formulation-header">
        <div class="header-content">
            <div class="title-section">
                <div class="title-icon" aria-hidden="true">
                    🧴
                </div>
                <div class="title-text">
                    <h1>Formulateur Cosmétique Pro</h1>
                    <p>Outils conforme au Règlement UE 1223/2009</p>
                </div>
            </div>

            <div class="status-section">
                <div class="conformity-badge" :class="conformityClass" role="status" :aria-label="conformityText">
                    <span>{{ conformity.isValid ? '✅' : '⚠️' }}</span>
                    <span>{{ conformity.isValid ? 'Conforme UE' : 'Non conforme' }}</span>
                </div>

                <button
                    @click="$emit('toggle-accessibility')"
                    class="accessibility-toggle"
                    aria-label="Options d'accessibilité"
                >
                    ♿
                </button>
            </div>
        </div>

        <ProgressBar :percentage="progress" />
    </header>
</template>

<script setup>
import ProgressBar from './ProgressBar.vue'

defineProps({
    title: String,
    conformity: {
        type: Object,
        default: () => ({ isValid: false })
    },
    progress: {
        type: Number,
        default: 0
    }
})

defineEmits(['toggle-accessibility'])

const conformityClass = computed(() => ({
    'conformity-valid': props.conformity.isValid,
    'conformity-invalid': !props.conformity.isValid
}))

const conformityText = computed(() =>
    props.conformity.isValid
        ? 'Formule conforme aux réglementations européennes'
        : 'Formule non conforme, vérification nécessaire'
)
</script>

<style scoped>
.formulation-header {
    @apply bg-white rounded-xl shadow-sm p-6 border border-gray-200;
}

.header-content {
    @apply flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6;
}

.title-section {
    @apply flex items-start gap-4;
}

.title-icon {
    @apply p-3 bg-blue-100 rounded-xl text-blue-600 text-2xl;
}

.title-text h1 {
    @apply text-2xl md:text-3xl font-bold text-gray-900;
}

.title-text p {
    @apply text-gray-600 mt-1;
}

.status-section {
    @apply flex items-center gap-3;
}

.conformity-badge {
    @apply px-4 py-2 rounded-lg font-semibold flex items-center gap-2
    transition-colors duration-300;
}

.conformity-valid {
    @apply bg-green-100 text-green-800 border border-green-200;
}

.conformity-invalid {
    @apply bg-red-100 text-red-800 border border-red-200;
}

.accessibility-toggle {
    @apply p-2 rounded-lg text-gray-600 hover:bg-gray-100
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-colors;
}
</style>