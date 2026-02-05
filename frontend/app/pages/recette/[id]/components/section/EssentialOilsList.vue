<template>
    <div class="mb-10">
        <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-xl text-gray-900 flex items-center gap-3">
                <span class="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg text-white">🌿</span>
                <span>Huiles essentielles</span>
                <span class="badge-info">{{ essentialOils.length }} HE</span>
            </h3>
            <div class="text-right">
                <div class="text-2xl font-bold" :class="heTotal > 1 ? 'text-red-700' : 'text-green-700'">
                    {{ heTotal.toFixed(2) }}%
                </div>
                <div class="text-sm text-gray-500">{{ calculateGrams(heTotal) }} g total</div>
            </div>
        </div>

        <div v-if="essentialOils.length" class="space-y-4">
            <div v-for="(he, idx) in (showAllHE ? essentialOils : essentialOils.slice(0, 3))"
                 :key="idx"
                 :class="[
                     'ingredient-card transform transition-all duration-300 hover:-translate-y-1',
                     he.quantity > getHEMaxLimit(he.name) ? 'ingredient-danger' :
                     isHENotSafeForPregnancy(he.name) ? 'ingredient-warning' :
                     'ingredient-normal'
                 ]">
                <div class="flex flex-col md:flex-row md:items-center gap-4">
                    <!-- Informations -->
                    <div class="flex-1">
                        <div class="flex items-start justify-between mb-2">
                            <div>
                                <h4 class="font-bold text-gray-900 text-lg">{{ he.name.replace('HE ', '') }}</h4>
                                <p class="text-sm text-gray-500 font-mono">{{ getHELatinName(he.name) }}</p>
                            </div>
                            <div class="text-right">
                                <div class="text-2xl font-bold" :class="he.quantity > getHEMaxLimit(he.name) ? 'text-red-700' : 'text-green-700'">
                                    {{ he.quantity }}%
                                </div>
                                <div class="text-sm text-gray-500">{{ calculateGrams(he.quantity) }} g</div>
                            </div>
                        </div>

                        <!-- Propriétés et avertissements -->
                        <div class="space-y-2">
                            <div class="flex flex-wrap gap-1">
                                <span v-for="property in getHEProperties(he.name)"
                                      :key="property"
                                      class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                                    {{ property }}
                                </span>
                            </div>

                            <div class="flex flex-wrap gap-2">
                                <span v-if="isHENotSafeForPregnancy(he.name)"
                                      class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-100 text-red-800 border border-red-200">
                                    <span>👶</span>
                                    <span>Contre-indiqué grossesse</span>
                                </span>
                                <span v-if="isHEPhotosensitive(he.name)"
                                      class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-orange-100 text-orange-800 border border-orange-200">
                                    <span>☀️</span>
                                    <span>Photosensible</span>
                                </span>
                                <span v-if="isHEAllergen(he.name)"
                                      class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-amber-100 text-amber-800 border border-amber-200">
                                    <span>⚠️</span>
                                    <span>Allergène</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Graphique de sécurité -->
                    <div class="md:w-64">
                        <div class="space-y-3">
                            <div class="flex justify-between text-xs">
                                <span class="text-gray-500">Limite: {{ getHEMaxLimit(he.name) }}%</span>
                                <span :class="he.quantity > getHEMaxLimit(he.name) ? 'text-red-600 font-bold' : 'text-green-600 font-bold'">
                                    {{ he.quantity }}%
                                </span>
                            </div>
                            <div class="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div class="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
                                <div :class="[
                                    'absolute h-full rounded-full transition-all duration-1000',
                                    he.quantity > getHEMaxLimit(he.name)
                                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                                        : 'bg-gradient-to-r from-green-500 to-emerald-600'
                                ]"
                                     :style="{ width: Math.min((he.quantity / getHEMaxLimit(he.name)) * 100, 100) + '%' }">
                                </div>
                                <!-- Marqueur de limite -->
                                <div class="absolute h-full w-0.5 bg-gray-900 opacity-50"
                                     :style="{ left: '100%' }">
                                </div>
                            </div>

                            <!-- Avertissement dépassement -->
                            <div v-if="he.quantity > getHEMaxLimit(he.name)"
                                 class="p-2 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                                <p class="text-xs text-red-700 font-medium flex items-center gap-1">
                                    <span>⚠️</span>
                                    <span>Dépassement de {{ (he.quantity - getHEMaxLimit(he.name)).toFixed(2) }}%</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bouton Voir plus/moins -->
            <div v-if="essentialOils.length > 3" class="text-center pt-4">
                <button @click="$emit('toggle-he')"
                        class="px-6 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all duration-300 border border-green-200 font-medium">
                    {{ showAllHE ? 'Voir moins' : `Voir les ${essentialOils.length - 3} autres HE` }}
                </button>
            </div>

            <!-- Total HE -->
            <div class="mt-8 pt-8 border-t border-gray-200">
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h4 class="font-bold text-gray-900 text-lg mb-2">Total des huiles essentielles</h4>
                            <p class="text-sm text-gray-600">
                                Limite réglementaire UE 1223/2009:
                                <span class="font-bold">1% maximum</span> pour les produits visage
                            </p>
                        </div>

                        <div class="text-center md:text-right">
                            <div class="text-3xl font-bold" :class="heTotal > 1 ? 'text-red-700' : 'text-green-700'">
                                {{ heTotal.toFixed(2) }}%
                            </div>
                            <div class="text-sm text-gray-500">{{ calculateGrams(heTotal) }} g</div>
                            <div class="mt-2">
                                <span :class="[
                                    'px-3 py-1 rounded-full text-xs font-bold',
                                    heTotal > 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                ]">
                                    {{ heTotal > 1 ? '⚠️ Limite dépassée' : '✅ Dans la limite' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Jauge totale -->
                    <div class="mt-6">
                        <div class="flex justify-between text-sm mb-2">
                            <span class="text-gray-600">0%</span>
                            <span class="font-bold" :class="heTotal > 1 ? 'text-red-600' : 'text-green-600'">
                                {{ heTotal.toFixed(2) }}%
                            </span>
                            <span class="text-gray-600">1% (limite UE)</span>
                        </div>
                        <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div :class="[
                                'h-full rounded-full transition-all duration-1000',
                                heTotal > 1 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                                heTotal > 0.8 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                                'bg-gradient-to-r from-green-500 to-emerald-600'
                            ]"
                                 :style="{ width: Math.min(heTotal * 100, 100) + '%' }">
                            </div>
                        </div>
                        <div class="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Sécuritaire</span>
                            <span>Limite UE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="empty-state">
            <div class="text-center py-12">
                <span class="text-6xl mb-4 block opacity-50">🌿</span>
                <h3 class="text-xl font-medium text-gray-900 mb-2">Aucune huile essentielle</h3>
                <p class="text-gray-600 max-w-md mx-auto">
                    Cette formule ne contient pas d'huiles essentielles.
                    L'ajout d'HE est optionnel mais soumis à la limite réglementaire de 1%.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    essentialOils: {
        type: Array,
        default: () => []
    },
    formula: {
        type: Object,
        required: true
    },
    heTotal: {
        type: Number,
        default: 0
    }
})

defineEmits(['toggle-he'])

const showAllHE = ref(false)

// Données de référence pour les HE
const HEReferences = {
    'Encens (Boswellia carterii)': {
        max: 0.5,
        pregnancy: true,
        photo: false,
        allergen: false,
        latin: 'Boswellia carterii',
        properties: ['Anti-âge', 'Régénérant', 'Cicatrisant']
    },
    'Carotte sauvage': {
        max: 0.3,
        pregnancy: true,
        photo: true,
        allergen: false,
        latin: 'Daucus carota',
        properties: ['Détoxifiant', 'Régénérant', 'Tonique']
    },
    'Immortelle (Hélichryse)': {
        max: 0.4,
        pregnancy: true,
        photo: false,
        allergen: false,
        latin: 'Helichrysum italicum',
        properties: ['Anti-hématome', 'Régénérant', 'Anti-couperose']
    },
    'Orange douce': {
        max: 1.0,
        pregnancy: true,
        photo: true,
        allergen: true,
        latin: 'Citrus sinensis',
        properties: ['Antioxydant', 'Calmant', 'Digestif']
    },
    'Lavande vraie': {
        max: 1.0,
        pregnancy: true,
        photo: false,
        allergen: false,
        latin: 'Lavandula angustifolia',
        properties: ['Cicatrisant', 'Apaisant', 'Régénérant']
    },
    'Tea tree': {
        max: 1.0,
        pregnancy: false,
        photo: false,
        allergen: false,
        latin: 'Melaleuca alternifolia',
        properties: ['Antibactérien', 'Antifongique', 'Immunostimulant']
    },
    'Romarin à cinéole': {
        max: 0.4,
        pregnancy: false,
        photo: false,
        allergen: true,
        latin: 'Rosmarinus officinalis',
        properties: ['Stimulant', 'Antioxydant', 'Expectorant']
    }
}

// Fonctions utilitaires
const calculateGrams = (percent) => {
    const volume = props.formula?.volume || 50
    return ((volume * percent) / 100).toFixed(2)
}

const getHEMaxLimit = (name) => {
    const heName = name.replace('HE ', '')
    return HEReferences[heName]?.max || 1
}

const getHELatinName = (name) => {
    const heName = name.replace('HE ', '')
    return HEReferences[heName]?.latin || heName
}

const getHEProperties = (name) => {
    const heName = name.replace('HE ', '')
    return HEReferences[heName]?.properties || ['Propriétés non spécifiées']
}

const isHENotSafeForPregnancy = (name) => {
    const heName = name.replace('HE ', '')
    return !HEReferences[heName]?.pregnancy || false
}

const isHEPhotosensitive = (name) => {
    const heName = name.replace('HE ', '')
    return HEReferences[heName]?.photo || false
}

const isHEAllergen = (name) => {
    const heName = name.replace('HE ', '')
    return HEReferences[heName]?.allergen || false
}
</script>