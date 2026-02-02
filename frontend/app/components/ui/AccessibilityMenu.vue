<template>
    <div class="accessibility-menu" role="dialog" aria-label="Options d'accessibilité">
        <div class="menu-header">
            <h2>♿ Options d'accessibilité</h2>
            <button @click="$emit('close')" aria-label="Fermer">
                ×
            </button>
        </div>

        <div class="menu-grid">
            <AccessibilityButton
                @click="$emit('increaseTextSize')"
                icon="🔍"
                label="Agrandir le texte"
                sublabel="A+"
            />

            <AccessibilityButton
                @click="$emit('decreaseTextSize')"
                icon="🔎"
                label="Réduire le texte"
                sublabel="A-"
            />

            <AccessibilityButton
                @click="$emit('toggleHighContrast')"
                icon="⚫"
                :label="`Contraste élevé ${highContrast ? 'ON' : 'OFF'}`"
                sublabel="Contraste"
                :active="highContrast"
            />

            <AccessibilityButton
                @click="$emit('toggleReducedMotion')"
                icon="🎬"
                :label="`Animations réduites ${reducedMotion ? 'ON' : 'OFF'}`"
                sublabel="Animations"
                :active="reducedMotion"
            />
        </div>
    </div>
</template>

<script setup>
import AccessibilityButton from './AccessibilityButton.vue'

defineProps({
    highContrast: Boolean,
    reducedMotion: Boolean
})

defineEmits(['close', 'increaseTextSize', 'decreaseTextSize', 'toggleHighContrast', 'toggleReducedMotion'])
</script>

<style scoped>
.accessibility-menu {
    @apply bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-blue-200
    animate-slideDown mb-6;
}

.menu-header {
    @apply flex justify-between items-center mb-6;
}

.menu-header h2 {
    @apply text-xl font-bold text-gray-900 flex items-center gap-2;
}

.menu-header button {
    @apply text-gray-500 hover:text-gray-700 text-2xl w-8 h-8
    flex items-center justify-center rounded-full
    hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.menu-grid {
    @apply grid grid-cols-2 md:grid-cols-4 gap-4;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slideDown {
    animation: slideDown 0.3s ease-out;
}
</style>