<template>
    <div class="max-w-4xl mx-auto p-4 md:p-8">
        <!-- Navigation -->
        <div class="mb-8">
            <NuxtLink
                :to="`/recette/${recipeId}`"
                class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
                </svg>
                Retour à la recette
            </NuxtLink>
            <h1 class="text-3xl font-bold text-gray-900">Modifier "{{ recipe?.name }}"</h1>
            <p class="text-gray-600 mt-2">Modifiez les informations de votre recette</p>
        </div>

        <!-- États de chargement -->
        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p class="mt-4 text-gray-600">Chargement de la recette...</p>
            </div>
        </div>

        <!-- Message d'erreur -->
        <div v-else-if="loadError" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 class="text-xl font-semibold text-red-800 mb-2">Erreur</h2>
            <p class="text-red-700">{{ loadError }}</p>
            <NuxtLink
                :to="`/recette/${recipeId}`"
                class="inline-block mt-4 text-blue-600 hover:text-blue-800"
            >
                ← Retour à la recette
            </NuxtLink>
        </div>

        <!-- Formulaire -->
        <div v-else-if="recipe" class="bg-white rounded-lg shadow-md p-6">
            <RecipeForm
                :initial-data="recipe"
                @save="handleSave"
                @cancel="handleCancel"
            />
        </div>

        <!-- État de sauvegarde -->
        <div v-if="saving" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <div class="flex items-center space-x-3">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span>Sauvegarde en cours...</span>
                </div>
            </div>
        </div>

        <!-- Message d'erreur de sauvegarde -->
        <div v-if="saveError" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <span class="text-red-800">{{ saveError }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi, type Recipe } from '../../../composables/useApi'
import RecipeForm from '../../../components/RecipeForm.vue'
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()
const { getRecipe, updateRecipe } = useApi()

const recipeId = route.params.id
const recipe = ref<Recipe | null>(null)
const loading = ref(true)
const saving = ref(false)
const loadError = ref('')
const saveError = ref('')

onMounted(async () => {
    try {
        loading.value = true
        loadError.value = ''

        const id = Array.isArray(recipeId) ? recipeId[0] : recipeId
        console.log('🔄 Chargement recette pour édition, ID:', id)

        const data = await getRecipe(id)
        console.log('✅ Données reçues pour édition:', data)

        recipe.value = data
    } catch (err: any) {
        console.error('💥 Erreur chargement recette:', err)
        loadError.value = err.message || 'Impossible de charger la recette'
    } finally {
        loading.value = false
    }
})

const handleSave = async (updatedData: Partial<Recipe>) => {
    try {
        saving.value = true
        saveError.value = ''

        const id = Array.isArray(recipeId) ? recipeId[0] : recipeId
        console.log('💾 Mise à jour recette ID:', id)
        console.log('📤 Données envoyées:', updatedData)

        await updateRecipe(id, updatedData)

        // Redirection vers la page de détail
        await router.push(`/recette/${id}`)

    } catch (err: any) {
        console.error('💥 Erreur mise à jour:', err)
        saveError.value = err.message || 'Erreur lors de la mise à jour'
    } finally {
        saving.value = false
    }
}

const handleCancel = () => {
    const id = Array.isArray(recipeId) ? recipeId[0] : recipeId
    router.push(`/recette/${id}`)
}
</script>