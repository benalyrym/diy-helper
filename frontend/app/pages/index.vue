<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- Header amélioré -->
    <header class="bg-white shadow-lg sticky top-0 z-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-3">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
              </svg>
            </div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              DIY Recipe Helper
            </h1>
          </div>
          <button
              @click="handleLogout"
              aria-label="Se déconnecter de l'application"
              class="group relative px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
                        <span class="flex items-center space-x-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                            <span>Déconnexion</span>
                        </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Hero section améliorée -->
      <section class="text-center mb-16" aria-labelledby="hero-title">
        <div class="max-w-3xl mx-auto">
          <div class="inline-block p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-6">
            <div class="text-sm font-semibold text-blue-700 px-4 py-2 bg-white rounded-xl">
              🎉 Bienvenue dans votre espace personnel
            </div>
          </div>

          <h1 id="hero-title" class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transformez vos idées en
            <span class="relative">
                            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                délicieuses recettes
                            </span>
                            <span class="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full"></span>
                        </span>
          </h1>

          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Votre assistant culinaire intelligent pour créer, organiser et partager
            vos recettes favorites. Simplifiez votre cuisine au quotidien.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
                to="/recette/create"
                aria-label="Créer une nouvelle recette"
                class="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span>Créer une recette</span>
              <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </NuxtLink>

            <NuxtLink
                to="/recettes"
                aria-label="Voir toutes mes recettes"
                class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Explorer mes recettes
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Section statistiques -->
      <section class="mb-16" aria-label="Statistiques de votre collection">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">Recettes totales</p>
                <p class="text-3xl font-bold text-gray-900">{{ totalRecipes }}</p>
              </div>
              <div class="bg-blue-100 p-3 rounded-xl">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-lg border border-green-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">Temps moyen</p>
                <p class="text-3xl font-bold text-gray-900">{{ averageTime }} min</p>
              </div>
              <div class="bg-green-100 p-3 rounded-xl">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 mb-1">Recettes cette semaine</p>
                <p class="text-3xl font-bold text-gray-900">{{ weeklyRecipes }}</p>
              </div>
              <div class="bg-purple-100 p-3 rounded-xl">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Cards d'actions améliorées -->
      <section class="mb-16" aria-labelledby="actions-title">
        <h2 id="actions-title" class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Que souhaitez-vous faire aujourd'hui ?
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
              to="/recette/create"
              aria-label="Créer une nouvelle recette"
              class="group bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-100 hover:border-blue-300 hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div class="mb-6">
              <div class="bg-gradient-to-r from-blue-100 to-blue-200 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Créer une recette</h3>
              <p class="text-gray-600 leading-relaxed">
                Ajoutez une nouvelle recette à votre collection personnelle avec notre éditeur intuitif
              </p>
            </div>
            <span class="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-800">
                            Commencer
                            <svg class="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                            </svg>
                        </span>
          </NuxtLink>

          <NuxtLink
              to="/recettes"
              aria-label="Voir toutes mes recettes"
              class="group bg-gradient-to-br from-white to-green-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-green-100 hover:border-green-300 hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <div class="mb-6">
              <div class="bg-gradient-to-r from-green-100 to-green-200 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Mes recettes</h3>
              <p class="text-gray-600 leading-relaxed">
                Consultez, modifiez et gérez toutes vos recettes enregistrées dans votre collection
              </p>
            </div>
            <span class="inline-flex items-center text-green-600 font-semibold group-hover:text-green-800">
                            Voir toutes
                            <svg class="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                            </svg>
                        </span>
          </NuxtLink>

          <NuxtLink
              to="/tips"
              aria-label="Voir les astuces culinaires"
              class="group bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-purple-100 hover:border-purple-300 hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <div class="mb-6">
              <div class="bg-gradient-to-r from-purple-100 to-purple-200 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Astuces & Conseils</h3>
              <p class="text-gray-600 leading-relaxed">
                Découvrez nos conseils exclusifs pour des recettes parfaites et des techniques avancées
              </p>
            </div>
            <span class="inline-flex items-center text-purple-600 font-semibold group-hover:text-purple-800">
                            Explorer
                            <svg class="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                            </svg>
                        </span>
          </NuxtLink>
        </div>
      </section>

      <!-- Section recettes récentes améliorée -->
      <section class="mb-16" aria-labelledby="recent-recipes-title">
        <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div class="px-8 py-6 border-b border-gray-100">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 id="recent-recipes-title" class="text-2xl font-bold text-gray-900">
                  Vos recettes récentes
                </h2>
                <p class="text-gray-600 mt-1">
                  Dernières créations et modifications
                </p>
              </div>
              <NuxtLink
                  to="/recettes"
                  aria-label="Voir toutes les recettes"
                  class="group inline-flex items-center px-5 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                <span>Toutes les recettes</span>
                <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </NuxtLink>
            </div>
          </div>

          <div class="p-8">
            <div v-if="recentRecipes.length === 0" class="text-center py-12">
              <div class="inline-block p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-6">
                <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                Votre collection est vide
              </h3>
              <p class="text-gray-600 mb-8 max-w-md mx-auto">
                Commencez par créer votre première recette et transformez vos idées en délicieuses créations
              </p>
              <NuxtLink
                  to="/recette/create"
                  aria-label="Créer votre première recette"
                  class="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Créer votre première recette
              </NuxtLink>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <article
                  v-for="recipe in recentRecipes"
                  :key="recipe.id"
                  class="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
              >
                <NuxtLink
                    :to="`/recette/${recipe.id}`"
                    :aria-label="`Voir la recette ${recipe.name}`"
                    class="block p-6"
                >
                  <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-700 line-clamp-2">
                      {{ recipe.name }}
                    </h3>
                    <span class="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                                            Nouveau
                                        </span>
                  </div>

                  <p v-if="recipe.description" class="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {{ recipe.description }}
                  </p>

                  <div class="flex flex-wrap gap-4 text-sm">
                    <div v-if="recipe.prepTime" class="flex items-center text-gray-700">
                      <div class="bg-blue-100 p-2 rounded-lg mr-2">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <span>{{ recipe.prepTime }} min</span>
                    </div>

                    <div v-if="recipe.servings" class="flex items-center text-gray-700">
                      <div class="bg-green-100 p-2 rounded-lg mr-2">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                      </div>
                      <span>{{ recipe.servings }} pers.</span>
                    </div>

                    <div v-if="recipe.difficulty" class="flex items-center text-gray-700">
                      <div class="bg-yellow-100 p-2 rounded-lg mr-2">
                        <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                        </svg>
                      </div>
                      <span>{{ recipe.difficulty }}</span>
                    </div>
                  </div>

                  <div class="mt-6 flex items-center justify-between">
                                        <span class="text-blue-600 font-medium group-hover:text-blue-800">
                                            Voir la recette
                                            <svg class="w-4 h-4 inline ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </span>
                    <span class="text-xs text-gray-500">
                                            {{ formatDate(recipe.createdAt) }}
                                        </span>
                  </div>
                </NuxtLink>
              </article>
            </div>
          </div>
        </div>
      </section>

      <!-- Section inspiration -->
      <section class="text-center" aria-labelledby="inspiration-title">
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
          <h2 id="inspiration-title" class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Besoin d'inspiration ?
          </h2>
          <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez nos collections thématiques et nos recettes du moment pour stimuler votre créativité culinaire
          </p>
          <NuxtLink
              to="/explore"
              aria-label="Explorer les recettes tendances"
              class="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Explorer les tendances
          </NuxtLink>
        </div>
      </section>
    </main>

    <!-- Footer amélioré -->
    <footer class="bg-gray-900 text-white mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-6 md:mb-0">
            <div class="flex items-center space-x-3">
              <div class="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                </svg>
              </div>
              <span class="text-xl font-bold">DIY Recipe Helper</span>
            </div>
            <p class="text-gray-400 mt-2 text-sm">
              Votre compagnon culinaire depuis 2024
            </p>
          </div>
          <div class="text-center md:text-right">
            <p class="text-gray-400 text-sm">
              © 2024 DIY Recipe Helper. Tous droits réservés.
            </p>
            <p class="text-gray-400 text-sm mt-1">
              Fait avec ❤️ pour les passionnés de cuisine
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useApi } from '../composables/useApi'
import { useRouter } from "vue-router"

const router = useRouter()
const { logout, isAuthenticated } = useAuth()
const { listRecipes } = useApi()

const recentRecipes = ref<any[]>([])
const totalRecipes = ref(0)
const averageTime = ref(0)
const weeklyRecipes = ref(0)

// Rediriger si non authentifié
onMounted(async () => {
  if (!isAuthenticated.value) {
    await router.push('/auth/login')
    return
  }

  // Charger les recettes
  try {
    const recipes = await listRecipes()
    recentRecipes.value = recipes.slice(0, 6) // Augmenté à 6 recettes

    // Calculer les statistiques
    totalRecipes.value = recipes.length

    if (recipes.length > 0) {
      const totalTime = recipes.reduce((sum: number, recipe: any) => {
        return sum + (recipe.prepTime || 0)
      }, 0)
      averageTime.value = Math.round(totalTime / recipes.length)

      // Simuler des recettes de la semaine (pour l'exemple)
      weeklyRecipes.value = Math.min(recipes.length, 5)
    }
  } catch (error) {
    console.error('Erreur chargement recettes:', error)
  }
})

const handleLogout = () => {
  logout()
  router.push('/auth/login')
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long'
  })
}
</script>

<style scoped>
/* Styles d'accessibilité améliorés */
:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Animation de fade-in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Amélioration des contrastes pour l'accessibilité */
.text-gray-900 {
  color: #111827;
}

.text-gray-700 {
  color: #374151;
}

.text-gray-600 {
  color: #4b5563;
}

/* Support du mode sombre */
@media (prefers-color-scheme: dark) {
  .dark\:bg-gray-900 {
    background-color: #111827;
  }

  .dark\:text-white {
    color: #ffffff;
  }
}
</style>