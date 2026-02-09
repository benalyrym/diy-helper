<!-- pages/recette/[id]/convert.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
        <div class="max-w-4xl mx-auto">
            <div class="mb-8 text-sm text-gray-500">
                Conversion de recette
            </div>

            <!-- En-tête -->
            <div class="bg-white rounded-2xl shadow-xl p-6 mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    Convertir "{{ formula.name }}" en formule complète
                </h1>
                <p class="text-gray-600">
                    Complétez les pourcentages manquants pour obtenir une analyse réglementaire précise.
                </p>
            </div>

            <!-- Formulaire de conversion -->
            <div class="bg-white rounded-2xl shadow-xl p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-6">Ingrédients à compléter</h2>

                <div class="space-y-6">
                    <div v-for="(ingredient, index) in incompleteIngredients"
                         :key="index"
                         class="border border-gray-200 rounded-xl p-4">
                        <div class="flex items-center justify-between mb-3">
                            <div>
                                <h3 class="font-bold text-gray-900">{{ ingredient.name }}</h3>
                                <p class="text-sm text-gray-500">{{ getIngredientType(ingredient) }}</p>
                            </div>
                            <div class="text-sm text-gray-500">
                                Quantité actuelle: {{ ingredient.quantity || 'Non définie' }}
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Suggestions -->
                            <div>
                                <p class="text-sm font-medium text-gray-700 mb-2">Suggestions :</p>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="suggestion in getSuggestions(ingredient)"
                                            :key="suggestion"
                                            @click="updateIngredient(index, suggestion)"
                                            class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
                                        {{ suggestion }}%
                                    </button>
                                </div>
                            </div>

                            <!-- Saisie manuelle -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Pourcentage (%) :
                                </label>
                                <div class="flex items-center gap-2">
                                    <input type="number"
                                           v-model="ingredient.newQuantity"
                                           step="0.1"
                                           min="0"
                                           max="100"
                                           class="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                                           placeholder="0.0">
                                    <span class="text-gray-500">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                    <button @click="cancel"
                            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        Annuler
                    </button>
                    <button @click="saveAsDraft"
                            class="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800">
                        Enregistrer comme brouillon
                    </button>
                    <button @click="convertAndAnalyze"
                            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800">
                        Convertir et analyser
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const formula = ref(null)
const loading = ref(true)
const { $api } = useNuxtApp()

onMounted(async () => {
    await loadFormula()
})

const loadFormula = async () => {
    const id = route.params.id
    const response = await $api(`/api/recipes/${id}`)
    formula.value = await response.json()

    // Préparer les ingrédients pour l'édition
    if (formula.value.ingredients) {
        formula.value.ingredients = formula.value.ingredients.map(ing => ({
            ...ing,
            newQuantity: ing.quantity
        }))
    }

    loading.value = false
}

const incompleteIngredients = computed(() => {
    return formula.value?.ingredients?.filter(ing => ing.quantity === null) || []
})

const determineIngredientType = (name) => {
    const lowerName = name.toLowerCase()

    if (lowerName.includes('he ') || lowerName.includes('huile essentielle')) return 'essential_oil'
    if (
        lowerName.includes('btms') ||
        lowerName.includes('behentrimonium') ||
        lowerName.includes('cetyl alcohol') ||
        lowerName.includes('quaternium') ||
        lowerName.includes('polyquat')
    ) {
        return 'conditioning_agent'
    }
    if (
        lowerName.includes('xanthane') ||
        lowerName.includes('guar') ||
        lowerName.includes('carbomer')
    ) {
        return 'thickener'
    }
    if (
        lowerName.includes('vitamine') ||
        lowerName.includes('acide') ||
        lowerName.includes('panthénol') ||
        lowerName.includes('panthenol') ||
        lowerName.includes('niacinamide') ||
        lowerName.includes('kératine') ||
        lowerName.includes('keratine') ||
        lowerName.includes('protéine') ||
        lowerName.includes('proteine')
    ) {
        return 'active'
    }
    if (lowerName.includes('cosgard') || lowerName.includes('conservateur')) return 'preservative'
    if (lowerName.includes('eau') || lowerName.includes('hydrolat') || lowerName.includes('hamamélis')) return 'water'
    if (lowerName.includes('huile') || lowerName.includes('beurre')) return 'oil'
    if (lowerName.includes('émulsifiant')) return 'emulsifier'
    return 'other'
}

const getIngredientType = (ingredient) => {
    const type = ingredient.type || determineIngredientType(ingredient.name)

    switch (type) {
        case 'essential_oil':
            return 'Huile essentielle'
        case 'conditioning_agent':
            return 'Agent démêlant'
        case 'thickener':
            return 'Épaississant'
        case 'active':
            return 'Actif capillaire'
        case 'preservative':
            return 'Conservateur'
        case 'water':
            return 'Phase aqueuse'
        case 'oil':
            return 'Huile végétale'
        case 'emulsifier':
            return 'Émulsifiant'
        default:
            return 'Autre'
    }
}

const getSuggestions = (ingredient) => {
    const type = ingredient.type || determineIngredientType(ingredient.name)
    switch(type) {
        case 'essential_oil': return [0.1, 0.3, 0.5, 1.0]
        case 'active': return [0.5, 1.0, 2.0, 5.0]
        case 'conditioning_agent': return [1.0, 2.0, 3.0, 5.0]
        case 'thickener': return [0.2, 0.5, 1.0, 1.5]
        case 'preservative': return [0.5, 0.8, 1.0]
        case 'oil': return [5.0, 10.0, 15.0, 20.0]
        default: return [1.0, 2.0, 5.0]
    }
}

const updateIngredient = (index, quantity) => {
    if (formula.value.ingredients[index]) {
        formula.value.ingredients[index].newQuantity = quantity
    }
}

const cancel = () => {
    router.push(`/recette/${formula.value.id}`)
}

const saveAsDraft = async () => {
    // Enregistrer comme brouillon avec les nouvelles valeurs
    const updatedIngredients = formula.value.ingredients.map(ing => ({
        name: ing.name,
        quantity: ing.newQuantity,
        type: ing.type || determineIngredientType(ing.name)
    }))

    await  $api(`/api/recipes/${formula.value.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ingredients: updatedIngredients,
            status: 'draft'
        })
    })

    router.push(`/recette/${formula.value.id}`)
}

const convertToFullFormula = async () => {
    // Convertir en formule complète
    const updatedIngredients = formula.value.ingredients.map(ing => ({
        name: ing.name,
        quantity: ing.newQuantity,
        type: ing.type || determineIngredientType(ing.name)
    }))

    await  $api(`/api/recipes/${formula.value.id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'skincare',
            ingredients: updatedIngredients,
            compliance: {
                version: '2.2',
                analyzed: true
            }
        })
    })

    router.push(`/recette/${formula.value.id}`)
}
</script>



