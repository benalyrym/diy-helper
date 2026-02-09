<template>
    <div>
        <h3 class="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3">
            <span class="text-red-600">🛡️</span>
            <span>Rapport de sécurité</span>
        </h3>

        <div class="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200">
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="font-medium text-gray-900 mb-3">Classification de risque</h4>
                        <div :class="[
                            'px-4 py-3 rounded-lg font-bold text-center',
                            riskLevel === 'Élevé' ? 'bg-red-100 text-red-800' :
                            riskLevel === 'Modéré' ? 'bg-amber-100 text-amber-800' :
                            'bg-green-100 text-green-800'
                        ]">
                            {{ riskLevel }}
                        </div>
                        <p class="text-sm text-gray-600 mt-2">{{ riskDescription }}</p>
                    </div>

                    <div>
                        <h4 class="font-medium text-gray-900 mb-3">Mesures de précaution</h4>
                        <ul class="space-y-2">
                            <li v-for="(measure, idx) in safetyMeasures"
                                :key="idx"
                                class="text-sm text-gray-700 flex items-start gap-2">
                                <span class="text-green-500 mt-1">✓</span>
                                <span>{{ measure }}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Bouton de rapport complet -->
                <div class="pt-6 border-t border-red-200">
                    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h4 class="font-medium text-gray-900">Rapport de sécurité complet</h4>
                            <p class="text-sm text-gray-600">Générez un rapport PDF détaillé pour vos archives réglementaires</p>
                        </div>
                        <button @click="$emit('generate-safety-report')"
                                class="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center gap-2">
                            <span>📄</span>
                            <span>Générer rapport PDF</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    riskLevel: {
        type: String,
        default: 'Faible'
    },
    riskDescription: {
        type: String,
        default: ''
    },
    safetyMeasures: {
        type: Array,
        default: () => []
    }
})

defineEmits(['generate-safety-report'])
</script>

