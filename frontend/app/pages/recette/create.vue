<template>
  <div class="mx-auto p-4 md:p-8">
    <!-- En-tête avec infos du type -->
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

      <!-- Affichage du type sélectionné -->
      <div v-if="recipeType" class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-white rounded-lg shadow-sm">
            <span class="text-2xl">{{ getCategoryIcon(recipeType.mainCategory) }}</span>
          </div>
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900">
              Créer une {{ recipeType.productName }}
            </h1>
            <div class="flex flex-wrap items-center gap-2 mt-2">
                            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {{ recipeType.categoryName }}
                            </span>
              <span v-if="recipeType.subtype !== 'custom'" class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                {{ recipeType.productName }}
                            </span>
              <span v-else class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                Personnalisé
                            </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <h1 class="text-3xl font-bold text-gray-900">Créer une recette</h1>
        <p class="text-gray-600 mt-2">Ajoutez une nouvelle recette à votre collection</p>
      </div>
    </div>

    <!-- Formulaire avec transmission du type -->
<!--    <formulateur-cosmetique
        :recipe-type="recipeType"
        @save="handleSave"
        @cancel="handleCancel"
    />-->
    <form-renderer
        :recipe-type="recipeType"
        @save="handleSave"
        @cancel="handleCancel"
    />

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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FormulateurCosmetique from '../../components/formulateur-cosmetique/FormulateurCosmetique.vue'
import { useApi } from '~/composables/useApi'
import FormRenderer from "~/components/formulateur-cosmetique/FormRenderer.vue";

const router = useRouter()
const { createRecipe, listRecipes } = useApi()

const loading = ref(false)
const error = ref('')
const recipeType = ref<any>(null)

onMounted(() => {
  const storedType = sessionStorage.getItem('selectedRecipeType')
  if (storedType) {
    recipeType.value = JSON.parse(storedType)
    console.log('Type de recette chargé:', recipeType.value)
  }
})

const getCategoryIcon = (categoryId: string) => {
  const icons: Record<string, string> = {
    'skincare': '🧴',
    'haircare': '💇',
    'bodycare': '🦵',
    'cosmetic': '💄',
    'household': '🏠',
    'other': '🧪'
  }
  return icons[categoryId] || '🧪'
}

const handleSave = async (recipeData: any) => {
  try {
    loading.value = true
    error.value = ''

    console.log('Données envoyées:', recipeData)
    const newRecipe = await createRecipe(recipeData)
    console.log('Recette créée:', newRecipe)

    // Nettoyer le sessionStorage après utilisation
    sessionStorage.removeItem('selectedRecipeType')

    let createdId = newRecipe?.id || newRecipe?._id
    if (!createdId) {
      const recipes = await listRecipes()
      const latest = recipes
        .filter(r => r?.id || r?._id)
        .sort((a, b) => {
          const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime()
          const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime()
          return bDate - aDate
        })[0]
      createdId = latest?.id || latest?._id
    }

    if (!createdId) {
      throw new Error('La recette créée n\'a pas d\'ID')
    }

    await router.push(`/recette/${createdId}`)

  } catch (err: any) {
    console.error('Erreur complète:', err)
    error.value = err.message || 'Erreur lors de la création'
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  sessionStorage.removeItem('selectedRecipeType')
  router.push('/recettes')
}
</script>
