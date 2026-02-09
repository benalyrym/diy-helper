<!-- pages/recette/edit/[id].vue -->
<template>
  <div class="min-h-screen mx-auto p-4 md:p-8">
    <div class="mb-8">
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
    </div>

    <!-- Formulaire via FormRenderer -->
    <div v-else-if="recipe && recipeType" class="bg-white rounded-lg shadow-md p-6">
      <FormRenderer
          :recipe-type="recipeType"
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
import { ref, onMounted, computed } from 'vue'
import { useApi, type Recipe } from '../../../composables/useApi'
import { useRoute, useRouter } from "vue-router"
import FormRenderer from "~/components/formulateur-cosmetique/FormRenderer.vue"

const route = useRoute()
const router = useRouter()
const { getRecipe, updateRecipe } = useApi()

const recipeId = route.params.id
const recipe = ref<Recipe | null>(null)
const loading = ref(true)
const saving = ref(false)
const loadError = ref('')
const saveError = ref('')

const normalizeText = (value: string) => {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const normalizeKey = (value: string) => {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

const getRecipeTypeValue = (recipeValue: any) => {
  const rawType = recipeValue?.type ||
    recipeValue?.subtype ||
    recipeValue?.recipeType?.subtype ||
    recipeValue?.recipeType?.type ||
    recipeValue?.formulaType ||
    ''
  if (rawType) {
    return normalizeKey(String(rawType))
  }
  const queryType = route.query.type ? String(route.query.type).toLowerCase() : ''
  const querySubtype = route.query.subtype ? String(route.query.subtype).toLowerCase() : ''
  return normalizeKey(queryType || querySubtype)
}

const extractQuantityFromDescription = (description: string, ingredientName: string) => {
  if (!description) return null
  const lines = description.split('\n')
  for (const line of lines) {
    if (line.includes(ingredientName)) {
      const percentMatch = line.match(/(\d+\.?\d*)%/i)
      if (percentMatch) return parseFloat(percentMatch[1])
    }
  }
  return null
}

const determineIngredientType = (name: string) => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('he ') || lowerName.includes('huile essentielle')) return 'essential_oil'
  if (
    lowerName.includes('btms') ||
    lowerName.includes('behentrimonium') ||
    lowerName.includes('cetyl alcohol') ||
    lowerName.includes('quaternium') ||
    lowerName.includes('polyquat')
  ) return 'conditioning_agent'
  if (
    lowerName.includes('xanthane') ||
    lowerName.includes('guar') ||
    lowerName.includes('carbomer')
  ) return 'thickener'
  if (
    lowerName.includes('vitamine') ||
    lowerName.includes('acide') ||
    lowerName.includes('panthenol') ||
    lowerName.includes('niacinamide') ||
    lowerName.includes('keratine') ||
    lowerName.includes('proteine')
  ) return 'active'
  if (lowerName.includes('cosgard') || lowerName.includes('conservateur')) return 'preservative'
  if (lowerName.includes('eau') || lowerName.includes('hydrolat')) return 'aqueous'
  if (lowerName.includes('huile') || lowerName.includes('beurre')) return 'oil'
  if (lowerName.includes('emulsifiant')) return 'emulsifier'
  return 'other'
}

const getDefaultQuantity = (type: string) => {
  switch (type) {
    case 'active':
      return 1.0
    case 'essential_oil':
      return 0.3
    case 'preservative':
      return 0.8
    case 'oil':
      return 5.0
    case 'aqueous':
      return 70.0
    case 'emulsifier':
      return 5.0
    case 'conditioning_agent':
      return 3.0
    case 'thickener':
      return 1.0
    default:
      return 1.0
  }
}

const extractInfoFromDescription = (description: string) => {
  const result = { volume: 50, skinType: 'mixte', hairType: 'normaux' }
  if (!description) return result
  const volumeMatch = description.match(/(\d+)ml/i)
  if (volumeMatch) {
    result.volume = parseInt(volumeMatch[1])
  }
  const skinTypes = ['seche', 'grasse', 'sensible', 'mixte', 'mature']
  for (const skinType of skinTypes) {
    if (description.toLowerCase().includes(`peau ${skinType}`)) {
      result.skinType = skinType
      break
    }
  }
  const hairTypes = ['fins', 'normaux', 'secs', 'gras', 'colores']
  for (const hairType of hairTypes) {
    if (description.toLowerCase().includes(`cheveux ${hairType}`)) {
      result.hairType = hairType
      break
    }
  }
  return result
}

const normalizeRecipeForEdit = (apiData: any) => {
  if (!apiData) return apiData
  const info = extractInfoFromDescription(apiData.description || '')
  const transformedIngredients = Array.isArray(apiData.ingredients)
    ? apiData.ingredients.map((ing: any) => {
        const type = ing.type || determineIngredientType(ing.name || '')
        let quantity = ing.quantity
        if (quantity == null && apiData.description) {
          quantity = extractQuantityFromDescription(apiData.description, ing.name || '')
        }
        if (quantity == null) {
          quantity = getDefaultQuantity(type)
        }
        return {
          ...ing,
          type,
          quantity
        }
      })
    : []

  return {
    ...apiData,
    volume: apiData.volume ?? info.volume,
    skinType: apiData.skinType ?? info.skinType,
    hairType: apiData.hairType ?? info.hairType,
    ingredients: transformedIngredients
  }
}

// Déterminer recipeType à partir des données de la recette
const recipeType = computed(() => {
  if (!recipe.value) return null

  const typeMap: Record<string, { subtype: string, mainCategory: string }> = {
    hair_conditioner: { subtype: 'conditioner', mainCategory: 'haircare' },
    conditioner: { subtype: 'conditioner', mainCategory: 'haircare' },
    apres_shampoing: { subtype: 'conditioner', mainCategory: 'haircare' },
    apres_shampooing: { subtype: 'conditioner', mainCategory: 'haircare' },
    after_shampoo: { subtype: 'conditioner', mainCategory: 'haircare' },
    shampoo: { subtype: 'shampoo', mainCategory: 'haircare' },
    hair_shampoo: { subtype: 'shampoo', mainCategory: 'haircare' },
    face_cream: { subtype: 'face_cream', mainCategory: 'skincare' },
    skincare: { subtype: 'face_cream', mainCategory: 'skincare' },
    body_lotion: { subtype: 'body_lotion', mainCategory: 'bodycare' },
    body_butter: { subtype: 'body_butter', mainCategory: 'bodycare' },
    body_scrub: { subtype: 'body_scrub', mainCategory: 'bodycare' }
  }

  let recipeTypeValue = getRecipeTypeValue(recipe.value)
  if (
    recipeTypeValue.includes('apres_shampoing') ||
    recipeTypeValue.includes('apres_shampooing') ||
    recipeTypeValue.includes('after_shampoo') ||
    recipeTypeValue.includes('conditioner')
  ) {
    recipeTypeValue = 'conditioner'
  } else if (recipeTypeValue.includes('shampoing') || recipeTypeValue.includes('shampoo')) {
    recipeTypeValue = 'shampoo'
  }

  let subtype = typeMap[recipeTypeValue]?.subtype || 'custom'
  let mainCategory = typeMap[recipeTypeValue]?.mainCategory ||
    (recipe.value.category && recipe.value.category !== 'recipe' ? recipe.value.category : '') ||
    (recipeTypeValue === 'skincare' ? 'skincare' : '') ||
    (recipeTypeValue === 'haircare' ? 'haircare' : '') ||
    (recipeTypeValue === 'bodycare' ? 'bodycare' : '') ||
    'other'

  // Déterminer la catégorie principale
  if (subtype === 'custom') {
    const desc = normalizeKey(recipe.value.description || '')
    const name = normalizeKey(recipe.value.name || '')
    if (
      desc.includes('apres_shampoing') ||
      name.includes('apres_shampoing') ||
      desc.includes('apres_shampooing') ||
      name.includes('apres_shampooing') ||
      desc.includes('after_shampoo') ||
      name.includes('after_shampoo') ||
      desc.includes('conditioner') ||
      name.includes('conditioner')
    ) {
      subtype = 'conditioner'
      mainCategory = 'haircare'
    } else if (desc.includes('shampoing') || name.includes('shampoing') || desc.includes('shampoo') || name.includes('shampoo')) {
      subtype = 'shampoo'
      mainCategory = 'haircare'
    } else if (desc.includes('creme') || name.includes('creme') || desc.includes('cream') || name.includes('cream')) {
      subtype = 'face_cream'
      mainCategory = 'skincare'
    }
  }

  if (subtype === 'custom' && mainCategory === 'haircare') {
    subtype = 'conditioner'
  } else if (subtype === 'custom' && mainCategory === 'skincare') {
    subtype = 'face_cream'
  }

  // Déterminer categoryName
  const categoryNames: Record<string, string> = {
    'skincare': 'Soin de la peau',
    'haircare': 'Soin des cheveux',
    'bodycare': 'Soin du corps',
    'cosmetic': 'Cosmétique',
    'household': 'Ménager',
    'other': 'Autre'
  }

  return {
    mainCategory,
    subtype,
    productName: recipe.value.name || 'Recette sans nom',
    categoryName: categoryNames[mainCategory] || 'Autre'
  }
})

onMounted(async () => {
  try {
    loading.value = true
    loadError.value = ''

    const id = Array.isArray(recipeId) ? recipeId[0] : recipeId
    if (!id) {
      loadError.value = 'ID de recette manquant'
      return
    }
    console.log('?? Chargement recette pour édition, ID:', id)

    const data = await getRecipe(id)
    const normalized = normalizeRecipeForEdit(data)
    console.log('? Données reçues pour édition:', normalized)
    console.log('?? Type détecté:', recipeType.value)

    recipe.value = normalized
  } catch (err: any) {
    console.error('?? Erreur chargement recette:', err)
    loadError.value = err.message || 'Impossible de charger la recette'
  } finally {
    loading.value = false
  }
})

const handleSave = async (updatedData: any) => {
  try {
    saving.value = true
    saveError.value = ''

    const id = Array.isArray(recipeId) ? recipeId[0] : recipeId
    if (!id) {
      loadError.value = 'ID de recette manquant'
      return
    }
    console.log('?? Mise à jour recette ID:', id)
    console.log('?? Données envoyées:', updatedData)

    // Combiner avec les données existantes
    const fullData = {
      ...recipe.value,
      ...updatedData,
      updatedAt: new Date().toISOString()
    }

    const updatedRecipe = await updateRecipe(id, fullData)
    const targetId = updatedRecipe?.id || updatedRecipe?._id || id

    // Redirection vers la page de détail
    await router.push(`/recette/${targetId}`)

  } catch (err: any) {
    console.error('?? Erreur mise à jour:', err)
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


