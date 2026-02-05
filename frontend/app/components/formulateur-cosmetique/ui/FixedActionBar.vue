<template>
    <div class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-50 transform transition-transform duration-300"
         :class="showFixedBar ? 'translate-y-0' : 'translate-y-full'">
        <div class=" mx-auto px-4 py-3">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
                <!-- Statut -->
                <div class="flex-1">
                    <div v-if="!isValid" class="flex items-center gap-2">
                        <span class="text-red-500 text-xl">❌</span>
                        <div>
                            <p class="text-sm font-medium text-red-600">
                                Formule non conforme
                            </p>
                            <p class="text-xs text-red-500">
                                {{ regulatoryErrors.length }} erreur(s) à corriger
                            </p>
                        </div>
                    </div>
                    <div v-else class="flex items-center gap-2">
                        <span class="text-green-500 text-xl">✅</span>
                        <div>
                            <p class="text-sm font-medium text-green-600">
                                Formule prête à être enregistrée
                            </p>
                            <p class="text-xs text-green-500">
                                {{ completionPercentage }}% complétée
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Boutons d'action -->
                <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button @click="$emit('save-draft')"
                            :disabled="saving"
                            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                        <span v-if="saving" class="animate-spin">⏳</span>
                        <span v-else>💾</span>
                        <span>Brouillon</span>
                    </button>

                    <button @click="$emit('save')"
                            :disabled="!isValid || saving"
                            :class="[
                    'px-6 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2',
                    isValid
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  ]"
                            :aria-disabled="!isValid || saving">
                        <template v-if="saving">
                            <span class="animate-spin">⏳</span>
                            <span>Enregistrement...</span>
                        </template>
                        <template v-else>
                            <span>✅</span>
                            <span>{{ isEditMode ? 'Mettre à jour' : 'Enregistrer' }}</span>
                        </template>
                    </button>

                    <button @click="$emit('toggle-fixed-bar')"
                            class="sm:hidden px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <span class="text-xl">{{ showFixedBar ? '▼' : '▲' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    showFixedBar: {
        type: Boolean,
        required: true
    },
    isValid: {
        type: Boolean,
        required: true
    },
    saving: {
        type: Boolean,
        required: true
    },
    isEditMode: {
        type: Boolean,
        required: true
    },
    regulatoryErrors: {
        type: Array,
        default: () => []
    },
    completionPercentage: {
        type: Number,
        required: true
    }
})

defineEmits(['save', 'save-draft', 'toggle-fixed-bar'])
</script>