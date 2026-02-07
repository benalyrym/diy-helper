<template>
    <aside class="lg:w-1/4" aria-label="Résumé de la formule">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-8">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <span class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">📋</span>
                    <span>Résumé</span>
                </h2>
                <button @click="$emit('toggle-summary')"
                        class="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
                        :aria-label="summaryExpanded ? 'Réduire le résumé' : 'Développer le résumé'"
                        :aria-expanded="summaryExpanded">
                    <span class="text-xl">{{ summaryExpanded ? '−' : '+' }}</span>
                </button>
            </div>

            <div :class="['space-y-6', summaryExpanded || !isMobile ? 'block' : 'hidden lg:block']">
                <!-- Informations principales -->
                <div class="space-y-4">
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-gray-500">Nom de la formule</span>
                            <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">Obligatoire</span>
                        </div>
                        <div class="p-3 bg-gray-50 rounded-lg border">
                            <p :class="['font-medium truncate', !formData.name ? 'text-red-500 italic' : 'text-gray-900']">
                                {{ formData.name || 'À renseigner' }}
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm font-medium text-gray-500 block mb-1">Volume</span>
                            <div class="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                <p class="text-lg font-bold text-blue-700">{{ formData.volume }} ml</p>
                            </div>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-500 block mb-1">Type de peau</span>
                            <div class="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                                <p class="text-lg font-bold text-purple-700 capitalize">{{ formData.skinType ||  formData.hairType || '—' }} </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statut réglementaire -->
                <div v-if="regulatoryErrors.length > 0" class="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-xl text-red-600">⚠️</span>
                        <h3 class="font-bold text-red-800">Alertes réglementaires</h3>
                    </div>
                    <ul class="space-y-2" role="list">
                        <li v-for="error in regulatoryErrors.slice(0, 3)"
                            :key="error"
                            class="flex items-start gap-2">
                            <span class="text-red-500 mt-1 text-sm">•</span>
                            <span class="text-sm text-red-700">{{ error }}</span>
                        </li>
                        <li v-if="regulatoryErrors.length > 3" class="text-sm text-red-600 italic">
                            + {{ regulatoryErrors.length - 3 }} autres alertes
                        </li>
                    </ul>
                </div>

                <!-- Composition rapide -->
                <div class="space-y-3">
                    <h3 class="font-bold text-gray-900 flex items-center gap-2">
                        <span class="text-green-600">⚖️</span>
                        Composition
                    </h3>
                    <div class="space-y-2">
                        <div v-for="phase in phasesSummary" :key="phase.name" class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">{{ phase.name }}</span>
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-semibold">{{ phase.percent }}%</span>
                                <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div class="h-full rounded-full transition-all duration-500"
                                         :class="phase.colorClass"
                                         :style="{ width: `${phase.percent}%` }">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions rapides -->
                <div class="pt-6 border-t border-gray-200 space-y-3">
                    <button @click="$emit('generate-report')"
                            :disabled="!isValid"
                            :class="[
                    'w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3',
                    isValid
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  ]"
                            :aria-disabled="!isValid">
                        <span class="text-xl">📄</span>
                        <span>Générer PDF</span>
                    </button>

                    <button @click="$emit('export-formula')"
                            class="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md">
                        <span class="text-xl">📤</span>
                        <span>Exporter</span>
                    </button>
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup>
defineProps({
    formData: {
        type: Object,
        required: true
    },
    regulatoryErrors: {
        type: Array,
        default: () => []
    },
    phasesSummary: {
        type: Array,
        required: true
    },
    isValid: {
        type: Boolean,
        required: true
    },
    summaryExpanded: {
        type: Boolean,
        required: true
    },
    isMobile: {
        type: Boolean,
        required: true
    }
})

defineEmits(['toggle-summary', 'generate-report', 'export-formula'])
</script>