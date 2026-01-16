<template>
    <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="max-w-4xl mx-auto p-8">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 class="text-xl font-semibold text-red-800 mb-2">Erreur</h2>
            <p class="text-red-700">{{ error }}</p>
            <NuxtLink
                to="/recettes"
                class="inline-block mt-4 text-blue-600 hover:text-blue-800"
            >
                ← Retour aux recettes
            </NuxtLink>
        </div>
    </div>

    <div v-else-if="recipe" class="max-w-4xl mx-auto p-4 md:p-8">
        <!-- Navigation -->
        <div class="mb-6">
            <NuxtLink
                to="/recettes"
                class="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
                ← Toutes les recettes
            </NuxtLink>
        </div>

        <!-- En-tête -->
        <div class="mb-8">
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ recipe.name }}</h1>
                    <p v-if="recipe.description" class="text-gray-600 text-lg">{{ recipe.description }}</p>
                </div>
                <div class="flex space-x-2">
                    <NuxtLink
                        :to="`/recette/${recipe.id}/edit`"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Modifier
                    </NuxtLink>
                </div>
            </div>

            <!-- Métadonnées -->
            <div class="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                <div v-if="recipe.prepTime" class="flex items-center">
                    ⏱️ {{ recipe.prepTime }} min
                </div>
                <div v-if="recipe.cookTime" class="flex items-center">
                    🔥 {{ recipe.cookTime }} min cuisson
                </div>
                <div v-if="recipe.servings" class="flex items-center">
                    👥 {{ recipe.servings }} personnes
                </div>
                <div v-if="recipe.difficulty" class="flex items-center">
                    <span :class="{
                        'bg-green-100 text-green-800 px-2 py-1 rounded': recipe.difficulty === 'easy',
                        'bg-yellow-100 text-yellow-800 px-2 py-1 rounded': recipe.difficulty === 'medium',
                        'bg-red-100 text-red-800 px-2 py-1 rounded': recipe.difficulty === 'hard'
                    }">
                        {{
                            recipe.difficulty === 'easy' ? 'Facile' :
                                recipe.difficulty === 'medium' ? 'Moyen' : 'Difficile'
                        }}
                    </span>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Ingrédients -->
            <div class="lg:col-span-1">
                <div class="bg-gray-50 rounded-xl p-6">
                    <h2 class="text-xl font-bold mb-4">🧂 Ingrédients</h2>
                    <ul class="space-y-3">
                        <li
                            v-for="(ing, idx) in recipe.ingredients"
                            :key="idx"
                            class="flex items-center justify-between p-2 bg-white rounded-lg"
                        >
                            <span>{{ ing.name }}</span>
                            <span class="font-semibold text-gray-700">
                                {{ ing.quantity }} {{ ing.unit || '' }}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Étapes -->
            <div class="lg:col-span-2">
                <div class="bg-white border rounded-xl p-6">
                    <h2 class="text-xl font-bold mb-4">👩‍🍳 Préparation</h2>
                    <div v-if="recipe.steps && recipe.steps.length > 0" class="space-y-6">
                        <div
                            v-for="(step, idx) in recipe.steps"
                            :key="idx"
                            class="flex"
                        >
                            <div class="flex-shrink-0 mr-4">
                                <span class="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold">
                                    {{ idx + 1 }}
                                </span>
                            </div>
                            <div class="flex-1">
                                <p class="text-gray-800">{{ step }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-gray-500 italic">
                        Aucune étape de préparation renseignée.
                    </div>
                </div>

                <!-- Notes -->
                <div v-if="recipe.notes" class="mt-6 bg-yellow-50 border border-yellow-100 rounded-xl p-6">
                    <h3 class="font-bold mb-2">💡 Notes</h3>
                    <p class="text-gray-700">{{ recipe.notes }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '../../../composables/useApi'

const route = useRoute()
const { getRecipe } = useApi()

const recipe = ref<any>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
    try {
        const id = route.params.id
        recipe.value = await getRecipe(id)
    } catch (err: any) {
        console.error('Erreur:', err)
        error.value = err.message || 'Recette introuvable'
    } finally {
        loading.value = false
    }
})
</script>