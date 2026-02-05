<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-xl text-gray-900 flex items-center gap-3">
                <span class="p-2 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg text-white">📋</span>
                <span>Tableau récapitulatif</span>
            </h3>
            <div class="text-sm text-gray-500">
                {{ formula.ingredients.length }} ingrédients
            </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-700">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th class="px-6 py-4 font-bold">Ingrédient</th>
                        <th class="px-6 py-4 font-bold">Type</th>
                        <th class="px-6 py-4 font-bold text-right">Pourcentage</th>
                        <th class="px-6 py-4 font-bold text-right">Grammes</th>
                        <th class="px-6 py-4 font-bold">Statut</th>
                    </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                    <tr v-for="(ingredient, idx) in formula.ingredients"
                        :key="idx"
                        class="bg-white hover:bg-gray-50 transition-colors duration-150">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                                     :class="getIngredientTypeColor(ingredient)">
                                    <span class="text-xs">{{ getIngredientIcon(ingredient) }}</span>
                                </div>
                                <div>
                                    <div class="font-medium text-gray-900">{{ ingredient.name }}</div>
                                    <div v-if="ingredient.latinName" class="text-xs text-gray-500 font-mono">
                                        {{ ingredient.latinName }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                                <span :class="getIngredientTypeClass(ingredient)">
                                    {{ getIngredientType(ingredient) }}
                                </span>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <div class="font-bold text-gray-900">{{ ingredient.quantity }}%</div>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <div class="text-gray-600">{{ calculateGrams(ingredient.quantity) }} g</div>
                        </td>
                        <td class="px-6 py-4">
                                <span :class="getIngredientStatusClass(ingredient)">
                                    {{ getIngredientStatus(ingredient) }}
                                </span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <!-- Total du tableau -->
            <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div class="flex justify-between items-center">
                    <div class="text-sm text-gray-600">
                        {{ formula.ingredients.length }} ingrédients • Total: 100%
                    </div>
                    <div class="text-right">
                        <div class="text-lg font-bold text-gray-900">{{ calculateTotalGrams() }} g</div>
                        <div class="text-sm text-gray-500">Volume: {{ formula.volume }} ml</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
    }
})

// Données de référence pour les actifs
const activeReferences = {
    'Acide hyaluronique': { min: 0.1, max: 2 },
    'Vitamine E': { min: 0.1, max: 1 },
    'Acide salicylique': { min: 0.5, max: 2 },
    'Panthénol (B5)': { min: 0.5, max: 5 },
    'Niacinamide': { min: 2, max: 10 },
    'Vitamine C': { min: 5, max: 20 }
}

// Fonctions utilitaires
const calculateGrams = (percent) => {
    const volume = props.formula?.volume || 50
    return ((volume * percent) / 100).toFixed(2)
}

const calculateTotalGrams = () => {
    const volume = props.formula?.volume || 50
    return volume.toFixed(2)
}

const getIngredientType = (ingredient) => {
    if (ingredient.type) {
        switch(ingredient.type) {
            case 'active': return 'Actif cosmétique'
            case 'essential_oil': return 'Huile essentielle'
            case 'preservative': return 'Conservateur'
            case 'oil': return 'Huile végétale'
            case 'aqueous': return 'Phase aqueuse'
            case 'water': return 'Eau'
            case 'emulsifier': return 'Émulsifiant'
            default: return 'Ingrédient'
        }
    }

    if (ingredient.name.startsWith('HE ')) return 'Huile essentielle'
    if (ingredient.name.includes('Acide') || ingredient.name.includes('Vitamine')) return 'Actif cosmétique'
    if (ingredient.name.includes('Eau')) return 'Eau'
    return 'Ingrédient'
}

const getIngredientIcon = (ingredient) => {
    const type = getIngredientType(ingredient)
    switch(type) {
        case 'Huile essentielle': return '🌿'
        case 'Actif cosmétique': return '✨'
        case 'Conservateur': return '🛡️'
        case 'Huile végétale': return '🫒'
        case 'Phase aqueuse': return '💧'
        case 'Eau': return '💦'
        case 'Émulsifiant': return '⚗️'
        default: return '🧪'
    }
}

const getIngredientTypeColor = (ingredient) => {
    const type = getIngredientType(ingredient)
    switch(type) {
        case 'Huile essentielle': return 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-700'
        case 'Actif cosmétique': return 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700'
        case 'Conservateur': return 'bg-gradient-to-br from-red-100 to-orange-100 text-red-700'
        case 'Huile végétale': return 'bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-700'
        case 'Phase aqueuse': return 'bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-700'
        case 'Eau': return 'bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600'
        case 'Émulsifiant': return 'bg-gradient-to-br from-purple-100 to-violet-100 text-purple-700'
        default: return 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
    }
}

const getIngredientTypeClass = (ingredient) => {
    const type = getIngredientType(ingredient)
    switch(type) {
        case 'Huile essentielle': return 'px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-bold rounded-full'
        case 'Actif cosmétique': return 'px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-xs font-bold rounded-full'
        case 'Conservateur': return 'px-3 py-1.5 bg-gradient-to-r from-red-100 to-orange-100 text-red-800 text-xs font-bold rounded-full'
        case 'Huile végétale': return 'px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs font-bold rounded-full'
        default: return 'px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-xs font-bold rounded-full'
    }
}

const getIngredientStatus = (ingredient) => {
    if (ingredient.name.startsWith('HE ')) {
        const heName = ingredient.name.replace('HE ', '')
        const HEReferences = {
            'Encens (Boswellia carterii)': { max: 0.5 },
            'Carotte sauvage': { max: 0.3 },
            'Immortelle (Hélichryse)': { max: 0.4 },
            'Orange douce': { max: 1.0 },
            'Lavande vraie': { max: 1.0 },
            'Tea tree': { max: 1.0 },
            'Romarin à cinéole': { max: 0.4 }
        }
        const max = HEReferences[heName]?.max || 1
        return ingredient.quantity <= max ? 'Sécuritaire' : 'Surdosage'
    }

    const ref = activeReferences[ingredient.name]
    if (ref) {
        if (ingredient.quantity < ref.min) return 'Sous-dosage'
        if (ingredient.quantity > ref.max) return 'Surdosage'
        return 'Optimal'
    }

    return 'Standard'
}

const getIngredientStatusClass = (ingredient) => {
    const status = getIngredientStatus(ingredient)
    switch(status) {
        case 'Optimal':
        case 'Sécuritaire':
        case 'Standard':
            return 'px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-bold rounded-full'
        case 'Surdosage':
            return 'px-3 py-1.5 bg-gradient-to-r from-red-100 to-orange-100 text-red-800 text-xs font-bold rounded-full'
        case 'Sous-dosage':
            return 'px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs font-bold rounded-full'
        default:
            return 'px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-xs font-bold rounded-full'
    }
}
</script>