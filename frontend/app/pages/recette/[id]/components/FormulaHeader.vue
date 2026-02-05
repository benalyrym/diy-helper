<template>
    <header class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
        <div class="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <!-- Titre et description -->
            <div class="flex-1">
                <div class="flex items-start gap-4 mb-4">
                    <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                        <span class="text-2xl text-white">🧴</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-start justify-between">
                            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{{ formula.name }}</h1>
                            <!-- Badge pour recette simple -->
                            <div v-if="formula.isSimpleRecipe"
                                 class="ml-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full">
                                Recette simple
                            </div>
                        </div>

                        <p v-if="formula.description" class="text-lg text-gray-600 mb-4 whitespace-pre-line">
                            {{ formula.description }}
                        </p>

                        <!-- Tags -->
                        <div class="flex flex-wrap gap-2">
                            <span class="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                                Type: {{ formula.type || 'skincare' }}
                            </span>
                            <span class="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                                Peau: {{ formula.skinType }}
                            </span>
                            <span class="px-3 py-1 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                                {{ formula.volume }} ml
                            </span>
                            <span v-if="formula.compliance?.version" class="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                                v{{ formula.compliance.version }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Indicateur de volume -->
            <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 shadow-sm">
                <div class="text-center">
                    <div class="text-4xl font-bold text-blue-700 mb-1">{{ formula.volume }}</div>
                    <div class="text-lg text-blue-600 font-medium mb-2">ml</div>
                    <div class="text-sm text-gray-600">
                        {{ calculateTotalGrams() }} g total
                    </div>
                </div>
            </div>
        </div>

        <!-- Métadonnées en grille -->
        <!-- Section métadonnées améliorée -->
        <div class="mt-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Type de peau -->
                <div class="group relative">
                    <div class="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div class="relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm">
                                <span class="text-white text-lg">👤</span>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Type de peau</h3>
                                <p class="text-xs text-gray-500">Cible principale</p>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-700 mb-1">{{ formula.skinType }}</div>
                            <p class="text-xs text-gray-600 leading-tight">{{ getSkinTypeDescription(formula.skinType) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Huiles essentielles -->
                <div class="group relative">
                    <div :class="[
                    'absolute inset-0 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500',
                    heTotal > 1 ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10' :
                    heTotal > 0.8 ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10' :
                    'bg-gradient-to-r from-emerald-500/10 to-green-500/10'
                ]"></div>
                    <div class="relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1"
                         :class="heTotal > 1 ? 'border-red-200' : heTotal > 0.8 ? 'border-amber-200' : 'border-emerald-200'">
                        <div class="flex items-center gap-3 mb-4">
                            <div :class="[
                            'p-2.5 rounded-xl shadow-sm',
                            heTotal > 1 ? 'bg-gradient-to-br from-red-500 to-red-600' :
                            heTotal > 0.8 ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                            'bg-gradient-to-br from-emerald-500 to-emerald-600'
                        ]">
                                <span class="text-white text-lg">🌿</span>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Huiles essentielles</h3>
                                <p class="text-xs text-gray-500">Total réglementaire</p>
                            </div>
                        </div>
                        <div class="text-center">
                            <div :class="[
                            'text-2xl font-bold mb-1',
                            heTotal > 1 ? 'text-red-700' :
                            heTotal > 0.8 ? 'text-amber-700' :
                            'text-emerald-700'
                        ]">
                                {{ heTotal.toFixed(2) }}%
                            </div>
                            <p class="text-xs text-gray-600">
                                {{ essentialOils.length }} HE • {{ calculateGrams(heTotal) }} g
                                <span v-if="heTotal > 1" class="block text-red-600 font-medium mt-1">⚠️ Limite dépassée</span>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Actifs cosmétiques -->
                <div class="group relative">
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div class="relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                                <span class="text-white text-lg">✨</span>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Actifs cosmétiques</h3>
                                <p class="text-xs text-gray-500">Ingrédients actifs</p>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-700 mb-1">{{ actives.length }}</div>
                            <p class="text-xs text-gray-600">
                                {{ getActiveTotalPercentage().toFixed(1) }}% du total
                                <span class="block text-blue-600 font-medium mt-1">
                                {{ calculateGrams(getActiveTotalPercentage()) }} g
                            </span>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Conformité UE -->
                <div class="group relative">
                    <div :class="[
                    'absolute inset-0 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500',
                    isFormulaValid ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10' :
                    'bg-gradient-to-r from-red-500/10 to-orange-500/10'
                ]"></div>
                    <div class="relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1"
                         :class="isFormulaValid ? 'border-emerald-200' : 'border-red-200'">
                        <div class="flex items-center gap-3 mb-4">
                            <div :class="[
                            'p-2.5 rounded-xl shadow-sm',
                            isFormulaValid ? 'bg-gradient-to-br from-emerald-500 to-green-600' :
                            'bg-gradient-to-br from-red-500 to-orange-600'
                        ]">
                                <span class="text-white text-lg">🏛️</span>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Conformité UE</h3>
                                <p class="text-xs text-gray-500">Règlement 1223/2009</p>
                            </div>
                        </div>
                        <div class="text-center">
                            <div :class="[
                            'text-2xl font-bold mb-1',
                            isFormulaValid ? 'text-emerald-700' : 'text-red-700'
                        ]">
                                {{ isFormulaValid ? 'Conforme' : 'Non conforme' }}
                            </div>
                            <p class="text-xs text-gray-600">
                                {{ formula.isSimpleRecipe ? 'Recette indicative' : 'Analyse complète' }}
                                <span v-if="!isFormulaValid" class="block text-red-600 font-medium mt-1">
                                {{ regulatoryErrors.length }} erreur{{ regulatoryErrors.length > 1 ? 's' : '' }}
                            </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Message pour recette simple -->
        <div v-if="formula.isSimpleRecipe" class="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
            <div class="flex items-start gap-3">
                <span class="text-blue-600 text-xl">💡</span>
                <div>
                    <p class="font-medium text-blue-800">Recette simple</p>
                    <p class="text-sm text-blue-700">
                        Cette recette utilise des valeurs par défaut. Pour une analyse précise, veuillez
                        <NuxtLink :to="`/recette/${formula.id}/edit`" class="font-bold underline hover:text-blue-900">
                            compléter les pourcentages
                        </NuxtLink>
                        ou
                        <button @click="convertToFullFormula" class="font-bold underline hover:text-blue-900">
                            convertir en formule complète
                        </button>.
                    </p>
                </div>
            </div>
        </div>
    </header>
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
    regulatoryErrors: {
        type: Array,
        default: () => []
    }
})

const calculateGrams = (percent) => {
    const volume = props.formula?.volume || 50
    return ((volume * percent) / 100).toFixed(2)
}

const calculateTotalGrams = () => {
    const volume = props.formula?.volume || 50
    return volume.toFixed(2)
}

const getActiveTotalPercentage = () => {
    return props.actives.reduce((total, active) => total + (active.quantity || 0), 0)
}

const getSkinTypeDescription = (skinType) => {
    const skinTypes = {
        'seche': 'Peau déshydratée, besoin en nutrition élevé',
        'grasse': 'Sécrétion sébacée importante, pores dilatés',
        'sensible': 'Réactivité cutanée élevée, tolérance limitée',
        'mixte': 'Combinaison de zones sèches et grasses',
        'mature': 'Besoins anti-âge et restructuration'
    }
    return skinTypes[skinType] || 'Non spécifié'
}

const convertToFullFormula = () => {
    // Logique pour convertir la recette en formule complète
    console.log('Conversion vers formule complète')
    // Vous pourriez rediriger vers une page d'édition pré-remplie
}
</script>

<style scoped>
/* Animations supplémentaires */
.group:hover .group-hover\:-translate-y-1 {
    transform: translateY(-4px);
}

.group:hover .group-hover\:blur-2xl {
    filter: blur(40px);
    opacity: 0.8;
}

/* Effet de brillance sur hover */
.group:hover .relative::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: 0.5s;
}

.group:hover .relative::before {
    left: 100%;
}
</style>