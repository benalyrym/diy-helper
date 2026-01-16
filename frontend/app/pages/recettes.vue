<template>
    <div class="p-8">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Recettes</h1>
            <NuxtLink
                to="/recette/create"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
                + Nouvelle recette
            </NuxtLink>
        </div>

        <div v-if="loading" class="flex justify-center items-center h-48">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-800">{{ error }}</p>
        </div>

        <div v-else-if="recipes.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="mt-4">Aucune recette pour le moment</p>
            <NuxtLink
                to="/recette/create"
                class="inline-block mt-4 text-blue-600 hover:text-blue-800"
            >
                Créer votre première recette
            </NuxtLink>
        </div>

        <ul v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <li
                v-for="r in recipes"
                :key="r.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
                <NuxtLink :to="`/recette/${r.id}`" class="block">
                    <h3 class="font-semibold text-lg mb-2">{{ r.name }}</h3>
                    <p v-if="r.description" class="text-gray-600 text-sm line-clamp-2">{{ r.description }}</p>

                    <!-- Métadonnées -->
                    <div class="flex items-center mt-4 text-sm text-gray-500">
                        <span v-if="r.prepTime" class="mr-3">
                            ⏱️ {{ r.prepTime }} min
                        </span>
                        <span v-if="r.servings" class="mr-3">
                            👥 {{ r.servings }} pers.
                        </span>
                    </div>
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'

const recipes = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const { listRecipes } = useApi()

onMounted(async () => {
    try {
        loading.value = true
        recipes.value = await listRecipes()
    } catch (err: any) {
        console.error('Erreur:', err)
        error.value = err.message || 'Impossible de charger les recettes'
    } finally {
        loading.value = false
    }
})
</script>