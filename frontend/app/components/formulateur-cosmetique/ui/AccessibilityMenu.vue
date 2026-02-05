<template>
    <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-blue-200 animate-slideDown">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span class="text-blue-600">♿</span>
                Options d'accessibilité
            </h2>
            <button @click="$emit('close')"
                    class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                    aria-label="Fermer les options d'accessibilité">
                <span class="text-2xl">×</span>
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button @click="$emit('increase-text-size')"
                    class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Augmenter la taille du texte">
                <span class="text-2xl mb-2">🔍</span>
                <span class="font-medium">Agrandir le texte</span>
                <span class="text-sm text-gray-500">A+</span>
            </button>

            <button @click="$emit('decrease-text-size')"
                    class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Réduire la taille du texte">
                <span class="text-2xl mb-2">🔎</span>
                <span class="font-medium">Réduire le texte</span>
                <span class="text-sm text-gray-500">A-</span>
            </button>

            <button @click="$emit('toggle-high-contrast')"
                    class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Activer le contraste élevé">
                <span class="text-2xl mb-2">⚫</span>
                <span class="font-medium">Contraste élevé</span>
                <span class="text-sm text-gray-500">{{ highContrast ? 'ON' : 'OFF' }}</span>
            </button>

            <button @click="$emit('toggle-reduced-motion')"
                    class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Réduire les animations">
                <span class="text-2xl mb-2">🎬</span>
                <span class="font-medium">Animations réduites</span>
                <span class="text-sm text-gray-500">{{ reducedMotion ? 'ON' : 'OFF' }}</span>
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    highContrast: {
        type: Boolean,
        required: true
    },
    reducedMotion: {
        type: Boolean,
        required: true
    }
})

defineEmits([
    'close',
    'increase-text-size',
    'decrease-text-size',
    'toggle-high-contrast',
    'toggle-reduced-motion'
])
</script>