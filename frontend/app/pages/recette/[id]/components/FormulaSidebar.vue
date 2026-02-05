<template>
    <aside class="lg:w-1/4">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-40">
            <!-- Aperçu rapide -->
            <div class="mb-8">
                <h2 class="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <span class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">📋</span>
                    <span>Aperçu rapide</span>
                </h2>

                <!-- Actifs principaux -->
                <div class="mb-6">
                    <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <span>✨</span>
                        <span>Ingrédients principaux</span>
                    </h3>
                    <div v-if="actives.length" class="space-y-3">
                        <div v-for="(active, idx) in actives.slice(0, 3)"
                             :key="idx"
                             class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200">
                            <div class="flex justify-between items-center">
                                <span class="font-medium text-gray-900 truncate text-sm">{{ active.name }}</span>
                                <span class="font-bold text-blue-700">{{ active.quantity }}%</span>
                            </div>
                            <div class="text-xs text-gray-500 mt-1">
                                {{ calculateGrams(active.quantity) }} g
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg border">
                        Aucun actif fonctionnel
                    </div>
                </div>

                <!-- Huiles essentielles -->
                <div class="mb-6">
                    <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <span>🌿</span>
                        <span>Huiles essentielles</span>
                    </h3>
                    <div v-if="essentialOils.length" class="space-y-3">
                        <div v-for="(he, idx) in essentialOils.slice(0, 3)"
                             :key="idx"
                             :class="[
                                 'rounded-lg p-3 border',
                                 isHENotSafeForPregnancy(he.name) ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' :
                                 isHEPhotosensitive(he.name) ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200' :
                                 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                             ]">
                            <div class="flex justify-between items-center">
                                <span class="font-medium text-gray-900 truncate text-sm">{{ he.name.replace('HE ', '') }}</span>
                                <span class="font-bold" :class="he.quantity > getHEMaxLimit(he.name) ? 'text-red-700' : 'text-green-700'">
                                    {{ he.quantity }}%
                                </span>
                            </div>
                            <div class="text-xs text-gray-500 mt-1 flex justify-between">
                                <span>{{ calculateGrams(he.quantity) }} g</span>
                                <span v-if="he.quantity > getHEMaxLimit(he.name)" class="text-red-600 font-medium">
                                    ⚠️ Limite dépassée
                                </span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg border">
                        Aucune huile essentielle
                    </div>
                </div>
            </div>

            <!-- Informations techniques -->
            <div class="mb-8">
                <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <span>📊</span>
                    <span>Informations techniques</span>
                </h3>
                <div class="space-y-3 text-sm">
                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-gray-600">Densité estimée</span>
                        <span class="font-medium text-gray-900">1.0 g/ml</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-gray-600">pH optimal</span>
                        <span class="font-medium text-gray-900">5.5 - 6.5</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <span class="text-gray-600">Durée de conservation</span>
                        <span class="font-medium text-gray-900">6 mois</span>
                    </div>
                    <div class="flex justify-between items-center py-2">
                        <span class="text-gray-600">Catégorie</span>
                        <span class="font-medium text-gray-900 capitalize">{{ formula.type || 'skincare' }}</span>
                    </div>
                </div>
            </div>

            <!-- Analyse de risque -->
            <div class="mb-8">
                <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <span>🛡️</span>
                    <span>Analyse de risque</span>
                </h3>
                <div :class="[
                    'rounded-xl p-4 border-2',
                    riskLevel === 'Élevé' ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' :
                    riskLevel === 'Modéré' ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' :
                    'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                ]">
                    <div class="flex items-center justify-between mb-2">
                        <span class="font-medium text-gray-900">Niveau de risque</span>
                        <span :class="[
                            'px-2 py-1 rounded-full text-xs font-bold',
                            riskLevel === 'Élevé' ? 'bg-red-100 text-red-800' :
                            riskLevel === 'Modéré' ? 'bg-amber-100 text-amber-800' :
                            'bg-green-100 text-green-800'
                        ]">
                            {{ riskLevel }}
                        </span>
                    </div>
                    <p class="text-xs text-gray-600">{{ riskDescription }}</p>
                </div>
            </div>

            <!-- Métadonnées -->
            <div class="pt-6 border-t border-gray-200">
                <h3 class="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <span>📅</span>
                    <span>Métadonnées</span>
                </h3>
                <div class="space-y-3 text-sm">
                    <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-gray-600">Créée le</span>
                            <span class="font-medium text-gray-900">{{ formatDateShort(formula.createdAt) }}</span>
                        </div>
                        <div class="text-xs text-gray-500">{{ formatTime(formula.createdAt) }}</div>
                    </div>
                    <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-gray-600">Dernière modification</span>
                            <span class="font-medium text-gray-900">{{ formatDateShort(formula.updatedAt) }}</span>
                        </div>
                        <div class="text-xs text-gray-500">{{ formatTime(formula.updatedAt) }}</div>
                    </div>
                    <div v-if="formula.compliance?.euRegulation" class="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-3 border border-emerald-200">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Conformité</span>
                            <span class="font-medium text-emerald-700">UE {{ formula.compliance.euRegulation }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions rapides -->
            <div class="mt-8 pt-6 border-t border-gray-200 space-y-3">
                <button
                    @click="$emit('copy-formula')"
                    class="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 flex items-center justify-center gap-3 border border-blue-200 shadow-sm hover:shadow-md"
                    aria-label="Copier les données de la formule"
                >
                    <span class="text-xl">📋</span>
                    <span>Copier les données</span>
                </button>
                <button
                    @click="$emit('export-formula')"
                    class="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 flex items-center justify-center gap-3 border border-gray-200 shadow-sm hover:shadow-md"
                    aria-label="Exporter la formule en JSON"
                >
                    <span class="text-xl">📤</span>
                    <span>Exporter JSON</span>
                </button>
                <button
                    @click="$emit('share-formula')"
                    class="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 flex items-center justify-center gap-3 border border-purple-200 shadow-sm hover:shadow-md"
                    aria-label="Partager cette formule"
                >
                    <span class="text-xl">🔗</span>
                    <span>Partager</span>
                </button>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    formula: {
        type: Object,
        required: true
    },
    actives: {
        type: Array,
        default: () => []
    },
    essentialOils: {
        type: Array,
        default: () => []
    },
    heTotal: {
        type: Number,
        default: 0
    },
    isFormulaValid: {
        type: Boolean,
        default: false
    },
    warnings: {
        type: Array,
        default: () => []
    },
    riskLevel: {
        type: String,
        default: 'Faible'
    },
    riskDescription: {
        type: String,
        default: ''
    },
    validationChecks: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['copy-formula', 'export-formula', 'share-formula'])

// Données de référence pour les HE
const HEReferences = {
    'Encens (Boswellia carterii)': {
        max: 0.5,
        pregnancy: true,
        photo: false,
        allergen: false
    },
    'Carotte sauvage': {
        max: 0.3,
        pregnancy: true,
        photo: true,
        allergen: false
    },
    'Immortelle (Hélichryse)': {
        max: 0.4,
        pregnancy: true,
        photo: false,
        allergen: false
    },
    'Orange douce': {
        max: 1.0,
        pregnancy: true,
        photo: true,
        allergen: true
    },
    'Lavande vraie': {
        max: 1.0,
        pregnancy: true,
        photo: false,
        allergen: false
    },
    'Tea tree': {
        max: 1.0,
        pregnancy: false,
        photo: false,
        allergen: false
    },
    'Romarin à cinéole': {
        max: 0.4,
        pregnancy: false,
        photo: false,
        allergen: true
    }
}

// Fonctions utilitaires
const calculateGrams = (percent) => {
    const volume = props.formula?.volume || 50
    return ((volume * percent) / 100).toFixed(2)
}

const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR')
}

const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const getHEMaxLimit = (name) => {
    const heName = name.replace('HE ', '')
    return HEReferences[heName]?.max || 1
}

const isHENotSafeForPregnancy = (name) => {
    const heName = name.replace('HE ', '')
    return !HEReferences[heName]?.pregnancy || false
}

const isHEPhotosensitive = (name) => {
    const heName = name.replace('HE ', '')
    return HEReferences[heName]?.photo || false
}
</script>

<style scoped>
/* Styles spécifiques pour la sidebar */
@media (max-width: 1024px) {
    .sticky {
        position: static;
    }
}
</style>