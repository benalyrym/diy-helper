<template>
    <div class=" mx-auto p-4 md:p-8">
        <!-- En-tête -->
        <div class="mb-8">
            <NuxtLink
                to="/recettes"
                class="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
                </svg>
                Retour aux recettes
            </NuxtLink>
            <h1 class="text-3xl font-bold text-gray-900">Créer une recette</h1>
            <p class="text-gray-600 mt-2">Ajoutez une nouvelle recette à votre collection</p>
        </div>

        <!-- Formulaire -->
        <RecipeForm @save="handleSave" @cancel="handleCancel" />

        <!-- États -->
        <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <div class="flex items-center space-x-3">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span>Création en cours...</span>
                </div>
            </div>
        </div>

        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <span class="text-red-800">{{ error }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RecipeForm from '../../components/RecipeForm.vue'
import { useApi } from '../../composables/useApi'

const router = useRouter()
const { createRecipe } = useApi()

const loading = ref(false)
const error = ref('')
const handleSave = async (recipeData: any) => {
    try {
        loading.value = true
        error.value = ''

        console.log('Données envoyées:', recipeData)
        const newRecipe = await createRecipe(recipeData)
        console.log('Recette créée:', newRecipe)

        // Vérifie que newRecipe a bien un id
        if (!newRecipe.id) {
            throw new Error('La recette créée n\'a pas d\'ID')
        }

        await router.push(`/recette/${newRecipe.id}`)

    } catch (err: any) {
        console.error('Erreur complète:', err)
        error.value = err.message || 'Erreur lors de la création'
    } finally {
        loading.value = false
    }
}

const handleCancel = () => {
    router.push('/recettes')
}
</script>