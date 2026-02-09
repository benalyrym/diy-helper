<template>
    <div class="mb-10">
        <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-xl text-gray-900 flex items-center gap-3">
                <span class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">✨</span>
                <span>Actifs cosmétiques</span>
                <span class="badge-info">{{ actives.length }} actif{{ actives.length > 1 ? 's' : '' }}</span>
            </h3>
            <div class="text-sm text-gray-500">
                Total: {{ getActiveTotalPercentage().toFixed(1) }}%
            </div>
        </div>

        <div v-if="actives.length" class="space-y-4">
            <div v-for="(active, idx) in (showAllActives ? actives : actives.slice(0, 3))"
                 :key="idx"
                 :class="[
                     'ingredient-card transform transition-all duration-300 hover:-translate-y-1',
                     getActiveStatus(active.quantity, active.name) === 'Surdosage' ? 'ingredient-warning' :
                     getActiveStatus(active.quantity, active.name) === 'Sous-dosage' ? 'ingredient-low' :
                     'ingredient-normal'
                 ]">
                <div class="flex flex-col md:flex-row md:items-center gap-4">
                    <!-- Informations -->
                    <div class="flex-1">
                        <div class="flex items-start justify-between mb-2">
                            <h4 class="font-bold text-gray-900 text-lg">{{ active.name }}</h4>
                            <div class="text-right">
                                <div class="text-2xl font-bold text-gray-900">{{ active.quantity }}%</div>
                                <div class="text-sm text-gray-500">{{ calculateGrams(active.quantity) }} g</div>
                            </div>
                        </div>

                        <p class="text-sm text-gray-600 mb-3">
                            {{ getActiveDescription(active.name) }}
                        </p>

                        <!-- Status -->
                        <div class="flex items-center gap-3">
                            <span :class="getActiveStatusClass(active.quantity, active.name)">
                                {{ getActiveStatus(active.quantity, active.name) }}
                            </span>
                            <div class="text-xs text-gray-500">
                                Recommandé: {{ getActiveRecommendation(active.name) }}
                            </div>
                        </div>
                    </div>

                    <!-- Graphique de dosage -->
                    <div class="md:w-48">
                        <div class="space-y-2">
                            <div class="flex justify-between text-xs">
                                <span class="text-gray-500">Min: {{ getActiveMin(active.name) }}%</span>
                                <span class="font-medium text-blue-600">{{ active.quantity }}%</span>
                                <span class="text-gray-500">Max: {{ getActiveMax(active.name) }}%</span>
                            </div>
                            <div class="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div class="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
                                <div class="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                     :style="{ width: getActiveProgress(active.quantity, active.name) }">
                                </div>
                                <div class="absolute h-full w-0.5 bg-gray-900 opacity-50"
                                     :style="{ left: getActiveProgress(active.quantity, active.name) }">
                                </div>
                            </div>
                            <div class="flex justify-between text-xs text-gray-500">
                                <span>Sous-dosage</span>
                                <span>Optimal</span>
                                <span>Surdosage</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bouton Voir plus/moins -->
            <div v-if="actives.length > 3" class="text-center pt-4">
                <button @click="$emit('toggle-actives')"
                        class="px-6 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 border border-blue-200 font-medium">
                    {{ showAllActives ? 'Voir moins' : `Voir les ${actives.length - 3} autres actifs` }}
                </button>
            </div>
        </div>
        <div v-else class="empty-state">
            <div class="text-center py-12">
                <span class="text-6xl mb-4 block opacity-50">✨</span>
                <h3 class="text-xl font-medium text-gray-900 mb-2">Aucun actif cosmétique</h3>
                <p class="text-gray-600 max-w-md mx-auto">
                    Cette formule ne contient pas d'actifs fonctionnels spécifiques.
                    Vous pouvez en ajouter lors de l'édition.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    actives: {
        type: Array,
        default: () => []
    },
    formula: {
        type: Object,
        required: true
    }
})

defineEmits(['toggle-actives'])

const showAllActives = ref(false)

// Données de référence pour les actifs
const activeReferences = {
    'Acide hyaluronique': {
        min: 0.1,
        max: 2,
        recommendation: '0.1-2%',
        description: 'Humectant puissant, retient jusqu\'à 1000x son poids en eau'
    },
    'Vitamine E': {
        min: 0.1,
        max: 1,
        recommendation: '0.1-1%',
        description: 'Antioxydant liposoluble, protège des radicaux libres'
    },
    'Acide salicylique': {
        min: 0.5,
        max: 2,
        recommendation: '0.5-2%',
        description: 'BHA liposoluble, pénètre dans les pores pour un nettoyage en profondeur'
    },
    'Panthénol (B5)': {
        min: 0.5,
        max: 5,
        recommendation: '0.5-5%',
        description: 'Provitamine B5, favorise la régénération et la réparation cutanée'
    },
    'Niacinamide': {
        min: 2,
        max: 10,
        recommendation: '2-10%',
        description: 'Améliore la barrière cutanée, réduit les rougeurs et les pores'
    },
    'Vitamine C': {
        min: 5,
        max: 20,
        recommendation: '5-20%',
        description: 'Antioxydant puissant, stimule la synthèse de collagène'
    }
}

// Fonctions utilitaires
const calculateGrams = (percent) => {
    const volume = props.formula?.volume || 50
    return ((volume * percent) / 100).toFixed(2)
}

const getActiveTotalPercentage = () => {
    return props.actives.reduce((total, active) => total + active.quantity, 0)
}

const getActiveRecommendation = (name) => {
    return activeReferences[name]?.recommendation || '1-5%'
}

const getActiveMin = (name) => {
    return activeReferences[name]?.min || 0.5
}

const getActiveMax = (name) => {
    return activeReferences[name]?.max || 5
}

const getActiveDescription = (name) => {
    return activeReferences[name]?.description || 'Actif cosmétique fonctionnel'
}

const getActiveProgress = (quantity, name) => {
    const ref = activeReferences[name]
    if (!ref) return '50%'
    const percentage = ((quantity - ref.min) / (ref.max - ref.min)) * 100
    return Math.min(Math.max(percentage, 0), 100) + '%'
}

const getActiveStatus = (quantity, name) => {
    const ref = activeReferences[name]
    if (!ref) return 'Standard'

    if (quantity < ref.min) return 'Sous-dosage'
    if (quantity > ref.max) return 'Surdosage'
    if (Math.abs(quantity - ((ref.min + ref.max) / 2)) < (ref.max - ref.min) * 0.2) return 'Optimal'
    return 'Standard'
}

const getActiveStatusClass = (quantity, name) => {
    const status = getActiveStatus(quantity, name)
    switch(status) {
        case 'Optimal':
        case 'Standard':
            return 'px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-bold rounded-full'
        case 'Surdosage':
            return 'px-3 py-1 bg-gradient-to-r from-red-100 to-orange-100 text-red-800 text-xs font-bold rounded-full'
        case 'Sous-dosage':
            return 'px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs font-bold rounded-full'
        default:
            return 'px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-xs font-bold rounded-full'
    }
}
</script>

