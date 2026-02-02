<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header avec logout -->
        <header class="bg-white shadow">
            <div class="mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <h1 class="text-xl font-semibold text-gray-900">DIY Recipe Helper</h1>
                    <button
                        @click="logout"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Déconnexion
                    </button>
                </div>
            </div>
        </header>

        <!-- Contenu principal -->
        <main class=" mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- Hero section -->
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-gray-900 mb-4">
                    Bienvenue dans votre assistant de recettes
                </h2>
                <p class="text-xl text-gray-600 mx-auto">
                    Créez, organisez et partagez vos recettes favorites.
                    Simplifiez votre cuisine au quotidien.
                </p>
            </div>

            <!-- Cards d'actions -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Créer une recette</h3>
                    <p class="text-gray-600 mb-4">Ajoutez une nouvelle recette à votre collection personnelle</p>
                    <NuxtLink
                        to="/recette/create"
                        class="inline-block text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Commencer →
                    </NuxtLink>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Mes recettes</h3>
                    <p class="text-gray-600 mb-4">Consultez et gérez toutes vos recettes enregistrées</p>
                    <NuxtLink
                        to="/recettes"
                        class="inline-block text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Voir toutes →
                    </NuxtLink>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold mb-2">Astuces</h3>
                    <p class="text-gray-600 mb-4">Découvrez nos conseils pour des recettes réussies</p>
                    <NuxtLink
                        to="/tips"
                        class="inline-block text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Explorer →
                    </NuxtLink>
                </div>
            </div>

            <!-- Section recettes récentes -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-gray-900">Recettes récentes</h3>
                    <NuxtLink
                        to="/recettes"
                        class="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Voir plus
                    </NuxtLink>
                </div>

                <div v-if="recentRecipes.length === 0" class="text-center py-8">
                    <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p class="mt-4 text-gray-500">Vous n'avez pas encore de recettes</p>
                    <NuxtLink
                        to="/recette/create"
                        class="mt-2 inline-block text-blue-600 hover:text-blue-800"
                    >
                        Créer votre première recette
                    </NuxtLink>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        v-for="recipe in recentRecipes"
                        :key="recipe.id"
                        class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                        <NuxtLink :to="`/recette/${recipe.id}`">
                            <h4 class="font-semibold text-lg mb-2">{{ recipe.name }}</h4>
                            <p v-if="recipe.description" class="text-gray-600 text-sm line-clamp-2 mb-3">
                                {{ recipe.description }}
                            </p>
                            <div class="flex items-center text-sm text-gray-500">
                                <span v-if="recipe.prepTime" class="mr-3">
                                    ⏱️ {{ recipe.prepTime }} min
                                </span>
                                <span v-if="recipe.servings" class="mr-3">
                                    👥 {{ recipe.servings }} pers.
                                </span>
                            </div>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useApi } from '../composables/useApi'
import {useRouter} from "vue-router";

const router = useRouter()
const { logout, isAuthenticated } = useAuth()
const { listRecipes } = useApi()

const recentRecipes = ref<any[]>([])

// Rediriger si non authentifié
onMounted(async () => {
    if (!isAuthenticated.value) {
        await router.push('/auth/login')
        return
    }

    // Charger les recettes récentes
    try {
        const recipes = await listRecipes()
        // Prendre les 3 premières recettes
        recentRecipes.value = recipes.slice(0, 3)
    } catch (error) {
        console.error('Erreur chargement recettes:', error)
    }
})

const handleLogout = () => {
    logout()
    router.push('/auth/login')
}
</script>