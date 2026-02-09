<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8">
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-red-200">
            <div class="flex items-start gap-4 mb-6">
                <div class="flex-shrink-0">
                    <div class="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
                        <span class="text-2xl text-white">❌</span>
                    </div>
                </div>
                <div class="flex-1">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Formule introuvable</h2>
                    <p class="text-gray-600 mb-4">{{ error }}</p>
                    <div class="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                        <p>Vérifiez que l'identifiant de la formule est correct ou que vous avez les permissions nécessaires.</p>
                    </div>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
                <NuxtLink
                    to="/recettes"
                    class="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                    <span>←</span>
                    <span>Retour aux formules</span>
                </NuxtLink>
                <button
                    @click="$emit('retry')"
                    class="flex-1 py-3 px-6 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 font-semibold rounded-lg hover:from-gray-200 hover:to-gray-100 transition-all duration-300 flex items-center justify-center gap-2 border border-gray-300"
                >
                    <span>↻</span>
                    <span>Réessayer</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    error: {
        type: String,
        default: 'Une erreur est survenue'
    }
})

defineEmits(['retry'])
</script>

